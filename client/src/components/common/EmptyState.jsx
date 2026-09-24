import React from 'react';
import { Inbox, Search } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items matching your request or criteria at this moment.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <div className={`empty-state animate-fade-in ${className}`}>
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const Loader = ({ message = 'Loading details...', fullHeight = false }) => {
  return (
    <div className="loading-container" style={fullHeight ? { minHeight: '60vh' } : {}}>
      <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
      <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{message}</p>
    </div>
  );
};

export default EmptyState;
