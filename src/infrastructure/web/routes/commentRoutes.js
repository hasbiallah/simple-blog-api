const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const createCommentRoutes = (commentController) => {
  const router = express.Router();

  /**
   * @swagger
   * /comments/{id}:
   *   delete:
   *     summary: Delete a comment
   *     tags: [Comments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Comment deleted
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Comment not found
   */
  router.delete('/:id', authMiddleware, (req, res) => commentController.delete(req, res));

  return router;
};

module.exports = createCommentRoutes;
