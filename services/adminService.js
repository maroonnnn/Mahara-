import api from './api';

const adminService = {
  // Users Management
  getUsers: (params) => {
    return api.get('/admin/users', { params });
  },

  getUser: (id) => {
    return api.get(`/admin/users/${id}`);
  },

  updateUser: (id, data) => {
    return api.put(`/admin/users/${id}`, data);
  },

  deleteUser: (id) => {
    return api.delete(`/admin/users/${id}`);
  },

  // Projects Management
  getProjects: (params) => {
    return api.get('/admin/projects', { params });
  },

  getProject: (id) => {
    return api.get(`/admin/projects/${id}`);
  },

  deleteProject: (id) => {
    return api.delete(`/admin/projects/${id}`);
  },

  // Categories Management
  getCategories: () => {
    return api.get('/admin/categories');
  },

  createCategory: (data) => {
    return api.post('/admin/categories', data);
  },

  updateCategory: (id, data) => {
    return api.put(`/admin/categories/${id}`, data);
  },

  deleteCategory: (id) => {
    return api.delete(`/admin/categories/${id}`);
  },

  // Transactions Management
  getTransactions: (params) => {
    return api.get('/admin/transactions', { params });
  },

  getTransaction: (id) => {
    return api.get(`/admin/transactions/${id}`);
  },

  exportTransactions: (format = 'csv') => {
    return api.get(`/admin/transactions/export`, { 
      params: { format },
      responseType: 'blob' 
    });
  },

  // Reports
  getReports: (period = 'month') => {
    return api.get('/admin/reports', { params: { period } });
  },

  exportReport: (type, format = 'csv', period = 'month') => {
    return api.get(`/admin/reports/${type}/export`, { 
      params: { format, period },
      responseType: 'blob' 
    });
  },

  // Revenue & Statistics
  getRevenue: (params) => {
    return api.get('/admin/revenue', { params });
  },

  getStatistics: () => {
    return api.get('/admin/statistics');
  },

  // Dashboard Data
  getDashboardData: () => {
    return api.get('/admin/dashboard');
  },

  // Dashboard Statistics
  getDashboardStats: () => {
    return api.get('/admin/dashboard-stats');
  },

  // Update user status
  updateUserStatus: (userId, status) => {
    return api.put(`/admin/users/${userId}/status`, { status });
  },
};

export default adminService;

