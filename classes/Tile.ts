import Item from './Item';

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

export default class Tile {
  public type: TileType;
  public items: Item[];

  constructor(type: TileType) {
    this.type = type;
    this.items = [];
  }

  isWalkable(): boolean {
    return this.type.walkable;
  }

  getColour(): string {
    return this.type.color;
  }

  getSymbol(): string {
    return this.type.symbol;
  }

  getTextColour(): string {
    return this.type.textColor;
  }

  getDescription(): string {
    return this.type.description;
  }

  addItem(item: Item): void {
    if (item.canStack()) {
      const existing = this.items.find(
        (i) => i !== item && i.type.id === item.type.id
      );
      if (existing) {
        existing.number += item.number;
        return;
      }
    }
    this.items.push(item);
  }

  toJSON() {
    if (!this.items || this.items.length === 0) {
      return this.type.id;
    }
    return [this.type.id, this.items.map(item => item.toJSON())];
  }

  static fromJSON(obj: any): Tile {
    if (typeof obj === 'string') {
      // Just a type id, no items
      return new Tile(TILE_TYPES[obj]);
    } else if (Array.isArray(obj)) {
      const [typeId, itemsArr] = obj;
      const tile = new Tile(TILE_TYPES[typeId]);
      tile.items = (itemsArr || []).map((itemObj: any) => Item.fromJSON(itemObj));
      return tile;
    } else {
      // fallback for old format
      const tile = new Tile(TILE_TYPES[obj.type]);
      tile.items = (obj.items || []).map((itemObj: any) => Item.fromJSON(itemObj));
      return tile;
    }
  }
} 