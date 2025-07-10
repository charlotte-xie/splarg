import type { Position } from './World';

export enum EntityClass {
  PLAYER = 'Player',
  NPC = 'NPC',
  MOB = 'Mob'
}

export default class Entity {
  protected _position: Position;
  protected _id: number | null = null;
  public klass: EntityClass;
  private _time: number = 0;

  constructor(klass: EntityClass) {
    this._position = { x: 0, y: 0 };
    this.klass=klass;
    this._id = -1;
    this._time = 0;
  }

  setPosition(position: Position): void {
    this._position = { ...position };
  }

  get position(): Position {
    return this._position;
  }

  get id(): number {
    if (this._id === null) {
      throw new Error('Entity ID not set');
    }
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get time(): number {
    return this._time;
  }

  set time(value: number) {
    this._time = value;
  }

  /**
   * Advance time for this entity
   * @param game 
   */
  advanceTime(game: import('./Game').default): void {
    // Generic Entity does nothing, just waits
    this.time=game.time;
  }

  toJSON() {
    return {
      position: this._position,
      id: this._id,
      klass: this.klass,
      time: this._time
    };
  }

  static fromJSON(obj: any): Entity {
    const entity = new Entity(obj.klass || EntityClass.NPC);
    entity._position = obj.position;
    entity._id = obj.id;
    entity._time = obj.time ?? 0;
    return entity;
  }

  
  isPlayer(): boolean {
    return false;
  }
} 