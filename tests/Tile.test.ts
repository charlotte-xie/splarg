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
}); 