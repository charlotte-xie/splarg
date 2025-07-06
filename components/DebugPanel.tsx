import Game from '../classes/Game';
import Item, { createExampleItems, createRandomItem, ITEM_TYPES } from '../classes/Item';
import Player from '../classes/Player';
import Button from './Button';

interface DebugPanelProps {
  game: Game;
  onGameUpdate: () => void;
}

export default function DebugPanel({ game, onGameUpdate }: DebugPanelProps) {
  const handleAddRandomItem = () => {
    const player = game.getPlayer();
    const randomItem = createRandomItem();
    player.addItem(randomItem);
    onGameUpdate();
  };

  const handleAddGold = () => {
    const player = game.getPlayer();
    const goldItem = new Item(ITEM_TYPES.goldCoin, 100);
    player.addItem(goldItem);
    onGameUpdate();
  };

  const handleHealPlayer = () => {
    const player = game.getPlayer();
    player.heal(50);
    onGameUpdate();
  };

  const handleResetPlayer = () => {
    const newPlayer = new Player();
    createExampleItems().forEach(item => newPlayer.addItem(item));
    game.updatePlayer(newPlayer);
    onGameUpdate();
  };

  const handleLockAllWornItems = () => {
    const player = game.getPlayer();
    const wornItems = player.getWornItems();
    
    // Get unique worn items (since items can span multiple locations)
    const uniqueWornItems = new Set<Item>();
    wornItems.forEach((item) => {
      uniqueWornItems.add(item);
    });
    
    // Lock all unique worn items
    uniqueWornItems.forEach(item => {
      (item as any).locked = true;
    });
    
    onGameUpdate();
  };

  return (
    <div className="control-panel">
      <h5>
        Debug Controls
      </h5>
      
      <div className="control-panel-grid">
        <Button
          variant="primary"
          size="small"
          onClick={handleAddRandomItem}
        >
          Add Random Item
        </Button>
        
        <Button
          variant="primary"
          size="small"
          onClick={handleAddGold}
        >
          Add 100 Gold
        </Button>
        
        <Button
          variant="success"
          size="small"
          onClick={handleHealPlayer}
        >
          Heal Player
        </Button>
        
        <Button
          variant="danger"
          size="small"
          onClick={handleResetPlayer}
        >
          Reset Player
        </Button>
        
        <Button
          variant="secondary"
          size="small"
          onClick={handleLockAllWornItems}
        >
          Lock All Worn
        </Button>
      </div>
    </div>
  );
} 