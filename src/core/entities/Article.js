class Article {
  constructor({ id, user_id, title, content, status, created_at, updated_at }) {
    this.id = id;
    this.user_id = user_id;
    this.title = title;
    this.content = content;
    this.status = status || 'draft';
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static create({ id, user_id, title, content, status, created_at, updated_at }) {
    if (!user_id) {
      throw new Error('User ID is required');
    }
    if (!title || title.trim() === '') {
      throw new Error('Title is required');
    }
    
    return new Article({
      id,
      user_id,
      title,
      content: content || '',
      status: status || 'draft',
      created_at: created_at || new Date(),
      updated_at: updated_at || new Date()
    });
  }
}

module.exports = Article;
