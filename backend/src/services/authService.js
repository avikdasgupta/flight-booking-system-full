const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

class AuthService {
  async register({ name, email, password, role }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('Email already registered', 400);
    }
    const user = await userRepository.create({ name, email, password, role });
    const token = generateToken(user._id);
    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }
    const token = generateToken(user._id);
    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }
}

module.exports = new AuthService();
