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
  // more properties can be added later
};

export class ActivityType {
  static types: Map<string, ActivityType> = new Map();

  key: string;
  title: string;
  priority?: number;
  onCreate?: (activity: Activity) => void;
  onEnd?: (game: Game) => void;
  onUpdate?: (game: Game, activity: Activity) => void;

  constructor(key: string, options: ActivityTypeOptions = {}) {
    this.key = key;
    this.title = options.title || key;
    this.priority = options.priority;
    this.onCreate = options.onCreate;
    this.onEnd = options.onEnd;
    this.onUpdate = options.onUpdate;
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
  onUpdate: (game, activity) => {
    game.removeActivity(activity.id);
  }
}); 