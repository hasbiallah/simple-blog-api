class LoginUser {
  constructor(userRepository, passwordHasher, tokenManager) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenManager = tokenManager;
  }

  async execute({ email, password }) {
    // 1. Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    // 2. Verify password
    const isPasswordValid = await this.passwordHasher.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    // 3. Generate Token
    const token = this.tokenManager.generate({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = LoginUser;
