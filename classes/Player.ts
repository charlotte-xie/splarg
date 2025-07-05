import Item, { createExampleItems } from './Item';

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

  constructor(position: PlayerPosition = Player.defaultPosition(), stats: PlayerStats = Player.defaultStats()) {
    this.position = { ...position };
    this.stats = { ...stats };
    this.inventory = createExampleItems();
    this.wornItems = new Map();
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
    const existingItemIndex = this.inventory.findIndex(invItem => 
      invItem.canStack(item)
    );
    
    if (existingItemIndex !== -1) {
      // Found an existing stack, add to it
      const existingItem = this.inventory[existingItemIndex];
      existingItem.stackWith(item);
      return;
    }
    
    // If no existing stack found, add as new item
    this.inventory.push(item);
  }

  removeItem(index: number): Item | null {
    if (index >= 0 && index < this.inventory.length) {
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
    
    // Remove any existing items in those slots
    wearLocations.forEach(location => {
      this.wornItems.delete(location);
    });
    
    // Add the new item to all its wear locations
    wearLocations.forEach(location => {
      this.wornItems.set(location, item);
    });
    
    return true;
  }

  removeWornItem(wearLocation: string): Item | undefined {
    const item = this.wornItems.get(wearLocation);
    if (item) {
      // Remove the item from all its wear locations
      const wearLocations = item.getWearLocations();
      if (wearLocations) {
        wearLocations.forEach(location => {
          this.wornItems.delete(location);
        });
      }
    }
    return item;
  }

  getWornItems(): Map<string, Item> {
    return this.wornItems;
  }

  isWearingItem(wearLocation: string): boolean {
    return this.wornItems.has(wearLocation);
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
} 