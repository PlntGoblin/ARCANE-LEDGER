'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '../components/AuthShell';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 text-gray-400 flex items-center justify-center">
          <span>Loading…</span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });
    setBusy(false);
    if (!res || res.error) {
      setError('Invalid username or password');
      return;
    }
    router.push(from);
    router.refresh();
  }

  return (
    <AuthShell
      title="Grimoire"
      subtitle="Log in to your character sheet."
      footer={
        <>
          No account?{' '}
          <Link href="/signup" className="text-indigo-300 hover:text-indigo-200 hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-white/80">Username</span>
          <input
            className="mt-1 block w-full rounded-lg bg-black/30 border border-white/20 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm text-white/80">Password</span>
          <input
            type="password"
            className="mt-1 block w-full rounded-lg bg-black/30 border border-white/20 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-indigo-500/90 hover:bg-indigo-400 py-2 font-medium text-white shadow-lg shadow-indigo-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
}
