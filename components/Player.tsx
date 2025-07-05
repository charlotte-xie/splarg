import React from 'react';
import Player from '../classes/Player';
import PlayerStats from './PlayerStats';
import Avatar from './Avatar';
import TabbedPanel from './TabbedPanel';
import Inventory from './Inventory';
import Outfit from './Outfit';

interface PlayerProps {
  player: any;
  onStatsUpdate: (stats: any) => void;
}

export default function PlayerPanel({ player, onStatsUpdate }: PlayerProps) {
  const { position, stats } = player;

  const tabs = [
    {
      id: 'stats',
      icon: '📊',
      label: 'Character Stats',
      content: <PlayerStats stats={stats} onStatsUpdate={onStatsUpdate} />
    },
    {
      id: 'inventory',
      icon: '🎒',
      label: 'Inventory',
      content: <Inventory />
    },
    {
      id: 'outfit',
      icon: '👕',
      label: 'Outfit',
      content: <Outfit />
    },
    {
      id: 'controls',
      icon: '⌨️',
      label: 'Controls',
      content: (
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
      )
    }
  ];

  return (
    <div className="player-panel">
      <div className="player-header">
        <h3>Character Stats</h3>
        <div className="player-position">
          Position: ({position.x}, {position.y})
        </div>
      </div>

      <div className="avatar-section">
        <Avatar 
          src="/images/avatar.png" 
          alt="Player Character"
          size={80}
          className="player-avatar"
        />
      </div>

      <TabbedPanel tabs={tabs} defaultTab="stats" />
    </div>
  );
} 