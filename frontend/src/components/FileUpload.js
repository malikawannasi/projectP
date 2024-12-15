import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

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
    const formData = new FormData();
    // Change to 'csvFile' to match the backend field name
    formData.append('csvFile', file);  // 'csvFile' corresponds to the Multer field name

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Important to download the file as a blob
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
