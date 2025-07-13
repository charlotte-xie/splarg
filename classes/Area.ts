import Tile from './Tile';

// AreaType definition and AREA_TYPES constant
export const AREA_TYPES = {
  GRASSLANDS: {
    id: 'grasslands',
    name: 'Grasslands',
    description: 'Rolling hills covered in lush green grass',
    width: 25,
    height: 20,
    background: 'linear-gradient(135deg, #2d5a27 0%, #1a3a1a 100%)',
    music: 'grasslands_theme',
    enemies: ['slime', 'wolf'],
    items: ['herb', 'berry']
  },
  FOREST: {
    id: 'forest',
    name: 'Dense Forest',
    description: 'Thick forest with tall trees and mysterious shadows',
    width: 30,
    height: 25,
    background: 'linear-gradient(135deg, #166534 0%, #0f4a1f 100%)',
    music: 'forest_theme',
    enemies: ['goblin', 'bear'],
    items: ['mushroom', 'wood']
  },
  DESERT: {
    id: 'desert',
    name: 'Sandy Desert',
    description: 'Vast desert with scorching heat and shifting sands',
    width: 35,
    height: 20,
    background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
    music: 'desert_theme',
    enemies: ['scorpion', 'bandit'],
    items: ['cactus', 'gem']
  },
  WATER: {
    id: 'water',
    name: 'Crystal Lake',
    description: 'Clear blue waters with hidden depths',
    width: 20,
    height: 15,
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    music: 'water_theme',
    enemies: ['fish', 'merfolk'],
    items: ['pearl', 'seaweed']
  },
  CAVE: {
    id: 'cave',
    name: 'Dark Cave',
    description: 'Mysterious cave system with ancient secrets',
    width: 40,
    height: 30,
    background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
    music: 'cave_theme',
    enemies: ['bat', 'spider'],
    items: ['crystal', 'ore']
  }
};

export class AreaType {
  public id: string;
  public name: string;
  public description: string;
  public width: number;
  public height: number;
  public background: string;
  public music: string;
  public items: string[];

  constructor({ id, name, description, width, height, background, music, items }: any) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.width = width;
    this.height = height;
    this.background = background;
    this.music = music;
    this.items = items;
  }
}

export default class Area {
  public id: string;
  public type: AreaType;
  public tiles: any[][];
  public visited: boolean;
  public discovered: boolean;
  public entities: Set<number>;

  constructor(id: string, type: AreaType, tiles: any[][]) {
    this.id = id;
    this.type = type;
    this.tiles = tiles; // 2D array of TileType
    this.visited = false;
    this.discovered = false;
    this.entities = new Set();
  }

  getTile(x: number, y: number): Tile | null {
    if (
      x < 0 ||
      y < 0 ||
      y >= this.tiles.length ||
      x >= this.tiles[0].length
    ) {
      return null;
    }
    return this.tiles[y][x];
  }

  getTileFor(posOrEntity: { x: number; y: number } | { position: { x: number; y: number } }): Tile | null {
    const pos = 'position' in posOrEntity ? posOrEntity.position : posOrEntity;
    return this.getTile(pos.x, pos.y);
  }

  isWalkable(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    if (!tile) return false;
    return tile.type.walkable;
  }

  getBlocker(x: number, y: number, game?: import('./Game').default): string | null {
    const tile = this.getTile(x, y);
    if (!tile) return 'the void';
    
    // Check if tile type is walkable
    if (!tile.type.walkable) return tile.type.description;
    
    // Check if there are any entities blocking the tile (only if game is provided)
    if (game && tile.entities.length > 0) {
      // Get the first entity (we could enhance this to return multiple blockers)
      const entityId = tile.entities[0];
      const entity = game.getEntity(entityId);
      if (entity) {
        return entity.klass.toLowerCase(); // Return entity type as blocker
      }
      return 'something'; // Fallback if entity not found
    }
    
    return null; // No blocker
  }

  getWidth(): number {
    return this.tiles[0]?.length || 0;
  }

  getHeight(): number {
    return this.tiles.length;
  }

  get width(): number {
    return this.type.width;
  }

  get height(): number {
    return this.type.height;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type.id,
      tiles: this.tiles.map(row => row.map(tile => tile.toJSON())),
      visited: this.visited,
      discovered: this.discovered,
      entities: Array.from(this.entities)
    };
  }

  static fromJSON(obj: any): Area {
    // Find the type from AREA_TYPES by id
    const type = Object.values(AREA_TYPES).find(t => t.id === obj.type);
    if (!type) throw new Error(`Unknown area type: ${obj.type}`);
    const tiles = obj.tiles.map((row: any[]) => row.map((tileObj: any) => Tile.fromJSON(tileObj)));
    const area = new Area(obj.id, type, tiles);
    area.visited = obj.visited;
    area.discovered = obj.discovered;
    area.entities = new Set(obj.entities || []);
    return area;
  }

  advanceTime(game: import('./Game').default): void {
    for (const entityId of this.entities) {
      const entity = game.getEntity(entityId);
      if (!entity) continue;
      if (entity.isPlayer()) continue;
      const step = game.time - entity.time;
      if (step > 0) {
        game.activeEntityID = entityId;
        entity.doAction(game);
        game.activeEntityID = 0;
      }
    }
  }
} 