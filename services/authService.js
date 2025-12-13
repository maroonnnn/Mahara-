import api from './api';
import mockAuthService from './mockAuthService';

// Set to true to use mock authentication (no backend required)
// Set to false to use real API
const USE_MOCK_AUTH = true;

const authService = USE_MOCK_AUTH ? mockAuthService : {
  // Register new user
  register: (userData) => {
    return api.post('/register', userData);
  },

  // Login user
  login: (credentials) => {
    return api.post('/login', credentials);
  },

  // Logout user
  logout: () => {
    return api.post('/logout');
  },

  // Get current user
  getCurrentUser: () => {
    return api.get('/user');
  },

  // Update profile
  updateProfile: (userId, data) => {
    return api.put(`/users/${userId}`, data);
  },

  // Change password
  changePassword: (data) => {
    return api.post('/change-password', data);
  },
};

export default authService;

