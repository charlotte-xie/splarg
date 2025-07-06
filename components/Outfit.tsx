import React from 'react';
import Game from '../classes/Game';
import Item, { createWearLocation, WEAR_LAYERS, WEAR_TYPES, WearLayer, WearType } from '../classes/Item';
import InventorySlot from './InventorySlot';
import ItemDetails from './ItemDetails';
import OutfitManagement from './OutfitManagement';

interface OutfitProps {
  game: Game;
  onPlayerUpdate: (player: any) => void;
  selectedSlot?: string;
  onSlotClick?: (wearLocation: string, item: Item | null) => void;
}

/* Component for displaying the player's outfit slots and details of equiped items */
export default function Outfit({ 
  game,
  onPlayerUpdate,
  selectedSlot,
  onSlotClick
}: OutfitProps) {
  const player = game.getPlayer();
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
            try {
              // Remove the item from worn items
              const removedItem = player.removeWornItem(selectedSlot);
              if (removedItem) {
                // Add the item back to inventory
                player.addItem(removedItem);
                onPlayerUpdate(player);
                game.addMessage(`Removed ${removedItem.getName()} from ${selectedSlot}`, 'success');
              }
            } catch (error) {
              // Handle locked item exception
              if (error instanceof Error) {
                game.addMessage(error.message, 'error');
              } else {
                game.addMessage('Failed to remove item', 'error');
              }
              // Always call onPlayerUpdate to trigger re-render even when removal fails
              onPlayerUpdate(player);
            }
          }
        }
      }
    ];
  };

  return (
    <div>
      <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 48px 48px 48px',
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
                  selected={isSlotSelected(wearArea, WEAR_LAYERS.outer, outerItem)}
                  onClick={() => handleSlotClick(createWearLocation(wearArea, WEAR_LAYERS.outer), outerItem || null)}
                />
                <InventorySlot
                  item={innerItem || null}
                  selected={isSlotSelected(wearArea, WEAR_LAYERS.inner, innerItem)}
                  onClick={() => handleSlotClick(createWearLocation(wearArea, WEAR_LAYERS.inner), innerItem || null)}
                />
                <InventorySlot
                  item={underItem || null}
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
        <OutfitManagement 
          game={game}
          onPlayerUpdate={onPlayerUpdate}
        />
    </div>
  );
} 