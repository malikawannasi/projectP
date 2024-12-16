const fs = require('fs');
const { splitCsvAndCreateZip } = require('../utils/splitCsvAndCreateZip');

const createZip = async (req, res) => {
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
};

module.exports = { createZip };
