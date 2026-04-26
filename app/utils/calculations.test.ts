import { describe, it, expect } from 'vitest';
import {
  getModifier,
  getRacialBonus,
  getAsiBonus,
  getFinalAbilityScore,
  getSpellcastingAbility,
  calculateSpellDC,
  calculateSpellAttack,
  getSkillModifier,
  getSaveModifier,
  calculateWeaponAttackBonus,
  calculateTotalAC,
  ARMOR_DATA,
  SHIELD_DATA,
} from './calculations';

// --- Helpers ---

const emptyAsi = {
  level4: {
    type: 'ASI',
    abilityIncreases: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
    featName: '',
  },
};

const baseScores = {
  strength: 10,
  dexterity: 14,
  constitution: 12,
  intelligence: 16,
  wisdom: 13,
  charisma: 8,
};

// --- Tests ---

describe('getModifier', () => {
  it('returns 0 for score of 10', () => {
    expect(getModifier(10)).toBe(0);
  });

  it('returns 0 for score of 11', () => {
    expect(getModifier(11)).toBe(0);
  });

  it('returns +1 for score of 12', () => {
    expect(getModifier(12)).toBe(1);
  });

  it('returns +5 for score of 20', () => {
    expect(getModifier(20)).toBe(5);
  });

  it('returns -1 for score of 8', () => {
    expect(getModifier(8)).toBe(-1);
  });

  it('returns -5 for score of 1', () => {
    expect(getModifier(1)).toBe(-5);
  });
});

describe('getRacialBonus', () => {
  it('returns +2 STR for Dragonborn', () => {
    expect(getRacialBonus('strength', 'Dragonborn')).toBe(2);
  });

  it('returns +1 to all for Human', () => {
    expect(getRacialBonus('strength', 'Human')).toBe(1);
    expect(getRacialBonus('charisma', 'Human')).toBe(1);
  });

  it('returns 0 for non-matching ability', () => {
    expect(getRacialBonus('strength', 'Elf')).toBe(0);
  });

  it('returns 0 for unknown race', () => {
    expect(getRacialBonus('strength', 'Custom Lineage')).toBe(0);
  });
});

