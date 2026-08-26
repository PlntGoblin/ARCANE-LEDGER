'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Signup failed');
      setBusy(false);
      return;
    }

    const signInRes = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });
    setBusy(false);

    if (!signInRes || signInRes.error) {
      setError('Signed up, but auto-login failed. Try logging in.');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-1">Create an account</h1>
        <p className="text-sm text-gray-400 mb-6">Pick a username and password.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-300">Username</span>
            <input
              className="mt-1 block w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              minLength={2}
              maxLength={32}
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
              autoComplete="new-password"
              minLength={4}
              required
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded bg-indigo-600 py-2 font-medium hover:bg-indigo-500 disabled:opacity-50"
          >
            {busy ? 'Creating…' : 'Sign up'}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-400">
          Have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
