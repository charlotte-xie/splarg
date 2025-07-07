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
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  
  // Calculate how many slots we need (at least MIN_SLOTS, or more if we have more items)
  const totalSlots = Math.max(MIN_SLOTS, items.length);

  const handleSlotClick = (index: number) => {
    const item = index < items.length ? items[index] : null;
    
    // Update selected item
    if (item) {
      setSelectedItemIndex(index);
    } else {
      setSelectedItemIndex(-1);
    }
    
    // Call parent callback if provided
    if (onSlotClick) {
      onSlotClick(index, item);
    }
  };

  const handleDropItem = () => {
    if (selectedItemIndex >= 0 && selectedItemIndex < items.length) {
      const item = items[selectedItemIndex];
      if (game.dropItem(player, item)) {
        game.addMessage(`Dropped ${item.getName()}`, 'success');
        onUpdate();
      } else {
        game.addMessage('Failed to drop item', 'error');
      }
      setSelectedItemIndex(-1);
    }
  };

  const handleWearItem = () => {
    if (selectedItemIndex >= 0 && selectedItemIndex < items.length) {
      const item = items[selectedItemIndex];
      if (player.wearItem(item)) {
        player.removeItem(selectedItemIndex);
        game.addMessage(`Wore ${item.getName()}`, 'success');
        onUpdate();
      } else {
        game.addMessage(`Cannot wear ${item.getName()}`, 'error');
      }
    }
  };

  const handleUseItem = () => {
    if (selectedItemIndex >= 0 && selectedItemIndex < items.length) {
      const item = items[selectedItemIndex];
      switch (item.getId()) {
        case 'healthPotion':
          player.heal(50);
          if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
          } else {
            player.removeItem(selectedItemIndex);
          }
          game.addMessage('Healed 50 HP', 'success');
          break;
        case 'manaPotion':
          // Add mana restoration logic here when implemented
          if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
          } else {
            player.removeItem(selectedItemIndex);
          }
          game.addMessage('Restored 30 MP', 'success');
          break;
        case 'bread':
          player.heal(10);
          if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
          } else {
            player.removeItem(selectedItemIndex);
          }
          game.addMessage('Healed 10 HP', 'success');
          break;
        default:
          game.addMessage(`Used ${item.getName()}`, 'info');
          break;
      }
      onUpdate();
    }
  };

  const selectedItem = selectedItemIndex >= 0 && selectedItemIndex < items.length 
    ? items[selectedItemIndex] 
    : null;

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

    buttons.push({
      label: 'Drop',
      variant: 'danger',
      onClick: handleDropItem
    });

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
                selected={index === selectedItemIndex}
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