import { Being, BeingStats } from './Being';
import Game from './Game';
import Item from './Item';
import { Position } from './World';

// --- Player class ---
export default class Player extends Being {
  public outfits: Map<string, string[]>; // "OutfitName" -> [list of item ids]
  public game: Game | null;

  constructor() {
    super();
    this.outfits = new Map();
    this.game = null;
    this.setId(0);
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

  static defaultPosition(): Position {
    return { areaId: 'grasslands', x: 3, y: 3 };
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
    let allWorn = true;
    for (const itemId of itemIds) {
      // Find the item in inventory
      const item = this.inventory.find(i => i.getId() === itemId);
      if (item) {
        const result = this.wearItem(item);
        if (!result) allWorn = false;
      } else {
        // If item is not in inventory, try to find it already worn (for multi-location items)
        const alreadyWorn = Array.from(this.wornItems.values()).find(i => i.getId() === itemId);
        if (!alreadyWorn) {
          allWorn = false;
        }
      }
    }
    return allWorn;
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
    const player = Object.assign(new Player(), super.fromJSON(obj));
    player.outfits = new Map(obj.outfits || []);
    return player;
  }

  isPlayer(): boolean {
    return true;
  }
} 