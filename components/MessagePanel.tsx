import Game from '../classes/Game';

interface MessagePanelProps {
  game: Game;
}

export default function MessagePanel({ game }: MessagePanelProps) {
  const messages = game.getMessages();

  const getMessageStyle = (type: string) => {
    const baseStyle = {
      padding: '8px 12px',
      marginBottom: '4px',
      borderRadius: '4px',
      fontSize: '12px',
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
    <div style={{
      marginTop: '16px',
      padding: '12px',
      backgroundColor: '#1a202c',
      borderRadius: '6px',
      border: '1px solid #4a5568',
      maxHeight: '200px',
      overflowY: 'auto'
    }}>
      <h5 style={{ 
        color: '#d69e2e', 
        marginBottom: '8px', 
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Message Log
      </h5>
      
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
        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {messages.map((message) => (
            <div key={message.id} style={getMessageStyle(message.type)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ flex: 1 }}>{message.text}</span>
                <span style={{ 
                  fontSize: '10px', 
                  opacity: 0.7, 
                  marginLeft: '8px',
                  whiteSpace: 'nowrap'
                }}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {messages.length > 0 && (
        <div style={{
          marginTop: '8px',
          textAlign: 'right'
        }}>
          <button
            onClick={() => game.clearMessages()}
            style={{
              background: 'none',
              border: '1px solid #4a5568',
              color: '#a0aec0',
              padding: '4px 8px',
              borderRadius: '3px',
              fontSize: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2d3748';
              e.currentTarget.style.color = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#a0aec0';
            }}
          >
            Clear Log
          </button>
        </div>
      )}
    </div>
  );
} 