import api from './api';

const offerService = {
  // Get offers for a project
  getProjectOffers: (projectId) => {
    return api.get(`/projects/${projectId}/offers`);
  },

  // Submit new offer (for a project)
  submitOffer: (projectId, data) => {
    // Laravel might expect project_id in the route or body
    return api.post(`/projects/${projectId}/offers`, data);
  },

  // Alternative: Submit offer with project_id in body
  submitOfferWithBody: (data) => {
    return api.post('/offers', data);
  },

  // Get freelancer's offers
  getMyOffers: () => {
    return api.get('/freelancer/offers');
  },

  // Alternative endpoint name
  getMyOffersAlt: () => {
    return api.get('/my-offers');
  },

  // Accept offer (client only)
  // Backend expects: POST /projects/{project}/offers/{offer}/accept
  acceptOffer: (projectId, offerId) => {
    return api.post(`/projects/${projectId}/offers/${offerId}/accept`);
  },

  // Reject offer (client only)
  rejectOffer: (id) => {
    return api.put(`/offers/${id}/reject`);
  },

  // Update offer (freelancer only)
  updateOffer: (id, data) => {
    return api.put(`/offers/${id}`, data);
  },

  // Delete offer (freelancer only)
  deleteOffer: (id) => {
    return api.delete(`/offers/${id}`);
  },
};

export default offerService;

