const User = require('../../core/entities/User');

class RegisterUser {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ name, email, password }) {
    // 1. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email already registered');
      error.status = 409;
      throw error;
    }

    // 2. Hash password
    const hashedPassword = await this.passwordHasher.hash(password);

    // 3. Create User Entity
    const user = User.create({
      name,
      email,
      password: hashedPassword,
      role: 'reader' // Default role
    });

    // 4. Save User
    return this.userRepository.save(user);
  }
}

module.exports = RegisterUser;
