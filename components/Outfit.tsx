import React from 'react';
import Item from '../classes/Item';
import { WEAR_TYPES, WearType } from '../classes/Item';
import InventorySlot from './InventorySlot';
import Button from './Button';

interface OutfitProps {
  wornItems: Map<string, Item>;
  onRemoveItem?: (wearLocation: string) => void;
}

export default function Outfit({ wornItems, onRemoveItem }: OutfitProps) {
  // Define the wear areas we want to display in order
  const wearAreas: WearType[] = [
    WEAR_TYPES.head,
    WEAR_TYPES.face,
    WEAR_TYPES.neck,
    WEAR_TYPES.chest,
    WEAR_TYPES.belly,
    WEAR_TYPES.arm,
    WEAR_TYPES.hand,
    WEAR_TYPES.waist,
    WEAR_TYPES.hips,
    WEAR_TYPES.legs,
    WEAR_TYPES.feet
  ];

  const handleRemoveItem = (wearLocation: string) => {
    if (onRemoveItem) {
      onRemoveItem(wearLocation);
    }
  };

  return (
    <div className="outfit">
      <h4>Equipment</h4>
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
          gridTemplateColumns: '120px 1fr 1fr 1fr',
          gap: '8px',
          alignItems: 'center',
          fontSize: '12px'
        }}>
          {/* Header row */}
          <div style={{ fontWeight: 'bold', color: '#d69e2e' }}>Location</div>
          <div style={{ fontWeight: 'bold', color: '#d69e2e', textAlign: 'center' }}>Outer</div>
          <div style={{ fontWeight: 'bold', color: '#d69e2e', textAlign: 'center' }}>Inner</div>
          <div style={{ fontWeight: 'bold', color: '#d69e2e', textAlign: 'center' }}>Under</div>
          
          {/* Equipment rows */}
          {wearAreas.map((wearArea) => {
            const item = wornItems.get(wearArea);
            return (
              <React.Fragment key={wearArea}>
                <div style={{ 
                  color: '#e2e8f0', 
                  fontSize: '11px',
                  textTransform: 'capitalize',
                  padding: '4px 0'
                }}>
                  {wearArea}
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '40px',
                  padding: '4px'
                }}>
                  {item && (
                    <div style={{ position: 'relative' }}>
                      <InventorySlot
                        item={item}
                        size={32}
                        onClick={() => {}}
                      />
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleRemoveItem(wearArea)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '16px',
                          height: '16px',
                          padding: '0',
                          fontSize: '8px',
                          borderRadius: '50%',
                          minWidth: 'auto'
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '40px',
                  padding: '4px'
                }}>
                  {/* Inner layer - currently empty */}
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '40px',
                  padding: '4px'
                }}>
                  {/* Under layer - currently empty */}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        
        <div style={{
          marginTop: '16px',
          padding: '8px',
          backgroundColor: '#1a202c',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#a0aec0'
        }}>
          <div>Equipped Items: {wornItems.size}</div>
          <div>Available Slots: {wearAreas.length * 3}</div>
        </div>
      </div>
    </div>
  );
} 