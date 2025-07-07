import Entity from '../classes/Entity';
import Game from '../classes/Game';
import Item from '../classes/Item';
import { ITEM_TYPES } from '../classes/ItemType';
import Player from '../classes/Player';

describe('Game.dropItem', () => {
  let game: Game;
  let player: Player;

  beforeEach(() => {
    game = new Game();
    player = game.getPlayer();
    player.inventory = [];
    // Place player at a known position
    player.setPosition({ x: 2, y: 2 });
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
    game = new Game();
  });

  test('should return player when getting entity with ID 0', () => {
    const entity = game.getEntity(0);
    expect(entity).toBe(game.getPlayer());
  });

  test('should return player when getting entity with player object', () => {
    const player = game.getPlayer();
    const entity = game.getEntity(player);
    expect(entity).toBe(player);
  });

  test('should return null for non-existent entity ID', () => {
    const entity = game.getEntity(-999);
    expect(entity).toBeNull();
  });

  test('should return null for entity not in map', () => {
    const fakeEntity = new Entity();
    fakeEntity.setId(-998);
    const entity = game.getEntity(fakeEntity);
    expect(entity).toBeNull();
  });

  test('should maintain player ID 0 invariant after updatePlayer', () => {
    const newPlayer = new Player();
    game.updatePlayer(newPlayer);
    expect(game.getEntity(0)).toBe(newPlayer);
    expect(game.getEntity(0)).toBe(game.getPlayer());
  });
}); 