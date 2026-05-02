class GetArticles {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute({ page = 1, limit = 10, status = 'published' }) {
    const offset = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      this.articleRepository.findAll({ limit: parseInt(limit), offset: parseInt(offset), status }),
      this.articleRepository.countAll({ status })
    ]);

    return {
      articles,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = GetArticles;
