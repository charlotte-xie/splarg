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
  const player = game.player;
  const items = player.getInventory();
  const MIN_SLOTS = 30;
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
      game.dropItem(player, selectedItem);
      setSelectedItem(null);
      onUpdate();
    }
  };

  const handleDropOne = () => {
    if (selectedItem) {
      game.dropItem(player, selectedItem, 1);
      onUpdate();
    }
  };

  const handleWearItem = () => {
    if (selectedItem) {
      game.wearItem(player, selectedItem);
      setSelectedItem(null);
      onUpdate();
    }
  };

  const handleUseItem = () => {
    if (selectedItem) {
      game.useItem(player, selectedItem);
      // If the item is no longer in inventory, clear selection
      if (!player.getInventory().includes(selectedItem)) {
        setSelectedItem(null);
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
    <div className="inventory" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
    }}>
      <h4>Inventory</h4>
      <div
        style={{
          flex: '1 1 0',
          minHeight: 0,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: gridTemplateColumns,
          justifyContent: 'center',
          alignContent: 'start',
          gap: '3px',
          overflowX: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
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
      {/* Selected Item Details always at the bottom */}
      <div style={{ flexShrink: 0 }}>
        <ItemDetails
          item={selectedItem}
          actionButtons={getActionButtons(selectedItem)}
        />
      </div>
    </div>
  );
} 