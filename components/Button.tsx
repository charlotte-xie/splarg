import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

export default function Button({ 
  children, 
  onClick, 
  size = 'medium',
  disabled = false,
  className = ''
}: ButtonProps) {
  return (
    <button
      className={`game-button game-button--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
} 