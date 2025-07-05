// Wear location types for equipment
export const WEAR_TYPES = {
  head: 'head',
  face: 'face',
  neck: 'neck',
  chest: 'chest',
  belly: 'belly',
  arm: 'arm',
  hand: 'hand',
  waist: 'waist',
  hips: 'hips',
  legs: 'legs',
  feet: 'feet'
} as const;

// Wear layers
export const WEAR_LAYERS = {
  outer: 'outer',
  inner: 'inner',
  under: 'under'
} as const;

export type WearType = typeof WEAR_TYPES[keyof typeof WEAR_TYPES];
export type WearLayer = typeof WEAR_LAYERS[keyof typeof WEAR_LAYERS];

// Helper function to create compound wear locations
export function createWearLocation(area: WearType, layer: WearLayer): string {
  return `${area}-${layer}`;
}

// Helper function to create wear locations for items that span multiple areas
export function createWearLocations(locations: WearType[], layer: WearLayer): string[] {
  return locations.map(location => createWearLocation(location, layer));
}

export class ItemType {
  public id: string;
  public name: string;
  public description: string;
  public symbol: string;
  public stackable?: boolean;
  public wearable?: boolean;
  public layer?: WearLayer;
  public locations?: WearType[];

  constructor({ id, name, description, symbol, stackable = false, wearable = false, layer, locations }: {
    id: string;
    name: string;
    description: string;
    symbol: string;
    stackable?: boolean;
    wearable?: boolean;
    layer?: WearLayer;
    locations?: WearType[];
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.symbol = symbol;
    this.stackable = stackable;
    this.wearable = wearable;
    this.layer = layer;
    this.locations = locations;
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
    wearable: true,
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.hand]
  }),
  leatherArmor: new ItemType({
    id: 'leatherArmor',
    name: 'Leather Armor',
    description: 'Light leather armor that provides 5 defense points.',
    symbol: '🛡️',
    wearable: true,
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.chest, WEAR_TYPES.belly]
  }),
  longCoat: new ItemType({
    id: 'longCoat',
    name: 'Steampunk Long Coat',
    description: 'A stylish long coat with brass buttons and leather trim.',
    symbol: '🧥',
    wearable: true,
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.chest, WEAR_TYPES.belly, WEAR_TYPES.arm]
  }),
  boots: new ItemType({
    id: 'boots',
    name: 'Leather Boots',
    description: 'Sturdy leather boots with steel toe caps.',
    symbol: '👢',
    wearable: true,
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.feet]
  }),
  vest: new ItemType({
    id: 'vest',
    name: 'Steampunk Vest',
    description: 'A fitted vest with brass buttons and leather trim.',
    symbol: '🎽',
    wearable: true,
    layer: WEAR_LAYERS.inner,
    locations: [WEAR_TYPES.chest, WEAR_TYPES.belly]
  }),
  gloves: new ItemType({
    id: 'gloves',
    name: 'Leather Gloves',
    description: 'Fine leather gloves with brass knuckle reinforcements.',
    symbol: '🧤',
    wearable: true,
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.hand]
  }),
  scarf: new ItemType({
    id: 'scarf',
    name: 'Wool Scarf',
    description: 'A warm wool scarf with steampunk patterns.',
    symbol: '🧣',
    wearable: true,
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.neck]
  }),
  goldCoin: new ItemType({
    id: 'goldCoin',
    name: 'Gold Coin',
    description: 'A shiny gold coin.',
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
}

// Helper function to create example items
export function createExampleItems(): Item[] {
  return [
    new Item(ITEM_TYPES.healthPotion, 3),
    new Item(ITEM_TYPES.manaPotion, 2),
    new Item(ITEM_TYPES.ironSword, 1),
    new Item(ITEM_TYPES.leatherArmor, 1),
    new Item(ITEM_TYPES.longCoat, 1),
    new Item(ITEM_TYPES.vest, 1),
    new Item(ITEM_TYPES.boots, 1),
    new Item(ITEM_TYPES.gloves, 1),
    new Item(ITEM_TYPES.scarf, 1),
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