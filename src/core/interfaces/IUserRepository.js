/**
 * IUserRepository interface
 * @interface
 */
class IUserRepository {
  /**
   * @param {import('../entities/User')} user
   * @returns {Promise<import('../entities/User')>}
   */
  async save(user) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} email
   * @returns {Promise<import('../entities/User')|null>}
   */
  async findByEmail(email) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string|number} id
   * @returns {Promise<import('../entities/User')|null>}
   */
  async findById(id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = IUserRepository;
