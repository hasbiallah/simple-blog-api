const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const createAuthRoutes = (authController) => {
  const router = express.Router();

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, email, password]
   *             properties:
   *               name:
   *                 type: string
   *                 example: Budi Santoso
   *               email:
   *                 type: string
   *                 example: budi@email.com
   *               password:
   *                 type: string
   *                 example: password123
   *     responses:
   *       201:
   *         description: Registration successful
   *       400:
   *         description: Bad request
   *       409:
   *         description: Email already exists
   */
  router.post('/register', (req, res) => authController.register(req, res));

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *                 example: budi@email.com
   *               password:
   *                 type: string
   *                 example: password123
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  router.post('/login', (req, res) => authController.login(req, res));

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout user
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   *       401:
   *         description: Unauthorized
   */
  router.post('/logout', authMiddleware, (req, res) => authController.logout(req, res));

  return router;
};

module.exports = createAuthRoutes;
