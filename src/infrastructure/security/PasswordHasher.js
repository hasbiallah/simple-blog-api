const bcrypt = require('bcrypt');

class PasswordHasher {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(password) {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password, hashed) {
    return bcrypt.compare(password, hashed);
  }
}

module.exports = PasswordHasher;
