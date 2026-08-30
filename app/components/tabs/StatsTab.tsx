'use client';

import { Character, Feat } from '../../types/character';
import { CLASS_HIT_DICE } from '../../data/dndConstants';
import NumberField from '../NumberField';

export interface StatsTabProps {
  character: Character;
  isDarkMode: boolean;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  updateCharacter: (updates: Partial<Character>) => void;
  getFinalAbilityScore: (ability: string) => number;
  getModifier: (score: number) => number;
  getRacialBonus: (ability: string, race: string) => number;
  getAsiBonus: (ability: string) => number;
  getSaveModifier: (save: string, ability: keyof Character['abilityScores']) => number;
  getSkillModifier: (skill: string, ability: keyof Character['abilityScores']) => number;
  calculateTotalAC: () => number;
  calculateInitiativeModifier: () => number;
  getEffectiveMaxHP: () => number;
  calculateMaxHP: () => number;
  formatHitDiceDisplay: () => string;
  calculateWeaponAttackBonus: (weapon: any) => string;
  hitPointRolls: number[];
  additionalHPBonuses: number;
  hasToughness: boolean;
  isPHBHillDwarf: boolean;
  currentHitDice: number;
  setCurrentHitDice: React.Dispatch<React.SetStateAction<number>>;
  damageReduction: number;
  setDamageReduction: React.Dispatch<React.SetStateAction<number>>;
  deathSaves: { failures: boolean[]; successes: boolean[] };
  setDeathSaves: React.Dispatch<React.SetStateAction<{ failures: boolean[]; successes: boolean[] }>>;
  ammunition: Array<{ name: string; weapon: string; amount: string }>;
  updateAmmunition: (index: number, field: string, value: string) => void;
  armor: any;
  updateArmor: (category: string, field: string, value: string) => void;
  ARMOR_DATA: any;
  SHIELD_DATA: any;
  getArmorOptions: () => string[];
  getArmorDisplayName: (armorType: string) => string;
  getShieldOptions: () => string[];
  getMagicalAttireOptions: () => string[];
  characterFeats: Feat[];
  manualFeats: Feat[];
  setManualFeats: React.Dispatch<React.SetStateAction<Feat[]>>;
  addManualFeat: (name: string, description: string) => void;
  removeManualFeat: (index: number) => void;
  quickNotes: string;
  setQuickNotes: React.Dispatch<React.SetStateAction<string>>;
  currentDate: { day: number; season: string; year: number };
  currentWeather: number;
  WeatherIcon: React.ComponentType<{ type: number }>;
  getOrdinalNumber: (num: number) => string;
  quarryUsesRemaining: number;
  setQuarryUsesRemaining: React.Dispatch<React.SetStateAction<number>>;
  getQuarryDie: () => string;
  getMaxQuarryUses: () => number;
  statsImage: string;
}

