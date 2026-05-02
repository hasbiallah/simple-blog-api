const express = require('express');
const cors = require('cors');

const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Root route
  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Simple Blog API is running',
      version: '1.0.0'
    });
  });

  return app;
};

module.exports = createApp;
