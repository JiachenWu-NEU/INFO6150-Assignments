require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./src/config/db');
const seedAdmin = require('./src/config/seedAdmin');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const jobRoutes  = require('./src/routes/jobRoutes');
const companyRoutes = require('./src/routes/companyRoutes');

const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();

app.use(cors({ origin: ['http://localhost:5173'], credentials: false }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/jobs', jobRoutes);
app.use('/companies', companyRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
connectDB()
  .then(seedAdmin)
  .then(() => app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`)))
  .catch((e) => {
    console.error('FATAL: cannot start server', e);
    process.exit(1);
  });