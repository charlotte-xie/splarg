import { Being, BeingStats } from './Being';
import { EntityClass } from './Entity';

export default class NPC extends Being {
  constructor(initial: Partial<BeingStats> = {}) {
    super(EntityClass.NPC);
    this.stats = { ...this.stats, ...initial };
  }

  getName(): string {
    return this.stats.name || 'Unnamed NPC';
  }

  getAName(): string {
    // For NPCs with proper names, return just the name
    return this.getName();
  }

  getTheName(): string {
    // For NPCs with proper names, return just the name without "the" prefix
    return this.getName();
  }

  toJSON() {
    const base = super.toJSON();
    return {
      ...base
    };
  }

  static fromJSON(obj: any): NPC {
    const npc = new NPC(obj.stats || {});
    const base = Being.fromJSON(obj);
    Object.assign(npc, base);
    return npc;
  }
} 