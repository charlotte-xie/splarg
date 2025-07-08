import Game from '../classes/Game';
import Item from '../classes/Item';
import { ITEM_TYPES } from '../classes/ItemType';
import Player from '../classes/Player';

// Test helper to create a Player without default items
function createTestPlayer(): Player {
  const player = new Player();
  return player
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
      const player=new Player();
      const vest = new Item(ITEM_TYPES.vest); // chest, belly (inner)
      const longCoat = new Item(ITEM_TYPES.longCoat); // chest, belly, arm (outer)
      const gloves = new Item(ITEM_TYPES.gloves); // hand (outer)
      player.addItem(vest);
      player.addItem(longCoat);
      player.addItem(gloves);
      expect(player.getInventory()).toHaveLength(3); 

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
      expect(player.isWearingItem('chest-inner')).toBe(true); // vest there
      expect(player.isWearingItem('belly-inner')).toBe(true); // vest there
      expect(player.isWearingItem('hand-outer')).toBe(true); // gloves still there
      expect(player.getInventory()).toHaveLength(0); // nothing returned to inventory
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

    test('should only add one item to inventory when removing a multi-location worn item', () => {
      const longCoat = new Item(ITEM_TYPES.longCoat);
      player.addItem(longCoat);
      player.wearItem(longCoat);
      // Remove from one of its locations
      const removedItem = player.removeWornItem('chest-outer');
      expect(removedItem).toBe(longCoat);
      expect(player.isWearingItem('chest-outer')).toBe(false);
      expect(player.isWearingItem('belly-outer')).toBe(false);
      expect(player.isWearingItem('arm-outer')).toBe(false);
      // Inventory should only have one instance of the long coat
      const inventoryItems = player.getInventory().filter(i => i.getId() === 'longCoat');
      expect(inventoryItems.length).toBe(1);
      expect(inventoryItems[0]).toBe(longCoat);
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
      const invalidItem = new Item(ITEM_TYPES.goldCoin);
      player.addItem(invalidItem);

      const result = player.wearItem(invalidItem);
      
      expect(result).toBe(false);
      expect(player.getWornItems().size).toBe(0);
    });

    test('should handle wearing same item multiple times', () => {
      const item = new Item('steampunkGlasses', 1);
      player.addItem(item);
      
      const result = player.wearItem(item);
      expect(result).toBe(true);
      expect(player.getInventory()).toHaveLength(0);
    });

    test('should handle multiple copies of same item without destroying them', () => {
      const item1 = new Item('steampunkGlasses', 1);
      const item2 = new Item('steampunkGlasses', 1);
      
      // Add both items to inventory
      player.addItem(item1);
      player.addItem(item2);
      expect(player.getInventory()).toHaveLength(2);
      
      // Wear the first item
      const result1 = player.wearItem(item1);
      expect(result1).toBe(true);
      expect(player.getInventory()).toHaveLength(1); // One item removed from inventory
      
      // Wear the second item - this should return the first item to inventory
      const result2 = player.wearItem(item2);
      expect(result2).toBe(true);
      expect(player.getInventory()).toHaveLength(1); // Should still have 1 item in inventory
      
      // Verify the worn item is the second one
      const wornItem = player.getWornItems().get('eyes-inner');
      expect(wornItem).toBe(item2);
      
      // Verify the first item is back in inventory
      const inventoryItem = player.getInventory()[0];
      expect(inventoryItem).toBe(item1);
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
      player.removeWornItem('feet-inner');
      expect(player.getWornItems().size).toBe(0);

      // Wear outfit
      const wearResult = player.wearOutfit('Combat Gear');
      expect(wearResult).toBe(true);
      expect(player.isWearingItem('hand-outer')).toBe(true);
      expect(player.isWearingItem('chest-outer')).toBe(true);
      expect(player.isWearingItem('belly-outer')).toBe(true);
      expect(player.isWearingItem('arm-outer')).toBe(true);
      expect(player.isWearingItem('feet-inner')).toBe(true);
    });
  });

  describe('Layered Clothing', () => {
    test('should allow wearing bra and corset at the same time (different layers)', () => {
      const bra = new Item(ITEM_TYPES.bra);
      const corset = new Item(ITEM_TYPES.leatherCorset);
      player.addItem(bra);
      player.addItem(corset);

      // Wear bra (under layer, chest)
      expect(player.wearItem(bra)).toBe(true);
      expect(player.isWearingItem('chest-under')).toBe(true);
      expect(player.getInventory()).toHaveLength(1); // corset still in inventory

      // Wear corset (inner layer, chest)
      expect(player.wearItem(corset)).toBe(true);
      expect(player.isWearingItem('chest-under')).toBe(true); // bra still worn
      expect(player.isWearingItem('chest-inner')).toBe(true); // corset now worn
      expect(player.getInventory()).toHaveLength(0); // both items worn
    });
  });

  describe('Access Restriction (allowsAccess)', () => {
    test('should block removal of inner/under items when straightjacket is worn', () => {
      const straightJacket = new Item(ITEM_TYPES.straightJacket); // outer, allowsAccess: false
      const vest = new Item(ITEM_TYPES.vest); // inner
      const bra = new Item(ITEM_TYPES.bra); // under
      player.addItem(straightJacket);
      player.addItem(vest);
      player.addItem(bra);
      player.wearItem(bra);
      player.wearItem(vest);
      player.wearItem(straightJacket);
      // Should not be able to remove vest or bra while straightjacket is worn
      expect(() => player.removeWornItem('chest-inner')).toThrow(/while straight jacket is worn over it/);
      expect(() => player.removeWornItem('chest-under')).toThrow(/while straight jacket is worn over it/);
      // After removing straightjacket, should be able to remove vest and bra
      player.removeWornItem('chest-outer');
      expect(() => player.removeWornItem('chest-inner')).not.toThrow();
      expect(() => player.removeWornItem('chest-under')).not.toThrow();
    });
  });
});

