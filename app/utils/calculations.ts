import { CLASS_SPELLCASTING_ABILITY } from '../data/dndConstants';

// --- Types ---

export interface AsiChoice {
  type: string;
  abilityIncreases: { [key: string]: number };
  featName: string;
}

export interface SkillData {
  proficient: boolean;
  expertise: boolean;
  source?: string;
  manualOverride?: boolean;
}

export interface SkillBonus {
  skill: string;
  bonus: number;
}

export interface ArmorInfo {
  armorType: { item: string; plus: string; notches: string };
  shieldType: { item: string; plus: string; notches: string };
  magicalAttire: { item1: string; item2: string; plus: string; notches: string };
}

export interface WeaponInfo {
  ability?: string;
  proficient: boolean;
  notches?: string;
}

// --- Constants ---

export const ARMOR_DATA: {
  [key: string]: { ac: number; type: 'Light' | 'Medium' | 'Heavy' | 'None'; maxDex?: number; stealthDis?: boolean };
} = {
  None: { ac: 10, type: 'None' },
  Padded: { ac: 11, type: 'Light', stealthDis: true },
  Leather: { ac: 11, type: 'Light' },
  'Studded Leather': { ac: 12, type: 'Light' },
  Hide: { ac: 12, type: 'Medium', maxDex: 2 },
  'Chain Shirt': { ac: 13, type: 'Medium', maxDex: 2 },
  'Scale Mail': { ac: 14, type: 'Medium', maxDex: 2, stealthDis: true },
  Breastplate: { ac: 14, type: 'Medium', maxDex: 2 },
  'Half Plate': { ac: 15, type: 'Medium', maxDex: 2, stealthDis: true },
  'Ring Mail': { ac: 14, type: 'Heavy', stealthDis: true },
  'Chain Mail': { ac: 16, type: 'Heavy', stealthDis: true },
  Splint: { ac: 17, type: 'Heavy', stealthDis: true },
  Plate: { ac: 18, type: 'Heavy', stealthDis: true },
};

export const SHIELD_DATA: { [key: string]: { ac: number } } = {
  None: { ac: 0 },
  Shield: { ac: 2 },
  'Tower Shield': { ac: 3 },
  Buckler: { ac: 1 },
};

// --- Pure Functions ---

/** Convert ability score to modifier: Math.floor((score - 10) / 2) */
export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Lookup racial ability score bonus for a given ability and race */
export function getRacialBonus(ability: string, race: string): number {
  const racialBonuses: { [key: string]: { [key: string]: number } } = {
    Human: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
    Dwarf: { constitution: 2, wisdom: 1 },
    Elf: { dexterity: 2, intelligence: 1 },
    Halfling: { dexterity: 2, charisma: 1 },
    Dragonborn: { strength: 2, charisma: 1 },
    Gnome: { intelligence: 2, constitution: 1 },
    'Half-Elf': { charisma: 2 },
    'Half-Orc': { strength: 2, constitution: 1 },
    Tiefling: { intelligence: 1, charisma: 2 },
  };
  return racialBonuses[race]?.[ability] || 0;
}

/** Sum ASI bonuses for a single ability across all ASI choices */
export function getAsiBonus(ability: string, asiChoices: { [key: string]: AsiChoice }): number {
  let totalBonus = 0;
  Object.values(asiChoices).forEach((choice) => {
    if (choice.type === 'ASI') {
      totalBonus += choice.abilityIncreases[ability] || 0;
    }
  });
  return totalBonus;
}

/** Calculate final ability score: base + racial + ASI */
export function getFinalAbilityScore(
  ability: string,
  abilityScores: { [key: string]: number },
  race: string,
  asiChoices: { [key: string]: AsiChoice },
): number {
  const baseScore = abilityScores[ability] || 0;
  const racialBonus = getRacialBonus(ability, race);
  const asiBonus = getAsiBonus(ability, asiChoices);
  return baseScore + racialBonus + asiBonus;
}

/** Get the spellcasting ability name for a class */
export function getSpellcastingAbility(characterClass: string): string {
  return CLASS_SPELLCASTING_ABILITY[characterClass] || 'wisdom';
}

/** Calculate Spell Save DC: 8 + proficiency + spellcasting ability modifier */
export function calculateSpellDC(
  characterClass: string,
  proficiencyBonus: number,
  abilityScores: { [key: string]: number },
  race: string,
  asiChoices: { [key: string]: AsiChoice },
): number {
  const spellcastingAbility = getSpellcastingAbility(characterClass);
  const finalScore = getFinalAbilityScore(spellcastingAbility, abilityScores, race, asiChoices);
  const abilityModifier = getModifier(finalScore);
  return 8 + proficiencyBonus + abilityModifier;
}

