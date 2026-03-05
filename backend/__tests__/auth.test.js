jest.mock('../src/repositories/userRepository');
jest.mock('../src/config/database', () => jest.fn().mockResolvedValue());
jest.mock('../src/config/redis', () => ({ connectRedis: jest.fn(), getRedisClient: jest.fn(() => null) }));

process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const userRepository = require('../src/repositories/userRepository');
const jwt = require('jsonwebtoken');

const userId = '64a0000000000000000000001';
const mockUser = {
  _id: userId,
  id: userId,
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  comparePassword: jest.fn(),
};

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser);

      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.token).toBeDefined();
    });

    it('should not register duplicate email', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      mockUser.comparePassword.mockResolvedValue(true);
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      mockUser.comparePassword.mockResolvedValue(false);
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });

    it('should reject unknown email', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const res = await request(app).post('/api/auth/login').send({
        email: 'unknown@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return profile for authenticated user', async () => {
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
      userRepository.findById.mockResolvedValue(mockUser);

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.status).toBe(401);
    });
  });
});
