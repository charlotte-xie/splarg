import React from 'react';
import Button from './Button';

interface DebugPanelProps {
  onAddRandomItem?: () => void;
  onResetPlayer?: () => void;
  onAddGold?: () => void;
  onHealPlayer?: () => void;
}

export default function DebugPanel({ 
  onAddRandomItem,
  onResetPlayer,
  onAddGold,
  onHealPlayer
}: DebugPanelProps) {
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
          onClick={onAddRandomItem}
        >
          Add Random Item
        </Button>
        
        <Button
          variant="primary"
          size="small"
          onClick={onAddGold}
        >
          Add 100 Gold
        </Button>
        
        <Button
          variant="success"
          size="small"
          onClick={onHealPlayer}
        >
          Heal Player
        </Button>
        
        <Button
          variant="danger"
          size="small"
          onClick={onResetPlayer}
        >
          Reset Player
        </Button>
      </div>
    </div>
  );
} 