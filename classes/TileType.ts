export class TileType {
  public id: string;
  public name: string;
  public color: string;
  public symbol: string;
  public textColor: string;
  public walkable: boolean;
  public description: string;

  constructor({ id, name, color, symbol, textColor, walkable, description }: {
    id: string;
    name: string;
    color: string;
    symbol: string;
    textColor: string;
    walkable: boolean;
    description: string;
  }) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.symbol = symbol;
    this.textColor = textColor;
    this.walkable = walkable;
    this.description = description;
  }
}

export const TILE_TYPES: Record<string, TileType> = {
  grass: new TileType({
    id: 'grass',
    name: 'Grass',
    color: '#2d5a27',
    symbol: '🌱',
    textColor: '#ffffff',
    walkable: true,
    description: 'Lush green grass covering the ground'
  }),
  water: new TileType({
    id: 'water',
    name: 'Water',
    color: '#1e3a8a',
    symbol: '💧',
    textColor: '#ffffff',
    walkable: false,
    description: 'Deep blue water - cannot walk here'
  }),
  stone: new TileType({
    id: 'stone',
    name: 'Stone',
    color: '#6b7280',
    symbol: '🪨',
    textColor: '#ffffff',
    walkable: false,
    description: 'Solid stone wall'
  }),
  sand: new TileType({
    id: 'sand',
    name: 'Sand',
    color: '#d97706',
    symbol: '🏖️',
    textColor: '#000000',
    walkable: true,
    description: 'Warm golden sand'
  }),
  forest: new TileType({
    id: 'forest',
    name: 'Forest',
    color: '#166534',
    symbol: '🌲',
    textColor: '#ffffff',
    walkable: true,
    description: 'Dense forest with tall trees'
  })
}; 