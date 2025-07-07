import Area, { AREA_TYPES } from './Area';
import Tile from './Tile';
import { TILE_TYPES, TileType } from './TileType';

interface GameMap {
  areas: { [key: string]: Area };
  currentAreaId: string;
  playerAreaId: string;
}

export default class World {
  public gameMap: GameMap;

  constructor() {
    this.gameMap = {
      areas: {},
      currentAreaId: 'grasslands',
      playerAreaId: 'grasslands',
    };
    this.initializeAreas();
  }

  initializeAreas(): void {
    this.createArea('grasslands', AREA_TYPES.GRASSLANDS);
    this.createArea('forest', AREA_TYPES.FOREST);
    this.createArea('desert', AREA_TYPES.DESERT);
    this.createArea('water', AREA_TYPES.WATER);
    this.createArea('cave', AREA_TYPES.CAVE);
    // Only grasslands is discovered/visited at start
    this.gameMap.areas['grasslands'].visited = true;
    this.gameMap.areas['grasslands'].discovered = true;
  }

  createArea(areaId: string, areaType: any): void {
    const tiles = this.generateAreaTiles(areaType);
    this.gameMap.areas[areaId] = new Area(areaId, areaType, tiles);
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

  getCurrentArea(): Area {
    return this.gameMap.areas[this.gameMap.currentAreaId];
  }

  getPlayerArea(): Area {
    return this.gameMap.areas[this.gameMap.playerAreaId];
  }

  changeArea(areaId: string): { from: string; to: string } {
    if (!this.gameMap.areas[areaId]) {
      throw new Error(`Area ${areaId} does not exist`);
    }
    const oldAreaId = this.gameMap.currentAreaId;
    this.gameMap.currentAreaId = areaId;
    this.gameMap.playerAreaId = areaId;
    this.gameMap.areas[areaId].discovered = true;
    this.gameMap.areas[areaId].visited = true;
    return { from: oldAreaId, to: areaId };
  }

  getTileAt(x: number, y: number): any {
    const currentArea = this.getCurrentArea();
    return currentArea.getTile(x, y);
  }

  isPositionWalkable(x: number, y: number): boolean {
    const currentArea = this.getCurrentArea();
    return currentArea.isWalkable(x, y);
  }

  getAvailableAreas(): string[] {
    return Object.values(this.gameMap.areas)
      .filter((area: any) => area.discovered)
      .map((area: any) => area.id);
  }

  ensurePlayerOnWalkableTile(playerPosition: { x: number; y: number }): { x: number; y: number } {
    const currentArea = this.getCurrentArea();
    if (!currentArea) return playerPosition;
    const currentTile = currentArea.getTile(playerPosition.x, playerPosition.y);
    if (currentTile && currentTile.isWalkable()) {
      return playerPosition;
    }
    for (let y = 1; y < currentArea.height - 1; y++) {
      for (let x = 1; x < currentArea.width - 1; x++) {
        const tile = currentArea.getTile(x, y);
        if (tile && tile.isWalkable()) {
          return { x, y };
        }
      }
    }
    return playerPosition;
  }

  toJSON() {
    return {
      gameMap: {
        areas: Object.fromEntries(Object.entries(this.gameMap.areas).map(([id, area]) => [id, area.toJSON()])),
        currentAreaId: this.gameMap.currentAreaId,
        playerAreaId: this.gameMap.playerAreaId
      }
    };
  }

  static fromJSON(obj: any): World {
    const world = new World();
    world.gameMap.areas = Object.fromEntries(
      Object.entries(obj.gameMap.areas).map(([id, areaObj]) => [id, Area.fromJSON(areaObj)])
    );
    world.gameMap.currentAreaId = obj.gameMap.currentAreaId;
    world.gameMap.playerAreaId = obj.gameMap.playerAreaId;
    return world;
  }
} 