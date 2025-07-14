// PathFind.ts

import type { EntityID } from './Entity';
import type Game from './Game';
import type { Coord, Position } from './World';

// PathFindTarget can be an EntityID, Position, or [x, y] array
export type PathFindTarget = EntityID | Position | Coord;

// Common distance function (Chebyshev distance)
function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

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

// Direction offsets for 8-directional movement (including diagonals)
const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

// A* pathfinding function
export function findPath(
  game: Game, 
  startPos: Position, 
  target: PathFindTarget, 
  proximity: number = 0
): Coord[] {
  const areaID = startPos.areaId || game.getCurrentArea().id;
  // Resolve target to position
  const targetPos = resolveTarget(game, target, areaID);
  
  // Check if areas match
  if (startPos.areaId !== targetPos.areaId) {
    throw new Error('Start and target positions must be in the same area');
  }
  
  const area = game.world.getArea(startPos.areaId);
  if (!area) {
    throw new Error(`Area ${startPos.areaId} not found`);
  }
  
  // Check if already within proximity
  if (distance(startPos, targetPos) <= proximity) {
    return []; // Already close enough
  }
  
  // Initialize open and closed sets
  const openSet: Map<string, PathNode> = new Map();
  const closedSet = new Set<string>();
  
  // Create start node
  const startNode: PathNode = {
    x: startPos.x,
    y: startPos.y,
    g: 0,
    h: distance(startPos, targetPos),
    f: 0,
    parent: null
  };
  startNode.f = startNode.g + startNode.h;
  openSet.set(`${startNode.x},${startNode.y}`, startNode);
  
  let closestNode: PathNode = startNode;
  let closestDistance = distance(startPos, targetPos);
  
  while (openSet.size > 0) {
    // Find node with lowest f cost
    let current: PathNode | null = null;
    let currentKey: string | null = null;
    for (const [key, node] of openSet.entries()) {
      if (!current || node.f < current.f) {
        current = node;
        currentKey = key;
      }
    }
    if (!current || !currentKey) break;
    
    // Check if we've reached the target (within proximity)
    const currentDistance = distance(current, targetPos);
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
    openSet.delete(currentKey);
    closedSet.add(currentKey);
    
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
      
      let neighbor = openSet.get(neighborKey);
      if (!neighbor) {
        // New node
        neighbor = {
          x: neighborX,
          y: neighborY,
          g: tentativeG,
          h: distance({ x: neighborX, y: neighborY }, targetPos),
          f: 0,
          parent: current
        };
        neighbor.f = neighbor.g + neighbor.h;
        openSet.set(neighborKey, neighbor);
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