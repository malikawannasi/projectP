import React, { useState, useCallback } from 'react';
import FileInput from './FileInput';
import ProgressBar from './ProgressBar';
import { uploadFile, downloadFileByPath } from '../services/api';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0); // Progress for upload
  const [downloadProgress, setDownloadProgress] = useState(0); // Progress for download
  const [downloadUrl, setDownloadUrl] = useState('');
  const [filePath, setFilePath] = useState('');

  // Handle file change with extension and size validation
  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Liste des extensions autorisées (uniquement CSV)
      const allowedExtensions = ['csv'];
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

      // Vérification de l'extension du fichier
      if (!allowedExtensions.includes(fileExtension)) {
        setError('Please upload a CSV file only (PDF, Word, and image files are not allowed)');
        setFile(null);
        return;
      }

      // Vérification de la taille du fichier (max 500MB)
      if (selectedFile.size > 500 * 1024 * 1024) {
        setError('The file size exceeds the 500MB limit. Please upload a smaller CSV file.');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  }, []);

  // Handle file upload with progress tracking
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setProgress(0);

    const { filePath, success, error } = await uploadFile(file, setProgress);

    if (success) {
      setDownloadUrl(filePath);
      setFilePath(filePath);
      setError('');
    } else {
      setError(error);
    }

    setUploading(false);
  };

  // Handle downloading the file with progress tracking
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

      {uploading && <ProgressBar progress={progress} color="blue" />}
      {downloading && (
        <div>
          <ProgressBar progress={downloadProgress} color="green" />
          <p>Please wait, the ZIP is downloading...</p> {/* Message when downloading ZIP */}
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}

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
