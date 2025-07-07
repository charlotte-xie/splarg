import type { Position } from './World';

export default class Entity {
  public position: Position;

  constructor() {
    this.position = { x: 0, y: 0 };
  }

  setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  toJSON() {
    return {
      position: this.position
    };
  }

  static fromJSON(obj: any): Entity {
    const entity = new Entity();
    entity.position = obj.position;
    return entity;
  }
} 