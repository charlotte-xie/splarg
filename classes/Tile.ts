import Item from './Item';
import { TILE_TYPES, TileType } from './TileType';

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