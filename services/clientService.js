import api from './api';

const clientService = {
  // Get client profile
  getProfile: () => {
    return api.get('/user/profile');
  },

  // Update client profile
  updateProfile: (data) => {
    return api.put('/user/profile', data);
  },
};

export default clientService;
