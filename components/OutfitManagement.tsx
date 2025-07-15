import { useState } from 'react';
import Game from '../classes/Game';
import Item from '../classes/Item';
import Button from './Button';

interface OutfitManagementProps {
  game: Game;
  onPlayerUpdate: (player: any) => void;
}

export default function OutfitManagement({ game, onPlayerUpdate }: OutfitManagementProps) {
  const player = game.player;
  const [outfitName, setOutfitName] = useState('Everyday');
  const [selectedOutfit, setSelectedOutfit] = useState('');

  const handleSaveOutfit = () => {
    if (outfitName.trim()) {
      if (player.saveOutfit(outfitName.trim())) {
        onPlayerUpdate(player);
        game.addMessage(`Saved outfit: ${outfitName.trim()}`, 'success');
      } else {
        game.addMessage('Failed to save outfit', 'error');
      }
    }
  };

  const getOutfitItems = (outfitName: string): Item[] => {
    const itemIds = player.outfits.get(outfitName);
    if (!itemIds) return [];
    // Find each item by ID in inventory or currently worn items
    return itemIds.map(id => {
      let item = player.getInventory().find(i => i.getId() === id);
      if (!item) {
        // Try to find in worn items
        for (const wornItem of player.getWornItems().values()) {
          if (wornItem.getId() === id) return wornItem;
        }
      }
      return item!;
    }).filter(Boolean) as Item[];
  };

  const handleWearOutfit = () => {
    if (selectedOutfit) {
      const outfitItemIds = player.outfits.get(selectedOutfit);
      if (outfitItemIds) {
        // Remove any currently worn items not in the target outfit
        const wornItems = player.getWornItems();
        for (const [location, item] of wornItems) {
          if (!outfitItemIds.includes(item.getId())) {
            try {
              player.removeWornItem(location);
            } catch (e) {
              // Ignore errors for locked items
            }
          }
        }
        // Now wear the outfit items
        getOutfitItems(selectedOutfit).forEach(item => {
          try {
            player.wearItem(item);
          } catch (e) {
            // Ignore errors for locked/restricted items
          }
        });
        setOutfitName(selectedOutfit);
        onPlayerUpdate(player);
        game.addMessage(`Wearing outfit: ${selectedOutfit}`, 'success');
      }
    }
  };

  const handleAddOutfit = () => {
    if (selectedOutfit) {
      getOutfitItems(selectedOutfit).forEach(item => {
        try {
          player.wearItem(item);
        } catch (e) {
          // Ignore errors for locked/restricted items
        }
      });
      onPlayerUpdate(player);
      game.addMessage(`Added items from outfit: ${selectedOutfit}`, 'success');
    }
  };

  const handleRemoveAll = () => {
    try {
      const wornItems = player.getWornItems();
      const uniqueWornItems = new Set<string>();
      
      // Collect all unique worn items
      wornItems.forEach((item) => {
        uniqueWornItems.add(item.getId());
      });
      
      let removedCount = 0;
      let lockedCount = 0;
      
      // Try to remove each unique item
      uniqueWornItems.forEach(itemId => {
        // Find the item in worn items
        for (const [location, item] of wornItems) {
          if (item.getId() === itemId) {
            try {
              const removedItem = player.removeWornItem(location);
              if (removedItem) {
                player.addItem(removedItem);
                removedCount++;
              }
            } catch (error) {
              lockedCount++;
            }
            break; // Only remove the first occurrence of this item
          }
        }
      });
      
      if (removedCount > 0 && lockedCount > 0) {
        game.addMessage(`Removed ${removedCount} items, ${lockedCount} items were locked`, 'warning');
      } else if (removedCount > 0) {
        game.addMessage(`Removed ${removedCount} items`, 'success');
      } else if (lockedCount > 0) {
        game.addMessage(`All ${lockedCount} items are locked and cannot be removed`, 'error');
      } else {
        game.addMessage('No items to remove', 'info');
      }
    } catch (error) {
      game.addMessage('Failed to remove items', 'error');
    }
    onPlayerUpdate(player);
  };

  const handleDeleteOutfit = () => {
    if (selectedOutfit) {
      if (player.deleteOutfit(selectedOutfit)) {
        setSelectedOutfit('');
        game.addMessage(`Deleted outfit: ${selectedOutfit}`, 'success');
      } else {
        game.addMessage('Failed to delete outfit', 'error');
      }
    }
    onPlayerUpdate(player);
  };

  // Determine if the current outfitName matches an existing outfit
  const isOverwrite = outfitName.trim() && player.getOutfitNames().includes(outfitName.trim());

  return (
    <div className="control-panel">
      <h4>
        Outfit Management
      </h4>
      
      <div className="control-panel-grid">
        {/* Save Outfit */}
        <div className="control-panel-row">
          <input
            type="text"
            placeholder="Outfit name..."
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSaveOutfit();
              }
            }}
            className="control-panel-input"
            style={{ minWidth: 100, flexGrow: 1 }}
          />
          <Button
            onClick={handleSaveOutfit}
            disabled={!outfitName.trim()}
          >
            {isOverwrite ? 'Overwrite' : 'Save'}
          </Button>
        </div>

        {/* Wear Outfit */}
        {
          <div className="control-panel-row" style={{ width: '100%' }}>
            <select
              value={selectedOutfit}
              onChange={(e) => setSelectedOutfit(e.target.value)}
              className="control-panel-input"
              style={{ flex: 1, minWidth: 100, flexGrow: 1 }}
            >
              <option value="">Select outfit...</option>
              {player.getOutfitNames().map(outfitName => (
                <option key={outfitName} value={outfitName}>
                  {outfitName}
                </option>
              ))}
            </select>
            <Button
              onClick={handleWearOutfit}
              disabled={!selectedOutfit}
              forbidden={game.compelled || undefined}
            >
              Wear
            </Button>
            <Button
              onClick={handleAddOutfit}
              disabled={!selectedOutfit}
              forbidden={game.compelled || undefined}
            >
              Add
            </Button>
            <Button
              onClick={handleDeleteOutfit}
              disabled={!selectedOutfit}
            >
              Delete
            </Button>
          </div>
        }

        {/* Remove All Button */}
        <Button
          onClick={handleRemoveAll}
          forbidden={game.compelled || undefined}
        >
          Remove All
        </Button>
      </div>
    </div>
  );
} 