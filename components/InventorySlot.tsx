import React from 'react';
import Item from '../classes/Item';
import Utils from '../classes/Utils';

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
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`inventory-slot ${className}`}
      onClick={handleClick}
      style={{
        width: size,
        height: size,
        border: selected ? '2px solid #d69e2e' : '1px solid #4a5568',
        borderRadius: '4px',
        backgroundColor: item ? '#1a202c' : '#2d3748',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        fontSize: size * 0.4,
        color: '#e2e8f0',
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
          
          {/* Tooltip on hover */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#1a202c',
              color: '#e2e8f0',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity 0.2s ease',
              zIndex: 1000,
              border: '1px solid #4a5568',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              minWidth: '150px',
              maxWidth: '200px',
              textAlign: 'left'
            }}
            className="slot-tooltip"
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {item.getName()}
              {item.hasMultiple() && ` (${item.getQuantity()})`}
            </div>
            <div style={{ fontSize: '11px', color: '#a0aec0', whiteSpace: 'normal' }}>
              {item.getDescription()}
            </div>
          </div>
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
  );
} 