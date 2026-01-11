import api from './api';

const reviewService = {
  // Create review for a project
  createReview: (projectId, data) => {
    return api.post(`/projects/${projectId}/reviews`, data);
  },

  // Get review for a project
  getProjectReview: (projectId) => {
    return api.get(`/projects/${projectId}/review`);
  },

  // Check if can review a project
  canReview: (projectId) => {
    return api.get(`/projects/${projectId}/can-review`);
  },

  // Get reviews for a freelancer
  getFreelancerReviews: (freelancerId, page = 1) => {
    return api.get(`/freelancers/${freelancerId}/reviews`, {
      params: { page }
    });
  },

  // Update review
  updateReview: (reviewId, data) => {
    return api.put(`/reviews/${reviewId}`, data);
  },

  // Delete review
  deleteReview: (reviewId) => {
    return api.delete(`/reviews/${reviewId}`);
  },
};

export default reviewService;

