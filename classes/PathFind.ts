// PathFind.ts

import type { EntityID } from './Entity';
import type Game from './Game';
import type { Position } from './World';

// PathFindTarget can be an EntityID, Position, or [x, y] array
export type PathFindTarget = EntityID | Position | [number, number];

// A* pathfinding node
interface PathNode {
  x: number;
  y: number;
  g: number; // Cost from start to current node
  h: number; // Heuristic (estimated cost from current to target)
  f: number; // Total cost (g + h)
  parent: PathNode | null;
}

// Helper function to resolve a PathFindTarget to a position
export function resolveTarget(
  game: Game, 
  target: PathFindTarget, 
  currentAreaId: string
): { x: number; y: number; areaId: string } {
  if (typeof target === 'number') {
    // Target is an EntityID
    const targetEntity = game.getEntity(target);
    if (!targetEntity) {
      throw new Error(`Target entity with ID ${target} not found`);
    }
    if (!targetEntity.position.areaId) {
      throw new Error(`Target entity has no area ID`);
    }
    return {
      x: targetEntity.position.x,
      y: targetEntity.position.y,
      areaId: targetEntity.position.areaId
    };
  } else if (Array.isArray(target) && target.length === 2) {
    // Target is a [x, y] array
    return {
      x: target[0],
      y: target[1],
      areaId: currentAreaId
    };
  } else if (typeof target === 'object' && 'x' in target && 'y' in target) {
    // Target is a Position
    if (!target.areaId) {
      throw new Error(`Target position has no area ID`);
    }
    return {
      x: target.x,
      y: target.y,
      areaId: target.areaId
    };
  } else {
    throw new Error('Invalid target type');
  }
}

// A* pathfinding function
export function findPath(
  game: Game, 
  startPos: { x: number; y: number; areaId: string }, 
  target: PathFindTarget, 
  proximity: number = 0
): [number, number][] {
  // Resolve target to position
  const targetPos = resolveTarget(game, target, startPos.areaId);
  
  // Check if areas match
  if (startPos.areaId !== targetPos.areaId) {
    throw new Error('Start and target positions must be in the same area');
  }
  
  const area = game.world.getArea(startPos.areaId);
  if (!area) {
    throw new Error(`Area ${startPos.areaId} not found`);
  }
  
  // Check if already within proximity
  const distance = Math.max(
    Math.abs(startPos.x - targetPos.x),
    Math.abs(startPos.y - targetPos.y)
  );
  if (distance <= proximity) {
    return []; // Already close enough
  }
  
  // Initialize open and closed sets
  const openSet: PathNode[] = [];
  const closedSet = new Set<string>();
  
  // Create start node
  const startNode: PathNode = {
    x: startPos.x,
    y: startPos.y,
    g: 0,
    h: Math.max(Math.abs(startPos.x - targetPos.x), Math.abs(startPos.y - targetPos.y)),
    f: 0,
    parent: null
  };
  startNode.f = startNode.g + startNode.h;
  
  openSet.push(startNode);
  
  // Direction offsets for 8-directional movement (including diagonals)
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  let closestNode: PathNode = startNode;
  let closestDistance = distance;
  
  while (openSet.length > 0) {
    // Find node with lowest f cost
    let currentIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[currentIndex].f) {
        currentIndex = i;
      }
    }
    
    const current = openSet[currentIndex];
    
    // Check if we've reached the target (within proximity)
    const currentDistance = Math.max(
      Math.abs(current.x - targetPos.x),
      Math.abs(current.y - targetPos.y)
    );
    
    if (currentDistance <= proximity) {
      // Reconstruct path
      return reconstructPath(current);
    }
    
    // Update closest node if this is closer
    if (currentDistance < closestDistance) {
      closestNode = current;
      closestDistance = currentDistance;
    }
    
    // Move current node from open to closed set
    openSet.splice(currentIndex, 1);
    closedSet.add(`${current.x},${current.y}`);
    
    // Check all neighbors
    for (const [dx, dy] of directions) {
      const neighborX = current.x + dx;
      const neighborY = current.y + dy;
      const neighborKey = `${neighborX},${neighborY}`;
      
      // Skip if already evaluated
      if (closedSet.has(neighborKey)) {
        continue;
      }
      
      // Check bounds
      if (neighborX < 0 || neighborX >= area.width || 
          neighborY < 0 || neighborY >= area.height) {
        continue;
      }
      
      // Check if walkable and not blocked
      const tile = area.getTile(neighborX, neighborY);
      if (!tile || !tile.isWalkable) {
        continue;
      }
      
      // Check for entity blockers
      const blocker = area.getBlocker(neighborX, neighborY, game);
      if (blocker) {
        continue;
      }
      
      // Calculate movement cost (diagonal movement costs more)
      const movementCost = (dx !== 0 && dy !== 0) ? 1.4 : 1.0;
      const tentativeG = current.g + movementCost;
      
      // Check if this path to neighbor is better than any previous one
      let neighbor = openSet.find(node => node.x === neighborX && node.y === neighborY);
      
      if (!neighbor) {
        // New node
        neighbor = {
          x: neighborX,
          y: neighborY,
          g: tentativeG,
          h: Math.max(Math.abs(neighborX - targetPos.x), Math.abs(neighborY - targetPos.y)),
          f: 0,
          parent: current
        };
        neighbor.f = neighbor.g + neighbor.h;
        openSet.push(neighbor);
      } else if (tentativeG < neighbor.g) {
        // Better path found
        neighbor.g = tentativeG;
        neighbor.f = tentativeG + neighbor.h;
        neighbor.parent = current;
      }
    }
  }
  
  // No path found, return path to closest node
  return reconstructPath(closestNode);
}

// Helper function to reconstruct path from node to start
function reconstructPath(endNode: PathNode): [number, number][] {
  const path: [number, number][] = [];
  let current: PathNode | null = endNode;
  
  while (current) {
    path.unshift([current.x, current.y]);
    current = current.parent;
  }
  
  // Remove the start position (we don't need to move to where we already are)
  return path.slice(1);
} 