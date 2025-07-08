import Game from '../classes/Game';
import Item, { createRandomItem } from '../classes/Item';
import { ITEM_TYPES } from '../classes/ItemType';
import Button from './Button';

interface DebugPanelProps {
  game: Game;
  onGameUpdate: (game: Game) => void;
}

export default function DebugPanel({ game, onGameUpdate }: DebugPanelProps) {
  const handleAddRandomItem = () => {
    const player = game.getPlayer();
    const randomItem = createRandomItem();
    player.addItem(randomItem);
    onGameUpdate(game);
  };

  const handleAddGold = () => {
    const player = game.getPlayer();
    const goldItem = new Item(ITEM_TYPES.goldCoin, 100);
    player.addItem(goldItem);
    onGameUpdate(game);
  };

  const handleHealPlayer = () => {
    const player = game.getPlayer();
    // player.heal(50);
    onGameUpdate(game);
  };

  const handleResetPlayer = () => {
    game.initialise();
    onGameUpdate(game);
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
    
    onGameUpdate(game);
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
    onGameUpdate(game);
  };

  const handleSaveGame = () => {
    game.saveGame();
    onGameUpdate(game);
  };

  const handleRestoreGame = () => {
    onGameUpdate(Game.loadGame());
  };

  const handleShowPlayerJSON = () => {
    const player = game.getPlayer();
    const playerJSON = player.toJSON();
    console.log('Player JSON:', playerJSON);
    alert(JSON.stringify(playerJSON, null, 2));
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
        
        <Button
          onClick={handleShowPlayerJSON}
        >
          Show Player JSON
        </Button>
      </div>

      {/* Info box below buttons */}
      <div className="control-panel">
        <div><b>Last Save:</b> {game.lastSaveTime ? new Date(game.lastSaveTime).toLocaleString() : 'Never'}</div>
        <div><b>Score:</b> {game.score}</div>
        <div><b>Game Time:</b> {game.time}</div>
        <div><b>Inventory:</b> {game.getPlayer().getInventory().length} items</div>
        <div><b>Player Pos:</b> {JSON.stringify(game.getPlayer().position)}</div>
        <div><b>Entity Count:</b> {game.entities.size}</div>
        <div><b>Entities in Area:</b> {game.getCurrentArea().entities.size}</div>
      </div>
    </div>
  );
} 