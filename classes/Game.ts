import { Activity, ActivityState } from './Activity';
import Area from './Area';
import Entity, { EntityClass } from './Entity';
import Item from './Item';
import Mob from './Mob';
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
 */
export default class Game {
  public status: GameStatus;
  protected _player: Player;
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
  public activeEntityID: number; // ID of the currently active entity (0 = player)
  public compelled: string | null;
  public activities: Map<number, Activity>;
  public activityCounter: number;

  constructor() {
    this.status = 'ready';
    this._player = new Player();
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
    this.activeEntityID = 0; // Player is initially active
    this.compelled = null;
    
    this.events = [];
    this.listeners = new Map();
    this.messages = [];
    this.activities = new Map();
    this.activityCounter = 0;
  }

  initialise(mode?: string): Game {
    this.status = 'ready';
    this.score = 0;
    this.progress = {
      totalPlayTime: 0,
      areasDiscovered: 1,
      enemiesDefeated: 0,
      itemsCollected: 0,
      questsCompleted: 0
    };
    this.entities.clear();
    this._player=new Player();
    this.addEntity(this._player);
    this.entityIdCounter = 1;
    this.activeEntityID = 0; // Reset to player

    this.time = 0;
    this.world = new World();
    this.world.initializeAreas(this, mode);

    this.addPlayerDefaults(this._player);
    this.setupEventListeners();
    this.triggerEvent({ type: 'gameReset', timestamp: this.time });
    return this;
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

  get player(): Player {
    return this._player;
  }

  getCurrentArea(): Area {
    return this.world.getArea(this._player.getAreaId());
  }

  startGame(): void {
    this.status = 'playing';
    this.triggerEvent({ type: 'gameStarted', timestamp: this.time });
  }


  timeUpdate() : boolean {
    const step=this.player.time-this.time;
    if (step<=0) return false;

    this.doActivityUpdates();

    this.advanceTime(step);

    this.activities.forEach((activity) => {
      activity.doUpdate(this);
    });

    this.checkNewActivities();

    return true;
  } 

  doActivityUpdates(): void {
    this.activities.forEach((activity) => {
      this.getActivity(activity.id)?.doUpdate(this);
    });
  }

  getActivity(id: number): Activity | undefined {
    return this.activities.get(id);
  }

  checkNewActivities(): void {
    const currentArea = this.getCurrentArea();
    const items:Item[]=[];
    for (let dx=-1;dx<=1;dx++) {
      for (let dy=-1;dy<=1;dy++) {
        const tile = currentArea.getTile(this._player.position.x+dx, this._player.position.y+dy);
        if (tile) {
          tile.items.forEach((item) => {
            items.push(item);
          });
        }
      }
    }
    if (items.length>0) {
 
      const activity=new Activity('pickup-items');
      this.addActivity(activity);
    }
  }

  getPlayerActivities(): Activity[] {
    return Array.from(this.activities.values()).filter((activity) => activity.state === ActivityState.ACTIVE);
  }
  
  addActivity(activity: Activity): void {
    activity.id=this.activityCounter++;
    this.activities.set(activity.id, activity);
  }

  removeActivity(id: number): boolean {
    return this.activities.delete(id);
  }

  /**
   * Advance game time by the given amount.
   * @param step - The amount of time to advance.
   */
  advanceTime(step: number): void {
    this.time += step;
    const currentArea = this.getCurrentArea();
    currentArea.advanceTime(this);
  }
  
  doPlayerMove(dx: number, dy: number): boolean {
    if (this.status !== 'playing') {
      return false;
    }
    if (!this._player.position.areaId) {
      throw new Error("Player not in any area?");
    }

    this.player.time+=100;

    const currentArea = this.getCurrentArea();
    const newX = this._player.position.x + dx;
    const newY = this._player.position.y + dy;
    if (newX < 0 || newX >= currentArea.type.width || newY < 0 || newY >= currentArea.type.height) {
      // TODO: move to new area
      return false;
    }
    
    const blocker = currentArea.getBlocker(newX, newY, this);
    if (blocker) {
      // Try to find if this is an entity blocker and use getTheName()
      const tile = currentArea.getTile(newX, newY);
      let blockerMessage = blocker;
      if (tile && tile.entities.length > 0) {
        const entityId = tile.entities[0];
        const entity = this.getEntity(entityId);
        if (entity) {
          blockerMessage = entity.getTheName();
        }
      } else if (tile) {
        // Use tile description for tile blockers to be more descriptive
        blockerMessage = `the ${tile.type.description}`;
      }
      this.addMessage(`Blocked by ${blockerMessage}`);
      return false;
    }
    
    this.addEntity(this._player, {areaId: currentArea.id, x:newX,y:newY});
    currentArea.visited = true;
    this.triggerEvent({ 
      type: 'playerMoved', 
      timestamp: this.time,
      data: { x: newX, y: newY, dx, dy }
    });
    return true;
  }

  updatePlayer(player: Player): void {
    // Ensure player has ID 0
    if (player.id !== 0) {
      throw new Error('Player ID must be 0');
    }
    this._player = player;
    this.addEntity(this._player);
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

  // Save/Load System
  toJSON() {
    return {
      status: this.status,
      player: this._player.toJSON(),
      world: this.world.toJSON(),
      settings: this.settings,
      progress: this.progress,
      score: this.score,
      time: this.time,
      lastSaveTime: this.lastSaveTime,
      messages: this.messages,
      entities: Array.from(this.entities.entries()).map(([id, entity]) => [id, entity.toJSON()]),
      entityIdCounter: this.entityIdCounter,
      activeEntity: this.activeEntityID,
      activities: Array.from(this.activities.entries()).map(([id, activity]) => [id, activity.toJSON()]),
      activityCounter: this.activityCounter
    };
  }

  static fromJSON(obj: any): Game {
    const game = new Game();
    game.status = obj.status;
    game.world = World.fromJSON(obj.world);
    game.settings = obj.settings;
    game.progress = obj.progress;
    game.score = obj.score;
    game.time = obj.time;
    game.lastSaveTime = obj.lastSaveTime;
    game.messages = obj.messages || [];
    game.activeEntityID = obj.activeEntity || 0;
    
    // Load entities map first
    var highestID=0;
    game.entities = new Map();
    if (obj.entities) {
      obj.entities.forEach(([id, entityObj]: [number, any]) => {
        highestID=Math.max(highestID,id);
        const entity = Game.entityFromJSON(entityObj);
        game.entities.set(id, entity);
        if (id==0) {
          game.updatePlayer(entity as Player);
        }
      });
    }
    game.entityIdCounter = highestID+1;
    // Load activities
    game.activities = new Map();
    if (obj.activities) {
      obj.activities.forEach(([id, activityObj]: [number, any]) => {
        game.activities.set(id, Activity.fromJSON(activityObj));
      });
    }
    game.activityCounter = obj.activityCounter || 0;
    return game;
  }

  static entityFromJSON(obj: any): Entity {
    if (obj.klass == EntityClass.PLAYER) {
      return Player.fromJSON(obj) as Player;
    } else if (obj.klass == EntityClass.MOB) {
      return Mob.fromJSON(obj) as Mob;
    } else {
      return Entity.fromJSON(obj) as Entity;
    }
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
      new Item(ITEM_TYPES.socks, 1),
      new Item(ITEM_TYPES.bra, 1),
      new Item(ITEM_TYPES.plainPanties, 1),
      new Item(ITEM_TYPES.leatherCorset, 1),
      new Item(ITEM_TYPES.longSkirt, 1),
      new Item(ITEM_TYPES.boots, 1)
    ];
    defaultOutfitItems.forEach(item => {
      player.wearItem(item);
    });
    // Save the current outfit as 'Everyday'
    player.saveOutfit('Everyday');
  }

  getPlayerTile(): Tile | null {
    const pos = this._player.position;
    return this.getCurrentArea().getTile(pos.x, pos.y);
  }

  dropItem(player: Player, item: Item, number?: number): boolean {
    player.time+=100; // add time to drop item
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
        this.addMessage(`Dropped ${item.getAName()}`, 'success');
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


  /* Add entity to game or moves existing entity to new position. 
  Any entity movement should go through this method to ensure data structures / indexes are correctly updated.
  Returns entity ID */
  addEntity(entity: Entity, position?: Position): number {
    let entityId = entity.id;
    // If entity has no ID or ID is -1, assign a new one
    if (entityId === -1) {
      entityId = this.entityIdCounter++;
      entity.id=entityId;
    } else {
      this.removeEntity(entityId); /* remove first if already there */
    }
    this.entities.set(entityId, entity);
    if (position) {
      entity.setPosition(position);
    }
    // If it is the player, update the Game'player field
    if (entityId == 0) {
      this._player = entity as Player;
    }

    // Add entity to the area's entities list if position has areaId
    if (entity.position.areaId) {
      const area = this.world.areas.get(entity.position.areaId);
      if (area) {
        area.entities.add(entityId);
        // Add to tile's entities array
        const tile = area.getTile(entity.position.x, entity.position.y);
        if (tile) {
          if (!tile.entities.includes(entityId)) {
            tile.entities.push(entityId);
          }
        }
      }
    } 
    
    return entityId;
  }

  /* Remove entity from game. Will be in detached state. Returns true if Entity was already present */
  removeEntity(entityID: Entity | number): boolean {
    const entity : Entity | null = entityID instanceof Entity ? entityID : (this.entities.get(entityID) || null); 
    if (entity) {
      const entityId = entity.id;
      
      // Remove entity from its area
      if (entity.position.areaId) {
        const area = this.world.getArea(entity.position.areaId);
        area.entities.delete(entityId);
        // Remove from tile's entities array
        const tile = area.getTile(entity.position.x, entity.position.y);
        if (tile) {
          const index = tile.entities.indexOf(entityId);
          if (index > -1) {
            tile.entities.splice(index, 1);
          }
        }
      }

      this.entities.delete(entityId);
      
      return true;
    }
    return false;
  }

  getEntity(idOrEntity: number | Entity): Entity | null {
    if (typeof idOrEntity === 'number') {
      return this.entities.get(idOrEntity) || null;
    } else {
      return this.entities.get(idOrEntity.id) || null;
    }
  }

  getActiveEntity(): Entity {

    const entity=this.entities.get(this.activeEntityID);
    if (!entity) {
      throw new Error(`Active entity with ID ${this.activeEntityID} not found`);
    }
    return entity;
  }
} 