'use client';

import { useState } from 'react';

export default function PasswordField({
  value,
  onChange,
  autoComplete = 'current-password',
  required = false,
  minLength,
  label = 'Password',
}: {
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  label?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
        {label}
      </span>
      <div className="relative mt-1.5">
        <input
          type={visible ? 'text' : 'password'}
          className="auth-input block w-full rounded-lg bg-black/40 border border-white/15 pl-3 pr-10 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300/30"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-white/50 hover:text-amber-200 transition"
        >
          {visible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.65 19.65 0 0 1 4.22-5.19" />
              <path d="M22.54 12.88A19.65 19.65 0 0 0 23 12s-4-8-11-8a10.94 10.94 0 0 0-3.06.44" />
              <path d="m1 1 22 22" />
              <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.72 19.72 0 0 1-2.16 3.19" />
              <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </label>
  );
}
