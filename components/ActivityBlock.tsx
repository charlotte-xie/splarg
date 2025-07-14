import React from 'react';
import { Activity, Content, Option } from '../classes/Activity';
import Game from '../classes/Game';
import Button from './Button';

interface ActivityBlockProps {
  activity: Activity;
  game: Game;
  onGameUpdate: (game: Game) => void;
  style?: React.CSSProperties;
}

export default function ActivityBlock({ activity, game, onGameUpdate, style }: ActivityBlockProps) {
  return (
    <div className="activity-block" style={{ position: 'relative', marginTop: 6, border: '1.5px solid #b08d57', borderRadius: 8, padding: '16px 10px 10px 10px', ...style }}>
      <h5
        style={{
          position: 'absolute',
          top: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1a202c',
          border: '1.5px solid #b08d57',
          borderRadius: 8,
          padding: '2px 16px',
          fontWeight: 600,
          color: '#e2c275',
          zIndex: 1,
          boxShadow: '0 2px 6px rgba(44,28,8,0.08)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        {activity.title}
      </h5>
      <div className="activity-content" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
        {activity.content.map((item: Content, idx: number) => (
          <p key={idx} style={{ color: item.colour, margin: 0, whiteSpace: 'pre-line' }}>
            {item.value}
          </p>
        ))}
      </div>
      <div className="activity-options" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {Array.from(activity.options.entries()).map(([key, option]: [string, Option]) => {
          const isDisabled = !!option.disabled || (game.compelled && option.compelled === null);
          const hoverText = isDisabled && game.compelled && option.compelled === null 
            ? game.compelled || undefined
            : option.hoverText || undefined;
          
          return (
            <span key={key} style={{ width: 'fit-content' }}>
              <Button onClick={() => {}} size="medium" disabled={isDisabled} title={hoverText}>
                {option.label}
              </Button>
            </span>
          );
        })}
      </div>
    </div>
  );
} 