import { useState } from 'react';
import Item from '../classes/Item';
import InventorySlot from './InventorySlot';
import ItemDetails from './ItemDetails';

interface InventoryProps {
  items?: Item[];
  onSlotClick?: (index: number, item: Item | null) => void;
  selectedSlot?: number;
  onDropItem?: (index: number, item: Item) => void;
  onUseItem?: (index: number, item: Item) => void;
  onWearItem?: (index: number, item: Item) => void;
}

export default function Inventory({ 
  items = [], 
  onSlotClick,
  selectedSlot = -1,
  onDropItem,
  onUseItem,
  onWearItem
}: InventoryProps) {
  const MIN_SLOTS = 20;
  const SLOTS_PER_ROW = 4;
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  
  // Use fixed 5-column grid with proper sizing
  const gridTemplateColumns = `repeat(${SLOTS_PER_ROW}, 48px)`;
  
  // Calculate how many slots we need (at least MIN_SLOTS, or more if we have more items)
  const totalSlots = Math.max(MIN_SLOTS, items.length);
  const rows = Math.ceil(totalSlots / SLOTS_PER_ROW);

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
    if (selectedItemIndex >= 0 && selectedItemIndex < items.length && onDropItem) {
      onDropItem(selectedItemIndex, items[selectedItemIndex]);
      setSelectedItemIndex(-1); // Deselect after dropping
    }
  };

  const handleUseItem = () => {
    if (selectedItemIndex >= 0 && selectedItemIndex < items.length && onUseItem) {
      onUseItem(selectedItemIndex, items[selectedItemIndex]);
    }
  };

  const handleWearItem = () => {
    if (selectedItemIndex >= 0 && selectedItemIndex < items.length && onWearItem) {
      onWearItem(selectedItemIndex, items[selectedItemIndex]);
    }
  };

  const selectedItem = selectedItemIndex >= 0 && selectedItemIndex < items.length 
    ? items[selectedItemIndex] 
    : null;

  // Create action buttons for the selected item
  const getActionButtons = (item: Item) => {
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

  return (
    <div className="inventory">
      <div style={{ 
        padding: '6px', 
        backgroundColor: 'var(--leather-dark)', 
        borderRadius: '8px',
        border: '1px solid #4a5568',
        width: '100%',
        boxSizing: 'border-box',
        minWidth: 0,
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: gridTemplateColumns, 
          gap: '5px',
          justifyContent: 'center',
          width: '100%'
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
        
        {items.length === 0 && (
          <p style={{ 
            color: '#a0aec0', 
            textAlign: 'center',
            marginTop: '16px',
            fontStyle: 'italic'
          }}>
            Inventory is empty
          </p>
        )}
        
        {/* Selected Item Details */}
        {selectedItem && (
          <ItemDetails 
            item={selectedItem}
            actionButtons={getActionButtons(selectedItem)}
          />
        )}
      </div>
    </div>
  );
} 