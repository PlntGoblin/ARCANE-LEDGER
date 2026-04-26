import { Feat } from '../types/character';

// D&D 5e Player's Handbook Classes
export const DND_CLASSES = [
  'Barbarian',
  'Bard',
  'Cleric',
  'Druid',
  'Fighter',
  'Monk',
  'Paladin',
  'Ranger',
  'Rogue',
  'Sorcerer',
  'Warlock',
  'Wizard',
];

// D&D 5e Player's Handbook Races
export const DND_RACES = [
  'Custom Lineage',
  'Dragonborn',
  'Dwarf',
  'Elf',
  'Gnome',
  'Half-Elf',
  'Half-Orc',
  'Halfling',
  'Human',
  'Tiefling',
];

// D&D 5e Alignments
export const DND_ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil',
];

// Gender Options
export const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Other'];

// Class Features that grant feats automatically
export const CLASS_FEATS: { [key: string]: { [level: number]: Feat[] } } = {
  Fighter: {
    1: [
      {
        name: 'Fighting Style',
        description: 'Choose a fighting style that grants combat bonuses',
        source: 'class',
        level: 1,
      },
    ],
    2: [{ name: 'Action Surge', description: 'Take an additional action on your turn', source: 'class', level: 2 }],
    3: [{ name: 'Martial Archetype', description: 'Choose your fighter subclass', source: 'class', level: 3 }],
    5: [
      { name: 'Extra Attack', description: 'Attack twice when you take the Attack action', source: 'class', level: 5 },
    ],
    9: [{ name: 'Indomitable', description: 'Reroll a failed saving throw', source: 'class', level: 9 }],
    11: [
      {
        name: 'Extra Attack (2)',
        description: 'Attack three times when you take the Attack action',
        source: 'class',
        level: 11,
      },
    ],
    20: [
      {
        name: 'Extra Attack (3)',
        description: 'Attack four times when you take the Attack action',
        source: 'class',
        level: 20,
      },
    ],
  },
  Rogue: {
    1: [
      { name: 'Expertise', description: 'Double proficiency bonus for two skills', source: 'class', level: 1 },
      { name: 'Sneak Attack', description: '1d6 extra damage when conditions are met', source: 'class', level: 1 },
    ],
    2: [
      { name: 'Cunning Action', description: 'Dash, Disengage, or Hide as a bonus action', source: 'class', level: 2 },
    ],
    3: [{ name: 'Roguish Archetype', description: 'Choose your rogue subclass', source: 'class', level: 3 }],
    5: [{ name: 'Uncanny Dodge', description: 'Halve damage from one attack per turn', source: 'class', level: 5 }],
    6: [
      {
        name: 'Expertise (Additional)',
        description: 'Double proficiency bonus for two more skills',
        source: 'class',
        level: 6,
      },
    ],
    7: [
      {
        name: 'Evasion',
        description: 'Take no damage on successful Dex saves, half on failures',
        source: 'class',
        level: 7,
      },
    ],
  },
  Wizard: {
    1: [
      { name: 'Spellcasting', description: 'Cast wizard spells using Intelligence', source: 'class', level: 1 },
      { name: 'Arcane Recovery', description: 'Recover spell slots on short rest', source: 'class', level: 1 },
    ],
    2: [{ name: 'Arcane Tradition', description: 'Choose your wizard school', source: 'class', level: 2 }],
    18: [
      {
        name: 'Spell Mastery',
        description: 'Cast certain spells without expending spell slots',
        source: 'class',
        level: 18,
      },
    ],
    20: [
      {
        name: 'Signature Spells',
        description: 'Always have two 3rd level spells prepared',
        source: 'class',
        level: 20,
      },
    ],
  },
  Barbarian: {
    1: [
      { name: 'Rage', description: 'Enter a battle rage for combat bonuses', source: 'class', level: 1 },
      { name: 'Unarmored Defense', description: 'AC = 10 + Dex + Con while unarmored', source: 'class', level: 1 },
    ],
    2: [
      {
        name: 'Reckless Attack',
        description: 'Gain advantage but enemies gain advantage against you',
        source: 'class',
        level: 2,
      },
      {
        name: 'Danger Sense',
        description: 'Advantage on Dex saves against traps and spells',
        source: 'class',
        level: 2,
      },
    ],
    3: [{ name: 'Primal Path', description: 'Choose your barbarian subclass', source: 'class', level: 3 }],
    5: [
      { name: 'Extra Attack', description: 'Attack twice when you take the Attack action', source: 'class', level: 5 },
      { name: 'Fast Movement', description: 'Speed increases by 10 feet', source: 'class', level: 5 },
    ],
  },
  Bard: {
    1: [
      { name: 'Spellcasting', description: 'Cast bard spells using Charisma', source: 'class', level: 1 },
      { name: 'Bardic Inspiration', description: 'Inspire allies with bonus action', source: 'class', level: 1 },
    ],
    2: [
      {
        name: 'Jack of All Trades',
        description: 'Add half proficiency to non-proficient checks',
        source: 'class',
        level: 2,
      },
      { name: 'Song of Rest', description: 'Improve short rest healing with performance', source: 'class', level: 2 },
    ],
    3: [
      { name: 'Bard College', description: 'Choose your bard subclass', source: 'class', level: 3 },
      { name: 'Expertise', description: 'Double proficiency bonus for two skills', source: 'class', level: 3 },
    ],
  },
  Cleric: {
    1: [
      { name: 'Spellcasting', description: 'Cast cleric spells using Wisdom', source: 'class', level: 1 },
      { name: 'Divine Domain', description: 'Choose your cleric domain', source: 'class', level: 1 },
    ],
    2: [
      {
        name: 'Channel Divinity',
        description: 'Use divine energy for supernatural effects',
        source: 'class',
        level: 2,
      },
    ],
    5: [{ name: 'Destroy Undead', description: 'Channel Divinity to destroy undead', source: 'class', level: 5 }],
  },
  Druid: {
    1: [
      { name: 'Spellcasting', description: 'Cast druid spells using Wisdom', source: 'class', level: 1 },
      { name: 'Druidcraft', description: 'Know the Druidcraft cantrip', source: 'class', level: 1 },
    ],
    2: [
      { name: 'Wild Shape', description: 'Transform into beasts', source: 'class', level: 2 },
      { name: 'Druid Circle', description: 'Choose your druid subclass', source: 'class', level: 2 },
    ],
    18: [
      {
        name: 'Timeless Body',
        description: 'Age more slowly and cannot be aged magically',
        source: 'class',
        level: 18,
      },
    ],
    20: [{ name: 'Archdruid', description: 'Unlimited Wild Shape uses', source: 'class', level: 20 }],
  },
};

