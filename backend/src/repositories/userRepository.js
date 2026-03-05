const User = require('../models/User');

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findByEmail(email) {
    return User.findOne({ email }).select('+password');
  }

  async findById(id) {
    return User.findById(id);
  }

  async findAll() {
    return User.find();
  }
}

module.exports = new UserRepository();
