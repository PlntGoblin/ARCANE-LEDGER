'use client';

import { useState } from 'react';
import { pickRandomAuthBackground } from '../lib/authBackgrounds';

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const [bg] = useState<string | null>(() => pickRandomAuthBackground());

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-black">
      {bg && (
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url("${bg}")` }}
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.7)] p-7 text-gray-100">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">{title}</h1>
        {subtitle && <p className="text-sm text-white/70 mb-6">{subtitle}</p>}
        {children}
        {footer && <div className="mt-6 text-sm text-white/70">{footer}</div>}
      </div>
    </div>
  );
}
