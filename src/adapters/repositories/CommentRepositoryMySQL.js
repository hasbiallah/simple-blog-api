const ICommentRepository = require('../../core/interfaces/ICommentRepository');
const Comment = require('../../core/entities/Comment');

class CommentRepositoryMySQL extends ICommentRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async save(comment) {
    const { article_id, user_id, content, created_at } = comment;
    const query = 'INSERT INTO comments (article_id, user_id, content, created_at) VALUES (?, ?, ?, ?)';
    const [result] = await this.pool.execute(query, [article_id, user_id, content, created_at]);
    
    return new Comment({
      id: result.insertId,
      article_id,
      user_id,
      content,
      created_at
    });
  }

  async delete(id) {
    const query = 'DELETE FROM comments WHERE id = ?';
    const [result] = await this.pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  async findByArticleId(articleId) {
    const query = `
      SELECT c.*, u.name as user_name 
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.article_id = ? 
      ORDER BY c.created_at ASC
    `;
    const [rows] = await this.pool.execute(query, [articleId]);
    
    return rows.map(row => {
      const comment = new Comment(row);
      comment.user = { id: row.user_id, name: row.user_name }; // Attach user info
      return comment;
    });
  }
}

module.exports = CommentRepositoryMySQL;
