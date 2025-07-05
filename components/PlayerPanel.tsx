import { useState } from 'react';
import Item from '../classes/Item';
import Player from '../classes/Player';
import Avatar from './Avatar';
import Box from './Box';
import Controls from './Controls';
import Inventory from './Inventory';
import Outfit from './Outfit';
import PlayerStats from './PlayerStats';
import TabbedPanel from './TabbedPanel';

interface PlayerProps {
  player: Player;
  onStatsUpdate: (stats: Partial<Player['stats']>) => void;
  onPlayerUpdate?: (player: Player) => void;
}

export default function PlayerPanel({ player, onStatsUpdate, onPlayerUpdate }: PlayerProps) {
  const { position, stats, inventory } = player;
  const [selectedOutfitSlot, setSelectedOutfitSlot] = useState<string | undefined>(undefined);

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

  const handleWearItem = (index: number, item: Item) => {
    if (onPlayerUpdate) {
      // Try to wear the item
      if (player.wearItem(item)) {
        // Remove the item from inventory
        player.removeItem(index);
        onPlayerUpdate(player);
      } else {
        console.log(`Cannot wear ${item.getName()}`);
      }
    }
  };

  const handleOutfitSlotClick = (wearLocation: string, item: Item | null) => {
    console.log(`Selected equipment slot: ${wearLocation}`, item);
    
    // If clicking the same slot, deselect it
    if (selectedOutfitSlot === wearLocation) {
      setSelectedOutfitSlot(undefined);
    } else {
      // Select the new slot
      setSelectedOutfitSlot(wearLocation);
    }
  };

  const tabs = [
    {
      id: 'stats',
      icon: 'article_person',
      label: 'Character Stats',
      content: <PlayerStats stats={stats} onStatsUpdate={onStatsUpdate} />
    },
    {
      id: 'inventory',
      icon: 'money_bag',
      label: 'Inventory',
      content: <Inventory items={inventory} onDropItem={handleDropItem} onUseItem={handleUseItem} onWearItem={handleWearItem} />
    },
    {
      id: 'outfit',
      icon: 'apparel',
      label: 'Outfit',
      content: <Outfit 
        player={player}
        onPlayerUpdate={onPlayerUpdate || (() => {})}
        onSlotClick={handleOutfitSlotClick}
        selectedSlot={selectedOutfitSlot}
      />
    },
    {
      id: 'controls',
      icon: 'keyboard',
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