const Comment = require('../../core/entities/Comment');

class CreateComment {
  constructor(commentRepository, articleRepository) {
    this.commentRepository = commentRepository;
    this.articleRepository = articleRepository;
  }

  async execute({ article_id, user_id, content }) {
    // 1. Check if article exists and is published
    const article = await this.articleRepository.findById(article_id);
    
    if (!article) {
      const error = new Error('Article not found');
      error.status = 404;
      throw error;
    }

    if (article.status !== 'published') {
      const error = new Error('Cannot comment on draft articles');
      error.status = 400;
      throw error;
    }

    // 2. Create Comment Entity
    const comment = Comment.create({
      article_id,
      user_id,
      content
    });

    // 3. Save Comment
    return this.commentRepository.save(comment);
  }
}

module.exports = CreateComment;
