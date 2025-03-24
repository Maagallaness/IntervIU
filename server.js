require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');

// Import routes
const userRoutes = require('./routes/users');
const interviewRoutes = require('./routes/interviews');

// Initialize Express app
const app = express();
const prisma = new PrismaClient().$extends(withAccelerate());
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/interviews', interviewRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to IntervIU API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Connect to the database
  try {
    await prisma.$connect();
    console.log('Connected to MongoDB via Prisma');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Process terminated');
  });
});

module.exports = app;