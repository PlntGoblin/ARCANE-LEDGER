'use client';

import { useEffect, useState } from 'react';
import { Character } from '../../types/character';
import NumberField from '../NumberField';
import SpellCardModal, { SpellCardFace, EditableSpellCard } from '../SpellCardModal';

export interface SpellsTabProps {
  character: Character;
  isDarkMode: boolean;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  getSpellcastingAbility: () => string;
  calculateSpellDC: () => number;
  calculateSpellAttack: () => number;
  getEffectiveKnownSpells: () => number;
  calculateKnownSpells: () => number;
  knownSpellsOverride: number | null;
  setKnownSpellsOverride: React.Dispatch<React.SetStateAction<number | null>>;
  getFinalAbilityScore: (ability: string) => number;
  getModifier: (score: number) => number;
  spellSlots: { [key: number]: { max: number; used: number } };
  setSpellSlots: React.Dispatch<React.SetStateAction<{ [key: number]: { max: number; used: number } }>>;
  castSpell: (level: number) => void;
  shortRest: () => void;
  longRest: () => void;
  getKnownSpellsForLevel: (level: number) => any[];
  getAccessibleSpellLevels: (className: string, level: number) => number[];
  customSpells: { [key: number]: any[] };
  addCustomSpell: (level: number) => void;
  removeCustomSpell: (level: number, spellId: string) => void;
  updateCustomSpell: (level: number, spellId: string, field: string, value: string) => void;
}

// Level tokens used by the sticky HUD's slot pips.
const LEVEL_COLORS: Record<
  number,
  { pip: string; pipUsed: string; text: string; pipHover: string }
> = {
  1: { pip: 'border-blue-400', pipUsed: 'bg-blue-500', text: 'text-blue-300', pipHover: 'hover:bg-blue-500/25' },
  2: { pip: 'border-green-400', pipUsed: 'bg-green-500', text: 'text-green-300', pipHover: 'hover:bg-green-500/25' },
  3: { pip: 'border-purple-400', pipUsed: 'bg-purple-500', text: 'text-purple-300', pipHover: 'hover:bg-purple-500/25' },
  4: { pip: 'border-red-400', pipUsed: 'bg-red-500', text: 'text-red-300', pipHover: 'hover:bg-red-500/25' },
  5: { pip: 'border-yellow-400', pipUsed: 'bg-yellow-500', text: 'text-yellow-300', pipHover: 'hover:bg-yellow-500/25' },
  6: { pip: 'border-indigo-400', pipUsed: 'bg-indigo-500', text: 'text-indigo-300', pipHover: 'hover:bg-indigo-500/25' },
  7: { pip: 'border-pink-400', pipUsed: 'bg-pink-500', text: 'text-pink-300', pipHover: 'hover:bg-pink-500/25' },
  8: { pip: 'border-cyan-400', pipUsed: 'bg-cyan-500', text: 'text-cyan-300', pipHover: 'hover:bg-cyan-500/25' },
  9: { pip: 'border-orange-400', pipUsed: 'bg-orange-500', text: 'text-orange-300', pipHover: 'hover:bg-orange-500/25' },
};

