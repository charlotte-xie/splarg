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
      script: ['ai-random',['ai-move','wander'],['ai-move','chase',0]]
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
   * Perform actions for this mob
   * @param game 
   * @param timeStep - The amount of time to advance
   */
  doAction(game: import('./Game').default): void {
    var time = this.time;
    
    // loop until action time used
    while (time < game.time) {
      aiDoMobAction(game,this);
      const used=this.time-time;
      if (used <=0) {
        // Mob decided to do nothing, or there was a logic error. Either way, time should be up to the present and exit loop
        this.time = Math.max(this.time,game.time);
        break;
      }
      time=this.time; // update time for current activity
    }
  }
} 