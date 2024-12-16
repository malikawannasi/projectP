const express = require('express');
const { createZip } = require('../controllers/getController');

const router = express.Router();

// Route for generating the ZIP file from the uploaded CSV
router.get('/', createZip);

module.exports = router;
