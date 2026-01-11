import api from './api';

export const portfolioService = {
  // Get portfolio items for a seller/freelancer
  getPortfolio: async (sellerId) => {
    try {
      const response = await api.get(`/freelancer/${sellerId}/portfolio`);
      return response.data;
    } catch (error) {
      // Try alternative endpoint
      try {
        const response = await api.get(`/portfolio/seller/${sellerId}`);
        return response.data;
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        throw err;
      }
    }
  },

  // Get single portfolio item
  getPortfolioItem: async (itemId) => {
    try {
      const response = await api.get(`/portfolio/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
      throw error;
    }
  },

  // Create new portfolio item
  createPortfolioItem: async (data) => {
    try {
      // Try freelancer endpoint first
      const response = await api.post('/freelancer/portfolio', data);
      return response.data;
    } catch (error) {
      // Try alternative endpoint
      try {
        const response = await api.post('/portfolio', data);
        return response.data;
      } catch (err) {
        console.error('Error creating portfolio item:', err);
        throw err;
      }
    }
  },

  // Update portfolio item
  updatePortfolioItem: async (itemId, data) => {
    try {
      const response = await api.put(`/portfolio/${itemId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      throw error;
    }
  },

  // Delete portfolio item
  deletePortfolioItem: async (itemId) => {
    try {
      const response = await api.delete(`/portfolio/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      throw error;
    }
  },

  // Get my portfolio (for authenticated freelancer)
  getMyPortfolio: async () => {
    try {
      const response = await api.get('/freelancer/portfolio');
      return response.data;
    } catch (error) {
      // Try alternative endpoint
      try {
        const response = await api.get('/portfolio/me');
        return response.data;
      } catch (err) {
        console.error('Error fetching my portfolio:', err);
        throw err;
      }
    }
  },
};

