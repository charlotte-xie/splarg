import type { AIState } from './AI';
import { doMobAction as aiDoMobAction } from './AI';
import { Being } from './Being';
import { EntityClass } from './Entity';

export default class Mob extends Being {
  public ai: AIState;

  constructor() {
    super(EntityClass.MOB);
    this.ai = { 
      type: 'Wandering',
      script: ['ai-move', 'wander']
    };
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

  /**
   * Perform actions for this mob
   * @param game 
   * @param timeStep - The amount of time to advance
   */
  doAction(game: import('./Game').default, timeStep: number): void {
    // loop until action time used
    while (timeStep > 0) {
      const used = this.doMobAction(game);
      if (used > 0) {
        this.time += used;
        timeStep -= used;
      } else {
        // Mob decided to do nothing, or there was a logic error. Either way, time should be up to the present and exit loop
        this.time = game.time;
        break;
      }
    }
  }
} 