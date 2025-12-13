import api from './api';

const categoryService = {
  // Get all categories
  getCategories: () => {
    return api.get('/categories');
  },

  // Get single category
  getCategory: (id) => {
    return api.get(`/categories/${id}`);
  },

  // Create category (admin only)
  createCategory: (data) => {
    return api.post('/categories', data);
  },

  // Update category (admin only)
  updateCategory: (id, data) => {
    return api.put(`/categories/${id}`, data);
  },

  // Delete category (admin only)
  deleteCategory: (id) => {
    return api.delete(`/categories/${id}`);
  },
};

export default categoryService;

