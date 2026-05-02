class DeleteComment {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute(id, { user_id, user_role }) {
    // 1. Find comment
    const comment = await this.commentRepository.findById(id);
    
    if (!comment) {
      const error = new Error('Comment not found');
      error.status = 404;
      throw error;
    }

    // 2. Authorization (Owner or Admin)
    if (comment.user_id !== user_id && user_role !== 'admin') {
      const error = new Error('Forbidden: You can only delete your own comments');
      error.status = 403;
      throw error;
    }

    // 3. Delete
    return this.commentRepository.delete(id);
  }
}

module.exports = DeleteComment;
