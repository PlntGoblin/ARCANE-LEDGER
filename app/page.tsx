import type { Viewport } from 'next';
import CharacterSheet from './components/CharacterSheet';
import AppStateGate from './components/AppStateGate';

// Mobile: force the layout viewport to ~1080px and let the browser scale it
// down to fit the phone screen. The character sheet is already max-w-5xl
// (1024px) desktop-first — this shrinks the whole thing proportionally
// instead of requiring per-tab responsive rewrites.
// Desktop browsers ignore this meta tag, so no change there.
export const viewport: Viewport = {
  width: 1080,
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <AppStateGate>
        <CharacterSheet />
      </AppStateGate>
    </div>
  );
}
