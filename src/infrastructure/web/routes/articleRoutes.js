const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const createArticleRoutes = (articleController) => {
  const router = express.Router();

  router.get('/', (req, res) => articleController.getAll(req, res));
  router.get('/:id', (req, res) => articleController.getDetail(req, res));
  
  // Protected routes
  router.post('/', authMiddleware, (req, res) => articleController.create(req, res));
  router.put('/:id', authMiddleware, (req, res) => articleController.update(req, res));
  router.delete('/:id', authMiddleware, (req, res) => articleController.delete(req, res));

  return router;
};

module.exports = createArticleRoutes;
