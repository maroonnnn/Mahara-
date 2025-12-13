import api from './api';

const reviewService = {
  // Create review
  createReview: (data) => {
    return api.post('/reviews', data);
  },

  // Get reviews for a user
  getUserReviews: (userId) => {
    return api.get(`/users/${userId}/reviews`);
  },

  // Get review for a project
  getProjectReview: (projectId) => {
    return api.get(`/projects/${projectId}/review`);
  },

  // Update review
  updateReview: (id, data) => {
    return api.put(`/reviews/${id}`, data);
  },

  // Delete review
  deleteReview: (id) => {
    return api.delete(`/reviews/${id}`);
  },
};

export default reviewService;

