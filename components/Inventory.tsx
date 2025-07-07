import { useState } from 'react';
import Game from '../classes/Game';
import Item from '../classes/Item';
import InventorySlot from './InventorySlot';
import ItemDetails from './ItemDetails';

interface InventoryProps {
  game: Game;
  onUpdate: () => void;
  onSlotClick?: (index: number, item: Item | null) => void;
  selectedSlot?: number;
}

export default function Inventory({ 
  game,
  onUpdate,
  onSlotClick,
  selectedSlot = -1
}: InventoryProps) {
  const player = game.getPlayer();
  const items = player.getInventory();
  const MIN_SLOTS = 20;
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // Calculate how many slots we need (at least MIN_SLOTS, or more if we have more items)
  const totalSlots = Math.max(MIN_SLOTS, items.length);

  const handleSlotClick = (index: number) => {
    const item = index < items.length ? items[index] : null;
    setSelectedItem(item);
    if (onSlotClick) {
      onSlotClick(index, item);
    }
  };

  const handleDropItem = () => {
    if (selectedItem) {
      if (game.dropItem(player, selectedItem)) {
        game.addMessage(`Dropped ${selectedItem.getName()}`, 'success');
      } else {
        game.addMessage('Failed to drop item', 'error');
      }
      setSelectedItem(null);
      onUpdate();
    }
  };

  const handleDropOne = () => {
    if (selectedItem) {
      if (selectedItem.getQuantity() > 1) {
        if (game.dropItem(player, selectedItem, 1)) {
          game.addMessage(`Dropped 1 ${selectedItem.getName()}`, 'success');
        } else {
          game.addMessage('Failed to drop item', 'error');
        }
      } else {
        handleDropItem();
      }
      onUpdate();
    }
  };

  const handleWearItem = () => {
    if (selectedItem) {
      try{
        if (player.wearItem(selectedItem)) {
          const idx = items.indexOf(selectedItem);
          if (idx !== -1) player.removeItem(idx);
          setSelectedItem(null);
          game.addMessage(`Wore ${selectedItem.getName()}`, 'success');
        } else {
          game.addMessage(`Cannot wear ${selectedItem.getName()}`, 'error');
        }
      } catch(e: any) {
        game.addMessage(`Cannot wear ${selectedItem.getName()}: ` +e.message, 'error');
      }
      onUpdate();
    }
  };

  const handleUseItem = () => {
    if (selectedItem) {
      switch (selectedItem.getId()) {
        case 'healthPotion':
          if (selectedItem.getQuantity() > 1) {
            selectedItem.setQuantity(selectedItem.getQuantity() - 1);
          } else {
            const idx = items.indexOf(selectedItem);
            if (idx !== -1) player.removeItem(idx);
          }
          game.addMessage('Healed 50 HP', 'success');
          break;
        case 'manaPotion':
          if (selectedItem.getQuantity() > 1) {
            selectedItem.setQuantity(selectedItem.getQuantity() - 1);
          } else {
            const idx = items.indexOf(selectedItem);
            if (idx !== -1) player.removeItem(idx);
          }
          game.addMessage('Restored 30 MP', 'success');
          break;
        case 'bread':
          if (selectedItem.getQuantity() > 1) {
            selectedItem.setQuantity(selectedItem.getQuantity() - 1);
          } else {
            const idx = items.indexOf(selectedItem);
            if (idx !== -1) player.removeItem(idx);
          }
          game.addMessage('Healed 10 HP', 'success');
          break;
        default:
          game.addMessage(`Used ${selectedItem.getName()}`, 'info');
          break;
      }
      onUpdate();
    }
  };

  // Create action buttons for the selected item
  const getActionButtons = (item: Item | null) => {
    if (!item) return [];
    const buttons: Array<{
      label: string;
      variant: 'primary' | 'secondary' | 'success' | 'danger';
      onClick: () => void;
      disabled?: boolean;
    }> = [
      {
        label: 'Use',
        variant: 'primary',
        onClick: handleUseItem
      }
    ];

    if (item.isWearable()) {
      buttons.push({
        label: 'Wear',
        variant: 'success',
        onClick: handleWearItem
      });
    }

    if (item.getQuantity() > 1) {
      buttons.push({
        label: 'Drop 1',
        variant: 'danger',
        onClick: handleDropOne
      });
      buttons.push({
        label: 'Drop All',
        variant: 'danger',
        onClick: handleDropItem
      });
    } else {
      buttons.push({
        label: 'Drop',
        variant: 'danger',
        onClick: handleDropItem
      });
    }

    return buttons;
  };

  // Use fixed 5-column grid with proper sizing
  const gridTemplateColumns = `repeat(auto-fill,48px)`;

  return (
    <div className="inventory">
        <h4>Inventory</h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: gridTemplateColumns, 
          justifyContent: 'center',
          gap: '5px',
          overflowX: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {Array.from({ length: totalSlots }, (_, index) => {
            const item = index < items.length ? items[index] : null;
            return (
              <InventorySlot
                key={index}
                item={item}
                selected={item ? item === selectedItem : false}
                onClick={() => handleSlotClick(index)}
              />
            );
          })}
        </div>
        
        {/* Selected Item Details */}
          <ItemDetails 
            item={selectedItem}
            actionButtons={getActionButtons(selectedItem)}
          />
    </div>
  );
} 