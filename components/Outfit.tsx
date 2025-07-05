import React from 'react';
import Item from '../classes/Item';
import { WEAR_TYPES, WEAR_LAYERS, WearType, WearLayer, createWearLocation } from '../classes/Item';
import InventorySlot from './InventorySlot';
import Button from './Button';

interface OutfitProps {
  wornItems: Map<string, Item>;
  onSlotClick?: (wearLocation: string, item: Item | null) => void;
  selectedSlot?: string;
}

export default function Outfit({ wornItems, onSlotClick, selectedSlot }: OutfitProps) {
  // Define the wear areas we want to display in order
  const allWearAreas: WearType[] = [
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

  // Always show these essential areas
  const essentialAreas: WearType[] = [
    WEAR_TYPES.head,
    WEAR_TYPES.chest,
    WEAR_TYPES.belly,
    WEAR_TYPES.hips,
    WEAR_TYPES.feet,
    WEAR_TYPES.hand
  ];

  // Determine which areas to show based on whether items are worn
  const hasWornItems = wornItems.size > 0;
  const wearAreas = hasWornItems ? allWearAreas : essentialAreas;

  const handleSlotClick = (wearLocation: string, item: Item | null) => {
    if (onSlotClick) {
      onSlotClick(wearLocation, item);
    }
  };

  // Helper function to get item for a specific wear location
  const getItemForLocation = (wearArea: WearType, layer: WearLayer): Item | null => {
    const wearLocation = createWearLocation(wearArea, layer);
    return wornItems.get(wearLocation) || null;
  };

  // Helper function to check if a slot should be selected
  const isSlotSelected = (wearArea: WearType, layer: WearLayer, item: Item | null): boolean => {
    if (!selectedSlot || !item) return false;
    
    const currentLocation = createWearLocation(wearArea, layer);
    
    // If this exact slot is selected, show as selected
    if (selectedSlot === currentLocation) return true;
    
    // If the selected slot contains the same item, check if this is the primary location
    const selectedItem = wornItems.get(selectedSlot);
    if (selectedItem && selectedItem.getId() === item.getId()) {
      const wearLocations = item.getWearLocations();
      if (wearLocations && wearLocations.length > 0) {
        // Only show as selected if this is the first/primary location for the item
        return currentLocation === wearLocations[0];
      }
    }
    
    return false;
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
          gridTemplateColumns: '80px min-content min-content min-content',
          gap: '0px',
          alignItems: 'center',
          fontSize: '13px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Header row */}
          <div style={{ fontWeight: 'bold', color: '#d69e2e', fontSize: '12px' }}>Location</div>
          <div style={{ fontWeight: 'bold', color: '#d69e2e', textAlign: 'center', fontSize: '12px' }}>Outer</div>
          <div style={{ fontWeight: 'bold', color: '#d69e2e', textAlign: 'center', fontSize: '12px' }}>Inner</div>
          <div style={{ fontWeight: 'bold', color: '#d69e2e', textAlign: 'center', fontSize: '12px' }}>Under</div>
          
          {/* Equipment rows */}
          {wearAreas.map((wearArea) => {
            const outerItem = getItemForLocation(wearArea, WEAR_LAYERS.outer);
            const innerItem = getItemForLocation(wearArea, WEAR_LAYERS.inner);
            const underItem = getItemForLocation(wearArea, WEAR_LAYERS.under);
            
            return (
              <React.Fragment key={wearArea}>
                <div style={{ 
                  color: '#e2e8f0', 
                  fontSize: '11px',
                  textTransform: 'capitalize',
                  textAlign: 'left',
                  fontWeight: '500'
                }}>
                  {wearArea}
                </div>
                <InventorySlot
                  item={outerItem || null}
                  size={32}
                  selected={isSlotSelected(wearArea, WEAR_LAYERS.outer, outerItem)}
                  onClick={() => handleSlotClick(createWearLocation(wearArea, WEAR_LAYERS.outer), outerItem || null)}
                />
                <InventorySlot
                  item={innerItem || null}
                  size={32}
                  selected={isSlotSelected(wearArea, WEAR_LAYERS.inner, innerItem)}
                  onClick={() => handleSlotClick(createWearLocation(wearArea, WEAR_LAYERS.inner), innerItem || null)}
                />
                <InventorySlot
                  item={underItem || null}
                  size={32}
                  selected={isSlotSelected(wearArea, WEAR_LAYERS.under, underItem)}
                  onClick={() => handleSlotClick(createWearLocation(wearArea, WEAR_LAYERS.under), underItem || null)}
                />
              </React.Fragment>
            );
          })}
        </div>
        
        <div style={{
          marginTop: '16px',
          padding: '8px',
          backgroundColor: '#1a202c',
          borderRadius: '4px',
          fontSize: '13px',
          color: '#a0aec0'
        }}>
          <div>Equipped Items: {wornItems.size}</div>
          <div>Available Slots: {wearAreas.length * 3}</div>
        </div>
      </div>
    </div>
  );
} 