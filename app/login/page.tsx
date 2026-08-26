'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '../components/AuthShell';
import PasswordField from '../components/PasswordField';

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
      footer={
        <>
          No account?{' '}
          <Link href="/signup" className="text-amber-300 hover:text-amber-200 hover:underline">
            Sign up
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
            required
          />
        </label>
        <PasswordField
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-amber-500 hover:bg-amber-400 py-2 font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
}
