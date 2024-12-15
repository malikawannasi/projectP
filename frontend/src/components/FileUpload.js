import React, { useState, useCallback } from 'react';
// Importing React and hooks (useState, useCallback) for state management and optimizations
import FileInput from './FileInput'; 
import ProgressBar from './ProgressBar'; 
import { uploadFile } from '../services/api'; 

const FileUpload = () => {
  // Declaring state variables using useState hook
  const [file, setFile] = useState(null); 
  const [uploading, setUploading] = useState(false); 
  const [error, setError] = useState(''); 
  const [downloadUrl, setDownloadUrl] = useState(''); 
  const [progress, setProgress] = useState(0); 

  // handleFileChange function is called when a file is selected
  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0]; 
    if (selectedFile) {
      // Checking if the file size is greater than 500MB
      if (selectedFile.size > 500 * 1024 * 1024) {
        setError('File size exceeds the 500MB limit');
        setFile(null); 
        return;
      }
      setFile(selectedFile); // Setting the selected file to the state
      setError(''); // Clearing any previous error
    }
  }, []); 

  // handleUpload function handles the actual file upload process
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file'); 
      return;
    }

    setUploading(true); // Setting uploading state to true
    setProgress(0); // Resetting progress before starting upload

    // Calling the uploadFile function from the api service and passing the file
    const { url, error, success } = await uploadFile(file, setProgress);

    if (success) {
      setDownloadUrl(url);
    } else {
      setError(error); 
    }

    setUploading(false); 
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      {/* Rendering the FileInput component and passing handleFileChange to it */}
      <FileInput onFileChange={handleFileChange} />
      
      {/* Button for triggering the upload */}
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {/* Conditionally rendering the ProgressBar if uploading */}
      {uploading && <ProgressBar progress={progress} />}

      {/* Displaying error messages if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Displaying the download link if the file is uploaded successfully */}
      {downloadUrl && (
        <a href={downloadUrl} download="file.zip">
          Download ZIP
        </a>
      )}
    </div>
  );
};

export default FileUpload;