// ─── HUD stat pill ────────────────────────────────────────────────────────────
function StatPill({
  label,
  value,
  title,
  isDarkMode,
  tone,
  highlighted,
}: {
  label: string;
  value: React.ReactNode;
  title?: string;
  isDarkMode: boolean;
  tone?: string;
  highlighted?: boolean;
}) {
  return (
    <div
      title={title}
      className={`flex flex-col items-center px-3 py-1 rounded-md border min-w-[64px] ${
        highlighted
          ? 'bg-orange-900/70 border-orange-500'
          : isDarkMode
            ? 'bg-black/25 border-white/10'
            : 'bg-white border-gray-300'
      }`}
    >
      <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {label}
      </span>
      <span className={`text-base font-bold leading-tight ${tone || (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
        {value}
      </span>
    </div>
  );
}

// ─── SpellLevelSection: collapsible accordion per spell level ─────────────────
interface SpellLevelSectionProps {
  level: number;
  label: string;
  badge?: string;
  knownSpells: any[];
  customSpellsForLevel: any[];
  isDarkMode: boolean;
  addCustomSpell: (level: number) => void;
  removeCustomSpell: (level: number, spellId: string) => void;
  updateCustomSpell: (level: number, spellId: string, field: string, value: string) => void;
  onOpenCard: (spell: any) => void;
}

function SpellLevelSection({
  level,
  label,
  badge,
  knownSpells,
  customSpellsForLevel,
  isDarkMode,
  addCustomSpell,
  removeCustomSpell,
  updateCustomSpell,
  onOpenCard,
}: SpellLevelSectionProps) {
  const totalCount = knownSpells.length + customSpellsForLevel.length;
  const [isOpen, setIsOpen] = useState(totalCount > 0);

  return (
    <div className={`rounded-lg border overflow-hidden ${isDarkMode ? 'sheet-card' : 'bg-white border-gray-200'}`}>
      {/* Accordion header */}
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-colors ${
          isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className={`font-bold text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{label}</span>
          {badge && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                isDarkMode ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-amber-100 text-amber-700 border border-amber-300'
              }`}
            >
              {badge}
            </span>
          )}
          {totalCount > 0 && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isDarkMode ? 'bg-black/30 text-gray-300' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {totalCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              addCustomSpell(level);
              setIsOpen(true);
            }}
            className={`text-sm px-2.5 py-0.5 rounded border font-medium transition-colors ${
              isDarkMode
                ? 'bg-black/30 border-white/10 text-gray-300 hover:bg-black/45'
                : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
            }`}
            title={`Add custom ${label.toLowerCase()} spell`}
          >
            +
          </button>
          <span
            className={`text-xs inline-block transition-transform duration-200 cursor-pointer ${isOpen ? '' : '-rotate-90'} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Spell cards */}
      {isOpen && (
        <div className={`px-4 pb-4 pt-3 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
          {totalCount === 0 ? (
            <p className={`text-sm italic py-2 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              No spells — use + to add a custom one
            </p>
          ) : (
            <>
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
              >
                {knownSpells.map((spell, i) => (
                  <div
                    key={`known-${i}`}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() => onOpenCard(spell)}
                  >
                    <SpellCardFace spell={spell} className="w-full aspect-[5/7]" />
                  </div>
                ))}
                {customSpellsForLevel.map((spell) => (
                  <EditableSpellCard
                    key={`custom-${spell.id}`}
                    spell={spell}
                    level={level}
                    onChange={(field, value) => updateCustomSpell(level, spell.id, field, value)}
                    onRemove={() => removeCustomSpell(level, spell.id)}
                    className="w-full aspect-[5/7]"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── NumberPickerModal: centered picker for tapping to change a small integer ─
function NumberPickerModal({
  title,
  value,
  min = 0,
  max = 999,
  autoValue,
  onCommit,
  onClose,
  isDarkMode,
}: {
  title: string;
  value: number;
  min?: number;
  max?: number;
  autoValue?: number;
  onCommit: (next: number) => void;
  onClose: () => void;
  isDarkMode: boolean;
}) {
  const [draft, setDraft] = useState<number>(value);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') {
        onCommit(draft);
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [draft, onCommit, onClose]);

  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`min-w-[300px] rounded-xl p-6 shadow-2xl border ${
          isDarkMode ? 'bg-slate-800 border-amber-400/30' : 'bg-white border-gray-300'
        }`}
      >
        <h3
          className={`text-xs uppercase tracking-wider text-center mb-5 font-semibold ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {title}
        </h3>
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setDraft(clamp(draft - 1))}
            className="w-12 h-12 rounded-full text-2xl font-bold text-white bg-red-800/70 hover:bg-red-700 transition-colors"
            title="Decrease"
          >
            −
          </button>
          <NumberField
            min={String(min)}
            max={String(max)}
            value={draft}
            onCommit={(v) => setDraft(clamp(v))}
            onFocus={(e) => e.target.select()}
            autoFocus
            className={`w-24 text-4xl font-bold text-center bg-transparent outline-none border-b-2 ${
              isDarkMode ? 'text-white border-amber-400/50' : 'text-gray-900 border-amber-500/70'
            }`}
          />
          <button
            onClick={() => setDraft(clamp(draft + 1))}
            className="w-12 h-12 rounded-full text-2xl font-bold text-white bg-emerald-800/70 hover:bg-emerald-700 transition-colors"
            title="Increase"
          >
            +
          </button>
        </div>
        {autoValue !== undefined && autoValue !== draft && (
          <button
            onClick={() => setDraft(autoValue)}
            className={`w-full text-xs mb-4 ${isDarkMode ? 'text-orange-300 hover:text-orange-200' : 'text-orange-600 hover:text-orange-500'}`}
          >
            ↻ Reset to auto ({autoValue})
          </button>
        )}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-1.5 text-sm rounded transition-colors ${
              isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onCommit(draft);
              onClose();
            }}
            className="px-4 py-1.5 text-sm rounded font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SorceryBar: compact sorcery-points meter for the HUD ────────────────────
function SorceryBar({
  character,
  setCharacter,
  isDarkMode,
}: {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  isDarkMode: boolean;
}) {
  const remaining = character.sorceryPoints.max - character.sorceryPoints.used;
  const pct = character.sorceryPoints.max > 0 ? remaining / character.sorceryPoints.max : 0;
  const fill = pct <= 0.25 ? '#ef4444' : pct <= 0.5 ? '#f59e0b' : pct <= 0.75 ? '#eab308' : '#10b981';

  return (
    <div className="flex-1 min-w-[220px] flex items-center gap-2">
      <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`}>
        Sorcery
      </span>
      <div className={`flex-1 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-6 relative overflow-hidden`}>
        <div
          className={`h-full transition-all duration-300 liquid-fill ${pct <= 0.25 ? 'liquid-fill-critical' : ''}`}
          style={{ width: `${pct * 100}%`, backgroundColor: fill, color: fill }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} drop-shadow`}>
            {remaining} / {character.sorceryPoints.max}
          </span>
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() =>
            setCharacter((prev) => ({
              ...prev,
              sorceryPoints: {
                ...prev.sorceryPoints,
                used: Math.min(prev.sorceryPoints.max, prev.sorceryPoints.used + 1),
              },
            }))
          }
          className={`w-6 h-6 text-xs rounded border transition-colors ${
            isDarkMode ? 'bg-red-900/50 border-red-400/25 text-red-50 hover:bg-red-800/65' : 'bg-red-200 border-red-300 text-red-700 hover:bg-red-300'
          }`}
          disabled={character.sorceryPoints.used >= character.sorceryPoints.max}
          title="Spend one"
        >
          −
        </button>
        <button
          onClick={() =>
            setCharacter((prev) => ({
              ...prev,
              sorceryPoints: { ...prev.sorceryPoints, used: Math.max(0, prev.sorceryPoints.used - 1) },
            }))
          }
          className={`w-6 h-6 text-xs rounded border transition-colors ${
            isDarkMode ? 'bg-emerald-700/60 border-emerald-400/25 text-emerald-50 hover:bg-emerald-600/75' : 'bg-green-200 border-green-300 text-green-700 hover:bg-green-300'
          }`}
          disabled={character.sorceryPoints.used <= 0}
          title="Restore one"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── SorceryCostRef: collapsed reference table (Sorcerer only) ───────────────
function SorceryCostRef({ isDarkMode }: { isDarkMode: boolean }) {
  const [open, setOpen] = useState(false);
  const rows: [string, number][] = [
    ['Cantrip', 0],
    ['1st', 2],
    ['2nd', 3],
    ['3rd', 5],
    ['4th', 6],
    ['5th', 7],
  ];
  return (
    <div className={`rounded-lg border ${isDarkMode ? 'sheet-card' : 'bg-white border-gray-200'}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-2 text-sm font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`}
      >
        <span>Sorcery Point Costs</span>
        <span className={`text-xs transition-transform ${open ? '' : '-rotate-90'}`}>▼</span>
      </button>
      {open && (
        <div className={`px-4 pb-3 grid grid-cols-6 gap-2 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-100'} pt-2`}>
          {rows.map(([label, cost]) => (
            <div
              key={label}
              className={`text-center rounded px-2 py-1 ${isDarkMode ? 'bg-black/25' : 'bg-gray-100'}`}
            >
              <div className={`text-[10px] uppercase font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
              <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cost}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main SpellsTab ───────────────────────────────────────────────────────────
export default function SpellsTab({
  character,
  isDarkMode,
  setCharacter,
  getSpellcastingAbility,
  calculateSpellDC,
  calculateSpellAttack,
  getEffectiveKnownSpells,
  calculateKnownSpells,
  knownSpellsOverride,
  setKnownSpellsOverride,
  getFinalAbilityScore,
  getModifier,
  spellSlots,
  setSpellSlots,
  castSpell,
  shortRest,
  longRest,
  getKnownSpellsForLevel,
  getAccessibleSpellLevels,
  customSpells,
  addCustomSpell,
  removeCustomSpell,
  updateCustomSpell,
}: SpellsTabProps) {
  const abilityKey = getSpellcastingAbility();
  const abilityShort = abilityKey.slice(0, 3).toUpperCase();
  const abilityMod = getModifier(getFinalAbilityScore(abilityKey));
  const abilityModStr = `${abilityMod >= 0 ? '+' : ''}${abilityMod}`;
  const spellAtk = calculateSpellAttack();

  const activeSlotLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((l) => spellSlots[l] && spellSlots[l].max > 0);
  const accessibleSpellLevels = getAccessibleSpellLevels(character.class, character.level).filter((l) => l !== 0);
  const isSorcerer = character.class === 'Sorcerer';
  const [knownEditorOpen, setKnownEditorOpen] = useState(false);
  const [viewingSpell, setViewingSpell] = useState<any | null>(null);

  return (
    <div className="space-y-4">
      {/* Sticky Spellcasting HUD */}
      <div
        className={`sticky top-0 z-20 p-3 rounded-lg border shadow-xl ${
          isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Stat pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <StatPill
              label="Ability"
              value={abilityShort}
              title={`${character.class} uses ${abilityKey.charAt(0).toUpperCase() + abilityKey.slice(1)}`}
              isDarkMode={isDarkMode}
            />
            <button
              onClick={() => setKnownEditorOpen(true)}
              title={
                knownSpellsOverride !== null
                  ? `Manual override: ${knownSpellsOverride} (Auto: ${calculateKnownSpells()}). Click to edit.`
                  : `Auto-calculated: ${calculateKnownSpells()}. Click to edit.`
              }
              className={`flex flex-col items-center px-3 py-1 rounded-md border min-w-[64px] transition-colors ${
                knownSpellsOverride !== null
                  ? 'bg-orange-900/70 border-orange-500 hover:bg-orange-800/80'
                  : isDarkMode
                    ? 'bg-black/25 border-white/10 hover:bg-black/40'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Known
              </span>
              <span className={`text-base font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {getEffectiveKnownSpells()}
              </span>
            </button>
            <StatPill
              label="DC"
              value={calculateSpellDC()}
              title={`8 + Prof (${character.proficiencyBonus}) + ${abilityShort} (${abilityModStr})`}
              isDarkMode={isDarkMode}
            />
            <StatPill
              label="Attack"
              value={`${spellAtk >= 0 ? '+' : ''}${spellAtk}`}
              title={`Prof (${character.proficiencyBonus}) + ${abilityShort} (${abilityModStr})`}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Middle: slot pips OR sorcery bar */}
          {isSorcerer ? (
            <SorceryBar character={character} setCharacter={setCharacter} isDarkMode={isDarkMode} />
          ) : activeSlotLevels.length > 0 ? (
            <div className="flex-1 min-w-0 flex items-start gap-3 justify-center overflow-x-auto">
              {activeSlotLevels.map((level) => {
                const slots = spellSlots[level];
                const colors = LEVEL_COLORS[level];
                return (
                  <div key={level} className="flex flex-col items-center gap-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>L{level}</span>
                    <div className="grid grid-cols-2 gap-1 justify-items-center">
                      {Array.from({ length: slots.max }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (index < slots.used) {
                              setSpellSlots((prev) => ({
                                ...prev,
                                [level]: { ...prev[level], used: Math.max(0, prev[level].used - 1) },
                              }));
                            } else {
                              castSpell(level);
                            }
                          }}
                          className={`w-3.5 h-3.5 rounded-full border-2 transition-all hover:scale-125 ${
                            index < slots.used
                              ? colors.pipUsed + ' border-transparent shadow-sm'
                              : 'bg-transparent ' + colors.pip + ' ' + colors.pipHover
                          }`}
                          title={index < slots.used ? 'Click to restore this slot' : 'Click to cast'}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className={`flex-1 text-center text-xs italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              No spell slots for {character.class} L{character.level}
            </span>
          )}

          {/* Rest buttons */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={shortRest}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                isDarkMode ? 'bg-sky-800/55 border-sky-400/25 text-sky-50 hover:bg-sky-700/70' : 'bg-blue-200 border-blue-300 text-blue-700 hover:bg-blue-300'
              }`}
              title={character.class === 'Warlock' ? 'Short Rest (Restore All)' : 'Short Rest'}
            >
              Short Rest
            </button>
            <button
              onClick={
                isSorcerer
                  ? () => setCharacter((prev) => ({ ...prev, sorceryPoints: { ...prev.sorceryPoints, used: 0 } }))
                  : longRest
              }
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                isDarkMode ? 'bg-emerald-700/60 border-emerald-400/25 text-emerald-50 hover:bg-emerald-600/75' : 'bg-green-200 border-green-300 text-green-700 hover:bg-green-300'
              }`}
              title="Long Rest (Restore All)"
            >
              Long Rest
            </button>
          </div>
        </div>
      </div>

      {/* Sorcery cost reference (only for Sorcerers) */}
      {isSorcerer && <SorceryCostRef isDarkMode={isDarkMode} />}

      {/* Spell Level Accordion Sections */}
      <div className="space-y-3">
        <SpellLevelSection
          level={0}
          label="Cantrips"
          badge="At Will"
          knownSpells={getKnownSpellsForLevel(0)}
          customSpellsForLevel={customSpells[0] || []}
          isDarkMode={isDarkMode}
          addCustomSpell={addCustomSpell}
          removeCustomSpell={removeCustomSpell}
          updateCustomSpell={updateCustomSpell}
          onOpenCard={setViewingSpell}
        />
        {accessibleSpellLevels.map((level) => (
          <SpellLevelSection
            key={level}
            level={level}
            label={`Level ${level}`}
            knownSpells={getKnownSpellsForLevel(level)}
            customSpellsForLevel={customSpells[level] || []}
            isDarkMode={isDarkMode}
            addCustomSpell={addCustomSpell}
            removeCustomSpell={removeCustomSpell}
            updateCustomSpell={updateCustomSpell}
            onOpenCard={setViewingSpell}
          />
        ))}
      </div>

      {viewingSpell && <SpellCardModal spell={viewingSpell} onClose={() => setViewingSpell(null)} />}

      {knownEditorOpen && (
        <NumberPickerModal
          title="Known / Prepared Spells"
          value={getEffectiveKnownSpells()}
          min={0}
          autoValue={calculateKnownSpells()}
          onCommit={(value) => {
            const calculated = calculateKnownSpells();
            setKnownSpellsOverride(value === calculated ? null : value);
            setCharacter({ ...character, knownPreparedSpells: value });
          }}
          onClose={() => setKnownEditorOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
