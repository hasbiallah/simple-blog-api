class GetArticleDetail {
  constructor(articleRepository, commentRepository, userRepository) {
    this.articleRepository = articleRepository;
    this.commentRepository = commentRepository;
    this.userRepository = userRepository;
  }

  async execute(id) {
    const article = await this.articleRepository.findById(id);
    
    if (!article) {
      const error = new Error('Article not found');
      error.status = 404;
      throw error;
    }

    // Fetch author info
    const author = await this.userRepository.findById(article.user_id);
    article.author = { id: author.id, name: author.name };

    // Fetch comments
    const comments = await this.commentRepository.findByArticleId(id);
    article.comments = comments;

    return article;
  }
}

module.exports = GetArticleDetail;
