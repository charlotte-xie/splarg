import React, { useState } from 'react';
import InventorySlot from './InventorySlot';
import Item from '../classes/Item';

interface InventoryProps {
  items?: Item[];
  onSlotClick?: (index: number, item: Item | null) => void;
  selectedSlot?: number;
}

export default function Inventory({ 
  items = [], 
  onSlotClick,
  selectedSlot = -1
}: InventoryProps) {
  const MIN_SLOTS = 12;
  const SLOTS_PER_ROW = 5;
  
  // Calculate how many slots we need (at least MIN_SLOTS, or more if we have more items)
  const totalSlots = Math.max(MIN_SLOTS, items.length);
  const rows = Math.ceil(totalSlots / SLOTS_PER_ROW);

  const handleSlotClick = (index: number) => {
    if (onSlotClick) {
      const item = index < items.length ? items[index] : null;
      onSlotClick(index, item);
    }
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
                  selected={index === selectedSlot}
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
        </div>
      </div>
    </div>
  );
} 