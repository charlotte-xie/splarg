import { Being } from './Being';
import { EntityClass } from './Entity';
import { Gender } from './Names';
import { Race } from './Races';

export default class NPC extends Being {
  public name: string;
  public race: Race;

  constructor(name: string, race: Race = Race.HUMAN, gender: Gender = 'neutral') {
    super(EntityClass.NPC, gender);
    this.name = name;
    this.race = race;
  }

  getName(): string {
    return this.name;
  }

  getTheName(): string {
    // For NPCs with proper names, return just the name without "the" prefix
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
    const npc = new NPC(obj.name, obj.race || Race.HUMAN, obj.gender || 'neutral');
    const base = Being.fromJSON(obj);
    Object.assign(npc, base);
    return npc;
  }
} 