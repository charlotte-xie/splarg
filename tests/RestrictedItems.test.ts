import Game from '../classes/Game';
import Item from '../classes/Item';
import { ITEM_TYPES } from '../classes/ItemType';
import Player from '../classes/Player';

// Test helper to create a Player without default items
function createTestPlayer(): Player {
  const player = new Game().player;
  player.inventory = []; // Clear default items
  return player;
}

describe('Restricted Items', () => {
  let player: Player;

  beforeEach(() => {
    player = createTestPlayer();
  });

  describe('Item Restricted Property', () => {
    test('should identify blindfold as restricted', () => {333
      const blindfold = new Item(ITEM_TYPES.blindfold);
      expect(blindfold.isRestricted()).toBe(true);
    });

    test('should identify steampunk glasses as not restricted', () => {
      const glasses = new Item(ITEM_TYPES.steampunkGlasses);
      expect(glasses.isRestricted()).toBe(false);
    });

    test('should identify non-wearable items as not restricted', () => {
      const potion = new Item(ITEM_TYPES.healthPotion);
      expect(potion.isRestricted()).toBe(false);
    });
  });

  describe('Player isRestricted Method', () => {
    test('should return false when no items are worn', () => {
      expect(player.isRestricted('eyes-outer')).toBe(false);
      expect(player.isRestricted('eyes-inner')).toBe(false);
      expect(player.isRestricted('chest-outer')).toBe(false);
    });

    test('should return true when blindfold is worn on eyes', () => {
      const blindfold = new Item(ITEM_TYPES.blindfold);
      player.addItem(blindfold);
      player.wearItem(blindfold);

      expect(player.isRestricted('eyes-outer')).toBe(true);
      expect(player.isRestricted('eyes-inner')).toBe(true);
      expect(player.isRestricted('eyes')).toBe(true);
    });

    test('should return false when steampunk glasses are worn on eyes', () => {
      const glasses = new Item(ITEM_TYPES.steampunkGlasses);
      player.addItem(glasses);
      player.wearItem(glasses);

      expect(player.isRestricted('eyes-outer')).toBe(false);
      expect(player.isRestricted('eyes-inner')).toBe(false);
      expect(player.isRestricted('eyes')).toBe(false);
    });

    test('should return false for other body parts when blindfold is worn', () => {
      const blindfold = new Item(ITEM_TYPES.blindfold);
      player.addItem(blindfold);
      player.wearItem(blindfold);

      expect(player.isRestricted('chest-outer')).toBe(false);
      expect(player.isRestricted('hand-outer')).toBe(false);
      expect(player.isRestricted('neck-outer')).toBe(false);
    });

    test('should return true for eyes when blindfold is worn, regardless of layer', () => {
      const blindfold = new Item(ITEM_TYPES.blindfold);
      player.addItem(blindfold);
      player.wearItem(blindfold);

      // Blindfold is worn on eyes-outer, but should restrict all eyes layers
      expect(player.isRestricted('eyes-outer')).toBe(true);
      expect(player.isRestricted('eyes-inner')).toBe(true);
      expect(player.isRestricted('eyes-under')).toBe(true);
    });

    test('should handle switching between restricted and non-restricted items', () => {
      const blindfold = new Item(ITEM_TYPES.blindfold);
      const glasses = new Item(ITEM_TYPES.steampunkGlasses);
      
      player.addItem(blindfold);
      player.addItem(glasses);

      // Wear blindfold first
      player.wearItem(blindfold);
      expect(player.isRestricted('eyes-outer')).toBe(true);

      // Switch to glasses
      player.wearItem(glasses);
      expect(player.isRestricted('eyes-outer')).toBe(false);

      // Switch back to blindfold
      player.wearItem(blindfold);
      expect(player.isRestricted('eyes-outer')).toBe(true);
    });

    test('should handle removing restricted items', () => {
      const blindfold = new Item(ITEM_TYPES.blindfold);
      player.addItem(blindfold);
      player.wearItem(blindfold);

      expect(player.isRestricted('eyes')).toBe(true);

      // Remove the blindfold
      player.removeWornItem('eyes-inner');
      expect(player.isRestricted('eyes')).toBe(false);
    });

    test('should work with multi-location items', () => {
      // Use the restricted straightJacket item type for testing
      const straightJacket = new Item(ITEM_TYPES.straightJacket);

      player.addItem(straightJacket);
      player.wearItem(straightJacket);

      expect(player.isRestricted('chest-inner')).toBe(true);
      expect(player.isRestricted('belly-inner')).toBe(true);
      expect(player.isRestricted('chest-outer')).toBe(true); // Same body part
      expect(player.isRestricted('belly-outer')).toBe(true); // Same body part
      expect(player.isRestricted('hand-outer')).toBe(true); // Now covered by straightJacket
    });
  });

  describe('Edge Cases', () => {
    test('should handle malformed location strings gracefully', () => {
      expect(player.isRestricted('')).toBe(false);
      expect(player.isRestricted('invalid')).toBe(false);
      expect(player.isRestricted('eyes')).toBe(false); // No layer specified
    });

    test('should handle multiple restricted items on different body parts', () => {
      // Create another restricted item for a different body part
      const restrictedGloves = new Item(ITEM_TYPES.restraintGloves);

      const blindfold = new Item(ITEM_TYPES.blindfold);
      
      player.addItem(blindfold);
      player.addItem(restrictedGloves);
      
      player.wearItem(blindfold);
      player.wearItem(restrictedGloves);

      expect(player.isRestricted('eyes-outer')).toBe(true);
      expect(player.isRestricted('hand-outer')).toBe(true);
      expect(player.isRestricted('chest-outer')).toBe(false);
    });
  });
}); 