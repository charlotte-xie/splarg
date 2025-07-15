import Area, { AREA_TYPES, AreaID } from './Area';
import type Game from './Game';
import Mob from './Mob';
import { Gender, generateFullName } from './Names';
import NPC from './NPC';
import { Race } from './Races';
import Tile from './Tile';
import { TILE_TYPES, TileType } from './TileType';

export type Position = { x: number; y: number; areaId?: AreaID };
export type Direction = [dx: number, dy: number];
export type Coord = [x: number, y: number];

export default class World {
  public areas: Map<string, Area>;

  constructor() {
    this.areas = new Map();
  }

  initializeAreas(game: Game, mode?: string): void {
    if (mode === 'test') {
      // Test mode: single 13x13 area with player at 7,7
      this.createTestArea(game);
      game.addEntity(game.player, { areaId: 'test', x: 7, y: 7 });
      const testArea = this.areas.get('test');
    } else {
      // Normal mode: create all areas
      this.createArea('grasslands', AREA_TYPES.GRASSLANDS, game);
      game.addEntity(game.player, { areaId: 'grasslands', x: 3, y: 3 });
      
      // Add an NPC to the grasslands area
      this.addNPCToGrasslands(game);
      
      this.createArea('forest', AREA_TYPES.FOREST, game);
      this.createArea('desert', AREA_TYPES.DESERT, game);
      this.createArea('water', AREA_TYPES.WATER, game);
      this.createArea('cave', AREA_TYPES.CAVE, game);
      // Only grasslands is discovered/visited at start
      const grasslandsArea = this.areas.get('grasslands');
    }
  }

  addNPCToGrasslands(game: Game): void {
    const grasslandsArea = this.areas.get('grasslands');
    if (!grasslandsArea) return;

    // Generate a name for the NPC
    const npcName = generateFullName(Race.HUMAN, Gender.MALE, 'citizen');
    const npc = new NPC({ name: npcName, race: Race.HUMAN, gender: Gender.MALE });

    // Find a suitable position for the NPC (away from player)
    let placed = false;
    for (let tries = 0; tries < 100 && !placed; tries++) {
      const x = 1 + Math.floor(Math.random() * (grasslandsArea.type.width - 2));
      const y = 1 + Math.floor(Math.random() * (grasslandsArea.type.height - 2));
      
      // Make sure NPC is not too close to player (at least 3 tiles away)
      const playerDistance = Math.max(
        Math.abs(x - game.player.position.x),
        Math.abs(y - game.player.position.y)
      );
      
      if (playerDistance >= 3) {
        const blocker = grasslandsArea.getBlocker(x, y, game);
        if (!blocker) {
          game.addEntity(npc, { areaId: 'grasslands', x, y });
          placed = true;
        }
      }
    }
  }

  createArea(areaId: string, areaType: any, game: Game): void {
    const tiles = this.generateAreaTiles(areaType);
    const area = new Area(areaId, areaType, tiles);
    this.areas.set(areaId, area);
    // Add a Mob to a random walkable tile
    let placed = false;
    for (let tries = 0; tries < 100 && !placed; tries++) {
      const x = 1 + Math.floor(Math.random() * (area.type.width - 2));
      const y = 1 + Math.floor(Math.random() * (area.type.height - 2));
      const blocker = area.getBlocker(x, y, game);
      if (!blocker) {
        const mob = new Mob();
        game.addEntity(mob, { areaId, x, y });
        placed = true;
      }
    }
  }

  createTestArea(game: Game): void {
    const testAreaType = {
      id: 'test',
      name: 'Test Area',
      description: 'A simple test area for development',
      width: 13,
      height: 13,
      background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
      music: 'test_theme',
      items: []
    };
    
    const tiles = this.generateTestAreaTiles(testAreaType);
    const area = new Area('test', testAreaType, tiles);
    this.areas.set('test', area);
  }

