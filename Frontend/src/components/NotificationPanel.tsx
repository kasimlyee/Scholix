import { ReactNode } from 'react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  return (
    <div className={`notification-panel ${isOpen ? 'open' : ''}`}>
      <div className="panel-header">
        <h3>Notifications</h3>
        <button onClick={onClose}>&times;</button>
      </div>
      <div className="panel-content">
        {/* Notification content */}
      </div>
    </div>
  );
}
