import { Being, BeingPosition, BeingStats } from './Being';
import Item from './Item';

// --- Player class ---
export default class Player extends Being {
  public outfits: Map<string, string[]>; // "OutfitName" -> [list of item ids]

  constructor(position: BeingPosition = Player.defaultPosition(), stats: BeingStats = Player.defaultStats()) {
    super(position, stats);
    this.outfits = new Map();
  }

  static defaultStats(): BeingStats {
    return {
      health: 100,
      maxHealth: 100,
      level: 1,
      experience: 0,
      experienceToNext: 100,
      strength: 10,
      defense: 5,
      speed: 8,
      gold: 0
    };
  }

  static defaultPosition(): BeingPosition {
    return { x: 3, y: 3 };
  }

  getItemsWornByItem(item: Item): string[] {
    const locations: string[] = [];
    for (const [location, wornItem] of this.wornItems) {
      if (wornItem === item) {
        locations.push(location);
      }
    }
    return locations;
  }

  saveOutfit(outfitName: string): boolean {
    if (!outfitName) return false;
    const itemIds = Array.from(this.wornItems.values()).map(item => item.getId());
    this.outfits.set(outfitName, itemIds);
    return true;
  }

  wearOutfit(outfitName: string): boolean {
    if (!this.outfits.has(outfitName)) return false;
    const itemIds = this.outfits.get(outfitName)!;
    // ... logic to wear items by id ...
    return true;
  }

  getOutfitNames(): string[] {
    return Array.from(this.outfits.keys());
  }

  deleteOutfit(outfitName: string): boolean {
    return this.outfits.delete(outfitName);
  }

  hasOutfit(outfitName: string): boolean {
    return this.outfits.has(outfitName);
  }

  toJSON() {
    const base = super.toJSON();
    return {
      ...base,
      outfits: Array.from(this.outfits.entries())
    };
  }

  static fromJSON(obj: any): Player {
    const player = new Player(obj.position, obj.stats);
    player.inventory = (obj.inventory || []).map((itemObj: any) => Item.fromJSON(itemObj));
    player.wornItems = new Map((obj.wornItems || []).map(([k, v]: [string, any]) => [k, Item.fromJSON(v)]));
    player.outfits = new Map(obj.outfits || []);
    return player;
  }
} 