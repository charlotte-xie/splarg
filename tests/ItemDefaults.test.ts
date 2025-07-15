import Item from '../classes/Item';
import { ItemType, WEAR_LAYERS, WEAR_TYPES } from '../classes/ItemType';

describe('ItemType Defaults', () => {
  test('should make items stackable by default unless wearable', () => {
    // Basic item (no layer/locations) should be stackable
    const potion = new ItemType({
      id: 'potion',
      name: 'Potion',
      description: 'A potion',
      symbol: '🧪'
    });
    expect(potion.stackable).toBe(true);
    expect(potion.wearable).toBe(false);

    // Wearable item should not be stackable
    const sword = new ItemType({
      id: 'sword',
      name: 'Sword',
      description: 'A sword',
      symbol: '⚔️',
      layer: WEAR_LAYERS.outer,
      locations: [WEAR_TYPES.hand]
    });
    expect(sword.stackable).toBe(false);
    expect(sword.wearable).toBe(true);
  });

  test('should make items wearable when they have layer or locations', () => {
    // Item with layer should be wearable
    const itemWithLayer = new ItemType({
      id: 'test1',
      name: 'Test Item 1',
      description: 'Test',
      symbol: '🔧',
      layer: WEAR_LAYERS.outer
    });
    expect(itemWithLayer.wearable).toBe(true);

    // Item with locations should be wearable
    const itemWithLocations = new ItemType({
      id: 'test2',
      name: 'Test Item 2',
      description: 'Test',
      symbol: '🔧',
      locations: [WEAR_TYPES.hand]
    });
    expect(itemWithLocations.wearable).toBe(true);

    // Item with both should be wearable
    const itemWithBoth = new ItemType({
      id: 'test3',
      name: 'Test Item 3',
      description: 'Test',
      symbol: '🔧',
      layer: WEAR_LAYERS.outer,
      locations: [WEAR_TYPES.hand]
    });
    expect(itemWithBoth.wearable).toBe(true);
  });

  test('should allow explicit override of defaults', () => {
    // Explicitly set wearable to false even with layer
    const nonWearableWithLayer = new ItemType({
      id: 'test4',
      name: 'Test Item 4',
      description: 'Test',
      symbol: '🔧',
      layer: WEAR_LAYERS.outer,
      wearable: false
    });
    expect(nonWearableWithLayer.wearable).toBe(false);
    expect(nonWearableWithLayer.stackable).toBe(true);

    // Explicitly set stackable to false even for non-wearable item
    const nonStackablePotion = new ItemType({
      id: 'test5',
      name: 'Test Item 5',
      description: 'Test',
      symbol: '🧪',
      stackable: false
    });
    expect(nonStackablePotion.stackable).toBe(false);
    expect(nonStackablePotion.wearable).toBe(false);

    // Explicitly set stackable to true for wearable item
    const stackableWearable = new ItemType({
      id: 'test6',
      name: 'Test Item 6',
      description: 'Test',
      symbol: '🔧',
      layer: WEAR_LAYERS.outer,
      locations: [WEAR_TYPES.hand],
      stackable: true
    });
    expect(stackableWearable.stackable).toBe(true);
    expect(stackableWearable.wearable).toBe(true);
  });
});

describe('Item Name Methods', () => {
  test('should return correct basic name', () => {
    const potion = new Item('healthPotion', 1);
    const sword = new Item('ironSword', 1);
    
    expect(potion.getName()).toBe('health potion');
    expect(sword.getName()).toBe('iron sword');
  });

  test('should return correct indefinite article names', () => {
    const potion = new Item('healthPotion', 1);
    const sword = new Item('ironSword', 1);
    const manaPotion = new Item('manaPotion', 1);
    
    expect(potion.getAName()).toBe('a health potion');
    expect(sword.getAName()).toBe('an iron sword');
    expect(manaPotion.getAName()).toBe('a mana potion');
  });

  test('should return correct definite article names', () => {
    const potion = new Item('healthPotion', 1);
    const sword = new Item('ironSword', 1);
    
    expect(potion.getTheName()).toBe('the health potion');
    expect(sword.getTheName()).toBe('the iron sword');
  });

  test('should handle multiple items correctly', () => {
    const potions = new Item('healthPotion', 3);
    const swords = new Item('ironSword', 2);
    
    expect(potions.getAName()).toBe('3 health potions');
    expect(swords.getAName()).toBe('2 iron swords');
    expect(potions.getTheName()).toBe('the 3 health potions');
    expect(swords.getTheName()).toBe('the 2 iron swords');
  });

  test('should handle vowel sound exceptions', () => {
    const university = new ItemType({
      id: 'university',
      name: 'University',
      description: 'A university',
      symbol: '🏛️'
    });
    const item = new Item(university, 1);
    
    expect(item.getAName()).toBe('a University'); // 'u' sounds like 'y'
  });

  test('should handle custom plural names', () => {
    const die = new Item('die', 5);
    const sword = new Item('ironSword', 3);
    
    expect(die.getAName()).toBe('5 dice'); // Custom plural
    expect(sword.getAName()).toBe('3 iron swords'); // Default plural (adds 's')
  });

  test('should return correct possessive names', () => {
    const sword = new Item('ironSword', 1);
    const swords = new Item('ironSword', 3);
    const die = new Item('die', 2);
    
    // Create a mock player entity
    const player = new (require('../classes/Player').default)();
    const mob = new (require('../classes/Mob').default)();
    
    expect(sword.getPossessiveName(player)).toBe('your iron sword');
    expect(swords.getPossessiveName(player)).toBe('your 3 iron swords');
    expect(die.getPossessiveName(player)).toBe('your 2 dice');
    
    expect(sword.getPossessiveName(mob)).toBe("Mob's iron sword");
    expect(swords.getPossessiveName(mob)).toBe("Mob's 3 iron swords");
    expect(die.getPossessiveName(mob)).toBe("Mob's 2 dice");
  });
}); 