'use client';

import { useState } from 'react';
import { Character } from '../../types/character';

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
  hoveredSpell: any;
  setHoveredSpell: React.Dispatch<React.SetStateAction<any>>;
  mousePosition: { x: number; y: number };
  setMousePosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

// ─── School color badges ──────────────────────────────────────────────────────
const SCHOOL_COLORS: Record<string, string> = {
  Abjuration: 'bg-blue-900/50 text-blue-300',
  Conjuration: 'bg-yellow-900/50 text-yellow-300',
  Divination: 'bg-cyan-900/50 text-cyan-300',
  Enchantment: 'bg-pink-900/50 text-pink-300',
  Evocation: 'bg-red-900/50 text-red-300',
  Illusion: 'bg-purple-900/50 text-purple-300',
  Necromancy: 'bg-green-900/50 text-green-300',
  Transmutation: 'bg-orange-900/50 text-orange-300',
};

// ─── SpellCard: read-only known spell from the master list ───────────────────
interface SpellCardProps {
  spell: any;
  isDarkMode: boolean;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

function SpellCard({ spell, isDarkMode, onMouseEnter, onMouseMove, onMouseLeave }: SpellCardProps) {
  const [expanded, setExpanded] = useState(false);

  const name = spell.Name || spell.name || '';
  const school = spell.School || spell.school || '';
  const castTime = spell.CastingTime || spell.casting_time || spell.castingTime || '';
  const range = spell.Range || spell.range || '';
  const area = spell['Area or Targets'] || spell.area_of_effect || spell.areaOfEffect || spell.targets || '';
  const effect = spell.Effect || spell.description || spell.effect || '';
  const saveAtt = spell['Save or Attack'] || spell.save || spell.attack || '';
  const duration = spell.Duration || spell.duration || '';
  const comp = spell.Comp || spell.components || '';
  const isConc = !!spell.Conc;
  const isRitual = !!spell.Ritual;

  const schoolColor =
    SCHOOL_COLORS[school] || (isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-600');

  const detailItems = [
    { label: 'Range', value: range },
    { label: 'Area', value: area },
    { label: 'Duration', value: duration },
    { label: 'Save/Att', value: saveAtt },
    { label: 'Components', value: comp },
  ].filter((d) => d.value);

  return (
    <div
      className={`rounded-lg border transition-all ${
        isDarkMode ? 'sheet-card hover:border-amber-200/40' : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Compact header row */}
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <span className={`font-semibold text-sm flex-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{name}</span>
        {school && <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${schoolColor}`}>{school}</span>}
        {castTime && <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{castTime}</span>}
        {isConc && (
          <span className="text-xs font-bold text-yellow-400" title="Concentration">
            C
          </span>
        )}
        {isRitual && (
          <span className="text-xs font-bold text-blue-400" title="Ritual">
            R
          </span>
        )}
        <span
          className={`text-xs inline-block transition-transform duration-200 ${expanded ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
        >
          ▼
        </span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className={`px-3 pb-3 border-t text-xs ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
            {detailItems.map(({ label, value }) => (
              <div key={label}>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{label}: </span>
                <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>{value}</span>
              </div>
            ))}
          </div>
          {effect && (
            <div className="mt-2">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Effect: </span>
              <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>{effect}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CustomSpellCard: user-created editable spell ────────────────────────────
interface CustomSpellCardProps {
  spell: any;
  level: number;
  isDarkMode: boolean;
  updateCustomSpell: (level: number, spellId: string, field: string, value: string) => void;
  removeCustomSpell: (level: number, spellId: string) => void;
}

function CustomSpellCard({ spell, level, isDarkMode, updateCustomSpell, removeCustomSpell }: CustomSpellCardProps) {
  const [expanded, setExpanded] = useState(true);

  const inputBase = `bg-transparent text-xs border-none outline-none w-full ${
    isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
  }`;

  const fieldBox = `rounded px-2 py-1 ${isDarkMode ? 'bg-black/25' : 'bg-white border border-gray-200'}`;

  const editFields = [
    { label: 'School', field: 'School', value: spell.School || spell.school || '' },
    { label: 'Casting Time', field: 'CastingTime', value: spell.CastingTime || spell.casting_time || '' },
    { label: 'Range', field: 'Range', value: spell.Range || spell.range || '' },
    { label: 'Area/Targets', field: 'Area or Targets', value: spell['Area or Targets'] || spell.area_of_effect || '' },
    { label: 'Save/Attack', field: 'Save or Attack', value: spell['Save or Attack'] || spell.save || '' },
    { label: 'Duration', field: 'Duration', value: spell.Duration || spell.duration || '' },
    { label: 'Tags', field: 'Tags', value: spell.Tags || spell.tags || '' },
    { label: 'Components', field: 'Comp', value: spell.Comp || spell.components || '' },
  ];

  return (
    <div
      className={`rounded-lg border ${
        isDarkMode ? 'bg-orange-950/25 border-orange-700/40' : 'bg-orange-50 border-orange-200'
      }`}
    >
      {/* Header with name input + controls */}
      <div className="flex items-center gap-2 px-3 py-2">
        <input
          type="text"
          value={spell.Name || spell.name || ''}
          onChange={(e) => updateCustomSpell(level, spell.id, 'Name', e.target.value)}
          className={`${inputBase} font-semibold text-sm flex-1`}
          placeholder="Spell name..."
        />
        <span className={`text-xs italic ${isDarkMode ? 'text-orange-400/60' : 'text-orange-500/70'}`}>custom</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`text-xs inline-block transition-transform duration-200 ${expanded ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
          title={expanded ? 'Collapse' : 'Expand'}
        >
          ▼
        </button>
        <button
          onClick={() => removeCustomSpell(level, spell.id)}
          className="text-red-400 hover:text-red-300 text-xs w-4 h-4 flex items-center justify-center"
          title="Remove spell"
        >
          ✕
        </button>
      </div>

      {/* Expanded editing fields */}
      {expanded && (
        <div className={`px-3 pb-3 border-t ${isDarkMode ? 'border-orange-700/30' : 'border-orange-200'}`}>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {editFields.map(({ label, field, value }) => (
              <div key={field} className={fieldBox}>
                <div className={`text-xs font-medium mb-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {label}
                </div>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateCustomSpell(level, spell.id, field, e.target.value)}
                  className={inputBase}
                  placeholder={label + '...'}
                />
              </div>
            ))}
          </div>
          {/* Effect textarea — full width */}
          <div className={`mt-2 ${fieldBox}`}>
            <div className={`text-xs font-medium mb-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Effect</div>
            <textarea
              value={spell.Effect || spell.description || spell.effect || ''}
              onChange={(e) => updateCustomSpell(level, spell.id, 'Effect', e.target.value)}
              className={`${inputBase} resize-none`}
              placeholder="Effect..."
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SpellLevelSection: collapsible accordion per spell level ─────────────────
interface SpellLevelSectionProps {
  level: number;
  label: string;
  knownSpells: any[];
  customSpellsForLevel: any[];
  isDarkMode: boolean;
  addCustomSpell: (level: number) => void;
  removeCustomSpell: (level: number, spellId: string) => void;
  updateCustomSpell: (level: number, spellId: string, field: string, value: string) => void;
  setHoveredSpell: React.Dispatch<React.SetStateAction<any>>;
  setMousePosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

function SpellLevelSection({
  level,
  label,
  knownSpells,
  customSpellsForLevel,
  isDarkMode,
  addCustomSpell,
  removeCustomSpell,
  updateCustomSpell,
  setHoveredSpell,
  setMousePosition,
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
        <div className={`px-4 pb-4 pt-2 space-y-1.5 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
          {totalCount === 0 ? (
            <p className={`text-sm italic py-2 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              No spells — use + to add a custom one
            </p>
          ) : (
            <>
              {knownSpells.map((spell, i) => (
                <SpellCard
                  key={i}
                  spell={spell}
                  isDarkMode={isDarkMode}
                  onMouseEnter={(e) => {
                    setHoveredSpell(spell);
                    setMousePosition({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setHoveredSpell(null)}
                />
              ))}
              {customSpellsForLevel.map((spell) => (
                <CustomSpellCard
                  key={spell.id}
                  spell={spell}
                  level={level}
                  isDarkMode={isDarkMode}
                  updateCustomSpell={updateCustomSpell}
                  removeCustomSpell={removeCustomSpell}
                />
              ))}
            </>
          )}
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
  hoveredSpell: _hoveredSpell,
  setHoveredSpell,
  mousePosition: _mousePosition,
  setMousePosition,
}: SpellsTabProps) {
  return (
    <div className="space-y-8">
      {/* Top Row: Spellcasting Controls and Spell Slots Side by Side */}
      <div className="grid grid-cols-2 gap-6 items-start">
        {/* Left: Spellcasting Controls */}
        <div className={`p-6 rounded-lg border h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}>
          <div className="grid grid-cols-2 gap-4">
            {/* Spellcasting Ability */}
            <div className="text-center">
              <label className={`block text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Spellcasting Ability
              </label>
              <div
                className={`w-full px-3 py-2 rounded border text-center font-bold cursor-help ${
                  isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
                title={`Auto-determined by class: ${character.class} uses ${getSpellcastingAbility()}`}
              >
                {getSpellcastingAbility().charAt(0).toUpperCase() + getSpellcastingAbility().slice(1)}
              </div>
            </div>

            {/* Number of Known/Prepared Spells */}
            <div className="text-center">
              <label className={`block text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Known/Prepared Spells
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={getEffectiveKnownSpells()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const calculated = calculateKnownSpells();
                    setKnownSpellsOverride(value === calculated ? null : value);
                    setCharacter({ ...character, knownPreparedSpells: value });
                  }}
                  onFocus={(e) => e.target.select()}
                  className={`w-full px-3 py-2 rounded border text-center font-bold ${
                    knownSpellsOverride !== null
                      ? 'bg-orange-900 border-orange-500 text-white'
                      : isDarkMode
                        ? 'bg-transparent border-slate-600 text-white'
                        : 'bg-transparent border-gray-400 text-gray-900'
                  } focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  title={
                    knownSpellsOverride !== null
                      ? `Manual override: ${knownSpellsOverride} (Auto: ${calculateKnownSpells()})`
                      : `Auto-calculated: ${calculateKnownSpells()}`
                  }
                />
                {knownSpellsOverride !== null && (
                  <button
                    onClick={() => {
                      setKnownSpellsOverride(null);
                      setCharacter({ ...character, knownPreparedSpells: calculateKnownSpells() });
                    }}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300 text-xs"
                    title="Reset to auto-calculated value"
                  >
                    ↻
                  </button>
                )}
              </div>
            </div>

            {/* Spell DC */}
            <div className="text-center">
              <label className={`block text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Spell DC
              </label>
              <div
                className={`w-full px-3 py-2 rounded border text-center font-bold cursor-help ${
                  isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
                title={`Auto-calculated: 8 + Prof Bonus (${character.proficiencyBonus}) + ${getSpellcastingAbility().toUpperCase()} Mod (${getModifier(getFinalAbilityScore(getSpellcastingAbility())) >= 0 ? '+' : ''}${getModifier(getFinalAbilityScore(getSpellcastingAbility()))})`}
              >
                {calculateSpellDC()}
              </div>
            </div>

            {/* Spell Attack */}
            <div className="text-center">
              <label className={`block text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Spell Attack
              </label>
              <div
                className={`w-full px-3 py-2 rounded border text-center font-bold cursor-help ${
                  isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
                title={`Auto-calculated: Prof Bonus (${character.proficiencyBonus}) + ${getSpellcastingAbility().toUpperCase()} Mod (${getModifier(getFinalAbilityScore(getSpellcastingAbility())) >= 0 ? '+' : ''}${getModifier(getFinalAbilityScore(getSpellcastingAbility()))})`}
              >
                {calculateSpellAttack() >= 0 ? '+' : ''}
                {calculateSpellAttack()}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Spell Slots / Sorcery Points Tracker */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}>
          {character.class === 'Sorcerer' ? (
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  Sorcery Points
                </h3>
                <div className="flex items-center gap-4 mb-2">
                  <div
                    className={`flex-1 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-8 relative overflow-hidden`}
                  >
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${character.sorceryPoints.max > 0 ? ((character.sorceryPoints.max - character.sorceryPoints.used) / character.sorceryPoints.max) * 100 : 0}%`,
                        backgroundColor: (() => {
                          const remaining = character.sorceryPoints.max - character.sorceryPoints.used;
                          const percentage =
                            character.sorceryPoints.max > 0 ? remaining / character.sorceryPoints.max : 0;
                          if (percentage <= 0.25) return '#ef4444';
                          if (percentage <= 0.5) return '#f59e0b';
                          if (percentage <= 0.75) return '#eab308';
                          return '#10b981';
                        })(),
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} drop-shadow-md`}
                      >
                        {character.sorceryPoints.max - character.sorceryPoints.used} / {character.sorceryPoints.max}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                      className={`px-3 py-1 text-sm rounded border transition-colors ${isDarkMode ? 'bg-red-900/50 border-red-400/25 text-red-50 hover:bg-red-800/65' : 'bg-red-200 border-red-300 text-red-700 hover:bg-red-300'}`}
                      disabled={character.sorceryPoints.used >= character.sorceryPoints.max}
                    >
                      -
                    </button>
                    <button
                      onClick={() =>
                        setCharacter((prev) => ({
                          ...prev,
                          sorceryPoints: { ...prev.sorceryPoints, used: Math.max(0, prev.sorceryPoints.used - 1) },
                        }))
                      }
                      className={`px-3 py-1 text-sm rounded border transition-colors ${isDarkMode ? 'bg-emerald-700/60 border-emerald-400/25 text-emerald-50 hover:bg-emerald-600/75' : 'bg-green-200 border-green-300 text-green-700 hover:bg-green-300'}`}
                      disabled={character.sorceryPoints.used <= 0}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} italic`}>
                  You regain all expended Sorcery Points on a long rest.
                </p>
              </div>

              <div>
                <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Sorcery Point Costs
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`p-3 rounded border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-gray-200 border-gray-300'}`}
                  >
                    <table className="w-full text-xs">
                      <thead>
                        <tr className={`border-b ${isDarkMode ? 'border-slate-500' : 'border-gray-400'}`}>
                          <th className={`text-left py-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Spell Level
                          </th>
                          <th className={`text-right py-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className={`py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cantrip</td>
                          <td className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>0</td>
                        </tr>
                        <tr>
                          <td className={`py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>1st</td>
                          <td className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>2</td>
                        </tr>
                        <tr>
                          <td className={`py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>2nd</td>
                          <td className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>3</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    className={`p-3 rounded border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-gray-200 border-gray-300'}`}
                  >
                    <table className="w-full text-xs">
                      <thead>
                        <tr className={`border-b ${isDarkMode ? 'border-slate-500' : 'border-gray-400'}`}>
                          <th className={`text-left py-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Spell Level
                          </th>
                          <th className={`text-right py-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className={`py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>3rd</td>
                          <td className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>5</td>
                        </tr>
                        <tr>
                          <td className={`py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>4th</td>
                          <td className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>6</td>
                        </tr>
                        <tr>
                          <td className={`py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>5th</td>
                          <td className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>7</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <button
                  onClick={() =>
                    setCharacter((prev) => ({ ...prev, sorceryPoints: { ...prev.sorceryPoints, used: 0 } }))
                  }
                  className={`px-3 py-1 text-xs rounded border transition-colors ${isDarkMode ? 'bg-emerald-700/60 border-emerald-400/25 text-emerald-50 hover:bg-emerald-600/75' : 'bg-green-200 border-green-300 text-green-700 hover:bg-green-300'}`}
                >
                  Long Rest (Restore All)
                </button>
              </div>
            </div>
          ) : Object.keys(spellSlots).length > 0 ? (
            <div className="flex items-start gap-4">
              <div
                className={`flex flex-col items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-bold mt-8`}
              >
                <div className="transform -rotate-90 whitespace-nowrap">TOTAL</div>
                <div className="transform -rotate-90 whitespace-nowrap mt-8">SLOTS</div>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-9 gap-1 items-start">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => {
                    const slots = spellSlots[level];
                    const hasSlots = slots && slots.max > 0;
                    const levelColors = {
                      1: {
                        bg: 'bg-blue-100',
                        border: 'border-blue-300',
                        text: 'text-blue-800',
                        slot: 'border-blue-400',
                        slotUsed: 'bg-blue-500',
                        slotHover: 'hover:bg-blue-200',
                      },
                      2: {
                        bg: 'bg-green-100',
                        border: 'border-green-300',
                        text: 'text-green-800',
                        slot: 'border-green-400',
                        slotUsed: 'bg-green-500',
                        slotHover: 'hover:bg-green-200',
                      },
                      3: {
                        bg: 'bg-purple-100',
                        border: 'border-purple-300',
                        text: 'text-purple-800',
                        slot: 'border-purple-400',
                        slotUsed: 'bg-purple-500',
                        slotHover: 'hover:bg-purple-200',
                      },
                      4: {
                        bg: 'bg-red-100',
                        border: 'border-red-300',
                        text: 'text-red-800',
                        slot: 'border-red-400',
                        slotUsed: 'bg-red-500',
                        slotHover: 'hover:bg-red-200',
                      },
                      5: {
                        bg: 'bg-yellow-100',
                        border: 'border-yellow-300',
                        text: 'text-yellow-800',
                        slot: 'border-yellow-400',
                        slotUsed: 'bg-yellow-500',
                        slotHover: 'hover:bg-yellow-200',
                      },
                      6: {
                        bg: 'bg-indigo-100',
                        border: 'border-indigo-300',
                        text: 'text-indigo-800',
                        slot: 'border-indigo-400',
                        slotUsed: 'bg-indigo-500',
                        slotHover: 'hover:bg-indigo-200',
                      },
                      7: {
                        bg: 'bg-pink-100',
                        border: 'border-pink-300',
                        text: 'text-pink-800',
                        slot: 'border-pink-400',
                        slotUsed: 'bg-pink-500',
                        slotHover: 'hover:bg-pink-200',
                      },
                      8: {
                        bg: 'bg-cyan-100',
                        border: 'border-cyan-300',
                        text: 'text-cyan-800',
                        slot: 'border-cyan-400',
                        slotUsed: 'bg-cyan-500',
                        slotHover: 'hover:bg-cyan-200',
                      },
                      9: {
                        bg: 'bg-orange-100',
                        border: 'border-orange-300',
                        text: 'text-orange-800',
                        slot: 'border-orange-400',
                        slotUsed: 'bg-orange-500',
                        slotHover: 'hover:bg-orange-200',
                      },
                    };
                    const colors = levelColors[level as keyof typeof levelColors];
                    // levelColors is a light-mode pastel set; on the dark glass
                    // those painted bright blocks. Dark mode keeps the hue on
                    // the level number and the pips, but the box itself goes
                    // translucent like every other well. Class names are spelled
                    // out because Tailwind can't see interpolated ones.
                    const darkLevelText: Record<number, string> = {
                      1: 'text-blue-300',
                      2: 'text-green-300',
                      3: 'text-purple-300',
                      4: 'text-red-300',
                      5: 'text-yellow-300',
                      6: 'text-indigo-300',
                      7: 'text-pink-300',
                      8: 'text-cyan-300',
                      9: 'text-orange-300',
                    };
                    const boxClass = isDarkMode ? 'bg-black/25 border-white/15' : colors.bg + ' ' + colors.border;
                    const levelTextClass = isDarkMode ? darkLevelText[level] : colors.text;

                    return (
                      <div
                        key={level}
                        className={`flex flex-col items-center relative ${hasSlots ? 'p-1 rounded-lg border ' + boxClass : ''}`}
                      >
                        {hasSlots && (
                          <div className="absolute -top-1 -right-1 flex gap-1">
                            <button
                              onClick={() =>
                                setSpellSlots((prev) => ({
                                  ...prev,
                                  [level]: { ...prev[level], used: Math.max(0, prev[level].used - 1) },
                                }))
                              }
                              className="w-3 h-3 bg-red-700/75 hover:bg-red-600/85 text-white text-xs font-bold rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                              title="Restore one slot"
                              disabled={slots.used <= 0}
                            >
                              -
                            </button>
                            <button
                              onClick={() =>
                                setSpellSlots((prev) => ({
                                  ...prev,
                                  [level]: { ...prev[level], used: Math.min(prev[level].max, prev[level].used + 1) },
                                }))
                              }
                              className="w-3 h-3 bg-emerald-700/75 hover:bg-emerald-600/85 text-white text-xs font-bold rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                              title="Use one slot"
                              disabled={slots.used >= slots.max}
                            >
                              +
                            </button>
                          </div>
                        )}
                        <div
                          className={`w-8 h-8 flex items-center justify-center border-2 mb-2 rounded transition-all duration-300 ${hasSlots ? colors.bg + ' ' + colors.border + ' ' + colors.text + ' shadow-sm' : 'bg-gray-600 border-gray-500 text-gray-400'}`}
                        >
                          <span className="text-sm font-bold">{hasSlots ? slots.max : 0}</span>
                        </div>
                        <div
                          className={`text-xs mb-1 font-bold transition-colors duration-300 ${hasSlots ? levelTextClass : 'text-gray-400'}`}
                        >
                          {level}
                        </div>
                        <div className="flex flex-col gap-1 items-center">
                          {hasSlots &&
                            Array.from({ length: slots.max }, (_, index) => (
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
                                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 hover:scale-125 hover:shadow-lg ${
                                  index < slots.used
                                    ? colors.slotUsed + ' border-gray-300 hover:brightness-110 shadow-md'
                                    : 'bg-transparent ' +
                                      colors.slot +
                                      ' ' +
                                      colors.slotHover +
                                      ' hover:border-2 hover:shadow-md'
                                }`}
                                title={index < slots.used ? 'Click to restore this slot' : 'Click to use this slot'}
                              />
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} py-8`}>
              <p>
                No spell slots available for {character.class} level {character.level}
              </p>
              <p className="text-xs mt-2">Some classes gain spellcasting at higher levels</p>
            </div>
          )}

          {/* Rest Buttons */}
          <div className="flex gap-2 justify-end mt-6">
            <button
              onClick={shortRest}
              className={`px-3 py-1 text-xs rounded border transition-colors ${isDarkMode ? 'bg-sky-800/55 border-sky-400/25 text-sky-50 hover:bg-sky-700/70' : 'bg-blue-200 border-blue-300 text-blue-700 hover:bg-blue-300'}`}
            >
              Short Rest {character.class === 'Warlock' ? '(Restore All)' : ''}
            </button>
            <button
              onClick={longRest}
              className={`px-3 py-1 text-xs rounded border transition-colors ${isDarkMode ? 'bg-emerald-700/60 border-emerald-400/25 text-emerald-50 hover:bg-emerald-600/75' : 'bg-green-200 border-green-300 text-green-700 hover:bg-green-300'}`}
            >
              Long Rest (Restore All)
            </button>
          </div>
        </div>
      </div>

      {/* Spell Level Accordion Sections */}
      <div className="space-y-3">
        <SpellLevelSection
          level={0}
          label="Cantrips"
          knownSpells={getKnownSpellsForLevel(0)}
          customSpellsForLevel={customSpells[0] || []}
          isDarkMode={isDarkMode}
          addCustomSpell={addCustomSpell}
          removeCustomSpell={removeCustomSpell}
          updateCustomSpell={updateCustomSpell}
          setHoveredSpell={setHoveredSpell}
          setMousePosition={setMousePosition}
        />
        {Array.from({ length: 9 }, (_, i) => i + 1)
          .filter((level) => getAccessibleSpellLevels(character.class, character.level).includes(level))
          .map((level) => (
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
              setHoveredSpell={setHoveredSpell}
              setMousePosition={setMousePosition}
            />
          ))}
      </div>
    </div>
  );
}
