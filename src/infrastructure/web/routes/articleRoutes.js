const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const createArticleRoutes = (articleController, commentController) => {
  const router = express.Router();

  /**
   * @swagger
   * /articles:
   *   get:
   *     summary: Get list of published articles
   *     tags: [Articles]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: List of articles
   */
  router.get('/', (req, res) => articleController.getAll(req, res));

  /**
   * @swagger
   * /articles/{id}:
   *   get:
   *     summary: Get article detail with comments
   *     tags: [Articles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Article detail
   *       404:
   *         description: Article not found
   */
  router.get('/:id', (req, res) => articleController.getDetail(req, res));
  
  /**
   * @swagger
   * /articles:
   *   post:
   *     summary: Create a new article
   *     tags: [Articles]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [title, content]
   *             properties:
   *               title:
   *                 type: string
   *               content:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [draft, published]
   *     responses:
   *       201:
   *         description: Article created
   *       403:
   *         description: Forbidden
   */
  router.post('/', authMiddleware, (req, res) => articleController.create(req, res));

  /**
   * @swagger
   * /articles/{id}:
   *   put:
   *     summary: Update an article
   *     tags: [Articles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               content:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [draft, published]
   *     responses:
   *       200:
   *         description: Article updated
   *       403:
   *         description: Forbidden
   */
  router.put('/:id', authMiddleware, (req, res) => articleController.update(req, res));

  /**
   * @swagger
   * /articles/{id}:
   *   delete:
   *     summary: Delete an article
   *     tags: [Articles]
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
   *         description: Article deleted
   *       403:
   *         description: Forbidden
   */
  router.delete('/:id', authMiddleware, (req, res) => articleController.delete(req, res));

  /**
   * @swagger
   * /articles/{id}/comments:
   *   post:
   *     summary: Add a comment to an article
   *     tags: [Comments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [content]
   *             properties:
   *               content:
   *                 type: string
   *     responses:
   *       201:
   *         description: Comment added
   *       404:
   *         description: Article not found
   */
  router.post('/:id/comments', authMiddleware, (req, res) => commentController.create(req, res));

  return router;
};

module.exports = createArticleRoutes;
