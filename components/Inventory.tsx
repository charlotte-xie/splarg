import React, { useState } from 'react';
import InventorySlot from './InventorySlot';
import Item from '../classes/Item';
import Button from './Button';

interface InventoryProps {
  items?: Item[];
  onSlotClick?: (index: number, item: Item | null) => void;
  selectedSlot?: number;
  onDropItem?: (index: number, item: Item) => void;
  onUseItem?: (index: number, item: Item) => void;
}

export default function Inventory({ 
  items = [], 
  onSlotClick,
  selectedSlot = -1,
  onDropItem,
  onUseItem
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

  const selectedItem = selectedItemIndex >= 0 && selectedItemIndex < items.length 
    ? items[selectedItemIndex] 
    : null;

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
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#1a202c',
            borderRadius: '6px',
            border: '1px solid #d69e2e',
            color: '#e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>{selectedItem.getSymbol()}</span>
              <h5 style={{ 
                margin: 0, 
                color: '#d69e2e',
                fontSize: '14px'
              }}>
                {selectedItem.getName()}
                {selectedItem.hasMultiple() && ` (${selectedItem.getQuantity()})`}
              </h5>
            </div>
            <p style={{
              margin: '8px 0',
              fontSize: '12px',
              color: '#a0aec0',
              lineHeight: '1.4'
            }}>
              {selectedItem.getDescription()}
            </p>
            <div style={{
              fontSize: '11px',
              color: '#718096',
              borderTop: '1px solid #4a5568',
              paddingTop: '8px',
              marginTop: '8px',
              marginBottom: '12px'
            }}>
              <div>Type: {selectedItem.getId()}</div>
              <div>Stackable: {selectedItem.isStackable() ? 'Yes' : 'No'}</div>
              {selectedItem.hasMultiple() && (
                <div>Quantity: {selectedItem.getQuantity()}</div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-end'
            }}>
              <Button
                variant="primary"
                size="small"
                onClick={handleUseItem}
              >
                Use
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={handleDropItem}
              >
                Drop
              </Button>
            </div>
          </div>
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