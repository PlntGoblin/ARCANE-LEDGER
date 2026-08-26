'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '../components/AuthShell';
import PasswordField from '../components/PasswordField';

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
      title="Grimoire"
      subtitle="Create a new account"
      footer={
        <>
          Have an account?{' '}
          <Link href="/login" className="text-amber-300 hover:text-amber-200 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4 max-w-[85%] mx-auto">
        <label className="block">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
            Username
          </span>
          <input
            className="auth-input mt-1.5 block w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300/30"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            minLength={2}
            maxLength={32}
            required
          />
        </label>
        <PasswordField
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
          minLength={4}
        />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-amber-500 hover:bg-amber-400 py-2 font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? 'Creating…' : 'Sign up'}
        </button>
      </form>
    </AuthShell>
  );
}
