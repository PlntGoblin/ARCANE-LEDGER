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
  const [bg] = useState(() => pickRandomAuthBackground());

  // For 90/270 rotations the container's width becomes the image's height and
  // vice-versa. Swap dimensions accordingly so the rotated image still fills
  // the viewport with no gaps.
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
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.7)] p-7 text-gray-100">
        <h1
          className="text-center text-4xl font-black tracking-wide mb-2 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
          style={{ fontFamily: 'var(--font-cinzel-decorative), serif' }}
        >
          {title}
        </h1>
        {subtitle && <p className="text-center text-sm text-white/70 mb-6">{subtitle}</p>}
        {children}
        {footer && <div className="mt-6 text-sm text-white/70 text-center">{footer}</div>}
      </div>
    </div>
  );
}
