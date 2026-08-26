'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-1">Arcane Ledger</h1>
        <p className="text-sm text-gray-400 mb-6">Log in to your character sheet.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-300">Username</span>
            <input
              className="mt-1 block w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-300">Password</span>
            <input
              type="password"
              className="mt-1 block w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded bg-indigo-600 py-2 font-medium hover:bg-indigo-500 disabled:opacity-50"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-400">
          No account?{' '}
          <Link href="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
