class AuthController {
  constructor(registerUserUseCase, loginUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const user = await this.registerUserUseCase.execute({ name, email, password });
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(error.status || 400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.loginUserUseCase.execute({ email, password });
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      res.status(error.status || 400).json({
        success: false,
        message: error.message
      });
    }
  }

  async logout(req, res) {
    // Statless JWT logout
    res.status(200).json({
      success: true,
      message: 'Logout successful',
      data: null
    });
  }
}

module.exports = AuthController;
