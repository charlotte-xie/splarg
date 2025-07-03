import { Player, PlayerStats, PlayerPosition } from './Player';
import { GameMap, Area } from './Area';
import { TileType } from './Tile';

export type GameStatus = 'ready' | 'playing' | 'gameOver' | 'menu';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  autoSave: boolean;
}

export interface GameProgress {
  totalPlayTime: number;
  areasDiscovered: number;
  enemiesDefeated: number;
  itemsCollected: number;
  questsCompleted: number;
}

export interface GameState {
  status: GameStatus;
  player: Player;
  gameMap: GameMap;
  settings: GameSettings;
  progress: GameProgress;
  score: number;
  currentTime: number;
  lastSaveTime: number;
}

export interface GameEvent {
  type: string;
  timestamp: number;
  data?: any;
}

export interface GameActions {
  startGame: () => void;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: () => void;
  movePlayer: (dx: number, dy: number) => void;
  changeArea: (areaId: string) => void;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  addScore: (points: number) => void;
  triggerEvent: (event: GameEvent) => void;
} 