import Item from '../classes/Item';
import Player from '../classes/Player';

describe('Lock UI Functionality', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player();
  });

  test('should correctly identify locked items', () => {
    const lockedItem = new Item('steampunkGlasses', 1, true);
    const unlockedItem = new Item('steampunkGlasses', 1, false);
    
    expect(lockedItem.isLocked()).toBe(true);
    expect(unlockedItem.isLocked()).toBe(false);
  });

  test('should allow locking items after creation', () => {
    const item = new Item('steampunkGlasses', 1, false);
    expect(item.isLocked()).toBe(false);
    
    // Lock the item
    (item as any).locked = true;
    expect(item.isLocked()).toBe(true);
  });

  test('should handle locking multiple worn items', () => {
    const item1 = new Item('steampunkGlasses', 1, false);
    const item2 = new Item('longCoat', 1, false);
    
    player.addItem(item1);
    player.addItem(item2);
    player.wearItem(item1);
    player.wearItem(item2);
    
    // Lock all worn items
    const wornItems = player.getWornItems();
    const uniqueWornItems = new Set<Item>();
    wornItems.forEach((item) => {
      uniqueWornItems.add(item);
    });
    
    uniqueWornItems.forEach(item => {
      (item as any).locked = true;
    });
    
    // Verify all worn items are locked
    uniqueWornItems.forEach(item => {
      expect(item.isLocked()).toBe(true);
    });
  });

  test('should prevent removing locked worn items', () => {
    const lockedItem = new Item('steampunkGlasses', 1, true);
    player.addItem(lockedItem);
    player.wearItem(lockedItem);
    
    expect(() => {
      player.removeWornItem('eyes-outer');
    }).toThrow('Cannot remove locked item: Steampunk Glasses');
  });
}); 