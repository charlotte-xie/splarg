// AI.ts

import type Game from './Game';
import Mob from './Mob';
import { registerScript, runScript } from './Script';

// Pure data type for AI state
export type AIState = {
  type: string;
  script?: any[]; // Array of script arguments for runEntityScript
  // Add more AI types and properties as needed
};

// Wandering movement logic
function wanderAction(g: Game, entity: any) {
  const areaId = entity.position.areaId;
  if (!areaId) return 0;
  
  const area = g.world.getArea(areaId);
  const { x, y } = entity.position;
  const dx = Math.floor(Math.random() * 3) - 1;
  const dy = Math.floor(Math.random() * 3) - 1;
  
  if (dx === 0 && dy === 0) return 0;
  
  const newX = x + dx;
  const newY = y + dy;
  
  entity.time+=100;

  const blocker = area.getBlocker(newX, newY, g);
  if (blocker) return; // Blocked, can't move 
  
  g.addEntity(entity, { areaId, x: newX, y: newY });
}

// AI-move script that handles different AI movement actions
function aiMoveScript(g: Game, ...args: any[]) {
  if (args.length < 2) {
    throw new Error('ai-move requires action type is script '+args);
  }
  
  const actionType = args[1];
  
  const entity = g.getEntity(g.activeEntity);
  if (!entity) {
    throw new Error(`Active entity with ID ${g.activeEntity} not found`);
  }
  
  if (actionType === 'wander') {
    wanderAction(g, entity);
    return args;
  }
  
  throw new Error(`Unknown ai-move action type: ${actionType}`);
}

// Register AI scripts
registerScript('ai-move', aiMoveScript);

export function doMobAction(game: Game, mob: Mob) {
  // If AIState has a script, run it
  if (mob.ai.script) {
    // AI script should return an upadtes cript, possibly the same
    mob.ai.script= runScript(game, mob.ai.script);
  } else {
  
    // Fallback to old switch-based logic
    switch (mob.ai.type) {
      case 'Wandering':
        return wanderAction(game, mob);
      case 'AttackPlayer':
        return attackPlayerAction(game, mob);
    }
  }
} 

// AttackPlayer AI logic (placeholder)
function attackPlayerAction(game: Game, mob: Mob) {
  // TODO: Implement logic to move toward or attack the player
}
