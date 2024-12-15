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
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
      } catch (err) {
        return reject('Error creating directory');
      }
    }

    // Lire le fichier CSV
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject('Error reading file');
      }

      // Parser le fichier CSV avec csv-parse
      parse(data, { columns: true, skip_empty_lines: true }, (parseErr, records) => {
        if (parseErr) {
      
          return reject('Error parsing CSV');
        }

        // Séparer les données par genre, avec gestion des majuscules/minuscules
        const males = records.filter(row => row.gender && row.gender.toLowerCase() === 'male');
        const females = records.filter(row => row.gender && row.gender.toLowerCase() === 'female');

        // Créer les fichiers CSV pour chaque genre
        const maleCsv = path.join(uploadDir, 'male.csv');
        const femaleCsv = path.join(uploadDir, 'female.csv');

        // Fonction pour écrire un tableau d'objets dans un fichier CSV
        const writeCsvFile = (filePath, data) => {
          if (data.length === 0) {
            return;
          }

          // Ajouter l'en-tête (les clés de l'objet)
          const headers = Object.keys(data[0]);
          const csvData = [
            headers.join(','), // En-têtes
            ...data.map(row => headers.map(header => row[header]).join(',')) // Données
          ].join('\n');

          try {
            fs.writeFileSync(filePath, csvData, 'utf8');
          } catch (err) {
            return reject('Error writing CSV file');
          }
        };

        // Écrire les fichiers CSV
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



