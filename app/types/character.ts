export interface Feat {
  name: string;
  description: string;
  source: 'class' | 'race' | 'manual';
  level?: number;
}

export interface Character {
  name: string;
  class: string;
  race: string;
  background: string;
  alignment: string;
  level: number;
  trueName: string;
  age: string;
  raceGender: string;
  gender: string;
  mantra: string;
  birthplace: string;
  family: string;
  physique: string;
  likes: string;
  dislikes: string;
  flaws: string;
  nicknames: string;
  experiencePoints: number;
  hitPoints: {
    current: number;
    maximum: number;
    temporary: number;
  };
  hitDice: {
    total: string;
    used: number;
  };
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  proficiencyBonus: number;
  armorClass: number;
  initiative: number;
  speed: number;
  skills: {
    [key: string]: {
      proficient: boolean;
      expertise: boolean;
      source?: 'race' | 'class' | 'background' | 'manual' | 'auto';
      manualOverride?: boolean;
    };
  };
  savingThrows: {
    [key: string]: boolean;
  };
  equipment: Array<{
    name: string;
    quantity: number;
    weight: number;
    description: string;
  }>;
  spells: Array<{
    name: string;
    level: number;
    school: string;
    description: string;
    prepared: boolean;
  }>;
  spellSlots: {
    [key: string]: { total: number; used: number };
  };
  sorceryPoints: {
    max: number;
    used: number;
  };
  spellcastingAbility: 'Intelligence' | 'Wisdom' | 'Charisma';
  knownPreparedSpells: number;
  spellDC: number;
  spellAttack: number;
  features: Array<{
    name: string;
    description: string;
    source: string;
  }>;
  backstory: {
    personalityTraits: string;
    ideals: string;
    bonds: string;
    flaws: string;
    backstoryText: string;
    roleplayNotes?: string;
    arcHooks?: string;
  };
  weapons: Array<{
    name: string;
    type: string;
    finesse: boolean;
    proficient: boolean;
    notches: string;
    range: string;
    ability: string;
    atkBonus: string;
    damage: string;
  }>;
  survivalConditions: {
    hunger: { stage: string; effect: number };
    thirst: { stage: string; effect: number };
    fatigue: { stage: string; effect: number };
    additionalExhaustion: number;
    totalExhaustion: number;
  };
}
