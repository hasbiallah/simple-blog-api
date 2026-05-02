class CommentController {
  constructor(createCommentUseCase, deleteCommentUseCase) {
    this.createCommentUseCase = createCommentUseCase;
    this.deleteCommentUseCase = deleteCommentUseCase;
  }

  async create(req, res) {
    try {
      const { id: article_id } = req.params;
      const { content } = req.body;
      const { id: user_id } = req.user;

      const comment = await this.createCommentUseCase.execute({
        article_id,
        user_id,
        content
      });

      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: comment
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

      await this.deleteCommentUseCase.execute(id, { user_id, user_role });

      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
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

module.exports = CommentController;
