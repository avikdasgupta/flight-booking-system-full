const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    const { name, email, password, role } = req.body;
    const result = await authService.register({ name, email, password, role });
    res.status(201).json({ status: 'success', data: result });
  }

  async login(req, res) {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json({ status: 'success', data: result });
  }

  async getProfile(req, res) {
    const user = await authService.getProfile(req.user.id);
    res.status(200).json({ status: 'success', data: { user } });
  }
}

module.exports = new AuthController();
