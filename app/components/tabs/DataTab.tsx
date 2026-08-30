'use client';

import { Character, Feat } from '../../types/character';
import { CLASS_HIT_DICE } from '../../data/dndConstants';
import NumberField from '../NumberField';

export interface DataTabProps {
  character: Character;
  isDarkMode: boolean;
  updateCharacter: (updates: Partial<Character>) => void;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  hitPointRolls: number[];
  setHitPointRolls: React.Dispatch<React.SetStateAction<number[]>>;
  additionalHPBonuses: number;
  setAdditionalHPBonuses: React.Dispatch<React.SetStateAction<number>>;
  hasToughness: boolean;
  setHasToughness: React.Dispatch<React.SetStateAction<boolean>>;
  isPHBHillDwarf: boolean;
  setIsPHBHillDwarf: React.Dispatch<React.SetStateAction<boolean>>;
  speeds: { [key: string]: number };
  setSpeeds: React.Dispatch<React.SetStateAction<any>>;
  calculateHitDice: () => { [key: string]: number };
  initiativeModifiers: any;
  setInitiativeModifiers: React.Dispatch<React.SetStateAction<any>>;
  calculateInitiativeModifier: () => number;
  getFinalAbilityScore: (ability: string) => number;
  getModifier: (score: number) => number;
  asiChoices: any;
  setAsiChoices: React.Dispatch<React.SetStateAction<any>>;
  manualFeats: Feat[];
  addManualFeat: (name: string, description: string) => void;
  vibeEffects: string;
  setVibeEffects: React.Dispatch<React.SetStateAction<string>>;
  vibeOpacity: number;
  setVibeOpacity: React.Dispatch<React.SetStateAction<number>>;
  currentDate: { day: number; season: string; year: number };
  setCurrentDate: React.Dispatch<React.SetStateAction<{ day: number; season: string; year: number }>>;
  seasons: { name: string; days: number }[];
  getMaxDaysForSeason: (season: string) => number;
  carryingSize: string;
  setCarryingSize: React.Dispatch<React.SetStateAction<string>>;
  statsImage: string;
  setStatsImage: React.Dispatch<React.SetStateAction<string>>;
  backgroundImage: string;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;
  backgroundBlur: number;
  setBackgroundBlur: React.Dispatch<React.SetStateAction<number>>;
  glassCards: boolean;
  setGlassCards: React.Dispatch<React.SetStateAction<boolean>>;
  glassFrost: number;
  setGlassFrost: React.Dispatch<React.SetStateAction<number>>;
  characterImage: string;
  setCharacterImage: React.Dispatch<React.SetStateAction<string>>;
  handleImageUrlChange: (url: string, setter: React.Dispatch<React.SetStateAction<string>>) => void;
  skillBonuses: { skill: string; bonus: number }[];
  setSkillBonuses: React.Dispatch<React.SetStateAction<{ skill: string; bonus: number }[]>>;
}