export default function StatsTab({
  character,
  isDarkMode,
  setCharacter,
  updateCharacter,
  getFinalAbilityScore,
  getModifier,
  getRacialBonus,
  getAsiBonus,
  getSaveModifier,
  getSkillModifier,
  calculateTotalAC,
  calculateInitiativeModifier,
  getEffectiveMaxHP,
  calculateMaxHP,
  formatHitDiceDisplay,
  calculateWeaponAttackBonus,
  hitPointRolls,
  additionalHPBonuses,
  hasToughness,
  isPHBHillDwarf,
  currentHitDice,
  setCurrentHitDice,
  damageReduction,
  setDamageReduction,
  deathSaves,
  setDeathSaves,
  ammunition,
  updateAmmunition,
  armor,
  updateArmor,
  ARMOR_DATA,
  SHIELD_DATA,
  getArmorOptions,
  getArmorDisplayName,
  getShieldOptions,
  getMagicalAttireOptions,
  characterFeats,
  manualFeats,
  setManualFeats,
  addManualFeat,
  removeManualFeat,
  quickNotes,
  setQuickNotes,
  currentDate,
  currentWeather,
  WeatherIcon,
  getOrdinalNumber,
  quarryUsesRemaining,
  setQuarryUsesRemaining,
  getQuarryDie,
  getMaxQuarryUses,
  statsImage,
}: StatsTabProps) {
  return (
    <div className="space-y-8">
      {/* Character Header Section */}
      <div
        className={`${isDarkMode ? 'sheet-card' : 'bg-gray-100'} border-2 border-orange-500 rounded-lg shadow-xl p-3`}
      >
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Level, Portrait & Character Info */}
          <div className="flex items-center gap-6">
            {/* Level */}
            <div className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-200'} rounded-lg p-4 text-center`}>
              <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {character.level}
              </div>
              <div className="text-sm text-gray-400">Level</div>
            </div>

            {/* Character Portrait with Frame */}
            <div className="relative">
              <div
                className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-orange-500 to-amber-600' : 'bg-gradient-to-br from-orange-400 to-amber-500'} rounded-lg blur-sm opacity-40`}
              ></div>
              <div className={`relative w-32 h-32 ${isDarkMode ? 'bg-black/30' : 'bg-gray-200'} rounded-lg p-1`}>
                <div
                  className={`w-full h-full ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'} rounded-md border-2 flex items-center justify-center overflow-hidden`}
                >
                  {statsImage ? (
                    <img src={statsImage} alt="Character portrait" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl text-gray-400">IMG</span>
                  )}
                </div>
              </div>
            </div>

            {/* Character Info */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <input
                type="text"
                value={character.name}
                onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                className={`text-2xl font-bold text-orange-400 mb-1 bg-transparent border-b-2 border-transparent hover:border-orange-400/30 focus:border-orange-400 focus:outline-none transition-colors w-full`}
                placeholder="Character Name"
              />
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {character.race} {character.class} • {character.alignment}
              </p>
            </div>
          </div>

          {/* Right Column - Ability Scores */}
          <div className="flex items-center justify-end gap-2 h-32">
            {Object.entries(character.abilityScores).map(([ability, score], index) => {
              const finalScore = getFinalAbilityScore(ability);
              const racialBonus = getRacialBonus(ability, character.race);
              const asiBonus = getAsiBonus(ability);
              const hasAnyBonus = racialBonus > 0 || asiBonus > 0;
              const borderColors = [
                'border-red-400',
                'border-emerald-400',
                'border-orange-400',
                'border-blue-400',
                'border-purple-400',
                'border-pink-400',
              ];
              const textColors = [
                'text-red-400',
                'text-emerald-400',
                'text-orange-400',
                'text-blue-400',
                'text-purple-400',
                'text-pink-400',
              ];
              return (
                <div
                  key={ability}
                  className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-200'} ${borderColors[index]} rounded-xl border-2 px-2 py-1 text-center shadow-lg transform transition-transform hover:scale-105 min-w-16 relative group`}
                >
                  <div className={`text-xs font-bold ${textColors[index]} mb-1`}>
                    {ability.slice(0, 3).toUpperCase()}
                  </div>
                  <NumberField
                    value={hasAnyBonus ? finalScore : score}
                    onCommit={(newValue) =>
                      updateCharacter({
                        abilityScores: {
                          ...character.abilityScores,
                          [ability]: hasAnyBonus ? newValue - racialBonus - asiBonus : newValue,
                        },
                      })
                    }
                    className={`w-full text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} bg-transparent border-0 text-center rounded-lg py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'focus:bg-white/10' : 'focus:bg-gray-300/50'}`}
                  />
                  <div className={`text-sm font-semibold ${isDarkMode ? 'text-white/90' : 'text-gray-700'} mt-1`}>
                    {getModifier(finalScore) >= 0 ? '+' : ''}
                    {getModifier(finalScore)}
                  </div>

                  {hasAnyBonus && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      <div className="bg-slate-800 border border-orange-500 rounded px-2 py-1 text-xs whitespace-nowrap">
                        <div className="text-white">Base: {score}</div>
                        {racialBonus > 0 && <div className="text-cyan-400">Racial: +{racialBonus}</div>}
                        {asiBonus > 0 && <div className="text-green-400">ASI: +{asiBonus}</div>}
                        <div className="text-orange-400 border-t border-slate-600 pt-1">Total: {finalScore}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two 2-Column Blocks Side by Side */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left Block: 2 Columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* Column 1: Saving Throws */}
          <div className="space-y-4">
            <div
              className={`p-3 rounded-lg border shadow-xl relative ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
            >
              <div className="pb-8">
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(character.savingThrows).map(([save, proficient]) => {
                    const abilityMap: { [key: string]: keyof typeof character.abilityScores } = {
                      Strength: 'strength',
                      Dexterity: 'dexterity',
                      Constitution: 'constitution',
                      Intelligence: 'intelligence',
                      Wisdom: 'wisdom',
                      Charisma: 'charisma',
                    };
                    const abbreviations: { [key: string]: string } = {
                      Strength: 'STR',
                      Dexterity: 'DEX',
                      Constitution: 'CON',
                      Intelligence: 'INT',
                      Wisdom: 'WIS',
                      Charisma: 'CHA',
                    };
                    const modifier = getSaveModifier(save, abilityMap[save]);
                    const totalExhaustion =
                      character.survivalConditions.hunger.effect +
                      character.survivalConditions.thirst.effect +
                      character.survivalConditions.fatigue.effect +
                      character.survivalConditions.additionalExhaustion;
                    const hasDisadvantage = totalExhaustion >= 3;
                    const finalScore = getFinalAbilityScore(abilityMap[save]);
                    const abilityModifier = getModifier(finalScore);
                    return (
                      <div
                        key={save}
                        className={`flex items-center justify-between px-2 py-1 rounded-full border-2 transform transition-all duration-200 hover:scale-105 relative group ${
                          hasDisadvantage
                            ? 'bg-orange-500/20 border-orange-400'
                            : proficient
                              ? 'bg-green-500/20 border-green-400'
                              : isDarkMode
                                ? 'bg-black/30 border-white/10'
                                : 'bg-gray-200 border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <input
                            id={`saving-throw-${save}`}
                            type="checkbox"
                            checked={proficient}
                            onChange={(e) =>
                              updateCharacter({
                                savingThrows: { ...character.savingThrows, [save]: e.target.checked },
                              })
                            }
                            className="w-3 h-3 accent-green-500 rounded focus:ring-2 focus:ring-green-400"
                          />
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {abbreviations[save]}
                          </span>
                        </div>
                        <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {modifier >= 0 ? '+' : ''}
                          {modifier}
                        </span>

                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="bg-slate-800 border border-green-500 rounded px-2 py-1 text-xs whitespace-nowrap">
                            <div className="text-white font-semibold mb-1">{save}</div>
                            <div className="text-blue-400">
                              {abbreviations[save]} Modifier: {abilityModifier >= 0 ? '+' : ''}
                              {abilityModifier}
                            </div>
                            {proficient && (
                              <div className="text-green-400">Proficiency: +{character.proficiencyBonus}</div>
                            )}
                            {hasDisadvantage && (
                              <div className="text-orange-400">&#x26A0;&#xFE0F; Disadvantage (Exhaustion)</div>
                            )}
                            <div className="text-orange-400 border-t border-slate-600 pt-1">
                              Total: {modifier >= 0 ? '+' : ''}
                              {modifier}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <h3 className="text-sm font-bold text-gray-400">Saving Throws</h3>
              </div>
            </div>

            {/* Passive Skills */}
            <div
              className={`p-3 rounded-lg border shadow-xl relative ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
            >
              <div className="pb-8 space-y-3">
                <div
                  className={`flex items-center justify-between px-2 py-1 rounded-full border-2 ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-gray-200 border-gray-400'} transform transition-all duration-200 hover:scale-105`}
                >
                  <div className="flex items-center">
                    <span className="mr-1 text-xs">&#x1F441;&#xFE0F;</span>
                    <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Passive Perception</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-blue-400">
                    {10 + getSkillModifier('Perception', 'wisdom')}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between px-2 py-1 rounded-full border-2 ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-gray-200 border-gray-400'} transform transition-all duration-200 hover:scale-105`}
                >
                  <div className="flex items-center">
                    <span className="mr-1 text-xs">&#x1F50D;</span>
                    <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Passive Investigation
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-purple-400">
                    {10 + getSkillModifier('Investigation', 'intelligence')}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between px-2 py-1 rounded-full border-2 ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-gray-200 border-gray-400'} transform transition-all duration-200 hover:scale-105`}
                >
                  <div className="flex items-center">
                    <span className="mr-1 text-xs">&#x1F9E0;</span>
                    <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Passive Insight</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-green-400">
                    {10 + getSkillModifier('Insight', 'wisdom')}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <h3 className="text-sm font-bold text-gray-400">Passive</h3>
              </div>
            </div>

            {/* Ammunition */}
            <div
              className={`p-3 rounded-lg border shadow-xl relative ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
            >
              <div className="pb-8 space-y-3">
                <div
                  className={`grid grid-cols-10 gap-1 text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}
                >
                  <div className="col-span-3 text-center">Name</div>
                  <div className="col-span-4 text-center">Corr. Weapon</div>
                  <div className="col-span-3 text-center">Dice/Qty</div>
                </div>
                {ammunition.map((ammo, index) => (
                  <div key={index} className="grid grid-cols-10 gap-1">
                    <input
                      type="text"
                      value={ammo.name}
                      onChange={(e) => updateAmmunition(index, 'name', e.target.value)}
                      className={`col-span-3 text-center border rounded px-2 py-1 text-xs transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Ammo name"
                    />
                    <input
                      type="text"
                      value={ammo.weapon}
                      onChange={(e) => updateAmmunition(index, 'weapon', e.target.value)}
                      className={`col-span-4 text-center border rounded px-2 py-1 text-xs transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Weapon"
                    />
                    <input
                      type="text"
                      value={ammo.amount}
                      onChange={(e) => updateAmmunition(index, 'amount', e.target.value)}
                      className={`col-span-3 text-center border rounded px-2 py-1 text-xs transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Dice/Qty"
                    />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <h3 className="text-sm font-bold text-gray-400">Ammunition</h3>
              </div>
            </div>
          </div>

          {/* Column 2: Combat Stats and Health */}
          <div className="space-y-4">
            {/* Combat Stats Box */}
            <div
              className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
            >
              <div className="grid grid-cols-2 gap-2 pb-8 max-w-xs mx-auto">
                <div className="text-center">
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>AC</div>
                  <NumberField
                    value={character.armorClass || calculateTotalAC()}
                    onCommit={(armorClass) => updateCharacter({ armorClass })}
                    className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 text-xl font-semibold animate-[pulse_0.3s_ease-in-out] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      character.armorClass
                        ? isDarkMode
                          ? 'bg-yellow-700 border-yellow-500 text-yellow-200'
                          : 'bg-yellow-100 border-yellow-400 text-yellow-800'
                        : isDarkMode
                          ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                    placeholder={calculateTotalAC().toString()}
                    title={
                      character.armorClass
                        ? 'Manual AC override - clear to use auto-calculation'
                        : `Auto-calculated AC: ${calculateTotalAC()}\n\nBreakdown:\n\u2022 Armor: ${ARMOR_DATA[armor.armorType.item || 'None']?.ac || 10}\n\u2022 DEX Mod: ${(() => {
                            const armorData = ARMOR_DATA[armor.armorType.item || 'None'];
                            const dexMod = getModifier(getFinalAbilityScore('dexterity'));
                            if (armorData?.type === 'Light' || armorData?.type === 'None') return dexMod;
                            if (armorData?.type === 'Medium') return Math.min(dexMod, armorData.maxDex || 2);
                            return 0;
                          })()}\n\u2022 Shield: ${SHIELD_DATA[armor.shieldType.item || 'None']?.ac || 0}\n\u2022 Magic Bonus: ${(parseInt(armor.armorType.plus?.replace(/[^-\d]/g, '')) || 0) + (parseInt(armor.shieldType.plus?.replace(/[^-\d]/g, '')) || 0) + (parseInt(armor.magicalAttire.plus?.replace(/[^-\d]/g, '')) || 0)}`
                    }
                  />
                </div>
                <div className="text-center">
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    Initiative
                  </div>
                  <div
                    className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 text-xl font-semibold cursor-help ${
                      isDarkMode
                        ? 'bg-black/30 border-white/10 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                    title="Auto-calculated from Dexterity and modifiers in Data tab"
                  >
                    {calculateInitiativeModifier() >= 0 ? '+' : ''}
                    {calculateInitiativeModifier()}
                  </div>
                </div>
                <div className="text-center relative">
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    Speed
                  </div>
                  <div
                    className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 text-xl font-semibold cursor-help ${(() => {
                      const totalExhaustion =
                        character.survivalConditions.hunger.effect +
                        character.survivalConditions.thirst.effect +
                        character.survivalConditions.fatigue.effect +
                        character.survivalConditions.additionalExhaustion;
                      if (totalExhaustion >= 5)
                        return isDarkMode
                          ? 'bg-red-900/50 border-red-400/30 text-red-100'
                          : 'bg-red-100 border-red-400 text-red-900';
                      if (totalExhaustion >= 2)
                        return isDarkMode
                          ? 'bg-yellow-700 border-yellow-500 text-yellow-100'
                          : 'bg-yellow-100 border-yellow-400 text-yellow-900';
                      return isDarkMode
                        ? 'bg-black/30 border-white/10 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-900';
                    })()}`}
                    title={(() => {
                      const totalExhaustion =
                        character.survivalConditions.hunger.effect +
                        character.survivalConditions.thirst.effect +
                        character.survivalConditions.fatigue.effect +
                        character.survivalConditions.additionalExhaustion;
                      if (totalExhaustion >= 5)
                        return `Base Speed: ${character.speed}\nExhaustion Level 5: Speed reduced to 0`;
                      if (totalExhaustion >= 2)
                        return `Base Speed: ${character.speed}\nExhaustion Level 2+: Speed halved`;
                      return `Speed: ${character.speed}`;
                    })()}
                  >
                    {(() => {
                      const totalExhaustion =
                        character.survivalConditions.hunger.effect +
                        character.survivalConditions.thirst.effect +
                        character.survivalConditions.fatigue.effect +
                        character.survivalConditions.additionalExhaustion;
                      if (totalExhaustion >= 5) return 0;
                      if (totalExhaustion >= 2) return Math.floor(character.speed / 2);
                      return character.speed;
                    })()}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    Prof Bonus
                  </div>
                  <NumberField
                    value={character.proficiencyBonus}
                    onCommit={(proficiencyBonus) => updateCharacter({ proficiencyBonus })}
                    className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 text-xl font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      isDarkMode
                        ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <h3 className="text-sm font-bold text-gray-400">Combat Stats</h3>
              </div>
            </div>

            {/* Health Box */}
            <div
              className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
            >
              <div className="space-y-4 pb-8">
                {/* Health Bar */}
                <div className="space-y-2">
                  <div
                    className={`w-full h-6 border rounded-lg overflow-hidden relative ${
                      isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-gray-100'
                    }`}
                  >
                    <div
                      className={`h-full transition-all duration-500 rounded-lg absolute left-0 liquid-fill ${
                        character.hitPoints.current <= getEffectiveMaxHP() * 0.25 ? 'liquid-fill-critical' : ''
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(0, (character.hitPoints.current / getEffectiveMaxHP()) * 100))}%`,
                        backgroundColor:
                          character.hitPoints.current <= getEffectiveMaxHP() * 0.25
                            ? '#ef4444'
                            : character.hitPoints.current <= getEffectiveMaxHP() * 0.5
                              ? '#f59e0b'
                              : character.hitPoints.current <= getEffectiveMaxHP() * 0.75
                                ? '#eab308'
                                : '#10b981',
                        // The glow and lip are drawn from currentColor.
                        color:
                          character.hitPoints.current <= getEffectiveMaxHP() * 0.25
                            ? '#ef4444'
                            : character.hitPoints.current <= getEffectiveMaxHP() * 0.5
                              ? '#f59e0b'
                              : character.hitPoints.current <= getEffectiveMaxHP() * 0.75
                                ? '#eab308'
                                : '#10b981',
                      }}
                    ></div>
                    {(character.hitPoints.temporary || 0) > 0 && (
                      <div
                        className="h-full transition-all duration-500 rounded-lg absolute liquid-fill"
                        style={{
                          left: `${Math.min(100, Math.max(0, (character.hitPoints.current / getEffectiveMaxHP()) * 100))}%`,
                          width: `${Math.min(100 - Math.min(100, (character.hitPoints.current / getEffectiveMaxHP()) * 100), ((character.hitPoints.temporary || 0) / getEffectiveMaxHP()) * 100)}%`,
                          backgroundColor: '#06b6d4',
                          color: '#06b6d4',
                        }}
                      ></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      {Math.round((character.hitPoints.current / getEffectiveMaxHP()) * 100)}%
                      {(character.hitPoints.temporary || 0) > 0 &&
                        `+${Math.round(((character.hitPoints.temporary || 0) / getEffectiveMaxHP()) * 100)}%`}
                    </div>
                  </div>
                </div>

                {/* Hit Points */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>HP</div>
                      <NumberField
                        value={character.hitPoints.current}
                        onCommit={(current) => updateCharacter({ hitPoints: { ...character.hitPoints, current } })}
                        className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div className="text-center relative group">
                      <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Max HP
                      </div>
                      <div
                        className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 font-bold cursor-help ${(() => {
                          const totalExhaustion =
                            character.survivalConditions.hunger.effect +
                            character.survivalConditions.thirst.effect +
                            character.survivalConditions.fatigue.effect +
                            character.survivalConditions.additionalExhaustion;
                          if (totalExhaustion >= 4) {
                            return isDarkMode
                              ? 'bg-orange-900/45 border-orange-400/30 text-orange-100'
                              : 'bg-orange-100 border-orange-400 text-orange-900';
                          }
                          return isDarkMode
                            ? 'bg-black/30 border-white/10 text-gray-300'
                            : 'bg-gray-100 border-gray-300 text-gray-600';
                        })()}`}
                        title={(() => {
                          const totalExhaustion =
                            character.survivalConditions.hunger.effect +
                            character.survivalConditions.thirst.effect +
                            character.survivalConditions.fatigue.effect +
                            character.survivalConditions.additionalExhaustion;
                          if (totalExhaustion >= 4) {
                            return `Base Max HP: ${calculateMaxHP()}\nExhaustion Level 4+: HP maximum halved`;
                          }
                          return 'Auto-calculated from HP rolls in Data tab';
                        })()}
                      >
                        {getEffectiveMaxHP()}
                      </div>

                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <div className="bg-slate-800 border border-orange-500 rounded px-3 py-2 text-xs whitespace-nowrap">
                          <div className="text-white font-bold mb-1">Max HP Calculation:</div>
                          <div className="text-gray-300">
                            HP Rolls:{' '}
                            {hitPointRolls.slice(0, character.level).reduce((sum, roll) => sum + (roll || 0), 0)}
                          </div>
                          <div className="text-blue-400">
                            CON Mod x Level: {getModifier(getFinalAbilityScore('constitution'))} x {character.level} ={' '}
                            {getModifier(getFinalAbilityScore('constitution')) * character.level}
                          </div>
                          {hasToughness && <div className="text-purple-400">Toughness: +{character.level * 2}</div>}
                          {isPHBHillDwarf && <div className="text-green-400">Hill Dwarf: +{character.level}</div>}
                          {additionalHPBonuses > 0 && (
                            <div className="text-yellow-400">Additional: +{additionalHPBonuses}</div>
                          )}
                          <div className="text-orange-400 border-t border-slate-600 pt-1 font-bold">
                            Base Total: {calculateMaxHP()}
                          </div>
                          {(() => {
                            const totalExhaustion =
                              character.survivalConditions.hunger.effect +
                              character.survivalConditions.thirst.effect +
                              character.survivalConditions.fatigue.effect +
                              character.survivalConditions.additionalExhaustion;
                            if (totalExhaustion >= 4) {
                              return (
                                <div className="text-red-400 font-bold">
                                  Exhaustion Penalty: /2 = {getEffectiveMaxHP()}
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Temp HP
                      </div>
                      <NumberField
                        value={character.hitPoints.temporary || 0}
                        onCommit={(temporary) => updateCharacter({ hitPoints: { ...character.hitPoints, temporary } })}
                        className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Hit Dice Section */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Hit Dice
                      </div>
                      <NumberField
                        value={currentHitDice || 0}
                        onCommit={setCurrentHitDice}
                        className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                    </div>
                    <div className="text-center relative group">
                      <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Max Dice
                      </div>
                      <div
                        className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 font-bold cursor-help ${
                          isDarkMode
                            ? 'bg-black/30 border-white/10 text-gray-300'
                            : 'bg-gray-100 border-gray-300 text-gray-600'
                        }`}
                        title="Auto-calculated from class and level"
                      >
                        {formatHitDiceDisplay()}
                      </div>

                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <div className="bg-slate-800 border border-orange-500 rounded px-3 py-2 text-xs whitespace-nowrap">
                          <div className="text-white font-bold mb-1">Hit Dice Calculation:</div>
                          <div className="text-blue-400">Class: {character.class}</div>
                          <div className="text-green-400">Hit Die Type: {CLASS_HIT_DICE[character.class] || 'd8'}</div>
                          <div className="text-yellow-400">Level: {character.level}</div>
                          <div className="text-orange-400 border-t border-slate-600 pt-1 font-bold">
                            Total: {formatHitDiceDisplay()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Reduction
                      </div>
                      <NumberField
                        value={damageReduction || 0}
                        onCommit={setDamageReduction}
                        className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Resistance and Death Saves Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                        Resistance
                      </div>
                      <textarea
                        placeholder="Resistances..."
                        rows={3}
                        className={`w-full text-xs text-center border rounded px-2 py-1 resize-none ${
                          isDarkMode
                            ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                        Death Saves
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-center space-x-2">
                          <span className="text-sm">&#x2620;&#xFE0F;</span>
                          {deathSaves.failures.map((failed, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                const newFailures = [...deathSaves.failures];
                                newFailures[i] = !newFailures[i];
                                setDeathSaves({ ...deathSaves, failures: newFailures });
                              }}
                              className={`w-5 h-5 border-2 ${isDarkMode ? 'border-slate-600' : 'border-gray-400'} rounded cursor-pointer transition-colors ${
                                failed
                                  ? 'bg-red-700/70 border-red-400/40'
                                  : isDarkMode
                                    ? 'bg-black/30 hover:bg-red-700/70'
                                    : 'bg-gray-200 hover:bg-red-600'
                              }`}
                            ></div>
                          ))}
                        </div>
                        <div className="flex justify-center space-x-2">
                          <span className="text-sm">&#x2764;&#xFE0F;</span>
                          {deathSaves.successes.map((succeeded, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                const newSuccesses = [...deathSaves.successes];
                                newSuccesses[i] = !newSuccesses[i];
                                setDeathSaves({ ...deathSaves, successes: newSuccesses });
                              }}
                              className={`w-5 h-5 border-2 ${isDarkMode ? 'border-slate-600' : 'border-gray-400'} rounded cursor-pointer transition-colors ${
                                succeeded
                                  ? 'bg-emerald-700/70 border-emerald-400/40'
                                  : isDarkMode
                                    ? 'bg-black/30 hover:bg-emerald-700/70'
                                    : 'bg-gray-200 hover:bg-green-600'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <h3 className="text-sm font-bold text-gray-400">Health</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Right Block: 2 Columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* Column 3: Skills */}
          <div className="space-y-4">
            <div
              className={`p-3 rounded-lg border shadow-xl relative self-start ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
            >
              <div className="space-y-0.5 pb-3">
                {Object.entries({
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
                  const skillData = character.skills[skill] || { proficient: false, expertise: false };
                  const modifier = getSkillModifier(skill, ability as keyof typeof character.abilityScores);
                  const profBonus = skillData.proficient ? character.proficiencyBonus : 0;
                  const expBonus = skillData.expertise ? character.proficiencyBonus : 0;
                  const abilityMod = getModifier(getFinalAbilityScore(ability));
                  const totalExhaustion =
                    character.survivalConditions.hunger.effect +
                    character.survivalConditions.thirst.effect +
                    character.survivalConditions.fatigue.effect +
                    character.survivalConditions.additionalExhaustion;
                  const hasDisadvantage = totalExhaustion >= 1;

                  return (
                    <div
                      key={skill}
                      className={`group flex items-center gap-2 hover:bg-gray-600/20 rounded px-1 py-0 relative ${
                        hasDisadvantage ? 'bg-yellow-500/10' : ''
                      }`}
                      title={hasDisadvantage ? 'Exhaustion Level 1+: Disadvantage on Ability Checks' : ''}
                    >
                      <div
                        onClick={() => {
                          const newSkills = {
                            ...character.skills,
                            [skill]: {
                              ...skillData,
                              proficient: !skillData.proficient,
                              expertise: !skillData.proficient ? false : skillData.expertise,
                              source: 'manual' as const,
                              manualOverride: true,
                            },
                          };
                          updateCharacter({ skills: newSkills });
                        }}
                        className={`w-4 h-4 border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                          skillData.proficient
                            ? skillData.source === 'race'
                              ? 'bg-emerald-600/80 border-emerald-500/60 shadow-sm'
                              : skillData.source === 'class'
                                ? 'bg-purple-600 border-purple-600 shadow-sm'
                                : 'bg-sky-600/80 border-sky-500/60 shadow-sm'
                            : 'border-blue-600 bg-transparent hover:border-blue-400'
                        }`}
                        title={
                          skillData.proficient
                            ? `${skill} proficiency from ${skillData.source}`
                            : `Click to add ${skill} proficiency`
                        }
                      >
                        {skillData.proficient && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      <div
                        onClick={() => {
                          if (skillData.proficient) {
                            const newSkills = {
                              ...character.skills,
                              [skill]: {
                                ...skillData,
                                expertise: !skillData.expertise,
                                source:
                                  skillData.source === 'race' || skillData.source === 'class'
                                    ? skillData.source
                                    : ('manual' as const),
                                manualOverride: true,
                              },
                            };
                            updateCharacter({ skills: newSkills });
                          }
                        }}
                        className={`w-4 h-4 border-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                          skillData.proficient
                            ? skillData.expertise
                              ? 'bg-orange-600/80 border-orange-500/60 shadow-sm cursor-pointer'
                              : 'border-orange-500 bg-transparent hover:border-orange-400 cursor-pointer'
                            : 'border-gray-400 bg-gray-300 opacity-40 cursor-not-allowed'
                        }`}
                        title={
                          skillData.proficient
                            ? skillData.expertise
                              ? 'Remove expertise'
                              : 'Add expertise (double proficiency)'
                            : 'Must be proficient first'
                        }
                      >
                        {skillData.expertise && skillData.proficient && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>

                      <div className={`flex-1 text-xs ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>
                        {skill}
                      </div>

                      <div
                        className={`w-10 text-center font-mono text-xs border rounded transition-all duration-200 py-1 cursor-help ${
                          modifier >= 5
                            ? `border-green-500 bg-green-500/20 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`
                            : modifier >= 0
                              ? `border-blue-500 bg-blue-500/20 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`
                              : modifier >= -2
                                ? `border-yellow-500 bg-yellow-500/20 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`
                                : `border-red-500 bg-red-500/20 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`
                        }`}
                        title={`${skill} Calculation:\nAbility (${ability.toUpperCase()}): ${abilityMod >= 0 ? '+' : ''}${abilityMod}\nProficiency: ${profBonus > 0 ? `+${profBonus}` : '0'}\nExpertise: ${expBonus > 0 ? `+${expBonus}` : '0'}\nTotal: ${modifier >= 0 ? '+' : ''}${modifier}`}
                      >
                        {modifier >= 0 ? '+' : ''}
                        {modifier}
                      </div>

                      <div className="absolute left-full ml-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                        <div className="bg-slate-800 border border-orange-500 rounded px-2 py-1 text-xs whitespace-nowrap">
                          <div className="text-white font-bold">{skill}</div>
                          <div className="text-gray-300">
                            {ability.toUpperCase()}: {abilityMod >= 0 ? '+' : ''}
                            {abilityMod}
                          </div>
                          {profBonus > 0 && <div className="text-blue-400">Prof: +{profBonus}</div>}
                          {expBonus > 0 && <div className="text-orange-400">Exp: +{expBonus}</div>}
                          <div className="text-orange-400 border-t border-slate-600 pt-1">
                            Total: {modifier >= 0 ? '+' : ''}
                            {modifier}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute bottom-2 left-0 right-0 text-center">
                <h3 className="text-sm font-bold text-gray-400">Skills</h3>
              </div>
            </div>
          </div>

          {/* Column 4: Current Date and Survival Conditions */}
          <div className="space-y-4">
            {/* Current Date Display */}
            <div
              className={`p-3 rounded-lg border shadow-xl ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
            >
              <div className="flex justify-center mb-3">
                <WeatherIcon type={currentWeather} />
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-orange-400 mb-1">
                  {getOrdinalNumber(currentDate.day)} of {currentDate.season}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {currentDate.year} Year of the Ivory
                </div>
              </div>
            </div>

            {/* Survival Conditions */}
            <div
              className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
            >
              <div className="pb-8">
                <div className="space-y-1">
                  <div
                    className="grid gap-1 text-xs font-semibold text-gray-400 pb-1 border-b border-slate-600"
                    style={{ gridTemplateColumns: '0.8fr 1.4fr 0.6fr' }}
                  >
                    <div>Need</div>
                    <div className="text-center">Stage</div>
                    <div className="text-center">Effect</div>
                  </div>

                  {/* Hunger */}
                  <div
                    className={`grid gap-1 text-xs rounded px-1 py-0.5 ${
                      character.survivalConditions.hunger.effect === -1
                        ? 'bg-green-500/20'
                        : character.survivalConditions.hunger.effect === 1
                          ? 'bg-red-500/20'
                          : ''
                    }`}
                    style={{ gridTemplateColumns: '0.8fr 1.4fr 0.6fr' }}
                  >
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs`}>Hunger</div>
                    <div className="text-center">
                      <select
                        value={character.survivalConditions.hunger.stage}
                        onChange={(e) => {
                          const effectMap: { [key: string]: number } = {
                            Stuffed: -1,
                            'Well-Fed': 0,
                            Ok: 0,
                            Peckish: 0,
                            Hungry: 0,
                            Ravenous: 1,
                            Starving: 1,
                          };
                          const newStage = e.target.value;
                          setCharacter((prev) => ({
                            ...prev,
                            survivalConditions: {
                              ...prev.survivalConditions,
                              hunger: { stage: newStage, effect: effectMap[newStage] || 0 },
                            },
                          }));
                        }}
                        className={`w-full text-xs text-center border rounded px-1 py-0.5 appearance-none ${
                          isDarkMode
                            ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="Stuffed">Stuffed</option>
                        <option value="Well-Fed">Well-Fed</option>
                        <option value="Ok">Ok</option>
                        <option value="Peckish">Peckish</option>
                        <option value="Hungry">Hungry</option>
                        <option value="Ravenous">Ravenous</option>
                        <option value="Starving">Starving</option>
                      </select>
                    </div>
                    <div className="text-center">
                      <input
                        type="number"
                        value={character.survivalConditions.hunger.effect}
                        readOnly
                        className={`w-4/5 text-xs text-center rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-black/25 border-white/10 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Thirst */}
                  <div
                    className={`grid gap-1 text-xs rounded px-1 py-0.5 ${
                      character.survivalConditions.thirst.effect === -1
                        ? 'bg-green-500/20'
                        : character.survivalConditions.thirst.effect === 1
                          ? 'bg-red-500/20'
                          : ''
                    }`}
                    style={{ gridTemplateColumns: '0.8fr 1.4fr 0.6fr' }}
                  >
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs`}>Thirst</div>
                    <div className="text-center">
                      <select
                        value={character.survivalConditions.thirst.stage}
                        onChange={(e) => {
                          const effectMap: { [key: string]: number } = {
                            Quenched: -1,
                            Refreshed: 0,
                            Ok: 0,
                            Parched: 0,
                            Thirsty: 0,
                            Dry: 1,
                            Dehydrated: 1,
                          };
                          const newStage = e.target.value;
                          setCharacter((prev) => ({
                            ...prev,
                            survivalConditions: {
                              ...prev.survivalConditions,
                              thirst: { stage: newStage, effect: effectMap[newStage] || 0 },
                            },
                          }));
                        }}
                        className={`w-full text-xs text-center border rounded px-1 py-0.5 appearance-none ${
                          isDarkMode
                            ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="Quenched">Quenched</option>
                        <option value="Refreshed">Refreshed</option>
                        <option value="Ok">Ok</option>
                        <option value="Parched">Parched</option>
                        <option value="Thirsty">Thirsty</option>
                        <option value="Dry">Dry</option>
                        <option value="Dehydrated">Dehydrated</option>
                      </select>
                    </div>
                    <div className="text-center">
                      <input
                        type="number"
                        value={character.survivalConditions.thirst.effect}
                        readOnly
                        className={`w-4/5 text-xs text-center rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-black/25 border-white/10 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Fatigue */}
                  <div
                    className={`grid gap-1 text-xs rounded px-1 py-0.5 ${
                      character.survivalConditions.fatigue.effect === -1
                        ? 'bg-green-500/20'
                        : character.survivalConditions.fatigue.effect === 1
                          ? 'bg-red-500/20'
                          : ''
                    }`}
                    style={{ gridTemplateColumns: '0.8fr 1.4fr 0.6fr' }}
                  >
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs`}>Fatigue</div>
                    <div className="text-center">
                      <select
                        value={character.survivalConditions.fatigue.stage}
                        onChange={(e) => {
                          const effectMap: { [key: string]: number } = {
                            Energized: -1,
                            'Well-rested': 0,
                            Ok: 0,
                            Tired: 0,
                            Sleepy: 0,
                            'Very sleepy': 1,
                            'Barely awake': 1,
                          };
                          const newStage = e.target.value;
                          setCharacter((prev) => ({
                            ...prev,
                            survivalConditions: {
                              ...prev.survivalConditions,
                              fatigue: { stage: newStage, effect: effectMap[newStage] || 0 },
                            },
                          }));
                        }}
                        className={`w-full text-xs text-center border rounded px-1 py-0.5 appearance-none ${
                          isDarkMode
                            ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="Energized">Energized</option>
                        <option value="Well-rested">Well-rested</option>
                        <option value="Ok">Ok</option>
                        <option value="Tired">Tired</option>
                        <option value="Sleepy">Sleepy</option>
                        <option value="Very sleepy">Very sleepy</option>
                        <option value="Barely awake">Barely awake</option>
                      </select>
                    </div>
                    <div className="text-center">
                      <input
                        type="number"
                        value={character.survivalConditions.fatigue.effect}
                        readOnly
                        className={`w-4/5 text-xs text-center rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-black/25 border-white/10 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Additional Exhaustion */}
                  <div
                    className="grid gap-1 text-xs rounded px-1 py-0.5"
                    style={{ gridTemplateColumns: '0.8fr 1.4fr 0.6fr' }}
                  >
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs`}>Addt'l</div>
                    <div></div>
                    <div className="text-center">
                      <NumberField
                        value={character.survivalConditions.additionalExhaustion || 0}
                        onCommit={(val) =>
                          setCharacter((prev) => ({
                            ...prev,
                            survivalConditions: { ...prev.survivalConditions, additionalExhaustion: val },
                          }))
                        }
                        placeholder="0"
                        className={`w-4/5 text-xs text-center border rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode
                            ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Total Exhaustion */}
                  <div
                    className={`grid gap-1 text-xs border-t border-slate-600 pt-1 rounded px-1 py-0.5 transition-all duration-300 cursor-help ${(() => {
                      const totalExhaustion =
                        character.survivalConditions.hunger.effect +
                        character.survivalConditions.thirst.effect +
                        character.survivalConditions.fatigue.effect +
                        character.survivalConditions.additionalExhaustion;
                      if (totalExhaustion >= 6)
                        return 'bg-red-900/40 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse';
                      if (totalExhaustion >= 5) return 'bg-red-800/30 shadow-[0_0_15px_rgba(239,68,68,0.6)]';
                      if (totalExhaustion >= 3) return 'bg-orange-700/25 shadow-[0_0_10px_rgba(249,115,22,0.5)]';
                      if (totalExhaustion >= 1) return 'bg-yellow-600/20 shadow-[0_0_8px_rgba(234,179,8,0.4)]';
                      return '';
                    })()}`}
                    style={{ gridTemplateColumns: '0.8fr 1.4fr 0.6fr' }}
                    title={(() => {
                      const totalExhaustion =
                        character.survivalConditions.hunger.effect +
                        character.survivalConditions.thirst.effect +
                        character.survivalConditions.fatigue.effect +
                        character.survivalConditions.additionalExhaustion;
                      if (totalExhaustion >= 6) return 'Level 6: Death';
                      if (totalExhaustion >= 5)
                        return 'Level 5: Speed reduced to 0\nLevel 4: Hit Point maximum halved\nLevel 3: Disadvantage on Attack Rolls and Saving Throws\nLevel 2: Speed halved\nLevel 1: Disadvantage on Ability Checks';
                      if (totalExhaustion >= 4)
                        return 'Level 4: Hit Point maximum halved\nLevel 3: Disadvantage on Attack Rolls and Saving Throws\nLevel 2: Speed halved\nLevel 1: Disadvantage on Ability Checks';
                      if (totalExhaustion >= 3)
                        return 'Level 3: Disadvantage on Attack Rolls and Saving Throws\nLevel 2: Speed halved\nLevel 1: Disadvantage on Ability Checks';
                      if (totalExhaustion >= 2) return 'Level 2: Speed halved\nLevel 1: Disadvantage on Ability Checks';
                      if (totalExhaustion >= 1) return 'Level 1: Disadvantage on Ability Checks';
                      return 'No Exhaustion';
                    })()}
                  >
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-semibold text-xs`}>
                      Total
                    </div>
                    <div></div>
                    <div className="text-center">
                      <input
                        type="number"
                        value={
                          character.survivalConditions.hunger.effect +
                          character.survivalConditions.thirst.effect +
                          character.survivalConditions.fatigue.effect +
                          character.survivalConditions.additionalExhaustion
                        }
                        readOnly
                        className={`w-full text-xs text-center border rounded px-1 py-0.5 font-semibold transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${(() => {
                          const totalExhaustion =
                            character.survivalConditions.hunger.effect +
                            character.survivalConditions.thirst.effect +
                            character.survivalConditions.fatigue.effect +
                            character.survivalConditions.additionalExhaustion;
                          if (totalExhaustion >= 6)
                            return isDarkMode
                              ? 'bg-red-900 border-red-600 text-red-100 font-bold'
                              : 'bg-red-200 border-red-500 text-red-900 font-bold';
                          if (totalExhaustion >= 5)
                            return isDarkMode
                              ? 'bg-red-900/50 border-red-400/30 text-red-100'
                              : 'bg-red-100 border-red-400 text-red-900';
                          if (totalExhaustion >= 3)
                            return isDarkMode
                              ? 'bg-orange-900/45 border-orange-400/30 text-orange-100'
                              : 'bg-orange-100 border-orange-400 text-orange-900';
                          if (totalExhaustion >= 1)
                            return isDarkMode
                              ? 'bg-yellow-700 border-yellow-500 text-yellow-100'
                              : 'bg-yellow-100 border-yellow-400 text-yellow-900';
                          return isDarkMode
                            ? 'bg-slate-600 border-slate-500 text-white'
                            : 'bg-gray-100 border-gray-300 text-gray-900';
                        })()}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <h3 className="text-sm font-bold text-gray-400">Survival Conditions</h3>
              </div>
            </div>

            {/* Quick Notes Box */}
            <div
              className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
            >
              <div className="pb-8">
                <textarea
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                  placeholder="Quick notes..."
                  rows={2}
                  className={`w-full text-sm border rounded px-2 py-2 resize-none transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                      : 'bg-gray-100 border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <h3 className="text-sm font-bold text-gray-400">Quick Notes</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Left side - Weapons */}
        <div
          className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
        >
          <div className="space-y-3 pb-8">
            <div
              className="grid gap-1 text-xs font-semibold text-gray-400 pb-2 border-b border-slate-600"
              style={{ gridTemplateColumns: '1.8fr 0.8fr 0.5fr 0.5fr 0.4fr 0.7fr 1.6fr 0.5fr' }}
            >
              <div className="text-center">Name</div>
              <div className="text-center">Type</div>
              <div className="text-center">Finesse</div>
              <div className="text-center">Prof</div>
              <div className="text-center cursor-help" title="Item Bonus">
                +
              </div>
              <div className="text-center">ATK Bon</div>
              <div className="text-center">Damage</div>
              <div className="text-center">Notch</div>
            </div>

            {character.weapons.map((weapon, index) => (
              <div
                key={index}
                className="grid gap-1 items-center text-sm"
                style={{ gridTemplateColumns: '1.8fr 0.8fr 0.5fr 0.5fr 0.4fr 0.7fr 1.6fr 0.5fr' }}
              >
                <div>
                  <input
                    type="text"
                    value={weapon.name}
                    onChange={(e) => {
                      const newWeapons = [...character.weapons];
                      newWeapons[index] = { ...weapon, name: e.target.value };
                      updateCharacter({ weapons: newWeapons });
                    }}
                    className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                    placeholder="Weapon name"
                  />
                </div>
                <div>
                  <select
                    value={weapon.type || 'Melee'}
                    onChange={(e) => {
                      const newWeapons = [...character.weapons];
                      const newType = e.target.value;
                      let newAbility = weapon.ability;
                      if (newType === 'Ranged') {
                        newAbility = 'DEX';
                      } else if (newType === 'Melee' && !weapon.finesse) {
                        newAbility = 'STR';
                      } else if (newType === 'Thrown') {
                        newAbility = weapon.finesse ? 'DEX' : 'STR';
                      }
                      newWeapons[index] = { ...weapon, type: newType, ability: newAbility };
                      updateCharacter({ weapons: newWeapons });
                    }}
                    className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs appearance-none ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                  >
                    <option value="Melee">Melee</option>
                    <option value="Ranged">Ranged</option>
                    <option value="Thrown">Thrown</option>
                  </select>
                </div>
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={weapon.finesse || false}
                    onChange={(e) => {
                      const newWeapons = [...character.weapons];
                      const isFinesse = e.target.checked;
                      let newAbility = weapon.ability;
                      if (weapon.type === 'Melee' || weapon.type === 'Thrown') {
                        newAbility = isFinesse ? 'DEX' : 'STR';
                      }
                      newWeapons[index] = { ...weapon, finesse: isFinesse, ability: newAbility };
                      updateCharacter({ weapons: newWeapons });
                    }}
                    className="w-3 h-3 accent-blue-500 rounded focus:ring-1 focus:ring-blue-400"
                    disabled={weapon.type === 'Ranged'}
                  />
                </div>
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={weapon.proficient}
                    onChange={(e) => {
                      const newWeapons = [...character.weapons];
                      newWeapons[index] = { ...weapon, proficient: e.target.checked };
                      updateCharacter({ weapons: newWeapons });
                    }}
                    className="w-3 h-3 accent-green-500 rounded focus:ring-1 focus:ring-green-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={weapon.notches}
                    onChange={(e) => {
                      const newWeapons = [...character.weapons];
                      newWeapons[index] = { ...weapon, notches: e.target.value };
                      updateCharacter({ weapons: newWeapons });
                    }}
                    className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs text-center ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                    placeholder="+0"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={weapon.atkBonus || calculateWeaponAttackBonus(weapon)}
                    onChange={(e) => {
                      const newWeapons = [...character.weapons];
                      newWeapons[index] = { ...weapon, atkBonus: e.target.value };
                      updateCharacter({ weapons: newWeapons });
                    }}
                    className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs text-center ${weapon.atkBonus ? (isDarkMode ? 'bg-slate-600 border-yellow-500 text-yellow-200' : 'bg-yellow-50 border-yellow-400 text-gray-900') : isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                    placeholder={calculateWeaponAttackBonus(weapon)}
                    title={
                      weapon.atkBonus
                        ? 'Manual override - clear to use auto-calculation'
                        : 'Auto-calculated: ability mod + prof bonus + weapon bonus'
                    }
                    onFocus={(e) => {
                      if (!weapon.atkBonus) {
                        e.target.value = calculateWeaponAttackBonus(weapon);
                      }
                    }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={weapon.damage}
                    onChange={(e) => {
                      const newWeapons = [...character.weapons];
                      newWeapons[index] = { ...weapon, damage: e.target.value };
                      updateCharacter({ weapons: newWeapons });
                    }}
                    className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs text-center ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                    placeholder="1d8+2"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={weapon.notches || ''}
                    onChange={(e) => {
                      const newWeapons = [...character.weapons];
                      newWeapons[index] = { ...weapon, notches: e.target.value };
                      updateCharacter({ weapons: newWeapons });
                    }}
                    className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs text-center ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  if (character.weapons.length < 5) {
                    updateCharacter({
                      weapons: [
                        ...character.weapons,
                        {
                          name: '',
                          type: 'Melee',
                          finesse: false,
                          proficient: false,
                          notches: '',
                          range: '',
                          ability: 'STR',
                          atkBonus: '',
                          damage: '',
                        },
                      ],
                    });
                  }
                }}
                disabled={character.weapons.length >= 5}
                className={`flex-1 py-1 px-3 text-xs rounded transition-colors ${character.weapons.length >= 5 ? (isDarkMode ? 'bg-black/25 border border-white/10 text-gray-500 cursor-not-allowed' : 'bg-gray-400 text-gray-600 cursor-not-allowed') : isDarkMode ? 'bg-orange-700/55 hover:bg-orange-600/70 border border-orange-400/25 text-orange-50' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
                title={character.weapons.length >= 5 ? 'Maximum 5 weapons allowed' : 'Add weapon'}
              >
                {character.weapons.length >= 5 ? 'Max Weapons (5)' : 'Add Weapon'}
              </button>
              <button
                onClick={() => {
                  if (character.weapons.length > 2) {
                    const newWeapons = character.weapons.slice(0, -1);
                    updateCharacter({ weapons: newWeapons });
                  }
                }}
                disabled={character.weapons.length <= 2}
                className={`flex-1 py-1 px-3 text-xs rounded transition-colors ${character.weapons.length <= 2 ? (isDarkMode ? 'bg-black/25 border border-white/10 text-gray-500 cursor-not-allowed' : 'bg-gray-400 text-gray-600 cursor-not-allowed') : isDarkMode ? 'bg-red-900/50 hover:bg-red-800/65 border border-red-400/25 text-red-50' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                title={
                  character.weapons.length <= 2 ? 'Cannot remove - minimum 2 weapons required' : 'Remove last weapon'
                }
              >
                Remove
              </button>
            </div>
          </div>
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <h3 className="text-sm font-bold text-gray-400">Weapons</h3>
          </div>
        </div>

        {/* Right side - Armor */}
        <div
          className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
        >
          <div
            className="grid items-center gap-x-2 gap-y-2 pb-8"
            style={{ gridTemplateColumns: 'auto 3fr 4fr 2fr 3fr' }}
          >
            {/* Header row */}
            <div className="text-xs font-semibold text-gray-400 text-right"></div>
            <div className="text-xs font-semibold text-gray-400 text-center">Type</div>
            <div className="text-xs font-semibold text-gray-400 text-center">Item</div>
            <div className="text-xs font-semibold text-gray-400 text-center">+</div>
            <div className="text-xs font-semibold text-gray-400 text-center">Notches</div>

            {/* Armor Row */}
            <div className="text-xs font-semibold text-gray-400 text-right">Armor</div>
            <select
              value={armor.armorType.item}
              onChange={(e) => updateArmor('armorType', 'item', e.target.value)}
              className={`w-full text-xs border rounded px-2 transition-all duration-200 py-1 appearance-none ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
            >
              {getArmorOptions().map((armorType) => (
                <option key={armorType} value={armorType}>
                  {getArmorDisplayName(armorType)}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={armor.armorType.karuta}
              onChange={(e) => updateArmor('armorType', 'karuta', e.target.value)}
              className={`w-full border rounded transition-all duration-200 px-2 py-1 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="Armor Item"
            />
            <input
              type="text"
              value={armor.armorType.plus}
              onChange={(e) => updateArmor('armorType', 'plus', e.target.value)}
              className={`w-full text-center border rounded transition-all duration-200 px-2 py-1 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="+"
            />
            <input
              type="text"
              value={armor.armorType.notches}
              onChange={(e) => updateArmor('armorType', 'notches', e.target.value)}
              className={`w-full text-center border rounded transition-all duration-200 px-2 py-1 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="Notches"
            />

            {/* Shield Row */}
            <div className="text-xs font-semibold text-gray-400 text-right">Shield</div>
            <select
              value={armor.shieldType.item}
              onChange={(e) => updateArmor('shieldType', 'item', e.target.value)}
              className={`w-full text-xs border rounded px-2 transition-all duration-200 py-1 appearance-none ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
            >
              {getShieldOptions().map((shieldType) => (
                <option key={shieldType} value={shieldType}>
                  {shieldType}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={armor.shieldType.karuta || ''}
              onChange={(e) => updateArmor('shieldType', 'karuta', e.target.value)}
              className={`w-full border rounded transition-all duration-200 px-2 py-1 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="Shield Item"
            />
            <input
              type="text"
              value={armor.shieldType.plus}
              onChange={(e) => updateArmor('shieldType', 'plus', e.target.value)}
              className={`w-full text-center border rounded transition-all duration-200 px-2 py-1 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="+"
            />
            <input
              type="text"
              value={armor.shieldType.notches}
              onChange={(e) => updateArmor('shieldType', 'notches', e.target.value)}
              className={`w-full text-center border rounded transition-all duration-200 px-2 py-1 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="Notches"
            />

            {/* Magical Attire Row 1 */}
            <div className="text-xs font-semibold text-gray-400 text-right">Attire</div>
            <select
              value={armor.magicalAttire.item1}
              onChange={(e) => updateArmor('magicalAttire', 'item1', e.target.value)}
              className={`w-full text-xs border rounded px-2 transition-all duration-200 py-1 appearance-none ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
            >
              {getMagicalAttireOptions().map((attire) => (
                <option key={attire} value={attire}>
                  {attire}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={armor.magicalAttire.karuta || ''}
              onChange={(e) => updateArmor('magicalAttire', 'karuta', e.target.value)}
              className={`w-full border rounded transition-all duration-200 px-2 py-1 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="Attire Item"
            />
            <input
              type="text"
              value={armor.magicalAttire.plus}
              onChange={(e) => updateArmor('magicalAttire', 'plus', e.target.value)}
              className={`w-full text-center border rounded transition-all duration-200 px-2 py-1 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="+"
            />
            <input
              type="text"
              value={armor.magicalAttire.notches}
              onChange={(e) => updateArmor('magicalAttire', 'notches', e.target.value)}
              className={`w-full text-center border rounded transition-all duration-200 px-2 py-1 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="Notches"
            />

            {/* Magical Attire Row 2 */}
            <div className="text-xs font-semibold text-gray-400 text-right"></div>
            <select
              value={armor.magicalAttire.item2}
              onChange={(e) => updateArmor('magicalAttire', 'item2', e.target.value)}
              className={`w-full text-xs border rounded px-2 transition-all duration-200 py-1 appearance-none ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
            >
              {getMagicalAttireOptions().map((attire) => (
                <option key={attire} value={attire}>
                  {attire}
                </option>
              ))}
            </select>
            <input
              type="text"
              className={`w-full border rounded transition-all duration-200 px-2 py-1 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="Attire Item"
            />
            <input
              type="text"
              className={`w-full text-center border rounded transition-all duration-200 px-2 py-1 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="+"
            />
            <input
              type="text"
              className={`w-full text-center border rounded transition-all duration-200 px-2 py-1 text-xs ${isDarkMode ? 'bg-black/30 border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="Notches"
            />
          </div>
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <h3 className="text-sm font-bold text-gray-400">Armor</h3>
          </div>
        </div>
      </div>

      {/* 4 Separate Boxes Layout */}
      <div className="grid grid-cols-4 gap-4 mt-8">
        {/* Box 1: Racial Features */}
        <div
          className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-base font-semibold text-blue-400">Racial Features</h4>
            <button
              onClick={() => {
                const name = prompt('Racial Feature Name:');
                if (!name) return;
                const description = prompt('Racial Feature Description:');
                if (description === null) return;
                setManualFeats([...manualFeats, { name, description: description || '', source: 'race' }]);
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors"
              title="Add Custom Racial Feature"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {characterFeats
              .filter((feat) => feat.source === 'race')
              .map((feat, index) => (
                <div
                  key={index}
                  className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-200'} border border-blue-500/30 rounded p-2`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-blue-300">{feat.name}</span>
                    <span className="text-xs text-blue-400 bg-blue-500/20 px-1 py-0.5 rounded">Race</span>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feat.description}</p>
                </div>
              ))}
            {manualFeats
              .filter((feat) => feat.source === 'race')
              .map((feat, index) => {
                const manualIndex = manualFeats.findIndex((f) => f === feat);
                return (
                  <div
                    key={`manual-${index}`}
                    className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-200'} border border-blue-500/30 rounded p-2`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-blue-300">{feat.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-blue-400 bg-blue-500/20 px-1 py-0.5 rounded">Race</span>
                        <button
                          onClick={() => {
                            setManualFeats(manualFeats.filter((_, i) => i !== manualIndex));
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feat.description}</p>
                  </div>
                );
              })}
            {[
              ...characterFeats.filter((feat) => feat.source === 'race'),
              ...manualFeats.filter((feat) => feat.source === 'race'),
            ].length === 0 && <div className="text-sm text-gray-500 italic">No racial features available</div>}
          </div>
        </div>

        {/* Box 2: Class Features OR Ranger's Quarry */}
        {character.class === 'Ranger' && character.level >= 2 ? (
          <div
            className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
          >
            <h4 className="text-base font-semibold text-green-400 mb-3">Ranger's Quarry</h4>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 ${isDarkMode ? 'bg-slate-700 border-green-500' : 'bg-gray-200 border-green-400'}`}
              >
                <span className={`text-[10px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Bonus Damage:
                </span>
                <span className="text-xl font-bold text-green-400">+1{getQuarryDie()}</span>
              </div>
              <div className="space-y-2">
                <div className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Uses Remaining
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setQuarryUsesRemaining(Math.max(0, quarryUsesRemaining - 1))}
                    className={`px-1.5 py-0.5 text-sm rounded border font-bold transition-colors ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' : 'bg-gray-300 border-gray-400 text-gray-900 hover:bg-gray-400'}`}
                  >
                    -
                  </button>
                  <div
                    className={`text-lg font-bold min-w-[45px] text-center ${quarryUsesRemaining === 0 ? 'text-red-400' : 'text-green-400'}`}
                  >
                    {quarryUsesRemaining} / {getMaxQuarryUses()}
                  </div>
                  <button
                    onClick={() => setQuarryUsesRemaining(Math.min(getMaxQuarryUses(), quarryUsesRemaining + 1))}
                    className={`px-1.5 py-0.5 text-sm rounded border font-bold transition-colors ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' : 'bg-gray-300 border-gray-400 text-gray-900 hover:bg-gray-400'}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3 relative group">
              <div
                className={`text-xs text-center py-2 px-3 rounded border cursor-help ${isDarkMode ? 'bg-black/30 border-white/10 text-gray-400' : 'bg-gray-200 border-gray-400 text-gray-600'}`}
              >
                Description &#x24D8;
              </div>
              <div className="absolute left-0 right-0 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div
                  className={`p-3 rounded-lg border text-xs ${isDarkMode ? 'bg-slate-800 border-green-500 text-gray-300' : 'bg-white border-green-400 text-gray-700'} shadow-xl`}
                >
                  <p className="mb-2">
                    Use a <span className="font-semibold text-green-400">bonus action</span> to mark one creature you
                    can see as your Quarry, gaining:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-2">
                    <li>Deal bonus damage equal to 1{getQuarryDie()} when you damage it with an attack</li>
                    <li>Add 1{getQuarryDie()} to ability checks to track or locate it</li>
                  </ul>
                  <p className="mb-2">
                    Benefits last <span className="font-semibold text-green-400">1 hour</span> or until your Quarry is
                    slain or you mark another creature.
                  </p>
                  <p className="text-xs italic">
                    Uses: {getMaxQuarryUses()} per long rest (Wisdom modifier, minimum 1). Can expend a spell slot when
                    out of uses.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setQuarryUsesRemaining(getMaxQuarryUses())}
              className={`w-full mt-3 px-3 py-1 text-xs rounded border transition-colors ${isDarkMode ? 'bg-green-700 border-green-600 text-white hover:bg-green-600' : 'bg-green-200 border-green-400 text-green-900 hover:bg-green-300'}`}
            >
              Long Rest (Restore All)
            </button>
          </div>
        ) : characterFeats.filter((feat) => feat.source === 'class').length > 0 ? (
          <div
            className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
          >
            <h4 className="text-base font-semibold text-purple-400 mb-3">Class Features</h4>
            <div className="space-y-2">
              {characterFeats
                .filter((feat) => feat.source === 'class')
                .map((feat, index) => (
                  <div
                    key={index}
                    className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-200'} border border-purple-500/30 rounded p-2`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-purple-300">{feat.name}</span>
                        {feat.level && <span className="text-xs text-gray-400">(Lvl {feat.level})</span>}
                      </div>
                      <span className="text-xs text-purple-400 bg-purple-500/20 px-1 py-0.5 rounded">Class</span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feat.description}</p>
                  </div>
                ))}
            </div>
          </div>
        ) : null}

        {/* Box 3: Feats */}
        <div
          className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-base font-semibold text-orange-400">Feats</h4>
            <button
              onClick={() => addManualFeat('', '')}
              className="text-orange-400 hover:text-orange-300 transition-colors"
              title="Add Feat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {manualFeats.slice(Math.ceil(manualFeats.length / 2)).map((feat, index) => (
              <div
                key={index + Math.ceil(manualFeats.length / 2)}
                className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-200'} border border-orange-500/30 rounded p-2`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <input
                      type="text"
                      value={feat.name}
                      onChange={(e) => {
                        const newFeats = [...manualFeats];
                        newFeats[index + Math.ceil(manualFeats.length / 2)] = {
                          ...newFeats[index + Math.ceil(manualFeats.length / 2)],
                          name: e.target.value,
                        };
                        setManualFeats(newFeats);
                      }}
                      className={`bg-transparent text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-700'} border-none outline-none flex-1 min-w-0`}
                      placeholder="Feat name..."
                    />
                    <input
                      type="number"
                      value={feat.level || ''}
                      onChange={(e) => {
                        const newFeats = [...manualFeats];
                        newFeats[index + Math.ceil(manualFeats.length / 2)] = {
                          ...newFeats[index + Math.ceil(manualFeats.length / 2)],
                          level: parseInt(e.target.value) || undefined,
                        };
                        setManualFeats(newFeats);
                      }}
                      className="bg-transparent text-xs text-gray-400 border-none outline-none w-6 flex-shrink-0 text-center"
                      placeholder="L"
                      min="1"
                      max="20"
                    />
                  </div>
                  <button
                    onClick={() => removeManualFeat(index + Math.ceil(manualFeats.length / 2))}
                    className="text-red-400 hover:text-red-300 text-xs flex-shrink-0"
                    title="Remove feat"
                  >
                    &#x2715;
                  </button>
                </div>
                <textarea
                  // Size to content on mount and on every render —
                  // onInput alone left rows={2} clipping longer feats
                  // until the user typed in the box.
                  ref={(el) => {
                    if (el) {
                      el.style.height = 'auto';
                      el.style.height = `${el.scrollHeight}px`;
                    }
                  }}
                  value={feat.description}
                  onChange={(e) => {
                    const newFeats = [...manualFeats];
                    newFeats[index + Math.ceil(manualFeats.length / 2)] = {
                      ...newFeats[index + Math.ceil(manualFeats.length / 2)],
                      description: e.target.value,
                    };
                    setManualFeats(newFeats);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                  className={`bg-transparent text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} border-none outline-none w-full resize-none overflow-hidden`}
                  placeholder="Feat description..."
                  rows={2}
                  style={{ minHeight: '2.5rem' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Box 4: Feats */}
        <div
          className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'sheet-card' : 'bg-gray-100 border-gray-300'}`}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-base font-semibold text-orange-400">Feats</h4>
            <button
              onClick={() => addManualFeat('', '')}
              className="text-orange-400 hover:text-orange-300 transition-colors"
              title="Add Feat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {manualFeats.slice(0, Math.ceil(manualFeats.length / 2)).map((feat, index) => (
              <div
                key={index}
                className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-200'} border border-orange-500/30 rounded p-2`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <input
                      type="text"
                      value={feat.name}
                      onChange={(e) => {
                        const newFeats = [...manualFeats];
                        newFeats[index] = { ...newFeats[index], name: e.target.value };
                        setManualFeats(newFeats);
                      }}
                      className={`bg-transparent text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-700'} border-none outline-none flex-1 min-w-0`}
                      placeholder="Feat name..."
                    />
                    <input
                      type="number"
                      value={feat.level || ''}
                      onChange={(e) => {
                        const newFeats = [...manualFeats];
                        newFeats[index] = { ...newFeats[index], level: parseInt(e.target.value) || undefined };
                        setManualFeats(newFeats);
                      }}
                      className="bg-transparent text-xs text-gray-400 border-none outline-none w-6 flex-shrink-0 text-center"
                      placeholder="L"
                      min="1"
                      max="20"
                    />
                  </div>
                  <button
                    onClick={() => removeManualFeat(index)}
                    className="text-red-400 hover:text-red-300 text-xs flex-shrink-0"
                    title="Remove feat"
                  >
                    &#x2715;
                  </button>
                </div>
                <textarea
                  // Size to content on mount and on every render —
                  // onInput alone left rows={2} clipping longer feats
                  // until the user typed in the box.
                  ref={(el) => {
                    if (el) {
                      el.style.height = 'auto';
                      el.style.height = `${el.scrollHeight}px`;
                    }
                  }}
                  value={feat.description}
                  onChange={(e) => {
                    const newFeats = [...manualFeats];
                    newFeats[index] = { ...newFeats[index], description: e.target.value };
                    setManualFeats(newFeats);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                  className={`bg-transparent text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} border-none outline-none w-full resize-none overflow-hidden`}
                  placeholder="Feat description..."
                  rows={2}
                  style={{ minHeight: '2.5rem' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
