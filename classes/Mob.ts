import type { AIState } from './AI';
import { doMobAction as aiDoMobAction } from './AI';
import { Being } from './Being';
import { EntityClass } from './Entity';

const MAX_ACTION_TIME=1000;

export default class Mob extends Being {
  public ai: AIState;

  constructor() {
    super(EntityClass.MOB);
    this.ai = { type: 'Wandering' };
  }

  toJSON() {
    const base = super.toJSON();
    return {
      ...base,
      klass: EntityClass.MOB,
      ai: this.ai
    };
  }

  static fromJSON(obj: any): Mob {
    const mob = Object.assign(new Mob(), super.fromJSON(obj));
    mob.ai = obj.ai;
    return mob;
  }

  /**
   * Take an individual Mob action
   * @param game 
   * @returns time used
   */
  doMobAction(game: import('./Game').default): number {
    return aiDoMobAction(game, this);
  }

  advanceTime(game: import('./Game').default): void {
    // limit maximum time to MAX_ACTION_TIME
    if (game.time > this.time+MAX_ACTION_TIME) {
      this.time=game.time-MAX_ACTION_TIME;
      return;
    }

    // loop until action time used
    while (game.time > this.time) {
      const used = this.doMobAction(game);
      if (used > 0) {
        this.time += used;
      } else {
        // Mob decided to do nothing, or there was a logic error. Either way, time should be up to the present and exit loop
        this.time=game.time;
        break;
      }
    }
  }
} 