import React from 'react';

export default function Controls() {
  return (
    <div className="controls-info">
      <h4>Controls</h4>
      <div className="control-item">
        <span className="control-key">Numpad 1-9</span>
        <span className="control-desc">Move character</span>
      </div>
      <div className="control-item">
        <span className="control-key">Arrow Keys</span>
        <span className="control-desc">Move character</span>
      </div>
      <div className="control-item">
        <span className="control-key">Ctrl+R</span>
        <span className="control-desc">Reset game</span>
      </div>
      <div className="control-item">
        <span className="control-key">Ctrl+S</span>
        <span className="control-desc">Save game</span>
      </div>
      <div className="control-item">
        <span className="control-key">Ctrl+L</span>
        <span className="control-desc">Load game</span>
      </div>
    </div>
  );
} 