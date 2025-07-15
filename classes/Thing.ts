// Thing.ts

export default abstract class Thing {
  constructor() {
    // Base constructor
  }

  /**
   * Get the base name name of the thing
   */
  abstract getName(): string;

  /**
   * Get the indefinite name of the thing, e.g. a tree
   */
  abstract getAName(): string;

  /**
   * Get the definite name of the thing, e.g. the tree
   */
  abstract getTheName(): string;

  /**
   * Get the possessive name of the thing, e.g. "your sword" or "Aldric Smythe's trenchcoat"
   */
  getPossessiveName(entity: Thing): string {
    if (entity.isPlayer()) {
      return `your ${this.getName()}`;
    }
    return `${entity.getTheName()}'s ${this.getName()}`;
  }

  /**
   * Check if the entity is a player
   * @returns true if the entity is a player, false otherwise
   */
  isPlayer(): boolean {
    return false;
  }

  toJSON() {
    // Base implementation resturns an empty map. Subclasses should call this and add their own properties.
    return {};
  }

  static fromJSON(obj: any): Thing {
    throw new Error('fromJSON must be implemented by subclasses');
  }
} 