  generateAreaTiles(areaType: any): Tile[][] {
    const tiles: Tile[][] = [];
    const { width, height } = areaType;
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        tiles[y][x] = this.getTileForArea(areaType, x, y, width, height);
      }
    }
    return tiles;
  }

  generateTestAreaTiles(areaType: any): Tile[][] {
    const tiles: Tile[][] = [];
    const { width, height } = areaType;
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        tiles[y][x] = this.getTestTile(x, y, width, height);
      }
    }
    return tiles;
  }

  getTileForArea(areaType: any, x: number, y: number, width: number, height: number): Tile {
    let tileType;
    if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
      tileType = TILE_TYPES.stone;
    } else {
      switch (areaType.id) {
        case 'grasslands':
          tileType = this.generateGrasslandsTile(x, y);
          break;
        case 'forest':
          tileType = this.generateForestTile(x, y);
          break;
        case 'desert':
          tileType = this.generateDesertTile(x, y);
          break;
        case 'water':
          tileType = this.generateWaterTile(x, y);
          break;
        case 'cave':
          tileType = this.generateCaveTile(x, y);
          break;
        default:
          tileType = TILE_TYPES.grass;
      }
    }
    return new Tile(tileType);
  }

  getTestTile(x: number, y: number, width: number, height: number): Tile {
    let tileType;
    if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
      tileType = TILE_TYPES.stone; // Border walls
    } else {
      tileType = TILE_TYPES.grass; // Simple grass floor
    }
    return new Tile(tileType);
  }

  generateGrasslandsTile(x: number, y: number): TileType {
    if (x > 5 && x < 20 && y > 5 && y < 15) {
      return TILE_TYPES.water;
    } else if (x > 15 && x < 23 && y > 2 && y < 8) {
      return TILE_TYPES.forest;
    } else if (x > 2 && x < 8 && y > 12 && y < 18) {
      return TILE_TYPES.sand;
    }
    return TILE_TYPES.grass;
  }

  generateForestTile(x: number, y: number): TileType {
    if (Math.random() < 0.8) {
      return TILE_TYPES.forest;
    }
    return TILE_TYPES.grass;
  }

  generateDesertTile(x: number, y: number): TileType {
    if (Math.random() < 0.9) {
      return TILE_TYPES.sand;
    }
    return TILE_TYPES.stone;
  }

  generateWaterTile(x: number, y: number): TileType {
    if (Math.random() < 0.7) {
      return TILE_TYPES.water;
    }
    return TILE_TYPES.sand;
  }

  generateCaveTile(x: number, y: number): TileType {
    if (Math.random() < 0.8) {
      return TILE_TYPES.stone;
    }
    return TILE_TYPES.grass;
  }

  getArea(areaId: AreaID): Area {
    const area = this.areas.get(areaId);
    if (!area) {
      throw new Error(`Area ${areaId} does not exist`);
    }
    return area;
  }

  getAvailableAreas(): string[] {
    return Array.from(this.areas.values())
      .filter((area: any) => area.discovered)
      .map((area: any) => area.id);
  }

  ensurePlayerOnWalkableTile(playerPosition: Position): Position {
    if (!playerPosition.areaId) return playerPosition;
    const currentArea = this.getArea(playerPosition.areaId);
    if (currentArea.isWalkable(playerPosition.x, playerPosition.y)) {
      return playerPosition;
    }
    for (let y = 1; y < currentArea.type.height - 1; y++) {
      for (let x = 1; x < currentArea.type.width - 1; x++) {
        if (currentArea.isWalkable(x, y)) {
          return { areaId: currentArea.id, x, y };
        }
      }
    }
    return playerPosition;
  }

  toJSON() {
    return {
      areas: Object.fromEntries(Array.from(this.areas.entries()).map(([id, area]) => [id, area.toJSON()]))
    };
  }

  static fromJSON(obj: any): World {
    const world = new World();
    world.areas = new Map(Object.entries(obj.areas).map(([id, areaObj]) => [id, Area.fromJSON(areaObj)]));
    return world;
  }
}