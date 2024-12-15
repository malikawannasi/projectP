// backend/routes/fileRoutes.js
const express = require('express');
const { uploadFile } = require('../controllers/fileController');
const router = express.Router();

router.post('/', uploadFile); // Route pour uploader le fichier

module.exports = router;


