import React, { useState, useCallback } from 'react';
import FileInput from './FileInput';
import ProgressBar from './ProgressBar';
import { uploadFile, downloadFileByPath } from '../services/api'; // Import downloadFileByPath

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false); // State for download progress
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0); // State to track download progress
  const [downloadUrl, setDownloadUrl] = useState('');
  const [filePath, setFilePath] = useState(''); // State to store the file path for downloading

  // File selection handler
  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if the file size exceeds 500MB
      if (selectedFile.size > 500 * 1024 * 1024) {
        setError('File size exceeds the 500MB limit');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  }, []);

  // Upload file function
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setProgress(0);

    const { filePath, success, error } = await uploadFile(file, setProgress); // Use filePath returned from API

    if (success) {
      setDownloadUrl(filePath); // Set filePath for downloading
      setFilePath(filePath); // Store filePath for later download
      setError('');
    } else {
      setError(error);
    }

    setUploading(false);
  };

  // Function to download the ZIP file with progress tracking
  const handleDownloadZip = async () => {
    if (!filePath) {
      setError('No file available for download');
      return;
    }

    setDownloading(true);
    setDownloadProgress(0);

    try {
      const { success, error } = await downloadFileByPath(filePath, (progress) => {
        setDownloadProgress(progress);
      });

      if (!success) {
        setError(error);
      }
    } catch (err) {
      setError('Error downloading file');
    }

    setDownloading(false);
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <FileInput onFileChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploading && <ProgressBar progress={progress} />}
      {downloading && <ProgressBar progress={downloadProgress} />} {/* Show download progress */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Button to download the ZIP */}
      {downloadUrl && (
        <div>
          <p>File uploaded successfully!</p>
          <button onClick={handleDownloadZip}>
            {filePath ? 'Download ZIP' : 'Download ZIP'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
