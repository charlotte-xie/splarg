import { useState } from 'react';
import Game from '../classes/Game';
import Button from './Button';

interface OutfitManagementProps {
  game: Game;
  onPlayerUpdate: (player: any) => void;
}

export default function OutfitManagement({ game, onPlayerUpdate }: OutfitManagementProps) {
  const player = game.getPlayer();
  const [outfitName, setOutfitName] = useState('');
  const [selectedOutfit, setSelectedOutfit] = useState('');

  const handleSaveOutfit = () => {
    if (outfitName.trim()) {
      if (player.saveOutfit(outfitName.trim())) {
        setOutfitName('');
        onPlayerUpdate(player);
        game.addMessage(`Saved outfit: ${outfitName.trim()}`, 'success');
      } else {
        game.addMessage('Failed to save outfit', 'error');
      }
    }
  };

  const handleWearOutfit = () => {
    if (selectedOutfit) {
      try {
        if (player.wearOutfit(selectedOutfit)) {
          onPlayerUpdate(player);
          game.addMessage(`Wearing outfit: ${selectedOutfit}`, 'success');
        } else {
          game.addMessage('Failed to wear outfit', 'error');
        }
      } catch (error) {
        if (error instanceof Error) {
          game.addMessage(error.message, 'error');
        } else {
          game.addMessage('Failed to wear outfit', 'error');
        }
      }
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
            className="control-panel-input"
          />
          <Button
            onClick={handleSaveOutfit}
            disabled={!outfitName.trim()}
          >
            Save
          </Button>
        </div>

        {/* Wear Outfit */}
        {player.getOutfitNames().length > 0 && (
          <div className="control-panel-row" style={{ width: '100%' }}>
            <select
              value={selectedOutfit}
              onChange={(e) => setSelectedOutfit(e.target.value)}
              className="control-panel-input"
              style={{ flex: 1, minWidth: 0 }}
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
            >
              Wear
            </Button>
            <Button
              onClick={handleDeleteOutfit}
              disabled={!selectedOutfit}
            >
              Delete
            </Button>
          </div>
        )}

        {/* Remove All Button */}
        <Button
          onClick={handleRemoveAll}
        >
          Remove All Items
        </Button>
      </div>
    </div>
  );
} 