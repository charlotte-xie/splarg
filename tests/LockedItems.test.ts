import Item from '../classes/Item';
import Player from '../classes/Player';

describe('Locked Items', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player();
  });

  describe('Item locking', () => {
    test('should create locked items', () => {
      const lockedItem = new Item('steampunkGlasses', 1, { locked: true });
      expect(lockedItem.isLocked()).toBe(true);
    });

    test('should create unlocked items by default', () => {
      const unlockedItem = new Item('steampunkGlasses', 1);
      expect(unlockedItem.isLocked()).toBe(false);
    });

    test('should create unlocked items explicitly', () => {
      const unlockedItem = new Item('steampunkGlasses', 1, { locked: false });
      expect(unlockedItem.isLocked()).toBe(false);
    });
  });

  describe('Wearing locked items', () => {
    test('should allow wearing locked items', () => {
      const lockedItem = new Item('steampunkGlasses', 1, { locked: true });
      player.addItem(lockedItem);
      
      const result = player.wearItem(lockedItem);
      expect(result).toBe(true);
    });

    test('should prevent wearing other items when locked item is worn', () => {
      const lockedItem = new Item('steampunkGlasses', 1, { locked: true });
      const otherItem = new Item('blindfold', 1, { locked: false });
      
      // Add both items to inventory
      player.addItem(lockedItem);
      player.addItem(otherItem);
      
      // Wear the locked item first
      const wearLockedResult = player.wearItem(lockedItem);
      expect(wearLockedResult).toBe(true);
      
      // Try to wear the other item in the same slot
      // This should throw an exception because the locked item cannot be removed
      expect(() => {
        player.wearItem(otherItem);
      }).toThrow('Cannot remove locked item: steampunk glasses');
      
      // The locked item should still be worn
      const wornItem = player.getWornItems().get('eyes-inner');
      expect(wornItem?.getId()).toBe('steampunkGlasses');
      expect(wornItem?.isLocked()).toBe(true);
      
      // The other item should still be in inventory
      const inventory = player.getInventory();
      const otherItemInInventory = inventory.find(item => item.getId() === 'blindfold');
      expect(otherItemInInventory).toBeDefined();
    });
  });

  describe('Removing locked items', () => {
    test('should prevent removing locked worn items', () => {
      const lockedItem = new Item('steampunkGlasses', 1, { locked: true });
      player.addItem(lockedItem);
      player.wearItem(lockedItem);
      
      expect(() => {
        player.removeWornItem('eyes-inner');
      }).toThrow('Cannot remove locked item: steampunk glasses');
      
      // Item should still be worn
      expect(player.isWearingItem('eyes-inner')).toBe(true);
    });

    test('should allow removing unlocked worn items', () => {
      const unlockedItem = new Item('steampunkGlasses', 1, { locked: false });
      player.addItem(unlockedItem);
      player.wearItem(unlockedItem);
      
      const removedItem = player.removeWornItem('eyes-inner');
      expect(removedItem).toBe(unlockedItem);
      expect(player.isWearingItem('eyes-outer')).toBe(false);
    });

    test('should allow removing locked inventory items', () => {
      const lockedItem = new Item('steampunkGlasses', 1, { locked: true });
      player.addItem(lockedItem);
      
      const removedItem = player.removeItem(lockedItem);
      expect(removedItem).toBe(lockedItem);
      expect(player.getInventory()).toHaveLength(0);
    });

    test('should allow removing unlocked inventory items', () => {
      const unlockedItem = new Item('steampunkGlasses', 1, { locked: false });
      player.addItem(unlockedItem);
      
      const removedItem = player.removeItem(unlockedItem);
      expect(removedItem).toBe(unlockedItem);
      expect(player.getInventory()).toHaveLength(0);
    });
  });

  describe('Outfit management with locked items', () => {
    test('should allow wearing outfit with locked items', () => {
      const lockedItem = new Item('steampunkGlasses', 1, { locked: true });
      const unlockedItem = new Item('longCoat', 1, { locked: false });
      
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