/** Calculate Spell Attack Bonus: proficiency + spellcasting ability modifier */
export function calculateSpellAttack(
  characterClass: string,
  proficiencyBonus: number,
  abilityScores: { [key: string]: number },
  race: string,
  asiChoices: { [key: string]: AsiChoice },
): number {
  const spellcastingAbility = getSpellcastingAbility(characterClass);
  const finalScore = getFinalAbilityScore(spellcastingAbility, abilityScores, race, asiChoices);
  const abilityModifier = getModifier(finalScore);
  return proficiencyBonus + abilityModifier;
}

/** Calculate skill modifier: ability mod + proficiency + expertise + custom bonus */
export function getSkillModifier(
  skill: string,
  ability: string,
  abilityScores: { [key: string]: number },
  race: string,
  asiChoices: { [key: string]: AsiChoice },
  skillData: SkillData,
  proficiencyBonus: number,
  skillBonuses: SkillBonus[],
): number {
  const finalScore = getFinalAbilityScore(ability, abilityScores, race, asiChoices);
  let modifier = getModifier(finalScore);

  if (skillData.proficient) {
    modifier += proficiencyBonus;
  }
  if (skillData.expertise) {
    modifier += proficiencyBonus;
  }

  const skillBonus = skillBonuses.find((sb) => sb.skill === skill);
  if (skillBonus) {
    modifier += skillBonus.bonus;
  }

  return modifier;
}

/** Calculate saving throw modifier: ability mod + proficiency (if proficient) */
export function getSaveModifier(
  ability: string,
  abilityScores: { [key: string]: number },
  race: string,
  asiChoices: { [key: string]: AsiChoice },
  isProficient: boolean,
  proficiencyBonus: number,
): number {
  const finalScore = getFinalAbilityScore(ability, abilityScores, race, asiChoices);
  const baseModifier = getModifier(finalScore);
  return isProficient ? baseModifier + proficiencyBonus : baseModifier;
}

/** Calculate weapon attack bonus: ability mod + proficiency + weapon bonus */
export function calculateWeaponAttackBonus(
  weapon: WeaponInfo,
  abilityScores: { [key: string]: number },
  race: string,
  asiChoices: { [key: string]: AsiChoice },
  proficiencyBonus: number,
): string {
  const finalScore = getFinalAbilityScore(weapon.ability?.toLowerCase() || 'strength', abilityScores, race, asiChoices);
  const abilityMod = getModifier(finalScore);
  const profBonus = weapon.proficient ? proficiencyBonus : 0;
  const weaponBonus = parseInt(weapon.notches?.replace(/[^-\d]/g, '') || '0') || 0;
  const total = abilityMod + profBonus + weaponBonus;
  return total >= 0 ? `+${total}` : `${total}`;
}

/** Calculate total AC based on D&D 5e armor rules */
export function calculateTotalAC(
  armor: ArmorInfo,
  abilityScores: { [key: string]: number },
  race: string,
  asiChoices: { [key: string]: AsiChoice },
): number {
  const armorName = armor.armorType.item || 'None';
  const shieldName = armor.shieldType.item || 'None';

  const armorData = ARMOR_DATA[armorName] || ARMOR_DATA['None'];
  const shieldData = SHIELD_DATA[shieldName] || SHIELD_DATA['None'];

  let totalAC = armorData.ac;

  const dexMod = getModifier(getFinalAbilityScore('dexterity', abilityScores, race, asiChoices));
  if (armorData.type === 'Light' || armorData.type === 'None') {
    totalAC += dexMod;
  } else if (armorData.type === 'Medium') {
    totalAC += Math.min(dexMod, armorData.maxDex || 2);
  }

  totalAC += shieldData.ac;

  const armorBonus = parseInt(armor.armorType.plus?.replace(/[^-\d]/g, '') || '0') || 0;
  const shieldBonus = parseInt(armor.shieldType.plus?.replace(/[^-\d]/g, '') || '0') || 0;
  const attireBonus = parseInt(armor.magicalAttire.plus?.replace(/[^-\d]/g, '') || '0') || 0;

  totalAC += armorBonus + shieldBonus + attireBonus;

  return totalAC;
}
