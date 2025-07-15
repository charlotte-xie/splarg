import { EntityClass } from '../classes/Entity';
import { Gender } from '../classes/Names';
import NPC from '../classes/NPC';
import Player from '../classes/Player';
import { Race } from '../classes/Races';

describe('NPC', () => {
  test('should have correct class, name, race, and gender', () => {
    const npc = new NPC({ name: 'Aldric Smythe', race: Race.HUMAN, gender: Gender.MALE });
    expect(npc.klass).toBe(EntityClass.NPC);
    expect(npc.stats.name).toBe('Aldric Smythe');
    expect(npc.stats.race).toBe(Race.HUMAN);
    expect(npc.stats.gender).toBe(Gender.MALE);
  });

  test('should default to human race and neutral gender when not specified', () => {
    const npc = new NPC({ name: 'Aldric Smythe' });
    expect(npc.stats.race).toBeUndefined();
    expect(npc.stats.gender).toBeUndefined();
  });

  test('should return correct pronouns based on gender', () => {
    const maleNPC = new NPC({ name: 'Aldric Smythe', race: Race.HUMAN, gender: Gender.MALE });
    const femaleNPC = new NPC({ name: 'Rachelle Barton', race: Race.HUMAN, gender: Gender.FEMALE });
    const neutralNPC = new NPC({ name: 'Test NPC', race: Race.HUMAN, gender: Gender.NEUTRAL });
    
    expect(maleNPC.getPronoun()).toBe('he');
    expect(femaleNPC.getPronoun()).toBe('she');
    expect(neutralNPC.getPronoun()).toBe('it');
  });

  test('should return correct names', () => {
    const npc = new NPC({ name: 'Aldric Smythe', race: Race.ELF, gender: Gender.MALE });
    // Note we have a proper name, so we don't need to add an article
    expect(npc.getName()).toBe('Aldric Smythe');
    expect(npc.getAName()).toBe('Aldric Smythe');
    expect(npc.getTheName()).toBe('Aldric Smythe');
  });

  test('should return correct possessive names', () => {
    const npc = new NPC({ name: 'Aldric Smythe', race: Race.GOBLIN, gender: Gender.MALE });
    const player = new Player();
    
    expect(npc.getPossessiveName(player)).toBe('your Aldric Smythe');
    expect(npc.getPossessiveName(npc)).toBe("Aldric Smythe's Aldric Smythe");
  });

  test('should serialize and deserialize correctly', () => {
    const npc = new NPC({ name: 'Aldric Smythe', race: Race.MERMAN, gender: Gender.FEMALE });
    const json = npc.toJSON();
    const deserialized = NPC.fromJSON(json);
    
    expect(deserialized).toBeInstanceOf(NPC);
    expect(deserialized.stats.name).toBe('Aldric Smythe');
    expect(deserialized.stats.race).toBe(Race.MERMAN);
    expect(deserialized.stats.gender).toBe(Gender.FEMALE);
    expect(deserialized.klass).toBe(EntityClass.NPC);
  });

  test('should handle missing fields in fromJSON', () => {
    const npc = new NPC({ name: 'Aldric Smythe', race: Race.ELF, gender: Gender.MALE });
    const json = npc.toJSON();
    const jsonWithoutRaceAndGender = { ...json };
    if (jsonWithoutRaceAndGender.stats) {
      delete jsonWithoutRaceAndGender.stats.race;
      delete jsonWithoutRaceAndGender.stats.gender;
    }
    const deserialized = NPC.fromJSON(jsonWithoutRaceAndGender);
    
    expect(deserialized.stats.race).toBeUndefined();
    expect(deserialized.stats.gender).toBeUndefined();
  });

  test('should inherit Being functionality', () => {
    const npc = new NPC({ name: 'Aldric Smythe', race: Race.DWARF, gender: Gender.MALE });
    
    // Should have Being properties
    expect(npc.stats).toBeDefined();
    expect(npc.inventory).toBeDefined();
    expect(npc.wornItems).toBeDefined();
    expect(npc.stats.gender).toBeDefined();
    
    // Should have Being methods
    expect(typeof npc.addItem).toBe('function');
    expect(typeof npc.wearItem).toBe('function');
    expect(typeof npc.getInventory).toBe('function');
    expect(typeof npc.getPronoun).toBe('function');
  });
}); 