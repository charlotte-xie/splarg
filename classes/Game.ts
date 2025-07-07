import Area from './Area';
import Entity from './Entity';
import Item from './Item';
import Player from './Player';
import Tile from './Tile';
import type { Position } from './World';
import World from './World';

interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: string;
  autoSave: boolean;
}

interface GameProgress {
  totalPlayTime: number;
  areasDiscovered: number;
  enemiesDefeated: number;
  itemsCollected: number;
  questsCompleted: number;
}

type GameStatus = 'ready' | 'playing' | 'gameOver' | 'menu';

type GameEvent = {
  type: string;
  timestamp: number;
  data?: any;
};

type GameEventCallback = (event: GameEvent) => void;

type GameMessage = {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  repeat: number;
};

/**
 * Game model class
 *
 * Properties:
 * - status: 'ready' | 'playing' | 'gameOver' | 'menu'
 * - player: Player instance
 * - world: World instance
 * - settings: { soundEnabled, musicEnabled, difficulty, autoSave }
 * - progress: { totalPlayTime, areasDiscovered, enemiesDefeated, itemsCollected, questsCompleted }
 * - score: number
 * - time: number
 * - lastSaveTime: number
 *
 * Methods: startGame, resetGame, saveGame, loadGame, movePlayer, changeArea, updatePlayerStats, addScore, triggerEvent, etc.
 */
export default class Game {
  public status: GameStatus;
  public player: Player;
  public world: World;
  public settings: GameSettings;
  public progress: GameProgress;
  public score: number;
  public time: number;
  public lastSaveTime: number | null;
  public events: GameEvent[];
  public listeners: Map<string, GameEventCallback[]>;
  public messages: GameMessage[];
  public entities: Map<number, Entity>;
  public entityIdCounter: number;

  constructor() {
    this.status = 'ready';
    this.player = new Player();
    this.world = new World();
    this.settings = {
      soundEnabled: true,
      musicEnabled: true,
      difficulty: 'normal',
      autoSave: true
    };
    this.progress = {
      totalPlayTime: 0,
      areasDiscovered: 1,
      enemiesDefeated: 0,
      itemsCollected: 0,
      questsCompleted: 0
    };
    this.score = 0;
    this.time = 0;
    this.lastSaveTime = null;
    this.entities = new Map();
    this.entityIdCounter = 1;
    // Ensure player starts on a walkable tile
    this.player.position = this.world.ensurePlayerOnWalkableTile(this.player.position);
    // Add player to entities map with ID 0
    this.entities.set(0, this.player);
    this.events = [];
    this.listeners = new Map();
    this.messages = [];
  }

  initialise(): Game {
    this.updatePlayer( new Player());
    this.time=0;
    this.addPlayerDefaults(this.player);
    this.setupEventListeners();
    return this
  }

  setupEventListeners(): void {
    this.addEventListener('playerMoved', (event) => {
      this.addScore(1);
    });
    this.addEventListener('areaChanged', (event) => {
      this.addScore(100);
    });
    this.addEventListener('gameStarted', (event) => {
      console.log('Game started!');
    });
    this.addEventListener('gameSaved', (event) => {
      console.log('Game saved successfully');
    });
  }

  // Game State Management
  getState(): any {
    // Return a snapshot of the game state for React or serialization
    return JSON.parse(JSON.stringify({
      status: this.status,
      player: this.player,
      gameMap: this.world.gameMap,
      settings: this.settings,
      progress: this.progress,
      score: this.score,
      time: this.time,
      lastSaveTime: this.lastSaveTime
    }));
  }

  getPlayer(): Player {
    return this.player;
  }

  getCurrentArea(): Area {
    return this.world.getCurrentArea();
  }

  getPlayerArea(): Area {
    return this.world.getPlayerArea();
  }

  startGame(): void {
    this.status = 'playing';
    this.triggerEvent({ type: 'gameStarted', timestamp: this.time });
  }

  resetGame(): void {
    this.status = 'ready';
    this.player = new Player();
    this.score = 0;
    this.progress = {
      totalPlayTime: 0,
      areasDiscovered: 1,
      enemiesDefeated: 0,
      itemsCollected: 0,
      questsCompleted: 0
    };
    this.time = 0;
    this.world = new World();
    this.player.position = this.world.ensurePlayerOnWalkableTile(this.player.position);
    this.addPlayerDefaults(this.player);
    this.triggerEvent({ type: 'gameReset', timestamp: this.time });
  }

