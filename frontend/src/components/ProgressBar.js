import React from 'react';

const ProgressBar = ({ progress, color }) => {
  return (
    <div style={{ width: '100%', backgroundColor: '#f3f3f3', borderRadius: '10px', margin: '10px 0' }}>
      <div
        style={{
          height: '20px',
          width: `${progress}%`,
          backgroundColor: color || 'blue',
          borderRadius: '10px',
        }}
      ></div>
      <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '14px', fontWeight: 'bold' }}>
        {progress}%
      </div>
    </div>
  );
};


export default ProgressBar;
