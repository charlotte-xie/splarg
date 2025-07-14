// Activity.ts

export enum ContentType {
  speech = 'speech',
  story = 'story',
  stat = 'stat',
}

export interface Content {
  type: ContentType;
  value: any;
  colour: string;
}

export interface Option {
  label: string;
  hoverText: string;
  disabled?: boolean;
}

export class Activity {
  title: string;
  content: Content[];
  options: Map<string, Option>;

  constructor(title: string, content: Content[] = [], options: Map<string, Option> = new Map()) {
    this.title = title;
    this.content = content;
    this.options = options;
  }

  toJSON() {
    return {
      title: this.title,
      content: this.content,
      options: Array.from(this.options.entries()), // Serialize Map as array of [key, value]
    };
  }

  static fromJSON(json: any): Activity {
    const { title, content, options } = json;
    return new Activity(
      title,
      content,
      new Map<string, Option>(options)
    );
  }
} 