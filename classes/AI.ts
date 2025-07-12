// AI.ts

import type Game from './Game';
import Mob from './Mob';
import { registerScript, runEntityScript } from './Script';

// Pure data type for AI state
export type AIState = {
  type: string;
  script?: any[]; // Array of script arguments for runEntityScript
  // Add more AI types and properties as needed
};

// Wandering movement logic
function wanderAction(g: Game, entity: any): number {
  const areaId = entity.position.areaId;
  if (!areaId) return 0;
  
  const area = g.world.getArea(areaId);
  const { x, y } = entity.position;
  const dx = Math.floor(Math.random() * 3) - 1;
  const dy = Math.floor(Math.random() * 3) - 1;
  
  if (dx === 0 && dy === 0) return 0;
  
  const newX = x + dx;
  const newY = y + dy;
  const tile = area.getTile(newX, newY);
  
  if (!tile || !tile.isWalkable()) return 0;
  
  g.addEntity(entity, { areaId, x: newX, y: newY });
  return 100;
}

// AI-move script that handles different AI movement actions
function aiMoveScript(g: Game, ...args: any[]) {
  if (args.length < 2) {
    throw new Error('ai-move requires entity ID and action type');
  }
  
  const entityId = args[0];
  const actionType = args[1];
  
  if (typeof entityId !== 'number') {
    throw new Error('ai-move first arg must be entity ID (number)');
  }
  
  const entity = g.getEntity(entityId);
  if (!entity) {
    throw new Error(`Entity with ID ${entityId} not found`);
  }
  
  if (actionType === 'wander') {
    return wanderAction(g, entity);
  }
  
  throw new Error(`Unknown ai-move action type: ${actionType}`);
}

// Register AI scripts
registerScript('ai-move', aiMoveScript);

export function doMobAction(game: Game, mob: Mob): number {
  // If AIState has a script, run it
  if (mob.ai.script) {
    return runEntityScript(game, mob, mob.ai.script) || 0;
  }
  
  // Fallback to old switch-based logic
  switch (mob.ai.type) {
    case 'Wandering':
      return wanderingAction(game, mob);
    case 'AttackPlayer':
      return attackPlayerAction(game, mob);
    default:
      return 0;
  }
} 

// Wandering AI logic (legacy)
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
