
export default function Controls() {
  return (
    <div className="control-panel">
      <h4>Controls</h4>
      <div className="control-panel-grid" style={{gridTemplateColumns: '1fr 2fr', columnCount: 2}}>
        <span className="control-key">Numpad 1-9</span>
        <span className="control-desc">Move player</span>
        <span className="control-key">Arrow Keys</span>
        <span className="control-desc">Move player</span>
        <span className="control-key">Ctrl+R</span>
        <span className="control-desc">Reset game</span>
        <span className="control-key">Ctrl+S</span>
        <span className="control-desc">Save game</span>
        <span className="control-key">Ctrl+L</span>
        <span className="control-desc">Load game</span>
      </div>
    </div>
  );
} 