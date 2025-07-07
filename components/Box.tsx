import React from 'react';

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'brass' | 'copper' | 'iron';
}

export default function Box({ 
  children, 
  className = "", 
  style = {},
  variant = 'default'
}: BoxProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'brass':
        return {
          background: 'linear-gradient(135deg, #b8860b 0%, #daa520 50%, #b8860b 100%)',
          borderColor: '#8b6914',
          boxShadow: `
            0 0 0 2px #8b6914,
            0 0 0 4px #daa520,
            0 4px 8px rgba(184, 134, 11, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `
        };
      case 'copper':
        return {
          background: 'linear-gradient(135deg, #b87333 0%, #cd853f 50%, #b87333 100%)',
          borderColor: '#8b4513',
          boxShadow: `
            0 0 0 2px #8b4513,
            0 0 0 4px #cd853f,
            0 4px 8px rgba(184, 115, 51, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `
        };
      case 'iron':
        return {
          background: 'linear-gradient(135deg, #696969 0%, #808080 50%, #696969 100%)',
          borderColor: '#2f4f4f',
          boxShadow: `
            0 0 0 2px #2f4f4f,
            0 0 0 4px #808080,
            0 4px 8px rgba(105, 105, 105, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `
        };
      default:
        return {
          background: 'linear-gradient(135deg, #b8860b 0%, #daa520 50%, #b8860b 100%)',
          borderColor: '#8b6914',
          boxShadow: `
            0 0 0 2px #8b6914,
            0 0 0 4px #daa520,
            0 4px 8px rgba(184, 134, 11, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div
      style={{
        position: 'relative',
        padding: '16px',
        borderRadius: '8px',
        border: '2px solid',
        ...variantStyles,
        ...style,
        // Add decorative corner elements
        '--corner-size': '12px',
        '--corner-color': variantStyles.borderColor,
      } as React.CSSProperties}
    >
      {/* Corner decorations */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: 'var(--corner-size)',
          height: 'var(--corner-size)',
          borderTop: '2px solid var(--corner-color)',
          borderLeft: '2px solid var(--corner-color)',
          borderTopLeftRadius: '4px'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          width: 'var(--corner-size)',
          height: 'var(--corner-size)',
          borderTop: '2px solid var(--corner-color)',
          borderRight: '2px solid var(--corner-color)',
          borderTopRightRadius: '4px'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: 'var(--corner-size)',
          height: 'var(--corner-size)',
          borderBottom: '2px solid var(--corner-color)',
          borderLeft: '2px solid var(--corner-color)',
          borderBottomLeftRadius: '4px'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          width: 'var(--corner-size)',
          height: 'var(--corner-size)',
          borderBottom: '2px solid var(--corner-color)',
          borderRight: '2px solid var(--corner-color)',
          borderBottomRightRadius: '4px'
        }}
      />
      
      {children}
    </div>
  );
} 