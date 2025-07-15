import Mob from '../classes/Mob';
import Player from '../classes/Player';
import Tile from '../classes/Tile';
import { TILE_TYPES } from '../classes/TileType';

describe('Tile Name Methods', () => {
  test('should return correct basic name', () => {
    const grassTile = new Tile(TILE_TYPES.grass);
    const stoneTile = new Tile(TILE_TYPES.stone);
    
    expect(grassTile.getName()).toBe('Grass');
    expect(stoneTile.getName()).toBe('Stone');
  });

  test('should return correct indefinite article names', () => {
    const grassTile = new Tile(TILE_TYPES.grass);
    const stoneTile = new Tile(TILE_TYPES.stone);
    const forestTile = new Tile(TILE_TYPES.forest);
    
    expect(grassTile.getAName()).toBe('a Grass');
    expect(stoneTile.getAName()).toBe('a Stone');
    expect(forestTile.getAName()).toBe('a Forest');
  });

  test('should return correct definite article names', () => {
    const grassTile = new Tile(TILE_TYPES.grass);
    const stoneTile = new Tile(TILE_TYPES.stone);
    
    expect(grassTile.getTheName()).toBe('the Grass');
    expect(stoneTile.getTheName()).toBe('the Stone');
  });

  test('should return correct possessive names', () => {
    const grassTile = new Tile(TILE_TYPES.grass);
    const stoneTile = new Tile(TILE_TYPES.stone);
    const player = new Player();
    const mob = new Mob();
    
    expect(grassTile.getPossessiveName(player)).toBe("your Grass");
    expect(stoneTile.getPossessiveName(player)).toBe("your Stone");
    expect(grassTile.getPossessiveName(mob)).toBe("Mob's Grass");
    expect(stoneTile.getPossessiveName(mob)).toBe("Mob's Stone");
  });
}); 