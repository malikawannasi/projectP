const fs = require('fs'); // Module for file system operations
const path = require('path'); // Module for working with file and directory paths
const { parse } = require('csv-parse'); // Correct import syntax for the CSV parser
const archiver = require('archiver'); // Module for creating ZIP archives

// Create 'uploads' directory if it doesn't exist
const ensureUploadsDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Parse CSV file into records (rows)
const parseCsvFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject('Error reading file');
      }

      parse(data, { columns: true, skip_empty_lines: true }, (parseErr, records) => {
        if (parseErr) {
          return reject('Error parsing CSV');
        }
        resolve(records);
      });
    });
  });
};

// Filter records by gender (case insensitive)
const filterByGender = (records, gender) => {
  return records.filter(row => row.gender && row.gender.toLowerCase() === gender.toLowerCase());
};

// Write array of objects to CSV file (async version)
const writeCsvFile = async (filePath, data) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvData = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');

  await fs.promises.writeFile(filePath, csvData, 'utf8');
};

// Create a ZIP file containing the given CSV files
const createZipArchive = (zipPath, files) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 1 } }); // Lower compression level for faster speed

    output.on('close', () => resolve(zipPath));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    files.forEach(file => archive.file(file.path, { name: file.name }));
    archive.finalize();
  });
};

// Main function to split CSV by gender and create a ZIP file
const splitCsvAndCreateZip = async (filePath) => {
  const uploadDir = path.join(__dirname, 'uploads');
  ensureUploadsDirectoryExists(uploadDir);

  try {
    const records = await parseCsvFile(filePath);

    const males = filterByGender(records, 'male');
    const females = filterByGender(records, 'female');

    const maleCsv = path.join(uploadDir, 'male.csv');
    const femaleCsv = path.join(uploadDir, 'female.csv');

    // Execute CSV writing operations in parallel
    await Promise.all([
      writeCsvFile(maleCsv, males),
      writeCsvFile(femaleCsv, females)
    ]);

    const zipPath = path.join(uploadDir, 'files.zip');
    await createZipArchive(zipPath, [
      { path: maleCsv, name: 'male.csv' },
      { path: femaleCsv, name: 'female.csv' }
    ]);

    return zipPath;
  } catch (err) {
    throw err;
  }
};

module.exports = { splitCsvAndCreateZip };
