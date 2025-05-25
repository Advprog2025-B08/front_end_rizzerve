import React from 'react';

function Loading() {
  const spinnerStyle = {
    display: 'inline-block',
    width: '24px',
    height: '24px',
    border: '3px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '50%',
    borderTopColor: '#4CAF50',
    animation: 'spin 1s ease-in-out infinite',
    marginRight: '10px'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
      <span>Loading...</span>
    </div>
  );
}

export default Loading;