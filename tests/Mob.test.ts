import type { AIState } from '../classes/AI';
import { EntityClass } from '../classes/Entity';
import Mob from '../classes/Mob';

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