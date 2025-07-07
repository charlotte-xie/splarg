import Item from '../classes/Item';
import Utils from '../classes/Utils';
import Button from './Button';

interface ActionButton {
  label: string;
  variant: 'primary' | 'secondary' | 'success' | 'danger';
  onClick: () => void;
  disabled?: boolean;
}

interface ItemDetailsProps {
  item: Item | null;
  actionButtons: ActionButton[];
}

export default function ItemDetails({ item, actionButtons }: ItemDetailsProps) {
  const isEmpty = !item;
  return (
    <div style={{
      marginTop: '3px',
      padding: '6px',
      backgroundColor: '#1a202c',
      borderRadius: '6px',
      border: '1px solid #d69e2e',
      minHeight: '120px',
      color: '#e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '8px',
      marginBottom: '8px',
      height: '100%', // allow parent to control height
    }}>
      <div>
        <div className="control-panel-row" style={{alignContent: 'end'}}>
          <span style={{ fontSize: '20px' }}>{isEmpty ? ' ' : item.getSymbol()}</span>
          <h5>
            {isEmpty ? 'No item selected' : Utils.capitalize(item.getName())}
            {!isEmpty && item.hasMultiple() && ` (${item.getQuantity()})`}
          </h5>
        </div>
        <p>
          {isEmpty ? '' : item.getDescription()}
        </p>
      </div>
      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: 'auto',
      }}>
        {actionButtons.map((button, index) => (
          <Button
            key={index}
            onClick={button.onClick}
            disabled={button.disabled}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
} 