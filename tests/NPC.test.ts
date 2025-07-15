import { EntityClass } from '../classes/Entity';
import NPC from '../classes/NPC';
import Player from '../classes/Player';
import { Race } from '../classes/Races';

describe('NPC', () => {
  test('should have correct class, name, and race', () => {
    const npc = new NPC('Aldric Smythe', Race.HUMAN);
    expect(npc.klass).toBe(EntityClass.NPC);
    expect(npc.name).toBe('Aldric Smythe');
    expect(npc.race).toBe(Race.HUMAN);
  });

  test('should default to human race when not specified', () => {
    const npc = new NPC('Aldric Smythe');
    expect(npc.race).toBe(Race.HUMAN);
  });

  test('should return name in getName method', () => {
    const npc = new NPC('Aldric Smythe', Race.ELF);
    expect(npc.getName()).toBe('Aldric Smythe');
  });

  test('should return correct article names', () => {
    const npc = new NPC('Aldric Smythe', Race.DWARF);
    expect(npc.getAName()).toBe('an Aldric Smythe');
    expect(npc.getTheName()).toBe('the Aldric Smythe');
  });

  test('should return correct possessive names', () => {
    const npc = new NPC('Aldric Smythe', Race.GOBLIN);
    const player = new Player();
    
    expect(npc.getPossessiveName(player)).toBe('your Aldric Smythe');
    expect(npc.getPossessiveName(npc)).toBe("Aldric Smythe's Aldric Smythe");
  });

  test('should serialize and deserialize correctly', () => {
    const npc = new NPC('Aldric Smythe', Race.MERMAN);
    const json = npc.toJSON();
    const deserialized = NPC.fromJSON(json);
    
    expect(deserialized).toBeInstanceOf(NPC);
    expect(deserialized.name).toBe('Aldric Smythe');
    expect(deserialized.race).toBe(Race.MERMAN);
    expect(deserialized.klass).toBe(EntityClass.NPC);
  });

  test('should handle missing race in fromJSON', () => {
    const npc = new NPC('Aldric Smythe', Race.ELF);
    const json = npc.toJSON();
    const jsonWithoutRace = { ...json };
    delete (jsonWithoutRace as any).race;
    const deserialized = NPC.fromJSON(jsonWithoutRace);
    
    expect(deserialized.race).toBe(Race.HUMAN);
  });

  test('should inherit Being functionality', () => {
    const npc = new NPC('Aldric Smythe', Race.DWARF);
    
    // Should have Being properties
    expect(npc.stats).toBeDefined();
    expect(npc.inventory).toBeDefined();
    expect(npc.wornItems).toBeDefined();
    
    // Should have Being methods
    expect(typeof npc.addItem).toBe('function');
    expect(typeof npc.wearItem).toBe('function');
    expect(typeof npc.getInventory).toBe('function');
  });
}); 