class DeleteArticle {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(id, { user_id, user_role }) {
    const article = await this.articleRepository.findById(id);

    if (!article) {
      const error = new Error('Article not found');
      error.status = 404;
      throw error;
    }

    // Authorization: Author of the article or Admin
    if (article.user_id !== user_id && user_role !== 'admin') {
      const error = new Error('Forbidden: You can only delete your own articles');
      error.status = 403;
      throw error;
    }

    return this.articleRepository.delete(id);
  }
}

module.exports = DeleteArticle;
