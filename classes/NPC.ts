import { Being } from './Being';
import { EntityClass } from './Entity';
import { Race } from './Races';

export default class NPC extends Being {
  public name: string;
  public race: Race;

  constructor(name: string, race: Race = Race.HUMAN) {
    super(EntityClass.NPC);
    this.name = name;
    this.race = race;
  }

  getName(): string {
    return this.name;
  }

  toJSON() {
    const base = super.toJSON();
    return {
      ...base,
      name: this.name,
      race: this.race
    };
  }

  static fromJSON(obj: any): NPC {
    const npc = new NPC(obj.name, obj.race || Race.HUMAN);
    const base = Being.fromJSON(obj);
    Object.assign(npc, base);
    return npc;
  }
} 