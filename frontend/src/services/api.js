import axios from 'axios';

// API URL from environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/upload';

// Function to upload a file with progress tracking
export const uploadFile = async (file, setProgress) => {
  // Create a new FormData object to hold the file
  const formData = new FormData();
  formData.append('csvFile', file); // Append the file to the FormData

  try {
    // Make a POST request to upload the file
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type for file upload
      },
      responseType: 'blob', // Set the response type to 'blob' for binary data
      onUploadProgress: (progressEvent) => {
        // Track upload progress and update the progress state
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percent);
      },
    });

    // If the server responds with data
    if (response.data) {
      // Create a URL for the received blob data (usually a file or zip)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      return { url, success: true }; // Return the URL and success status
    } else {
      return { error: 'No data received from server', success: false }; // Handle no data case
    }
  } catch (err) {
    // Catch any error during the request and log it
    console.error(err);
    return { error: err.message || 'Upload failed', success: false }; // Return error message
  }
};
