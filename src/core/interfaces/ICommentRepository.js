/**
 * ICommentRepository interface
 * @interface
 */
class ICommentRepository {
  /**
   * @param {string|number} id
   * @returns {Promise<import('../entities/Comment')|null>}
   */
  async findById(id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {import('../entities/Comment')} comment
   * @returns {Promise<import('../entities/Comment')>}
   */
  async save(comment) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string|number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string|number} articleId
   * @returns {Promise<import('../entities/Comment')[]>}
   */
  async findByArticleId(articleId) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ICommentRepository;
