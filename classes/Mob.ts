import { Being } from './Being';
import { EntityClass } from './Entity';

export default class Mob extends Being {
  constructor() {
    super(EntityClass.MOB);
  }

  toJSON() {
    const base = super.toJSON();
    return {
      ...base,
      class: 'Mob',
    };
  }

  static fromJSON(obj: any): Mob {
    const mob = Object.assign(new Mob(), super.fromJSON(obj));
    return mob;
  }
} 