describe('Game Save/Load', () => {
  let localStorageMock: any;
  beforeAll(() => {
    localStorageMock = (function() {
      let store: Record<string, string> = {};
      return {
        getItem(key: string) { return store[key] || null; },
        setItem(key: string, value: string) { store[key] = value.toString(); },
        clear() { store = {}; },
        removeItem(key: string) { delete store[key]; }
      };
    })();
    Object.defineProperty(global, 'localStorage', { value: localStorageMock });
  });
  beforeEach(() => {
    localStorage.clear();
  });

  test('should save and restore game state', () => {
    var game = new Game().initialise();
    const player = game.player;
    game.movePlayer(1,1);
    player.stats.health = 42;
    const gold=new Item(ITEM_TYPES.goldCoin,123);
    player.addItem(gold);
    game.saveGame();

    // Change state after saving
    player.stats.health = 1;
    player.stats.gold = 0
    // Restore
    game=Game.loadGame();  
    const restoredPlayer = game.player;
    expect(restoredPlayer).toBeInstanceOf(Player);
    expect(restoredPlayer.getInventory().find(item => item.getId() == gold.getId())?.getQuantity()).toBeGreaterThanOrEqual(123);
    expect(restoredPlayer.position).toEqual(player.position);
  });
});

describe('Player serialization', () => {
  test('should serialize and deserialize with worn and inventory items', () => {
    const player = new Game().player;
    const sword = new Item(ITEM_TYPES.ironSword, 1);
    const boots = new Item(ITEM_TYPES.boots, 1);
    player.addItem(sword);
    player.addItem(boots);
    player.wearItem(boots); // boots should be worn, sword in inventory

    const json = player.toJSON();
    const restored = Player.fromJSON(json);

    // Inventory should contain sword
    expect(restored.getInventory().length).toBe(1);
    expect(restored.getInventory()[0].getId()).toBe('ironSword');
    // Worn items should contain boots
    let bootsFound = false;
    for (const item of restored.getWornItems().values()) {
      if (item.getId() === 'boots') bootsFound = true;
    }
    expect(bootsFound).toBe(true);
  });
});

describe('Game.dropItem', () => {
  test('should remove item from inventory and add to current tile', () => {
    const game = new Game().initialise();
    expect(game.getCurrentArea().id).toBe('grasslands');
    const player = game.player;
    game.addEntity(player);
    const item = new Item(ITEM_TYPES.ironSword, 1);
    player.addItem(item);
    const pos = { ...player.position };
    const area = game.getCurrentArea();
    const tile = area.getTile(pos.x, pos.y);
    expect(tile).not.toBeNull();
    if (!tile) throw new Error('Tile is null');
    expect(tile.items.length).toBe(0);
    const result = game.dropItem(player, item);
    expect(result).toBe(true);
    expect(player.getInventory().includes(item)).toBe(false);
    expect(tile.items.includes(item)).toBe(true);
  });

  test('should return false if item not in inventory', () => {
    const game = new Game();
    const player = game.player;
    const item = new Item(ITEM_TYPES.ironSword, 1);
    const result = game.dropItem(player, item);
    expect(result).toBe(false);
  });
});

describe('Player Entity ID', () => {
  test('should have ID 0', () => {
    const player = new Player();
    expect(player.getId()).toBe(0);
  });
});

describe('Player serialization identity and round-trip', () => {
  test('should serialize and deserialize to Player and match JSON', () => {
    const player = new Game().player;
    const sword = new Item(ITEM_TYPES.ironSword, 1);
    const boots = new Item(ITEM_TYPES.boots, 1);
    player.addItem(sword);
    player.addItem(boots);
    player.wearItem(boots);

    const json1 = player.toJSON();
    const restored = Player.fromJSON(json1);
    expect(restored).toBeInstanceOf(Player);
    const json2 = restored.toJSON();
    expect(json2).toEqual(json1);
  });
}); 