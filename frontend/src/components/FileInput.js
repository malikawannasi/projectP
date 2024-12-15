import React from 'react';

const FileInput = ({ onFileChange }) => {
  return (
    <input
      type="file"
      onChange={onFileChange}
      aria-label="Upload CSV file"
    />
  );
};

export default FileInput;