export default function DataTab({
  character,
  isDarkMode,
  updateCharacter,
  setCharacter,
  hitPointRolls,
  setHitPointRolls,
  additionalHPBonuses,
  setAdditionalHPBonuses,
  hasToughness,
  setHasToughness,
  isPHBHillDwarf,
  setIsPHBHillDwarf,
  speeds,
  setSpeeds,
  calculateHitDice,
  initiativeModifiers,
  setInitiativeModifiers,
  calculateInitiativeModifier,
  getFinalAbilityScore,
  getModifier,
  asiChoices,
  setAsiChoices,
  manualFeats,
  addManualFeat,
  vibeEffects,
  setVibeEffects,
  vibeOpacity,
  setVibeOpacity,
  currentDate,
  setCurrentDate,
  seasons,
  getMaxDaysForSeason,
  carryingSize,
  setCarryingSize,
  statsImage,
  setStatsImage,
  backgroundImage,
  setBackgroundImage,
  backgroundBlur,
  setBackgroundBlur,
  glassCards,
  setGlassCards,
  glassFrost,
  setGlassFrost,
  characterImage,
  setCharacterImage,
  handleImageUrlChange,
  skillBonuses,
  setSkillBonuses,
}: DataTabProps) {
  return (
    <div className="space-y-8">
      {/* 4-Column Layout */}
      <div className="grid grid-cols-4 gap-x-6 gap-y-6 items-start">
        {/* Column 1: Level & Hit Points */}
        <div
          className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
        >
          {/* Level Selection */}
          <div className="mb-4">
            <div className="text-xs font-bold text-orange-400 mb-2">Level</div>
            <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your character's level (1-20)
            </div>
            <select
              value={character.level || 1}
              onChange={(e) => updateCharacter({ level: parseInt(e.target.value) })}
              className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 font-bold ${
                isDarkMode
                  ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                  : 'bg-gray-100 border-gray-300 text-gray-900'
              }`}
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <h3 className="text-lg font-semibold text-orange-400 mb-2">Hit Points</h3>
          <div className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Roll for HP at each level. Track your health and hit dice.
          </div>

          {/* HP Levels 1-10 and 11-20 in two columns */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column: Levels 1-10 */}
              <div className="space-y-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`w-6 text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}
                    >
                      {i + 1}
                    </div>
                    <NumberField
                      min="1"
                      max="20"
                      value={hitPointRolls[i] || 0}
                      onCommit={(roll) => {
                        const newRolls = [...hitPointRolls];
                        newRolls[i] = roll;
                        setHitPointRolls(newRolls);
                      }}
                      className={`w-12 text-center text-sm border rounded px-1 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        isDarkMode
                          ? 'bg-black/30 border-white/10 text-white'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              {/* Right Column: Levels 11-20 */}
              <div className="space-y-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i + 10} className="flex items-center gap-2">
                    <div
                      className={`w-6 text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}
                    >
                      {i + 11}
                    </div>
                    <NumberField
                      min="1"
                      max="20"
                      value={hitPointRolls[i + 10] || 0}
                      onCommit={(roll) => {
                        const newRolls = [...hitPointRolls];
                        newRolls[i + 10] = roll;
                        setHitPointRolls(newRolls);
                      }}
                      className={`w-12 text-center text-sm border rounded px-1 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        isDarkMode
                          ? 'bg-black/30 border-white/10 text-white'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Addt'l Bonuses
              </span>
              <NumberField
                value={additionalHPBonuses}
                onCommit={setAdditionalHPBonuses}
                className={`w-16 text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                  isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
                placeholder="+0"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Toughness?
              </span>
              <select
                value={hasToughness ? 'Yes' : 'No'}
                onChange={(e) => setHasToughness(e.target.value === 'Yes')}
                className={`text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                  isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                PHB Hill Dwarf?
              </span>
              <select
                value={isPHBHillDwarf ? 'Yes' : 'No'}
                onChange={(e) => setIsPHBHillDwarf(e.target.value === 'Yes')}
                className={`text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                  isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>

          {/* Sorcery Points */}
          <div
            className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} ${character.class !== 'Sorcerer' ? 'opacity-50' : ''}`}
          >
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Sorcery Points</h3>
            <div className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Maximum Sorcery Points (for Sorcerer class)
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Max Points
              </span>
              <NumberField
                min="0"
                value={character.sorceryPoints.max}
                onCommit={(newMax) =>
                  setCharacter((prev) => ({
                    ...prev,
                    sorceryPoints: {
                      ...prev.sorceryPoints,
                      max: newMax,
                      used: Math.min(prev.sorceryPoints.used, newMax),
                    },
                  }))
                }
                disabled={character.class !== 'Sorcerer'}
                className={`w-16 text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                  character.class !== 'Sorcerer'
                    ? isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-black/30 border-white/10 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
                placeholder="0"
              />
            </div>
          </div>

          {/* Skill Bonuses */}
          <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-slate-600' : 'border-gray-300'}`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-orange-400">Skill Bonuses</h3>
              <button
                onClick={() => {
                  setSkillBonuses([...skillBonuses, { skill: 'Acrobatics', bonus: 0 }]);
                }}
                className="text-orange-400 hover:text-orange-300 transition-colors"
                title="Add Skill Bonus"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Add bonuses to specific skills (e.g., Custom Lineage skill proficiency)
            </div>
            <div className="space-y-2">
              {skillBonuses.map((sb, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={sb.skill}
                    onChange={(e) => {
                      const newBonuses = [...skillBonuses];
                      newBonuses[index].skill = e.target.value;
                      setSkillBonuses(newBonuses);
                    }}
                    className={`flex-1 min-w-0 text-sm border rounded px-2 py-1 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-black/30 border-white/10 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Acrobatics">Acrobatics</option>
                    <option value="Animal Handling">Animal Handling</option>
                    <option value="Arcana">Arcana</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Deception">Deception</option>
                    <option value="History">History</option>
                    <option value="Insight">Insight</option>
                    <option value="Intimidation">Intimidation</option>
                    <option value="Investigation">Investigation</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Nature">Nature</option>
                    <option value="Perception">Perception</option>
                    <option value="Performance">Performance</option>
                    <option value="Persuasion">Persuasion</option>
                    <option value="Religion">Religion</option>
                    <option value="Sleight of Hand">Sleight of Hand</option>
                    <option value="Stealth">Stealth</option>
                    <option value="Survival">Survival</option>
                  </select>
                  <NumberField
                    value={sb.bonus}
                    onCommit={(bonus) => {
                      const newBonuses = [...skillBonuses];
                      newBonuses[index].bonus = bonus;
                      setSkillBonuses(newBonuses);
                    }}
                    className={`w-14 flex-shrink-0 text-center text-sm border rounded px-1 py-1 ${
                      isDarkMode
                        ? 'bg-black/30 border-white/10 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                    placeholder="0"
                  />
                  <button
                    onClick={() => {
                      setSkillBonuses(skillBonuses.filter((_, i) => i !== index));
                    }}
                    className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                </div>
              ))}
              {skillBonuses.length === 0 && <div className="text-sm text-gray-500 italic">No skill bonuses added</div>}
            </div>
          </div>
        </div>

        {/* Column 2: Speed, Hit Die, Initiative */}
        <div className="space-y-6 h-fit">
          {/* Speed Box */}
          <div
            className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
          >
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Speed</h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Enter any base speeds you have below.
            </p>
            <div className="space-y-2">
              {Object.entries(speeds).map(([speedType, value]) => (
                <div key={speedType} className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} capitalize`}>
                    {speedType}
                  </label>
                  <NumberField
                    min="0"
                    value={value}
                    onCommit={(speed) => setSpeeds({ ...speeds, [speedType]: speed })}
                    className={`w-16 text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-black/30 border-white/10 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hit Die Box */}
          <div
            className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
          >
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Hit Die</h3>
            <div className="mb-3">
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Auto-calculated based on your class and level.
              </p>
              <p className="text-xs text-blue-400">
                {character.class}: {CLASS_HIT_DICE[character.class] || 'd8'} × {character.level} level
                {character.level !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(calculateHitDice()).map(([dieType, count]) => (
                <div key={dieType} className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {dieType}
                  </label>
                  <div
                    className={`w-12 text-center text-sm border rounded px-1 py-1 ${
                      count > 0
                        ? isDarkMode
                          ? 'bg-slate-600 border-slate-500 text-white font-bold'
                          : 'bg-gray-100 border-gray-300 text-gray-900 font-bold'
                        : isDarkMode
                          ? 'bg-black/30 border-white/10 text-gray-500'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}
                  >
                    {count}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-400 italic">
              Note: Hit dice are used during short rests to recover HP. You regain spent hit dice on a long rest (up to
              half your total).
            </div>
          </div>

          {/* Initiative Box */}
          <div
            className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
          >
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Initiative</h3>

            {/* Total Initiative Display */}
            <div className="mb-4 text-center">
              <div className="text-xs text-gray-400 mb-1">Total Initiative Modifier</div>
              <div
                className={`text-2xl font-bold px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-black/30 border-white/10 text-orange-400'
                    : 'bg-gray-100 border-gray-300 text-orange-600'
                }`}
              >
                {calculateInitiativeModifier() >= 0 ? '+' : ''}
                {calculateInitiativeModifier()}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                DEX: {getModifier(getFinalAbilityScore('dexterity')) >= 0 ? '+' : ''}
                {getModifier(getFinalAbilityScore('dexterity'))} + Modifiers:{' '}
                {calculateInitiativeModifier() - getModifier(getFinalAbilityScore('dexterity')) >= 0 ? '+' : ''}
                {calculateInitiativeModifier() - getModifier(getFinalAbilityScore('dexterity'))}
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-4">Select applicable modifiers:</p>
            <div className="space-y-2">
              {Object.entries(initiativeModifiers)
                .filter(([key]) => key !== 'additionalBonus')
                .map(([modifier, isChecked]) => (
                  <div key={modifier} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">
                      {modifier === 'jackOfAllTrades'
                        ? 'Jack of All Trades?'
                        : modifier === 'wisMod'
                          ? 'Wis Mod?'
                          : modifier === 'intMod'
                            ? 'Int Mod?'
                            : modifier === 'chaMod'
                              ? 'Cha Mod?'
                              : 'Alert?'}
                    </label>
                    <input
                      id={`init-modifier-${modifier}`}
                      type="checkbox"
                      checked={isChecked as boolean}
                      onChange={(e) =>
                        setInitiativeModifiers({
                          ...initiativeModifiers,
                          [modifier]: e.target.checked,
                        })
                      }
                      className="form-checkbox h-4 w-4 text-amber-500"
                    />
                  </div>
                ))}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Addt'l Bonus</label>
                <NumberField
                  value={initiativeModifiers.additionalBonus}
                  onCommit={(additionalBonus) => setInitiativeModifiers({ ...initiativeModifiers, additionalBonus })}
                  className={`w-16 text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                    isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                  }`}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Feat/ASI Choices & Carrying Size */}
        <div className="space-y-6 h-fit">
          {/* Feat/ASI Choices Box */}
          <div
            className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
          >
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Feat/ASI Choices</h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Track your ability score improvements and feats by level.
            </p>

            <div className="space-y-2">
              {Object.entries(asiChoices).map(([levelKey, choice]: [string, any]) => (
                <div key={levelKey} className="border border-slate-600 rounded p-2">
                  <div className="space-y-1">
                    {/* Level and ASI/Feat Toggle on same row */}
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Level {levelKey.replace('level', '')}
                      </h4>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`${levelKey}-type`}
                            checked={choice.type === 'ASI'}
                            onChange={() => {
                              setAsiChoices((prev: any) => ({
                                ...prev,
                                [levelKey]: { ...prev[levelKey as keyof typeof prev], type: 'ASI' },
                              }));
                            }}
                            className="mr-1"
                          />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>ASI</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`${levelKey}-type`}
                            checked={choice.type === 'Feat'}
                            onChange={() => {
                              setAsiChoices((prev: any) => ({
                                ...prev,
                                [levelKey]: { ...prev[levelKey as keyof typeof prev], type: 'Feat' },
                              }));
                            }}
                            className="mr-1"
                          />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Feat</span>
                        </label>
                      </div>
                    </div>

                    {choice.type === 'ASI' ? (
                      <div className="grid grid-cols-3 gap-1">
                        {Object.entries(choice.abilityIncreases).map(([ability, increase]: [string, any]) => (
                          <label key={ability} className="flex items-center text-xs">
                            <input
                              id={`asi-${levelKey}-${ability}`}
                              type="checkbox"
                              checked={increase > 0}
                              onChange={(e) => {
                                setAsiChoices((prev: any) => {
                                  const currentChoices = prev[levelKey as keyof typeof prev].abilityIncreases;
                                  const checkedCount = Object.values(currentChoices).filter(
                                    (val: any) => val > 0,
                                  ).length;

                                  if (e.target.checked) {
                                    // If trying to check more than 2 boxes, prevent it
                                    if (checkedCount >= 2) {
                                      return prev;
                                    }

                                    // Calculate the bonus: +2 if only one ability, +1 if two abilities
                                    const newCheckedCount = checkedCount + 1;
                                    const bonusPerAbility = newCheckedCount === 1 ? 2 : 1;

                                    // Update all checked abilities with correct bonus
                                    const updatedIncreases = { ...currentChoices };
                                    Object.keys(updatedIncreases).forEach((key) => {
                                      if (updatedIncreases[key as keyof typeof updatedIncreases] > 0) {
                                        updatedIncreases[key as keyof typeof updatedIncreases] = bonusPerAbility;
                                      }
                                    });
                                    updatedIncreases[ability as keyof typeof updatedIncreases] = bonusPerAbility;

                                    return {
                                      ...prev,
                                      [levelKey]: {
                                        ...prev[levelKey as keyof typeof prev],
                                        abilityIncreases: updatedIncreases,
                                      },
                                    };
                                  } else {
                                    // Unchecking a box
                                    const updatedIncreases = { ...currentChoices, [ability]: 0 };

                                    // Recalculate bonuses for remaining checked abilities
                                    const remainingChecked = Object.values(updatedIncreases).filter(
                                      (val: any) => val > 0,
                                    ).length;
                                    const bonusPerAbility = remainingChecked === 1 ? 2 : 1;

                                    Object.keys(updatedIncreases).forEach((key) => {
                                      if (updatedIncreases[key as keyof typeof updatedIncreases] > 0) {
                                        updatedIncreases[key as keyof typeof updatedIncreases] = bonusPerAbility;
                                      }
                                    });

                                    return {
                                      ...prev,
                                      [levelKey]: {
                                        ...prev[levelKey as keyof typeof prev],
                                        abilityIncreases: updatedIncreases,
                                      },
                                    };
                                  }
                                });
                              }}
                              className="mr-1 scale-75"
                            />
                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {ability.slice(0, 3).toUpperCase()}
                            </span>
                            {increase > 0 && <span className="text-green-400 text-xs ml-1">+{increase}</span>}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Feat name..."
                          value={choice.featName}
                          onChange={(e) => {
                            setAsiChoices((prev: any) => ({
                              ...prev,
                              [levelKey]: { ...prev[levelKey as keyof typeof prev], featName: e.target.value },
                            }));
                          }}
                          onBlur={(e) => {
                            // When user finishes typing a feat name, add it to manual feats if not empty
                            if (
                              e.target.value.trim() &&
                              !manualFeats.some((feat) => feat.name === e.target.value.trim())
                            ) {
                              addManualFeat(
                                e.target.value.trim(),
                                `Feat gained at level ${levelKey.replace('level', '')}`,
                              );
                            }
                          }}
                          className={`w-full text-xs border rounded px-2 transition-all duration-200 py-1 ${
                            isDarkMode
                              ? 'bg-black/30 border-white/10 text-white'
                              : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        />
                        <p className="text-xs text-gray-500 italic">
                          This feat will also appear in the Character Features section below.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carrying Size Box */}
          <div
            className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
          >
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Carrying Size</h3>
            <p className="text-xs text-gray-400 mb-4">
              Select the size you count as when determining carrying capacity.
            </p>
            <select
              title="Carrying size for encumbrance"
              value={carryingSize}
              onChange={(e) => setCarryingSize(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
              }`}
            >
              <option value="Tiny">Tiny</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Huge">Huge</option>
              <option value="Gargantuan">Gargantuan</option>
            </select>
          </div>

          {/* Vibe Effects Box */}
          <div
            className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
          >
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Vibe Effects</h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
              Select an ambiance effect for your adventure.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['none', 'rain', 'snow', 'stars', 'magic', 'leaves', 'embers', 'ash', 'desert'].map((effect) => (
                <label key={effect} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="vibeEffect"
                    value={effect}
                    checked={vibeEffects === effect}
                    onChange={(e) => setVibeEffects(e.target.value)}
                    className="mr-2"
                  />
                  <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {effect}
                  </span>
                </label>
              ))}
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Opacity: {vibeOpacity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={vibeOpacity}
                onChange={(e) => setVibeOpacity(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Column 4: Calendar & Images */}
        <div className="space-y-6 h-fit">
          {/* Calendar Box */}
          <div
            className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
          >
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Calendar</h3>
            <p className="text-xs text-gray-400 mb-4">Set the current game date.</p>

            <div className="space-y-3">
              {/* Day and Year Inputs - Side by Side */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Day</label>
                  <select
                    value={currentDate.day}
                    onChange={(e) =>
                      setCurrentDate({
                        ...currentDate,
                        day: parseInt(e.target.value),
                      })
                    }
                    className={`w-full text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                  >
                    {Array.from({ length: getMaxDaysForSeason(currentDate.season) }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Year</label>
                  <input
                    type="number"
                    value={currentDate.year}
                    onChange={(e) =>
                      setCurrentDate({
                        ...currentDate,
                        year: parseInt(e.target.value) || 4122,
                      })
                    }
                    className={`w-full text-center text-sm border rounded px-2 py-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      isDarkMode
                        ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* Season Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Season</label>
                <select
                  value={currentDate.season}
                  onChange={(e) =>
                    setCurrentDate({
                      ...currentDate,
                      season: e.target.value,
                      day: Math.min(currentDate.day, getMaxDaysForSeason(e.target.value)),
                    })
                  }
                  className={`w-full text-sm border rounded px-2 py-1 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                      : 'bg-gray-100 border-gray-300 text-gray-900'
                  }`}
                >
                  {seasons.map((season) => (
                    <option key={season.name} value={season.name}>
                      {season.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images Box */}
          <div
            className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
          >
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Images</h3>
            <p className="text-xs text-gray-400 mb-4">Upload images for character display and background.</p>

            <div className="space-y-2">
              {/* Stats Image URL */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Stats Page Image URL</label>
                <input
                  type="text"
                  placeholder="https://imgur.com/your-image.jpg"
                  value={statsImage}
                  onChange={(e) => handleImageUrlChange(e.target.value, setStatsImage)}
                  className={`w-full text-sm border rounded px-3 py-2 ${
                    isDarkMode
                      ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                {statsImage && (
                  <div className="mt-2">
                    <img src={statsImage} alt="Stats preview" className="w-full h-20 object-cover rounded border" />
                  </div>
                )}
              </div>

              {/* Background Image URL with Blur */}
              <div className="border-t border-white/20 pt-2">
                <label className="text-sm font-medium text-gray-300 mb-2 block">Background Image URL</label>
                <input
                  type="text"
                  placeholder="https://imgur.com/your-background.jpg"
                  value={backgroundImage}
                  onChange={(e) => handleImageUrlChange(e.target.value, setBackgroundImage)}
                  className={`w-full text-sm border rounded px-3 py-2 ${
                    isDarkMode
                      ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <div className="mt-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Blur: {backgroundBlur}px</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={backgroundBlur}
                    onChange={(e) => setBackgroundBlur(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                {backgroundImage && (
                  <div className="mt-2">
                    <img
                      src={backgroundImage}
                      alt="Background preview"
                      className="w-full h-20 object-cover rounded border"
                      style={{ filter: `blur(${backgroundBlur}px)` }}
                    />
                  </div>
                )}
              </div>

              {/* Frosted glass toggle — off restores the solid card panels.
                  Its own section, so the divider lands under the background
                  preview rather than below the switch. */}
              <div className="border-t border-white/20 pt-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="glass-cards" className="text-xs font-medium text-gray-400">
                    Frosted glass cards
                  </label>
                  <button
                    id="glass-cards"
                    type="button"
                    role="switch"
                    aria-checked={glassCards}
                    onClick={() => setGlassCards(!glassCards)}
                    className={`h-5 w-9 shrink-0 rounded-full border transition-colors ${
                      glassCards ? 'bg-orange-500/80 border-orange-400/60' : 'bg-slate-600 border-slate-500'
                    }`}
                  >
                    <span
                      className={`block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                        glassCards ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Frost amount — only meaningful while the glass is on */}
                {glassCards && (
                  <div className="mt-2">
                    <label htmlFor="glass-frost" className="block text-xs font-medium text-gray-400 mb-1">
                      Frost: {glassFrost}%
                    </label>
                    <input
                      id="glass-frost"
                      type="range"
                      min="55"
                      max="90"
                      step="5"
                      value={glassFrost}
                      onChange={(e) => setGlassFrost(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Character Image URL */}
              <div className="border-t border-white/20 pt-2">
                <label className="text-sm font-medium text-gray-300 mb-2 block">Character Tab Image URL</label>
                <input
                  type="text"
                  placeholder="https://imgur.com/your-character.jpg"
                  value={characterImage}
                  onChange={(e) => handleImageUrlChange(e.target.value, setCharacterImage)}
                  className={`w-full text-sm border rounded px-3 py-2 ${
                    isDarkMode
                      ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                {characterImage && (
                  <div className="mt-2">
                    <img
                      src={characterImage}
                      alt="Character preview"
                      className="w-full h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
