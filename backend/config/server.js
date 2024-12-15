const express = require('express');
const multer = require('multer');
const { splitCsvAndCreateZip } = require('./../utils/splitCsvAndCreateZip');
const path = require('path');
const cors = require('cors');
const fs = require('fs'); // Import the fs module

const app = express();

// Enable CORS for all origins (you can modify this to limit it to specific domains if needed)
app.use(cors());

// Configuration of file storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';

    // Check if the 'uploads' directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });  // Create the directory and any necessary parent directories
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

// Route for uploading the CSV file and creating the ZIP
app.post('/upload', upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Call the function to split the CSV and create the ZIP
    const zipFilePath = await splitCsvAndCreateZip(req.file.path);

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
