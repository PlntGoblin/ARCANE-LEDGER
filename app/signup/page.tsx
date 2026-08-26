'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '../components/AuthShell';

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
    <AuthShell
      title="Create an account"
      subtitle="Pick a username and password."
      footer={
        <>
          Have an account?{' '}
          <Link href="/login" className="text-indigo-300 hover:text-indigo-200 hover:underline">
            Log in
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
            minLength={2}
            maxLength={32}
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
            autoComplete="new-password"
            minLength={4}
            required
          />
        </label>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-indigo-500/90 hover:bg-indigo-400 py-2 font-medium text-white shadow-lg shadow-indigo-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? 'Creating…' : 'Sign up'}
        </button>
      </form>
    </AuthShell>
  );
}
