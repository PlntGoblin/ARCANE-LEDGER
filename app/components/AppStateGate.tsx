'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { loadFromServer, syncedStorage } from '../lib/syncedStorage';

export default function AppStateGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [ready, setReady] = useState(syncedStorage.isReady());

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (syncedStorage.isReady()) {
      setReady(true);
      return;
    }
    let cancelled = false;
    loadFromServer().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [status]);

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

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-400 flex items-center justify-center">
        <span>Loading character…</span>
      </div>
    );
  }

  return <>{children}</>;
}
