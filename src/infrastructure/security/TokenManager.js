const jwt = require('jsonwebtoken');

class TokenManager {
  constructor(secretKey = process.env.JWT_SECRET || 'secret_key', expiresIn = '24h') {
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;
  }

  generate(payload) {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }

  verify(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error('INVALID_TOKEN');
    }
  }
}

module.exports = TokenManager;
