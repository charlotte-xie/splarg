import React from 'react';
import Player from '../classes/Player';

interface PlayerProps {
  player: any;
  onStatsUpdate: (stats: any) => void;
}

export default function PlayerPanel({ player, onStatsUpdate }: PlayerProps) {
  const { position, stats } = player;

  const handleStatChange = (statName, value) => {
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
    <div className="player-panel">
      <div className="player-header">
        <h3>Character Stats</h3>
        <div className="player-position">
          Position: ({position.x}, {position.y})
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-row">
          <span className="stat-label">Level:</span>
          <span className="stat-value">{stats.level}</span>
          <button 
            className="stat-button"
            onClick={handleLevelUp}
            disabled={stats.experience < stats.experienceToNext}
          >
            Level Up
          </button>
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
          <button 
            className="stat-button"
            onClick={handleHeal}
            disabled={stats.health >= stats.maxHealth}
          >
            Heal
          </button>
        </div>

        <div className="stat-row">
          <span className="stat-label">Mana:</span>
          <span className="stat-value">{stats.mana} / {stats.maxMana}</span>
          <button 
            className="stat-button"
            onClick={handleManaRestore}
            disabled={stats.mana >= stats.maxMana}
          >
            Restore
          </button>
        </div>
      </div>

      <div className="attributes-section">
        <h4>Attributes</h4>
        <div className="stat-row">
          <span className="stat-label">Strength:</span>
          <span className="stat-value">{stats.strength}</span>
          <button 
            className="stat-button"
            onClick={() => handleStatChange('strength', stats.strength + 1)}
          >
            +
          </button>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Dexterity:</span>
          <span className="stat-value">{stats.dexterity}</span>
          <button 
            className="stat-button"
            onClick={() => handleStatChange('dexterity', stats.dexterity + 1)}
          >
            +
          </button>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Intelligence:</span>
          <span className="stat-value">{stats.intelligence}</span>
          <button 
            className="stat-button"
            onClick={() => handleStatChange('intelligence', stats.intelligence + 1)}
          >
            +
          </button>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Constitution:</span>
          <span className="stat-value">{stats.constitution}</span>
          <button 
            className="stat-button"
            onClick={() => handleStatChange('constitution', stats.constitution + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="resources-section">
        <div className="stat-row">
          <span className="stat-label">Gold:</span>
          <span className="stat-value">{stats.gold}</span>
          <button 
            className="stat-button"
            onClick={() => handleStatChange('gold', stats.gold + 10)}
          >
            Add 10
          </button>
        </div>
      </div>

      <div className="controls-info">
        <h4>Controls</h4>
        <div className="control-item">
          <span className="control-key">Numpad 1-9</span>
          <span className="control-desc">Move character</span>
        </div>
        <div className="control-item">
          <span className="control-key">Arrow Keys</span>
          <span className="control-desc">Move character</span>
        </div>
        <div className="control-item">
          <span className="control-key">Ctrl+R</span>
          <span className="control-desc">Reset game</span>
        </div>
        <div className="control-item">
          <span className="control-key">Ctrl+S</span>
          <span className="control-desc">Save game</span>
        </div>
        <div className="control-item">
          <span className="control-key">Ctrl+L</span>
          <span className="control-desc">Load game</span>
        </div>
      </div>
    </div>
  );
} 