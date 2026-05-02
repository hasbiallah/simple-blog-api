const express = require('express');
const cors = require('cors');
const { pool } = require('../database/mysql_connection');

// Infrastructure
const PasswordHasher = require('../security/PasswordHasher');
const TokenManager = require('../security/TokenManager');

// Repositories
const UserRepositoryMySQL = require('../../adapters/repositories/UserRepositoryMySQL');

// Use Cases
const RegisterUser = require('../../use_cases/auth/RegisterUser');
const LoginUser = require('../../use_cases/auth/LoginUser');

// Controllers
const AuthController = require('../../adapters/controllers/AuthController');

// Routes
const createAuthRoutes = require('./routes/authRoutes');

const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Dependency Injection
  const userRepository = new UserRepositoryMySQL(pool);
  const passwordHasher = new PasswordHasher();
  const tokenManager = new TokenManager();

  const registerUser = new RegisterUser(userRepository, passwordHasher);
  const loginUser = new LoginUser(userRepository, passwordHasher, tokenManager);

  const authController = new AuthController(registerUser, loginUser);

  // Routes
  app.use('/api/auth', createAuthRoutes(authController));

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
