import { useState } from 'react';
import Game from '../classes/Game';
import Item from '../classes/Item';
import Avatar from './Avatar';
import Box from './Box';
import Controls from './Controls';
import Inventory from './Inventory';
import Outfit from './Outfit';
import PlayerStats from './PlayerStats';
import TabbedPanel from './TabbedPanel';

interface PlayerPanelProps {
  game: Game;
  onUpdate: () => void;
}

export default function PlayerPanel({ 
  game,
  onUpdate
}: PlayerPanelProps) {
  const player = game.player;
  const [selectedInventorySlot, setSelectedInventorySlot] = useState<number | undefined>(undefined);
  const [selectedOutfitSlot, setSelectedOutfitSlot] = useState<string | undefined>(undefined);

  const handleInventorySlotClick = (index: number, item: Item | null) => {
    if (selectedInventorySlot === index) {
      setSelectedInventorySlot(undefined);
    } else {
      setSelectedInventorySlot(index);
    }
    // Clear outfit selection when inventory is selected
    setSelectedOutfitSlot(undefined);
  };

  const handleOutfitSlotClick = (wearLocation: string, item: Item | null) => {
    if (selectedOutfitSlot === wearLocation) {
      setSelectedOutfitSlot(undefined);
    } else {
      setSelectedOutfitSlot(wearLocation);
    }
    // Clear inventory selection when outfit is selected
    setSelectedInventorySlot(undefined);
  };

  const handleWearItem = (index: number, item: Item) => {
    if (player.wearItem(item)) {
      // Remove the item from inventory
      player.removeItem(item);
      onUpdate();
      game.addMessage(`Wore ${item.getName()}`, 'success');
    } else {
      game.addMessage(`Cannot wear ${item.getName()}`, 'error');
    }
  };

  const handleDropItem = (index: number, item: Item) => {
    try {
      const removedItem = player.removeItem(item);
      if (removedItem) {
        onUpdate();
        game.addMessage(`Dropped ${removedItem.getName()}`, 'success');
      }
    } catch (error) {
      if (error instanceof Error) {
        game.addMessage(error.message, 'error');
      } else {
        game.addMessage('Failed to drop item', 'error');
      }
    }
  };

  const handleUseItem = (index: number, item: Item) => {
    game.useItem(player, item);
    onUpdate();
  };

  const handleStatsUpdate = (stats: any) => {
    player.updateStats(stats);
    onUpdate();
  };

  const handlePlayerUpdate = (updatedPlayer: any) => {
    game.updatePlayer(updatedPlayer);
    onUpdate();
  };

  const tabs = [
    {
      id: 'stats',
      icon: 'article_person',
      label: 'Character Stats',
      content: <PlayerStats stats={player.stats} onStatsUpdate={handleStatsUpdate} />
    },
    {
      id: 'outfit',
      icon: 'apparel',
      label: 'Outfit',
      content: <Outfit
        game={game}
        onPlayerUpdate={handlePlayerUpdate}
        onSlotClick={handleOutfitSlotClick}
        selectedSlot={selectedOutfitSlot}
      />
    },
    {
      id: 'inventory',
      icon: 'money_bag',
      label: 'Inventory',
      content: <Inventory
        game={game}
        onUpdate={onUpdate}
        selectedSlot={selectedInventorySlot}
        onSlotClick={handleInventorySlotClick}
      />
    },
 
    {
      id: 'controls',
      icon: 'help',
      label: 'Controls',
      content: <Controls />
    }
  ];

  return (
    <div className="player-panel">
      {/* Avatar Section */}
      <Box>
        <Avatar size={128} />
      </Box>

      <div style={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column'}}>
        <TabbedPanel tabs={tabs} />
      </div>
    </div>
  );
} 