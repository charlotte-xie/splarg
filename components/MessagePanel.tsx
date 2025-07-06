import { useEffect, useRef } from 'react';
import Game from '../classes/Game';
import Button from './Button';

interface MessagePanelProps {
  game: Game;
}

export default function MessagePanel({ game }: MessagePanelProps) {
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

  return (
    <div className="control-panel">
      {/* Fixed Header */}
        <h5>
          Message Log
        </h5>
      
      {/* Scrollable Messages Section */}
        {messages.length === 0 ? (
          <p data-type="empty">
            No messages yet
          </p>
        ) : (
          <>
            {messages.map((message) => (
              <p key={message.id} data-type={message.type}>
                {message.text}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      
      {/* Fixed Footer */}
      {messages.length > 0 && (
        <div className="control-panel-messages-footer">
          <Button
            onClick={() => game.clearMessages()}
            variant="secondary"
            size="small"
          >
            Clear Log
          </Button>
        </div>
      )}
    </div>
  );
} 