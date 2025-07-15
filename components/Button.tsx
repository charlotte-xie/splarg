import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  title?: string;
  forbidden?: string; // New prop
}

export default function Button({ 
  children, 
  onClick, 
  size = 'medium',
  disabled = false,
  className = '',
  title,
  forbidden
}: ButtonProps) {
  const isForbidden = !!forbidden;
  return (
    <span style={{ position: 'relative', display: 'inline-block'}}>
      <button
        className={`game-button game-button--${size} ${className}`}
        onClick={onClick}
        disabled={disabled || isForbidden}
        title={isForbidden ? forbidden : title}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </button>
      {isForbidden && (
        <span
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          {/* Red cross overlay */}
          <svg width="70%" height="70%" viewBox="0 0 32 32" style={{ display: 'block' }}>
            <line x1="4" y1="4" x2="28" y2="28" stroke="#e53e3e" strokeWidth="4" strokeLinecap="round" />
            <line x1="28" y1="4" x2="4" y2="28" stroke="#e53e3e" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </span>
  );
} 