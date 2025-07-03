export interface TileType {
  id: string;
  name: string;
  color: string;
  symbol: string;
  textColor: string;
  walkable: boolean;
  description?: string;
}

export interface Tile {
  x: number;
  y: number;
  type: TileType;
}

export interface TilePosition {
  x: number;
  y: number;
}

export const TILE_TYPES: Record<string, TileType> = {
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
} as const;

export type TileTypeId = keyof typeof TILE_TYPES; 