describe('getAsiBonus', () => {
  it('returns 0 with no ASI choices', () => {
    expect(getAsiBonus('strength', emptyAsi)).toBe(0);
  });

  it('sums ASI bonuses across multiple levels', () => {
    const asi = {
      level4: {
        type: 'ASI',
        abilityIncreases: { strength: 2, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
        featName: '',
      },
      level8: {
        type: 'ASI',
        abilityIncreases: { strength: 1, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
        featName: '',
      },
    };
    expect(getAsiBonus('strength', asi)).toBe(3);
  });

  it('ignores feat choices (type !== ASI)', () => {
    const asi = {
      level4: {
        type: 'Feat',
        abilityIncreases: { strength: 2, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
        featName: 'Great Weapon Master',
      },
    };
    expect(getAsiBonus('strength', asi)).toBe(0);
  });
});

describe('getFinalAbilityScore', () => {
  it('returns base score when no race or ASI bonuses', () => {
    expect(getFinalAbilityScore('strength', baseScores, 'Custom Lineage', emptyAsi)).toBe(10);
  });

  it('adds racial bonus', () => {
    // Dragonborn +2 STR
    expect(getFinalAbilityScore('strength', baseScores, 'Dragonborn', emptyAsi)).toBe(12);
  });

  it('adds both racial and ASI bonuses', () => {
    const asi = {
      level4: {
        type: 'ASI',
        abilityIncreases: { strength: 2, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
        featName: '',
      },
    };
    // 10 base + 2 racial (Dragonborn) + 2 ASI = 14
    expect(getFinalAbilityScore('strength', { ...baseScores }, 'Dragonborn', asi)).toBe(14);
  });
});

describe('getSpellcastingAbility', () => {
  it('returns charisma for Sorcerer', () => {
    expect(getSpellcastingAbility('Sorcerer')).toBe('charisma');
  });

  it('returns intelligence for Wizard', () => {
    expect(getSpellcastingAbility('Wizard')).toBe('intelligence');
  });

  it('returns wisdom for Cleric', () => {
    expect(getSpellcastingAbility('Cleric')).toBe('wisdom');
  });

  it('defaults to wisdom for unknown class', () => {
    expect(getSpellcastingAbility('Artificer')).toBe('wisdom');
  });
});

describe('calculateSpellDC', () => {
  it('calculates 8 + prof + ability mod for Wizard with INT 16', () => {
    // INT 16 → mod +3, prof 2 → DC = 8 + 2 + 3 = 13
    expect(calculateSpellDC('Wizard', 2, baseScores, 'Custom Lineage', emptyAsi)).toBe(13);
  });

  it('accounts for racial bonus in spell DC', () => {
    // Elf gets +1 INT → INT 17 → mod +3, still DC 13
    expect(calculateSpellDC('Wizard', 2, baseScores, 'Elf', emptyAsi)).toBe(13);
    // Gnome gets +2 INT → INT 18 → mod +4, DC 14
    expect(calculateSpellDC('Wizard', 2, baseScores, 'Gnome', emptyAsi)).toBe(14);
  });
});

describe('calculateSpellAttack', () => {
  it('calculates prof + ability mod for Wizard with INT 16', () => {
    // INT 16 → mod +3, prof 2 → attack = 2 + 3 = 5
    expect(calculateSpellAttack('Wizard', 2, baseScores, 'Custom Lineage', emptyAsi)).toBe(5);
  });

  it('uses Charisma for Sorcerer', () => {
    // CHA 8 → mod -1, prof 2 → attack = 2 + (-1) = 1
    expect(calculateSpellAttack('Sorcerer', 2, baseScores, 'Custom Lineage', emptyAsi)).toBe(1);
  });
});

describe('getSkillModifier', () => {
  it('returns base modifier when not proficient', () => {
    const skillData = { proficient: false, expertise: false };
    // DEX 14 → mod +2
    expect(getSkillModifier('Stealth', 'dexterity', baseScores, 'Custom Lineage', emptyAsi, skillData, 2, [])).toBe(2);
  });

  it('adds proficiency when proficient', () => {
    const skillData = { proficient: true, expertise: false };
    // DEX 14 → mod +2 + prof 2 = 4
    expect(getSkillModifier('Stealth', 'dexterity', baseScores, 'Custom Lineage', emptyAsi, skillData, 2, [])).toBe(4);
  });

  it('adds proficiency twice for expertise', () => {
    const skillData = { proficient: true, expertise: true };
    // DEX 14 → mod +2 + prof 2 + expertise 2 = 6
    expect(getSkillModifier('Stealth', 'dexterity', baseScores, 'Custom Lineage', emptyAsi, skillData, 2, [])).toBe(6);
  });

  it('adds custom skill bonus', () => {
    const skillData = { proficient: true, expertise: false };
    const bonuses = [{ skill: 'Stealth', bonus: 3 }];
    // DEX 14 → mod +2 + prof 2 + bonus 3 = 7
    expect(
      getSkillModifier('Stealth', 'dexterity', baseScores, 'Custom Lineage', emptyAsi, skillData, 2, bonuses),
    ).toBe(7);
  });
});

describe('getSaveModifier', () => {
  it('returns base modifier when not proficient', () => {
    // DEX 14 → mod +2
    expect(getSaveModifier('dexterity', baseScores, 'Custom Lineage', emptyAsi, false, 2)).toBe(2);
  });

  it('adds proficiency when proficient', () => {
    // DEX 14 → mod +2 + prof 2 = 4
    expect(getSaveModifier('dexterity', baseScores, 'Custom Lineage', emptyAsi, true, 2)).toBe(4);
  });
});

describe('calculateWeaponAttackBonus', () => {
  it('calculates attack bonus with proficiency', () => {
    const weapon = { ability: 'Strength', proficient: true, notches: '' };
    // STR 10 → mod 0, prof 2, notches 0 → +2
    expect(calculateWeaponAttackBonus(weapon, baseScores, 'Custom Lineage', emptyAsi, 2)).toBe('+2');
  });

  it('calculates negative attack bonus', () => {
    const weapon = { ability: 'Charisma', proficient: false, notches: '' };
    // CHA 8 → mod -1, no prof, no notches → -1
    expect(calculateWeaponAttackBonus(weapon, baseScores, 'Custom Lineage', emptyAsi, 2)).toBe('-1');
  });

  it('includes weapon bonus from notches', () => {
    const weapon = { ability: 'Dexterity', proficient: true, notches: '+1' };
    // DEX 14 → mod +2, prof 2, notches +1 → +5
    expect(calculateWeaponAttackBonus(weapon, baseScores, 'Custom Lineage', emptyAsi, 2)).toBe('+5');
  });

  it('handles missing ability field', () => {
    const weapon = { proficient: true, notches: '' };
    // defaults to STR 10 → mod 0, prof 2 → +2
    expect(calculateWeaponAttackBonus(weapon, baseScores, 'Custom Lineage', emptyAsi, 2)).toBe('+2');
  });
});

describe('calculateTotalAC', () => {
  const defaultArmor = {
    armorType: { item: 'None', plus: '', notches: '' },
    shieldType: { item: 'None', plus: '', notches: '' },
    magicalAttire: { item1: 'None', item2: 'None', plus: '', notches: '' },
  };

  it('calculates unarmored AC (10 + DEX)', () => {
    // DEX 14 → mod +2 → AC = 10 + 2 = 12
    expect(calculateTotalAC(defaultArmor, baseScores, 'Custom Lineage', emptyAsi)).toBe(12);
  });

  it('calculates light armor AC (armor + full DEX)', () => {
    const armor = { ...defaultArmor, armorType: { item: 'Studded Leather', plus: '', notches: '' } };
    // Studded Leather AC 12 + DEX mod +2 = 14
    expect(calculateTotalAC(armor, baseScores, 'Custom Lineage', emptyAsi)).toBe(14);
  });

  it('caps DEX bonus for medium armor', () => {
    const armor = { ...defaultArmor, armorType: { item: 'Breastplate', plus: '', notches: '' } };
    const highDex = { ...baseScores, dexterity: 20 }; // DEX mod +5, capped at +2
    // Breastplate AC 14 + DEX cap 2 = 16
    expect(calculateTotalAC(armor, highDex, 'Custom Lineage', emptyAsi)).toBe(16);
  });

  it('ignores DEX for heavy armor', () => {
    const armor = { ...defaultArmor, armorType: { item: 'Plate', plus: '', notches: '' } };
    // Plate AC 18, no DEX
    expect(calculateTotalAC(armor, baseScores, 'Custom Lineage', emptyAsi)).toBe(18);
  });

  it('adds shield AC', () => {
    const armor = { ...defaultArmor, shieldType: { item: 'Shield', plus: '', notches: '' } };
    // 10 + DEX 2 + Shield 2 = 14
    expect(calculateTotalAC(armor, baseScores, 'Custom Lineage', emptyAsi)).toBe(14);
  });

  it('adds magical bonuses from all equipment slots', () => {
    const armor = {
      armorType: { item: 'Leather', plus: '+1', notches: '' },
      shieldType: { item: 'Shield', plus: '+1', notches: '' },
      magicalAttire: { item1: 'Cloak', item2: 'Ring', plus: '+2', notches: '' },
    };
    // Leather 11 + DEX 2 + Shield 2 + armor +1 + shield +1 + attire +2 = 19
    expect(calculateTotalAC(armor, baseScores, 'Custom Lineage', emptyAsi)).toBe(19);
  });
});

describe('ARMOR_DATA', () => {
  it('has correct AC for Plate armor', () => {
    expect(ARMOR_DATA['Plate'].ac).toBe(18);
    expect(ARMOR_DATA['Plate'].type).toBe('Heavy');
  });

  it('has correct maxDex for medium armor', () => {
    expect(ARMOR_DATA['Breastplate'].maxDex).toBe(2);
    expect(ARMOR_DATA['Breastplate'].type).toBe('Medium');
  });
});

describe('SHIELD_DATA', () => {
  it('has correct AC values', () => {
    expect(SHIELD_DATA['None'].ac).toBe(0);
    expect(SHIELD_DATA['Shield'].ac).toBe(2);
    expect(SHIELD_DATA['Tower Shield'].ac).toBe(3);
  });
});
