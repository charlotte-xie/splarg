import Game from '../classes/Game';
import Item, { createRandomItem, ITEM_TYPES } from '../classes/Item';
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
    game.addPlayerDefaults(newPlayer);
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
      item.props.locked = true;
    });
    
    onGameUpdate();
  };

  const handleUnlockAllWornItems = () => {
    const player = game.getPlayer();
    const wornItems = player.getWornItems();
    // Get unique worn items (since items can span multiple locations)
    const uniqueWornItems = new Set<Item>();
    wornItems.forEach((item) => {
      uniqueWornItems.add(item);
    });
    // Unlock all unique worn items
    uniqueWornItems.forEach(item => {
      item.props.locked = false;
    });
    onGameUpdate();
  };

  const handleSaveGame = () => {
    game.saveGame();
    onGameUpdate();
  };

  const handleRestoreGame = () => {
    game.loadGame();
    onGameUpdate();
  };

  return (
    <div className="control-panel" style={{height:"100%", flex: "1"}}>
      <h4>
        Debug Controls
      </h4>
      
      <div className="grid-container">
        <Button
          onClick={handleAddRandomItem}
        >
          Add Random Item
        </Button>
        
        <Button
          onClick={handleAddGold}
        >
          Add 100 Gold
        </Button>
        
        <Button
          onClick={handleHealPlayer}
        >
          Heal Player
        </Button>
        
        <Button
          onClick={handleResetPlayer}
        >
          Reset Player
        </Button>
        
        <Button
          onClick={handleLockAllWornItems}
        >
          Lock All Worn
        </Button>
        
        <Button
          onClick={handleUnlockAllWornItems}
        >
          Unlock All Worn
        </Button>
        
        <Button
          onClick={handleSaveGame}
        >
          Save Game
        </Button>
        
        <Button
          onClick={handleRestoreGame}
        >
          Restore Game
        </Button>
      </div>
    </div>
  );
} 