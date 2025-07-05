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
        borderBottom: '2px solid #4a5568',
        marginBottom: '16px'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '20px',
              color: activeTab === tab.id ? '#d69e2e' : '#a0aec0',
              borderBottom: activeTab === tab.id ? '2px solid #d69e2e' : '2px solid transparent',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={tab.label}
          >
            <span>{tab.icon}</span>
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
} 