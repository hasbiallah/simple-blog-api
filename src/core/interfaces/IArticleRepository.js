/**
 * IArticleRepository interface
 * @interface
 */
class IArticleRepository {
  /**
   * @param {import('../entities/Article')} article
   * @returns {Promise<import('../entities/Article')>}
   */
  async save(article) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @returns {Promise<import('../entities/Article')[]>}
   */
  async findAll() {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string|number} id
   * @returns {Promise<import('../entities/Article')|null>}
   */
  async findById(id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string|number} id
   * @param {object} data
   * @returns {Promise<import('../entities/Article')>}
   */
  async update(id, data) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string|number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = IArticleRepository;
