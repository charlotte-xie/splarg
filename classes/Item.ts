// Wear location types for equipment
export const WEAR_TYPES = {
  head: 'head',
  face: 'face',
  eyes: 'eyes',
  neck: 'neck',
  arm: 'arm',
  chest: 'chest',
  belly: 'belly',
  waist: 'waist',
  hips: 'hips',
  legs: 'legs',
  feet: 'feet',
  hand: 'hand'
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
  public restricted?: boolean;

  constructor({ id, name, description, symbol, stackable, wearable, layer, locations, restricted = false }: {
    id: string;
    name: string;
    description: string;
    symbol: string;
    stackable?: boolean;
    wearable?: boolean;
    layer?: WearLayer;
    locations?: WearType[];
    restricted?: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.symbol = symbol;
    
    // An item is wearable if it has layer/locations or explicitly set to wearable
    this.wearable = wearable ?? (!!(layer || locations));
    
    // An item is stackable by default unless it's wearable or explicitly set to false
    this.stackable = stackable ?? !this.wearable;
    
    this.layer = layer;
    this.locations = locations;
    this.restricted = restricted;
  }
}

// Example ItemTypes
export const ITEM_TYPES: Record<string, ItemType> = {
  healthPotion: new ItemType({
    id: 'healthPotion',
    name: 'health potion',
    description: 'A red potion that restores 50 health points when consumed.',
    symbol: '🧪'
  }),
  manaPotion: new ItemType({
    id: 'manaPotion',
    name: 'mana potion',
    description: 'A blue potion that restores 30 mana points when consumed.',
    symbol: '🔮'
  }),
  ironSword: new ItemType({
    id: 'ironSword',
    name: 'iron sword',
    description: 'A sturdy iron sword that deals 15-20 damage. Basic but reliable.',
    symbol: '⚔️',
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.hand]
  }),
  leatherArmor: new ItemType({
    id: 'leatherArmor',
    name: 'leather armor',
    description: 'Light leather armor that provides 5 defense points.',
    symbol: '🛡️',
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.chest, WEAR_TYPES.belly]
  }),
  longCoat: new ItemType({
    id: 'longCoat',
    name: 'steampunk long coat',
    description: 'A stylish long coat with brass buttons and leather trim.',
    symbol: '🧥',
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.chest, WEAR_TYPES.belly, WEAR_TYPES.arm]
  }),
  boots: new ItemType({
    id: 'boots',
    name: 'leather boots',
    description: 'Sturdy leather boots with steel toe caps.',
    symbol: '👢',
    layer: WEAR_LAYERS.inner,
    locations: [WEAR_TYPES.feet]
  }),
  vest: new ItemType({
    id: 'vest',
    name: 'steampunk vest',
    description: 'A fitted vest with brass buttons and leather trim.',
    symbol: '🎽',
    layer: WEAR_LAYERS.inner,
    locations: [WEAR_TYPES.chest, WEAR_TYPES.belly]
  }),
  gloves: new ItemType({
    id: 'gloves',
    name: 'leather gloves',
    description: 'Fine leather gloves with brass knuckle reinforcements.',
    symbol: '🧤',
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.hand]
  }),
  scarf: new ItemType({
    id: 'scarf',
    name: 'Wool Scarf',
    description: 'A warm wool scarf with steampunk patterns.',
    symbol: '🧣',
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.neck]
  }),
  steampunkGlasses: new ItemType({
    id: 'steampunkGlasses',
    name: 'steampunk glasses',
    description: 'Brass-framed glasses with intricate gears and lenses. Provides a stylish view of the world.',
    symbol: '👓',
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.eyes]
  }),
  blindfold: new ItemType({
    id: 'blindfold',
    name: 'blindfold',
    description: 'A dark cloth blindfold that completely blocks vision.',
    symbol: '🕶️',
    layer: WEAR_LAYERS.outer,
    locations: [WEAR_TYPES.eyes],
    restricted: true
  }),
  goldCoin: new ItemType({
    id: 'goldCoin',
    name: 'gold coin',
    description: 'A shiny gold coin.',
    symbol: '🪙'
  }),
  bread: new ItemType({
    id: 'bread',
    name: 'bread',
    description: 'Fresh baked bread that restores 10 health points.',
    symbol: '🍞'
  }),
  leatherCorset: new ItemType({
    id: 'leatherCorset',
    name: 'leather corset',
    description: 'A fitted leather corset with brass buckles.',
    symbol: '🎽',
    layer: WEAR_LAYERS.inner,
    locations: [WEAR_TYPES.chest, WEAR_TYPES.belly]
  }),
  longSkirt: new ItemType({
    id: 'longSkirt',
    name: 'long skirt',
    description: 'A flowing long skirt made of soft fabric.',
    symbol: '👗',
    layer: WEAR_LAYERS.inner,
    locations: [WEAR_TYPES.legs, WEAR_TYPES.hips]
  }),
  bra: new ItemType({
    id: 'bra',
    name: 'bra',
    description: 'A simple, comfortable bra.',
    symbol: '👙',
    layer: WEAR_LAYERS.under,
    locations: [WEAR_TYPES.chest]
  }),
  plainPanties: new ItemType({
    id: 'plainPanties',
    name: 'plain panties',
    description: 'Plain, comfortable panties.',
    symbol: '🩲',
    layer: WEAR_LAYERS.under,
    locations: [WEAR_TYPES.hips]
  }),
  socks: new ItemType({
    id: 'socks',
    name: 'socks',
    description: 'A pair of plain socks.',
    symbol: '🧦',
    layer: WEAR_LAYERS.under,
    locations: [WEAR_TYPES.feet]
  })
};

export default class Item {
  public number: number;
  public type: ItemType;
  public locked: boolean;

  constructor(typeOrId: ItemType | string, quantity: number = 1, locked: boolean = false) {
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
    this.locked = locked;
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
    return this.locked;
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
      locked: this.locked
    };
  }

  static fromJSON(obj: any): Item {
    return new Item(obj.type, obj.number, obj.locked);
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