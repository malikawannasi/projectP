const express = require('express');
const multer = require('multer');
const path = require('path');
const { splitCsvAndCreateZip } = require('../utils/splitCsvAndCreateZip');

// Configuration de multer pour gérer les uploads de fichiers
const upload = multer({ dest: 'uploads/' });

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Traiter le fichier CSV et obtenir le chemin du fichier ZIP
    const zipFilePath = await splitCsvAndCreateZip(req.file.path);

    // Envoyer le fichier ZIP au client
    res.download(zipFilePath, 'files.zip', (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Supprimer les fichiers après l'envoi
      fs.unlinkSync(req.file.path);
      fs.unlinkSync(zipFilePath);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { uploadFile };
