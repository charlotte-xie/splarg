import { ITEM_TYPES, ItemType, WearLayer, WearType, createWearLocations } from './ItemType';

export default class Item {
  public number: number;
  public type: ItemType;
  public props: Record<string, any>;

  constructor(typeOrId: ItemType | string, quantity: number = 1, props: Record<string, any> = {}) {
    // If first parameter is a string, look up the item type
    if (typeof typeOrId === 'string') {
      const itemType = ITEM_TYPES[typeOrId];
      if (!itemType) {
        throw new Error(`Item type '${typeOrId}' not found`);
      }
      this.type = itemType;
    } else {
      this.type = typeOrId;
    }
    this.number = Math.max(1, quantity);
    this.props = { ...props };
  }

  canStack(other?: Item): boolean {
    if (other) {
      return (
        this.type.stackable === true &&
        other.type.id === this.type.id
      );
    }
    return !!this.type.stackable;
  }

  getName(): string {
    return this.type.name;
  }

  getDescription(): string {
    return this.type.description;
  }

  getId(): string {
    return this.type.id;
  }

  getSymbol(): string {
    return this.type.symbol;
  }

  isStackable(): boolean {
    return !!this.type.stackable;
  }

  isWearable(): boolean {
    return !!this.type.wearable;
  }

  isRestricted(): boolean {
    return !!this.type.restricted;
  }

  isLocked(): boolean {
    return !!this.props.locked;
  }

  getLayer(): WearLayer | undefined {
    return this.type.layer;
  }

  getLocations(): WearType[] | undefined {
    return this.type.locations;
  }

  getWearLocations(): string[] | undefined {
    if (!this.type.layer || !this.type.locations) {
      return undefined;
    }
    return createWearLocations(this.type.locations, this.type.layer);
  }

  // Legacy method for backward compatibility
  getWearLocation(): string | undefined {
    const wearLocations = this.getWearLocations();
    return wearLocations ? wearLocations[0] : undefined;
  }

  getQuantity(): number {
    return this.number;
  }

  setQuantity(quantity: number): void {
    this.number = Math.max(1, quantity);
  }

  stackWith(otherItem: Item): void {
    if (this.canStack(otherItem)) {
      this.number += otherItem.number;
    }
  }

  hasMultiple(): boolean {
    return this.number > 1;
  }

  toJSON() {
    return {
      type: this.type.id,
      number: this.number,
      props: this.props
    };
  }

  static fromJSON(obj: any): Item {
    return new Item(obj.type, obj.number, obj.props || {});
  }
}

// Helper function to create example items
export function createExampleItems(): Item[] {
  return [
    new Item(ITEM_TYPES.healthPotion, 3),
    new Item(ITEM_TYPES.manaPotion, 2),
    new Item(ITEM_TYPES.ironSword, 1),
    new Item(ITEM_TYPES.leatherArmor, 1),
    new Item(ITEM_TYPES.straightJacket, 1),
    new Item(ITEM_TYPES.longCoat, 1),
    new Item(ITEM_TYPES.vest, 1),
    new Item(ITEM_TYPES.boots, 1),
    new Item(ITEM_TYPES.highHeels, 1),
    new Item(ITEM_TYPES.gloves, 1),
    new Item(ITEM_TYPES.scarf, 1),
    new Item(ITEM_TYPES.steampunkGlasses, 1),
    new Item(ITEM_TYPES.blindfold, 1),
    new Item(ITEM_TYPES.goldCoin, 25),
    new Item(ITEM_TYPES.bread, 5)
  ];
}

// Helper function to create a random item
export function createRandomItem(): Item {
  const itemTypeKeys = Object.keys(ITEM_TYPES);
  const randomTypeKey = itemTypeKeys[Math.floor(Math.random() * itemTypeKeys.length)];
  const randomType = ITEM_TYPES[randomTypeKey];
  
  // Generate random quantity (1-10 for stackable items, 1 for non-stackable)
  const maxQuantity = randomType.stackable ? 10 : 1;
  const randomQuantity = Math.floor(Math.random() * maxQuantity) + 1;
  
  return new Item(randomType, randomQuantity);
} 