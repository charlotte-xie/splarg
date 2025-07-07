import type { Position } from './World';

export default class Entity {
  public position: Position;
  private id: number | null = null;

  constructor() {
    this.position = { x: 0, y: 0 };
  }

  setPosition(position: Position): void {
    this.position = { ...position };
  }

  setId(id: number): void {
    this.id = id;
  }

  getId(): number {
    if (this.id === null) {
      throw new Error('Entity ID not set');
    }
    return this.id;
  }

  toJSON() {
    return {
      position: this.position,
      id: this.id
    };
  }

  static fromJSON(obj: any): Entity {
    const entity = new Entity();
    entity.position = obj.position;
    entity.id = obj.id;
    return entity;
  }
} 