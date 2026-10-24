const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const autoSeed = require('./utils/autoSeed');
const errorHandler = require('./middleware/errorHandler');

// Initialize app
const app = express();

// Connect to Database & Auto-seed
connectDB().then(async () => {
  await autoSeed();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/workshops', require('./routes/workshopRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback route to frontend index.html for SPA-like navigation
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🌸 THE HAMPER TELLS — Server running on port ${PORT}`);
  console.log(`🌐 Website URL: http://localhost:${PORT}`);
  console.log(`===================================================`);
});
