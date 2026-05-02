const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const createAuthRoutes = (authController) => {
  const router = express.Router();

  router.post('/register', (req, res) => authController.register(req, res));
  router.post('/login', (req, res) => authController.login(req, res));
  router.post('/logout', authMiddleware, (req, res) => authController.logout(req, res));

  return router;
};

module.exports = createAuthRoutes;
