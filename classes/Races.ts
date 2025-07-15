// Races.ts
// Defines the different races in the game world

export enum Race {
  GOBLIN = 'goblin',
  HUMAN = 'human',
  ELF = 'elf',
  DWARF = 'dwarf',
  MERMAN = 'merman'
}

export interface RaceStats {
  health: number;
  maxHealth: number;
  strength: number;
  defense: number;
  speed: number;
  intelligence: number;
  charisma: number;
}

export interface RaceTraits {
  name: string;
  description: string;
  baseStats: RaceStats;
  abilities: string[];
  weaknesses: string[];
  preferredEnvironments: string[];
}

export const RACE_TRAITS: Record<Race, RaceTraits> = {
  [Race.GOBLIN]: {
    name: 'Goblin',
    description: 'Small, cunning creatures with a knack for technology and mischief.',
    baseStats: {
      health: 25,
      maxHealth: 25,
      strength: 8,
      defense: 6,
      speed: 12,
      intelligence: 14,
      charisma: 10
    },
    abilities: ['Mechanical Aptitude', 'Stealth', 'Agility'],
    weaknesses: ['Low Health', 'Weak Strength'],
    preferredEnvironments: ['Underground', 'Urban', 'Industrial']
  },
  [Race.HUMAN]: {
    name: 'Human',
    description: 'Adaptable and ambitious, humans are the most common race in the world.',
    baseStats: {
      health: 35,
      maxHealth: 35,
      strength: 10,
      defense: 8,
      speed: 10,
      intelligence: 12,
      charisma: 12
    },
    abilities: ['Adaptability', 'Versatility', 'Leadership'],
    weaknesses: ['No Special Abilities'],
    preferredEnvironments: ['Urban', 'Rural', 'Coastal']
  },
  [Race.ELF]: {
    name: 'Elf',
    description: 'Graceful and long-lived beings with a deep connection to magic and nature.',
    baseStats: {
      health: 30,
      maxHealth: 30,
      strength: 8,
      defense: 7,
      speed: 12,
      intelligence: 16,
      charisma: 14
    },
    abilities: ['Magic Affinity', 'Longevity', 'Agility'],
    weaknesses: ['Lower Physical Strength'],
    preferredEnvironments: ['Forest', 'Mountain', 'Ancient Ruins']
  },
  [Race.DWARF]: {
    name: 'Dwarf',
    description: 'Sturdy and skilled craftsmen with a strong connection to earth and stone.',
    baseStats: {
      health: 40,
      maxHealth: 40,
      strength: 14,
      defense: 12,
      speed: 8,
      intelligence: 12,
      charisma: 10
    },
    abilities: ['Craftsmanship', 'Stone Sense', 'Resilience'],
    weaknesses: ['Slower Movement', 'Lower Agility'],
    preferredEnvironments: ['Mountains', 'Underground', 'Mines']
  },
  [Race.MERMAN]: {
    name: 'Merman',
    description: 'Aquatic beings with the ability to breathe underwater and swim with great speed.',
    baseStats: {
      health: 32,
      maxHealth: 32,
      strength: 10,
      defense: 8,
      speed: 14,
      intelligence: 12,
      charisma: 12
    },
    abilities: ['Aquatic Breathing', 'Swimming', 'Water Magic'],
    weaknesses: ['Land Movement Penalty', 'Vulnerable to Fire'],
    preferredEnvironments: ['Ocean', 'Lakes', 'Rivers']
  }
};

export function getRaceTraits(race: Race): RaceTraits {
  return RACE_TRAITS[race];
}

export function getAllRaces(): Race[] {
  return Object.values(Race);
}

export function isValidRace(race: string): race is Race {
  return Object.values(Race).includes(race as Race);
} 