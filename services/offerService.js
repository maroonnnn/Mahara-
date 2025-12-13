import api from './api';

const offerService = {
  // Get offers for a project
  getProjectOffers: (projectId) => {
    return api.get(`/projects/${projectId}/offers`);
  },

  // Submit new offer
  submitOffer: (data) => {
    return api.post('/offers', data);
  },

  // Get freelancer's offers
  getMyOffers: () => {
    return api.get('/my-offers');
  },

  // Accept offer
  acceptOffer: (id) => {
    return api.put(`/offers/${id}/accept`);
  },

  // Reject offer
  rejectOffer: (id) => {
    return api.put(`/offers/${id}/reject`);
  },

  // Update offer
  updateOffer: (id, data) => {
    return api.put(`/offers/${id}`, data);
  },

  // Delete offer
  deleteOffer: (id) => {
    return api.delete(`/offers/${id}`);
  },
};

export default offerService;

