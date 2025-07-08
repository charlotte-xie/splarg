import type { Position } from './World';

export enum EntityClass {
  PLAYER = 'Player',
  NPC = 'NPC',
  MOB = 'Mob'
}

export default class Entity {
  protected _position: Position;
  private id: number | null = null;
  public klass: EntityClass;

  constructor(klass: EntityClass) {
    this._position = { x: 0, y: 0 };
    this.klass=klass;
    this.id = -1;
  }

  setPosition(position: Position): void {
    this._position = { ...position };
  }

  get position(): Position {
    return this._position;
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
      position: this._position,
      id: this.id,
      klass: this.klass
    };
  }

  static fromJSON(obj: any): Entity {
    const entity = new Entity(obj.klass || EntityClass.NPC);
    entity._position = obj.position;
    entity.setId(obj.id);
    return entity;
  }
} 