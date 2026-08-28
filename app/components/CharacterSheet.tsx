'use client';

import { useState, useEffect, useRef } from 'react';
import { Character, Feat } from '../types/character';
import { syncedStorage as localStorage } from '../lib/syncedStorage';
import {
  DND_CLASSES,
  DND_RACES,
  DND_ALIGNMENTS,
  GENDER_OPTIONS,
  CLASS_FEATS,
  RACIAL_FEATS,
  CLASS_SKILLS,
  CLASS_SKILL_COUNT,
  RACIAL_SKILLS,
  CLASS_HIT_DICE,
} from '../data/dndConstants';
import StatsTab from './tabs/StatsTab';
import CharacterTab from './tabs/CharacterTab';
import SpellsTab from './tabs/SpellsTab';
import LibraryTab from './tabs/LibraryTab';
import InventoryTab from './tabs/InventoryTab';
import DataTab from './tabs/DataTab';
import MobileTabBar from './MobileTabBar';
import {
  getModifier as _getModifier,
  getRacialBonus as _getRacialBonus,
  getAsiBonus as _getAsiBonus,
  getFinalAbilityScore as _getFinalAbilityScore,
  getSpellcastingAbility as _getSpellcastingAbility,
  calculateSpellDC as _calculateSpellDC,
  calculateSpellAttack as _calculateSpellAttack,
  getSkillModifier as _getSkillModifier,
  getSaveModifier as _getSaveModifier,
  calculateWeaponAttackBonus as _calculateWeaponAttackBonus,
  calculateTotalAC as _calculateTotalAC,
  ARMOR_DATA,
  SHIELD_DATA,
} from '../utils/calculations';

