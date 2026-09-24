import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, className = '' }) => {
  const { translateStatus } = useLanguage();
  let variant = 'submitted';

  switch (status) {
    case 'Submitted':
      variant = 'status-submitted';
      break;
    case 'Under Review':
      variant = 'status-review';
      break;
    case 'In Progress':
      variant = 'status-progress';
      break;
    case 'Resolved':
      variant = 'status-resolved';
      break;
    case 'Rejected':
      variant = 'status-rejected';
      break;
    default:
      variant = 'status-submitted';
  }

  const label = translateStatus(status) || status || 'Submitted';

  return (
    <span className={`badge badge-${variant} ${className}`}>
      <span className="badge-dot" />
      {label}
    </span>
  );
};

export const PriorityBadge = ({ priority, className = '' }) => {
  const { translatePriority } = useLanguage();
  let variant = 'medium';
  const p = (priority || 'Medium').toLowerCase();

  if (p === 'low') variant = 'priority-low';
  else if (p === 'medium') variant = 'priority-medium';
  else if (p === 'high') variant = 'priority-high';
  else if (p === 'urgent') variant = 'priority-urgent';

  const label = translatePriority(priority) || priority || 'Medium';

  return (
    <span className={`badge badge-${variant} ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
