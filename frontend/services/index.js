import apiClient from './apiClient';

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
};

export const flightService = {
  getAll: (params) => apiClient.get('/flights', { params }),
  search: (params) => apiClient.get('/flights/search', { params }),
  getById: (id) => apiClient.get(`/flights/${id}`),
  create: (data) => apiClient.post('/flights', data),
};

export const bookingService = {
  create: (data) => apiClient.post('/bookings', data),
  lockSeat: (data) => apiClient.post('/bookings/lock-seat', data),
  getMyBookings: () => apiClient.get('/bookings/my'),
  getById: (id) => apiClient.get(`/bookings/${id}`),
  confirm: (id) => apiClient.patch(`/bookings/${id}/confirm`),
  cancel: (id) => apiClient.patch(`/bookings/${id}/cancel`),
  getAll: () => apiClient.get('/bookings/all'),
};
