'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { loadFromServer, syncedStorage } from '../lib/syncedStorage';

export default function AppStateGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [ready, setReady] = useState(syncedStorage.isReady());
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (syncedStorage.isReady()) {
      setReady(true);
      return;
    }
    let cancelled = false;
    loadFromServer().then((ok) => {
      if (cancelled) return;
      if (ok) {
        setReady(true);
        setFailed(false);
      } else {
        setFailed(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [status, attempt]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-400 flex items-center justify-center">
        <span>Loading session…</span>
      </div>
    );
  }

  if (status !== 'authenticated') {
    // middleware handles redirects; render nothing while it happens.
    return null;
  }

  if (failed && !ready) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col items-center justify-center gap-4">
        <span>Couldn&apos;t load your character. Check your connection.</span>
        <button
          onClick={() => {
            setFailed(false);
            setAttempt((n) => n + 1);
          }}
          className="rounded bg-amber-500 hover:bg-amber-400 px-4 py-2 font-medium text-slate-950"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-400 flex items-center justify-center">
        <span>Loading character…</span>
      </div>
    );
  }

  return <>{children}</>;
}
