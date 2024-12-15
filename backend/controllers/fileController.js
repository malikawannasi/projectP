const express = require('express');
const multer = require('multer');
const path = require('path');
const { splitCsvAndCreateZip } = require('../utils/splitCsvAndCreateZip');

// Multer configuration to handle file uploads
const upload = multer({ dest: 'uploads/' });

const uploadFile = async (req, res) => {
  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Process the uploaded CSV file and get the path of the generated ZIP file
    const zipFilePath = await splitCsvAndCreateZip(req.file.path);

    // Send the ZIP file to the client
    res.download(zipFilePath, 'files.zip', (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Remove the uploaded and generated files after sending
      fs.unlinkSync(req.file.path);
      fs.unlinkSync(zipFilePath);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { uploadFile };

