import Game from '../classes/Game';
import Item from '../classes/Item';
import { ITEM_TYPES } from '../classes/ItemType';
import Mob from '../classes/Mob';
import Player from '../classes/Player';

describe('Game.dropItem', () => {
  let game: Game;
  let player: Player;

  beforeEach(() => {
    game = new Game().initialise();
    player = game.player;
    player.inventory = [];
    // Place player at a known position
    player.setPosition({ x: 2, y: 2, areaId: 'grasslands' });
  });

  test('should drop the whole stack on the player\'s current tile', () => {
    const item = new Item(ITEM_TYPES.healthPotion, 3);
    player.addItem(item);
    const tile = game.getPlayerTile();
    expect(tile).not.toBeNull();
    if (!tile) throw new Error('Tile is null');
    expect(tile.items).not.toContain(item);
    const result = game.dropItem(player, item);
    expect(result).toBe(true);
    expect(player.getInventory()).not.toContain(item);
    expect(tile.items).toContain(item);
    expect(item.getQuantity()).toBe(3);
  });

  test('should drop only one from a stack and decrement inventory', () => {
    const item = new Item(ITEM_TYPES.healthPotion, 3);
    player.addItem(item);
    const tile = game.getPlayerTile();
    expect(tile).not.toBeNull();
    if (!tile) throw new Error('Tile is null');
    expect(tile.items.length).toBe(0);
    const result = game.dropItem(player, item, 1);
    expect(result).toBe(true);
    expect(player.getInventory()).toContain(item);
    expect(item.getQuantity()).toBe(2);
    // Find the dropped item on the tile
    const dropped = tile.items.find(i => i.getId() === item.getId() && i !== item);
    expect(dropped).toBeDefined();
    expect(dropped?.getQuantity()).toBe(1);
  });
});

describe('Game.getEntity', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game().initialise();
  });

  test('should return player when getting entity with ID 0', () => {
    const entity = game.getEntity(0);
    expect(entity).toBe(game.player);
  });

  test('should return player when getting entity with player object', () => {
    const player = game.player;
    const entity = game.getEntity(player);
    expect(entity).toBe(player);
  });

  test('should return null for non-existent entity ID', () => {
    const entity = game.getEntity(-999);
    expect(entity).toBeNull();
  });

  test('should return null for entity not in map', () => {
    const fakeEntity = new Mob();
    fakeEntity.id=-998;
    const entity = game.getEntity(fakeEntity);
    expect(entity).toBeNull();
  });
});

describe('Game serialization', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game().initialise();
  });

  test('should serialize and deserialize entities map', () => {
    // Add some test entities
    const currentNum = game.entityIdCounter;

    const entity1 = new Mob();
    const entity2 = new Mob();
    
    game.addEntity(entity1, { x: 5, y: 5, areaId: 'grasslands' });
    game.addEntity(entity2, { x: 10, y: 10, areaId: 'grasslands' });

    const json = game.toJSON();
    expect(json.entities).toBeDefined();
    expect(json.entities.length).toBe(currentNum+2); // player (0) + 2 entities

    const deserialized = Game.fromJSON(json);
    expect(deserialized.getEntity(0)).toBe(deserialized.player);
    expect(deserialized.getEntity(1)).toBeDefined();
    expect(deserialized.getEntity(2)).toBeDefined();
  });

  test('should maintain player instance identity after deserialization', () => {
    const json = game.toJSON();
    const deserialized = Game.fromJSON(json);
    
    // Player should be the same instance as entity 0
    expect(deserialized.getEntity(0)).toBe(deserialized.player);
    expect(deserialized.getEntity(0)).toBe(deserialized.player);
  });

  test('should preserve entity positions after deserialization', () => {
    const entity = new Mob();
    entity.id=5;
    game.addEntity(entity, { x: 15, y: 20, areaId: 'grasslands' });

    const json = game.toJSON();
    const deserialized = Game.fromJSON(json);
    
    const loadedEntity = deserialized.getEntity(5);
    expect(loadedEntity).toBeDefined();
    expect(loadedEntity?.position).toEqual({ x: 15, y: 20, areaId: 'grasslands' });
  });

  test('should produce equivalent JSON after serialize-deserialize-serialize cycle', () => {
    // Create and initialize game
    const game = new Game();
    game.initialise();
    const pt = game.getCurrentArea().getTileFor(game.player);
    if (!pt) throw new Error('Tile is null');
    expect(pt.entities.length).toBe(1);
    
    // First serialization
    const firstJson = game.toJSON();
    
    // Deserialize and serialize again
    const deserialized = Game.fromJSON(firstJson);
    const secondJson = deserialized.toJSON();
    
    // Compare the two serializations
    expect(secondJson).toEqual(firstJson);

    const thirdJson = game.toJSON();
    
    // Compare the two serializations
    expect(thirdJson).toEqual(firstJson);
  });
});

describe('Game contructor', () => {

  test('game construction', () => {
    let game= new Game();
    const player = game.player;

    expect(game.entityIdCounter).toBe(1);
    expect(player.position.areaId).toBeUndefined();
  });
}); 

describe('Game initial state', () => {
  let game= new Game().initialise();

  test('should have current area matching player position and correct entity counts', () => {
    const player = game.player;
    const currentArea = game.getCurrentArea();
    expect(currentArea.id).toBe(player.position.areaId);
    // Current area should have 2 entities (player + mob)
    expect(currentArea.entities.size).toBe(2);
    // All other areas should have 1 entity (mob)
    for (const [areaId, area] of game.world.areas.entries()) {
      if (areaId !== currentArea.id) {
        expect(area.entities.size).toBe(1);
      }
    }

    expect(game.entityIdCounter).toBe(game.entities.size);
    expect(game.entityIdCounter).toBe(6);
  });
}); 