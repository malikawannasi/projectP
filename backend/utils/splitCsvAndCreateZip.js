const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');  // Correct import syntax
const archiver = require('archiver'); // Pour compresser en zip

// Fonction pour diviser le CSV et créer un ZIP
const splitCsvAndCreateZip = (filePath) => {
  return new Promise((resolve, reject) => {
    // Créer le répertoire 'uploads' s'il n'existe pas
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Lire le fichier CSV
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject('Error reading file');

      // Parser le fichier CSV avec csv-parse
      parse(data, { columns: true, skip_empty_lines: true }, (parseErr, records) => {
        if (parseErr) return reject('Error parsing CSV');

        // Séparer les données par genre
        const males = records.filter(row => row.gender === 'Male');
        const females = records.filter(row => row.gender === 'Female');

        // Créer les fichiers CSV pour chaque genre
        const maleCsv = path.join(uploadDir, 'male.csv');
        const femaleCsv = path.join(uploadDir, 'female.csv');

        // Fonction pour écrire un tableau d'objets dans un fichier CSV
        const writeCsvFile = (filePath, data) => {
          const csvData = data.map(row => Object.values(row).join(',')).join('\n');
          fs.writeFileSync(filePath, csvData);
        };

        writeCsvFile(maleCsv, males);
        writeCsvFile(femaleCsv, females);

        // Créer un fichier ZIP
        const zipPath = path.join(uploadDir, 'files.zip');
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
          resolve(zipPath);  // Retourner le chemin du fichier zip
        });

        archive.on('error', err => {
          reject(err);
        });

        archive.pipe(output);
        archive.file(maleCsv, { name: 'male.csv' });
        archive.file(femaleCsv, { name: 'female.csv' });
        archive.finalize();
      });
    });
  });
};

module.exports = { splitCsvAndCreateZip };



