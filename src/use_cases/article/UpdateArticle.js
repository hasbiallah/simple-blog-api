class UpdateArticle {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(id, { user_id, user_role, title, content, status }) {
    const article = await this.articleRepository.findById(id);

    if (!article) {
      const error = new Error('Article not found');
      error.status = 404;
      throw error;
    }

    // Authorization: Author of the article or Admin
    if (article.user_id !== user_id && user_role !== 'admin') {
      const error = new Error('Forbidden: You can only update your own articles');
      error.status = 403;
      throw error;
    }

    const dataToUpdate = {};
    if (title) dataToUpdate.title = title;
    if (content) dataToUpdate.content = content;
    if (status) dataToUpdate.status = status;

    return this.articleRepository.update(id, dataToUpdate);
  }
}

module.exports = UpdateArticle;