// Racial Features that grant feats
export const RACIAL_FEATS: { [key: string]: Feat[] } = {
  Human: [
    { name: 'Extra Skill', description: 'Gain proficiency in one additional skill', source: 'race' },
    { name: 'Extra Language', description: 'Learn one additional language', source: 'race' },
    { name: 'Versatile', description: '+1 to all ability scores', source: 'race' },
  ],
  Elf: [
    { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'race' },
    { name: 'Keen Senses', description: 'Proficiency in Perception', source: 'race' },
    { name: 'Fey Ancestry', description: 'Advantage on saves against charm, immune to magical sleep', source: 'race' },
    { name: 'Trance', description: 'Meditate for 4 hours instead of sleeping for 8', source: 'race' },
  ],
  Dwarf: [
    { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'race' },
    {
      name: 'Dwarven Resilience',
      description: 'Advantage on saves against poison, resistance to poison damage',
      source: 'race',
    },
    {
      name: 'Dwarven Combat Training',
      description: 'Proficiency with battleaxe, handaxe, light hammer, warhammer',
      source: 'race',
    },
    {
      name: 'Stonecunning',
      description: 'Add double proficiency to History checks related to stonework',
      source: 'race',
    },
  ],
  Halfling: [
    { name: 'Lucky', description: 'Reroll natural 1s on attack rolls, ability checks, and saves', source: 'race' },
    { name: 'Brave', description: 'Advantage on saves against being frightened', source: 'race' },
    { name: 'Halfling Nimbleness', description: 'Move through space of larger creatures', source: 'race' },
  ],
  Dragonborn: [
    { name: 'Draconic Ancestry', description: 'Choose a dragon type for breath weapon and resistance', source: 'race' },
    { name: 'Breath Weapon', description: 'Use breath weapon based on draconic ancestry', source: 'race' },
    {
      name: 'Damage Resistance',
      description: 'Resistance to damage type associated with draconic ancestry',
      source: 'race',
    },
  ],
  Gnome: [
    { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'race' },
    { name: 'Gnome Cunning', description: 'Advantage on mental saves against magic', source: 'race' },
  ],
  'Half-Elf': [
    { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'race' },
    { name: 'Fey Ancestry', description: 'Advantage on saves against charm, immune to magical sleep', source: 'race' },
    { name: 'Extra Skills', description: 'Gain proficiency in two additional skills', source: 'race' },
  ],
  'Half-Orc': [
    { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'race' },
    { name: 'Relentless Endurance', description: 'Drop to 1 HP instead of 0 once per long rest', source: 'race' },
    { name: 'Savage Attacks', description: 'Roll extra weapon damage die on critical hits', source: 'race' },
  ],
  Tiefling: [
    { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'race' },
    { name: 'Hellish Resistance', description: 'Resistance to fire damage', source: 'race' },
    { name: 'Infernal Legacy', description: 'Know Thaumaturgy cantrip, gain spells at higher levels', source: 'race' },
  ],
};

