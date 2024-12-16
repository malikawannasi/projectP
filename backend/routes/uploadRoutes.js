const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');  // Import fs module
const { splitCsvAndCreateZip } = require('../utils/splitCsvAndCreateZip');  // Adjust if needed

const router = express.Router();

// Setup multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);  // Destination directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Filename with timestamp
  }
});

const upload = multer({ storage: storage });

// POST route for file upload
router.post('/upload', upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ message: 'File uploaded successfully', filePath: req.file.path });
});



module.exports = router;
