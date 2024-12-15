import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div>
      <progress value={progress} max="100" />
      <p>{progress}%</p>
    </div>
  );
};

export default ProgressBar;
