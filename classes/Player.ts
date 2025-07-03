interface PlayerPosition {
  x: number;
  y: number;
}

interface PlayerStats {
  health: number;
  maxHealth: number;
  level: number;
  experience: number;
  experienceToNext: number;
  strength: number;
  defense: number;
  speed: number;
  gold: number;
  [key: string]: any;
}

export default class Player {
  public position: PlayerPosition;
  public stats: PlayerStats;

  constructor(position: PlayerPosition = Player.defaultPosition(), stats: PlayerStats = Player.defaultStats()) {
    this.position = { ...position };
    this.stats = { ...stats };
  }

  static defaultStats(): PlayerStats {
    return {
      health: 100,
      maxHealth: 100,
      level: 1,
      experience: 0,
      experienceToNext: 100,
      strength: 10,
      defense: 5,
      speed: 8,
      gold: 0
    };
  }

  static defaultPosition(): PlayerPosition {
    return { x: 3, y: 3 };
  }

  setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  updateStats(newStats: Partial<PlayerStats>): void {
    this.stats = { ...this.stats, ...newStats };
  }

  addExperience(amount: number): void {
    this.stats.experience += amount;
    while (this.stats.experience >= this.stats.experienceToNext) {
      this.levelUp();
    }
  }

  levelUp(): void {
    this.stats.level += 1;
    this.stats.experience -= this.stats.experienceToNext;
    this.stats.experienceToNext = Math.floor(this.stats.experienceToNext * 1.5);
    this.stats.health = this.stats.maxHealth;
  }

  heal(amount: number): void {
    this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
  }

  takeDamage(amount: number): void {
    this.stats.health = Math.max(0, this.stats.health - amount);
  }

  addGold(amount: number): void {
    this.stats.gold += amount;
  }
} 