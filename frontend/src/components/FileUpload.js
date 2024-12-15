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
    setError('');
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
      setError('Error uploading file');
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
      {error && <p>{error}</p>}
      {downloadUrl && (
        <a href={downloadUrl} download="files.zip">
          Download ZIP
        </a>
      )}
    </div>
  );
};

export default FileUpload;

