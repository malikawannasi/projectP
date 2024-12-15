import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [progress, setProgress] = useState(0); // State for upload progress

  // Fonction pour gérer le changement du fichier
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(''); // Clear error when a new file is selected
  };

  // Fonction pour gérer l'upload du fichier
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setProgress(0); // Reset progress on new upload
    const formData = new FormData();
    formData.append('csvFile', file);  // 'csvFile' corresponds to the Multer field name

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Important to download the file as a blob
        onUploadProgress: (progressEvent) => {
          // Update the progress state based on the uploaded percentage
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
      });

      // Vérifiez si la réponse contient des données
      if (response.data) {
        // Créer une URL pour le fichier ZIP à télécharger
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setDownloadUrl(url); // Mettre à jour l'URL de téléchargement
      } else {
        setError('No data received from server');
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        // Backend error responses
        setError(`Error: ${err.response.status} - ${err.response.data.message || 'An error occurred while uploading the file'}`);
      } else if (err.request) {
        // No response received from the server
        setError('No response from server. Please check your internet connection or try again later.');
      } else {
        // General error
        setError(`Error: ${err.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploading && (
        <div>
          <progress value={progress} max="100" /> {/* Display progress bar */}
          <p>{progress}%</p> {/* Display percentage */}
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      {downloadUrl && (
        <a href={downloadUrl} download="files.zip">
          Download ZIP
        </a>
      )}
    </div>
  );
};

export default FileUpload;


