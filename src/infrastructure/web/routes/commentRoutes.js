const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const createCommentRoutes = (commentController) => {
  const router = express.Router();

  // Protected routes
  router.delete('/:id', authMiddleware, (req, res) => commentController.delete(req, res));

  return router;
};

module.exports = createCommentRoutes;
