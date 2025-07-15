import Entity, { EntityClass } from './Entity';
import Item from './Item';
import { Gender } from './Names';
import { Race } from './Races';

export interface BeingStats {
  health?: number;
  maxHealth?: number;
  level?: number;
  strength?: number;
  defense?: number;
  speed?: number;
  gender?: Gender;
  name?: string;
  race?: Race;
  [key: string]: any;
}

export class Being extends Entity {
  public stats: BeingStats;
  public inventory: Item[];
  public wornItems: Map<string, Item>;

  constructor(klass: EntityClass) {
    super(klass);
    this.stats = {};
    this.inventory = [];
    this.wornItems = new Map();
  }

  getPronoun(): string {
    switch (this.gender) {
      case 'male':
        return 'he';
      case 'female':
        return 'she';
      case 'neutral':
      default:
        return 'it';
    }
  }

  // Gets the gender of a Being. Possible values are Gender.MALE, Gender.FEMALE, Gender.NEUTRAL
  public get gender(): Gender {
    return this.stats.gender || Gender.NEUTRAL;
  }

  updateStats(newStats: Partial<BeingStats>): void {
    this.stats = { ...this.stats, ...newStats };
  }

  addItem(item: Item): Item {
    for (const invItem of this.inventory) {
      if (invItem === item) {
        // Item already in inventory, return it
        return invItem;
      }
      if (invItem.canStack(item)) {
        invItem.stackWith(item);
        return invItem;
      }
    }
    this.inventory.push(item);
    return item;
  }

  removeItem(item: Item): Item | null {
    const idx = this.inventory.indexOf(item);
    if (idx !== -1) {
     return this.removeItemByIndex(idx);
    }
    return null;
  }

  removeItemByIndex(index: number): Item | null {
    if (index >= 0 && index < this.inventory.length) {
      const item = this.inventory[index];
      this.inventory.splice(index, 1)[0];
      return item;
    }
    return null;
  }

  getInventory(): Item[] {
    return this.inventory;
  }

  wearItem(item: Item): boolean {
    this.time+=100;
    if (!item.isWearable()) {
      return false;
    }
    const wearLocations = item.getWearLocations();
    if (!wearLocations || wearLocations.length === 0) {
      return false;
    }
    const itemsToRemove = new Set<Item>();
    wearLocations.forEach(location => {
      const existingItem = this.wornItems.get(location);
      if (existingItem) {
        itemsToRemove.add(existingItem);
      }
    });
    itemsToRemove.forEach(existingItem => {
      const existingWearLocations = existingItem.getWearLocations();
      if (existingWearLocations) {
        existingWearLocations.forEach(location => {
          this.removeWornItem(location);
        });
      }
    });
    const invIndex = this.inventory.indexOf(item);
    if (invIndex !== -1) {
      this.inventory.splice(invIndex, 1);
    }
    wearLocations.forEach(location => {
      this.wornItems.set(location, item);
    });
    return true;
  }

  removeWornItem(wearLocation: string): Item | undefined {
    const item = this.wornItems.get(wearLocation);
    if (item) {
      if (item.isLocked()) {
        throw new Error(`Cannot remove locked item: ${item.getName()}`);
      }
      // Enforce allowsAccess: check for blocking items on the same body part and higher layers
      const [bodyPart, layer] = wearLocation.split('-');
      const LAYER_ORDER = ['outer', 'inner', 'under'];
      const currentLayerIdx = LAYER_ORDER.indexOf(layer);
      if (currentLayerIdx > -1) {
        for (let i = 0; i < currentLayerIdx; i++) {
          const higherLayer = LAYER_ORDER[i];
          const higherLoc = `${bodyPart}-${higherLayer}`;
          const blockingItem = this.wornItems.get(higherLoc);
          if (blockingItem && blockingItem.type.allowsAccess === false) {
            throw new Error(`Cannot remove ${item.getName()} while ${blockingItem.getName()} is worn over it.`);
          }
        }
      }
      const wearLocations = item.getWearLocations();
      if (wearLocations) {
        wearLocations.forEach(location => {
          this.wornItems.delete(location);
        });
      }
      this.addItem(item);
      this.time+=100;
    }
    return item;
  }

  getWornItems(): Map<string, Item> {
    return this.wornItems;
  }

  isWearingItem(wearLocation: string): boolean {
    return this.wornItems.has(wearLocation);
  }

  isRestricted(location: string): boolean {
    const bodyPart = location.split('-')[0];
    for (const [wearLocation, item] of this.wornItems) {
      const wornBodyPart = wearLocation.split('-')[0];
      if (wornBodyPart === bodyPart && item.isRestricted()) {
        return true;
      }
    }
    return false;
  }

  toJSON() {
    const base = super.toJSON();
    return {
      ...base,
      stats: this.stats,
      inventory: this.inventory.map(item => item.toJSON()),
      wornItems: Array.from(this.wornItems.entries()).map(([k, v]) => [k, v.toJSON()]),
    };
  }

  static fromJSON(obj: any): Being {
    const base=super.fromJSON(obj);
    const being = Object.assign(new Being(base.klass), base);
    being.stats = obj.stats;
    being.inventory = (obj.inventory || []).map((itemObj: any) => Item.fromJSON(itemObj));
    being.wornItems = new Map((obj.wornItems || []).map(([k, v]: [string, any]) => [k, Item.fromJSON(v)]));
    return being;
  }

} 