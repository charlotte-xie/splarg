export class ItemType {
  public id: string;
  public name: string;
  public description: string;
  public symbol: string;
  public stackable?: boolean;
  public wearable?: boolean;

  constructor({ id, name, description, symbol, stackable, wearable }: {
    id: string;
    name: string;
    description: string;
    symbol: string;
    stackable?: boolean;
    wearable?: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.symbol = symbol;
    this.stackable = stackable;
    this.wearable = wearable;
  }
}

// Example ItemTypes
export const ITEM_TYPES: Record<string, ItemType> = {
  healthPotion: new ItemType({
    id: 'healthPotion',
    name: 'Health Potion',
    description: 'A red potion that restores 50 health points when consumed.',
    symbol: '🧪',
    stackable: true,
    wearable: false
  }),
  manaPotion: new ItemType({
    id: 'manaPotion',
    name: 'Mana Potion',
    description: 'A blue potion that restores 30 mana points when consumed.',
    symbol: '🔮',
    stackable: true,
    wearable: false
  }),
  ironSword: new ItemType({
    id: 'ironSword',
    name: 'Iron Sword',
    description: 'A sturdy iron sword that deals 15-20 damage. Basic but reliable.',
    symbol: '⚔️',
    stackable: false,
    wearable: true
  }),
  leatherArmor: new ItemType({
    id: 'leatherArmor',
    name: 'Leather Armor',
    description: 'Light leather armor that provides 5 defense points.',
    symbol: '🛡️',
    stackable: false,
    wearable: true
  }),
  goldCoin: new ItemType({
    id: 'goldCoin',
    name: 'Gold Coin',
    description: 'A shiny gold coin worth 1 gold piece.',
    symbol: '🪙',
    stackable: true,
    wearable: false
  }),
  bread: new ItemType({
    id: 'bread',
    name: 'Bread',
    description: 'Fresh baked bread that restores 10 health points.',
    symbol: '🍞',
    stackable: true,
    wearable: false
  })
};

export default class Item {
  public number: number;
  public type: ItemType;

  constructor(typeOrId: ItemType | string, quantity: number = 1) {
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
}

// Helper function to create example items
export function createExampleItems(): Item[] {
  return [
    new Item(ITEM_TYPES.healthPotion, 3),
    new Item(ITEM_TYPES.manaPotion, 2),
    new Item(ITEM_TYPES.ironSword, 1),
    new Item(ITEM_TYPES.leatherArmor, 1),
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