import React from 'react';
import Item from '../classes/Item';
import Button from './Button';

interface ActionButton {
  label: string;
  variant: 'primary' | 'secondary' | 'success' | 'danger';
  onClick: () => void;
  disabled?: boolean;
}

interface ItemDetailsProps {
  item: Item;
  actionButtons: ActionButton[];
}

export default function ItemDetails({ item, actionButtons }: ItemDetailsProps) {
  return (
    <div style={{
      marginTop: '16px',
      padding: '12px',
      backgroundColor: '#1a202c',
      borderRadius: '6px',
      border: '1px solid #d69e2e',
      color: '#e2e8f0'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '20px' }}>{item.getSymbol()}</span>
        <h5 style={{ 
          margin: 0, 
          color: '#d69e2e',
          fontSize: '14px'
        }}>
          {item.getName()}
          {item.hasMultiple() && ` (${item.getQuantity()})`}
        </h5>
      </div>
      <p style={{
        margin: '8px 0',
        fontSize: '12px',
        color: '#a0aec0',
        lineHeight: '1.4'
      }}>
        {item.getDescription()}
      </p>
      <div style={{
        fontSize: '11px',
        color: '#718096',
        borderTop: '1px solid #4a5568',
        paddingTop: '8px',
        marginTop: '8px',
        marginBottom: '12px'
      }}>
        <div>Type: {item.getId()}</div>
        <div>Stackable: {item.isStackable() ? 'Yes' : 'No'}</div>
        {item.hasMultiple() && (
          <div>Quantity: {item.getQuantity()}</div>
        )}
        {item.isWearable() && (
          <div style={{ marginTop: '4px' }}>
            <div style={{ color: '#d69e2e', fontWeight: '500' }}>Equipment:</div>
            <div>Layer: {item.getLayer()}</div>
            <div>Locations: {item.getLocations()?.join(', ') || 'None'}</div>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end'
      }}>
        {actionButtons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant}
            size="small"
            onClick={button.onClick}
            disabled={button.disabled}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
} 