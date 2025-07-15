import Item from '../classes/Item';
import { ITEM_TYPES } from '../classes/ItemType';
import Player from '../classes/Player';

// Test helper to create a Player without default items
function createTestPlayer(): Player {
  const player = new Player();
  player.inventory = []; // Clear default items
  return player;
}

describe('Eyes Location Items', () => {
  let player: Player;

  beforeEach(() => {
    player = createTestPlayer();
  });

  describe('Steampunk Glasses', () => {
    test('should wear steampunk glasses on eyes', () => {
      const glasses = new Item(ITEM_TYPES.steampunkGlasses);
      player.addItem(glasses);

      const result = player.wearItem(glasses);
      
      expect(result).toBe(true);
      expect(player.isWearingItem('eyes-inner')).toBe(true);
      expect(player.getInventory()).toHaveLength(0); // Item removed from inventory
    });

    test('should replace existing item in eyes slot', () => {
      const glasses1 = new Item(ITEM_TYPES.steampunkGlasses);
      const glasses2 = new Item(ITEM_TYPES.steampunkGlasses);
      player.addItem(glasses1);
      player.addItem(glasses2);

      // Wear first glasses
      player.wearItem(glasses1);
      expect(player.isWearingItem('eyes-inner')).toBe(true);
      expect(player.getInventory()).toHaveLength(1); // glasses2 still in inventory

      // Wear second glasses
      player.wearItem(glasses2);
      expect(player.isWearingItem('eyes-inner')).toBe(true);
      expect(player.getInventory()).toHaveLength(1); // glasses1 back in inventory
    });

    test('should remove steampunk glasses and add to inventory', () => {
      const glasses = new Item(ITEM_TYPES.steampunkGlasses);
      player.addItem(glasses);
      player.wearItem(glasses);

      const removedItem = player.removeWornItem('eyes-inner');
      
      expect(removedItem).toBe(glasses);
      expect(player.isWearingItem('eyes-inner')).toBe(false);
      expect(player.getInventory()).toHaveLength(1); // glasses back in inventory
    });
  });

  describe('Blindfold', () => {
    test('should wear blindfold on eyes', () => {
      const blindfold = new Item(ITEM_TYPES.blindfold);
      player.addItem(blindfold);

      const result = player.wearItem(blindfold);
      
      expect(result).toBe(true);
      expect(player.isWearingItem('eyes-inner')).toBe(true);
      expect(player.getInventory()).toHaveLength(0); // Item removed from inventory
    });

    test('should replace steampunk glasses with blindfold', () => {
      const glasses = new Item(ITEM_TYPES.steampunkGlasses);
      const blindfold = new Item(ITEM_TYPES.blindfold);
      player.addItem(glasses);
      player.addItem(blindfold);

      // Wear glasses first
      player.wearItem(glasses);
      expect(player.isWearingItem('eyes-inner')).toBe(true);
      expect(player.getInventory()).toHaveLength(1); // blindfold still in inventory

      // Wear blindfold (replaces glasses)
      player.wearItem(blindfold);
      expect(player.isWearingItem('eyes-inner')).toBe(true);
      expect(player.getInventory()).toHaveLength(1); // glasses back in inventory
    });

    test('should remove blindfold and add to inventory', () => {
      const blindfold = new Item(ITEM_TYPES.blindfold);
      player.addItem(blindfold);
      player.wearItem(blindfold);

      const removedItem = player.removeWornItem('eyes-inner');
      
      expect(removedItem).toBe(blindfold);
      expect(player.isWearingItem('eyes-inner')).toBe(false);
      expect(player.getInventory()).toHaveLength(1); // blindfold back in inventory
    });
  });

  describe('Eyes Location Conflicts', () => {
    test('should handle switching between different eye items', () => {
      const glasses = new Item(ITEM_TYPES.steampunkGlasses);
      const blindfold = new Item(ITEM_TYPES.blindfold);
      player.addItem(glasses);
      player.addItem(blindfold);

      // Wear glasses
      player.wearItem(glasses);
      expect(player.isWearingItem('eyes-inner')).toBe(true);
      expect(player.getInventory()).toHaveLength(1); // blindfold in inventory

      // Switch to blindfold
      player.wearItem(blindfold);
      expect(player.isWearingItem('eyes-inner')).toBe(true);
      expect(player.getInventory()).toHaveLength(1); // glasses back in inventory

      // Switch back to glasses
      player.wearItem(glasses);
      expect(player.isWearingItem('eyes-inner')).toBe(true);
      expect(player.getInventory()).toHaveLength(1); // blindfold back in inventory
    });

    test('should not conflict with other body parts', () => {
      const glasses = new Item(ITEM_TYPES.steampunkGlasses);
      const scarf = new Item(ITEM_TYPES.scarf);
      player.addItem(glasses);
      player.addItem(scarf);

      // Wear glasses
      player.wearItem(glasses);
      expect(player.isWearingItem('eyes-inner')).toBe(true);

      // Wear scarf (should not conflict)
      player.wearItem(scarf);
      expect(player.isWearingItem('eyes-inner')).toBe(true);
      expect(player.isWearingItem('neck-outer')).toBe(true);
      expect(player.getInventory()).toHaveLength(0); // both items worn
    });
  });

  describe('Item Properties', () => {
    test('should have correct properties for steampunk glasses', () => {
      const glasses = new Item(ITEM_TYPES.steampunkGlasses);
      
      expect(glasses.getName()).toBe('steampunk glasses');
      expect(glasses.getDescription()).toBe('Brass-framed glasses with intricate gears and lenses. Provides a stylish view of the world.');
      expect(glasses.getSymbol()).toBe('👓');
      expect(glasses.isWearable()).toBe(true);
      expect(glasses.isStackable()).toBe(false);
      expect(glasses.getWearLocations()).toEqual(['eyes-inner']);
    });

    test('should have correct properties for blindfold', () => {
      const blindfold = new Item(ITEM_TYPES.blindfold);
      
      expect(blindfold.getBaseName()).toBe('blindfold');
      expect(blindfold.getDescription()).toBe('A dark cloth blindfold that completely blocks vision.');
      expect(blindfold.getSymbol()).toBe('🕶️');
      expect(blindfold.isWearable()).toBe(true);
      expect(blindfold.isStackable()).toBe(false);
      expect(blindfold.isRestricted()).toBe(true);
      expect(blindfold.getWearLocations()).toEqual(['eyes-inner']);
    });
  });
}); 