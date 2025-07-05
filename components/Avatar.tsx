import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ 
  src, 
  alt = "Player Avatar", 
  size = 64, 
  className = "" 
}: AvatarProps) {
  const defaultAvatar = "👤"; // Fallback character symbol
  const [imageError, setImageError] = useState(false);
  
  return (
    <div 
      className={`avatar ${className}`}
      style={{ 
        width: '100%', 
        aspectRatio: '1 / 1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10%',
        backgroundColor: '#2d3748',
        border: '2px solid #d69e2e',
        overflow: 'hidden'
      }}
    >
      {src && !imageError ? (
        <img 
          src={src} 
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={() => {
            setImageError(true);
          }}
        />
      ) : (
        <span style={{ fontSize: 'min(60px, 8vw)', color: '#e2e8f0' }}>
          {defaultAvatar}
        </span>
      )}
    </div>
  );
} 