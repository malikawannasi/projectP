const express = require('express');
const multer = require('multer');
const { splitCsvAndCreateZip } = require('./../utils/splitCsvAndCreateZip');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Enable CORS for all origins (you can modify this to limit it to specific domains if needed)
app.use(cors());

// Configuration of file storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';

    // Check if the 'uploads' directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory and any necessary parent directories
    }

    cb(null, uploadDir); // Destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with a unique timestamp
  }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route for uploading the CSV file (POST request)
app.post('/upload', upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // File uploaded successfully, send the file path back for later processing
  res.json({ message: 'File uploaded successfully', filePath: req.file.path });
});

// Route for generating the ZIP file from the uploaded CSV (GET request)
app.get('/zip', async (req, res) => {
  const filePath = req.query.filePath;

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(400).json({ message: 'File not found for processing' });
  }

  try {
    // Call the function to split the CSV and create the ZIP
    const zipFilePath = await splitCsvAndCreateZip(filePath);

    // Send the ZIP file in response
    res.download(zipFilePath, 'files.zip', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error downloading the file', error: err });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing the file', error: error.message });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
