import React, { useState } from 'react';
import Item, { WEAR_LAYERS, WEAR_TYPES, WearLayer, WearType, createWearLocation } from '../classes/Item';
import Player from '../classes/Player';
import Button from './Button';
import InventorySlot from './InventorySlot';
import ItemDetails from './ItemDetails';

interface OutfitProps {
  player: Player;
  onPlayerUpdate: (player: Player) => void;
  selectedSlot?: string;
  onSlotClick?: (wearLocation: string, item: Item | null) => void;
}

export default function Outfit({ 
  player, 
  onPlayerUpdate,
  selectedSlot,
  onSlotClick
}: OutfitProps) {
  const [outfitName, setOutfitName] = useState('');
  const [selectedOutfit, setSelectedOutfit] = useState('');

  const wornItems = player.getWornItems();

  // Use all wear types from the Item class
  const allWearAreas: WearType[] = Object.values(WEAR_TYPES);

  // Always show these essential areas
  const essentialAreas: WearType[] = [
    WEAR_TYPES.head,
    WEAR_TYPES.chest,
    WEAR_TYPES.belly,
    WEAR_TYPES.hips,
    WEAR_TYPES.feet,
    WEAR_TYPES.hand
  ];

  // Helper function to check if a wear area has any worn items
  const hasWornItemsInArea = (wearArea: WearType): boolean => {
    const outerItem = wornItems.get(createWearLocation(wearArea, WEAR_LAYERS.outer));
    const innerItem = wornItems.get(createWearLocation(wearArea, WEAR_LAYERS.inner));
    const underItem = wornItems.get(createWearLocation(wearArea, WEAR_LAYERS.under));
    return !!(outerItem || innerItem || underItem);
  };

  // Determine which areas to show: essential areas + areas with worn items
  const areasWithWornItems = allWearAreas.filter(hasWornItemsInArea);
  const wearAreas = [...new Set([...essentialAreas, ...areasWithWornItems])].sort((a, b) => {
    // Sort by the order they appear in allWearAreas
    return allWearAreas.indexOf(a) - allWearAreas.indexOf(b);
  });

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

  // Get the selected item
  const selectedItem = selectedSlot ? wornItems.get(selectedSlot) : null;

  // Create action buttons for the selected worn item
  const getActionButtons = (item: Item) => {
    return [
      {
        label: 'Remove',
        variant: 'danger' as const,
        onClick: () => {
          if (selectedSlot) {
            // Remove the item from worn items
            const removedItem = player.removeWornItem(selectedSlot);
            if (removedItem) {
              // Add the item back to inventory
              player.addItem(removedItem);
              onPlayerUpdate(player);
            }
          }
        }
      }
    ];
  };

  const handleSaveOutfit = () => {
    if (outfitName.trim()) {
      if (player.saveOutfit(outfitName.trim())) {
        setOutfitName('');
        onPlayerUpdate(player);
        console.log(`Saved outfit: ${outfitName.trim()}`);
      } else {
        console.log('Failed to save outfit');
      }
    }
  };

  const handleWearOutfit = () => {
    if (selectedOutfit) {
      if (player.wearOutfit(selectedOutfit)) {
        onPlayerUpdate(player);
        console.log(`Wearing outfit: ${selectedOutfit}`);
      } else {
        console.log('Failed to wear outfit');
      }
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
        
        {/* Selected Item Details */}
        {selectedItem && (
          <ItemDetails 
            item={selectedItem}
            actionButtons={getActionButtons(selectedItem)}
          />
        )}
        
        {/* Outfit Management */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#1a202c',
          borderRadius: '6px',
          border: '1px solid #4a5568'
        }}>
          <h5 style={{ 
            margin: '0 0 12px 0', 
            color: '#d69e2e',
            fontSize: '13px'
          }}>
            Outfit Management
          </h5>
          
          {/* Save Outfit */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <input
              type="text"
              placeholder="Outfit name..."
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              style={{
                flex: 1,
                padding: '6px 8px',
                backgroundColor: '#2d3748',
                border: '1px solid #4a5568',
                borderRadius: '4px',
                color: '#e2e8f0',
                fontSize: '12px'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSaveOutfit();
                }
              }}
            />
            <Button
              variant="primary"
              size="small"
              onClick={handleSaveOutfit}
              disabled={!outfitName.trim()}
            >
              Save
            </Button>
          </div>
          
          {/* Wear Outfit */}
          {player.getOutfitNames().length > 0 && (
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <select
                value={selectedOutfit}
                onChange={(e) => setSelectedOutfit(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  backgroundColor: '#2d3748',
                  border: '1px solid #4a5568',
                  borderRadius: '4px',
                  color: '#e2e8f0',
                  fontSize: '12px'
                }}
              >
                <option value="">Select outfit...</option>
                {player.getOutfitNames().map(outfitName => (
                  <option key={outfitName} value={outfitName}>
                    {outfitName}
                  </option>
                ))}
              </select>
              <Button
                variant="success"
                size="small"
                onClick={handleWearOutfit}
                disabled={!selectedOutfit}
              >
                Wear
              </Button>
            </div>
          )}
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
          <div>Saved Outfits: {player.getOutfitNames().length}</div>
        </div>
      </div>
    </div>
  );
} 