import { useState, useEffect, useRef } from 'react';
import Player from './Player';
import TileMap from './TileMap';
import Game from '../classes/Game';

export default function GameScreen() {
  const [game] = useState(() => {
    const newGame = new Game();
    console.log('Game created, initial state:', newGame.getState());
    return newGame;
  });
  const [gameState, setGameState] = useState(game.getState());
  const [hoveredTile, setHoveredTile] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const gameRef = useRef(game);
  const gameContainerRef = useRef(null);

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
    
    const currentGame = gameRef.current;

    // Set up event listeners to update state
    const updateState = () => {
      console.log('Updating game state from event');
      const newState = currentGame.getState();
      console.log('New state:', newState);
      setGameState(newState);
    };

    // Listen to all game events
    const eventTypes = [
      'gameStarted', 'gameReset',
      'playerMoved', 'areaChanged', 'playerStatsUpdated', 
      'scoreAdded', 'gameSaved', 'gameLoaded'
    ];

    eventTypes.forEach(eventType => {
      currentGame.addEventListener(eventType, updateState);
    });

    // Start the game
    currentGame.startGame();

    // Cleanup
    return () => {
      eventTypes.forEach(eventType => {
        currentGame.removeEventListener(eventType, updateState);
      });
      currentGame.destroy();
    };
  }, []);

  // Global keyboard handler
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      console.log('Key pressed:', event.key, 'Game status:', gameState.status);
      
      const currentGame = gameRef.current;
      if (!currentGame) {
        console.log('No game instance found');
        return;
      }
      
      // Prevent default behavior for movement keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '1', '2', '3', '4', '6', '7', '8', '9'].includes(event.key)) {
        event.preventDefault();
      }
      
      switch (event.key) {
        case '8':
        case 'ArrowUp':
          console.log('Moving up');
          if (currentGame.movePlayer(0, -1)) {
            const newState = currentGame.getState();
            console.log('Manual state update after movement:', newState);
            setGameState(newState);
          }
          break;
        case '2':
        case 'ArrowDown':
          console.log('Moving down');
          if (currentGame.movePlayer(0, 1)) {
            const newState = currentGame.getState();
            console.log('Manual state update after movement:', newState);
            setGameState(newState);
          }
          break;
        case '4':
        case 'ArrowLeft':
          console.log('Moving left');
          if (currentGame.movePlayer(-1, 0)) {
            const newState = currentGame.getState();
            console.log('Manual state update after movement:', newState);
            setGameState(newState);
          }
          break;
        case '6':
        case 'ArrowRight':
          console.log('Moving right');
          if (currentGame.movePlayer(1, 0)) {
            const newState = currentGame.getState();
            console.log('Manual state update after movement:', newState);
            setGameState(newState);
          }
          break;
        case '7':
          console.log('Moving up-left');
          if (currentGame.movePlayer(-1, -1)) {
            const newState = currentGame.getState();
            console.log('Manual state update after movement:', newState);
            setGameState(newState);
          }
          break;
        case '9':
          console.log('Moving up-right');
          if (currentGame.movePlayer(1, -1)) {
            const newState = currentGame.getState();
            console.log('Manual state update after movement:', newState);
            setGameState(newState);
          }
          break;
        case '1':
          console.log('Moving down-left');
          if (currentGame.movePlayer(-1, 1)) {
            const newState = currentGame.getState();
            console.log('Manual state update after movement:', newState);
            setGameState(newState);
          }
          break;
        case '3':
          console.log('Moving down-right');
          if (currentGame.movePlayer(1, 1)) {
            const newState = currentGame.getState();
            console.log('Manual state update after movement:', newState);
            setGameState(newState);
          }
          break;

        case 'r':
        case 'R':
          if (event.ctrlKey) {
            event.preventDefault();
            currentGame.resetGame();
          }
          break;
        case 's':
        case 'S':
          if (event.ctrlKey) {
            event.preventDefault();
            currentGame.saveGame();
          }
          break;
        case 'l':
        case 'L':
          if (event.ctrlKey) {
            event.preventDefault();
            currentGame.loadGame();
          }
          break;
        default:
          break;
      }
    };

    // Add global keyboard listener
    document.addEventListener('keydown', handleGlobalKeyDown);
    console.log('Global keyboard listener added');

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      console.log('Global keyboard listener removed');
    };
  }, [gameState.status]);



  const handleTileHover = (tile, x, y) => {
    if (tile && x >= 0 && y >= 0) {
      setHoveredTile({ tile, x, y });
    } else {
      setHoveredTile(null);
    }
  };

  const handleAreaChange = (areaId) => {
    gameRef.current.changeArea(areaId);
  };

  // Use the Area model instance directly from the Game class
  const currentArea = gameRef.current.world.getCurrentArea();
  const availableAreas = Object.values(gameState.gameMap.areas)
    .filter(area => area.discovered)
    .map(area => area.id);

  return (
    <div 
      ref={gameContainerRef}
      className="game-screen"
      style={{ background: currentArea?.type.background || '#1a1a2e' }}
    >
      <div className="game-header">
        <h1>Splarg - {currentArea?.type.name || 'Unknown Area'}</h1>
        <div className="game-status">
          <span className={`status-indicator ${gameState.status}`}>
            {gameState.status.toUpperCase()}
          </span>
          <span className="score">Score: {gameState.score}</span>
          <span className="play-time">
            Play Time: {Math.floor(gameState.progress.totalPlayTime / 1000)}s
          </span>
          <span className="keyboard-indicator">
            ⌨️ Global Controls Active
          </span>
          <span className="debug-info">
            Player: ({gameState.player.position.x}, {gameState.player.position.y}) {isClient && `| Updates: ${gameState.lastUpdate || 0}`}
          </span>
        </div>
      </div>

      <div className="game-content">
        <Player 
          player={gameState.player}
          onStatsUpdate={(stats) => gameRef.current.updatePlayerStats(stats)}
        />
        
        <div className="game-main">
          <TileMap
            area={currentArea}
            playerPosition={gameState.player.position}
            onTileHover={handleTileHover}
            hoveredTile={hoveredTile}
          />
          
          <div className="area-selector">
            <h3>Available Areas</h3>
            <div className="area-list">
              {availableAreas.map(areaId => {
                const area = gameState.gameMap.areas[areaId];
                const isCurrent = areaId === gameState.gameMap.currentAreaId;
                return (
                  <button
                    key={areaId}
                    className={`area-button ${isCurrent ? 'current' : ''}`}
                    onClick={() => handleAreaChange(areaId)}
                    disabled={isCurrent}
                  >
                    <div className="area-name">{area.type.name}</div>
                    <div className="area-status">
                      {area.visited ? 'Visited' : 'Discovered'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="game-controls">
        <h3>Controls</h3>
                  <div className="controls-grid">
            <div>Movement: Numpad (1-9) or Arrow Keys</div>
            <div>Reset Game: Ctrl+R</div>
            <div>Save Game: Ctrl+S</div>
            <div>Load Game: Ctrl+L</div>
          </div>
      </div>

      {hoveredTile && hoveredTile.tile && (
        <div className="tile-info">
          <h4>Tile Info</h4>
          <p>Position: ({hoveredTile.x}, {hoveredTile.y})</p>
          <p>Type: {hoveredTile.tile.name}</p>
          <p>Walkable: {hoveredTile.tile.walkable ? 'Yes' : 'No'}</p>
          <p>Description: {hoveredTile.tile.description}</p>
        </div>
      )}
    </div>
  );
} 