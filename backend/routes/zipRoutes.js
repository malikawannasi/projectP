const express = require('express');
const router = express.Router();
const { generateZip } = require('../controllers/zipController');

router.get('/zip', generateZip);

module.exports = router;
