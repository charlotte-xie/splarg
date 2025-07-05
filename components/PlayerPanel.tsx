import React from 'react';
import Player from '../classes/Player';
import PlayerStats from './PlayerStats';
import Avatar from './Avatar';
import TabbedPanel from './TabbedPanel';
import Inventory from './Inventory';
import Outfit from './Outfit';
import Controls from './Controls';
import Box from './Box';
import DebugPanel from './DebugPanel';
import { createRandomItem } from '../classes/Item';
import Item from '../classes/Item';

interface PlayerProps {
  player: any;
  onStatsUpdate: (stats: any) => void;
  onPlayerUpdate?: (player: any) => void;
}

export default function PlayerPanel({ player, onStatsUpdate, onPlayerUpdate }: PlayerProps) {
  const { position, stats, inventory } = player;

  const handleAddRandomItem = () => {
    if (onPlayerUpdate) {
      const randomItem = createRandomItem();
      player.addItem(randomItem);
      onPlayerUpdate(player);
    }
  };

  const handleAddGold = () => {
    if (onPlayerUpdate) {
      player.addGold(100);
      onPlayerUpdate(player);
    }
  };

  const handleHealPlayer = () => {
    if (onPlayerUpdate) {
      player.heal(50);
      onPlayerUpdate(player);
    }
  };

  const handleResetPlayer = () => {
    if (onPlayerUpdate) {
      // Create a new player instance with default values
      const newPlayer = new Player();
      onPlayerUpdate(newPlayer);
    }
  };

  const handleDropItem = (index: number, item: Item) => {
    if (onPlayerUpdate) {
      player.removeItem(index);
      onPlayerUpdate(player);
    }
  };

  const handleUseItem = (index: number, item: Item) => {
    if (onPlayerUpdate) {
      // Handle different item types
      switch (item.getId()) {
        case 'healthPotion':
          player.heal(50);
          // Remove one potion from stack
          if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
          } else {
            player.removeItem(index);
          }
          break;
        case 'manaPotion':
          // Add mana restoration logic here when implemented
          console.log('Used mana potion');
          // Remove one potion from stack
          if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
          } else {
            player.removeItem(index);
          }
          break;
        case 'bread':
          player.heal(10);
          // Remove one bread from stack
          if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
          } else {
            player.removeItem(index);
          }
          break;
        default:
          console.log(`Used ${item.getName()}`);
          break;
      }
      onPlayerUpdate(player);
    }
  };

  const tabs = [
    {
      id: 'stats',
      icon: 'analytics',
      label: 'Character Stats',
      content: <PlayerStats stats={stats} onStatsUpdate={onStatsUpdate} />
    },
    {
      id: 'inventory',
      icon: 'inventory',
      label: 'Inventory',
      content: <Inventory items={inventory} onDropItem={handleDropItem} onUseItem={handleUseItem} />
    },
    {
      id: 'outfit',
      icon: 'style',
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
      
      <DebugPanel
        onAddRandomItem={handleAddRandomItem}
        onAddGold={handleAddGold}
        onHealPlayer={handleHealPlayer}
        onResetPlayer={handleResetPlayer}
      />
    </div>
  );
} 