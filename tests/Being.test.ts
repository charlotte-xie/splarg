import { Being } from '../classes/Being';
import { EntityClass } from '../classes/Entity';

describe('Being', () => {
 

  test('should default to neutral gender when not specified', () => {
    const being = new Being(EntityClass.NPC);
    expect(being.gender).toBe('neutral');
  });

  test('should handle missing gender in fromJSON', () => {
    const being = new Being(EntityClass.NPC);
    const json = being.toJSON();
    const jsonWithoutGender = { ...json };
    delete (jsonWithoutGender as any).gender;
    const deserialized = Being.fromJSON(jsonWithoutGender);
    
    expect(deserialized.gender).toBe('neutral');
  });

  test('should inherit Entity functionality', () => {
    const being = new Being(EntityClass.NPC);
    
    // Should have Entity properties
    expect(being.klass).toBe(EntityClass.NPC);
    expect(being.position).toBeDefined();
    expect(being.id).toBeDefined();
    
    // Should have Being properties
    expect(being.stats).toBeDefined();
    expect(being.inventory).toBeDefined();
    expect(being.wornItems).toBeDefined();
    expect(being.gender).toBeDefined();
    
    // Should have Being methods
    expect(typeof being.addItem).toBe('function');
    expect(typeof being.wearItem).toBe('function');
    expect(typeof being.getInventory).toBe('function');
    expect(typeof being.getPronoun).toBe('function');
  });
}); 