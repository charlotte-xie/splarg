export default class Player {
  constructor(position = Player.defaultPosition(), stats = Player.defaultStats()) {
    this.position = { ...position };
    this.stats = { ...stats };
  }

  static defaultStats() {
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

  static defaultPosition() {
    return { x: 3, y: 3 };
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  updateStats(newStats) {
    this.stats = { ...this.stats, ...newStats };
  }

  addExperience(amount) {
    this.stats.experience += amount;
    while (this.stats.experience >= this.stats.experienceToNext) {
      this.levelUp();
    }
  }

  levelUp() {
    this.stats.level += 1;
    this.stats.experience -= this.stats.experienceToNext;
    this.stats.experienceToNext = Math.floor(this.stats.experienceToNext * 1.5);
    this.stats.health = this.stats.maxHealth;
  }

  heal(amount) {
    this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
  }

  takeDamage(amount) {
    this.stats.health = Math.max(0, this.stats.health - amount);
  }

  addGold(amount) {
    this.stats.gold += amount;
  }
} 