// Class skill proficiencies (D&D 5e)
export const CLASS_SKILLS: { [key: string]: string[] } = {
  Barbarian: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
  Bard: ['Deception', 'History', 'Investigation', 'Persuasion', 'Performance', 'Sleight of Hand'],
  Cleric: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
  Druid: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
  Fighter: [
    'Acrobatics',
    'Animal Handling',
    'Athletics',
    'History',
    'Insight',
    'Intimidation',
    'Perception',
    'Survival',
  ],
  Monk: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
  Paladin: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
  Ranger: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
  Rogue: [
    'Acrobatics',
    'Athletics',
    'Deception',
    'Insight',
    'Intimidation',
    'Investigation',
    'Perception',
    'Performance',
    'Persuasion',
    'Sleight of Hand',
    'Stealth',
  ],
  Sorcerer: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
  Warlock: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
  Wizard: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
};

// Number of skill proficiencies each class gets
export const CLASS_SKILL_COUNT: { [key: string]: number } = {
  Barbarian: 2,
  Bard: 3,
  Cleric: 2,
  Druid: 2,
  Fighter: 2,
  Monk: 2,
  Paladin: 2,
  Ranger: 3,
  Rogue: 4,
  Sorcerer: 2,
  Warlock: 2,
  Wizard: 2,
};

// Racial skill proficiencies (guaranteed)
export const RACIAL_SKILLS: { [key: string]: string[] } = {
  Elf: ['Perception'],
  'Half-Elf': [],
  Human: [],
  Dwarf: [],
  Halfling: [],
  Dragonborn: [],
  Gnome: [],
  'Half-Orc': [],
  Tiefling: [],
};

// D&D 5e Class Hit Dice (Player's Handbook)
export const CLASS_HIT_DICE: { [key: string]: string } = {
  Barbarian: 'd12',
  Bard: 'd8',
  Cleric: 'd8',
  Druid: 'd8',
  Fighter: 'd10',
  Monk: 'd8',
  Paladin: 'd10',
  Ranger: 'd10',
  Rogue: 'd8',
  Sorcerer: 'd6',
  Warlock: 'd8',
  Wizard: 'd6',
};

// D&D 5e Class Spellcasting Abilities
export const CLASS_SPELLCASTING_ABILITY: { [key: string]: string } = {
  Bard: 'charisma',
  Cleric: 'wisdom',
  Druid: 'wisdom',
  Paladin: 'charisma',
  Ranger: 'wisdom',
  Sorcerer: 'charisma',
  Warlock: 'charisma',
  Wizard: 'intelligence',
  Barbarian: 'wisdom',
  Fighter: 'intelligence',
  Monk: 'wisdom',
  Rogue: 'intelligence',
};
