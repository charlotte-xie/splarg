import Button from './Button';

interface PlayerStatsProps {
  stats: any;
  onStatsUpdate: (stats: any) => void;
}

export default function PlayerStats({ stats, onStatsUpdate }: PlayerStatsProps) {
  const handleStatChange = (statName: string, value: number) => {
    const newStats = { ...stats, [statName]: value };
    onStatsUpdate(newStats);
  };

  const handleLevelUp = () => {
    const newStats = {
      ...stats,
      level: stats.level + 1,
      experience: Math.max(0, stats.experience - stats.experienceToNext),
      experienceToNext: Math.floor(stats.experienceToNext * 1.5),
      health: stats.maxHealth,
      mana: stats.maxMana
    };
    onStatsUpdate(newStats);
  };

  const handleHeal = () => {
    if (stats.health < stats.maxHealth) {
      const newStats = { ...stats, health: Math.min(stats.maxHealth, stats.health + 10) };
      onStatsUpdate(newStats);
    }
  };

  const handleManaRestore = () => {
    if (stats.mana < stats.maxMana) {
      const newStats = { ...stats, mana: Math.min(stats.maxMana, stats.mana + 10) };
      onStatsUpdate(newStats);
    }
  };

  const experienceProgress = (stats.experience / stats.experienceToNext) * 100;

  return (
    <div className="player-stats">
       <div className="player-header">
        <h3>Character Stats</h3>
        {/* <div className="player-position">
          Position: ({position.x}, {position.y})
        </div> */}
      </div>
      <div className="stats-section">
        <div className="stat-row">
          <span className="stat-label">Level:</span>
          <span className="stat-value">{stats.level}</span>
          <Button 
            variant="primary"
            size="small"
            onClick={handleLevelUp}
            disabled={stats.experience < stats.experienceToNext}
          >
            Level Up
          </Button>
        </div>

        <div className="stat-row">
          <span className="stat-label">Experience:</span>
          <span className="stat-value">{stats.experience} / {stats.experienceToNext}</span>
        </div>
        
        <div className="experience-bar">
          <div 
            className="experience-fill" 
            style={{ width: `${experienceProgress}%` }}
          ></div>
        </div>

        <div className="stat-row">
          <span className="stat-label">Health:</span>
          <span className="stat-value">{stats.health} / {stats.maxHealth}</span>
          <Button 
            variant="success"
            size="small"
            onClick={handleHeal}
            disabled={stats.health >= stats.maxHealth}
          >
            Heal
          </Button>
        </div>

        <div className="stat-row">
          <span className="stat-label">Mana:</span>
          <span className="stat-value">{stats.mana} / {stats.maxMana}</span>
          <Button 
            variant="primary"
            size="small"
            onClick={handleManaRestore}
            disabled={stats.mana >= stats.maxMana}
          >
            Restore
          </Button>
        </div>
      </div>

      <div className="attributes-section">
        <h4>Attributes</h4>
        <div className="stat-row">
          <span className="stat-label">Strength:</span>
          <span className="stat-value">{stats.strength}</span>
          <Button 
            variant="secondary"
            size="small"
            onClick={() => handleStatChange('strength', stats.strength + 1)}
          >
            +
          </Button>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Dexterity:</span>
          <span className="stat-value">{stats.dexterity}</span>
          <Button 
            variant="secondary"
            size="small"
            onClick={() => handleStatChange('dexterity', stats.dexterity + 1)}
          >
            +
          </Button>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Intelligence:</span>
          <span className="stat-value">{stats.intelligence}</span>
          <Button 
            variant="secondary"
            size="small"
            onClick={() => handleStatChange('intelligence', stats.intelligence + 1)}
          >
            +
          </Button>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Constitution:</span>
          <span className="stat-value">{stats.constitution}</span>
          <Button 
            variant="secondary"
            size="small"
            onClick={() => handleStatChange('constitution', stats.constitution + 1)}
          >
            +
          </Button>
        </div>
      </div>

      <div className="resources-section">
        <div className="stat-row">
          <span className="stat-label">Gold:</span>
          <span className="stat-value">{stats.gold}</span>
          <Button 
            variant="secondary"
            size="small"
            onClick={() => handleStatChange('gold', stats.gold + 10)}
          >
            Add 10
          </Button>
        </div>
      </div>
    </div>
  );
} 