import { TILE_TYPES } from '../types/Tile';

// AreaType definition and AREA_TYPES constant
export const AREA_TYPES = {
  GRASSLANDS: {
    id: 'grasslands',
    name: 'Grasslands',
    description: 'Rolling hills covered in lush green grass',
    width: 25,
    height: 20,
    background: 'linear-gradient(135deg, #2d5a27 0%, #1a3a1a 100%)',
    music: 'grasslands_theme',
    enemies: ['slime', 'wolf'],
    items: ['herb', 'berry']
  },
  FOREST: {
    id: 'forest',
    name: 'Dense Forest',
    description: 'Thick forest with tall trees and mysterious shadows',
    width: 30,
    height: 25,
    background: 'linear-gradient(135deg, #166534 0%, #0f4a1f 100%)',
    music: 'forest_theme',
    enemies: ['goblin', 'bear'],
    items: ['mushroom', 'wood']
  },
  DESERT: {
    id: 'desert',
    name: 'Sandy Desert',
    description: 'Vast desert with scorching heat and shifting sands',
    width: 35,
    height: 20,
    background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
    music: 'desert_theme',
    enemies: ['scorpion', 'bandit'],
    items: ['cactus', 'gem']
  },
  WATER: {
    id: 'water',
    name: 'Crystal Lake',
    description: 'Clear blue waters with hidden depths',
    width: 20,
    height: 15,
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    music: 'water_theme',
    enemies: ['fish', 'merfolk'],
    items: ['pearl', 'seaweed']
  },
  CAVE: {
    id: 'cave',
    name: 'Dark Cave',
    description: 'Mysterious cave system with ancient secrets',
    width: 40,
    height: 30,
    background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
    music: 'cave_theme',
    enemies: ['bat', 'spider'],
    items: ['crystal', 'ore']
  }
};

export class AreaType {
  constructor({ id, name, description, width, height, background, music, enemies, items }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.width = width;
    this.height = height;
    this.background = background;
    this.music = music;
    this.enemies = enemies;
    this.items = items;
  }
}

export default class Area {
  constructor(id, type, tiles) {
    this.id = id;
    this.type = type;
    this.tiles = tiles; // 2D array of TileType
    this.visited = false;
    this.discovered = false;
  }

  getTile(x, y) {
    if (
      x < 0 ||
      y < 0 ||
      y >= this.tiles.length ||
      x >= this.tiles[0].length
    ) {
      return null;
    }
    return this.tiles[y][x];
  }

  isWalkable(x, y) {
    const tile = this.getTile(x, y);
    return tile && tile.walkable;
  }

  getWidth() {
    return this.tiles[0]?.length || 0;
  }

  getHeight() {
    return this.tiles.length;
  }
} 