import Game from './Game';
import Item from './Item';
import Player from './Player';

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
  under: 'under',
  acc: 'acc'
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

  // Add a use method for item-specific logic
  use(game: Game, player: Player, item: Item): { message: string, type: 'info' | 'warning' | 'error' | 'success' } | null {
    switch (this.id) {
      case 'healthPotion': {
        if (item.getQuantity() > 1) {
          item.setQuantity(item.getQuantity() - 1);
        } else {
          const idx = player.getInventory().indexOf(item);
          if (idx !== -1) player.removeItem(idx);
        }
        return { message: 'Healed 50 HP', type: 'success' };
      }
      case 'manaPotion': {
        if (item.getQuantity() > 1) {
          item.setQuantity(item.getQuantity() - 1);
        } else {
          const idx = player.getInventory().indexOf(item);
          if (idx !== -1) player.removeItem(idx);
        }
        return { message: 'Restored 30 MP', type: 'success' };
      }
      case 'bread': {
        if (item.getQuantity() > 1) {
          item.setQuantity(item.getQuantity() - 1);
        } else {
          const idx = player.getInventory().indexOf(item);
          if (idx !== -1) player.removeItem(idx);
        }
        return { message: 'Healed 10 HP', type: 'success' };
      }
      default:
        return { message: `Used ${this.name}`, type: 'info' };
    }
  }
}

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