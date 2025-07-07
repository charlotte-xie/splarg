import React, { useState } from 'react';

interface Tab {
  id: string;
  icon: string;
  label: string;
  content: React.ReactNode;
}

interface TabbedPanelProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export default function TabbedPanel({ tabs, defaultTab, className = "" }: TabbedPanelProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  return (
    <div className={`tabbed-panel ${className}`}>
      <div className="tab-header" style={{
        display: 'flex',
        borderBottom: '2px solid #d69e2e',
        marginBottom: '0',
        gap: '4px'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            style={{
              background: activeTab === tab.id ? 'var(--leather-dark)' : 'transparent',
              border: '1px solid #d69e2e',
              borderBottom: activeTab === tab.id ? '1px solid var(--leather-dark)' : '1px solid #d69e2e',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '20px',
              color: activeTab === tab.id ? '#d69e2e' : '#a0aec0',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-icons)',
              fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
              borderRadius: '6px 6px 0 0',
              marginBottom: '-2px',
              position: 'relative',
              zIndex: activeTab === tab.id ? 1 : 0
            }}
            title={tab.label}
          >
            <span>{tab.icon}</span>
          </button>
        ))}
      </div>
      
      <div className="tab-content" style={{
        border: '1px solid #d69e2e',
        borderTop: 'none',
        borderRadius: '0 0 8px 8px',
        padding: '16px',
        width: '100%',
        backgroundColor: 'var(--leather-dark)'
      }}>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
} 