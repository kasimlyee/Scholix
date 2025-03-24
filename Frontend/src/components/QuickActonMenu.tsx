import { ReactNode } from 'react';

interface QuickActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export default function QuickActionMenu({ isOpen, onClose }: QuickActionMenuProps) {
  return (
    <div className={`quick-action-menu ${isOpen ? 'open' : ''}`}>
      <div className="menu-header">
        <h4>Quick Actions</h4>
        <button onClick={onClose}>&times;</button>
      </div>
      <div className="action-items">
        <button>Create Report</button>
        <button>New Event</button>
        <button>Refresh Data</button>
      </div>
    </div>
  );
}