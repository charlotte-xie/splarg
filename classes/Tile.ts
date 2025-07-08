import Item from './Item';
import { TILE_TYPES, TileType } from './TileType';

export default class Tile {
  public type: TileType;
  public items: Item[];
  public entities: Set<number>;

  constructor(type: TileType) {
    this.type = type;
    this.items = [];
    this.entities = new Set();
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
    // Compact: [typeId, items?, entities?]
    const hasItems = this.items && this.items.length > 0;
    const hasEntities = this.entities && this.entities.size > 0;
    if (!hasItems && !hasEntities) {
      return this.type.id;
    }
    const arr = [this.type.id, this.items, this.entities];
    return arr;
  }

  static fromJSON(obj: any): Tile {
    if (typeof obj === 'string') {
      // Just a type id, no items, no entities
      return new Tile(TILE_TYPES[obj]);
    } else if (Array.isArray(obj)) {
      const [typeId, itemsArr, entitiesArr] = obj;
      const tile = new Tile(TILE_TYPES[String(typeId)]);
      if (Array.isArray(itemsArr)) {
        tile.items = itemsArr.map((itemObj: any) => Item.fromJSON(itemObj));
      }
      if (Array.isArray(entitiesArr)) {
        tile.entities = new Set(entitiesArr);
      }
      return tile;
    } else {
      throw new Error('Invalid tile JSON format');
    }
  }
} 