export default function CharacterSheet() {
  const [activeTab, setActiveTab] = useState('Stats');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [masterSpellList, setMasterSpellList] = useState<any[]>([]);
  const [knownSpells, setKnownSpells] = useState<Set<number>>(new Set());
  const [spellSearchTerm, setSpellSearchTerm] = useState('');
  const [selectedSpellClass, setSelectedSpellClass] = useState('All Classes');
  const [selectedSpellLevels, setSelectedSpellLevels] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
  const [hoveredSpell, setHoveredSpell] = useState<any>(null);
  const [knownSpellsOverride, setKnownSpellsOverride] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Custom spells state
  const [customSpells, setCustomSpells] = useState<{ [level: number]: any[] }>({});

  const [spellSlots, setSpellSlots] = useState<{ [key: number]: { max: number; used: number } }>({});

  const [character, setCharacter] = useState<Character>({
    name: 'Elara Moonwhisper',
    class: 'Wizard',
    race: 'Half-Elf',
    background: 'Sage',
    alignment: 'Lawful Good',
    level: 5,
    experiencePoints: 6500,
    hitPoints: {
      current: 32,
      maximum: 32,
      temporary: 0,
    },
    hitDice: {
      total: '5d6',
      used: 2,
    },
    abilityScores: {
      strength: 10,
      dexterity: 14,
      constitution: 13,
      intelligence: 18,
      wisdom: 12,
      charisma: 16,
    },
    proficiencyBonus: 3,
    armorClass: 0,
    initiative: 2,
    speed: 30,
    skills: {
      Acrobatics: { proficient: false, expertise: false, source: 'manual' as const },
      'Animal Handling': { proficient: false, expertise: false, source: 'manual' as const },
      Arcana: { proficient: false, expertise: false, source: 'manual' as const },
      Athletics: { proficient: false, expertise: false, source: 'manual' as const },
      Deception: { proficient: false, expertise: false, source: 'manual' as const },
      History: { proficient: false, expertise: false, source: 'manual' as const },
      Insight: { proficient: false, expertise: false, source: 'manual' as const },
      Intimidation: { proficient: false, expertise: false, source: 'manual' as const },
      Investigation: { proficient: false, expertise: false, source: 'manual' as const },
      Medicine: { proficient: false, expertise: false, source: 'manual' as const },
      Nature: { proficient: false, expertise: false, source: 'manual' as const },
      Perception: { proficient: false, expertise: false, source: 'manual' as const },
      Performance: { proficient: false, expertise: false, source: 'manual' as const },
      Persuasion: { proficient: false, expertise: false, source: 'manual' as const },
      Religion: { proficient: false, expertise: false, source: 'manual' as const },
      'Sleight of Hand': { proficient: false, expertise: false, source: 'manual' as const },
      Stealth: { proficient: false, expertise: false, source: 'manual' as const },
      Survival: { proficient: false, expertise: false, source: 'manual' as const },
    },
    savingThrows: {
      Strength: false,
      Dexterity: false,
      Constitution: false,
      Intelligence: true,
      Wisdom: true,
      Charisma: false,
    },
    equipment: [
      { name: 'Quarterstaff', quantity: 1, weight: 4, description: 'Versatile (1d8)' },
      { name: 'Dagger', quantity: 2, weight: 1, description: 'Light, finesse, thrown' },
      { name: 'Leather Armor', quantity: 1, weight: 10, description: 'AC 11 + Dex modifier' },
      { name: 'Spellbook', quantity: 1, weight: 3, description: 'Contains wizard spells' },
      { name: 'Component Pouch', quantity: 1, weight: 2, description: 'Spellcasting focus' },
      { name: 'Backpack', quantity: 1, weight: 5, description: 'Holds equipment' },
      { name: 'Bedroll', quantity: 1, weight: 7, description: 'For rest' },
      { name: 'Rations (1 day)', quantity: 10, weight: 2, description: 'Food for travel' },
      { name: 'Rope (50 feet)', quantity: 1, weight: 10, description: 'Hemp rope' },
      { name: 'Torch', quantity: 10, weight: 1, description: 'Light source' },
      { name: 'Gold Pieces', quantity: 125, weight: 0, description: 'Currency' },
    ],
    spells: [
      {
        name: 'Cantrip - Mage Hand',
        level: 0,
        school: 'Transmutation',
        description: 'Telekinetic hand',
        prepared: true,
      },
      {
        name: 'Cantrip - Prestidigitation',
        level: 0,
        school: 'Transmutation',
        description: 'Minor magical effects',
        prepared: true,
      },
      { name: 'Cantrip - Fire Bolt', level: 0, school: 'Evocation', description: '1d10 fire damage', prepared: true },
      {
        name: 'Magic Missile',
        level: 1,
        school: 'Evocation',
        description: 'Automatic hit force damage',
        prepared: true,
      },
      { name: 'Shield', level: 1, school: 'Abjuration', description: '+5 AC reaction', prepared: true },
      { name: 'Detect Magic', level: 1, school: 'Divination', description: 'Sense magical auras', prepared: true },
      { name: 'Misty Step', level: 2, school: 'Conjuration', description: 'Teleport 30 feet', prepared: true },
      { name: 'Web', level: 2, school: 'Conjuration', description: 'Restrain creatures', prepared: true },
      {
        name: 'Fireball',
        level: 3,
        school: 'Evocation',
        description: '8d6 fire damage in 20ft radius',
        prepared: true,
      },
    ],
    spellSlots: {
      '1st': { total: 4, used: 1 },
      '2nd': { total: 3, used: 0 },
      '3rd': { total: 2, used: 1 },
    },
    sorceryPoints: {
      max: 0,
      used: 0,
    },
    spellcastingAbility: 'Intelligence',
    knownPreparedSpells: 9,
    spellDC: 16,
    spellAttack: 8,
    features: [
      { name: 'Spellcasting', description: 'Cast wizard spells using Intelligence', source: 'Wizard' },
      { name: 'Arcane Recovery', description: 'Recover spell slots on short rest', source: 'Wizard' },
      { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'Half-Elf' },
      { name: 'Fey Ancestry', description: 'Advantage on saves vs charmed, immune to sleep', source: 'Half-Elf' },
      { name: 'Researcher', description: 'Know where to find information', source: 'Sage' },
    ],
    backstory: {
      personalityTraits: 'I am eager to learn new things and ask many questions. I speak in metaphors and parables.',
      ideals: 'Knowledge is power, and the key to all other forms of power.',
      bonds: 'The library where I learned to read was my sanctuary. I must protect it.',
      flaws: 'I overlook obvious solutions in favor of complicated ones.',
      backstoryText:
        'Born to an elven scholar and a human merchant, Elara grew up between two worlds—never quite belonging to either. She found solace in the grand libraries of her mother\'s homeland, where ancient tomes whispered secrets of the arcane. Her insatiable curiosity led her to master the art of wizardry, studying under the tutelage of an eccentric mage who recognized her potential.\n\nWhen her mentor vanished without a trace, leaving only cryptic notes about a "rising darkness," Elara set out to uncover the truth. Armed with her spellbook and her wit, she now travels the realm seeking forgotten knowledge and investigating strange magical phenomena. Though she prefers dusty archives to dangerous dungeons, her sense of duty compels her to use her magic to protect the innocent and preserve the balance between worlds.\n\nShe carries her mentor\'s final words close to her heart: "Knowledge without compassion is tyranny; magic without wisdom is destruction."',
      roleplayNotes: '',
      arcHooks: '',
    },
    trueName: 'Marcille Donato',
    age: '50 years old',
    raceGender: 'Half-Elf / Female',
    gender: 'Female',
    mantra: 'Knowledge is the greatest treasure',
    birthplace: 'Northern Continent',
    family: 'Mother',
    physique: 'Height, roughly 160cm',
    likes: 'Seafood, nuts',
    dislikes: 'Any sort of weird food',
    flaws: '',
    nicknames: '',
    weapons: [
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
    survivalConditions: {
      hunger: { stage: 'Ok', effect: 0 },
      thirst: { stage: 'Ok', effect: 0 },
      fatigue: { stage: 'Ok', effect: 0 },
      additionalExhaustion: 0,
      totalExhaustion: 0,
    },
  });

  const getModifier = (score: number): number => _getModifier(score);

  // Calculate ASI bonuses from Feat/ASI choices
  const getAsiBonus = (ability: string): number => _getAsiBonus(ability, asiChoices);

  // Get final ability score including racial and ASI bonuses
  const getFinalAbilityScore = (ability: string): number =>
    _getFinalAbilityScore(
      ability,
      character.abilityScores as unknown as { [key: string]: number },
      character.race,
      asiChoices,
    );

  // Calculate maximum HP based on HP rolls and bonuses
  const calculateMaxHP = (): number => {
    const constitutionModifier = getModifier(getFinalAbilityScore('constitution'));

    // Sum HP rolls for levels up to current level
    let totalHP = 0;
    for (let i = 0; i < character.level; i++) {
      const roll = hitPointRolls[i] || 0;
      totalHP += roll + constitutionModifier;
    }

    // Add Toughness feat bonus (+2 per level)
    if (hasToughness) {
      totalHP += character.level * 2;
    }

    // Add PHB Hill Dwarf bonus (+1 per level)
    if (isPHBHillDwarf) {
      totalHP += character.level;
    }

    // Add additional bonuses
    totalHP += additionalHPBonuses;

    return Math.max(1, totalHP); // Minimum 1 HP
  };

  // Get effective max HP accounting for exhaustion
  const getEffectiveMaxHP = (): number => {
    const baseMaxHP = calculateMaxHP();
    const totalExhaustion =
      character.survivalConditions.hunger.effect +
      character.survivalConditions.thirst.effect +
      character.survivalConditions.fatigue.effect +
      character.survivalConditions.additionalExhaustion;

    if (totalExhaustion >= 4) {
      return Math.floor(baseMaxHP / 2);
    }
    return baseMaxHP;
  };

  // Ranger's Quarry: Calculate quarry die size based on level
  const getQuarryDie = (): string => {
    if (character.level >= 18) return 'd12';
    if (character.level >= 14) return 'd10';
    if (character.level >= 10) return 'd8';
    if (character.level >= 6) return 'd6';
    if (character.level >= 2) return 'd4';
    return 'd4'; // Default
  };

  // Ranger's Quarry: Calculate max uses based on Wisdom modifier (minimum 1)
  const getMaxQuarryUses = (): number => {
    const wisdomModifier = getModifier(getFinalAbilityScore('wisdom'));
    return Math.max(1, wisdomModifier);
  };

  // Automatically assign skills based on race and class
  const assignAutomaticSkills = () => {
    const newSkills = { ...character.skills };

    // Reset all auto-assigned skills first (preserve manual overrides)
    Object.keys(newSkills).forEach((skill) => {
      if (newSkills[skill].source === 'race' || newSkills[skill].source === 'class') {
        if (!newSkills[skill].manualOverride) {
          newSkills[skill] = { proficient: false, expertise: false, source: 'manual' as const };
        }
      }
    });

    // Apply racial skill proficiencies
    const racialSkills = RACIAL_SKILLS[character.race] || [];
    racialSkills.forEach((skill) => {
      if (newSkills[skill] && !newSkills[skill].manualOverride) {
        newSkills[skill] = {
          ...newSkills[skill],
          proficient: true,
          source: 'race',
        };
      }
    });

    // Apply class skill proficiencies (automatic selection of best skills)
    const classSkills = CLASS_SKILLS[character.class] || [];
    const skillCount = CLASS_SKILL_COUNT[character.class] || 0;

    if (classSkills.length > 0 && skillCount > 0) {
      // Auto-select the most commonly useful skills for each class
      const prioritySkills = getClassPrioritySkills(character.class);
      let assigned = 0;

      prioritySkills.forEach((skill) => {
        if (
          assigned < skillCount &&
          classSkills.includes(skill) &&
          newSkills[skill] &&
          !newSkills[skill].manualOverride
        ) {
          newSkills[skill] = {
            ...newSkills[skill],
            proficient: true,
            source: 'class',
          };
          assigned++;
        }
      });
    }

    updateCharacter({ skills: newSkills });
  };

  // Priority skills for each class (most commonly useful)
  const getClassPrioritySkills = (className: string): string[] => {
    const priorities: { [key: string]: string[] } = {
      Barbarian: ['Athletics', 'Perception'],
      Bard: ['Persuasion', 'Deception', 'Performance'],
      Cleric: ['Religion', 'Insight'],
      Druid: ['Nature', 'Perception'],
      Fighter: ['Athletics', 'Perception'],
      Monk: ['Acrobatics', 'Stealth'],
      Paladin: ['Athletics', 'Persuasion'],
      Ranger: ['Survival', 'Perception', 'Stealth'],
      Rogue: ['Stealth', 'Sleight of Hand', 'Perception', 'Investigation'],
      Sorcerer: ['Arcana', 'Persuasion'],
      Warlock: ['Arcana', 'Deception'],
      Wizard: ['Arcana', 'Investigation'],
    };
    return priorities[className] || [];
  };

  // Calculate hit dice based on class and level
  const calculateHitDice = () => {
    const hitDieType = CLASS_HIT_DICE[character.class] || 'd8';
    const calculatedHitDice = {
      d4: 0,
      d6: 0,
      d8: 0,
      d10: 0,
      d12: 0,
    };

    // Set the appropriate die type based on class and level
    if (hitDieType === 'd4') calculatedHitDice.d4 = character.level;
    else if (hitDieType === 'd6') calculatedHitDice.d6 = character.level;
    else if (hitDieType === 'd8') calculatedHitDice.d8 = character.level;
    else if (hitDieType === 'd10') calculatedHitDice.d10 = character.level;
    else if (hitDieType === 'd12') calculatedHitDice.d12 = character.level;

    return calculatedHitDice;
  };

  // Format hit dice for display (e.g., "3d10")
  const formatHitDiceDisplay = () => {
    const hitDieType = CLASS_HIT_DICE[character.class] || 'd8';
    return `${character.level}${hitDieType}`;
  };

  // Calculate total initiative modifier
  const calculateInitiativeModifier = () => {
    let totalModifier = getModifier(getFinalAbilityScore('dexterity')); // Base Dexterity modifier

    // Alert feat: +5 to initiative
    if (initiativeModifiers.alert) {
      totalModifier += 5;
    }

    // Jack of All Trades: +half proficiency bonus (rounded down)
    if (initiativeModifiers.jackOfAllTrades) {
      totalModifier += Math.floor(character.proficiencyBonus / 2);
    }

    // Manual ability modifiers
    if (initiativeModifiers.wisMod) {
      totalModifier += getModifier(getFinalAbilityScore('wisdom'));
    }

    if (initiativeModifiers.intMod) {
      totalModifier += getModifier(getFinalAbilityScore('intelligence'));
    }

    if (initiativeModifiers.chaMod) {
      totalModifier += getModifier(getFinalAbilityScore('charisma'));
    }

    // Additional bonus
    totalModifier += initiativeModifiers.additionalBonus;

    return totalModifier;
  };

  // Get spellcasting ability for current class
  const getSpellcastingAbility = (): string => _getSpellcastingAbility(character.class);

  // Calculate Spell Save DC (8 + proficiency bonus + spellcasting ability modifier)
  const calculateSpellDC = (): number =>
    _calculateSpellDC(
      character.class,
      character.proficiencyBonus,
      character.abilityScores as unknown as { [key: string]: number },
      character.race,
      asiChoices,
    );

  // Calculate Spell Attack Bonus (proficiency bonus + spellcasting ability modifier)
  const calculateSpellAttack = (): number =>
    _calculateSpellAttack(
      character.class,
      character.proficiencyBonus,
      character.abilityScores as unknown as { [key: string]: number },
      character.race,
      asiChoices,
    );

  // Calculate known/prepared spells based on class, level, and ability modifier
  const calculateKnownSpells = (): number => {
    const characterClass = character.class.toLowerCase();
    const level = character.level;
    const spellcastingAbility = getSpellcastingAbility();
    const abilityModifier = Math.max(1, getModifier(getFinalAbilityScore(spellcastingAbility)));

    // D&D 5e spell progression by class
    const spellProgression: { [key: string]: (level: number, modifier: number) => number } = {
      wizard: (level, modifier) => (level === 1 ? 6 : Math.min(25, 6 + (level - 1) * 2)), // Spells known from spellbook
      sorcerer: (level, modifier) => {
        if (level === 1) return 2;
        if (level <= 3) return level + 1;
        if (level <= 5) return level + 2;
        if (level <= 7) return level + 3;
        if (level <= 9) return level + 4;
        return 15; // Max at level 10+
      },
      bard: (level, modifier) => {
        if (level === 1) return 4;
        if (level <= 3) return level + 3;
        if (level <= 5) return level + 4;
        if (level <= 7) return level + 5;
        if (level <= 9) return level + 6;
        return 22; // Max at level 10+
      },
      warlock: (level, modifier) => Math.min(15, Math.floor((level + 1) / 2) + 1),
      ranger: (level, modifier) => (level < 2 ? 0 : Math.min(11, Math.floor(level / 2) + 1)),
      paladin: (level, modifier) => (level < 2 ? 0 : Math.floor(level / 2) + modifier),
      'eldritch knight': (level, modifier) => (level < 3 ? 0 : Math.min(13, Math.floor((level - 2) / 3) + 2)),
      'arcane trickster': (level, modifier) => (level < 3 ? 0 : Math.min(13, Math.floor((level - 2) / 3) + 2)),
      cleric: (level, modifier) => level + modifier,
      druid: (level, modifier) => level + modifier,
    };

    const calculator = spellProgression[characterClass] || spellProgression['cleric']; // Default to cleric progression
    return calculator(level, abilityModifier);
  };

  // Get effective known spells (override if set, otherwise calculated)
  const getEffectiveKnownSpells = (): number => {
    return knownSpellsOverride !== null ? knownSpellsOverride : calculateKnownSpells();
  };

  const getSkillModifier = (skill: string, ability: keyof typeof character.abilityScores): number =>
    _getSkillModifier(
      skill,
      ability,
      character.abilityScores as unknown as { [key: string]: number },
      character.race,
      asiChoices,
      character.skills[skill],
      character.proficiencyBonus,
      skillBonuses,
    );

  const getSaveModifier = (save: string, ability: keyof typeof character.abilityScores): number =>
    _getSaveModifier(
      ability,
      character.abilityScores as unknown as { [key: string]: number },
      character.race,
      asiChoices,
      character.savingThrows[save],
      character.proficiencyBonus,
    );

  // Calculate weapon attack bonus based on ability, proficiency, and weapon bonus
  const calculateWeaponAttackBonus = (weapon: any): string =>
    _calculateWeaponAttackBonus(
      weapon,
      character.abilityScores as unknown as { [key: string]: number },
      character.race,
      asiChoices,
      character.proficiencyBonus,
    );

  // Calculate total AC based on D&D 5e rules
  const calculateTotalAC = (): number =>
    _calculateTotalAC(
      armor,
      character.abilityScores as unknown as { [key: string]: number },
      character.race,
      asiChoices,
    );

  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter((prev) => ({ ...prev, ...updates }));
  };

  const updateAmmunition = (index: number, field: string, value: string) => {
    const newAmmunition = [...ammunition];
    newAmmunition[index] = { ...newAmmunition[index], [field]: value };
    setAmmunition(newAmmunition);
  };

  const updateArmor = (section: string, field: string, value: string) => {
    setArmor((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // Helper functions to get equipped items by type
  const getEquippedItemsByType = (type: string) => {
    return equippedItems.filter((item) => item.type === type && item.item.trim() !== '').map((item) => item.item);
  };

  const getArmorOptions = () => {
    const equippedArmor = getEquippedItemsByType('Armor');
    const defaultArmor = [
      'None',
      'Padded',
      'Leather',
      'Studded Leather',
      'Hide',
      'Chain Shirt',
      'Scale Mail',
      'Breastplate',
      'Half Plate',
      'Ring Mail',
      'Chain Mail',
      'Splint',
      'Plate',
    ];
    return [...new Set([...defaultArmor, ...equippedArmor])];
  };

  const getArmorDisplayName = (armorName: string): string => {
    const armorData = ARMOR_DATA[armorName];
    if (!armorData || armorName === 'None') return armorName;

    const typeShort = armorData.type.charAt(0); // L, M, H
    const stealthIcon = armorData.stealthDis ? '👤' : '';
    return `${armorName} (${typeShort}${armorData.ac}${stealthIcon})`;
  };

  const getShieldOptions = () => {
    const equippedShields = getEquippedItemsByType('Shield');
    const defaultShields = ['None', 'Shield', 'Tower Shield', 'Buckler'];
    return [...new Set([...defaultShields, ...equippedShields])];
  };

  const getMagicalAttireOptions = () => {
    const equippedAttire = getEquippedItemsByType('Magical Attire');
    const defaultAttire = [
      'None',
      'Cloak of Resistance',
      'Boots of Speed',
      'Ring of Protection',
      'Amulet of Natural Armor',
      'Belt of Giant Strength',
      'Headband of Intellect',
      'Gloves of Dexterity',
      'Periapt of Wisdom',
      'Cloak of Charisma',
    ];
    return [...new Set([...defaultAttire, ...equippedAttire])];
  };

  const getWeaponOptions = () => {
    return getEquippedItemsByType('Weapon');
  };

  const getAmmunitionOptions = () => {
    return getEquippedItemsByType('Ammunition');
  };

  const handleImageUrlChange = (url: string, setImage: (value: string) => void) => {
    setImage(url);
  };

  // Helper functions for ability score calculations
  const calculateRolledScore = (rolls: number[]): number => {
    return rolls
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((sum, roll) => sum + roll, 0);
  };

  const getRacialBonus = (ability: string, race: string): number => _getRacialBonus(ability, race);

  // Additional state for new Data tab fields
  const [hitPointRolls, setHitPointRolls] = useState<number[]>(Array(20).fill(0));
  const [additionalHPBonuses, setAdditionalHPBonuses] = useState(0);
  const [hasToughness, setHasToughness] = useState(false);
  const [isPHBHillDwarf, setIsPHBHillDwarf] = useState(false);
  const [currentHitDice, setCurrentHitDice] = useState(0);
  const [maxHitDice, setMaxHitDice] = useState(0);
  const [damageReduction, setDamageReduction] = useState(0);

  // Death saves state
  const [deathSaves, setDeathSaves] = useState({
    successes: [false, false, false],
    failures: [false, false, false],
  });

  // Ammunition state
  const [ammunition, setAmmunition] = useState([
    { name: '', weapon: '', amount: '' },
    { name: '', weapon: '', amount: '' },
    { name: '', weapon: '', amount: '' },
  ]);

  // Ranger's Quarry state
  const [quarryUsesRemaining, setQuarryUsesRemaining] = useState(0);

  // Armor state
  const [armor, setArmor] = useState({
    armorType: { item: 'Studded Leather', karuta: 'Armor Item', plus: '', notches: '' },
    shieldType: { item: 'None', karuta: '', plus: '', notches: '' },
    magicalAttire: { item1: 'None', item2: 'None', plus: '', notches: '', karuta: '' },
  });

  // Proficiencies state
  const [proficiencies, setProficiencies] = useState({
    armor: [] as string[],
    weapons: [] as string[],
    tools: [] as string[],
    languages: [] as string[],
  });

  // Image state
  const [statsImage, setStatsImage] = useState<string>('');
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [backgroundBlur, setBackgroundBlur] = useState<number>(0);
  const [characterImage, setCharacterImage] = useState<string>('');

  // Vibe Effects state (ambiance effects)
  const [vibeEffects, setVibeEffects] = useState<string>('none');
  const [vibeOpacity, setVibeOpacity] = useState<number>(50);

  // Frosted-glass cards. On by default; turning it off swaps every .sheet-card
  // back to the solid panel for anyone who finds the wallpaper hard to read
  // through. Applied as a root class so one CSS rule covers every card.
  const [glassCards, setGlassCards] = useState<boolean>(true);

  // How much frost, 55-90. Drives both the card's black overlay and the
  // backdrop blur, so a busy wallpaper can be dialled down without giving up
  // the glass entirely. 70 reproduces the original fixed look.
  const [glassFrost, setGlassFrost] = useState<number>(70);

  // Ability Score Rolling Tracking
  const [abilityScoreRolls, setAbilityScoreRolls] = useState({
    strength: [0, 0, 0, 0],
    dexterity: [0, 0, 0, 0],
    constitution: [0, 0, 0, 0],
    intelligence: [0, 0, 0, 0],
    wisdom: [0, 0, 0, 0],
    charisma: [0, 0, 0, 0],
  });

  // Feat/ASI Tracking (levels 4, 8, 12, 16, 19)
  const [asiChoices, setAsiChoices] = useState({
    level4: {
      type: 'ASI',
      abilityIncreases: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
      featName: '',
    },
    level8: {
      type: 'ASI',
      abilityIncreases: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
      featName: '',
    },
    level12: {
      type: 'ASI',
      abilityIncreases: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
      featName: '',
    },
    level16: {
      type: 'ASI',
      abilityIncreases: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
      featName: '',
    },
    level19: {
      type: 'ASI',
      abilityIncreases: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
      featName: '',
    },
  });

  // Automatic Feat Tracking
  const [characterFeats, setCharacterFeats] = useState<Feat[]>([]);
  const [manualFeats, setManualFeats] = useState<Feat[]>([]);

  // Function to get automatic feats based on class and level
  const getAutomaticFeats = (characterClass: string, level: number, race: string): Feat[] => {
    const allFeats: Feat[] = [];

    // Add racial feats
    if (RACIAL_FEATS[race]) {
      allFeats.push(...RACIAL_FEATS[race]);
    }

    // Add class feats up to current level
    if (CLASS_FEATS[characterClass]) {
      for (let lvl = 1; lvl <= level; lvl++) {
        if (CLASS_FEATS[characterClass][lvl]) {
          allFeats.push(...CLASS_FEATS[characterClass][lvl]);
        }
      }
    }

    return allFeats;
  };

  // Function to add a manual feat
  const addManualFeat = (featName: string, description: string = '', level?: number) => {
    const newFeat: Feat = {
      name: featName,
      description: description || 'Custom feat',
      source: 'manual',
      level: level,
    };
    setManualFeats((prev) => [...prev, newFeat]);
  };

  // Function to remove a manual feat
  const removeManualFeat = (index: number) => {
    setManualFeats((prev) => prev.filter((_, i) => i !== index));
  };

  // Function to add a custom spell
  const addCustomSpell = (level: number) => {
    const newSpell = {
      Name: '',
      name: '',
      Level: level,
      level: level,
      School: '',
      school: '',
      CastingTime: '',
      casting_time: '',
      Range: '',
      range: '',
      Duration: '',
      duration: '',
      Components: '',
      components: '',
      'Area or Targets': '',
      area_of_effect: '',
      'Save or Attack': '',
      save: '',
      Effect: '',
      description: '',
      effect: '',
      Tags: '',
      tags: '',
      isCustom: true,
      id: Date.now() + Math.random(), // Unique ID
    };

    setCustomSpells((prev) => ({
      ...prev,
      [level]: [...(prev[level] || []), newSpell],
    }));
  };

  // Function to remove a custom spell
  const removeCustomSpell = (level: number, spellId: string | number) => {
    setCustomSpells((prev) => ({
      ...prev,
      [level]: (prev[level] || []).filter((spell) => spell.id !== spellId),
    }));
  };

  // Function to update a custom spell
  const updateCustomSpell = (level: number, spellId: string | number, field: string, value: string) => {
    setCustomSpells((prev) => ({
      ...prev,
      [level]: (prev[level] || []).map((spell) =>
        spell.id === spellId ? { ...spell, [field]: value, [field.toLowerCase()]: value } : spell,
      ),
    }));
  };

  // Update automatic feats when character class, level, or race changes
  useEffect(() => {
    const autoFeats = getAutomaticFeats(character.class, character.level, character.race);
    setCharacterFeats(autoFeats);
  }, [character.class, character.level, character.race]);

  // Fantasy Calendar State
  const [currentDate, setCurrentDate] = useState({
    day: 14,
    season: 'Early Spring',
    year: 4122,
  });

  // Weather State
  const [currentWeather, setCurrentWeather] = useState(0); // 0=morning, 1=day, 2=evening, 3=night, 4=rainy, 5=snowy

  // Pre-calculated random values for visual effects (to prevent hydration errors)
  const [effectParticles, setEffectParticles] = useState<
    Array<{
      left: number;
      top: number;
      width: number;
      height: number;
      duration: number;
      delay: number;
      rotation?: number;
      color?: string;
    }>
  >([]);

  // Track if component has mounted (to prevent saving on initial render)
  const hasMountedRef = useRef(false);
  // Track the previous race and class to detect actual changes (not just initial load)
  const prevRaceRef = useRef(character.race);
  const prevClassRef = useRef(character.class);

  // Load character data from localStorage on component mount
  useEffect(() => {
    const savedCharacter = localStorage.getItem('dnd-character-data');
    const savedActiveTab = localStorage.getItem('dnd-active-tab');
    const savedDarkMode = localStorage.getItem('dnd-dark-mode');
    const savedAsiChoices = localStorage.getItem('dnd-asi-choices');
    const savedImages = localStorage.getItem('dnd-images');
    const savedSpellList = localStorage.getItem('dnd-master-spell-list');
    const savedKnownSpells = localStorage.getItem('dnd-known-spells');
    const savedSpellSlots = localStorage.getItem('dnd-spell-slots');
    const savedKnownSpellsOverride = localStorage.getItem('dnd-known-spells-override');
    const savedManualFeats = localStorage.getItem('dnd-manual-feats');
    const savedCustomSpells = localStorage.getItem('dnd-custom-spells');
    const savedDeathSaves = localStorage.getItem('dnd-death-saves');
    const savedVibeEffects = localStorage.getItem('dnd-vibe-effects');
    const savedGlassCards = localStorage.getItem('dnd-glass-cards');
    const savedGlassFrost = localStorage.getItem('dnd-glass-frost');
    const savedQuarryUses = localStorage.getItem('dnd-quarry-uses');

    if (savedCharacter) {
      try {
        const parsed = JSON.parse(savedCharacter);
        // Ensure sorceryPoints exists (migration for old data)
        if (!parsed.sorceryPoints) {
          parsed.sorceryPoints = { max: 0, used: 0 };
        }
        setCharacter(parsed);
      } catch (error) {
        console.warn('Failed to load character data from localStorage:', error);
      }
    }

    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }

    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }

    if (savedAsiChoices) {
      try {
        setAsiChoices(JSON.parse(savedAsiChoices));
      } catch (error) {
        console.warn('Failed to load ASI choices from localStorage:', error);
      }
    }

    if (savedImages) {
      try {
        const images = JSON.parse(savedImages);
        if (images.statsImage) setStatsImage(images.statsImage);
        if (images.backgroundImage) setBackgroundImage(images.backgroundImage);
        if (images.characterImage) setCharacterImage(images.characterImage);
        if (images.backgroundBlur !== undefined) setBackgroundBlur(images.backgroundBlur);
      } catch (error) {
        console.warn('Failed to load images from localStorage:', error);
      }
    }

    // Load spell list from localStorage
    if (savedSpellList) {
      try {
        const spellList = JSON.parse(savedSpellList);
        setMasterSpellList(spellList);
      } catch (error) {
        console.warn('Failed to load spell list from localStorage:', error);
      }
    }

    // Load known spells from localStorage
    if (savedKnownSpells) {
      try {
        const knownSpellsArray = JSON.parse(savedKnownSpells);
        setKnownSpells(new Set(knownSpellsArray));
      } catch (error) {
        console.warn('Failed to load known spells from localStorage:', error);
      }
    }

    // Load spell slots from localStorage (but don't override calculated ones)
    if (savedSpellSlots) {
      try {
        const savedSlots = JSON.parse(savedSpellSlots);
        // Only load the 'used' values, keep the 'max' values from calculations
        setSpellSlots((prev) => {
          const newSlots = { ...prev };
          Object.keys(savedSlots).forEach((level) => {
            if (newSlots[parseInt(level)]) {
              newSlots[parseInt(level)].used = savedSlots[level].used || 0;
            }
          });
          return newSlots;
        });
      } catch (error) {
        console.warn('Failed to load spell slots from localStorage:', error);
      }
    }

    // Load known spells override from localStorage
    if (savedKnownSpellsOverride) {
      try {
        const override = parseInt(savedKnownSpellsOverride);
        setKnownSpellsOverride(isNaN(override) ? null : override);
      } catch (error) {
        console.warn('Failed to load known spells override from localStorage:', error);
      }
    }

    // Load manual feats from localStorage
    if (savedManualFeats) {
      try {
        const manualFeatsArray = JSON.parse(savedManualFeats);
        setManualFeats(manualFeatsArray);
      } catch (error) {
        console.warn('Failed to load manual feats from localStorage:', error);
      }
    }

    // Load custom spells from localStorage
    if (savedCustomSpells) {
      try {
        const customSpellsData = JSON.parse(savedCustomSpells);
        setCustomSpells(customSpellsData);
      } catch (error) {
        console.warn('Failed to load custom spells from localStorage:', error);
      }
    }

    // Load death saves from localStorage
    if (savedDeathSaves) {
      try {
        const deathSavesData = JSON.parse(savedDeathSaves);
        setDeathSaves(deathSavesData);
      } catch (error) {
        console.warn('Failed to load death saves from localStorage:', error);
      }
    }

    // Load vibe effects from localStorage
    if (savedVibeEffects) {
      try {
        const vibeData = JSON.parse(savedVibeEffects);
        setVibeEffects(vibeData.effect || 'none');
        setVibeOpacity(vibeData.opacity || 50);
      } catch (error) {
        console.warn('Failed to load vibe effects from localStorage:', error);
      }
    }

    if (savedGlassCards) {
      try {
        setGlassCards(JSON.parse(savedGlassCards));
      } catch (error) {
        console.warn('Failed to load glass cards setting from localStorage:', error);
      }
    }

    if (savedGlassFrost) {
      try {
        const frost = JSON.parse(savedGlassFrost);
        if (typeof frost === 'number') setGlassFrost(Math.min(90, Math.max(55, frost)));
      } catch (error) {
        console.warn('Failed to load glass frost setting from localStorage:', error);
      }
    }

    // Load Ranger's Quarry uses from localStorage
    if (savedQuarryUses) {
      try {
        const quarryUses = parseInt(savedQuarryUses);
        setQuarryUsesRemaining(isNaN(quarryUses) ? 0 : quarryUses);
      } catch (error) {
        console.warn('Failed to load quarry uses from localStorage:', error);
      }
    }

    // Load HP-related data from localStorage
    const savedHitPointRolls = localStorage.getItem('dnd-hit-point-rolls');
    if (savedHitPointRolls) {
      try {
        const rollsArray = JSON.parse(savedHitPointRolls);
        setHitPointRolls(rollsArray);
      } catch (error) {
        console.warn('Failed to load hit point rolls from localStorage:', error);
      }
    }

    const savedHPBonuses = localStorage.getItem('dnd-hp-bonuses');
    if (savedHPBonuses) {
      try {
        const hpData = JSON.parse(savedHPBonuses);
        setAdditionalHPBonuses(hpData.additionalHPBonuses || 0);
        setHasToughness(hpData.hasToughness || false);
        setIsPHBHillDwarf(hpData.isPHBHillDwarf || false);
      } catch (error) {
        console.warn('Failed to load HP bonuses from localStorage:', error);
      }
    }

    // Load Initiative modifiers from localStorage
    const savedInitiativeModifiers = localStorage.getItem('dnd-initiative-modifiers');
    if (savedInitiativeModifiers) {
      try {
        const initModifiers = JSON.parse(savedInitiativeModifiers);
        setInitiativeModifiers(initModifiers);
      } catch (error) {
        console.warn('Failed to load initiative modifiers from localStorage:', error);
      }
    }

    // Load Weather state from localStorage
    const savedWeather = localStorage.getItem('dnd-weather');
    if (savedWeather) {
      try {
        const weatherState = JSON.parse(savedWeather);
        setCurrentWeather(weatherState);
      } catch (error) {
        console.warn('Failed to load weather from localStorage:', error);
      }
    }

    // Load Calendar state from localStorage
    const savedCalendar = localStorage.getItem('dnd-calendar');
    if (savedCalendar) {
      try {
        const calendarData = JSON.parse(savedCalendar);
        setCurrentDate((prevDate) => ({
          ...prevDate,
          season: calendarData.currentSeason !== undefined ? calendarData.currentSeason : prevDate.season,
          day: calendarData.currentDay !== undefined ? calendarData.currentDay : prevDate.day,
          year: calendarData.currentYear !== undefined ? calendarData.currentYear : prevDate.year,
        }));
      } catch (error) {
        console.warn('Failed to load calendar from localStorage:', error);
      }
    }

    // Load skill bonuses from localStorage
    const savedSkillBonuses = localStorage.getItem('dnd-skill-bonuses');
    if (savedSkillBonuses) {
      try {
        setSkillBonuses(JSON.parse(savedSkillBonuses));
      } catch (error) {
        console.warn('Failed to load skill bonuses from localStorage:', error);
      }
    }

    // Load proficiencies from localStorage
    const savedProficiencies = localStorage.getItem('dnd-proficiencies');
    if (savedProficiencies) {
      try {
        setProficiencies(JSON.parse(savedProficiencies));
      } catch (error) {
        console.warn('Failed to load proficiencies from localStorage:', error);
      }
    }

    // Load quick notes from localStorage
    const savedQuickNotes = localStorage.getItem('dnd-quick-notes');
    if (savedQuickNotes) {
      setQuickNotes(savedQuickNotes);
    }

    // Load inventory items from localStorage
    const savedEquippedItems = localStorage.getItem('dnd-equipped-items');
    if (savedEquippedItems) {
      try {
        setEquippedItems(JSON.parse(savedEquippedItems));
      } catch (error) {
        console.warn('Failed to load equipped items from localStorage:', error);
      }
    }

    const savedAttunedItems = localStorage.getItem('dnd-attuned-items');
    if (savedAttunedItems) {
      try {
        setAttunedItems(JSON.parse(savedAttunedItems));
      } catch (error) {
        console.warn('Failed to load attuned items from localStorage:', error);
      }
    }

    const savedInventoryItems = localStorage.getItem('dnd-inventory-items');
    if (savedInventoryItems) {
      try {
        setInventoryItems(JSON.parse(savedInventoryItems));
      } catch (error) {
        console.warn('Failed to load inventory items from localStorage:', error);
      }
    }

    const savedExternalStorage = localStorage.getItem('dnd-external-storage');
    if (savedExternalStorage) {
      try {
        setExternalStorage(JSON.parse(savedExternalStorage));
      } catch (error) {
        console.warn('Failed to load external storage from localStorage:', error);
      }
    }

    const savedAmmunition = localStorage.getItem('dnd-ammunition');
    if (savedAmmunition) {
      try {
        setAmmunition(JSON.parse(savedAmmunition));
      } catch (error) {
        console.warn('Failed to load ammunition from localStorage:', error);
      }
    }

    const savedArmor = localStorage.getItem('dnd-armor');
    if (savedArmor) {
      try {
        setArmor(JSON.parse(savedArmor));
      } catch (error) {
        console.warn('Failed to load armor from localStorage:', error);
      }
    }

    // Load resource tracking data from localStorage
    const savedPurse = localStorage.getItem('dnd-purse');
    if (savedPurse) {
      try {
        setPurse(JSON.parse(savedPurse));
      } catch (error) {
        console.warn('Failed to load purse from localStorage:', error);
      }
    }

    const savedRationBox = localStorage.getItem('dnd-ration-box');
    if (savedRationBox) {
      try {
        setRationBox(JSON.parse(savedRationBox));
      } catch (error) {
        console.warn('Failed to load ration box from localStorage:', error);
      }
    }

    const savedWaterskinBox = localStorage.getItem('dnd-waterskin-box');
    if (savedWaterskinBox) {
      try {
        setWaterskinBox(JSON.parse(savedWaterskinBox));
      } catch (error) {
        console.warn('Failed to load waterskin box from localStorage:', error);
      }
    }

    const savedSpeeds = localStorage.getItem('dnd-speeds');
    if (savedSpeeds) {
      try {
        setSpeeds(JSON.parse(savedSpeeds));
      } catch (error) {
        console.warn('Failed to load speeds from localStorage:', error);
      }
    }

    // Generate random particles for visual effects (client-side only)
    const generateParticles = (count: number, config: { colors?: string[] } = {}) => {
      const particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          left: Math.random() * 100,
          top: Math.random() * 100,
          width: 4 + Math.random() * 6,
          height: 4 + Math.random() * 6,
          duration: 2 + Math.random() * 2,
          delay: Math.random() * 3,
          rotation: Math.random() * 360,
          color: config.colors ? config.colors[Math.floor(Math.random() * config.colors.length)] : undefined,
        });
      }
      return particles;
    };

    setEffectParticles(generateParticles(100, { colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981'] }));

    // Mark that initial mount is complete AFTER all effects have run
    // Use setTimeout to ensure this happens after the current effect cycle
    setTimeout(() => {
      hasMountedRef.current = true;
    }, 0);
  }, []);

  // Save character data to localStorage whenever it changes (but not on initial mount)
  useEffect(() => {
    if (!hasMountedRef.current) return;
    localStorage.setItem('dnd-character-data', JSON.stringify(character));
  }, [character]);

  // Save active tab to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    localStorage.setItem('dnd-active-tab', activeTab);
  }, [activeTab]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    localStorage.setItem('dnd-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Save current weather to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    localStorage.setItem('dnd-weather', JSON.stringify(currentWeather));
  }, [currentWeather]);

  // Save current date to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    localStorage.setItem(
      'dnd-calendar',
      JSON.stringify({
        currentSeason: currentDate.season,
        currentDay: currentDate.day,
        currentYear: currentDate.year,
      }),
    );
  }, [currentDate]);

  // Save ASI choices to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    localStorage.setItem('dnd-asi-choices', JSON.stringify(asiChoices));
  }, [asiChoices]);

  // Save known spells to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-known-spells', JSON.stringify([...knownSpells]));
    } catch (error) {
      console.warn('Failed to save known spells to localStorage:', error);
    }
  }, [knownSpells]);

  // Save spell slots to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-spell-slots', JSON.stringify(spellSlots));
    } catch (error) {
      console.warn('Failed to save spell slots to localStorage:', error);
    }
  }, [spellSlots]);

  // Save known spells override to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      if (knownSpellsOverride !== null) {
        localStorage.setItem('dnd-known-spells-override', knownSpellsOverride.toString());
      } else {
        localStorage.removeItem('dnd-known-spells-override');
      }
    } catch (error) {
      console.warn('Failed to save known spells override to localStorage:', error);
    }
  }, [knownSpellsOverride]);

  // Save manual feats to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-manual-feats', JSON.stringify(manualFeats));
    } catch (error) {
      console.warn('Failed to save manual feats to localStorage:', error);
    }
  }, [manualFeats]);

  // Save custom spells to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-custom-spells', JSON.stringify(customSpells));
    } catch (error) {
      console.warn('Failed to save custom spells to localStorage:', error);
    }
  }, [customSpells]);

  // Save death saves to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-death-saves', JSON.stringify(deathSaves));
    } catch (error) {
      console.warn('Failed to save death saves to localStorage:', error);
    }
  }, [deathSaves]);

  // Save vibe effects to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-vibe-effects', JSON.stringify({ effect: vibeEffects, opacity: vibeOpacity }));
    } catch (error) {
      console.warn('Failed to save vibe effects to localStorage:', error);
    }
  }, [vibeEffects, vibeOpacity]);

  // Save the frosted-glass card preference to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-glass-cards', JSON.stringify(glassCards));
      localStorage.setItem('dnd-glass-frost', JSON.stringify(glassFrost));
    } catch (error) {
      console.warn('Failed to save glass cards setting to localStorage:', error);
    }
  }, [glassCards, glassFrost]);

  // Save Ranger's Quarry uses to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-quarry-uses', quarryUsesRemaining.toString());
    } catch (error) {
      console.warn('Failed to save quarry uses to localStorage:', error);
    }
  }, [quarryUsesRemaining]);

  // Auto-resize all feat description textareas on mount and when manualFeats change
  useEffect(() => {
    const textareas = document.querySelectorAll('textarea[placeholder="Feat description..."]');
    textareas.forEach((textarea) => {
      const element = textarea as HTMLTextAreaElement;
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    });
  }, [manualFeats]);

  // Auto-assign skills when race or class changes (but not on initial load)
  useEffect(() => {
    // Check if race or class actually changed (not just initial load)
    const raceChanged = prevRaceRef.current !== character.race;
    const classChanged = prevClassRef.current !== character.class;

    if (raceChanged || classChanged) {
      assignAutomaticSkills();

      // Update the previous values
      prevRaceRef.current = character.race;
      prevClassRef.current = character.class;
    }
  }, [character.race, character.class]);

  // Fantasy Calendar System
  const seasons = [
    { name: 'Early Spring', days: 30 },
    { name: 'Midspring', days: 31 },
    { name: 'Late Spring', days: 30 },
    { name: 'Early Summer', days: 31 },
    { name: 'Midsummer', days: 30 },
    { name: 'Late Summer', days: 31 },
    { name: 'Early Autumn', days: 30 },
    { name: 'Midautumn', days: 31 },
    { name: 'Late Autumn', days: 30 },
    { name: 'Early Winter', days: 30 },
    { name: 'Midwinter', days: 31 },
    { name: 'Late Winter', days: 30 },
  ];

  const getMaxDaysForSeason = (season: string) => {
    const foundSeason = seasons.find((s) => s.name === season);
    return foundSeason ? foundSeason.days : 30;
  };

  const getOrdinalNumber = (num: number) => {
    const remainder10 = num % 10;
    const remainder100 = num % 100;

    if (remainder100 >= 11 && remainder100 <= 13) {
      return num + 'th';
    }

    switch (remainder10) {
      case 1:
        return num + 'st';
      case 2:
        return num + 'nd';
      case 3:
        return num + 'rd';
      default:
        return num + 'th';
    }
  };

  // Weather Functions
  const weatherTypes = ['morning', 'day', 'evening', 'night', 'rainy', 'snowy'];

  const cycleWeather = () => {
    setCurrentWeather((prev) => (prev + 1) % weatherTypes.length);
  };

  const WeatherIcon = ({ type }: { type: number }) => {
    const iconStyle = 'w-16 h-16 cursor-pointer transition-transform hover:scale-110';

    switch (type) {
      case 0: // Morning - sun climbing out from behind the ridgeline
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible" aria-hidden="true">
              <defs>
                <radialGradient id="dawnGlowGrad" cx="50%" cy="72%" r="55%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="#fb7185" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="dawnSunGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef3c7" />
                  <stop offset="55%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                {/* Both the sun and its glow are clipped to below the peaks,
                    so the light pools in the valley instead of haloing over
                    the ridgeline. */}
                <clipPath id="dawnSkyClip">
                  <rect x="0" y="32" width="64" height="22" />
                </clipPath>
                {/* Rays are cut off at the mountain base so none show below it */}
                <clipPath id="dawnRayClip">
                  <rect x="0" y="0" width="64" height="52" />
                </clipPath>
              </defs>

              {/* Rays fan up past the peaks to read as first light breaking
                  over the ridge, but stop at the mountain base so none appear
                  underneath it. The diffuse glow stays penned in the valley. */}
              <g clipPath="url(#dawnRayClip)">
                {/* A fixed upper fan rather than a full turning wheel: rotating
                    rays kept sinking past the base clip and swinging back up,
                    which read as the fan drifting rather than as dawn light. */}
                {[-72, -48, -24, 0, 24, 48, 72].map((angle, i) => (
                  <rect
                    key={angle}
                    className="dawn-ray"
                    x="31.3"
                    y="20"
                    width="1.4"
                    height={i % 2 === 0 ? 7 : 4.5}
                    rx="0.7"
                    fill="#fcd34d"
                    style={{
                      transformOrigin: '32px 45px',
                      transform: `rotate(${angle}deg)`,
                      animationDelay: `${i * 0.45}s`,
                    }}
                  />
                ))}
              </g>

              <g clipPath="url(#dawnSkyClip)">
                <circle className="dawn-glow" cx="32" cy="46" r="22" fill="url(#dawnGlowGrad)" />
                <circle className="dawn-sun" cx="32" cy="45" r="10" fill="url(#dawnSunGrad)" />
              </g>

              {/* Two peaks with a notch between them for the sun to rise into */}
              <polygon points="0,52 18,30 34,52" fill="#334155" />
              <polygon points="28,52 48,34 64,52" fill="#2f3e52" />
              <polygon points="18,30 22.5,35.5 13.5,35.5" fill="#cbd5e1" opacity="0.7" />
              <polygon points="48,34 51.5,38.5 44.5,38.5" fill="#cbd5e1" opacity="0.55" />
              <rect x="0" y="51" width="64" height="3" fill="#2f3e52" />
            </svg>
          </div>
        );
      case 1: // Day - sun with a breathing corona and slowly turning rays
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible" aria-hidden="true">
              <defs>
                {/* Off-centre so the disc reads as lit from the upper left
                    rather than as a flat yellow circle. */}
                <radialGradient id="sunCoreGrad" cx="40%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="40%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </radialGradient>
                <radialGradient id="sunHaloGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.45" />
                  <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle className="sun-halo" cx="32" cy="32" r="31" fill="url(#sunHaloGrad)" />

              <g className="sun-rays">
                {Array.from({ length: 12 }, (_, i) => (
                  <rect
                    key={i}
                    x="31.1"
                    y="2"
                    width="1.8"
                    height={i % 2 === 0 ? 8 : 5}
                    rx="0.9"
                    fill="#fcd34d"
                    opacity={i % 2 === 0 ? 0.9 : 0.5}
                    style={{ transformOrigin: '32px 32px', transform: `rotate(${i * 30}deg)` }}
                  />
                ))}
              </g>

              <circle className="sun-core" cx="32" cy="32" r="13" fill="url(#sunCoreGrad)" />
              <circle cx="27" cy="26.5" r="3.8" fill="#fffdf0" opacity="0.45" />
            </svg>
          </div>
        );
      case 2: // Evening - sun sinking into the horizon
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible" aria-hidden="true">
              <defs>
                <radialGradient id="duskGlowGrad" cx="50%" cy="62%" r="55%">
                  <stop offset="0%" stopColor="#fb923c" stopOpacity="0.55" />
                  <stop offset="55%" stopColor="#ef4444" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="duskSunGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="duskSeaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c2d12" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#1e293b" stopOpacity="0.95" />
                </linearGradient>
                <clipPath id="duskSkyClip">
                  <rect x="0" y="0" width="64" height="40" />
                </clipPath>
              </defs>

              <circle className="dusk-glow" cx="32" cy="36" r="28" fill="url(#duskGlowGrad)" />

              <g clipPath="url(#duskSkyClip)">
                <circle className="dusk-sun" cx="32" cy="34" r="12" fill="url(#duskSunGrad)" />
              </g>

              {/* Horizon, plus a short reflected shimmer under the sun */}
              <rect x="0" y="40" width="64" height="18" fill="url(#duskSeaGrad)" />
              <rect className="dusk-shimmer" x="22" y="42.5" width="20" height="1.6" rx="0.8" fill="#fb923c" />
              <rect
                className="dusk-shimmer"
                x="25"
                y="46"
                width="14"
                height="1.4"
                rx="0.7"
                fill="#f97316"
                style={{ animationDelay: '0.8s' }}
              />
              <rect
                className="dusk-shimmer"
                x="27"
                y="49.5"
                width="10"
                height="1.2"
                rx="0.6"
                fill="#ea580c"
                style={{ animationDelay: '1.6s' }}
              />
            </svg>
          </div>
        );
      case 3: // Night - crescent moon with drifting stars
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible" aria-hidden="true">
              <defs>
                <radialGradient id="moonHaloGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="35%" stopColor="#e2e8f0" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#cbd5e1" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="moonBodyGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
                {/* Cut the crescent with a mask rather than covering the disc
                    with a slate circle, so it works over any wallpaper. */}
                <mask id="crescentMask">
                  <rect x="0" y="0" width="64" height="64" fill="black" />
                  <circle cx="30" cy="32" r="14" fill="white" />
                  <circle cx="38" cy="27" r="13" fill="black" />
                </mask>
              </defs>

              <circle className="moon-halo" cx="30" cy="32" r="24" fill="url(#moonHaloGrad)" />

              <g mask="url(#crescentMask)">
                <circle cx="30" cy="32" r="14" fill="url(#moonBodyGrad)" />
                <circle cx="24" cy="36" r="2.6" fill="#94a3b8" opacity="0.45" />
                <circle cx="28" cy="42" r="1.7" fill="#94a3b8" opacity="0.35" />
                <circle cx="22" cy="28" r="1.3" fill="#94a3b8" opacity="0.3" />
              </g>

              {[
                { x: 52, y: 12, r: 1.5, d: '0s' },
                { x: 58, y: 26, r: 1.1, d: '0.7s' },
                { x: 47, y: 40, r: 1.3, d: '1.4s' },
                { x: 12, y: 10, r: 1.2, d: '2.1s' },
                { x: 55, y: 52, r: 1, d: '2.8s' },
              ].map((s, i) => (
                <circle
                  key={i}
                  className="star-twinkle"
                  cx={s.x}
                  cy={s.y}
                  r={s.r}
                  fill="#ffffff"
                  style={{ animationDelay: s.d }}
                />
              ))}
            </svg>
          </div>
        );
      case 4: // Rainy - storm cloud with falling rain
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible" aria-hidden="true">
              <defs>
                <linearGradient id="stormCloudGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="55%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#3f4a5a" />
                </linearGradient>
                <linearGradient id="rainDropGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#93c5fd" stopOpacity="0" />
                  <stop offset="45%" stopColor="#60a5fa" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* One path for the whole cloud, so the puffs read as a single
                  mass instead of a pile of overlapping circles. */}
              <g className="storm-cloud">
                <path
                  d="M16 32 a9 9 0 0 1 3.5 -17 a12 12 0 0 1 22.5 -2 a9.5 9.5 0 0 1 6 19 z"
                  fill="url(#stormCloudGrad)"
                />
                <path
                  d="M19.5 15 a12 12 0 0 1 22.5 -2 a9.5 9.5 0 0 1 2.6 2.4 a13 13 0 0 0 -25.1 -0.4 z"
                  fill="#cbd5e1"
                  opacity="0.45"
                />
              </g>

              {[
                { x: 20, len: 8, d: '0s', dur: '1.1s' },
                { x: 27, len: 6, d: '0.35s', dur: '1.25s' },
                { x: 34, len: 9, d: '0.15s', dur: '1s' },
                { x: 41, len: 6.5, d: '0.55s', dur: '1.2s' },
                { x: 47, len: 7.5, d: '0.8s', dur: '1.15s' },
              ].map((r, i) => (
                <rect
                  key={i}
                  className="rain-drop"
                  x={r.x}
                  y="34"
                  width="1.7"
                  height={r.len}
                  rx="0.85"
                  fill="url(#rainDropGrad)"
                  style={{ animationDelay: r.d, animationDuration: r.dur }}
                />
              ))}
            </svg>
          </div>
        );
      case 5: // Snowy - soft cloud with drifting flakes
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible" aria-hidden="true">
              <defs>
                <linearGradient id="snowCloudGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#e8edf4" />
                  <stop offset="100%" stopColor="#c3cddb" />
                </linearGradient>
              </defs>

              <g className="snow-cloud">
                <path
                  d="M16 32 a9 9 0 0 1 3.5 -17 a12 12 0 0 1 22.5 -2 a9.5 9.5 0 0 1 6 19 z"
                  fill="url(#snowCloudGrad)"
                />
                <path
                  d="M19.5 15 a12 12 0 0 1 22.5 -2 a9.5 9.5 0 0 1 2.6 2.4 a13 13 0 0 0 -25.1 -0.4 z"
                  fill="#ffffff"
                  opacity="0.85"
                />
              </g>

              {/* Six-armed flakes drawn as strokes: they keep their shape at
                  this size where a text glyph would just blur. */}
              {[
                { x: 21, d: '0s', dur: '3.2s', s: 1 },
                { x: 32, d: '1.1s', dur: '2.8s', s: 0.78 },
                { x: 43, d: '2s', dur: '3.5s', s: 0.9 },
              ].map((f, i) => (
                <g
                  key={i}
                  className="snow-flake"
                  style={{ animationDelay: f.d, animationDuration: f.dur, transformOrigin: `${f.x}px 40px` }}
                >
                  <g
                    transform={`translate(${f.x} 40) scale(${f.s})`}
                    stroke="#ffffff"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  >
                    <line x1="0" y1="-4" x2="0" y2="4" />
                    <line x1="-3.5" y1="-2" x2="3.5" y2="2" />
                    <line x1="-3.5" y1="2" x2="3.5" y2="-2" />
                  </g>
                </g>
              ))}
            </svg>
          </div>
        );
      default:
        return <div className={iconStyle} onClick={cycleWeather}></div>;
    }
  };

  const [speeds, setSpeeds] = useState({
    walk: 30,
    climb: 0,
    swim: 0,
    burrow: 0,
    fly: 0,
  });

  const [skillBonuses, setSkillBonuses] = useState<{ skill: string; bonus: number }[]>([]);

  const [hitDice, setHitDice] = useState({
    d6: 0,
    d8: 0,
    d10: 0,
    d12: 5,
  });

  const [initiativeModifiers, setInitiativeModifiers] = useState({
    alert: false,
    jackOfAllTrades: false,
    wisMod: false,
    intMod: false,
    chaMod: false,
    additionalBonus: 0,
  });

  const [carryingSize, setCarryingSize] = useState('Medium');

  // Helper function to get known spells for a specific level
  const getKnownSpellsForLevel = (level: number) => {
    return masterSpellList
      .map((spell, index) => ({ spell, originalIndex: index }))
      .filter(({ spell, originalIndex }) => {
        const spellLevel = isNaN(parseFloat(spell.Level !== undefined ? spell.Level : spell.level))
          ? 0
          : parseFloat(spell.Level !== undefined ? spell.Level : spell.level);
        return spellLevel === level && knownSpells.has(originalIndex);
      })
      .map(({ spell }) => spell)
      .sort((a, b) => {
        const nameA = a.Name || a.name || 'Unknown Spell';
        const nameB = b.Name || b.name || 'Unknown Spell';
        return nameA.localeCompare(nameB);
      });
  };

  // Filter spells based on search term, class, and levels
  const getFilteredSpells = () => {
    return masterSpellList.filter((spell) => {
      // Search term filter
      const searchMatch =
        spellSearchTerm === '' ||
        (spell.Name || spell.name || '').toLowerCase().includes(spellSearchTerm.toLowerCase()) ||
        (spell.School || spell.school || '').toLowerCase().includes(spellSearchTerm.toLowerCase()) ||
        (spell.Effect || spell.description || spell.effect || '').toLowerCase().includes(spellSearchTerm.toLowerCase());

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
    });
  };

  // Calculate spell slots based on character class and level
  const calculateSpellSlots = (characterClass: string, level: number) => {
    const spellSlotTable: { [key: string]: { [level: number]: number[] } } = {
      // [level]: [1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th]
      Wizard: {
        1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
      },
      Sorcerer: {
        1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
      },
      Cleric: {
        1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
      },
      Bard: {
        1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
      },
      Druid: {
        1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
      },
      Paladin: {
        1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
      },
      Ranger: {
        1: [1, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
      },
      Warlock: {
        1: [1, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [0, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [0, 2, 0, 0, 0, 0, 0, 0, 0],
        5: [0, 0, 2, 0, 0, 0, 0, 0, 0],
        6: [0, 0, 2, 0, 0, 0, 0, 0, 0],
        7: [0, 0, 0, 2, 0, 0, 0, 0, 0],
        8: [0, 0, 0, 2, 0, 0, 0, 0, 0],
        9: [0, 0, 0, 0, 2, 0, 0, 0, 0],
        10: [0, 0, 0, 0, 2, 0, 0, 0, 0],
        11: [0, 0, 0, 0, 3, 0, 0, 0, 0],
        12: [0, 0, 0, 0, 3, 0, 0, 0, 0],
        13: [0, 0, 0, 0, 3, 0, 0, 0, 0],
        14: [0, 0, 0, 0, 3, 0, 0, 0, 0],
        15: [0, 0, 0, 0, 3, 0, 0, 0, 0],
        16: [0, 0, 0, 0, 3, 0, 0, 0, 0],
        17: [0, 0, 0, 0, 4, 0, 0, 0, 0],
        18: [0, 0, 0, 0, 4, 0, 0, 0, 0],
        19: [0, 0, 0, 0, 4, 0, 0, 0, 0],
        20: [0, 0, 0, 0, 4, 0, 0, 0, 0],
      },
    };

    const slots = spellSlotTable[characterClass]?.[level] || [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result: { [key: number]: { max: number; used: number } } = {};

    slots.forEach((maxSlots, index) => {
      if (maxSlots > 0) {
        result[index + 1] = { max: maxSlots, used: 0 };
      }
    });

    return result;
  };

  // Determine which spell levels a character can access based on class and level
  const getAccessibleSpellLevels = (characterClass: string, level: number): number[] => {
    const accessibleLevels = [0]; // Cantrips are always accessible for spellcasters

    // Non-spellcasters
    if (['Fighter', 'Barbarian', 'Rogue', 'Monk'].includes(characterClass)) {
      // Eldritch Knight (Fighter) and Arcane Trickster (Rogue) get spells at level 3
      if ((characterClass === 'Fighter' || characterClass === 'Rogue') && level >= 3) {
        // These subclasses learn spells more slowly than full casters
        if (level >= 3) accessibleLevels.push(1);
        if (level >= 7) accessibleLevels.push(2);
        if (level >= 13) accessibleLevels.push(3);
        if (level >= 19) accessibleLevels.push(4);
      }
      return accessibleLevels;
    }

    // Alternate Rangers start casting at level 1
    if (characterClass === 'Ranger') {
      if (level >= 1) accessibleLevels.push(1);
      if (level >= 5) accessibleLevels.push(2);
      if (level >= 9) accessibleLevels.push(3);
      if (level >= 13) accessibleLevels.push(4);
      if (level >= 17) accessibleLevels.push(5);
      return accessibleLevels;
    }

    // Paladins start casting at level 2
    if (characterClass === 'Paladin') {
      if (level >= 2) accessibleLevels.push(1);
      if (level >= 5) accessibleLevels.push(2);
      if (level >= 9) accessibleLevels.push(3);
      if (level >= 13) accessibleLevels.push(4);
      if (level >= 17) accessibleLevels.push(5);
      return accessibleLevels;
    }

    // Warlocks have unique spell progression
    if (characterClass === 'Warlock') {
      if (level >= 1) accessibleLevels.push(1);
      if (level >= 3) accessibleLevels.push(2);
      if (level >= 5) accessibleLevels.push(3);
      if (level >= 7) accessibleLevels.push(4);
      if (level >= 9) accessibleLevels.push(5);
      // Warlocks don't get 6th+ level spells through their pact magic
      return accessibleLevels;
    }

    // Full casters (Wizard, Sorcerer, Cleric, Bard, Druid)
    if (['Wizard', 'Sorcerer', 'Cleric', 'Bard', 'Druid'].includes(characterClass)) {
      if (level >= 1) accessibleLevels.push(1);
      if (level >= 3) accessibleLevels.push(2);
      if (level >= 5) accessibleLevels.push(3);
      if (level >= 7) accessibleLevels.push(4);
      if (level >= 9) accessibleLevels.push(5);
      if (level >= 11) accessibleLevels.push(6);
      if (level >= 13) accessibleLevels.push(7);
      if (level >= 15) accessibleLevels.push(8);
      if (level >= 17) accessibleLevels.push(9);
      return accessibleLevels;
    }

    return accessibleLevels;
  };

  // Functions for spell slot management
  const castSpell = (spellLevel: number) => {
    setSpellSlots((prev) => {
      const newSlots = { ...prev };
      if (newSlots[spellLevel] && newSlots[spellLevel].used < newSlots[spellLevel].max) {
        newSlots[spellLevel].used += 1;
      }
      return newSlots;
    });
  };

  const shortRest = () => {
    // Warlocks restore all spell slots on short rest
    if (character.class === 'Warlock') {
      setSpellSlots((prev) => {
        const newSlots = { ...prev };
        Object.keys(newSlots).forEach((level) => {
          newSlots[parseInt(level)].used = 0;
        });
        return newSlots;
      });
    }
  };

  const longRest = () => {
    // All classes restore all spell slots on long rest
    setSpellSlots((prev) => {
      const newSlots = { ...prev };
      Object.keys(newSlots).forEach((level) => {
        newSlots[parseInt(level)].used = 0;
      });
      return newSlots;
    });
  };

  // Update spell slots when character class or level changes
  useEffect(() => {
    const newSlots = calculateSpellSlots(character.class, character.level);
    setSpellSlots(newSlots);
  }, [character.class, character.level]);

  // Inventory management state
  const [encumbrance, setEncumbrance] = useState({
    openSlots: 18,
    maxSlots: 18,
    yourBulk: 0,
    status: 'Normal',
  });

  // Calculate inventory slots based on creature size and STR modifier
  const calculateMaxSlots = () => {
    const strMod = getModifier(character.abilityScores.strength);
    const sizeData = {
      Tiny: { base: 6, strMultiplier: 1 },
      Small: { base: 14, strMultiplier: 1 },
      Medium: { base: 18, strMultiplier: 1 },
      Large: { base: 22, strMultiplier: 2 },
      Huge: { base: 30, strMultiplier: 4 },
      Gargantuan: { base: 46, strMultiplier: 8 },
    };

    const size = sizeData[carryingSize as keyof typeof sizeData];
    return size.base + strMod * size.strMultiplier;
  };

  // Calculate minimum bulk based on creature size
  const calculateMinBulk = () => {
    const minBulkBySize = {
      Tiny: 5,
      Small: 10,
      Medium: 20,
      Large: 40,
      Huge: 80,
      Gargantuan: 160,
    };
    return minBulkBySize[carryingSize as keyof typeof minBulkBySize];
  };

  // Calculate encumbrance status
  const calculateEncumbranceStatus = (currentBulk?: number) => {
    const maxSlots = calculateMaxSlots();
    const bulk = currentBulk !== undefined ? currentBulk : calculateYourBulk();
    const maxCapacity = maxSlots + Math.floor(maxSlots / 2);

    if (bulk <= maxSlots) {
      return 'Normal';
    } else if (bulk <= maxCapacity) {
      return 'Encumbered';
    } else {
      return 'Overloaded';
    }
  };

  // Calculate effective speed with encumbrance penalty
  const getEffectiveSpeed = (baseSpeed: number) => {
    if (encumbrance.status === 'Encumbered' || encumbrance.status === 'Overloaded') {
      return Math.floor(baseSpeed / 2);
    }
    return baseSpeed;
  };

  // Calculate total bulk from all inventory sources
  const calculateInventoryBulk = () => {
    let totalBulk = 0;

    // Add bulk from equipped items
    totalBulk += equippedItems.reduce((sum, item) => sum + (item.bulk || 0), 0);

    // Add bulk from inventory items
    totalBulk += inventoryItems.reduce((sum, item) => sum + (item.bulk || 0), 0);

    // Add bulk from purse (coins) - 50 coins = 1 bulk
    totalBulk += calculatePurseBulk();

    // Add bulk from ration box
    totalBulk += rationBox.totalBulk;

    // Add bulk from waterskin box
    totalBulk += waterskinBox.totalBulk;

    return totalBulk;
  };

  // Calculate Your Bulk using the D&D formula
  const calculateYourBulk = () => {
    const maxSlots = calculateMaxSlots();
    const inventoryBulk = calculateInventoryBulk();
    const usedSlots = inventoryBulk; // Used slots = inventory bulk
    const minBulk = calculateMinBulk();

    return Math.max(minBulk, usedSlots);
  };

  const [purse, setPurse] = useState({
    iron: { amount: 0, value: 0.01 },
    copper: { amount: 0, value: 0.1 },
    silver: { amount: 0, value: 1 },
    gold: { amount: 0, value: 10 },
    platinum: { amount: 0, value: 100 },
  });

  const [rationBox, setRationBox] = useState({
    boxes: 0,
    rations: 0,
    totalBulk: 0,
  });

  const [waterskinBox, setWaterskinBox] = useState({
    skins: 0,
    rations: 0,
    totalBulk: 0,
  });

  const [magicalContainers, setMagicalContainers] = useState({
    bagOfHolding: { owned: '', slots: 6 },
    portableHole: { owned: '', slots: 9 },
    handyHaversack: { owned: '', slots: 12 },
    quiverOfEhlonna: { owned: '', slots: 9 },
  });

  const [quickNotes, setQuickNotes] = useState('');

  const [purchaseCalculator, setPurchaseCalculator] = useState({
    iron: { purchase: 0, after: 0 },
    copper: { purchase: 0, after: 0 },
    silver: { purchase: 0, after: 0 },
    gold: { purchase: 0, after: 0 },
    platinum: { purchase: 0, after: 0 },
  });

  const calculatePurseBulk = () => {
    const totalCoins = Object.values(purse).reduce((sum, coin) => sum + coin.amount, 0);
    return Math.floor(totalCoins / 50); // 50 coins = 1 bulk
  };

  const calculateTotalValue = () => {
    return Object.values(purse).reduce((sum, coin) => sum + coin.amount * coin.value, 0);
  };

  const handlePurchaseCalculation = () => {
    const newCalculator = { ...purchaseCalculator };
    Object.keys(newCalculator).forEach((coinType) => {
      const currentAmount = purse[coinType as keyof typeof purse]?.amount || 0;
      newCalculator[coinType as keyof typeof newCalculator].after =
        currentAmount - newCalculator[coinType as keyof typeof newCalculator].purchase;
    });
    setPurchaseCalculator(newCalculator);
  };

  // Additional inventory sections state
  const [equippedItems, setEquippedItems] = useState([
    { type: 'Armor', item: '', itemBonus: '', range: '', notches: '', valueSP: 0, bulk: 0, reqAtt: false },
    { type: '', item: '', itemBonus: '', range: '', notches: '', valueSP: 0, bulk: 0, reqAtt: false },
    { type: '', item: '', itemBonus: '', range: '', notches: '', valueSP: 0, bulk: 0, reqAtt: false },
  ]);

  const [attunedItems, setAttunedItems] = useState([
    { slot: 1, item: '', details: '' },
    { slot: 2, item: '', details: '' },
    { slot: 3, item: '', details: '' },
    { slot: 4, item: '', details: '', unlocked: false },
    { slot: 5, item: '', details: '', unlocked: false },
  ]);

  const [inventoryItems, setInventoryItems] = useState([
    { item: '', details: '', amount: 0, valueSP: 0, bulk: 0 },
    { item: '', details: '', amount: 0, valueSP: 0, bulk: 0 },
    { item: '', details: '', amount: 0, valueSP: 0, bulk: 0 },
  ]);

  const [externalStorage, setExternalStorage] = useState([
    { item: '', bulk: 0, location: '' },
    { item: '', bulk: 0, location: '' },
    { item: '', bulk: 0, location: '' },
  ]);

  const itemTypes = ['Armor', 'Ammunition', 'Attire', 'Ring', 'Shield', 'Weapon', 'Spell Focus'];

  // Save inventory data to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-equipped-items', JSON.stringify(equippedItems));
    } catch (error) {
      console.warn('Failed to save equipped items to localStorage:', error);
    }
  }, [equippedItems]);

  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-attuned-items', JSON.stringify(attunedItems));
    } catch (error) {
      console.warn('Failed to save attuned items to localStorage:', error);
    }
  }, [attunedItems]);

  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-inventory-items', JSON.stringify(inventoryItems));
    } catch (error) {
      console.warn('Failed to save inventory items to localStorage:', error);
    }
  }, [inventoryItems]);

  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-external-storage', JSON.stringify(externalStorage));
    } catch (error) {
      console.warn('Failed to save external storage to localStorage:', error);
    }
  }, [externalStorage]);

  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-ammunition', JSON.stringify(ammunition));
    } catch (error) {
      console.warn('Failed to save ammunition to localStorage:', error);
    }
  }, [ammunition]);

  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-armor', JSON.stringify(armor));
    } catch (error) {
      console.warn('Failed to save armor to localStorage:', error);
    }
  }, [armor]);

  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-proficiencies', JSON.stringify(proficiencies));
    } catch (error) {
      console.warn('Failed to save proficiencies to localStorage:', error);
    }
  }, [proficiencies]);

  // Save resource tracking data to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-purse', JSON.stringify(purse));
    } catch (error) {
      console.warn('Failed to save purse to localStorage:', error);
    }
  }, [purse]);

  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-ration-box', JSON.stringify(rationBox));
    } catch (error) {
      console.warn('Failed to save ration box to localStorage:', error);
    }
  }, [rationBox]);

  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-waterskin-box', JSON.stringify(waterskinBox));
    } catch (error) {
      console.warn('Failed to save waterskin box to localStorage:', error);
    }
  }, [waterskinBox]);

  // Save quick notes to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-quick-notes', quickNotes);
    } catch (error) {
      console.warn('Failed to save quick notes to localStorage:', error);
    }
  }, [quickNotes]);

  // Save speeds to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-speeds', JSON.stringify(speeds));
    } catch (error) {
      console.warn('Failed to save speeds to localStorage:', error);
    }
  }, [speeds]);

  // Save skill bonuses to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-skill-bonuses', JSON.stringify(skillBonuses));
    } catch (error) {
      console.warn('Failed to save skill bonuses to localStorage:', error);
    }
  }, [skillBonuses]);

  // Save images to localStorage with error handling
  useEffect(() => {
    if (!hasMountedRef.current) return;
    const images = {
      statsImage,
      backgroundImage,
      characterImage,
      backgroundBlur,
    };

    try {
      const imageData = JSON.stringify(images);
      // Check if the data size is too large (approximate check)
      if (imageData.length > 5000000) {
        // 5MB limit
        console.warn('Image data too large for localStorage, skipping save');
        // Clear previous saved images if they exist
        localStorage.removeItem('dnd-images');
        return;
      }
      localStorage.setItem('dnd-images', imageData);
    } catch (error) {
      if (error instanceof DOMException && error.code === DOMException.QUOTA_EXCEEDED_ERR) {
        console.warn('localStorage quota exceeded, clearing image data');
        // Clear all images from localStorage to free up space
        localStorage.removeItem('dnd-images');
        // Optionally notify user
        alert('Image storage limit exceeded. Please use smaller images or fewer images.');
      } else {
        console.warn('Failed to save images to localStorage:', error);
      }
    }
  }, [statsImage, backgroundImage, characterImage, backgroundBlur]);

  // Save HP-related data to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      localStorage.setItem('dnd-hit-point-rolls', JSON.stringify(hitPointRolls));
    } catch (error) {
      console.warn('Failed to save hit point rolls to localStorage:', error);
    }
  }, [hitPointRolls]);

  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      const hpData = {
        additionalHPBonuses,
        hasToughness,
        isPHBHillDwarf,
      };
      localStorage.setItem('dnd-hp-bonuses', JSON.stringify(hpData));
    } catch (error) {
      console.warn('Failed to save HP bonuses to localStorage:', error);
    }
  }, [additionalHPBonuses, hasToughness, isPHBHillDwarf]);

  // Update encumbrance calculations when dependencies change
  useEffect(() => {
    // Bulk values are fractional (0.11, 0.2, ...) so sums pick up float noise
    // like 2.800000000000001 — round to 2dp before it hits the UI.
    const round2 = (n: number) => Math.round(n * 100) / 100;
    const newMaxSlots = calculateMaxSlots();
    const inventoryBulk = calculateInventoryBulk();
    const newOpenSlots = round2(newMaxSlots - inventoryBulk);
    const newYourBulk = round2(calculateYourBulk());
    const newStatus = calculateEncumbranceStatus(newYourBulk);

    setEncumbrance((prev) => ({
      ...prev,
      maxSlots: newMaxSlots,
      openSlots: newOpenSlots,
      yourBulk: newYourBulk,
      status: newStatus,
    }));
  }, [
    character.abilityScores.strength,
    carryingSize,
    equippedItems,
    inventoryItems,
    purse,
    rationBox.totalBulk,
    waterskinBox.totalBulk,
  ]);

  const addEquippedItem = () => {
    setEquippedItems([
      ...equippedItems,
      { type: '', item: '', itemBonus: '', range: '', notches: '', valueSP: 0, bulk: 0, reqAtt: false },
    ]);
  };

  // Integration function to sync equipped items with other systems
  const syncEquippedItemToSystems = (equippedItem: any, index: number) => {
    const { type, item, itemBonus, notches } = equippedItem;

    switch (type) {
      case 'Armor':
        setArmor((prev) => ({
          ...prev,
          armorType: {
            item: item || prev.armorType.item,
            karuta: item ? 'Armor Item' : prev.armorType.karuta,
            plus: itemBonus || prev.armorType.plus,
            notches: notches || prev.armorType.notches,
          },
        }));
        break;

      case 'Shield':
        setArmor((prev) => ({
          ...prev,
          shieldType: {
            item: item || prev.shieldType.item,
            karuta: item ? `${item}` : prev.shieldType.karuta,
            plus: itemBonus || prev.shieldType.plus,
            notches: notches || prev.shieldType.notches,
          },
        }));
        break;

      case 'Attire':
        setArmor((prev) => ({
          ...prev,
          magicalAttire: {
            item1: item || prev.magicalAttire.item1,
            item2: prev.magicalAttire.item2,
            plus: itemBonus || prev.magicalAttire.plus,
            notches: notches || prev.magicalAttire.notches,
            karuta: prev.magicalAttire.karuta,
          },
        }));
        break;

      case 'Ammunition':
        // Find first empty ammunition slot or update existing
        setAmmunition((prev) => {
          const newAmmunition = [...prev];
          const emptyIndex = newAmmunition.findIndex((ammo) => ammo.name === '');
          if (emptyIndex !== -1) {
            newAmmunition[emptyIndex] = {
              name: item || '',
              weapon: '', // User can fill this in manually
              amount: itemBonus || '', // Using bonus field for amount
            };
          } else if (newAmmunition.length > 0) {
            // Update first slot if no empty slots
            newAmmunition[0] = {
              name: item || newAmmunition[0].name,
              weapon: newAmmunition[0].weapon,
              amount: itemBonus || newAmmunition[0].amount,
            };
          }
          return newAmmunition;
        });
        break;

      case 'Weapon':
        // For weapons, we could potentially add them to a weapons system if it exists
        // For now, this will just keep them in equipped items
        break;

      default:
        // Other item types stay in equipped items only
        break;
    }
  };

  const removeEquippedItem = () => {
    if (equippedItems.length > 1) {
      setEquippedItems(equippedItems.slice(0, -1));
    }
  };

  const addInventoryItem = () => {
    setInventoryItems([...inventoryItems, { item: '', details: '', amount: 0, valueSP: 0, bulk: 0 }]);
  };

  const removeInventoryItem = () => {
    if (inventoryItems.length > 1) {
      setInventoryItems(inventoryItems.slice(0, -1));
    }
  };

  const addExternalStorageItem = () => {
    setExternalStorage([...externalStorage, { item: '', bulk: 0, location: '' }]);
  };

  const removeExternalStorageItem = () => {
    if (externalStorage.length > 1) {
      setExternalStorage(externalStorage.slice(0, -1));
    }
  };

  const unlockAttunementSlot = (slotNumber: number) => {
    setAttunedItems(attunedItems.map((slot) => (slot.slot === slotNumber ? { ...slot, unlocked: true } : slot)));
  };

  const tabs = ['Stats', 'Inventory', 'Character', 'Spells', 'Library', 'Data'];

  // Save initiative modifiers to localStorage
  useEffect(() => {
    if (!hasMountedRef.current) return;
    if (initiativeModifiers) {
      localStorage.setItem('dnd-initiative-modifiers', JSON.stringify(initiativeModifiers));
    }
  }, [initiativeModifiers]);

  return (
    <div
      className={`min-h-screen p-4 font-sans relative ${glassCards ? '' : 'glass-off'} ${
        isDarkMode ? 'text-white' : 'text-black'
      } ${backgroundImage ? '' : isDarkMode ? 'bg-slate-900' : 'bg-gray-200'}`}
      style={
        {
          '--sheet-frost': glassFrost / 100,
          '--sheet-blur': `${Math.round(8 + glassFrost * 0.24)}px`,
        } as React.CSSProperties
      }
    >
      {backgroundImage && (
        // Fixed-position so the wallpaper always covers the visible viewport,
        // regardless of scroll position or content height. Previously this
        // was bound to the min-h-screen container, which on mobile (fixed
        // 1080px viewport) collapsed to content height and revealed the
        // outer bg-gray-900 above the fixed bottom tab bar.
        // Rendered as an early DOM sibling with no z-index — the content
        // wrapper below is `relative z-10`, so it paints on top by DOM order.
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: `blur(${backgroundBlur}px)`,
          }}
        />
      )}

      {/* Vibe Effects Overlay */}
      {/* Fixed like the wallpaper above: particles spawn at the top of the
          visible viewport and fall 100vh through it. When this was `absolute`
          it was bound to the sheet container, so on mobile (scrolled down,
          1080px scaled viewport) rain/snow only covered the top slice of
          the screen. */}
      {vibeEffects !== 'none' && (
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{
            opacity: vibeOpacity / 100,
            zIndex: 5,
          }}
        >
          {vibeEffects === 'rain' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 50).map((particle, i) => (
                <div
                  key={i}
                  className="absolute bg-blue-400"
                  style={{
                    left: `${particle.left}%`,
                    top: `-${particle.top}px`,
                    width: '2px',
                    height: `${20 + particle.width}px`,
                    animation: `fall ${0.5 + particle.duration * 0.25}s linear infinite`,
                    animationDelay: `${particle.delay}s`,
                  }}
                />
              ))}
            </div>
          )}

          {vibeEffects === 'snow' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 50).map((particle, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    left: `${particle.left}%`,
                    top: `-${particle.top}px`,
                    width: `${particle.width}px`,
                    height: `${particle.height}px`,
                    animation: `fall ${particle.duration}s linear infinite`,
                    animationDelay: `${particle.delay}s`,
                  }}
                />
              ))}
            </div>
          )}

          {vibeEffects === 'stars' && (
            <div className="absolute inset-0">
              {effectParticles.map((particle, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    width: `${1 + particle.width * 0.2}px`,
                    height: `${1 + particle.height * 0.2}px`,
                    animation: `twinkle ${1 + particle.duration * 0.5}s ease-in-out infinite`,
                    animationDelay: `${particle.delay}s`,
                  }}
                />
              ))}
            </div>
          )}

          {vibeEffects === 'magic' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 30).map((particle, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    width: `${10 + particle.width * 2}px`,
                    height: `${10 + particle.height * 2}px`,
                    background: `radial-gradient(circle, ${particle.color || '#a855f7'} 0%, transparent 70%)`,
                    animation: `float ${3 + particle.duration * 1.5}s ease-in-out infinite`,
                    animationDelay: `${particle.delay}s`,
                  }}
                />
              ))}
            </div>
          )}

          {vibeEffects === 'leaves' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 40).map((particle, i) => {
                const colors = ['#d97706', '#dc2626', '#ea580c', '#92400e'];
                return (
                  <div
                    key={i}
                    className="absolute rounded-sm"
                    style={{
                      left: `${particle.left}%`,
                      top: `-${particle.top}px`,
                      width: `${8 + particle.width}px`,
                      height: `${6 + particle.height * 0.8}px`,
                      backgroundColor: particle.color || colors[i % colors.length],
                      animation: `fallSway ${3 + particle.duration}s linear infinite`,
                      animationDelay: `${particle.delay}s`,
                      transform: `rotate(${particle.rotation}deg)`,
                    }}
                  />
                );
              })}
            </div>
          )}

          {vibeEffects === 'embers' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 30).map((particle, i) => {
                const colors = ['#dc2626', '#ea580c', '#f97316', '#fb923c', '#fbbf24', '#fcd34d'];
                const emberColor = colors[i % colors.length];
                return (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${particle.left}%`,
                      bottom: `-${particle.top * 0.5}px`,
                      width: `${3 + particle.width * 0.5}px`,
                      height: `${3 + particle.height * 0.5}px`,
                      backgroundColor: emberColor,
                      boxShadow: `0 0 ${8 + particle.width}px ${emberColor}`,
                      animation: `rise ${4 + particle.duration}s ease-in infinite`,
                      animationDelay: `${particle.delay}s`,
                    }}
                  />
                );
              })}
            </div>
          )}

          {vibeEffects === 'ash' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 50).map((particle, i) => (
                <div
                  key={i}
                  className="absolute bg-gray-600 rounded-sm"
                  style={{
                    left: `${particle.left}%`,
                    top: `-${particle.top}px`,
                    width: `${2 + particle.width * 0.4}px`,
                    height: `${2 + particle.height * 0.4}px`,
                    animation: `fallSway ${3 + particle.duration}s linear infinite`,
                    animationDelay: `${particle.delay}s`,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
          )}

          {vibeEffects === 'desert' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 60).map((particle, i) => {
                const colors = ['#d4a574', '#c19a6b', '#b8956a', '#d2b48c', '#c8ad7f'];
                const sandColor = colors[i % colors.length];
                return (
                  <div
                    key={i}
                    className="absolute rounded-sm"
                    style={{
                      left: `-${particle.left * 0.5}%`,
                      top: `${particle.top * 0.8}%`,
                      width: `${1 + particle.width * 0.3}px`,
                      height: `${1 + particle.height * 0.3}px`,
                      backgroundColor: sandColor,
                      animation: `blowSand ${2 + particle.duration * 0.5}s linear infinite`,
                      animationDelay: `${particle.delay}s`,
                      opacity: 0.7,
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes fallSway {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(25vh) translateX(20px) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(15px) rotate(270deg);
          }
          100% {
            transform: translateY(100vh) translateX(0) rotate(360deg);
          }
        }
        @keyframes rise {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-50vh) translateX(20px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) translateX(0);
            opacity: 0;
          }
        }
        @keyframes blowSand {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 0.3;
          }
          25% {
            transform: translateX(30vw) translateY(-10px);
            opacity: 0.7;
          }
          50% {
            transform: translateX(60vw) translateY(5px);
            opacity: 0.9;
          }
          75% {
            transform: translateX(90vw) translateY(-5px);
            opacity: 0.6;
          }
          100% {
            transform: translateX(120vw) translateY(0);
            opacity: 0;
          }
        }
      `}</style>

      <div className="relative z-10">
        <MobileTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="max-w-5xl mx-auto sheet-bottom-pad">
          {/* Tab Navigation - Above Main Box (desktop only; phones use MobileTabBar) */}
          <div className="no-touch flex justify-center mb-4 space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  activeTab === tab ? 'tab-pill-active text-white shadow-lg' : 'tab-pill text-gray-300 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Stats Tab */}
          {activeTab === 'Stats' && (
            <StatsTab
              character={character}
              isDarkMode={isDarkMode}
              setCharacter={setCharacter}
              updateCharacter={updateCharacter}
              getFinalAbilityScore={getFinalAbilityScore}
              getModifier={getModifier}
              getRacialBonus={getRacialBonus}
              getAsiBonus={getAsiBonus}
              getSaveModifier={getSaveModifier}
              getSkillModifier={getSkillModifier}
              calculateTotalAC={calculateTotalAC}
              calculateInitiativeModifier={calculateInitiativeModifier}
              getEffectiveMaxHP={getEffectiveMaxHP}
              calculateMaxHP={calculateMaxHP}
              formatHitDiceDisplay={formatHitDiceDisplay}
              calculateWeaponAttackBonus={calculateWeaponAttackBonus}
              hitPointRolls={hitPointRolls}
              additionalHPBonuses={additionalHPBonuses}
              hasToughness={hasToughness}
              isPHBHillDwarf={isPHBHillDwarf}
              currentHitDice={currentHitDice}
              setCurrentHitDice={setCurrentHitDice}
              damageReduction={damageReduction}
              setDamageReduction={setDamageReduction}
              deathSaves={deathSaves}
              setDeathSaves={setDeathSaves}
              ammunition={ammunition}
              updateAmmunition={updateAmmunition}
              armor={armor}
              updateArmor={updateArmor}
              ARMOR_DATA={ARMOR_DATA}
              SHIELD_DATA={SHIELD_DATA}
              getArmorOptions={getArmorOptions}
              getArmorDisplayName={getArmorDisplayName}
              getShieldOptions={getShieldOptions}
              getMagicalAttireOptions={getMagicalAttireOptions}
              characterFeats={characterFeats}
              manualFeats={manualFeats}
              setManualFeats={setManualFeats}
              addManualFeat={addManualFeat}
              removeManualFeat={removeManualFeat}
              quickNotes={quickNotes}
              setQuickNotes={setQuickNotes}
              currentDate={currentDate}
              currentWeather={currentWeather}
              WeatherIcon={WeatherIcon}
              getOrdinalNumber={getOrdinalNumber}
              quarryUsesRemaining={quarryUsesRemaining}
              setQuarryUsesRemaining={setQuarryUsesRemaining}
              getQuarryDie={getQuarryDie}
              getMaxQuarryUses={getMaxQuarryUses}
              statsImage={statsImage}
            />
          )}
          {/* Character Tab */}
          {activeTab === 'Character' && (
            <CharacterTab
              character={character}
              isDarkMode={isDarkMode}
              updateCharacter={updateCharacter}
              characterImage={characterImage}
              proficiencies={proficiencies}
              setProficiencies={setProficiencies}
              getSkillModifier={getSkillModifier}
            />
          )}

          {/* Spells Tab */}
          {activeTab === 'Spells' && (
            <SpellsTab
              character={character}
              isDarkMode={isDarkMode}
              setCharacter={setCharacter}
              getSpellcastingAbility={getSpellcastingAbility}
              calculateSpellDC={calculateSpellDC}
              calculateSpellAttack={calculateSpellAttack}
              getEffectiveKnownSpells={getEffectiveKnownSpells}
              calculateKnownSpells={calculateKnownSpells}
              knownSpellsOverride={knownSpellsOverride}
              setKnownSpellsOverride={setKnownSpellsOverride}
              getFinalAbilityScore={getFinalAbilityScore}
              getModifier={getModifier}
              spellSlots={spellSlots}
              setSpellSlots={setSpellSlots}
              castSpell={castSpell}
              shortRest={shortRest}
              longRest={longRest}
              getKnownSpellsForLevel={getKnownSpellsForLevel}
              getAccessibleSpellLevels={getAccessibleSpellLevels}
              customSpells={customSpells}
              addCustomSpell={addCustomSpell}
              removeCustomSpell={removeCustomSpell}
              updateCustomSpell={updateCustomSpell}
              hoveredSpell={hoveredSpell}
              setHoveredSpell={setHoveredSpell}
              mousePosition={mousePosition}
              setMousePosition={setMousePosition}
            />
          )}

          {/* Library Tab */}
          {activeTab === 'Library' && (
            <LibraryTab
              character={character}
              isDarkMode={isDarkMode}
              masterSpellList={masterSpellList}
              knownSpells={knownSpells}
              setKnownSpells={setKnownSpells}
              spellSearchTerm={spellSearchTerm}
              setSpellSearchTerm={setSpellSearchTerm}
              selectedSpellClass={selectedSpellClass}
              setSelectedSpellClass={setSelectedSpellClass}
              selectedSpellLevels={selectedSpellLevels}
              setSelectedSpellLevels={setSelectedSpellLevels}
              getAccessibleSpellLevels={getAccessibleSpellLevels}
              getFilteredSpells={getFilteredSpells}
            />
          )}

          {/* Inventory Tab */}
          {activeTab === 'Inventory' && (
            <InventoryTab
              character={character}
              isDarkMode={isDarkMode}
              encumbrance={encumbrance}
              getModifier={getModifier}
              purse={purse}
              setPurse={setPurse}
              calculatePurseBulk={calculatePurseBulk}
              calculateTotalValue={calculateTotalValue}
              rationBox={rationBox}
              setRationBox={setRationBox}
              waterskinBox={waterskinBox}
              setWaterskinBox={setWaterskinBox}
              magicalContainers={magicalContainers}
              setMagicalContainers={setMagicalContainers}
              purchaseCalculator={purchaseCalculator}
              setPurchaseCalculator={setPurchaseCalculator}
              handlePurchaseCalculation={handlePurchaseCalculation}
              equippedItems={equippedItems}
              setEquippedItems={setEquippedItems}
              addEquippedItem={addEquippedItem}
              removeEquippedItem={removeEquippedItem}
              syncEquippedItemToSystems={syncEquippedItemToSystems}
              inventoryItems={inventoryItems}
              setInventoryItems={setInventoryItems}
              addInventoryItem={addInventoryItem}
              removeInventoryItem={removeInventoryItem}
              externalStorage={externalStorage}
              setExternalStorage={setExternalStorage}
              addExternalStorageItem={addExternalStorageItem}
              removeExternalStorageItem={removeExternalStorageItem}
              attunedItems={attunedItems}
              setAttunedItems={setAttunedItems}
              unlockAttunementSlot={unlockAttunementSlot}
              itemTypes={itemTypes}
              carryingSize={carryingSize}
            />
          )}

          {/* Data Tab */}
          {activeTab === 'Data' && (
            <DataTab
              character={character}
              isDarkMode={isDarkMode}
              updateCharacter={updateCharacter}
              setCharacter={setCharacter}
              hitPointRolls={hitPointRolls}
              setHitPointRolls={setHitPointRolls}
              additionalHPBonuses={additionalHPBonuses}
              setAdditionalHPBonuses={setAdditionalHPBonuses}
              hasToughness={hasToughness}
              setHasToughness={setHasToughness}
              isPHBHillDwarf={isPHBHillDwarf}
              setIsPHBHillDwarf={setIsPHBHillDwarf}
              speeds={speeds}
              setSpeeds={setSpeeds}
              calculateHitDice={calculateHitDice}
              initiativeModifiers={initiativeModifiers}
              setInitiativeModifiers={setInitiativeModifiers}
              calculateInitiativeModifier={calculateInitiativeModifier}
              getFinalAbilityScore={getFinalAbilityScore}
              getModifier={getModifier}
              asiChoices={asiChoices}
              setAsiChoices={setAsiChoices}
              manualFeats={manualFeats}
              addManualFeat={addManualFeat}
              masterSpellList={masterSpellList}
              setMasterSpellList={setMasterSpellList}
              vibeEffects={vibeEffects}
              setVibeEffects={setVibeEffects}
              vibeOpacity={vibeOpacity}
              setVibeOpacity={setVibeOpacity}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              seasons={seasons}
              getMaxDaysForSeason={getMaxDaysForSeason}
              carryingSize={carryingSize}
              setCarryingSize={setCarryingSize}
              statsImage={statsImage}
              setStatsImage={setStatsImage}
              backgroundImage={backgroundImage}
              setBackgroundImage={setBackgroundImage}
              backgroundBlur={backgroundBlur}
              setBackgroundBlur={setBackgroundBlur}
              glassCards={glassCards}
              setGlassCards={setGlassCards}
              glassFrost={glassFrost}
              setGlassFrost={setGlassFrost}
              characterImage={characterImage}
              setCharacterImage={setCharacterImage}
              handleImageUrlChange={handleImageUrlChange}
              skillBonuses={skillBonuses}
              setSkillBonuses={setSkillBonuses}
            />
          )}

          {/* Spell Hover Card */}
          {hoveredSpell && (
            <div
              className="fixed z-50 pointer-events-none"
              style={{
                left: mousePosition.x + 20,
                top: mousePosition.y - 10,
                maxWidth: '400px',
              }}
            >
              <div
                className={`p-4 rounded-lg border shadow-xl ${
                  isDarkMode ? 'sheet-card text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
              >
                <div className="space-y-3">
                  {/* Spell Name and Level */}
                  <div className={`border-b pb-2 ${isDarkMode ? 'border-white/15' : 'border-gray-300'}`}>
                    <h3 className="text-lg font-bold text-orange-400">
                      {hoveredSpell.Name || hoveredSpell.name || 'Unknown Spell'}
                    </h3>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isNaN(parseFloat(hoveredSpell.Level !== undefined ? hoveredSpell.Level : hoveredSpell.level))
                        ? 'Unknown Level'
                        : parseFloat(hoveredSpell.Level !== undefined ? hoveredSpell.Level : hoveredSpell.level) === 0
                          ? 'Cantrip'
                          : `Level ${Math.floor(parseFloat(hoveredSpell.Level !== undefined ? hoveredSpell.Level : hoveredSpell.level))}`}{' '}
                      • {hoveredSpell.School || hoveredSpell.school || 'Unknown School'}
                    </div>
                  </div>

                  {/* Spell Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-semibold text-orange-300">Casting Time:</span>
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {hoveredSpell.CastingTime || hoveredSpell.casting_time || hoveredSpell.castingTime || 'Unknown'}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-orange-300">Range:</span>
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {hoveredSpell.Range || hoveredSpell.range || 'Unknown'}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-orange-300">Duration:</span>
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {hoveredSpell.Duration || hoveredSpell.duration || 'Unknown'}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-orange-300">Components:</span>
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {hoveredSpell.Components || hoveredSpell.components || 'Unknown'}
                      </div>
                    </div>
                  </div>

                  {/* Area/Targets */}
                  {(hoveredSpell['Area or Targets'] ||
                    hoveredSpell.area_of_effect ||
                    hoveredSpell.areaOfEffect ||
                    hoveredSpell.targets) && (
                    <div className="text-sm">
                      <span className="font-semibold text-orange-300">Area/Targets:</span>
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {hoveredSpell['Area or Targets'] ||
                          hoveredSpell.area_of_effect ||
                          hoveredSpell.areaOfEffect ||
                          hoveredSpell.targets}
                      </div>
                    </div>
                  )}

                  {/* Save/Attack */}
                  {(hoveredSpell['Save or Attack'] || hoveredSpell.save || hoveredSpell.attack) && (
                    <div className="text-sm">
                      <span className="font-semibold text-orange-300">Save/Attack:</span>
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {hoveredSpell['Save or Attack'] || hoveredSpell.save || hoveredSpell.attack}
                      </div>
                    </div>
                  )}

                  {/* Effect/Description */}
                  <div className="text-sm">
                    <span className="font-semibold text-orange-300">Effect:</span>
                    <div
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'} sheet-scroll mt-1 max-h-32 overflow-y-auto pr-1`}
                    >
                      {hoveredSpell.Effect ||
                        hoveredSpell.description ||
                        hoveredSpell.effect ||
                        'No description available'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
              isDarkMode
                ? 'bg-orange-700/55 hover:bg-orange-600/70 border border-orange-400/25 text-orange-50'
                : 'bg-black/40 hover:bg-black/55 border border-white/15 text-white'
            }`}
            aria-label="Toggle dark/light mode"
          >
            <div className="w-6 h-6 flex items-center justify-center">{isDarkMode ? '☀️' : '🌙'}</div>
          </button>
        </div>
      </div>
    </div>
  );
}
