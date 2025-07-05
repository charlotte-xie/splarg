import React from 'react';
import Player from '../classes/Player';
import PlayerStats from './PlayerStats';
import Avatar from './Avatar';
import TabbedPanel from './TabbedPanel';
import Inventory from './Inventory';
import Outfit from './Outfit';
import Controls from './Controls';
import Box from './Box';

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
      content: <Controls />
    }
  ];

  return (
    <div className="player-panel">
      <div className="avatar-section">
        <Box variant="brass" style={{ padding: '3px', aspectRatio: '1 / 1' }}>
          <Avatar 
            src="/images/avatar.png" 
            alt="Player Character"
            className="player-avatar"
          />
        </Box>
      </div>

      <TabbedPanel tabs={tabs} defaultTab="stats" />
    </div>
  );
} 