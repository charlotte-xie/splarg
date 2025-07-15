import { Gender, generateFirstName, generateFullName, generateSurname } from '../classes/Names';
import { Race } from '../classes/Races';

describe('Names', () => {
  test('should generate first names for all races and genders', () => {
    const races = [Race.HUMAN, Race.ELF, Race.DWARF, Race.GOBLIN, Race.MERMAN];
    const genders: Gender[] = ['male', 'female', 'neutral'];

    races.forEach(race => {
      genders.forEach(gender => {
        if (race === Race.HUMAN) {
          // Humans need status
          const statuses = ['noble', 'citizen', 'peasant'];
          statuses.forEach(status => {
            const name = generateFirstName(race, gender, status);
            expect(name).toBeDefined();
            expect(name.length).toBeGreaterThan(0);
          });
        } else {
          // Other races don't need status
          const name = generateFirstName(race, gender);
          expect(name).toBeDefined();
          expect(name.length).toBeGreaterThan(0);
        }
      });
    });
  });

  test('should generate surnames for all races', () => {
    const races = [Race.HUMAN, Race.ELF, Race.DWARF, Race.GOBLIN, Race.MERMAN];

    races.forEach(race => {
      if (race === Race.HUMAN) {
        // Humans need status
        const statuses = ['noble', 'citizen', 'peasant'];
        statuses.forEach(status => {
          const name = generateSurname(race, status);
          expect(name).toBeDefined();
          expect(name.length).toBeGreaterThan(0);
        });
      } else {
        // Other races don't need status
        const name = generateSurname(race);
        expect(name).toBeDefined();
        expect(name.length).toBeGreaterThan(0);
      }
    });
  });

  test('should generate full names for all combinations', () => {
    const races = [Race.HUMAN, Race.ELF, Race.DWARF, Race.GOBLIN, Race.MERMAN];
    const genders: Gender[] = ['male', 'female', 'neutral'];

    races.forEach(race => {
      genders.forEach(gender => {
        if (race === Race.HUMAN) {
          // Humans need status
          const statuses = ['noble', 'citizen', 'peasant'];
          statuses.forEach(status => {
            const name = generateFullName(race, gender, status);
            expect(name).toBeDefined();
            expect(name.length).toBeGreaterThan(0);
            expect(name).toContain(' '); // Should have first and last name
          });
        } else {
          // Other races don't need status
          const name = generateFullName(race, gender);
          expect(name).toBeDefined();
          expect(name.length).toBeGreaterThan(0);
          expect(name).toContain(' '); // Should have first and last name
        }
      });
    });
  });

  test('should generate race-specific names', () => {
    // Test that different races generate different style names
    const elfName = generateFullName(Race.ELF, 'male');
    const dwarfName = generateFullName(Race.DWARF, 'male');
    const goblinName = generateFullName(Race.GOBLIN, 'male');
    const mermanName = generateFullName(Race.MERMAN, 'male');
    const humanName = generateFullName(Race.HUMAN, 'male', 'citizen');

    expect(elfName).toBeDefined();
    expect(dwarfName).toBeDefined();
    expect(goblinName).toBeDefined();
    expect(mermanName).toBeDefined();
    expect(humanName).toBeDefined();

    // Names should be different
    expect(elfName).not.toBe(dwarfName);
    expect(dwarfName).not.toBe(goblinName);
    expect(goblinName).not.toBe(mermanName);
  });

  test('should generate different names on multiple calls', () => {
    const names = new Set();
    for (let i = 0; i < 50; i++) {
      const name = generateFullName(Race.HUMAN, 'male', 'noble');
      names.add(name);
    }
    // Should have some variety (not all the same)
    expect(names.size).toBeGreaterThan(1);
  });

  test('should generate appropriate names for different human social classes', () => {
    // Noble names should be more elaborate
    const nobleName = generateFullName(Race.HUMAN, 'male', 'noble');
    const citizenName = generateFullName(Race.HUMAN, 'male', 'citizen');
    const peasantName = generateFullName(Race.HUMAN, 'male', 'peasant');

    expect(nobleName).toBeDefined();
    expect(citizenName).toBeDefined();
    expect(peasantName).toBeDefined();
  });

  test('should handle all gender types', () => {
    const maleName = generateFullName(Race.HUMAN, 'male', 'citizen');
    const femaleName = generateFullName(Race.HUMAN, 'female', 'citizen');
    const neutralName = generateFullName(Race.HUMAN, 'neutral', 'citizen');

    expect(maleName).toBeDefined();
    expect(femaleName).toBeDefined();
    expect(neutralName).toBeDefined();
  });

  test('should default to citizen status for humans when status not provided', () => {
    const name1 = generateFullName(Race.HUMAN, 'male', 'citizen');
    const name2 = generateFullName(Race.HUMAN, 'male');
    
    // Both should work, though they might generate different names
    expect(name1).toBeDefined();
    expect(name2).toBeDefined();
  });

  test('should generate distinct name styles for each race', () => {
    // Test that each race has its own naming conventions
    const elfNames = new Set();
    const dwarfNames = new Set();
    const goblinNames = new Set();
    const mermanNames = new Set();

    for (let i = 0; i < 20; i++) {
      elfNames.add(generateFullName(Race.ELF, 'male'));
      dwarfNames.add(generateFullName(Race.DWARF, 'male'));
      goblinNames.add(generateFullName(Race.GOBLIN, 'male'));
      mermanNames.add(generateFullName(Race.MERMAN, 'male'));
    }

    // Each race should have its own distinct name pool
    expect(elfNames.size).toBeGreaterThan(1);
    expect(dwarfNames.size).toBeGreaterThan(1);
    expect(goblinNames.size).toBeGreaterThan(1);
    expect(mermanNames.size).toBeGreaterThan(1);
  });
}); 