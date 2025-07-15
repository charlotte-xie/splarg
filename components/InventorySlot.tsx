import React, { useState } from 'react';
import Item from '../classes/Item';
import Utils from '../classes/Utils';
import Tooltip from './Tooltip';

interface InventorySlotProps {
  item: Item | null;
  size?: number;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  style?: React.CSSProperties;
}

export default function InventorySlot({ 
  item, 
  size = 48, 
  className = "",
  onClick,
  selected = false,
  style = {}
}: InventorySlotProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Tooltip
      content={item && (
        <div className="slot-tooltip">
          <div className="slot-tooltip-content">
            {item.getName()}
            {item.hasMultiple() && ` (${item.getQuantity()})`}
          </div>
          <div className="slot-tooltip-description">
            {item.getDescription()}
          </div>
        </div>
      )}
    >
      <div
        className={`inventory-slot${selected ? ' selected' : ''} ${className}`}
        onClick={handleClick}
        style={{
          cursor: onClick ? 'pointer' : 'default',
          border: selected ? '2px solid #d69e2e' : undefined,
          backgroundColor: item ? (selected ? '#1a202c' : '#1a202c') : undefined,
          ...style
        }}
      >
        {item ? (
          <>
            {/* Item symbol/icon */}
            <span style={{ fontSize: size * 0.5 }}>
              {item.getSymbol()}
            </span>
            
            {/* Quantity indicator */}
            {item.hasMultiple() && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  color: '#ffffff',
                  fontSize: size * 0.35,
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                  lineHeight: 1
                }}
              >
                {Utils.displayNumber(item.getQuantity())}
              </div>
            )}
            
            {/* Lock indicator */}
            {item.isLocked() && (
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  color: '#f56565',
                  fontSize: size * 0.3,
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                  lineHeight: 1
                }}
              >
                🔒
              </div>
            )}
            
            {/* Stop sign for restrained items */}
            {item.isRestricted() && (
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                  color: '#f56565',
                  fontSize: size * 0.3,
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                  lineHeight: 1
                }}
              >
                🛑
              </div>
            )}
          </>
        ) : (
          <span style={{ color: '#4a5568', fontSize: size * 0.3 }}>
            ⬚
          </span>
        )}
        
        <style jsx>{`
          .inventory-slot:hover .slot-tooltip {
            opacity: 1 !important;
          }
        `}</style>
      </div>
    </Tooltip>
  );
} 