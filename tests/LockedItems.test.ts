import Item from '../classes/Item';
import Player from '../classes/Player';

describe('Locked Items', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player();
  });

  describe('Item locking', () => {
    test('should create locked items', () => {
      const lockedItem = new Item('steampunkGlasses', 1, true);
      expect(lockedItem.isLocked()).toBe(true);
    });

    test('should create unlocked items by default', () => {
      const unlockedItem = new Item('steampunkGlasses', 1);
      expect(unlockedItem.isLocked()).toBe(false);
    });

    test('should create unlocked items explicitly', () => {
      const unlockedItem = new Item('steampunkGlasses', 1, false);
      expect(unlockedItem.isLocked()).toBe(false);
    });
  });

  describe('Wearing locked items', () => {
    test('should allow wearing locked items', () => {
      const lockedItem = new Item('steampunkGlasses', 1, true);
      player.addItem(lockedItem);
      
      const result = player.wearItem(lockedItem);
      expect(result).toBe(true);
      expect(player.isWearingItem('eyes-outer')).toBe(true);
    });
  });

  describe('Removing locked items', () => {
    test('should prevent removing locked worn items', () => {
      const lockedItem = new Item('steampunkGlasses', 1, true);
      player.addItem(lockedItem);
      player.wearItem(lockedItem);
      
      expect(() => {
        player.removeWornItem('eyes-outer');
      }).toThrow('Cannot remove locked item: Steampunk Glasses');
      
      // Item should still be worn
      expect(player.isWearingItem('eyes-outer')).toBe(true);
    });

    test('should allow removing unlocked worn items', () => {
      const unlockedItem = new Item('steampunkGlasses', 1, false);
      player.addItem(unlockedItem);
      player.wearItem(unlockedItem);
      
      const removedItem = player.removeWornItem('eyes-outer');
      expect(removedItem).toBe(unlockedItem);
      expect(player.isWearingItem('eyes-outer')).toBe(false);
    });

    test('should allow removing locked inventory items', () => {
      const lockedItem = new Item('steampunkGlasses', 1, true);
      player.addItem(lockedItem);
      
      const removedItem = player.removeItem(0);
      expect(removedItem).toBe(lockedItem);
      expect(player.getInventory()).toHaveLength(0);
    });

    test('should allow removing unlocked inventory items', () => {
      const unlockedItem = new Item('steampunkGlasses', 1, false);
      player.addItem(unlockedItem);
      
      const removedItem = player.removeItem(0);
      expect(removedItem).toBe(unlockedItem);
      expect(player.getInventory()).toHaveLength(0);
    });
  });

  describe('Outfit management with locked items', () => {
    test('should allow wearing outfit with locked items', () => {
      const lockedItem = new Item('steampunkGlasses', 1, true);
      const unlockedItem = new Item('longCoat', 1, false);
      
      player.addItem(lockedItem);
      player.addItem(unlockedItem);
      
      // Wear both items
      player.wearItem(lockedItem);
      player.wearItem(unlockedItem);
      
      // Save outfit
      player.saveOutfit('test_outfit');
      
      // Should be able to wear outfit (locked items can be replaced when wearing)
      const result = player.wearOutfit('test_outfit');
      expect(result).toBe(true);
    });
  });
}); 