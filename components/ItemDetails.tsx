import Item from '../classes/Item';
import Button from './Button';

interface ActionButton {
  label: string;
  variant: 'primary' | 'secondary' | 'success' | 'danger';
  onClick: () => void;
  disabled?: boolean;
}

interface ItemDetailsProps {
  item: Item;
  actionButtons: ActionButton[];
}

export default function ItemDetails({ item, actionButtons }: ItemDetailsProps) {
  return (
    <div style={{
      marginTop: '3px',
      padding: '6px',
      backgroundColor: '#1a202c',
      borderRadius: '6px',
      border: '1px solid #d69e2e',
      color: '#e2e8f0'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '20px' }}>{item.getSymbol()}</span>
        <h5>
          {item.getName()}
          {item.hasMultiple() && ` (${item.getQuantity()})`}
        </h5>
      </div>
      <p>
        {item.getDescription()}
      </p>
      
      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end'
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