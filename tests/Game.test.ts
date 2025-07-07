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
    player.setPosition(2, 2);
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