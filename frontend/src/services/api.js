import axios from 'axios';

// API URLs from environment variables or fallback to localhost
const API_UPLOAD_URL = process.env.REACT_APP_API_UPLOAD_URL || 'http://localhost:5000/upload';
const API_DOWNLOAD_URL = process.env.REACT_APP_API_DOWNLOAD_URL || 'http://localhost:5000/zip';

// Function to upload a file and get the filename (POST /upload)
export const uploadFile = async (file, setProgress) => {
  const formData = new FormData();
  formData.append('csvFile', file); // Append the file to the FormData

  try {
    // Make a POST request to upload the file
    const response = await axios.post(API_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'json', // Expect JSON data as response (file path)
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percent); // Update progress state
      },
    });

    // If the response has data, extract the file path for later use
    if (response.data && response.data.filePath) {
      return { filePath: response.data.filePath, success: true };
    } else {
      return { error: 'No file path received from server', success: false };
    }
  } catch (err) {
    console.error(err);
    return { error: err.message || 'Upload failed', success: false };
  }
};

// Function to download a ZIP file by filePath (GET /zip?filePath=)
export const downloadFileByPath = async (filePath, setDownloadProgress) => {
  try {
    const response = await axios.get(`${API_DOWNLOAD_URL}?filePath=${encodeURIComponent(filePath)}`, {
      responseType: 'blob', // Set response type to 'blob'
      onDownloadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setDownloadProgress(percent); // Update download progress state
      },
    });

    // If the file is retrieved, create a download link
    if (response.data) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'files.zip'); // Default filename for download
      document.body.appendChild(link);
      link.click(); // Trigger the download
      link.parentNode.removeChild(link); // Clean up the DOM

      return { success: true };
    } else {
      return { error: 'No file received from server', success: false };
    }
  } catch (err) {
    console.error(err);
    return { error: err.message || 'Download failed', success: false };
  }
};
