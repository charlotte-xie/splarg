export class ItemType {
  public id: string;
  public name: string;
  public description: string;
  public symbol: string;
  public stackable?: boolean;

  constructor({ id, name, description, symbol, stackable }: {
    id: string;
    name: string;
    description: string;
    symbol: string;
    stackable?: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.symbol = symbol;
    this.stackable = stackable;
  }
}

// Example ItemTypes
export const ITEM_TYPES: Record<string, ItemType> = {
  healthPotion: new ItemType({
    id: 'healthPotion',
    name: 'Health Potion',
    description: 'A red potion that restores 50 health points when consumed.',
    symbol: '🧪',
    stackable: true
  }),
  manaPotion: new ItemType({
    id: 'manaPotion',
    name: 'Mana Potion',
    description: 'A blue potion that restores 30 mana points when consumed.',
    symbol: '🔮',
    stackable: true
  }),
  ironSword: new ItemType({
    id: 'ironSword',
    name: 'Iron Sword',
    description: 'A sturdy iron sword that deals 15-20 damage. Basic but reliable.',
    symbol: '⚔️',
    stackable: false
  }),
  leatherArmor: new ItemType({
    id: 'leatherArmor',
    name: 'Leather Armor',
    description: 'Light leather armor that provides 5 defense points.',
    symbol: '🛡️',
    stackable: false
  }),
  goldCoin: new ItemType({
    id: 'goldCoin',
    name: 'Gold Coin',
    description: 'A shiny gold coin worth 1 gold piece.',
    symbol: '🪙',
    stackable: true
  }),
  bread: new ItemType({
    id: 'bread',
    name: 'Bread',
    description: 'Fresh baked bread that restores 10 health points.',
    symbol: '🍞',
    stackable: true
  })
};

export default class Item {
  public number: number;
  public type: ItemType;

  constructor(number: number, type: ItemType) {
    this.number = number;
    this.type = type;
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
    new Item(3, ITEM_TYPES.healthPotion),
    new Item(2, ITEM_TYPES.manaPotion),
    new Item(1, ITEM_TYPES.ironSword),
    new Item(1, ITEM_TYPES.leatherArmor),
    new Item(25, ITEM_TYPES.goldCoin),
    new Item(5, ITEM_TYPES.bread)
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
  
  return new Item(randomQuantity, randomType);
} 