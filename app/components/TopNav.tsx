'use client';

import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function TopNav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/signup') return null;
  if (status !== 'authenticated') return null;

  const username = session?.user?.name ?? 'Adventurer';

  return (
    <div className="w-full bg-gray-950 text-gray-200 border-b border-gray-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 touch-nav-bar">
        <span className="text-sm text-gray-400 touch-nav-label">
          Signed in as <span className="text-gray-100 font-medium">{username}</span>
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="rounded bg-gray-800 hover:bg-gray-700 px-3 py-1 text-sm touch-nav-button"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
