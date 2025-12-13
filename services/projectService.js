import api from './api';

const projectService = {
  // Get all projects (with filters)
  getProjects: (params) => {
    return api.get('/projects', { params });
  },

  // Get single project
  getProject: (id) => {
    return api.get(`/projects/${id}`);
  },

  // Create new project
  createProject: (data) => {
    return api.post('/projects', data);
  },

  // Update project
  updateProject: (id, data) => {
    return api.put(`/projects/${id}`, data);
  },

  // Delete project
  deleteProject: (id) => {
    return api.delete(`/projects/${id}`);
  },

  // Get client's projects
  getMyProjects: () => {
    return api.get('/my-projects');
  },

  // Complete project
  completeProject: (id) => {
    return api.put(`/projects/${id}/complete`);
  },

  // Cancel project
  cancelProject: (id) => {
    return api.put(`/projects/${id}/cancel`);
  },
};

export default projectService;

