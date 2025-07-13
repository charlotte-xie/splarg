// AI.ts

// Plan scripts follow a pattern of returning:
// - the continuation script if still active - can be regarded as a "true" result
// - true if the script succeeded
// - false if the script failed with no point retrying (abandoned)
// - null if the script failed but might work later
//
// Goal scripts are used to generate a plan
// - A concrete ai-script if a plan is created
// - null if no sensible plan can be generated

import type Game from './Game';
import Mob from './Mob';
import type { PathFindTarget } from './PathFind';
import { findPath } from './PathFind';
import { registerScript, runScript } from './Script';

// Pure data type for AI state
export type AIState = {
  type: string;
  script?: any[]; // Array of script arguments for runEntityScript
  // Add more AI types and properties as needed
};

export type Plan = [string, ...any[]];
export type PlanResult = true | false | null | Plan;

// Generic movement logic. Returns true if movement succeeded
function moveAction(g: Game, entity: any, targetX: number, targetY: number): boolean {
  const areaId = entity.position.areaId;
  if (!areaId) return false;
  
  const { x, y } = entity.position;
  
  // Calculate direction to target
  const dx = Math.sign(targetX - x);
  const dy = Math.sign(targetY - y);
  
  if (dx === 0 && dy === 0) return true; // Successful, but no movement needed
  
  const area = g.world.getArea(areaId);
  const newX = x + dx;
  const newY = y + dy;
  
  entity.time += 100;
  
  const blocker = area.getBlocker(newX, newY, g);
  if (blocker) return false; // Blocked, can't move
  
  g.addEntity(entity, { areaId, x: newX, y: newY });
  return true;
}


// Register the new scripts
registerScript('ai-wander', (g: Game, ...args: any[]) => {
  const entity = g.getActiveEntity();
  if (!entity) {
    throw new Error(`Active entity not found`);
  }
  
  const dx = Math.floor(Math.random() * 3) - 1;
  const dy = Math.floor(Math.random() * 3) - 1;
  moveAction(g, entity, entity.position.x + dx, entity.position.y + dy);
  
  return args; // Continue wandering
});

registerScript('ai-approach', (g: Game, ...args: any[]) => {
  if (args.length < 1) {
    throw new Error('ai-approach requires target entity ID at least');
  }
  
  const [_, targetEntityId, maxDistance = 1] = args;
  
  const entity = g.getActiveEntity();
  const targetEntity = g.getEntity(targetEntityId);
  if (!targetEntity) {
    throw new Error(`Target entity with ID ${targetEntityId} not found`);
  }
  
  // Calculate current distance to target
  const dx = targetEntity.position.x - entity.position.x;
  const dy = targetEntity.position.y - entity.position.y;
  
  // Check if we're already within max distance on both axes
  if (Math.abs(dx) <= maxDistance && Math.abs(dy) <= maxDistance) {
    return null; // Approach complete
  }
  
  // Calculate movement direction towards target
  const moveX = Math.sign(dx);
  const moveY = Math.sign(dy);
  
  // Move towards target (use dx or dy, preferring horizontal movement if both are non-zero)
  const  moved=moveAction(g, entity, entity.position.x + moveX, entity.position.y + moveY);
  if (!moved) return false;
  
  return args; // Return full script args including script name
});

// ["goals" script1 script2 script3 ...] executes scripts in turn, returning the first one that returns a non-null script
registerScript('goals', (g: Game, ...args: any[]) => {
  if (args.length < 2) {
    throw new Error('goals requires at least one script to try');
  }
  
  // Try each script in order (skip the first arg which is 'goals')
  for (let i = 1; i < args.length; i++) {
    const scriptToTry = args[i];
    const result = runScript(g, scriptToTry);
    
    // If the script returns a non-null result, return that result
    if (result !== null) {
      return result;
    }
  }
  
  // If none of the scripts produced a result, return null
  return null;
});

