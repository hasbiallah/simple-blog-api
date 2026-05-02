const Article = require('../../core/entities/Article');

class CreateArticle {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute({ user_id, user_role, title, content, status }) {
    // 1. Check Authorization (Author or Admin)
    if (user_role !== 'author' && user_role !== 'admin') {
      const error = new Error('Forbidden: Only authors and admins can create articles');
      error.status = 403;
      throw error;
    }

    // 2. Create Article Entity
    const article = Article.create({
      user_id,
      title,
      content,
      status: status || 'draft'
    });

    // 3. Save Article
    return this.articleRepository.save(article);
  }
}

module.exports = CreateArticle;
