import { useState } from 'react';
import { Activity, ContentType } from '../classes/Activity';
import Game from '../classes/Game';
import ActivityBlock from './ActivityBlock';

interface ActivityPanelProps {
  game: Game;
  onGameUpdate: (game: Game) => void;
}

export default function ActivityPanel({ game, onGameUpdate }: ActivityPanelProps) {
  // Test activity
  const [activities] = useState<Activity[]>([
    new Activity(
      'Test Activity',
      [
        { type: ContentType.speech, value: 'Hello, adventurer!', colour: '#e2c275' },
        { type: ContentType.story, value: 'You find yourself in a mysterious land.', colour: '#b08d57' },
      ],
      new Map([
        ['ok', { label: 'OK', hoverText: 'Acknowledge the message' }],
        ['more', { label: 'Tell me more', hoverText: 'Get more information' }],
      ])
    ),
    new Activity(
      'Stats Update',
      [
        { type: ContentType.stat, value: '+10 XP', colour: '#9ae6b4' },
      ],
      new Map([
        ['close', { label: 'Close', hoverText: 'Dismiss this notification' }],
      ])
    ),
  ]);

  return (
    <div className="control-panel" style={{height:"100%", flex: "1", display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', width: '100%' }}>
        {activities.map((activity, idx) => (
          <ActivityBlock
            key={idx}
            activity={activity}
            game={game}
            onGameUpdate={onGameUpdate}
            style={{ width: '100%' }}
          />
        ))}
      </div>
    </div>
  );
} 