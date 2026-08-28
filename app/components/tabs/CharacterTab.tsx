'use client';

import { Character } from '../../types/character';
import { DND_RACES, DND_CLASSES, DND_ALIGNMENTS, GENDER_OPTIONS } from '../../data/dndConstants';

export interface CharacterTabProps {
  character: Character;
  isDarkMode: boolean;
  updateCharacter: (updates: Partial<Character>) => void;
  characterImage: string;
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    languages: string[];
  };
  setProficiencies: React.Dispatch<
    React.SetStateAction<{
      armor: string[];
      weapons: string[];
      tools: string[];
      languages: string[];
    }>
  >;
  getSkillModifier: (skill: string, ability: keyof Character['abilityScores']) => number;
}

// Defined at module scope, not inside CharacterTab — a component declared in a
// render body gets a new identity each render, which remounts the subtree and
// would wipe half-typed text out of the TagGroup input.

// Section title that sits at the TOP of a card, with an orange rule under it
// to echo the rules around the character name.
function SectionHeader({ children, isDarkMode }: { children: React.ReactNode; isDarkMode: boolean }) {
  return (
    <h3
      className={`mb-3 pb-2 border-b text-sm font-bold uppercase tracking-wider ${
        isDarkMode ? 'text-orange-400 border-orange-400/30' : 'text-orange-700 border-orange-700/30'
      }`}
    >
      {children}
    </h3>
  );
}

