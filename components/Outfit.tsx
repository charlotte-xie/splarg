import React from 'react';

export default function Outfit() {
  return (
    <div className="outfit">
      <h4>Outfit</h4>
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#2d3748', 
        borderRadius: '8px',
        border: '1px solid #4a5568'
      }}>
        <p style={{ color: '#a0aec0', textAlign: 'center' }}>
          Outfit customization coming soon...
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '12px',
          marginTop: '16px'
        }}>
          {['Head', 'Chest', 'Legs', 'Feet', 'Weapon', 'Shield'].map((slot) => (
            <div 
              key={slot}
              style={{
                padding: '12px',
                backgroundColor: '#1a202c',
                border: '1px solid #4a5568',
                borderRadius: '4px',
                textAlign: 'center',
                color: '#a0aec0'
              }}
            >
              <div style={{ fontSize: '12px', marginBottom: '4px' }}>{slot}</div>
              <div style={{ fontSize: '10px', color: '#4a5568' }}>Empty</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 