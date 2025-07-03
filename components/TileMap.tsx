import { useRef, useEffect } from 'react';

interface TileMapProps {
  area: any;
  playerPosition: any;
  onTileHover: (tile: any, x: number, y: number) => void;
  hoveredTile: any;
}

export default function TileMap({ area, playerPosition, onTileHover, hoveredTile }: TileMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const TILE_SIZE = 20;

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

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw tiles
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = area.getTile(x, y);
        const tileX = x * TILE_SIZE;
        const tileY = y * TILE_SIZE;

        // Draw tile background
        ctx.fillStyle = tile.color;
        ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);

        // Draw tile border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(tileX, tileY, TILE_SIZE, TILE_SIZE);

        // Draw tile symbol
        ctx.fillStyle = tile.textColor;
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tile.symbol, tileX + TILE_SIZE / 2, tileY + TILE_SIZE / 2);
      }
    }

    // Draw player
    if (playerPosition) {
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
    }

    // Draw hovered tile highlight
    if (hoveredTile) {
      const hoverX = hoveredTile.x * TILE_SIZE;
      const hoverY = hoveredTile.y * TILE_SIZE;

      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(hoverX, hoverY, TILE_SIZE, TILE_SIZE);
      ctx.setLineDash([]);
    }

  }, [area, playerPosition, hoveredTile]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !area) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((event.clientY - rect.top) / TILE_SIZE);

    if (
      x >= 0 && x < area.getWidth() &&
      y >= 0 && y < area.getHeight()
    ) {
      const tile = area.getTile(x, y);
      onTileHover(tile, x, y);
    } else {
      onTileHover(null, -1, -1);
    }
  };

  const handleMouseLeave = () => {
    onTileHover(null, -1, -1);
  };

  if (!area) {
    return <div className="tile-map-loading">Loading map...</div>;
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
      
      <div className="tile-legend">
        <h4>Tile Legend</h4>
        <div className="legend-grid">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#2d5a27' }}></div>
            <span>🌱 Grass</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#1e3a8a' }}></div>
            <span>💧 Water</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#6b7280' }}></div>
            <span>🪨 Stone</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#d97706' }}></div>
            <span>🏖️ Sand</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#166534' }}></div>
            <span>🌲 Forest</span>
          </div>
        </div>
      </div>
    </div>
  );
} 