class Comment {
  constructor({ id, article_id, user_id, content, created_at }) {
    this.id = id;
    this.article_id = article_id;
    this.user_id = user_id;
    this.content = content;
    this.created_at = created_at;
  }

  static create({ id, article_id, user_id, content, created_at }) {
    if (!article_id) {
      throw new Error('Article ID is required');
    }
    if (!user_id) {
      throw new Error('User ID is required');
    }
    if (!content || content.trim() === '') {
      throw new Error('Content is required');
    }

    return new Comment({
      id,
      article_id,
      user_id,
      content,
      created_at: created_at || new Date()
    });
  }
}

module.exports = Comment;
