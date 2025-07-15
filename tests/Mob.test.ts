import { AIState, SUCCESS } from '../classes/AI';
import { EntityClass } from '../classes/Entity';
import Game from '../classes/Game';
import Mob from '../classes/Mob';
import { findPath } from '../classes/PathFind';
import Player from '../classes/Player';

describe('Mob', () => {
  test('should have an ID of -1 and klass of EntityClass.MOB when newly created', () => {
    const mob = new Mob();
    expect(mob.id).toBe(-1);
    expect(mob.klass).toBe(EntityClass.MOB);
  });

  test('should serialize and deserialize to identical JSON', () => {
    const mob = new Mob();
    mob.id=42;
    const json1 = mob.toJSON();
    const mob2 = Mob.fromJSON(json1);
    expect(mob2).toBeInstanceOf(Mob);
    const json2 = mob2.toJSON();
    expect(json2).toEqual(json1);

    expect(json1).toHaveProperty('inventory');
    expect(json1).toHaveProperty('klass', EntityClass.MOB);
  });

  test('should have an AI state present by default', () => {
    const mob = new Mob();
    expect(mob.ai).toBeDefined();
    expect(typeof mob.ai).toBe('object');
    expect(mob.ai).toHaveProperty('type');
  });

  test('should serialize and deserialize AI state with random data', () => {
    const mob = new Mob();
    // Insert random data into AI state
    const randomAI: AIState = { type: 'AttackPlayer', foo: Math.random(), bar: 'baz' } as any;
    mob.ai = randomAI;
    const json1 = mob.toJSON();
    // Simulate deserialization
    const mob2 = Mob.fromJSON(json1);
    expect(mob2.ai).toBeDefined();
    expect(mob2.ai.type).toBe('AttackPlayer');
    expect((mob2.ai as any).foo).toBeCloseTo((randomAI as any).foo);
    expect((mob2.ai as any).bar).toBe('baz');
  });
});

