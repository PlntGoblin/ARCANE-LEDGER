'use client';

// Bottom-of-screen tab bar shown only on touch devices (see the
// .touch-only rule in globals.css). Renders the same six tabs as the
// desktop pill row and calls the same setActiveTab, so state stays in
// CharacterSheet.tsx — this component is pure UI.
//
// Sized generously for the 1080px viewport at ~0.36x phone scale.
// h-[9rem] ≈ 51 physical px + safe-area padding accommodates the
// iPhone home indicator on notched devices.

type Tab = 'Stats' | 'Inventory' | 'Character' | 'Spells' | 'Library' | 'Data';

const TABS: Tab[] = ['Stats', 'Inventory', 'Character', 'Spells', 'Library', 'Data'];

function TabIcon({ tab, className }: { tab: Tab; className?: string }) {
  const common = {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    strokeWidth: 1.8,
    stroke: 'currentColor',
    className: className ?? 'w-16 h-16',
  } as const;

  switch (tab) {
    case 'Stats':
      // Shield with a check — combat stats & saves.
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12c0 5.25-3.75 9.75-9 10.5C6.75 21.75 3 17.25 3 12V5.25l9-2.25 9 2.25V12Z"
          />
        </svg>
      );
    case 'Inventory':
      // Archive / backpack — items.
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5H3.75m16.5 0v11.25A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25V7.5m16.5 0V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v1.5M10.5 12h3"
          />
        </svg>
      );
    case 'Character':
      // User silhouette.
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
          />
        </svg>
      );
    case 'Spells':
      // Sparkles — magic.
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.898 20.562 16.5 21.75l-.398-1.188a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.179-.398a2.25 2.25 0 0 0 1.423-1.423l.398-1.187.398 1.187a2.25 2.25 0 0 0 1.423 1.423l1.187.398-1.187.398a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
      );
    case 'Library':
      // Open book.
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
      );
    case 'Data':
      // Gear / cog — settings & rolling.
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      );
  }
}

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
      className="touch-only fixed bottom-0 inset-x-0 z-50 h-[9rem] bg-gray-950/95 backdrop-blur border-t border-gray-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
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
                className={`flex h-full w-full flex-col items-center justify-center gap-2 px-1 text-2xl font-semibold transition-colors ${
                  active
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <TabIcon tab={tab} />
                <span>{tab}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
