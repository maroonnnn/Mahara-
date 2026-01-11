import api from './api';

export const sellerService = {
  // Complete seller/freelancer onboarding
  completeOnboarding: (data) => {
    return api.post('/freelancer/onboarding', data);
  },

  // Alternative endpoint
  completeOnboardingAlt: (data) => {
    return api.post('/sellers/onboarding', data);
  },

  // Get seller profile by username
  getProfile: (username) => {
    return api.get(`/sellers/${username}/profile`);
  },

  // Get freelancer profile by username
  getFreelancerProfile: (username) => {
    return api.get(`/freelancer/${username}/profile`);
  },

  // Get freelancer profile by ID (public view)
  getFreelancerProfileById: (id) => {
    return api.get(`/freelancers/${id}/profile`);
  },

  // Update seller/freelancer profile
  updateProfile: (data) => {
    return api.put('/freelancer/profile', data);
  },

  // Alternative endpoint
  updateProfileAlt: (data) => {
    return api.put('/sellers/profile', data);
  },

  // Get my seller/freelancer profile
  getMyProfile: () => {
    return api.get('/freelancer/profile');
  },

  // Alternative endpoint
  getMyProfileAlt: () => {
    return api.get('/sellers/me/profile');
  },
};

export default sellerService;

