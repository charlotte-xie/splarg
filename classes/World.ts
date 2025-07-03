import { TILE_TYPES } from './Tile';
import Area, { AREA_TYPES } from './Area';

export default class World {
  constructor() {
    this.gameMap = {
      areas: {},
      currentAreaId: 'grasslands',
      playerAreaId: 'grasslands',
    };
    this.initializeAreas();
  }

  initializeAreas() {
    this.createArea('grasslands', AREA_TYPES.GRASSLANDS);
    this.createArea('forest', AREA_TYPES.FOREST);
    this.createArea('desert', AREA_TYPES.DESERT);
    this.createArea('water', AREA_TYPES.WATER);
    this.createArea('cave', AREA_TYPES.CAVE);
    // Only grasslands is discovered/visited at start
    this.gameMap.areas['grasslands'].visited = true;
    this.gameMap.areas['grasslands'].discovered = true;
  }

  createArea(areaId, areaType) {
    const tiles = this.generateAreaTiles(areaType);
    this.gameMap.areas[areaId] = new Area(areaId, areaType, tiles);
  }

  generateAreaTiles(areaType) {
    const tiles = [];
    const { width, height } = areaType;
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        tiles[y][x] = this.getTileForArea(areaType, x, y, width, height);
      }
    }
    return tiles;
  }

  getTileForArea(areaType, x, y, width, height) {
    if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
      return TILE_TYPES.STONE;
    }
    switch (areaType.id) {
      case 'grasslands':
        return this.generateGrasslandsTile(x, y);
      case 'forest':
        return this.generateForestTile(x, y);
      case 'desert':
        return this.generateDesertTile(x, y);
      case 'water':
        return this.generateWaterTile(x, y);
      case 'cave':
        return this.generateCaveTile(x, y);
      default:
        return TILE_TYPES.GRASS;
    }
  }

  generateGrasslandsTile(x, y) {
    if (x > 5 && x < 20 && y > 5 && y < 15) {
      return TILE_TYPES.WATER;
    } else if (x > 15 && x < 23 && y > 2 && y < 8) {
      return TILE_TYPES.FOREST;
    } else if (x > 2 && x < 8 && y > 12 && y < 18) {
      return TILE_TYPES.SAND;
    }
    return TILE_TYPES.GRASS;
  }

  generateForestTile(x, y) {
    if (Math.random() < 0.8) {
      return TILE_TYPES.FOREST;
    }
    return TILE_TYPES.GRASS;
  }

  generateDesertTile(x, y) {
    if (Math.random() < 0.9) {
      return TILE_TYPES.SAND;
    }
    return TILE_TYPES.STONE;
  }

  generateWaterTile(x, y) {
    if (Math.random() < 0.7) {
      return TILE_TYPES.WATER;
    }
    return TILE_TYPES.SAND;
  }

  generateCaveTile(x, y) {
    if (Math.random() < 0.8) {
      return TILE_TYPES.STONE;
    }
    return TILE_TYPES.GRASS;
  }

  getCurrentArea() {
    return this.gameMap.areas[this.gameMap.currentAreaId];
  }

  getPlayerArea() {
    return this.gameMap.areas[this.gameMap.playerAreaId];
  }

  changeArea(areaId) {
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

  getTileAt(x, y) {
    const currentArea = this.getCurrentArea();
    return currentArea.getTile(x, y);
  }

  isPositionWalkable(x, y) {
    const currentArea = this.getCurrentArea();
    return currentArea.isWalkable(x, y);
  }

  getAvailableAreas() {
    return Object.values(this.gameMap.areas)
      .filter(area => area.discovered)
      .map(area => area.id);
  }

  ensurePlayerOnWalkableTile(playerPosition) {
    const currentArea = this.getCurrentArea();
    if (!currentArea) return playerPosition;
    const currentTile = currentArea.getTile(playerPosition.x, playerPosition.y);
    if (currentTile && currentTile.walkable) {
      return playerPosition;
    }
    for (let y = 1; y < currentArea.height - 1; y++) {
      for (let x = 1; x < currentArea.width - 1; x++) {
        const tile = currentArea.getTile(x, y);
        if (tile && tile.walkable) {
          return { x, y };
        }
      }
    }
    return playerPosition;
  }
} 