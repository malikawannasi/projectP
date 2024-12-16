const fs = require('fs');

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // File uploaded successfully
  res.json({ message: 'File uploaded successfully', filePath: req.file.path });
};

module.exports = { uploadFile };
