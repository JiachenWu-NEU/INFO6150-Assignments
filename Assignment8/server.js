require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ensure images folder exists
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);

// Serve images statically
app.use('/images', express.static(imagesDir));

// Routes
app.use('/user', userRoutes);

// Swagger
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/user_api_assignment';

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📘 Swagger docs at http://localhost:${PORT}/api-docs`);
  });
});
