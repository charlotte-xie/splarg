import { useEffect, useRef, useState } from 'react';
import Game from '../classes/Game';
import Tile from '../classes/Tile';

interface TileMapProps {
  game: Game;
  onUpdate: (game: Game) => void;
  version: number;
}

export default function TileMap({ game, onUpdate, version }: TileMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const TILE_SIZE = 32;
  const [hoveredTile, setHoveredTile] = useState<{tile: any, x: number, y: number} | null>(null);

  const player = game.getPlayer();
  const area = game.world.getCurrentArea();
  const playerPosition = player.position;

  const drawTile = (ctx: CanvasRenderingContext2D, tile: Tile, x: number, y: number) => {
    const tileX = x * TILE_SIZE;
    const tileY = y * TILE_SIZE;

    // Draw tile background
    ctx.fillStyle = tile.getColour();
    ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);

    // Draw tile border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(tileX, tileY, TILE_SIZE, TILE_SIZE);

    // Draw tile symbol
    ctx.fillStyle = tile.getTextColour();
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tile.getSymbol(), tileX + TILE_SIZE / 2, tileY + TILE_SIZE / 2);

    // Draw item symbols if present
    if (tile.items && tile.items.length > 0) {
      const maxItems = 3;
      const itemSymbols = tile.items.slice(0, maxItems).map(item => item.getSymbol());
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      const spacing = TILE_SIZE / (itemSymbols.length + 1);
      itemSymbols.forEach((symbol, i) => {
        const sx = tileX + spacing * (i + 1);
        const sy = tileY + TILE_SIZE - 2;
        ctx.fillText(symbol, sx, sy);
      });
    }
  };

  const drawBlackTile = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const tileX = x * TILE_SIZE;
    const tileY = y * TILE_SIZE;
    ctx.fillStyle = '#000';
    ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, playerPosition: any) => {
    if (!playerPosition) return;

    const playerX = playerPosition.x * TILE_SIZE + TILE_SIZE / 2;
    const playerY = playerPosition.y * TILE_SIZE + TILE_SIZE / 2;

    // Player glow effect
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(playerX, playerY, TILE_SIZE / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();

    // Player center
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(playerX, playerY, TILE_SIZE / 3, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawHoveredTile = (ctx: CanvasRenderingContext2D, hoveredTile: any) => {
    if (!hoveredTile) return;
    const hoverX = hoveredTile.x * TILE_SIZE;
    const hoverY = hoveredTile.y * TILE_SIZE;
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(hoverX, hoverY, TILE_SIZE, TILE_SIZE);
    ctx.setLineDash([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !area) return;
    const width = area.getWidth();
    const height = area.getHeight();
    if (width === 0 || height === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = width * TILE_SIZE;
    canvas.height = height * TILE_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const eyesRestricted = player && player.isRestricted && player.isRestricted('eyes');
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (eyesRestricted) {
          if (x === playerPosition.x && y === playerPosition.y) {
            const tile = area.getTile(x, y);
            if (tile) drawTile(ctx, tile, x, y);
          } else {
            drawBlackTile(ctx, x, y);
          }
        } else {
          const tile = area.getTile(x, y);
          if (tile) drawTile(ctx, tile, x, y);
        }
      }
    }
    drawPlayer(ctx, playerPosition);
    if (!eyesRestricted) {
      drawHoveredTile(ctx, hoveredTile);
    }
  }, [area, playerPosition, hoveredTile, player, version]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !area) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((event.clientY - rect.top) / TILE_SIZE);
    if (x >= 0 && x < area.getWidth() && y >= 0 && y < area.getHeight()) {
      const tile = area.getTile(x, y);
      setHoveredTile({ tile, x, y });
    } else {
      setHoveredTile(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredTile(null);
  };

  if (!area) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="tile-map-container">
      <canvas
        ref={canvasRef}
        className="tile-map"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          border: '2px solid #333',
          borderRadius: '8px',
          cursor: 'crosshair'
        }}
      />
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