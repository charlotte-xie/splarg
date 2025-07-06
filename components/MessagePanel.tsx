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

  const getMessageStyle = (type: string) => {
    const baseStyle = {
      borderRadius: '4px',
      fontSize: '14px',
      lineHeight: '1.4',
      border: '1px solid',
      wordBreak: 'break-word' as const
    };

    switch (type) {
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: '#742a2a',
          color: '#fed7d7',
          borderColor: '#9b2c2c'
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: '#744210',
          color: '#faf089',
          borderColor: '#d69e2e'
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: '#22543d',
          color: '#9ae6b4',
          borderColor: '#38a169'
        };
      case 'info':
      default:
        return {
          ...baseStyle,
          backgroundColor: '#2d3748',
          color: '#e2e8f0',
          borderColor: '#4a5568'
        };
    }
  };

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
          <div style={{
            color: '#718096',
            fontSize: '12px',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '20px'
          }}>
            No messages yet
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} style={getMessageStyle(message.type)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ flex: 1 }}>{message.text}</span>
                </div>
              </div>
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