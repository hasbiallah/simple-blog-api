const IArticleRepository = require('../../core/interfaces/IArticleRepository');
const Article = require('../../core/entities/Article');

class ArticleRepositoryMySQL extends IArticleRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async save(article) {
    const { user_id, title, content, status, created_at, updated_at } = article;
    const query = 'INSERT INTO articles (user_id, title, content, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await this.pool.execute(query, [user_id, title, content, status, created_at, updated_at]);
    
    return new Article({
      id: result.insertId,
      user_id,
      title,
      content,
      status,
      created_at,
      updated_at
    });
  }

  async findAll({ limit, offset, status }) {
    let query = 'SELECT * FROM articles';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await this.pool.execute(query, params);
    return rows.map(row => new Article(row));
  }

  async countAll({ status }) {
    let query = 'SELECT COUNT(*) as total FROM articles';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    const [rows] = await this.pool.execute(query, params);
    return rows[0].total;
  }

  async findById(id) {
    const query = 'SELECT * FROM articles WHERE id = ?';
    const [rows] = await this.pool.execute(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }

    return new Article(rows[0]);
  }

  async update(id, data) {
    const fields = Object.keys(data);
    const params = Object.values(data);
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE articles SET ${setClause}, updated_at = NOW() WHERE id = ?`;
    params.push(id);

    await this.pool.execute(query, params);
    return this.findById(id);
  }

  async delete(id) {
    const query = 'DELETE FROM articles WHERE id = ?';
    const [result] = await this.pool.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = ArticleRepositoryMySQL;
