import React from 'react';

export default function Inventory() {
  return (
    <div className="inventory">
      <h4>Inventory</h4>
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#2d3748', 
        borderRadius: '8px',
        border: '1px solid #4a5568'
      }}>
        <p style={{ color: '#a0aec0', textAlign: 'center' }}>
          Inventory system coming soon...
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '8px',
          marginTop: '16px'
        }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div 
              key={i}
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                backgroundColor: '#1a202c',
                border: '1px solid #4a5568',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4a5568',
                fontSize: '12px'
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 