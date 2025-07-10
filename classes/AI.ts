// AI.ts

import type Game from './Game';
import Mob from './Mob';

// Pure data type for AI state
export type AIState = {
  type: string;
  // Add more AI types and properties as needed
};

// Main AI action dispatcher
export function doMobAction(game: Game, mob: Mob): number {
  if (mob.aiState.type === 'Wandering') {
    // Default wandering logic (same as previous random move)
    const areaId = mob.position.areaId;
    if (!areaId) return 0;
    const area = game.world.getArea(areaId);
    const { x, y } = mob.position;
    const dx = Math.floor(Math.random() * 3) - 1;
    const dy = Math.floor(Math.random() * 3) - 1;
    if (dx === 0 && dy === 0) return 0;
    const newX = x + dx;
    const newY = y + dy;
    const tile = area.getTile(newX, newY);
    if (!tile || !tile.isWalkable()) return 0;
    game.addEntity(mob, { areaId, x: newX, y: newY });
    return 100;
  }
  // Add more AI types here
  return 0;
} 