// Proficiencies render as chips instead of bordered textareas — reads as a
// character sheet, not a web form. Type + Enter (or comma) to add, × to remove.
function TagGroup({
  label,
  items,
  onChange,
  placeholder,
  isDarkMode,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  isDarkMode: boolean;
}) {
  return (
    <div>
      <div
        className={`mb-1.5 text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}
      >
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`group inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${
              isDarkMode ? 'bg-slate-700/70 text-stone-100' : 'bg-stone-200 text-stone-800'
            }`}
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              aria-label={`Remove ${item}`}
              className="opacity-40 transition-opacity hover:opacity-100 hover:text-orange-400"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          placeholder={items.length ? '+' : placeholder}
          onKeyDown={(e) => {
            const input = e.currentTarget;
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              const value = input.value.trim();
              if (value) onChange([...items, value]);
              input.value = '';
            } else if (e.key === 'Backspace' && !input.value && items.length) {
              onChange(items.slice(0, -1));
            }
          }}
          className={`min-w-16 flex-1 bg-transparent text-xs outline-none ${
            isDarkMode ? 'text-stone-100 placeholder-stone-500' : 'text-stone-800 placeholder-stone-400'
          }`}
        />
      </div>
    </div>
  );
}
export default function CharacterTab({
  character,
  isDarkMode,
  updateCharacter,
  characterImage,
  proficiencies,
  setProficiencies,
  getSkillModifier,
}: CharacterTabProps) {
  const cardClass = isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-100 border-stone-300';

  return (
    // Transparent wrapper like the other tabs — each section is its own card
    // so the wallpaper shows between them instead of one solid panel.
    // gap-4 between cards to match the Stats tab.
    <div className={`font-serif space-y-4 ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>
      {/* Top Section: Header + Bio on Left, Portrait on Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Header + Bio */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Title card: quote, name, mantra */}
          <div className={`p-6 rounded-lg border shadow-xl ${cardClass}`}>
            {/* Decorative Header */}
            <div
              className={`text-center border-b-2 border-t-2 py-3 ${isDarkMode ? 'border-orange-400' : 'border-stone-400'}`}
            >
              <div className="mb-1">
                <textarea
                  value={
                    character.backstory.personalityTraits ||
                    'I am eager to learn new things and ask many questions. I speak in metaphors and parables.'
                  }
                  onChange={(e) =>
                    updateCharacter({
                      backstory: { ...character.backstory, personalityTraits: e.target.value },
                    })
                  }
                  className={`w-full bg-transparent italic text-lg text-center border-none outline-none resize-none ${isDarkMode ? 'text-stone-300' : 'text-stone-600'} placeholder-stone-400`}
                  placeholder="Character description..."
                  rows={2}
                />
              </div>
              <h1 className="text-4xl font-extrabold tracking-wider mb-2 font-serif">
                {character.trueName?.toUpperCase() || 'CHARACTER NAME'}
              </h1>
              <div
                className={`py-1 px-3 inline-block rounded shadow-lg ${isDarkMode ? 'bg-orange-600 text-white' : 'bg-red-700 text-white'}`}
              >
                <input
                  type="text"
                  value={character.mantra || 'Knowledge is the greatest treasure'}
                  onChange={(e) => updateCharacter({ mantra: e.target.value })}
                  className="bg-transparent font-semibold text-lg text-center border-none outline-none text-white placeholder-white/70"
                  placeholder="Character mantra or quote"
                />
              </div>
            </div>
          </div>

          {/* Body card: backstory. flex-1 so it fills down to the portrait's bottom edge. */}
          <div className={`flex-1 p-6 rounded-lg border shadow-xl ${cardClass}`}>
            <div className="leading-relaxed text-sm space-y-3">
              <div className="prose prose-sm max-w-none">
                <textarea
                  value={
                    character.backstory.backstoryText ||
                    `Elara was raised in the shadowed halls of Candlekeep, where dust-laden tomes whispered secrets of forgotten ages. Surrounded by the endless hush of parchment and ink, she fed her restless hunger for knowledge until the arcane bent willingly to her will. The library became less a sanctuary and more a crucible, shaping her mind into a weapon of runes and power.\n\nNow she wanders the world, a silhouette against storm and moonlight, chasing the echoes of spells long buried. Her journey is not for riches nor fame, but for the shards of magic the world itself has tried to forget. Wherever she walks, shadows stir—and those who cross her path learn that knowledge, once unearthed, can be as dangerous as any blade.\n\nIdeals: Knowledge is power, and the key to all other forms of power.\n\nBonds: The library where I learned to read was my sanctuary. I must protect it.\n\nFlaws: I overlook obvious solutions in favor of complicated ones.`
                  }
                  onChange={(e) =>
                    updateCharacter({
                      backstory: { ...character.backstory, backstoryText: e.target.value },
                    })
                  }
                  className={`w-full bg-transparent border-none outline-none resize-none leading-relaxed text-sm ${isDarkMode ? 'text-stone-100' : 'text-stone-800'} placeholder-stone-400`}
                  placeholder="Character backstory..."
                  rows={12}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Character Portrait */}
        <div
          className={`rounded-lg shadow-2xl overflow-hidden border-4 w-full ${isDarkMode ? 'border-orange-400 bg-slate-800' : 'border-stone-300 bg-gray-100'}`}
        >
          {characterImage ? (
            <img src={characterImage} alt="Character portrait" className="w-full h-full object-cover" />
          ) : (
            <div
              className={`w-full h-full min-h-[500px] flex items-center justify-center ${isDarkMode ? 'bg-slate-700 text-stone-400' : 'bg-stone-200 text-stone-500'}`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">⚔️</div>
                <p className="text-sm">Portrait Place Holder</p>
                <p className="text-xs mt-2">Upload in the Data Tab</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Roleplay Notes Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Your Nature */}
        <div className={`p-4 rounded-lg border shadow-xl ${cardClass}`}>
          <SectionHeader isDarkMode={isDarkMode}>Your Nature</SectionHeader>
          <textarea
            value={character.backstory.roleplayNotes || ''}
            onChange={(e) =>
              updateCharacter({
                backstory: { ...character.backstory, roleplayNotes: e.target.value },
              })
            }
            className={`w-full bg-transparent resize-none leading-relaxed text-sm outline-none ${
              isDarkMode ? 'text-stone-100 placeholder-stone-500' : 'text-stone-800 placeholder-stone-400'
            }`}
            placeholder="• Silent, observant, strikes from shadows&#10;• Uncomfortable around crowds of people&#10;• Protective of natural places and creatures&#10;• Struggles with the rage that led to the village massacre&#10;• Seeking redemption through control and purpose&#10;• The sickle is both weapon and reminder: 'Burn, or grow'"
            rows={6}
          />
        </div>

        {/* Right: Character Arc Hooks */}
        <div className={`p-4 rounded-lg border shadow-xl ${cardClass}`}>
          <SectionHeader isDarkMode={isDarkMode}>Character Arc Hooks</SectionHeader>
          <textarea
            value={character.backstory.arcHooks || ''}
            onChange={(e) =>
              updateCharacter({
                backstory: { ...character.backstory, arcHooks: e.target.value },
              })
            }
            className={`w-full bg-transparent resize-none leading-relaxed text-sm outline-none ${
              isDarkMode ? 'text-stone-100 placeholder-stone-500' : 'text-stone-800 placeholder-stone-400'
            }`}
            placeholder="• War is coming - must learn to fight alongside humans&#10;• Runa is out there somewhere with the survivors&#10;• The vision showed him fighting beside three strangers&#10;• Elariel's words: 'Learn their steps, their hungers, their griefs'"
            rows={6}
          />
        </div>
      </div>

      {/* Bottom Section: Proficiencies on Left, Profile Details & Ability Scores on Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Proficiencies & Languages */}
        <div>
          {/* Proficiencies & Languages Section */}
          <div className={`rounded-lg border shadow-xl p-4 ${cardClass}`}>
            <SectionHeader isDarkMode={isDarkMode}>Proficiencies &amp; Languages</SectionHeader>

            <div className="space-y-4">
              <TagGroup
                label="Armor"
                items={proficiencies.armor}
                onChange={(armor) => setProficiencies({ ...proficiencies, armor })}
                placeholder="Light armor, Medium armor, Shields"
                isDarkMode={isDarkMode}
              />
              <TagGroup
                label="Weapons"
                items={proficiencies.weapons}
                onChange={(weapons) => setProficiencies({ ...proficiencies, weapons })}
                placeholder="Simple weapons, Martial weapons"
                isDarkMode={isDarkMode}
              />
              <TagGroup
                label="Tools"
                items={proficiencies.tools}
                onChange={(tools) => setProficiencies({ ...proficiencies, tools })}
                placeholder="Thieves' tools, Herbalism kit"
                isDarkMode={isDarkMode}
              />
              <TagGroup
                label="Languages"
                items={proficiencies.languages}
                onChange={(languages) => setProficiencies({ ...proficiencies, languages })}
                placeholder="Common, Elvish, Draconic"
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
        {/* Right Column: Profile Details & Ability Scores */}
        <div className="md:col-span-2 space-y-4">
          {/* Profile Details Section */}
          <div
            className={`border-2 p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-100 border-stone-300'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                {/* True Name */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">True Name:</span>
                  <input
                    type="text"
                    value={character.trueName || 'Marcille Donato'}
                    onChange={(e) => updateCharacter({ trueName: e.target.value })}
                    className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}
                  />
                </div>

                {/* Age */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Age:</span>
                  <input
                    type="text"
                    value={character.age || '50 years old'}
                    onChange={(e) => updateCharacter({ age: e.target.value })}
                    className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}
                  />
                </div>

                {/* Race */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Race:</span>
                  <select
                    value={character.race}
                    onChange={(e) => updateCharacter({ race: e.target.value })}
                    className={`flex-1 outline-none ${isDarkMode ? 'bg-slate-800 text-stone-200' : 'bg-stone-50 text-stone-800'}`}
                  >
                    {DND_RACES.map((race) => (
                      <option key={race} value={race}>
                        {race}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Gender:</span>
                  <select
                    value={character.gender || 'Female'}
                    onChange={(e) => updateCharacter({ gender: e.target.value })}
                    className={`flex-1 outline-none ${isDarkMode ? 'bg-slate-800 text-stone-200' : 'bg-stone-50 text-stone-800'}`}
                  >
                    {GENDER_OPTIONS.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Birthplace */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Birthplace:</span>
                  <input
                    type="text"
                    value={character.birthplace || 'Northern Continent'}
                    onChange={(e) => updateCharacter({ birthplace: e.target.value })}
                    className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}
                  />
                </div>

                {/* Family */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Kin:</span>
                  <input
                    type="text"
                    value={character.family || 'Common, Elvish'}
                    onChange={(e) => updateCharacter({ family: e.target.value })}
                    className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}
                  />
                </div>

                {/* Physique */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Physique:</span>
                  <input
                    type="text"
                    value={character.physique || 'Height, roughly 160cm'}
                    onChange={(e) => updateCharacter({ physique: e.target.value })}
                    className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {/* Likes */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Likes:</span>
                  <input
                    type="text"
                    value={character.likes || 'Seafood, nuts'}
                    onChange={(e) => updateCharacter({ likes: e.target.value })}
                    className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}
                  />
                </div>

                {/* Dislikes */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Dislikes:</span>
                  <input
                    type="text"
                    value={character.dislikes || 'Any sort of weird food'}
                    onChange={(e) => updateCharacter({ dislikes: e.target.value })}
                    className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}
                  />
                </div>

                {/* Flaws */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Flaws:</span>
                  <input
                    type="text"
                    value={character.flaws || ''}
                    onChange={(e) => updateCharacter({ flaws: e.target.value })}
                    className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}
                    placeholder="Character flaws..."
                  />
                </div>

                {/* Nicknames */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Nicknames:</span>
                  <input
                    type="text"
                    value={character.nicknames || ''}
                    onChange={(e) => updateCharacter({ nicknames: e.target.value })}
                    className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}
                    placeholder="Character nicknames..."
                  />
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Alignment:</span>
                  <select
                    value={character.alignment}
                    onChange={(e) => updateCharacter({ alignment: e.target.value })}
                    className={`flex-1 outline-none ${isDarkMode ? 'bg-slate-800 text-stone-200' : 'bg-stone-50 text-stone-800'}`}
                  >
                    {DND_ALIGNMENTS.map((alignment) => (
                      <option key={alignment} value={alignment}>
                        {alignment}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Background */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Background:</span>
                  <input
                    type="text"
                    value={character.background}
                    onChange={(e) => updateCharacter({ background: e.target.value })}
                    className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}
                  />
                </div>

                {/* Class */}
                <div className="flex items-center gap-2">
                  <span className="font-bold">Class:</span>
                  <select
                    value={character.class}
                    onChange={(e) => updateCharacter({ class: e.target.value })}
                    className={`flex-1 outline-none ${isDarkMode ? 'bg-slate-800 text-stone-200' : 'bg-stone-50 text-stone-800'}`}
                  >
                    {DND_CLASSES.map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Ability Scores Radar Chart */}
            <div className="mt-6 pt-4 border-t border-stone-300">
              <div className="flex flex-wrap items-center justify-center gap-6">
                {/* Ability Scores Radar Chart */}
                <div className="w-50 h-50 relative">
                  <svg viewBox="0 0 320 320" className="w-full h-full">
                    {/* Background circles */}
                    {[1, 2, 3, 4, 5].map((level) => (
                      <circle
                        key={level}
                        cx="160"
                        cy="160"
                        r={level * 30}
                        fill="none"
                        stroke={isDarkMode ? '#475569' : '#d1d5db'}
                        strokeWidth="1"
                        opacity="0.3"
                      />
                    ))}

                    {/* Grid lines */}
                    {Object.entries(character.abilityScores).map(([ability, score], index) => {
                      const angle = (index * 60 - 90) * (Math.PI / 180);
                      const x2 = 160 + Math.cos(angle) * 150;
                      const y2 = 160 + Math.sin(angle) * 150;

                      return (
                        <line
                          key={ability}
                          x1="160"
                          y1="160"
                          x2={x2}
                          y2={y2}
                          stroke={isDarkMode ? '#475569' : '#d1d5db'}
                          strokeWidth="1"
                          opacity="0.3"
                        />
                      );
                    })}

                    {/* Data polygon */}
                    <polygon
                      points={Object.entries(character.abilityScores)
                        .map(([ability, score], index) => {
                          const normalizedScore = Math.min(score, 20) * 7.5; // Scale 1-20 to 0-150 radius
                          const angle = (index * 60 - 90) * (Math.PI / 180);
                          const x = 160 + Math.cos(angle) * normalizedScore;
                          const y = 160 + Math.sin(angle) * normalizedScore;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                      fill={isDarkMode ? 'rgba(249, 115, 22, 0.2)' : 'rgba(239, 68, 68, 0.2)'}
                      stroke={isDarkMode ? '#f97316' : '#ef4444'}
                      strokeWidth="2"
                    />

                    {/* Data points */}
                    {Object.entries(character.abilityScores).map(([ability, score], index) => {
                      const normalizedScore = Math.min(score, 20) * 7.5;
                      const angle = (index * 60 - 90) * (Math.PI / 180);
                      const x = 160 + Math.cos(angle) * normalizedScore;
                      const y = 160 + Math.sin(angle) * normalizedScore;

                      return <circle key={ability} cx={x} cy={y} r="4" fill={isDarkMode ? '#f97316' : '#ef4444'} />;
                    })}

                    {/* Labels */}
                    {Object.entries(character.abilityScores).map(([ability, score], index) => {
                      const angle = (index * 60 - 90) * (Math.PI / 180);
                      const labelX = 160 + Math.cos(angle) * 140;
                      const labelY = 160 + Math.sin(angle) * 140;

                      return (
                        <g key={ability}>
                          <text
                            x={labelX}
                            y={labelY - 5}
                            textAnchor="middle"
                            className={`text-xs font-semibold ${isDarkMode ? 'fill-stone-200' : 'fill-stone-800'}`}
                          >
                            {ability.slice(0, 3).toUpperCase()}
                          </text>
                          <text
                            x={labelX}
                            y={labelY + 8}
                            textAnchor="middle"
                            className={`text-sm font-bold ${isDarkMode ? 'fill-orange-400' : 'fill-red-600'}`}
                          >
                            {score}
                          </text>
                        </g>
                      );
                    })}

                    {/* Value scale indicators */}
                    <text x="170" y="40" className={`text-xs ${isDarkMode ? 'fill-stone-400' : 'fill-stone-600'}`}>
                      20
                    </text>
                    <text x="170" y="70" className={`text-xs ${isDarkMode ? 'fill-stone-400' : 'fill-stone-600'}`}>
                      15
                    </text>
                    <text x="170" y="100" className={`text-xs ${isDarkMode ? 'fill-stone-400' : 'fill-stone-600'}`}>
                      10
                    </text>
                    <text x="170" y="130" className={`text-xs ${isDarkMode ? 'fill-stone-400' : 'fill-stone-600'}`}>
                      5
                    </text>
                  </svg>
                </div>

                {/* Skills Bar Chart */}
                <div className="w-56">
                  <div className="space-y-1">
                    {(() => {
                      // Get all skills with their modifiers
                      const skillsWithModifiers = Object.entries({
                        Acrobatics: 'dexterity',
                        'Animal Handling': 'wisdom',
                        Arcana: 'intelligence',
                        Athletics: 'strength',
                        Deception: 'charisma',
                        History: 'intelligence',
                        Insight: 'wisdom',
                        Intimidation: 'charisma',
                        Investigation: 'intelligence',
                        Medicine: 'wisdom',
                        Nature: 'intelligence',
                        Perception: 'wisdom',
                        Performance: 'charisma',
                        Persuasion: 'charisma',
                        Religion: 'intelligence',
                        'Sleight of Hand': 'dexterity',
                        Stealth: 'dexterity',
                        Survival: 'wisdom',
                      }).map(([skill, ability]) => {
                        const modifier = getSkillModifier(skill, ability as keyof typeof character.abilityScores);
                        return { skill, modifier };
                      });

                      // Sort by modifier and get top 4 and bottom 4
                      const sorted = skillsWithModifiers.sort((a, b) => b.modifier - a.modifier);
                      const topSkills = sorted.slice(0, 4);
                      const bottomSkills = sorted.slice(-4).reverse();
                      const displaySkills = [...topSkills, ...bottomSkills];

                      const maxModifier = Math.max(...displaySkills.map((s) => Math.abs(s.modifier)));

                      return displaySkills.map((item, index) => {
                        const isTop = index < 4;
                        const barWidth = (Math.abs(item.modifier) / (maxModifier || 1)) * 100;
                        const showDivider = index === 3; // Add divider after 4th item (between strongest and weakest)

                        return (
                          <div key={item.skill}>
                            <div className="flex items-center text-xs">
                              <div
                                className={`w-20 text-right pr-2 ${isDarkMode ? 'text-stone-200' : 'text-stone-700'}`}
                              >
                                {item.skill.slice(0, 8)}
                              </div>
                              <div
                                className={`flex-1 relative h-4 rounded overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}
                              >
                                <div
                                  className={`h-full rounded transition-all duration-300 ${
                                    isTop
                                      ? isDarkMode
                                        ? 'bg-orange-500/80'
                                        : 'bg-orange-600/80'
                                      : isDarkMode
                                        ? 'bg-slate-400/50'
                                        : 'bg-stone-400/60'
                                  }`}
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                              <div
                                className={`w-8 text-center font-mono ${isDarkMode ? 'text-stone-200' : 'text-stone-700'}`}
                              >
                                {item.modifier >= 0 ? '+' : ''}
                                {item.modifier}
                              </div>
                            </div>
                            {showDivider && (
                              <div
                                className={`my-2 border-t border-dashed ${isDarkMode ? 'border-stone-500' : 'border-stone-400'}`}
                              ></div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div
                    className={`mt-2 text-xs text-center opacity-60 ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}
                  >
                    <div className="flex justify-center gap-4">
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-3 h-3 rounded ${isDarkMode ? 'bg-orange-500/80' : 'bg-orange-600/80'}`}
                        ></div>
                        <span>Strongest</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded ${isDarkMode ? 'bg-slate-400/50' : 'bg-stone-400/60'}`}></div>
                        <span>Weakest</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
