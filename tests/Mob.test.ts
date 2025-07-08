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
}); 