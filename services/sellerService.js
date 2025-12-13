import api from './api';

export const sellerService = {
  // Complete seller onboarding
  completeOnboarding: (data) => {
    return api.post('/sellers/onboarding', data);
  },

  // Get seller profile
  getProfile: (username) => {
    return api.get(`/sellers/${username}/profile`);
  },

  // Update seller profile
  updateProfile: (data) => {
    return api.put('/sellers/profile', data);
  },

  // Get my seller profile
  getMyProfile: () => {
    return api.get('/sellers/me/profile');
  },
};

