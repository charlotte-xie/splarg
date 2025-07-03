// TileType and TILE_TYPES
export const TILE_TYPES = {
  GRASS: {
    id: 'grass',
    name: 'Grass',
    color: '#2d5a27',
    symbol: '🌱',
    textColor: '#ffffff',
    walkable: true,
    description: 'Lush green grass covering the ground'
  },
  WATER: {
    id: 'water',
    name: 'Water',
    color: '#1e3a8a',
    symbol: '💧',
    textColor: '#ffffff',
    walkable: false,
    description: 'Deep blue water - cannot walk here'
  },
  STONE: {
    id: 'stone',
    name: 'Stone',
    color: '#6b7280',
    symbol: '🪨',
    textColor: '#ffffff',
    walkable: true,
    description: 'Solid stone walls and floors'
  },
  SAND: {
    id: 'sand',
    name: 'Sand',
    color: '#d97706',
    symbol: '🏖️',
    textColor: '#000000',
    walkable: true,
    description: 'Warm golden sand'
  },
  FOREST: {
    id: 'forest',
    name: 'Forest',
    color: '#166534',
    symbol: '🌲',
    textColor: '#ffffff',
    walkable: true,
    description: 'Dense forest with tall trees'
  }
};

export class TileType {
  constructor({ id, name, color, symbol, textColor, walkable, description }) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.symbol = symbol;
    this.textColor = textColor;
    this.walkable = walkable;
    this.description = description;
  }
}

export default class Tile {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // Should be a TileType
  }

  isWalkable() {
    return this.type.walkable;
  }

  getColor() {
    return this.type.color;
  }

  getSymbol() {
    return this.type.symbol;
  }

  getTextColor() {
    return this.type.textColor;
  }

  getDescription() {
    return this.type.description;
  }
} 