// ["plan" goal plan?] executes plan if it exists, falls back to goal to produce a new plan if plan fails
registerScript('plan', (g: Game, ...args: any[]) => {
  if (args.length < 2) {
    throw new Error('plan requires at least a goal script');
  }
  
  const goal = args[1];
  const plan = args[2]; // Optional existing planplan
  
  // If we have a plan, try to execute it
  if (plan) {
    const planResult = runScript(g, plan);
    
    // If doesn't terminate, continue with the same plan, or treturn true to indicate success
    if (planResult) {
      if (planResult==true) return true;
      return ['plan', goal, planResult];
    }
    // If plan fails (returns null), fall through to generate new plan
  }
  
  // No plan or plan failed - generate new plan from goal
  const newPlan = runScript(g, goal);
  
  // If goal doesn't produce a plan, return null
  if (newPlan === null) {
    return null;
  }
  
  // Return the script with the new plan
  return ['ai-plan', goal, newPlan];
});

// ["ai-path" [x1 y1] [x2 y2] [x3 y3] ...] moves to each destination in sequence
// returns null if stopped at any point
registerScript('ai-path', (g: Game, ...args: any[]) => {
  if (args.length < 2) {
    // if no destination, the path is complete
    return null;
  }
  
  const entity = g.getActiveEntity();
  if (!entity) {
    throw new Error(`Active entity not found`);
  }
  
  const firstDestination = args[1];
  if (!Array.isArray(firstDestination) || firstDestination.length !== 2) {
    throw new Error('ai-path destinations must be arrays of [x, y] coordinates');
  }
  
  const [targetX, targetY] = firstDestination;
  
  // Calculate direction to target
  const dx = Math.sign(targetX - entity.position.x);
  const dy = Math.sign(targetY - entity.position.y);
  
  // Try to move towards the target
  const moved = moveAction(g, entity, entity.position.x + dx, entity.position.y + dy);
  
  if (!moved) {
    return null; // Movement failed
  }
  
  // Check if we've reached the destination (within 1 tile)
  const currentX = entity.position.x;
  const currentY = entity.position.y;
  
  if (Math.abs(currentX - targetX)==0 && Math.abs(currentY - targetY)==0) {
    // Reached the destination, remove it from the path
    const remainingDestinations = args.slice(2);
    
    if (remainingDestinations.length === 0) {
      return true; // Path complete
    }
    
    // Return new path script with first destination removed
    return ['ai-path', ...remainingDestinations];
  }
  
  // Still moving towards destination, continue with same path
  return args;
});

// ["ai-pathfind" target proximity plan?] uses pathfinding to generate and execute path plans
registerScript('ai-pathfind', (g: Game, ...args: any[]) => {
  if (args.length < 2) {
    throw new Error('ai-pathfind requires target and proximity');
  }
  
  const entity = g.getActiveEntity();
  const areaId=entity.getAreaId();
  
  const [target, proximity, plan] = args;

  // If we have a plan, try to execute it
  if (plan) {
    const planResult = runScript(g, plan);
    
    // If plan succeeds (returns non-null), continue with the updated plan
    if (planResult !== null) {
      return ['ai-pathfind', target, proximity, planResult];
    }
    // If plan fails fall through to generate new plan
  }
  
  // No plan or plan failed - generate new plan using pathfinding
  const currentPos = {
    x: entity.position.x,
    y: entity.position.y,
    areaId: areaId
  };
  
  const path = findPath(g, currentPos, target as PathFindTarget, proximity);
  
  if (path.length === 0) {
    return null; // Already at target or pathfinding failed
  }
  
  // Create ai-path script with the found path
  const pathScript = ['ai-path', ...path];
  
  // Return the script with the new plan
  return ['ai-pathfind', target, proximity, pathScript];
});

// ["ai-random" script1 script2 script3 ...] selects a random script from those specified each time it is run.
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
    throw new Error("No AI script in Entity: "+mob.toJSON())
  }
} 

// AttackPlayer AI logic (placeholder)
function attackPlayerAction(game: Game, mob: Mob) {
  // TODO: Implement logic to move toward or attack the player
}
