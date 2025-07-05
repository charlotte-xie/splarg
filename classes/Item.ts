export class ItemType {
  public id: string;
  public name: string;
  public description: string;
  public stackable?: boolean;

  constructor({ id, name, description, stackable }: {
    id: string;
    name: string;
    description: string;
    stackable?: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.stackable = stackable;
  }
}

export default class Item {
  public number: number;
  public type: ItemType;

  constructor(number: number, type: ItemType) {
    this.number = number;
    this.type = type;
  }

  canStack(other?: Item): boolean {
    if (other) {
      return (
        this.type.stackable === true &&
        other.type.id === this.type.id
      );
    }
    return !!this.type.stackable;
  }

  getName(): string {
    return this.type.name;
  }

  getDescription(): string {
    return this.type.description;
  }

  getId(): string {
    return this.type.id;
  }

  isStackable(): boolean {
    return !!this.type.stackable;
  }

  getQuantity(): number {
    return this.number;
  }

  hasMultiple(): boolean {
    return this.number > 1;
  }
} 