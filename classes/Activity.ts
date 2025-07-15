// Activity.ts

import { ActivityType } from './ActivityType';
import type Game from './Game';

export enum ContentType {
  speech = 'speech',
  story = 'story',
  stat = 'stat',
}

export enum ActivityState {
  ACTIVE = 'active',
  ENDED = 'ended'
}

export type Content = {
  type: ContentType;
  value: any;
  colour?: string;
}

export interface Option {
  label: string;
  hoverText: string;
  disabled?: boolean;
  compelled?: string | null; // when non-null the player is compelled to take this option (or another compelled option, if any)
}

export class Activity {
  id: number;
  title: string;
  content: Content[];
  options: Map<string, Option>;
  activityType: string;
  state: ActivityState;

  constructor(activityType: string) {
    this.activityType = activityType;
    this.id = -1;
    this.content = [];
    this.options = new Map();
    this.state = ActivityState.ACTIVE;
    // Look up ActivityType and set title if available
    const typeObj = ActivityType.getType(activityType);
    this.title = typeObj?.title || activityType;
    if (typeObj?.onCreate) {
      typeObj.onCreate(this);
    }
  }

  toJSON() {
    return {
      title: this.title,
      content: this.content,
      options: Array.from(this.options.entries()), // Serialize Map as array of [key, value]
      activityType: this.activityType,
      state: this.state,
    };
  }

  static fromJSON(json: any): Activity {
    const { activityType, title, content, options, state } = json;
    const activity = new Activity(activityType);
    activity.title = title || activity.title;
    activity.content = content || [];
    activity.options = new Map<string, Option>(options);
    activity.state = state || ActivityState.ACTIVE;
    return activity;
  }

  public doUpdate(game: Game): void {
    const activityType=ActivityType.getType(this.activityType);
    if (!activityType) {
      throw new Error(`Activity type ${this.activityType} not found`);
    }
    if (activityType.onUpdate) {
      activityType.onUpdate(game, this);
    }
  }
} 