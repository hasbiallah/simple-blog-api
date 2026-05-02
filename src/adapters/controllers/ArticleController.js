class ArticleController {
  constructor(useCases) {
    this.createArticleUseCase = useCases.createArticle;
    this.getArticlesUseCase = useCases.getArticles;
    this.getArticleDetailUseCase = useCases.getArticleDetail;
    this.updateArticleUseCase = useCases.updateArticle;
    this.deleteArticleUseCase = useCases.deleteArticle;
  }

  async create(req, res) {
    try {
      const { title, content, status } = req.body;
      const { id: user_id, role: user_role } = req.user;

      const article = await this.createArticleUseCase.execute({
        user_id,
        user_role,
        title,
        content,
        status
      });

      res.status(201).json({
        success: true,
        message: 'Article created successfully',
        data: article
      });
    } catch (error) {
      res.status(error.status || 400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAll(req, res) {
    try {
      const { page, limit, status } = req.query;
      const result = await this.getArticlesUseCase.execute({ page, limit, status });

      res.status(200).json({
        success: true,
        message: 'Articles retrieved successfully',
        data: result.articles,
        meta: result.meta
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getDetail(req, res) {
    try {
      const { id } = req.params;
      const article = await this.getArticleDetailUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: 'Article detail retrieved successfully',
        data: article
      });
    } catch (error) {
      res.status(error.status || 404).json({
        success: false,
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, content, status } = req.body;
      const { id: user_id, role: user_role } = req.user;

      const article = await this.updateArticleUseCase.execute(id, {
        user_id,
        user_role,
        title,
        content,
        status
      });

      res.status(200).json({
        success: true,
        message: 'Article updated successfully',
        data: article
      });
    } catch (error) {
      res.status(error.status || 400).json({
        success: false,
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { id: user_id, role: user_role } = req.user;

      await this.deleteArticleUseCase.execute(id, { user_id, user_role });

      res.status(200).json({
        success: true,
        message: 'Article deleted successfully',
        data: null
      });
    } catch (error) {
      res.status(error.status || 400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ArticleController;
