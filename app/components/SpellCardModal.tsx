'use client';

import { useEffect, useRef } from 'react';

// ─── Normalisation helpers ────────────────────────────────────────────────────
// The master list uses terse abbreviations ("Act", "Evoc", "VSM") to keep the
// JSON small. The card wants readable labels.

const CASTING_TIME_LABEL: Record<string, string> = {
  Act: '1 Action',
  Action: '1 Action',
  BA: 'Bonus Action',
  React: 'Reaction',
  Reaction: 'Reaction',
};

const SCHOOL_FULL: Record<string, string> = {
  Abjur: 'Abjuration',
  Conj: 'Conjuration',
  Divin: 'Divination',
  Ench: 'Enchantment',
  Evoc: 'Evocation',
  Illus: 'Illusion',
  Necro: 'Necromancy',
  Trans: 'Transmutation',
};

const SCHOOL_ACCENT: Record<string, { text: string; ring: string; glow: string }> = {
  Abjuration: { text: 'text-blue-300', ring: 'border-blue-400/50', glow: 'bg-blue-500/15' },
  Conjuration: { text: 'text-yellow-300', ring: 'border-yellow-400/50', glow: 'bg-yellow-500/15' },
  Divination: { text: 'text-cyan-300', ring: 'border-cyan-400/50', glow: 'bg-cyan-500/15' },
  Enchantment: { text: 'text-pink-300', ring: 'border-pink-400/50', glow: 'bg-pink-500/15' },
  Evocation: { text: 'text-red-300', ring: 'border-red-400/50', glow: 'bg-red-500/15' },
  Illusion: { text: 'text-purple-300', ring: 'border-purple-400/50', glow: 'bg-purple-500/15' },
  Necromancy: { text: 'text-green-300', ring: 'border-green-400/50', glow: 'bg-green-500/15' },
  Transmutation: { text: 'text-orange-300', ring: 'border-orange-400/50', glow: 'bg-orange-500/15' },
};

const LEVEL_LABEL = (l: number | string) => {
  const n = typeof l === 'string' ? parseInt(l) : l;
  if (!n || n === 0) return 'Cantrip';
  const suffix = n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
  return `${n}${suffix} Level`;
};

const componentsToList = (c: string) =>
  c
    ? c
        .replace(/\s+/g, '')
        .split('')
        .filter((ch) => 'VSMR'.includes(ch))
        .join(', ')
    : '';

// ─── Inline SVG icons ─────────────────────────────────────────────────────────
// Small stroked line icons in the amber accent, kept consistent so they read
// as a set. Each icon takes className so callers can size / colour them.

const IconClock = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" strokeLinecap="round" />
  </svg>
);

const IconRange = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
  </svg>
);

// After the Flaticon hourglass by Magnific: outlined frame with solid
// sand — small trickle at the top, rounded pile at the bottom.
const IconHourglass = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 3h14M5 21h14" />
    <path d="M6 3.5c0 4 6 5 6 8.5s-6 4.5-6 8.5" />
    <path d="M18 3.5c0 4-6 5-6 8.5s6 4.5 6 8.5" />
    <path d="M9 4.5h6l-3 3.5z" fill="currentColor" stroke="none" />
    <path
      d="M7.5 20c1-2.5 2.7-4 4.5-4.5 1.8.5 3.5 2 4.5 4.5z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

const IconConcentration = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
    <path d="M9 20v-2c-3-1-4-4-4-7 0-4 3-7 7-7s7 3 7 7c0 3-1 6-4 7v2" strokeLinecap="round" />
    <path d="M10 20h4" strokeLinecap="round" />
    <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
    <path d="M9 11c1-1.5 5-1.5 6 0" strokeLinecap="round" />
  </svg>
);

const IconComponents = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
    {/* Somatic: open hand */}
    <path d="M4 12V7a1 1 0 1 1 2 0v4M6 11V5a1 1 0 1 1 2 0v6M8 11V4a1 1 0 1 1 2 0v7M10 11V6a1 1 0 1 1 2 0v6c0 3-2 5-4 5s-4-2-4-4v-2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Material: pouch */}
    <path d="M15 10c-1 0-2 1-2 2v4c0 2 2 3 4 3s4-1 4-3v-4c0-1-1-2-2-2z" strokeLinejoin="round" />
    <path d="M15 10l1-2h4l1 2" strokeLinejoin="round" />
  </svg>
);

const IconArea = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
    <ellipse cx="12" cy="18" rx="9" ry="2.5" />
    <path d="M12 4v13" strokeLinecap="round" strokeDasharray="1.5 2" />
    <circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const IconScroll = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
    <path d="M6 3h11a2 2 0 0 1 2 2v13a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2z" strokeLinejoin="round" />
    <path d="M8 8h7M8 12h7M8 16h4" strokeLinecap="round" />
  </svg>
);

