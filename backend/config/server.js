const express = require('express');
const cors = require('cors');
const fileRoutes = require('./../routes/fileRoutes');
const zipRoutes = require('./../routes/zipRoutes');

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Serve static files (if needed)
app.use(express.static('public'));

// Use the defined routes
app.use(fileRoutes);
app.use(zipRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
