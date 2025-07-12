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

// Generic movement logic
function moveAction(g: Game, entity: any, dx: number, dy: number) {
  const areaId = entity.position.areaId;
  if (!areaId) return;
  if (dx === 0 && dy === 0) return; // No movement
  const area = g.world.getArea(areaId);
  const { x, y } = entity.position;
  
  const newX = x + dx;
  const newY = y + dy;
  
  entity.time += 100;
  
  const blocker = area.getBlocker(newX, newY, g);
  if (blocker) return; // Blocked, can't move
  
  g.addEntity(entity, { areaId, x: newX, y: newY });
}

// Wandering movement logic
function wanderAction(g: Game, entity: any) {

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
    const dx = Math.floor(Math.random() * 3) - 1;
    const dy = Math.floor(Math.random() * 3) - 1;
    moveAction(g, entity, dx, dy);
    return args;
  } else if (actionType === 'chase') {
    // Chase action expects a target entity ID as the third argument
    if (args.length < 3) {
      throw new Error('ai-move chase requires target entity ID');
    }
    const targetEntityId = args[2];
    const targetEntity = g.getEntity(targetEntityId);
    if (!targetEntity) {
      throw new Error(`Target entity with ID ${targetEntityId} not found`);
    }
    // Calculate direction to target
    const dx = Math.sign(targetEntity.position.x - entity.position.x);
    const dy = Math.sign(targetEntity.position.y - entity.position.y);
    
    // Move towards target (use dx or dy, preferring horizontal movement if both are non-zero)
    moveAction(g, entity, dx, dy);
    
    return args;
  }
  
  throw new Error(`Unknown ai-move action type: ${actionType}`);
}

// Register AI scripts
registerScript('ai-move', aiMoveScript);
registerScript('ai-random', (g: Game, ...args: any[]) => {
  if (args.length < 2) {
    throw new Error('ai-random requires at least one script to choose from');
  }
  
  // Choose a random script from args 1..n-1 (skip the first arg which is 'ai-random')
  const scriptIndex = 1 + Math.floor(Math.random() * (args.length - 1));
  const chosenScript = args[scriptIndex];
  
  // Run the chosen script
  const result = runScript(g, chosenScript);
  
  return args;
});

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
