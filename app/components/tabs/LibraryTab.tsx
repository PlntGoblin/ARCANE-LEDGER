'use client';

import { Character } from '../../types/character';

export interface LibraryTabProps {
  character: Character;
  isDarkMode: boolean;
  masterSpellList: any[];
  knownSpells: Set<number>;
  setKnownSpells: React.Dispatch<React.SetStateAction<Set<number>>>;
  spellSearchTerm: string;
  setSpellSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedSpellClass: string;
  setSelectedSpellClass: React.Dispatch<React.SetStateAction<string>>;
  selectedSpellLevels: Set<number>;
  setSelectedSpellLevels: React.Dispatch<React.SetStateAction<Set<number>>>;
  getAccessibleSpellLevels: (className: string, level: number) => number[];
  getFilteredSpells: () => any[];
}

export default function LibraryTab({
  character,
  isDarkMode,
  masterSpellList,
  knownSpells,
  setKnownSpells,
  spellSearchTerm,
  setSpellSearchTerm,
  selectedSpellClass,
  setSelectedSpellClass,
  selectedSpellLevels,
  setSelectedSpellLevels,
  getAccessibleSpellLevels,
  getFilteredSpells,
}: LibraryTabProps) {
  return (
    <div className="space-y-8">
      {/* Spell Filters */}
      <div
        className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
      >
        <h3 className="text-xl font-semibold text-orange-400 mb-4">Spell Filters</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Search Spells
            </label>
            <input
              type="text"
              placeholder="Search by name, school, or description..."
              value={spellSearchTerm}
              onChange={(e) => setSpellSearchTerm(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                isDarkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-gray-100 border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Class Filter */}
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Class
            </label>
            <select
              value={selectedSpellClass}
              onChange={(e) => setSelectedSpellClass(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
              }`}
            >
              <option value="All Classes">All Classes</option>
              <option value="Bard">Bard</option>
              <option value="Cleric">Cleric</option>
              <option value="Druid">Druid</option>
              <option value="Paladin">Paladin</option>
              <option value="Ranger">Ranger</option>
              <option value="Sorcerer">Sorcerer</option>
              <option value="Warlock">Warlock</option>
              <option value="Wizard">Wizard</option>
              <option value="Eldritch Knight">Eldritch Knight</option>
              <option value="Arcane Trickster">Arcane Trickster</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Spell Levels
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                .filter((level) => getAccessibleSpellLevels(character.class, character.level).includes(level))
                .map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      id={`spell-level-${level}`}
                      type="checkbox"
                      checked={selectedSpellLevels.has(level)}
                      onChange={(e) => {
                        const newLevels = new Set(selectedSpellLevels);
                        if (e.target.checked) {
                          newLevels.add(level);
                        } else {
                          newLevels.delete(level);
                        }
                        setSelectedSpellLevels(newLevels);
                      }}
                      className="w-4 h-4 text-orange-400 bg-transparent border-slate-600 rounded focus:ring-orange-500 mr-1"
                    />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {level === 0 ? 'C' : level}
                    </span>
                  </label>
                ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setSelectedSpellLevels(new Set(getAccessibleSpellLevels(character.class, character.level)))}
            className={`px-3 py-1 text-xs rounded border transition-colors ${
              isDarkMode
                ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500'
                : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Accessible Levels
          </button>
          <button
            onClick={() => setSelectedSpellLevels(new Set([0]))}
            className={`px-3 py-1 text-xs rounded border transition-colors ${
              isDarkMode
                ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500'
                : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cantrips Only
          </button>
          <button
            onClick={() => setSelectedSpellLevels(new Set())}
            className={`px-3 py-1 text-xs rounded border transition-colors ${
              isDarkMode
                ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500'
                : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Spell Library Table */}
      <div
        className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-orange-400">Master Spell Library</h3>
          {masterSpellList.length > 0 && (
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {getFilteredSpells().length} of {masterSpellList.length} spells
            </div>
          )}
        </div>

        {masterSpellList.length > 0 ? (
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div
              className={`grid text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 py-2 border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-400'}`}
              style={{ gridTemplateColumns: '5fr 5fr 20fr 8fr 8fr 8fr 12fr 25fr 8fr 8fr' }}
            >
              <div className="text-center">Known</div>
              <div className="text-center">Level</div>
              <div className="text-center">Name</div>
              <div className="text-center">School</div>
              <div className="text-center">Casting Time</div>
              <div className="text-center">Range</div>
              <div className="text-center">Area or Targets</div>
              <div className="text-center">Effect</div>
              <div className="text-center">Save or Attack</div>
              <div className="text-center">Duration</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-1 max-h-[72rem] overflow-y-auto">
              {masterSpellList
                .map((spell, originalIndex) => ({ spell, originalIndex }))
                .filter(({ spell }) => {
                  // Search term filter
                  const searchMatch =
                    spellSearchTerm === '' ||
                    (spell.Name || spell.name || '').toLowerCase().includes(spellSearchTerm.toLowerCase()) ||
                    (spell.School || spell.school || '').toLowerCase().includes(spellSearchTerm.toLowerCase()) ||
                    (spell.Effect || spell.description || spell.effect || '')
                      .toLowerCase()
                      .includes(spellSearchTerm.toLowerCase());

                  // Level filter
                  const spellLevel = isNaN(parseFloat(spell.Level !== undefined ? spell.Level : spell.level))
                    ? 0
                    : parseFloat(spell.Level !== undefined ? spell.Level : spell.level);
                  const levelMatch = selectedSpellLevels.has(spellLevel);

                  // Class filter (simplified - would need actual spell class data)
                  let classMatch =
                    selectedSpellClass === 'All Classes' ||
                    (spell.Classes && spell.Classes.includes(selectedSpellClass)) ||
                    (spell.classes && spell.classes.includes(selectedSpellClass)) ||
                    selectedSpellClass === 'All Classes';

                  // Laserllama Alternate Ranger gets access to Ranger spells + expanded spell list
                  if (selectedSpellClass === 'Ranger') {
                    classMatch =
                      classMatch ||
                      (spell.Classes && spell.Classes.includes('Ranger')) ||
                      (spell.classes && spell.classes.includes('Ranger')) ||
                      // Additional utility and nature spells commonly added to Laserllama Ranger
                      (spell.Name &&
                        [
                          'Mending',
                          'Guidance',
                          'Resistance',
                          'Thaumaturgy',
                          'Create or Destroy Water',
                          'Purify Food and Drink',
                          'Detect Poison and Disease',
                          'Lesser Restoration',
                          'Zone of Truth',
                          'Water Breathing',
                          'Water Walk',
                          'Dispel Magic',
                          'Remove Curse',
                        ].includes(spell.Name)) ||
                      (spell.name &&
                        [
                          'Mending',
                          'Guidance',
                          'Resistance',
                          'Thaumaturgy',
                          'Create or Destroy Water',
                          'Purify Food and Drink',
                          'Detect Poison and Disease',
                          'Lesser Restoration',
                          'Zone of Truth',
                          'Water Breathing',
                          'Water Walk',
                          'Dispel Magic',
                          'Remove Curse',
                        ].includes(spell.name));
                  }

                  return searchMatch && levelMatch && classMatch;
                })
                .sort((a, b) => {
                  // Sort by level first, then by name - handle invalid levels
                  const levelA = isNaN(parseFloat(a.spell.Level !== undefined ? a.spell.Level : a.spell.level))
                    ? 0
                    : parseFloat(a.spell.Level !== undefined ? a.spell.Level : a.spell.level);
                  const levelB = isNaN(parseFloat(b.spell.Level !== undefined ? b.spell.Level : b.spell.level))
                    ? 0
                    : parseFloat(b.spell.Level !== undefined ? b.spell.Level : b.spell.level);
                  if (levelA !== levelB) return levelA - levelB;
                  const nameA = a.spell.Name || a.spell.name || 'Unknown Spell';
                  const nameB = b.spell.Name || b.spell.name || 'Unknown Spell';
                  return nameA.localeCompare(nameB);
                })
                .map(({ spell, originalIndex }) => (
                  <div
                    key={originalIndex}
                    className={`grid text-xs py-2 border-b border-slate-700 hover:bg-slate-700/50 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                    style={{ gridTemplateColumns: '5fr 5fr 20fr 8fr 8fr 8fr 12fr 25fr 8fr 8fr' }}
                  >
                    <div className="text-center">
                      <input
                        id={`known-spell-${originalIndex}`}
                        type="checkbox"
                        checked={knownSpells.has(originalIndex)}
                        onChange={(e) => {
                          const newKnownSpells = new Set(knownSpells);
                          if (e.target.checked) {
                            newKnownSpells.add(originalIndex);
                          } else {
                            newKnownSpells.delete(originalIndex);
                          }
                          setKnownSpells(newKnownSpells);
                        }}
                        className="w-4 h-4 text-orange-400 bg-transparent border-slate-600 rounded focus:ring-orange-500"
                      />
                    </div>
                    <div className="text-center">
                      {isNaN(parseFloat(spell.Level !== undefined ? spell.Level : spell.level))
                        ? 'Unknown'
                        : parseFloat(spell.Level !== undefined ? spell.Level : spell.level) === 0
                          ? 'Cantrip'
                          : Math.floor(parseFloat(spell.Level !== undefined ? spell.Level : spell.level))}
                    </div>
                    <div className="text-center px-1 truncate">{spell.Name || spell.name || 'Unknown Spell'}</div>
                    <div className="text-center px-1 truncate">{spell.School || spell.school || 'Unknown'}</div>
                    <div className="text-center px-1 truncate">
                      {spell.CastingTime || spell.casting_time || spell.castingTime || 'Unknown'}
                    </div>
                    <div className="text-center px-1 truncate">{spell.Range || spell.range || 'Unknown'}</div>
                    <div className="text-center px-1 truncate">
                      {spell['Area or Targets'] ||
                        spell.area_of_effect ||
                        spell.areaOfEffect ||
                        spell.targets ||
                        'Unknown'}
                    </div>
                    <div className="text-center px-1">
                      {spell.Effect || spell.description || spell.effect || 'No description available'}
                    </div>
                    <div className="text-center px-1 truncate">
                      {spell['Save or Attack'] || spell.save || spell.attack || 'None'}
                    </div>
                    <div className="text-center px-1 truncate">{spell.Duration || spell.duration || 'Unknown'}</div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p>Upload a JSON file to view your master spell list.</p>
          </div>
        )}
      </div>
    </div>
  );
}
