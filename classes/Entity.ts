import { AreaID } from './Area';
import Thing from './Thing';
import Utils from './Utils';
import type { Position } from './World';

export type EntityID = number;

export enum EntityClass {
  PLAYER = 'Player',
  NPC = 'NPC',
  MOB = 'Mob'
}

/**
 * An Entity is any active object in the game, e.g. the Player or a Mob
 * Entities are indexed in Game.entities, with references to them stored in Tiles.
 * Once allocated, entity IDs are stable identifiers.
 */
export default class Entity extends Thing {
  protected _position: Position;
  protected _id: number | null = null;
  public klass: EntityClass;
  private _time: number = 0;

  constructor(klass: EntityClass) {
    super();
    this._position = { x: 0, y: 0 };
    this.klass = klass;
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
    if (this.id !== -1) {
      throw new Error('Entity ID already set');
    }
    this._id = value;
  }

  get time(): number {
    return this._time;
  }

  set time(value: number) {
    this._time = value;
  }

  getAreaId(): AreaID {
    if (!this._position.areaId) {
      throw new Error('Entity has no area ID');
    }
    return this._position.areaId;
  }

  /**
   * Perform an action for this entity
   * @param game 
   */
  doAction(game: import('./Game').default): void {
    // Generic Entity does nothing
  }

  toJSON() {
    return {
      ...super.toJSON(),
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

  getName(): string {
    return this.klass;
  }

  getAName(): string {
    const name = this.getName();
    const article = Utils.startsWithVowelSound(name) ? 'an' : 'a';
    return `${article} ${name}`;
  }

  getTheName(): string {
    return `the ${this.getName()}`;
  }

 
} 