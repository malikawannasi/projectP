const multer = require('multer'); // Import the 'multer' module for handling file uploads

// Configure multer to store uploaded files in the 'uploads/' directory
// The 'dest' option specifies the destination folder for the uploaded files
const upload = multer({ dest: 'uploads/' });

module.exports = { upload }; // Export the 'upload' configuration to be used in other parts of the application
