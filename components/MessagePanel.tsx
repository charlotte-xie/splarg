import { useEffect, useRef } from 'react';
import Game from '../classes/Game';
import Button from './Button';

interface MessagePanelProps {
  game: Game;
  onUpdate: () => void;
}

export default function MessagePanel({ game, onUpdate }: MessagePanelProps) {
  const messages = game.getMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const handleClearMessages = () => {
    game.clearMessages();
    onUpdate();
  };

  return (
    <div className="control-panel" style={{ maxHeight: '30vh', flex:1 , display: 'flex', flexDirection: 'column' }}>
      {/* Fixed Header */}
      <div className="control-panel-messages-header">
        <h5>
          Message Log
        </h5>
      </div>
      
      {/* Scrollable Messages Section */}
      <div className="control-panel-messages" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {messages.map((message) => (
          <p key={message.id} data-type={message.type}>
            {message.text}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Fixed Footer */}
      
      <div className="control-panel-messages-footer">
        <Button
          onClick={handleClearMessages}
          variant="secondary"
          size="small"
        >
          Clear Log
        </Button>
      </div>
    </div>
  );
} 