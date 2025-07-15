import { WearLayer, WearType } from './ItemType';

export class TileType {
  public id: string;
  public name: string;
  public description: string;
  public symbol: string;
  public stackable?: boolean;
  public wearable?: boolean;
  public layer?: WearLayer;
  public locations?: WearType[];
  public restricted?: boolean;
  public allowsAccess: boolean;
  public pluralName?: string;
  public colour: string;
  public textColour: string;
  public walkable: boolean;

  constructor({ id, name, description, symbol, stackable, wearable, layer, locations, restricted = false, allowsAccess = true, pluralName, colour, textColour, walkable }: {
    id: string;
    name: string;
    description: string;
    symbol: string;
    stackable?: boolean;
    wearable?: boolean;
    layer?: WearLayer;
    locations?: WearType[];
    restricted?: boolean;
    allowsAccess?: boolean;
    pluralName?: string;
    colour: string;
    textColour: string;
    walkable: boolean;
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
    this.allowsAccess = allowsAccess;
    this.pluralName = pluralName;
    this.colour = colour;
    this.textColour = textColour;
    this.walkable = walkable;
  }
}

export const TILE_TYPES: Record<string, TileType> = {
  grass: new TileType({
    id: 'grass',
    name: 'Grass',
    colour: '#2d5a27',
    symbol: '🌱',
    textColour: '#ffffff',
    walkable: true,
    description: 'lush green grass covering the ground'
  }),
  water: new TileType({
    id: 'water',
    name: 'Water',
    colour: '#1e3a8a',
    symbol: '💧',
    textColour: '#ffffff',
    walkable: false,
    description: 'deep blue water'
  }),
  stone: new TileType({
    id: 'stone',
    name: 'Stone',
    colour: '#6b7280',
    symbol: '🪨',
    textColour: '#ffffff',
    walkable: false,
    description: 'solid stone wall'
  }),
  sand: new TileType({
    id: 'sand',
    name: 'Sand',
    colour: '#d97706',
    symbol: '🏖️',
    textColour: '#000000',
    walkable: true,
    description: 'warm golden sand'
  }),
  forest: new TileType({
    id: 'forest',
    name: 'Forest',
    colour: '#166534',
    symbol: '🌲',
    textColour: '#ffffff',
    walkable: true,
    description: 'dense forest with tall trees'
  })
}; 