  movePlayer(dx: number, dy: number): boolean {
    if (this.status !== 'playing') {
      return false;
    }
    const currentArea = this.world.getCurrentArea();
    const newX = this.player.position.x + dx;
    const newY = this.player.position.y + dy;
    if (newX < 0 || newX >= currentArea.type.width || newY < 0 || newY >= currentArea.type.height) {
      // TODO: move to new area
      return false;
    }
    const targetTile = currentArea.getTile(newX, newY);
    if (!targetTile || !targetTile.isWalkable()) {
      this.addMessage("Blocked by " +(targetTile?targetTile.getDescription():"the void"))
      return false;
    }
    this.addEntity(this.player, {areaId: currentArea.id, x:newX,y:newY});
    currentArea.visited = true;
    this.triggerEvent({ 
      type: 'playerMoved', 
      timestamp: this.time,
      data: { x: newX, y: newY, dx, dy }
    });
    return true;
  }

  changeArea(areaId: string): boolean {
    try {
      const { from, to } = this.world.changeArea(areaId);
      this.triggerEvent({ 
        type: 'areaChanged', 
        timestamp: this.time,
        data: { from, to }
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  updatePlayer(player: Player): void {
    this.player = player;
    // Ensure player is always in entities map with ID 0
    this.entities.set(0, player);
    this.triggerEvent({ 
      type: 'playerUpdated', 
      timestamp: this.time,
      data: { player }
    });
  }

  addScore(points: number): void {
    this.score += points;
    this.triggerEvent({ 
      type: 'scoreAdded', 
      timestamp: this.time,
      data: { points, totalScore: this.score }
    });
  }

  // Event System
  triggerEvent(event: GameEvent): void {
    this.events.push(event);
    if (this.listeners.has(event.type)) {
      const callbacks = this.listeners.get(event.type)!;
      callbacks.forEach(callback => callback(event));
    }
  }

  addEventListener(eventType: string, callback: GameEventCallback): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  removeEventListener(eventType: string, callback: GameEventCallback): void {
    if (this.listeners.has(eventType)) {
      const callbacks = this.listeners.get(eventType)!;
      this.listeners.set(eventType, callbacks.filter(cb => cb !== callback));
    }
  }

  // Save/Load System
  toJSON() {
    return {
      status: this.status,
      player: this.player.toJSON(),
      world: this.world.toJSON(),
      settings: this.settings,
      progress: this.progress,
      score: this.score,
      time: this.time,
      lastSaveTime: this.lastSaveTime,
      messages: this.messages
    };
  }

  static fromJSON(obj: any): Game {
    const game = new Game();
    game.status = obj.status;
    game.player = Player.fromJSON(obj.player);
    game.world = World.fromJSON(obj.world);
    game.settings = obj.settings;
    game.progress = obj.progress;
    game.score = obj.score;
    game.time = obj.time;
    game.lastSaveTime = obj.lastSaveTime;
    game.messages = obj.messages || [];
    return game;
  }

  saveGame(): void {
    try {
      this.lastSaveTime = Date.now();
      const saveData = JSON.stringify(this.toJSON());
      localStorage.setItem('splarg_save', saveData);
      this.triggerEvent({ type: 'gameSaved', timestamp: Date.now() });
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  }

  static loadGame(): Game {
      const saveData = localStorage.getItem('splarg_save');
      if (!saveData) throw new Error("No save data found");
      const parsed = JSON.parse(saveData);
      const loaded = Game.fromJSON(parsed);
      loaded.triggerEvent({ type: 'gameLoaded', timestamp: Date.now() });
      return loaded;
  }

  // Utility Methods
  getTileAt(x: number, y: number): any {
    return this.world.getTileAt(x, y);
  }

  isPositionWalkable(x: number, y: number): boolean {
    return this.world.isPositionWalkable(x, y);
  }

  getAvailableAreas(): any[] {
    return this.world.getAvailableAreas();
  }

  // Message System
  addMessage(text: string, type: 'info' | 'warning' | 'error' | 'success' = 'info'): void {
    const last = this.messages[this.messages.length - 1];
    if (last && last.text === text && last.type === type) {
      last.repeat = (last.repeat || 1) + 1;
      last.timestamp = this.time;
      return;
    }
    const message: GameMessage = {
      id: this.time.toString() + Math.random().toString(36).substr(2, 9),
      text,
      type,
      timestamp: this.time,
      repeat: 1
    };
    this.messages.push(message);
    if (this.messages.length > 20) {
      this.messages = this.messages.slice(-20);
    }
  }

  removeMessage(messageId: string): void {
    this.messages = this.messages.filter(msg => msg.id !== messageId);
  }

  clearMessages(): void {
    this.messages = [];
  }

  getMessages(): GameMessage[] {
    return [...this.messages];
  }

  // Cleanup
  destroy(): void {
    this.listeners.clear();
    this.events = [];
  }

  addPlayerDefaults(player: Player): void {
    // Add example items
    const { createExampleItems } = require('./Item');
    const { ITEM_TYPES } = require('./ItemType');
    createExampleItems().forEach((item: any) => player.addItem(item));
    // Add default outfit items
    const defaultOutfitItems = [
      new Item(ITEM_TYPES.leatherCorset, 1),
      new Item(ITEM_TYPES.longSkirt, 1),
      new Item(ITEM_TYPES.bra, 1),
      new Item(ITEM_TYPES.plainPanties, 1),
      new Item(ITEM_TYPES.socks, 1),
      new Item(ITEM_TYPES.boots, 1)
    ];
    defaultOutfitItems.forEach(item => {
      player.wearItem(item);
    });
    // Save the current outfit as 'Everyday'
    player.saveOutfit('Everyday');
  }

  getPlayerTile(): Tile | null {
    const area = this.getPlayerArea();
    const pos = this.player.position;
    return area.getTile(pos.x, pos.y);
  }

  dropItem(player: Player, item: Item, number?: number): boolean {
    const inv = player.getInventory();
    const idx = inv.indexOf(item);
    if (idx === -1) {
      this.addMessage('Failed to drop item', 'error');
      return false;
    }
    if (number && item.getQuantity() > number) {
      // Drop only part of the stack
      const singleItem = new Item(item.type, number, item.props);
      item.setQuantity(item.getQuantity() - number);
      const tile = this.getPlayerTile();
      if (tile) {
        tile.addItem(singleItem);
        this.addMessage(`Dropped ${number} ${item.getName()}`, 'success');
        return true;
      }
      this.addMessage('Failed to drop item', 'error');
      return false;
    } else {
      // Drop the whole stack
      player.removeItem(item);
      const tile = this.getPlayerTile();
      if (tile) {
        tile.addItem(item);
        this.addMessage(`Dropped ${item.getName()}`, 'success');
        return true;
      }
      this.addMessage('Failed to drop item', 'error');
      return false;
    }
  }

  wearItem(player: Player, item: Item): boolean {
    try {
      if (player.wearItem(item)) {
        player.removeItem(item);
        this.addMessage(`Wore ${item.getName()}`, 'success');
        return true;
      } else {
        this.addMessage(`Cannot wear ${item.getName()}`, 'error');
        return false;
      }
    } catch (e: any) {
      this.addMessage(`Cannot wear ${item.getName()}: ${e.message}`, 'error');
      return false;
    }
  }

  useItem(player: Player, item: Item): void {
    const result = item.type.use(this, player, item);
    if (result && result.message) {
      this.addMessage(result.message, result.type);
    }
  }

  timeLapse(amount: number) {
    this.time += amount;
  }

  addEntity(entity: Entity, position?: Position): number {
    const entityId = entity.getId();
    this.removeEntity(entityId); /* remove first if already there */
    if (position) {
      entity.setPosition(position);
    }
    this.entities.set(entityId, entity);
    return entityId;
  }

  /* Remove entity from game. Will be in detached state. Returns true if Entity actually removed */
  removeEntity(entityID: Entity | number): boolean {
    const entity : Entity | null = entityID instanceof Entity ? entityID : (this.entities.get(entityID) || null); 
    if (entity) {
      return this.entities.delete(entity.getId());
    }
    return false;
  }

  getEntity(idOrEntity: number | Entity): Entity | null {
    if (typeof idOrEntity === 'number') {
      return this.entities.get(idOrEntity) || null;
    } else {
      return this.entities.get(idOrEntity.getId()) || null;
    }
  }
} 