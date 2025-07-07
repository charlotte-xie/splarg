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