import Player from './Player';
import World from './World';

export default class Game {
  constructor() {
    this.state = {
      status: 'ready',
      player: new Player(),
      settings: {
        soundEnabled: true,
        musicEnabled: true,
        difficulty: 'normal',
        autoSave: true
      },
      progress: {
        totalPlayTime: 0,
        areasDiscovered: 1,
        enemiesDefeated: 0,
        itemsCollected: 0,
        questsCompleted: 0
      },
      score: 0,
      currentTime: Date.now(),
      lastSaveTime: Date.now(),
      lastUpdate: 0
    };
    this.world = new World();
    // Ensure player starts on a walkable tile
    this.state.player.position = this.world.ensurePlayerOnWalkableTile(this.state.player.position);
    this.events = [];
    this.listeners = new Map();
    this.initializeGame();
  }

  initializeGame() {
    this.setupEventListeners();
    this.startGameLoop();
  }

  setupEventListeners() {
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
  getState() {
    // Include world state in the returned state
    return JSON.parse(JSON.stringify({ ...this.state, gameMap: this.world.gameMap }));
  }

  getPlayer() {
    return { ...this.state.player };
  }

  getCurrentArea() {
    return this.world.getCurrentArea();
  }

  getPlayerArea() {
    return this.world.getPlayerArea();
  }

  startGame() {
    this.state.status = 'playing';
    this.state.currentTime = Date.now();
    this.triggerEvent({ type: 'gameStarted', timestamp: Date.now() });
  }

  resetGame() {
    this.state = {
      ...this.state,
      status: 'ready',
      player: new Player(),
      score: 0,
      progress: {
        totalPlayTime: 0,
        areasDiscovered: 1,
        enemiesDefeated: 0,
        itemsCollected: 0,
        questsCompleted: 0
      },
      lastUpdate: 0
    };
    this.world = new World();
    this.state.player.position = this.world.ensurePlayerOnWalkableTile(this.state.player.position);
    this.triggerEvent({ type: 'gameReset', timestamp: Date.now() });
  }

  movePlayer(dx, dy) {
    if (this.state.status !== 'playing') {
      return false;
    }
    const currentArea = this.world.getCurrentArea();
    const newX = this.state.player.position.x + dx;
    const newY = this.state.player.position.y + dy;
    if (newX < 0 || newX >= currentArea.type.width || newY < 0 || newY >= currentArea.type.height) {
      return false;
    }
    const targetTile = this.world.getTileAt(newX, newY);
    if (!targetTile.walkable) {
      return false;
    }
    this.state.player.position.x = newX;
    this.state.player.position.y = newY;
    currentArea.visited = true;
    this.state.lastUpdate = Date.now();
    this.triggerEvent({ 
      type: 'playerMoved', 
      timestamp: Date.now(),
      data: { x: newX, y: newY, dx, dy }
    });
    return true;
  }

  changeArea(areaId) {
    try {
      const { from, to } = this.world.changeArea(areaId);
      this.state.lastUpdate = Date.now();
      this.triggerEvent({ 
        type: 'areaChanged', 
        timestamp: Date.now(),
        data: { from, to }
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  updatePlayerStats(stats) {
    this.state.player.stats = { ...this.state.player.stats, ...stats };
    this.state.lastUpdate = Date.now();
    this.triggerEvent({ 
      type: 'playerStatsUpdated', 
      timestamp: Date.now(),
      data: stats 
    });
  }

  addScore(points) {
    this.state.score += points;
    this.state.lastUpdate = Date.now();
    this.triggerEvent({ 
      type: 'scoreAdded', 
      timestamp: Date.now(),
      data: { points, totalScore: this.state.score }
    });
  }

  // Event System
  triggerEvent(event) {
    this.events.push(event);
    if (this.listeners.has(event.type)) {
      const callbacks = this.listeners.get(event.type);
      callbacks.forEach(callback => callback(event));
    }
  }

  addEventListener(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  removeEventListener(eventType, callback) {
    if (this.listeners.has(eventType)) {
      const callbacks = this.listeners.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Game Loop
  startGameLoop() {
    this.gameLoop = setInterval(() => {
      this.update();
    }, 1000 / 60);
  }

  update() {
    if (this.state.status === 'playing') {
      const now = Date.now();
      this.state.progress.totalPlayTime += now - this.state.currentTime;
      this.state.currentTime = now;
      if (this.state.settings.autoSave && 
          now - this.state.lastSaveTime > 30000) {
        this.saveGame();
      }
    }
  }

  // Save/Load System
  saveGame() {
    try {
      const saveData = {
        state: this.state,
        world: this.world.gameMap,
        timestamp: Date.now()
      };
      localStorage.setItem('splarg_save', JSON.stringify(saveData));
      this.state.lastSaveTime = Date.now();
      this.triggerEvent({ type: 'gameSaved', timestamp: Date.now() });
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  loadGame() {
    try {
      const saveData = localStorage.getItem('splarg_save');
      if (saveData) {
        const parsed = JSON.parse(saveData);
        this.state = parsed.state;
        this.world.gameMap = parsed.world;
        this.triggerEvent({ type: 'gameLoaded', timestamp: Date.now() });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  }

  // Utility Methods
  getTileAt(x, y) {
    return this.world.getTileAt(x, y);
  }

  isPositionWalkable(x, y) {
    return this.world.isPositionWalkable(x, y);
  }

  getAvailableAreas() {
    return this.world.getAvailableAreas();
  }

  // Cleanup
  destroy() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
    this.listeners.clear();
    this.events = [];
  }
} 