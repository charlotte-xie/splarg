import Item from './Item';
import Thing from './Thing';
import { TILE_TYPES, TileType } from './TileType';
import Utils from './Utils';

export default class Tile extends Thing {
  public type: TileType;
  public items: Item[];
  public entities: number[];

  constructor(type: TileType) {
    super();
    this.type = type;
    this.items = [];
    this.entities = [];
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

  getName(): string {
    return this.type.name;
  }

  getAName(): string {
    const name = this.getName();
    const article = Utils.startsWithVowelSound(name) ? 'an' : 'a';
    return `${article} ${name}`;
  }

  getTheName(): string {
    return `the ${this.type.name}`;
  }

  getPossessiveName(entity: import('./Entity').default): string {
    if (entity.isPlayer()) {
      return `your ${this.type.name}`;
    }
    return `${entity.getName()}'s ${this.type.name}`;
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
    const hasItems = this.items && this.items.length > 0;
    const hasEntities = this.entities && this.entities.length > 0;
    if (!hasItems && !hasEntities) {
      return this.type.id;
    }
    if (hasItems && !hasEntities) {
      return [this.type.id, this.items.map(item => item.toJSON())];
    }
    if (hasItems && hasEntities) {
      return [this.type.id, this.items.map(item => item.toJSON()), this.entities];
    }
    // !hasItems && hasEntities
    return [this.type.id, [], this.entities];
  }

  static fromJSON(obj: any): Tile {
    if (typeof obj === 'string') {
      // Just a type id, no items, no entities
      return new Tile(TILE_TYPES[obj]);
    } else if (Array.isArray(obj)) {
      const [typeId, itemsArr, entitiesArr] = obj;
      const tile = new Tile(TILE_TYPES[String(typeId)]);
      if (Array.isArray(itemsArr) && itemsArr.length > 0) {
        tile.items = itemsArr.map((itemObj: any) => Item.fromJSON(itemObj));
      }
      if (Array.isArray(entitiesArr) && entitiesArr.length > 0) {
        tile.entities = entitiesArr;
      }
      return tile;
    } else {
      throw new Error('Invalid tile JSON format');
    }
  }
} 