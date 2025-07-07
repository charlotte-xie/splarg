import Item from './Item';

export interface BeingPosition {
  x: number;
  y: number;
}

export interface BeingStats {
  health?: number;
  maxHealth?: number;
  level?: number;
  strength?: number;
  defense?: number;
  speed?: number;
  [key: string]: any;
}

export class Being {
  public position: BeingPosition;
  public stats: BeingStats;
  public inventory: Item[];
  public wornItems: Map<string, Item>;

  constructor() {
    this.position = { x: 0, y: 0 };
    this.stats = {};
    this.inventory = [];
    this.wornItems = new Map();
  }

  setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  updateStats(newStats: Partial<BeingStats>): void {
    this.stats = { ...this.stats, ...newStats };
  }

  addItem(item: Item): void {
    const existingItem = this.inventory.find(invItem => invItem.canStack(item));
    if (existingItem) {
      existingItem.stackWith(item);
      return;
    }
    this.inventory.push(item);
  }

  removeItem(index: number): Item | null {
    if (index >= 0 && index < this.inventory.length) {
      const item = this.inventory[index];
      return this.inventory.splice(index, 1)[0] || null;
    }
    return null;
  }

  getInventory(): Item[] {
    return this.inventory;
  }

  wearItem(item: Item): boolean {
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
      const wearLocations = item.getWearLocations();
      if (wearLocations) {
        wearLocations.forEach(location => {
          this.wornItems.delete(location);
        });
      }
      this.addItem(item);
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
    return {
      position: this.position,
      stats: this.stats,
      inventory: this.inventory.map(item => item.toJSON()),
      wornItems: Array.from(this.wornItems.entries()).map(([k, v]) => [k, v.toJSON()])
    };
  }

  static fromJSON(obj: any): Being {
    const being = new Being();
    being.position = obj.position;
    being.stats = obj.stats;
    being.inventory = (obj.inventory || []).map((itemObj: any) => Item.fromJSON(itemObj));
    being.wornItems = new Map((obj.wornItems || []).map(([k, v]: [string, any]) => [k, Item.fromJSON(v)]));
    return being;
  }
} 