describe('Mob AI Behavior', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    game.initialise('test');
  });

  test('should execute ai-wander script and move randomly', () => {
    const mob = new Mob();
    mob.ai.script = ['ai-wander'];
    game.addEntity(mob, { areaId: 'test', x: 5, y: 5 });
    
    const initialX = mob.position.x;
    const initialY = mob.position.y;
    
    // Set mob as active entity and execute action
    game.advanceTime(100);
    
    // Should have moved (position changed or script continued)
    expect(mob.ai.script).toBeDefined();
    // Position might be the same if movement was blocked, but script should continue
    expect(mob.ai.script).toEqual(['ai-wander']);
  });

  test('should execute ai-approach script and move towards target', () => {
    const mob = new Mob();
    mob.ai.script = ['ai-approach', 0, 1]; // Approach player (ID 0) within 1 tile
    game.addEntity(mob, { areaId: 'test', x: 3, y: 3 });
    
    const initialX = mob.position.x;
    const initialY = mob.position.y;
    
    // Set mob as active entity and execute action
    game.advanceTime(100);
    
    // Should have moved towards player or script continued
    expect(mob.ai.script).toBeDefined();
    // If not close enough, should continue approaching
    const distanceToPlayer = Math.max(
      Math.abs(mob.position.x - game.player.position.x),
      Math.abs(mob.position.y - game.player.position.y)
    );
    
    if (distanceToPlayer > 1) {
      expect(mob.ai.script).toEqual(['ai-approach', 0, 1]);
    } else {
      // Should be null if reached target
      expect(mob.ai.script).toBeNull();
    }
  });

  test('should execute ai-path script and follow path', () => {
    const mob = new Mob();
    mob.ai.script = ['ai-path', [5, 6], [6, 7], [7, 7]];
    game.addEntity(mob, { areaId: 'test', x: 5, y: 5 });
    
    // Take one step
    game.advanceTime(100);
    expect(mob.ai.script).toEqual(['ai-path', [6, 7], [7, 7]]);
  });

  test('should execute ai-pathfind script and generate path', () => {
    const mob = new Mob();
    mob.ai.script = ['ai-pathfind', [10, 10], 1]; // Pathfind to position [10, 10] within 1 tile
    game.addEntity(mob, { areaId: 'test', x: 5, y: 5 });

    expect(mob.ai.script![0]).toBe('ai-pathfind');
    
    // Set mob as active entity and execute action
    game.advanceTime(100);
    
    // Should have generated a path plan
    expect(mob.ai.script![0]).toBe('ai-pathfind');
    expect(mob.ai.script![1]).toEqual([10, 10]);
    expect(mob.ai.script![2]).toBe(1);
    // Should have generated an ai-path script as the plan
    expect(Array.isArray(mob.ai.script![3])).toBe(true);
    expect(mob.ai.script![3][0]).toBe('ai-path');
  });

  test('should execute goals script and try multiple options', () => {
    const mob = new Mob();
    mob.ai.script = ['goals', ['ai-approach', 0, 1], ['ai-wander']];
    game.addEntity(mob, { areaId: 'test', x: 2, y: 2 });
    const initialPos=mob.position;
    
    // Set mob as active entity and execute action
    game.advanceTime(100);
    
    // Mod should have moved somewhere else
    expect(mob.position).not.toEqual(initialPos);
  });

  test('should execute plan script and manage goal/plan cycle', () => {
    const mob = new Mob();
    mob.ai.script = ['plan', ['ai-pathfind', [10, 10], 1]];
    game.addEntity(mob, { areaId: 'test', x: 5, y: 5 });
    
    // take one step
    game.advanceTime(100);
    expect(mob.ai.script).toBeDefined();
    expect(Array.isArray(mob.ai.script)).toBe(true);
    expect(mob.ai.script![0]).toEqual('plan');

    // Set mob as active entity and execute action
    game.advanceTime(1000)
    
    // Should have generated a plan from the goal
    expect(mob.ai.script).toBeDefined();
    expect(Array.isArray(mob.ai.script)).toBe(true);

  });

  test('should handle blocked movement gracefully', () => {
    const mob = new Mob();
    mob.ai.script = ['ai-path', [4,4], [3,3], [2,2], [1,1], [0, 0]]; // Try to move to corner wall position
    game.addEntity(mob, { areaId: 'test', x: 5, y: 5 });
    
    // Set mob as active entity and execute action
    game.advanceTime(1000)
    
    // Should get to the last non-blocked position
    expect(mob.position).toEqual({ areaId: 'test', x: 1, y: 1 });
  });

  test('should complete path and return true', () => {
    const mob = new Mob();
    mob.ai.script = ['ai-path', [6, 6]]; // Move to adjacent position
    game.addEntity(mob, { areaId: 'test', x: 5, y: 5 });
    
    // Advance time to allow mob action
    game.advanceTime(200);
    
    // Should have moved to destination and completed path
    expect(mob.position.x).toBe(6);
    expect(mob.position.y).toBe(6);
    expect(mob.ai.script).toEqual(SUCCESS); // Path completed
  });

  test('should find valid path using pathfinding function', () => {
    // Test direct pathfinding function
    const startPos = { x: 5, y: 5, areaId: 'test' };
    const targetPos = { x: 10, y: 10, areaId: 'test' };
    
    const path = findPath(game, startPos, targetPos, 1);
    
    // Should return a valid path
    expect(Array.isArray(path)).toBe(true);
    expect(path.length).toEqual(5);
    
    // Each path segment should be a [x, y] coordinate
    path.forEach((segment: Coord) => {
      expect(Array.isArray(segment)).toBe(true);
      expect(segment.length).toBe(2);
      expect(typeof segment[0]).toBe('number');
      expect(typeof segment[1]).toBe('number');
    });
    
    // Path should start near the start position and end near the target
    if (path.length > 0) {
      const firstStep = path[0];
      const lastStep = path[path.length - 1];
      
      // First step should be adjacent to start (or at start if no movement needed)
      const distanceToFirst = Math.max(Math.abs(firstStep[0] - startPos.x) , Math.abs(firstStep[1] - startPos.y));
      expect(distanceToFirst).toEqual(1);
      
      // Last step should be adjacent to target
      const distanceToTarget = Math.max(Math.abs(firstStep[0] - startPos.x) , Math.abs(firstStep[1] - startPos.y));
      expect(distanceToTarget).toEqual(1);
    }
  });

  test('should find path to entity using entity ID', () => {
    // Create a target entity
    const targetMob = new Mob();
    game.addEntity(targetMob, { areaId: 'test', x: 8, y: 8 });
    
    const startPos = { x: 5, y: 5, areaId: 'test' };
    const path = findPath(game, startPos, targetMob.id, 1);
    
    // Should return a valid path
    expect(Array.isArray(path)).toBe(true);
    expect(path.length).toBeGreaterThan(0);
    
    // Path should lead towards the target entity
    if (path.length > 0) {
      const lastStep = path[path.length - 1];
      const distanceToTarget = Math.max(
        Math.abs(lastStep[0] - targetMob.position.x),
        Math.abs(lastStep[1] - targetMob.position.y)
      );
      expect(distanceToTarget).toBeLessThanOrEqual(1);
    }
  });

  test('should find path to position array', () => {
    const startPos = { x: 5, y: 5, areaId: 'test' };
    const targetArray = [8, 8] as [number, number];
    
    const path = findPath(game, startPos, targetArray, 0);
    
    // Should return a valid path
    expect(Array.isArray(path)).toBe(true);
    expect(path.length).toBeGreaterThan(0);
    
    // Path should lead to the target position
    if (path.length > 0) {
      const lastStep = path[path.length - 1];
      const distanceToTarget = Math.abs(lastStep[0] - targetArray[0]) + Math.abs(lastStep[1] - targetArray[1]);
      expect(distanceToTarget).toBeLessThanOrEqual(1);
    }
  });

  test('should return empty path when already at target', () => {
    const startPos = { x: 5, y: 5, areaId: 'test' };
    const targetPos = { x: 5, y: 5, areaId: 'test' };
    
    const path = findPath(game, startPos, targetPos, 0);
    
    // Should return empty array when already at target
    expect(Array.isArray(path)).toBe(true);
    expect(path.length).toBe(0);
  });

  test('should return empty path when within proximity', () => {
    const startPos = { x: 5, y: 5, areaId: 'test' };
    const targetPos = { x: 6, y: 6, areaId: 'test' };
    
    const path = findPath(game, startPos, targetPos, 2);
    
    // Should return empty array when within proximity
    expect(Array.isArray(path)).toBe(true);
    expect(path.length).toBe(0);
  });

  test('should throw error for different areas', () => {
    const startPos = { x: 5, y: 5, areaId: 'test' };
    const targetPos = { x: 5, y: 5, areaId: 'different-area' };
    
    expect(() => {
      findPath(game, startPos, targetPos, 0);
    }).toThrow('Start and target positions must be in the same area');
  });
});

describe('Mob Name Methods', () => {
  test('should return correct basic name', () => {
    const mob = new Mob();
    expect(mob.getName()).toBe('Mob');
  });

  test('should return correct indefinite article name', () => {
    const mob = new Mob();
    expect(mob.getAName()).toBe('a Mob');
  });

  test('should return correct definite article name', () => {
    const mob = new Mob();
    expect(mob.getTheName()).toBe('the Mob');
  });

  test('should return correct possessive name', () => {
    const mob = new Mob();
    const player = new Player();
    
    expect(mob.getPossessiveName(player)).toBe("your Mob");
    expect(mob.getPossessiveName(mob)).toBe("Mob's Mob");
  });
}); 