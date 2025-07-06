import { useEffect, useRef } from 'react';
import Game from '../classes/Game';

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
    <div className="control-panel control-panel-messages">
      {/* Fixed Header */}
      <div className="control-panel-messages-header">
        <h5>
          Message Log
        </h5>
      </div>
      
      {/* Scrollable Messages Section */}
      <div className="control-panel-messages-content">
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
      </div>
      
      {/* Fixed Footer */}
      {messages.length > 0 && (
        <div className="control-panel-messages-footer">
          <button
            onClick={() => game.clearMessages()}
            className="control-panel-clear-button"
          >
            Clear Log
          </button>
        </div>
      )}
    </div>
  );
} 