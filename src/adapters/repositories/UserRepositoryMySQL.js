const IUserRepository = require('../../core/interfaces/IUserRepository');
const User = require('../../core/entities/User');

class UserRepositoryMySQL extends IUserRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async save(user) {
    const { name, email, password, role } = user;
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    const [result] = await this.pool.execute(query, [name, email, password, role]);
    
    return new User({
      id: result.insertId,
      name,
      email,
      password,
      role
    });
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await this.pool.execute(query, [email]);
    
    if (rows.length === 0) {
      return null;
    }

    return new User(rows[0]);
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await this.pool.execute(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }

    return new User(rows[0]);
  }
}

module.exports = UserRepositoryMySQL;
