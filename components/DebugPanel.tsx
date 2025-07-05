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

  return (
    <div className="debug-panel" style={{
      marginTop: '16px',
      padding: '12px',
      backgroundColor: '#1a202c',
      borderRadius: '6px',
      border: '1px solid #4a5568'
    }}>
      <h5 style={{ 
        color: '#d69e2e', 
        marginBottom: '8px', 
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Debug Controls
      </h5>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '6px'
      }}>
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
      </div>
    </div>
  );
} 