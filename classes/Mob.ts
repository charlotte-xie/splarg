import { Being } from './Being';
import { EntityClass } from './Entity';

export default class Mob extends Being {
  constructor() {
    super(EntityClass.MOB);
  }

  toJSON() {
    const base = super.toJSON();
    return {
      ...base,
      klass: EntityClass.MOB,
    };
  }

  static fromJSON(obj: any): Mob {
    const mob = Object.assign(new Mob(), super.fromJSON(obj));
    return mob;
  }

  doMobAction(game: import('./Game').default): void {
    const areaId = this.position.areaId;
    if (!areaId) return;
    const area = game.world.getArea(areaId);
    const { x, y } = this.position;
    // Pick random dx, dy in -1, 0, 1
    const dx = Math.floor(Math.random() * 3) - 1;
    const dy = Math.floor(Math.random() * 3) - 1;
    // If move is (0,0), stay still
    if (dx === 0 && dy === 0) {
      this.time += 100;
      return;
    }
    const newX = x + dx;
    const newY = y + dy;
    const tile = area.getTile(newX, newY);
    if (!tile || !tile.isWalkable()) {
      this.time += 100;
      return;
    }
    // Move mob using game.addEntity
    game.addEntity(this, { areaId, x: newX, y: newY });
    this.time += 100;
  }

  advanceTime(game: import('./Game').default): void {
    while (game.time > this.time) {
      this.doMobAction(game);
    }
  }
} 