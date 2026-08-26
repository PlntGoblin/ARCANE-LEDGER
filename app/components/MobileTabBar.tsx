'use client';

// Bottom-of-screen tab bar shown only on touch devices (see the
// .touch-only rule in globals.css). Renders the same six tabs as the
// desktop pill row and calls the same setActiveTab, so state stays in
// CharacterSheet.tsx — this component is pure UI.
//
// Sized generously for the 1080px viewport at ~0.36x phone scale: the
// h-28 bar and text-3xl labels come out to roughly 40 CSS pt at that
// scale, which is a comfortable thumb target.

const TABS = ['Stats', 'Inventory', 'Character', 'Spells', 'Library', 'Data'] as const;

export default function MobileTabBar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <nav
      aria-label="Character sheet tabs"
      className="touch-only fixed bottom-0 inset-x-0 z-50 h-28 bg-gray-950/95 backdrop-blur border-t border-gray-800"
    >
      <ul className="flex h-full w-full">
        {TABS.map((tab) => {
          const active = tab === activeTab;
          return (
            <li key={tab} className="flex-1">
              <button
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-current={active ? 'page' : undefined}
                className={`flex h-full w-full items-center justify-center px-2 text-3xl font-semibold transition-colors ${
                  active
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
