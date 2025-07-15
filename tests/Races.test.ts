import { getAllRaces, getRaceTraits, isValidRace, Race, RACE_TRAITS } from '../classes/Races';

describe('Races', () => {
  test('should have all expected races', () => {
    const races = getAllRaces();
    expect(races).toContain(Race.GOBLIN);
    expect(races).toContain(Race.HUMAN);
    expect(races).toContain(Race.ELF);
    expect(races).toContain(Race.DWARF);
    expect(races).toContain(Race.MERMAN);
    expect(races).toHaveLength(5);
  });

  test('should validate race strings correctly', () => {
    expect(isValidRace('goblin')).toBe(true);
    expect(isValidRace('human')).toBe(true);
    expect(isValidRace('elf')).toBe(true);
    expect(isValidRace('dwarf')).toBe(true);
    expect(isValidRace('merman')).toBe(true);
    expect(isValidRace('invalid')).toBe(false);
    expect(isValidRace('')).toBe(false);
  });

  test('should get race traits for all races', () => {
    const goblinTraits = getRaceTraits(Race.GOBLIN);
    expect(goblinTraits.name).toBe('Goblin');
    expect(goblinTraits.baseStats.health).toBe(25);
    expect(goblinTraits.abilities).toContain('Mechanical Aptitude');

    const humanTraits = getRaceTraits(Race.HUMAN);
    expect(humanTraits.name).toBe('Human');
    expect(humanTraits.baseStats.health).toBe(35);
    expect(humanTraits.abilities).toContain('Adaptability');

    const elfTraits = getRaceTraits(Race.ELF);
    expect(elfTraits.name).toBe('Elf');
    expect(elfTraits.baseStats.intelligence).toBe(16);
    expect(elfTraits.abilities).toContain('Magic Affinity');

    const dwarfTraits = getRaceTraits(Race.DWARF);
    expect(dwarfTraits.name).toBe('Dwarf');
    expect(dwarfTraits.baseStats.strength).toBe(14);
    expect(dwarfTraits.abilities).toContain('Craftsmanship');

    const mermanTraits = getRaceTraits(Race.MERMAN);
    expect(mermanTraits.name).toBe('Merman');
    expect(mermanTraits.baseStats.speed).toBe(14);
    expect(mermanTraits.abilities).toContain('Aquatic Breathing');
  });

  test('should have complete race traits for all races', () => {
    Object.values(Race).forEach(race => {
      const traits = RACE_TRAITS[race];
      expect(traits).toBeDefined();
      expect(traits.name).toBeDefined();
      expect(traits.description).toBeDefined();
      expect(traits.baseStats).toBeDefined();
      expect(traits.abilities).toBeDefined();
      expect(traits.weaknesses).toBeDefined();
      expect(traits.preferredEnvironments).toBeDefined();
      
      // Check that baseStats has all required properties
      expect(traits.baseStats.health).toBeDefined();
      expect(traits.baseStats.maxHealth).toBeDefined();
      expect(traits.baseStats.strength).toBeDefined();
      expect(traits.baseStats.defense).toBeDefined();
      expect(traits.baseStats.speed).toBeDefined();
      expect(traits.baseStats.intelligence).toBeDefined();
      expect(traits.baseStats.charisma).toBeDefined();
    });
  });

  test('should have balanced stats across races', () => {
    const allTraits = Object.values(RACE_TRAITS);
    
    // Check that no race has extremely high or low stats
    allTraits.forEach(traits => {
      const stats = traits.baseStats;
      expect(stats.health).toBeGreaterThan(20);
      expect(stats.health).toBeLessThan(50);
      expect(stats.strength).toBeGreaterThan(5);
      expect(stats.strength).toBeLessThan(20);
      expect(stats.speed).toBeGreaterThan(5);
      expect(stats.speed).toBeLessThan(20);
      expect(stats.intelligence).toBeGreaterThan(8);
      expect(stats.intelligence).toBeLessThan(20);
    });
  });
}); 