// AI.ts

import type Game from './Game';
import Mob from './Mob';

// Pure data type for AI state
export type AIState = {
  type: string;
  // Add more AI types and properties as needed
};

export function doMobAction(game: Game, mob: Mob): number {
  switch (mob.aiState.type) {
    case 'Wandering':
      return wanderingAction(game, mob);
    case 'AttackPlayer':
      return attackPlayerAction(game, mob);
    default:
      return 0;
  }
} 

// Wandering AI logic
function wanderingAction(game: Game, mob: Mob): number {
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

// AttackPlayer AI logic (placeholder)
function attackPlayerAction(game: Game, mob: Mob): number {
  // TODO: Implement logic to move toward or attack the player
  // For now, just wait
  return 0;
}
