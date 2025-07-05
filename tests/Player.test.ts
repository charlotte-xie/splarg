import Player from '../classes/Player';
import Item, { ITEM_TYPES } from '../classes/Item';

// Test helper to create a Player without default items
function createTestPlayer(): Player {
  const player = new Player();
  player.inventory = []; // Clear default items
  return player;
}

describe('Player Wear/Remove Behavior', () => {
  let player: Player;

  beforeEach(() => {
    player = createTestPlayer();
  });

  describe('Single Location Items', () => {
    test('should wear a single location item', () => {
      const sword = new Item(ITEM_TYPES.ironSword);
      player.addItem(sword);

      const result = player.wearItem(sword);
      
      expect(result).toBe(true);
      expect(player.isWearingItem('hand-outer')).toBe(true);
      expect(player.getInventory()).toHaveLength(0); // Item removed from inventory
    });

    test('should replace existing item in same slot', () => {
      const sword1 = new Item(ITEM_TYPES.ironSword);
      const sword2 = new Item(ITEM_TYPES.ironSword);
      player.addItem(sword1);
      player.addItem(sword2);

      // Wear first sword
      player.wearItem(sword1);
      expect(player.isWearingItem('hand-outer')).toBe(true);
      expect(player.getInventory()).toHaveLength(1); // sword2 still in inventory

      // Wear second sword
      player.wearItem(sword2);
      expect(player.isWearingItem('hand-outer')).toBe(true);
      expect(player.getInventory()).toHaveLength(1); // sword1 back in inventory
    });

    test('should remove item and add to inventory when replaced', () => {
      const sword = new Item(ITEM_TYPES.ironSword);
      const gloves = new Item(ITEM_TYPES.gloves);
      player.addItem(sword);
      player.addItem(gloves);

      // Wear sword
      player.wearItem(sword);
      expect(player.getInventory()).toHaveLength(1); // gloves in inventory

      // Wear gloves (replaces sword)
      player.wearItem(gloves);
      expect(player.getInventory()).toHaveLength(1); // sword back in inventory
    });
  });

  describe('Multi-Location Items', () => {
    test('should wear multi-location item across all slots', () => {
      const longCoat = new Item(ITEM_TYPES.longCoat);
      player.addItem(longCoat);

      const result = player.wearItem(longCoat);
      
      expect(result).toBe(true);
      expect(player.isWearingItem('chest-outer')).toBe(true);
      expect(player.isWearingItem('belly-outer')).toBe(true);
      expect(player.isWearingItem('arm-outer')).toBe(true);
      expect(player.getInventory()).toHaveLength(0);
    });

    test('should completely remove multi-location item when replaced', () => {
      const longCoat = new Item(ITEM_TYPES.longCoat);
      const leatherArmor = new Item(ITEM_TYPES.leatherArmor);
      player.addItem(longCoat);
      player.addItem(leatherArmor);

      // Wear long coat (chest, belly, arm)
      player.wearItem(longCoat);
      expect(player.isWearingItem('chest-outer')).toBe(true);
      expect(player.isWearingItem('belly-outer')).toBe(true);
      expect(player.isWearingItem('arm-outer')).toBe(true);

      // Wear leather armor (chest, belly) - should remove long coat completely
      player.wearItem(leatherArmor);
      expect(player.isWearingItem('chest-outer')).toBe(true);
      expect(player.isWearingItem('belly-outer')).toBe(true);
      expect(player.isWearingItem('arm-outer')).toBe(false); // long coat removed
      expect(player.getInventory()).toHaveLength(1); // long coat back in inventory
    });

    test('should handle partial overlap correctly', () => {
      const vest = new Item(ITEM_TYPES.vest); // chest, belly (inner)
      const longCoat = new Item(ITEM_TYPES.longCoat); // chest, belly, arm (outer)
      const gloves = new Item(ITEM_TYPES.gloves); // hand (outer)
      player.addItem(vest);
      player.addItem(longCoat);
      player.addItem(gloves);

      // Wear vest
      player.wearItem(vest);
      expect(player.isWearingItem('chest-inner')).toBe(true);
      expect(player.isWearingItem('belly-inner')).toBe(true);

      // Wear gloves (no conflict)
      player.wearItem(gloves);
      expect(player.isWearingItem('chest-inner')).toBe(true);
      expect(player.isWearingItem('belly-inner')).toBe(true);
      expect(player.isWearingItem('hand-outer')).toBe(true);

      // Wear long coat (replaces vest, keeps gloves)
      player.wearItem(longCoat);
      expect(player.isWearingItem('chest-outer')).toBe(true);
      expect(player.isWearingItem('belly-outer')).toBe(true);
      expect(player.isWearingItem('arm-outer')).toBe(true);
      expect(player.isWearingItem('chest-inner')).toBe(false); // vest removed
      expect(player.isWearingItem('belly-inner')).toBe(false); // vest removed
      expect(player.isWearingItem('hand-outer')).toBe(true); // gloves still there
      expect(player.getInventory()).toHaveLength(1); // vest back in inventory
    });
  });

  describe('Remove Worn Item', () => {
    test('should remove single location item', () => {
      const sword = new Item(ITEM_TYPES.ironSword);
      player.addItem(sword);
      player.wearItem(sword);

      const removedItem = player.removeWornItem('hand-outer');
      
      expect(removedItem).toBe(sword);
      expect(player.isWearingItem('hand-outer')).toBe(false);
      expect(player.getInventory()).toHaveLength(1); // sword back in inventory
    });

    test('should remove multi-location item from all slots', () => {
      const longCoat = new Item(ITEM_TYPES.longCoat);
      player.addItem(longCoat);
      player.wearItem(longCoat);

      const removedItem = player.removeWornItem('chest-outer');
      
      expect(removedItem).toBe(longCoat);
      expect(player.isWearingItem('chest-outer')).toBe(false);
      expect(player.isWearingItem('belly-outer')).toBe(false);
      expect(player.isWearingItem('arm-outer')).toBe(false);
      expect(player.getInventory()).toHaveLength(1); // long coat back in inventory
    });

    test('should return undefined for empty slot', () => {
      const removedItem = player.removeWornItem('hand-outer');
      expect(removedItem).toBeUndefined();
    });
  });

  describe('Inventory Integration', () => {
    test('should stack removed items with existing inventory items', () => {
      const potion1 = new Item(ITEM_TYPES.healthPotion);
      const potion2 = new Item(ITEM_TYPES.healthPotion);
      player.addItem(potion1);
      player.addItem(potion2);

      // Wear one potion (should fail since potions aren't wearable)
      const result = player.wearItem(potion1);
      expect(result).toBe(false);
      expect(player.getInventory()).toHaveLength(1); // potions stacked together
      
      // Check that the inventory item has quantity 2 (stacked)
      const inventoryItem = player.getInventory()[0];
      expect(inventoryItem.getQuantity()).toBe(2);
    });

    test('should handle non-stackable items correctly', () => {
      const sword1 = new Item(ITEM_TYPES.ironSword);
      const sword2 = new Item(ITEM_TYPES.ironSword);
      const gloves = new Item(ITEM_TYPES.gloves);
      player.addItem(sword1);
      player.addItem(sword2);
      player.addItem(gloves);

      // Wear sword
      player.wearItem(sword1);
      expect(player.getInventory()).toHaveLength(2); // sword2 and gloves

      // Wear gloves (replaces sword)
      player.wearItem(gloves);
      expect(player.getInventory()).toHaveLength(2); // sword1 and sword2 (separate items)
      
      const inventoryItems = player.getInventory();
      expect(inventoryItems[0].getQuantity()).toBe(1); // non-stackable swords
      expect(inventoryItems[1].getQuantity()).toBe(1); // non-stackable swords
    });
  });

  describe('Edge Cases', () => {
    test('should handle non-wearable items', () => {
      const potion = new Item(ITEM_TYPES.healthPotion);
      player.addItem(potion);

      const result = player.wearItem(potion);
      
      expect(result).toBe(false);
      expect(player.getWornItems().size).toBe(0);
      expect(player.getInventory()).toHaveLength(1); // potion still in inventory
    });

    test('should handle items without wear locations', () => {
      // Create an item without wear locations
      const invalidItem = new Item({
        id: 'invalid',
        name: 'Invalid Item',
        description: 'An item without wear locations',
        symbol: '❓',
        wearable: true
      });
      player.addItem(invalidItem);

      const result = player.wearItem(invalidItem);
      
      expect(result).toBe(false);
      expect(player.getWornItems().size).toBe(0);
    });

    test('should handle wearing same item multiple times', () => {
      const sword = new Item(ITEM_TYPES.ironSword);
      player.addItem(sword);

      // Wear the same item twice
      const result1 = player.wearItem(sword);
      const result2 = player.wearItem(sword);
      
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(player.isWearingItem('hand-outer')).toBe(true);
      expect(player.getInventory()).toHaveLength(0); // item still worn, not in inventory
    });
  });

  describe('Outfit System Integration', () => {
    test('should save and wear outfits correctly', () => {
      const sword = new Item(ITEM_TYPES.ironSword);
      const longCoat = new Item(ITEM_TYPES.longCoat);
      const boots = new Item(ITEM_TYPES.boots);
      player.addItem(sword);
      player.addItem(longCoat);
      player.addItem(boots);

      // Wear items
      player.wearItem(sword);
      player.wearItem(longCoat);
      player.wearItem(boots);

      // Save outfit
      const saveResult = player.saveOutfit('Combat Gear');
      expect(saveResult).toBe(true);
      expect(player.getOutfitNames()).toContain('Combat Gear');

      // Remove all items
      player.removeWornItem('hand-outer');
      player.removeWornItem('chest-outer');
      player.removeWornItem('belly-outer');
      player.removeWornItem('arm-outer');
      player.removeWornItem('feet-outer');
      expect(player.getWornItems().size).toBe(0);

      // Wear outfit
      const wearResult = player.wearOutfit('Combat Gear');
      expect(wearResult).toBe(true);
      expect(player.isWearingItem('hand-outer')).toBe(true);
      expect(player.isWearingItem('chest-outer')).toBe(true);
      expect(player.isWearingItem('belly-outer')).toBe(true);
      expect(player.isWearingItem('arm-outer')).toBe(true);
      expect(player.isWearingItem('feet-outer')).toBe(true);
    });
  });
}); 