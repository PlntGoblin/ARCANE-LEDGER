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
  const [bg] = useState(() => {
    // Prefer mobile-tagged images on touch devices. The initializer only
    // runs on the client (this is a 'use client' component) so window is
    // available; guard just to be safe during any SSR pre-render.
    const isMobile =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches;
    return pickRandomAuthBackground({ isMobile });
  });

  const isSideways = bg?.rotate === 90 || bg?.rotate === 270;
  const bgStyle: React.CSSProperties | undefined = bg
    ? isSideways
      ? {
          width: '100vh',
          height: '100vw',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotate(${bg.rotate}deg)`,
          transformOrigin: 'center center',
        }
      : bg.rotate === 180
        ? {
            width: '100%',
            height: '100%',
            transform: 'rotate(180deg)',
          }
        : undefined
    : undefined;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-black">
      {bg &&
        (isSideways || bg.rotate === 180 ? (
          <img
            src={bg.url}
            alt=""
            aria-hidden="true"
            className="absolute object-cover"
            style={bgStyle}
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url("${bg.url}")` }}
            aria-hidden="true"
          />
        ))}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="auth-card-enter relative w-full max-w-[19rem] rounded-2xl border border-amber-200/25 bg-black/35 backdrop-blur-2xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] pt-8 pb-7 px-7 text-gray-100">
        <h1
          className="text-center text-4xl font-black tracking-wide mb-3 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
          style={{ fontFamily: 'var(--font-cinzel-decorative), serif' }}
        >
          {title}
        </h1>

        <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
          <span className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-amber-300/50" />
          <span className="text-amber-300/80 text-[10px]">◆</span>
          <span className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-amber-300/50" />
        </div>

        {subtitle && <p className="text-center text-sm text-white/70 mb-6">{subtitle}</p>}
        {children}
        {footer && <div className="mt-6 text-sm text-white/80 text-center">{footer}</div>}
      </div>
    </div>
  );
}
