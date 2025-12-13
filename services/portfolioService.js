import api from './api';

export const portfolioService = {
  // Get portfolio items for a seller
  getPortfolio: async (sellerId) => {
    try {
      const response = await api.get(`/portfolio/seller/${sellerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
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
      const response = await api.post('/portfolio', data);
      return response.data;
    } catch (error) {
      console.error('Error creating portfolio item:', error);
      throw error;
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

  // Get my portfolio (for authenticated seller)
  getMyPortfolio: async () => {
    try {
      const response = await api.get('/portfolio/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching my portfolio:', error);
      throw error;
    }
  },
};

