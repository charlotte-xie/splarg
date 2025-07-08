import { useEffect, useRef, useState } from 'react';
import Game from '../classes/Game';
import DebugPanel from './DebugPanel';
import GameWindow from './GameWindow';
import MessagePanel from './MessagePanel';
import PlayerPanel from './PlayerPanel';
import TileMap from './TileMap';

export default function GameScreen() {
  const gameRef = useRef<Game>(new Game().initialise());
  const [version, setVersion] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Utility to trigger a re-render after mutating the game
  const updateGame = (game: Game) => {
    gameRef.current = game;
    setVersion(v => v + 1);
  }

  useEffect(() => {
    setIsClient(true);
    const game = gameRef.current;
    const eventTypes = [
      'gameStarted', 'gameReset',
      'playerMoved', 'areaChanged', 'playerStatsUpdated', 
      'scoreAdded', 'gameSaved', 'gameLoaded'
    ];
    eventTypes.forEach(eventType => {
      game.addEventListener(eventType, () => updateGame(game));
    });
    game.startGame();
    return () => {
      eventTypes.forEach(eventType => {
        game.removeEventListener(eventType, () => updateGame(game));
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
            game.initialise();
          }
          break;
        case 's':
        case 'S':
          if (event.ctrlKey) {
            event.preventDefault();
            game.saveGame();
          }
          break;
        default:
          break;
      }
      updateGame(game);
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const game = gameRef.current;

  return (
    <div 
      ref={gameContainerRef}
      className="game-screen"
    >
      <div className="game-content">
        <PlayerPanel 
          game={game}
          onUpdate={()=>updateGame(game)}
        />
        <div className="game-main">
          <GameWindow>
            <TileMap
              game={game}
              onUpdate={() => updateGame(game)}
              version={version}
            />
          </GameWindow>
          <MessagePanel game={game} onUpdate={()=>updateGame(game)} />
        </div>
        <DebugPanel
          game={game}
          onGameUpdate={updateGame}
        />
      </div>
    </div>
  );
} 