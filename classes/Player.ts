import Item from './Item';

interface PlayerPosition {
  x: number;
  y: number;
}

interface PlayerStats {
  health: number;
  maxHealth: number;
  level: number;
  experience: number;
  experienceToNext: number;
  strength: number;
  defense: number;
  speed: number;
  gold: number;
  [key: string]: any;
}

export default class Player {
  public position: PlayerPosition;
  public stats: PlayerStats;
  public inventory: Item[];
  public wornItems: Map<string, Item>;
  public outfits: Map<string, string[]>; // "OutfitName" -> [list of item ids]

  constructor(position: PlayerPosition = Player.defaultPosition(), stats: PlayerStats = Player.defaultStats()) {
    this.position = { ...position };
    this.stats = { ...stats };
    this.inventory = [];
    this.wornItems = new Map();
    this.outfits = new Map();
  }

  static defaultStats(): PlayerStats {
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

  static defaultPosition(): PlayerPosition {
    return { x: 3, y: 3 };
  }

  setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  updateStats(newStats: Partial<PlayerStats>): void {
    this.stats = { ...this.stats, ...newStats };
  }

  addExperience(amount: number): void {
    this.stats.experience += amount;
    while (this.stats.experience >= this.stats.experienceToNext) {
      this.levelUp();
    }
  }

  levelUp(): void {
    this.stats.level += 1;
    this.stats.experience -= this.stats.experienceToNext;
    this.stats.experienceToNext = Math.floor(this.stats.experienceToNext * 1.5);
    this.stats.health = this.stats.maxHealth;
  }

  heal(amount: number): void {
    this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
  }

  takeDamage(amount: number): void {
    this.stats.health = Math.max(0, this.stats.health - amount);
  }

  addGold(amount: number): void {
    this.stats.gold += amount;
  }

  addItem(item: Item): void {
    // Try to find an existing item to stack with
    const existingItem = this.inventory.find(invItem => invItem.canStack(item));
    if (existingItem) {
      existingItem.stackWith(item);
      return;
    }
    // If no existing stack found, add as new item
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
    
    // Collect all existing items that need to be removed
    const itemsToRemove = new Set<Item>();
    
    // Only remove items that overlap in the exact same wear location
    wearLocations.forEach(location => {
      const existingItem = this.wornItems.get(location);
      if (existingItem) {
        itemsToRemove.add(existingItem);
      }
    });
    
    // Remove all existing items from their wear locations and add them back to inventory
    itemsToRemove.forEach(existingItem => {
      const existingWearLocations = existingItem.getWearLocations();
      if (existingWearLocations) {
        existingWearLocations.forEach(location => {
          // Use removeWornItem to trigger locked item checks
          this.removeWornItem(location);
        });
      }
    });
    
    // Remove the new item from inventory before wearing
    const invIndex = this.inventory.indexOf(item);
    if (invIndex !== -1) {
      this.inventory.splice(invIndex, 1);
    }
    
    // Add the new item to all its wear locations
    wearLocations.forEach(location => {
      this.wornItems.set(location, item);
    });
    
    return true;
  }

  removeWornItem(wearLocation: string): Item | undefined {
    const item = this.wornItems.get(wearLocation);
    if (item) {
      // Check if the item is locked
      if (item.isLocked()) {
        throw new Error(`Cannot remove locked item: ${item.getName()}`);
      }
      
      // Remove the item from all its wear locations
      const wearLocations = item.getWearLocations();
      if (wearLocations) {
        wearLocations.forEach(location => {
          this.wornItems.delete(location);
        });
      }
      // Add the removed item back to inventory
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
    // Check if there's a worn item in the specified location (any layer) that is restricted
    const bodyPart = location.split('-')[0]; // Extract body part (e.g., "eyes" from "eyes-outer")
    
    // Check all worn items to see if any are in the same body part and are restricted
    for (const [wearLocation, item] of this.wornItems) {
      const wornBodyPart = wearLocation.split('-')[0];
      if (wornBodyPart === bodyPart && item.isRestricted()) {
        return true;
      }
    }
    
    return false;
  }

  // New method to get all items worn by a specific item
  getItemsWornByItem(item: Item): string[] {
    const wearLocations = item.getWearLocations();
    if (!wearLocations) return [];
    
    return wearLocations.filter(location => {
      const wornItem = this.wornItems.get(location);
      return wornItem && wornItem.getId() === item.getId();
    });
  }

  // Save current outfit with a given name
  saveOutfit(outfitName: string): boolean {
    if (!outfitName.trim()) {
      return false;
    }

    // Get all unique worn items (since items can span multiple locations)
    const uniqueWornItems = new Set<string>();
    this.wornItems.forEach((item) => {
      uniqueWornItems.add(item.getId());
    });

    const itemIds = Array.from(uniqueWornItems);
    this.outfits.set(outfitName, itemIds);
    return true;
  }

  // Wear a saved outfit
  wearOutfit(outfitName: string): boolean {
    const itemIds = this.outfits.get(outfitName);
    if (!itemIds) {
      return false;
    }

    // Remove all currently worn items and add them back to inventory
    const currentlyWornItems = new Set<Item>();
    this.wornItems.forEach((item) => {
      currentlyWornItems.add(item);
    });
    
    this.wornItems.clear();
    
    // Add all removed items back to inventory
    currentlyWornItems.forEach(item => {
      this.addItem(item);
    });

    // Try to wear each item in the outfit
    let successCount = 0;
    itemIds.forEach(itemId => {
      // Find the item in inventory
      const itemIndex = this.inventory.findIndex(item => item.getId() === itemId);
      if (itemIndex !== -1) {
        const item = this.inventory[itemIndex];
        if (this.wearItem(item)) {
          successCount++;
        }
      }
    });

    return successCount > 0;
  }

  // Get all saved outfit names
  getOutfitNames(): string[] {
    return Array.from(this.outfits.keys());
  }

  // Delete a saved outfit
  deleteOutfit(outfitName: string): boolean {
    return this.outfits.delete(outfitName);
  }

  // Check if an outfit exists
  hasOutfit(outfitName: string): boolean {
    return this.outfits.has(outfitName);
  }

  toJSON() {
    return {
      position: this.position,
      stats: this.stats,
      inventory: this.inventory.map(item => item.toJSON()),
      wornItems: Array.from(this.wornItems.entries()).map(([k, v]) => [k, v.toJSON()]),
      outfits: Array.from(this.outfits.entries()),
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