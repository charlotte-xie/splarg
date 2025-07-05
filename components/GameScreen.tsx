import { useEffect, useRef, useState } from 'react';
import Game from '../classes/Game';
import DebugPanel from './DebugPanel';
import GameWindow from './GameWindow';
import PlayerPanel from './PlayerPanel';
import TileMap from './TileMap';

interface HoveredTile {
  tile: any;
  x: number;
  y: number;
}

export default function GameScreen() {
  const gameRef = useRef<Game>(new Game());
  const [version, setVersion] = useState(0);
  const [hoveredTile, setHoveredTile] = useState<HoveredTile | null>(null);
  const [isClient, setIsClient] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Utility to trigger a re-render after mutating the game
  const updateGame = () => setVersion(v => v + 1);

  useEffect(() => {
    setIsClient(true);
    const game = gameRef.current;
    const eventTypes = [
      'gameStarted', 'gameReset',
      'playerMoved', 'areaChanged', 'playerStatsUpdated', 
      'scoreAdded', 'gameSaved', 'gameLoaded'
    ];
    eventTypes.forEach(eventType => {
      game.addEventListener(eventType, updateGame);
    });
    game.startGame();
    return () => {
      eventTypes.forEach(eventType => {
        game.removeEventListener(eventType, updateGame);
      });
      game.destroy();
    };
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const game = gameRef.current;
      if ([
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        '1', '2', '3', '4', '6', '7', '8', '9'
      ].includes(event.key)) {
        event.preventDefault();
      }
      switch (event.key) {
        case '8':
        case 'ArrowUp':
          game.movePlayer(0, -1);
          break;
        case '2':
        case 'ArrowDown':
          game.movePlayer(0, 1);
          break;
        case '4':
        case 'ArrowLeft':
          game.movePlayer(-1, 0);
          break;
        case '6':
        case 'ArrowRight':
          game.movePlayer(1, 0);
          break;
        case '7':
          game.movePlayer(-1, -1);
          break;
        case '9':
          game.movePlayer(1, -1);
          break;
        case '1':
          game.movePlayer(-1, 1);
          break;
        case '3':
          game.movePlayer(1, 1);
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey) {
            event.preventDefault();
            game.resetGame();
          }
          break;
        case 's':
        case 'S':
          if (event.ctrlKey) {
            event.preventDefault();
            game.saveGame();
          }
          break;
        case 'l':
        case 'L':
          if (event.ctrlKey) {
            event.preventDefault();
            game.loadGame();
          }
          break;
        default:
          break;
      }
      updateGame();
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const handleTileHover = (tile: any, x: number, y: number) => {
    if (tile && x >= 0 && y >= 0) {
      setHoveredTile({ tile, x, y });
    } else {
      setHoveredTile(null);
    }
  };

  const handleAreaChange = (areaId: string) => {
    gameRef.current.changeArea(areaId);
    updateGame();
  };

  const game = gameRef.current;
  const currentArea = game.world.getCurrentArea();
  const availableAreas = Object.values(game.getState().gameMap.areas)
    .filter((area: any) => area.discovered)
    .map((area: any) => area.id);
  const gameState = game.getState();

  return (
    <div 
      ref={gameContainerRef}
      className="game-screen"
    >
      <div className="game-content">
        <PlayerPanel 
          player={game.getPlayer()}
          onStatsUpdate={(stats) => { game.updatePlayerStats(stats); updateGame(); }}
          onPlayerUpdate={(updatedPlayer) => { 
            game.updatePlayer(updatedPlayer); 
            updateGame(); 
          }}
        />
        <div className="game-main">
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
              <span className="debug-info">
                Player: ({gameState.player.position.x}, {gameState.player.position.y}) {isClient && `| Updates: ${gameState.lastUpdate || 0}`}
              </span>
            </div>
          </div>
          
          <GameWindow>
            <TileMap
              area={currentArea}
              playerPosition={gameState.player.position}
              player={game.getPlayer()}
              onTileHover={handleTileHover}
              hoveredTile={hoveredTile}
            />
          </GameWindow>
          <div className="area-selector">
            <h3>Available Areas</h3>
            <div className="area-list">
              {availableAreas.map((areaId: string) => {
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
        <DebugPanel
          game={game}
          onGameUpdate={updateGame}
        />
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