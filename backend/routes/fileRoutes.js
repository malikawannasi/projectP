const express = require('express');
const router = express.Router();
const { upload, uploadFile } = require('../controllers/fileController');

router.post('/upload', upload.single('csvFile'), uploadFile);

module.exports = router;
