import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  className = '',
  style = {}
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    padding: size === 'small' ? '6px 8px' : size === 'large' ? '12px 16px' : '8px 12px',
    fontSize: size === 'small' ? '10px' : size === 'large' ? '14px' : '12px',
    border: '1px solid',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    textAlign: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    minWidth: 'fit-content',
    ...style
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#2d3748',
      color: '#e2e8f0',
      borderColor: '#4a5568',
      '&:hover': {
        backgroundColor: '#4a5568'
      },
      '&:disabled': {
        backgroundColor: '#1a202c',
        color: '#718096',
        borderColor: '#2d3748'
      }
    },
    secondary: {
      backgroundColor: '#1a202c',
      color: '#e2e8f0',
      borderColor: '#4a5568',
      '&:hover': {
        backgroundColor: '#2d3748'
      },
      '&:disabled': {
        backgroundColor: '#0f1419',
        color: '#718096',
        borderColor: '#2d3748'
      }
    },
    danger: {
      backgroundColor: '#742a2a',
      color: '#e2e8f0',
      borderColor: '#9b2c2c',
      '&:hover': {
        backgroundColor: '#9b2c2c'
      },
      '&:disabled': {
        backgroundColor: '#4a1a1a',
        color: '#718096',
        borderColor: '#742a2a'
      }
    },
    success: {
      backgroundColor: '#22543d',
      color: '#e2e8f0',
      borderColor: '#38a169',
      '&:hover': {
        backgroundColor: '#38a169'
      },
      '&:disabled': {
        backgroundColor: '#1a3a2a',
        color: '#718096',
        borderColor: '#22543d'
      }
    }
  };

  const currentVariant = variantStyles[variant];
  const buttonStyles = {
    ...baseStyles,
    backgroundColor: disabled ? currentVariant['&:disabled'].backgroundColor : currentVariant.backgroundColor,
    color: disabled ? currentVariant['&:disabled'].color : currentVariant.color,
    borderColor: disabled ? currentVariant['&:disabled'].borderColor : currentVariant.borderColor
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = currentVariant['&:hover'].backgroundColor;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = currentVariant.backgroundColor;
    }
  };

  return (
    <button
      className={`game-button game-button--${variant} game-button--${size} ${className}`}
      style={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
} 