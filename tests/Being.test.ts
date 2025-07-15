import { Being } from '../classes/Being';
import { EntityClass } from '../classes/Entity';

describe('Being', () => {
  test('should have correct gender property', () => {
    const maleBeing = new Being(EntityClass.NPC, 'male');
    const femaleBeing = new Being(EntityClass.NPC, 'female');
    const neutralBeing = new Being(EntityClass.NPC, 'neutral');
    
    expect(maleBeing.gender).toBe('male');
    expect(femaleBeing.gender).toBe('female');
    expect(neutralBeing.gender).toBe('neutral');
  });

  test('should default to neutral gender when not specified', () => {
    const being = new Being(EntityClass.NPC);
    expect(being.gender).toBe('neutral');
  });

  test('should return correct pronouns', () => {
    const maleBeing = new Being(EntityClass.NPC, 'male');
    const femaleBeing = new Being(EntityClass.NPC, 'female');
    const neutralBeing = new Being(EntityClass.NPC, 'neutral');
    
    expect(maleBeing.getPronoun()).toBe('he');
    expect(femaleBeing.getPronoun()).toBe('she');
    expect(neutralBeing.getPronoun()).toBe('it');
  });

  test('should serialize and deserialize gender correctly', () => {
    const being = new Being(EntityClass.NPC, 'female');
    const json = being.toJSON();
    const deserialized = Being.fromJSON(json);
    
    expect(deserialized.gender).toBe('female');
  });

  test('should handle missing gender in fromJSON', () => {
    const being = new Being(EntityClass.NPC, 'male');
    const json = being.toJSON();
    const jsonWithoutGender = { ...json };
    delete (jsonWithoutGender as any).gender;
    const deserialized = Being.fromJSON(jsonWithoutGender);
    
    expect(deserialized.gender).toBe('neutral');
  });

  test('should inherit Entity functionality', () => {
    const being = new Being(EntityClass.NPC, 'male');
    
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