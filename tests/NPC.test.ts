import { EntityClass } from '../classes/Entity';
import NPC from '../classes/NPC';
import Player from '../classes/Player';
import { Race } from '../classes/Races';

describe('NPC', () => {
  test('should have correct class, name, race, and gender', () => {
    const npc = new NPC('Aldric Smythe', Race.HUMAN, 'male');
    expect(npc.klass).toBe(EntityClass.NPC);
    expect(npc.name).toBe('Aldric Smythe');
    expect(npc.race).toBe(Race.HUMAN);
    expect(npc.gender).toBe('male');
  });

  test('should default to human race and neutral gender when not specified', () => {
    const npc = new NPC('Aldric Smythe');
    expect(npc.race).toBe(Race.HUMAN);
    expect(npc.gender).toBe('neutral');
  });

  test('should return correct pronouns based on gender', () => {
    const maleNPC = new NPC('Aldric Smythe', Race.HUMAN, 'male');
    const femaleNPC = new NPC('Rachelle Barton', Race.HUMAN, 'female');
    const neutralNPC = new NPC('Test NPC', Race.HUMAN, 'neutral');
    
    expect(maleNPC.getPronoun()).toBe('he');
    expect(femaleNPC.getPronoun()).toBe('she');
    expect(neutralNPC.getPronoun()).toBe('it');
  });

  test('should return name in getName method', () => {
    const npc = new NPC('Aldric Smythe', Race.ELF, 'male');
    expect(npc.getName()).toBe('Aldric Smythe');
  });

  test('should return correct article names', () => {
    const npc = new NPC('Aldric Smythe', Race.DWARF, 'female');
    expect(npc.getAName()).toBe('an Aldric Smythe');
    expect(npc.getTheName()).toBe('Aldric Smythe');
  });

  test('should return correct possessive names', () => {
    const npc = new NPC('Aldric Smythe', Race.GOBLIN, 'male');
    const player = new Player('female');
    
    expect(npc.getPossessiveName(player)).toBe('your Aldric Smythe');
    expect(npc.getPossessiveName(npc)).toBe("Aldric Smythe's Aldric Smythe");
  });

  test('should serialize and deserialize correctly', () => {
    const npc = new NPC('Aldric Smythe', Race.MERMAN, 'female');
    const json = npc.toJSON();
    const deserialized = NPC.fromJSON(json);
    
    expect(deserialized).toBeInstanceOf(NPC);
    expect(deserialized.name).toBe('Aldric Smythe');
    expect(deserialized.race).toBe(Race.MERMAN);
    expect(deserialized.gender).toBe('female');
    expect(deserialized.klass).toBe(EntityClass.NPC);
  });

  test('should handle missing race and gender in fromJSON', () => {
    const npc = new NPC('Aldric Smythe', Race.ELF, 'male');
    const json = npc.toJSON();
    const jsonWithoutRaceAndGender = { ...json };
    delete (jsonWithoutRaceAndGender as any).race;
    delete (jsonWithoutRaceAndGender as any).gender;
    const deserialized = NPC.fromJSON(jsonWithoutRaceAndGender);
    
    expect(deserialized.race).toBe(Race.HUMAN);
    expect(deserialized.gender).toBe('neutral');
  });

  test('should inherit Being functionality', () => {
    const npc = new NPC('Aldric Smythe', Race.DWARF, 'male');
    
    // Should have Being properties
    expect(npc.stats).toBeDefined();
    expect(npc.inventory).toBeDefined();
    expect(npc.wornItems).toBeDefined();
    expect(npc.gender).toBeDefined();
    
    // Should have Being methods
    expect(typeof npc.addItem).toBe('function');
    expect(typeof npc.wearItem).toBe('function');
    expect(typeof npc.getInventory).toBe('function');
    expect(typeof npc.getPronoun).toBe('function');
  });
}); 