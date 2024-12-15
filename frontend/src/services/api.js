// frontend/src/services/api.js
import axios from 'axios';

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('csvFile', file);

  const response = await axios.post('http://localhost:5000/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export default { uploadFile };
