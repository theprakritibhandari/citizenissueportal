import React from 'react';

export const Loader = ({ message = 'Loading details...', fullHeight = false }) => {
  return (
    <div className="loading-container" style={fullHeight ? { minHeight: '60vh' } : {}}>
      <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
      <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{message}</p>
    </div>
  );
};

export default Loader;
