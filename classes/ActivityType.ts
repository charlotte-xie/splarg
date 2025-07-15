// ActivityType.ts

import type { Activity } from './Activity';
import { ContentType } from './Activity';
import type Game from './Game';

export type ActivityTypeOptions = {
  title?: string;
  priority?: number;
  onCreate?: (activity: Activity) => void;
  onEnd?: (game: Game) => void;
  onUpdate?: (game: Game, activity: Activity) => void;
  onChoice?: (game: Game, activity: Activity) => void;
  // more properties can be added later
};

export class ActivityType {
  static types: Map<string, ActivityType> = new Map();

  key: string;
  title: string;
  priority?: number;
  onCreate?: (activity: Activity) => void; // called when activity is constructed. use for initialisation / setup
  onChoice?: (game: Game, activity: Activity) => void; // called when a choice is made
  onEnd?: (game: Game) => void; // called when activity is ended
  onUpdate?: (game: Game, activity: Activity) => void; // called after time update

  constructor(key: string, options: ActivityTypeOptions = {}) {
    this.key = key;
    this.title = options.title || key;
    this.priority = options.priority;
    this.onCreate = options.onCreate;
    this.onEnd = options.onEnd;
    this.onUpdate = options.onUpdate;
    this.onChoice = options.onChoice;
  }

  static registerType(key: string, options: ActivityTypeOptions = {}): ActivityType {
    const type = new ActivityType(key, options);
    ActivityType.types.set(key, type);
    return type;
  }

  static getType(key: string): ActivityType | undefined {
    return ActivityType.types.get(key);
  }

  static getAllTypes(): ActivityType[] {
    return Array.from(ActivityType.types.values());
  }
}

// Example registration of an ActivityType
ActivityType.registerType('pickup-items', {
  title: 'Pick Up Items',
  priority: 1,
  onCreate: (activity) => {
    // Example: set up activity content or options
    activity.content.push({ type: ContentType.story, value: 'There are items here to pick up' });
  },
  onChoice: (game, activity) => { 
    if (!activity.chosen) throw new Error("No choice made?")
    const item=game.getCurrentArea().takeFirstItem(activity.chosen,game.player.position,1);
    if (item) {
      game.addMessage('You pick up '+item.getTheName());
      game.player.addItem(item);
      game.player.time+=100;
      // game.removeActivity(activity.id);

    } else {
      game.addMessage('You cannot pick up that, it is no longer there...');
    }
    
  },
  onUpdate: (game, activity) => {
    // remove after each step, since need to refresh options
    game.removeActivity(activity.id);
  }
}); 