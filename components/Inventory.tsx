import React, { useState } from 'react';
import InventorySlot from './InventorySlot';
import Item from '../classes/Item';
import Button from './Button';
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
  const SLOTS_PER_ROW = 5;
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  
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
      <h4>Inventory</h4>
      <div style={{ 
        padding: '6px', 
        backgroundColor: 'var(--leather-dark)', 
        borderRadius: '8px',
        border: '1px solid #4a5568',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${SLOTS_PER_ROW}, 1fr)`, 
          gap: '5px',
          width: '100%'
        }}>
          {Array.from({ length: totalSlots }, (_, index) => {
            const item = index < items.length ? items[index] : null;
            return (
              <div key={index} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <InventorySlot
                  item={item}
                  size={36}
                  selected={index === selectedItemIndex}
                  onClick={() => handleSlotClick(index)}
                />
              </div>
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
        
        <div style={{
          marginTop: '16px',
          padding: '8px',
          backgroundColor: '#1a202c',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#a0aec0'
        }}>
          <div>Total Items: {items.length}</div>
          <div>Total Slots: {totalSlots}</div>
          {selectedItem && (
            <div>Selected: {selectedItem.getName()}</div>
          )}
        </div>
      </div>
    </div>
  );
} 