const IconD20 = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} className={className}>
    <path d="M12 2l9 5v10l-9 5-9-5V7z" strokeLinejoin="round" />
    <path d="M12 2l4 6-4 4-4-4z" strokeLinejoin="round" />
    <path d="M16 8l5-1M8 8L3 7M12 12v10M16 8l3 9M8 8l-3 9" />
  </svg>
);

// School glyphs — one per magical school, simple and consistent.
const SchoolIcon = ({ school, className = 'w-5 h-5' }: { school: string; className?: string }) => {
  const paths: Record<string, JSX.Element> = {
    Abjuration: (
      <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" strokeLinejoin="round" />
    ),
    Conjuration: (
      <>
        <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
        <path d="M12 6v12M6 12h12" strokeLinecap="round" />
      </>
    ),
    Divination: (
      <>
        <path d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    Enchantment: (
      <path
        d="M12 20s-7-4-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 6-7 10-7 10z"
        strokeLinejoin="round"
      />
    ),
    Evocation: (
      <path
        d="M12 3s3 3 3 6-2 4-2 5c0 2 2 3 2 5 0 1-1 2-3 2s-4-2-4-5c0-2 1-3 2-5 0-1-2-2-2-4 0-1 1-2 4-4z"
        strokeLinejoin="round"
      />
    ),
    Illusion: (
      <>
        <path d="M4 8c0-1 1-2 2-2h12c1 0 2 1 2 2v4c0 4-4 7-8 7s-8-3-8-7V8z" strokeLinejoin="round" />
        <circle cx="9" cy="11" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="11" r="1.2" fill="currentColor" stroke="none" />
      </>
    ),
    Necromancy: (
      <>
        <path d="M8 20v-3c-2-1-3-3-3-6a7 7 0 0 1 14 0c0 3-1 5-3 6v3" strokeLinejoin="round" />
        <circle cx="9.5" cy="11" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="11" r="1.2" fill="currentColor" stroke="none" />
      </>
    ),
    Transmutation: (
      <>
        <path d="M4 12a8 8 0 0 1 14-5" strokeLinecap="round" />
        <path d="M18 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 12a8 8 0 0 1-14 5" strokeLinecap="round" />
        <path d="M6 20v-4h4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
      {paths[school] || <circle cx="12" cy="12" r="8" />}
    </svg>
  );
};

// ─── Stat block: icon over label over value ──────────────────────────────────
function StatBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-0 flex-1">
      <div className="text-amber-200/80">{icon}</div>
      <div className="text-[9px] uppercase tracking-wider font-semibold text-amber-400/70 text-center leading-tight whitespace-nowrap">{label}</div>
      <div className="text-[11px] font-medium text-gray-100 text-center leading-tight">{value || '—'}</div>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export default function SpellCardModal({
  spell,
  onClose,
}: {
  spell: any;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Auto-shrink the title so long spell names ("Otiluke's Resilient Sphere")
  // never wrap. Start at 36px and step down until the natural width fits the
  // container.
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    const wrap = titleWrapRef.current;
    if (!el || !wrap) return;
    let size = 36;
    el.style.fontSize = `${size}px`;
    while (el.scrollWidth > wrap.clientWidth && size > 14) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }
  }, [spell]);

  if (!spell) return null;

  const name = spell.Name || spell.name || '';
  const level = spell.Level ?? spell.level ?? 0;
  const schoolRaw = spell.School || spell.school || '';
  const school = SCHOOL_FULL[schoolRaw] || schoolRaw;
  const castRaw = spell.CastingTime || spell.casting_time || '';
  const castTime = CASTING_TIME_LABEL[castRaw] || castRaw;
  const range = spell.Range || spell.range || '';
  const area = spell['Area or Targets'] || spell.area_of_effect || spell.areaOfEffect || spell.targets || '';
  const duration = spell.Duration || spell.duration || '';
  const isConc = !!spell.Conc;
  const isRitual = !!spell.Ritual;
  const compRaw = spell.Comp || spell.components || '';
  const components = componentsToList(compRaw);
  const saveAtt = spell['Save or Attack'] || spell.save || spell.attack || '';
  const effect = spell.Effect || spell.description || spell.effect || '';
  const source = spell.Source || '';
  const page = spell.Page || '';
  const cost = spell.Cost || '';

  const accent = SCHOOL_ACCENT[school] || { text: 'text-amber-300', ring: 'border-amber-400/50', glow: 'bg-amber-500/15' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative sheet-card rounded-2xl w-full max-w-sm aspect-[5/7] max-h-[90vh] overflow-hidden shadow-2xl border-amber-400/40 flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-10 text-gray-400 hover:text-white text-lg leading-none z-10"
          title="Close"
        >
          ✕
        </button>

        <div className="px-5 pt-7 pb-5 flex-1 min-h-0 flex flex-col">
          {/* Title with soft amber glow — auto-shrinks to fit on one line */}
          <div ref={titleWrapRef} className="text-center overflow-hidden">
            <h2
              ref={titleRef}
              className="font-serif font-bold text-amber-100 tracking-wide leading-tight inline-block whitespace-nowrap"
              style={{ textShadow: '0 0 12px rgba(253, 224, 71, 0.35), 0 0 4px rgba(253, 224, 71, 0.55)' }}
            >
              {name}
            </h2>
            {isConc && (
              <div className="mt-1 flex items-center justify-end gap-1 text-amber-300/80 text-[10px]">
                <IconConcentration className="w-3 h-3" />
                <span className="uppercase tracking-wider font-semibold">Concentration</span>
              </div>
            )}
          </div>

          <div className={`mt-2 h-px w-full ${accent.ring} border-t`} />

          {/* Stat icon row — warmer amber, larger icons */}
          <div className="flex justify-around mt-2 gap-1">
            <StatBlock icon={<IconClock className="w-6 h-6" />} label="Cast" value={castTime} />
            <StatBlock icon={<IconRange className="w-6 h-6" />} label="Range" value={range} />
            <StatBlock icon={<IconHourglass className="w-6 h-6" />} label="Duration" value={duration} />
            <StatBlock icon={<IconConcentration className="w-6 h-6" />} label="Conc." value={isConc ? 'Yes' : 'No'} />
            <StatBlock icon={<IconComponents className="w-6 h-6" />} label="Components" value={components} />
          </div>

          <div className={`mt-3 h-px w-full ${accent.ring} border-t`} />

          {/* Stacked details: Area of Effect, then Description (scrolls to fill) */}
          {(area || effect || saveAtt || cost) && (
            <div className="mt-2 space-y-2 flex-1 min-h-0 flex flex-col">
              {(area || saveAtt || cost) && (
                <div className="rounded-lg bg-black/30 border border-amber-500/20 px-3 py-2">
                  <div className="flex divide-x divide-amber-500/15">
                    <div className="flex-1 min-w-0 px-2 first:pl-0 last:pr-0">
                      <div className="flex items-center gap-1.5 text-amber-300 mb-0.5">
                        {area ? <IconArea className="w-4 h-4" /> : <IconRange className="w-4 h-4" />}
                        <span className="text-[10px] uppercase tracking-wider font-semibold">
                          {area ? 'Area' : 'Targets'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-100 leading-snug break-words">{area || range || '—'}</p>
                    </div>
                    {saveAtt && (
                      <div className="flex-1 min-w-0 px-2 first:pl-0 last:pr-0">
                        <div className="text-[10px] uppercase tracking-wider text-amber-400/70 font-semibold mb-0.5">
                          Save / Att
                        </div>
                        <p className="text-xs text-gray-100 leading-snug break-words">{saveAtt}</p>
                      </div>
                    )}
                    {cost && (
                      <div className="flex-1 min-w-0 px-2 first:pl-0 last:pr-0">
                        <div className="text-[10px] uppercase tracking-wider text-amber-400/70 font-semibold mb-0.5">
                          Cost
                        </div>
                        <p className="text-xs text-gray-100 leading-snug break-words">{cost}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {effect && (
                <div className="flex-1 min-h-0 rounded-lg bg-black/30 border border-amber-500/20 px-3 py-2 overflow-y-auto sheet-scroll">
                  <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{effect}</p>
                </div>
              )}
            </div>
          )}

          {/* Bottom row: Level (left) · Source (centre) · School pill (right) */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className={`text-sm font-medium ${accent.text} flex-shrink-0`}>{LEVEL_LABEL(level)}</span>
            {(source || page) && (
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-500 min-w-0 truncate">
                <IconD20 className="w-3.5 h-3.5 text-amber-400/50 flex-shrink-0" />
                <span className="truncate">
                  {source}
                  {page ? ` · p.${page}` : ''}
                </span>
              </div>
            )}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border flex-shrink-0 ${accent.ring} ${accent.glow}`}
            >
              <span className={`text-sm font-medium ${accent.text}`}>{school}</span>
              {isRitual && (
                <span
                  className="text-[10px] font-bold text-purple-200 bg-purple-500/40 border border-purple-400/50 rounded-full px-1.5 py-0.5"
                  title="Can be cast as a ritual"
                >
                  Ritual
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
