import api from './api';

const projectService = {
  // Get all open projects (for freelancers to browse)
  getOpenProjects: (params) => {
    return api.get('/projects/open', { params });
  },

  // Get all projects (with filters) - for admin or authenticated users
  getProjects: (params) => {
    return api.get('/projects', { params });
  },

  // Get single project
  getProject: (id) => {
    return api.get(`/projects/${id}`);
  },

  // Create new project (client only)
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
  getMyProjects: (params) => {
    // Backend route is /client/projects (not /my-projects)
    return api.get('/client/projects', { params });
  },

  // Get freelancer's active projects
  getActiveProjects: () => {
    return api.get('/freelancer/active-projects');
  },

  // Get freelancer's completed projects (includes delivered and completed)
  getCompletedProjects: (params) => {
    return api.get('/freelancer/completed-projects', { params });
  },

  // Deliver project (freelancer)
  deliverProject: (id) => {
    return api.post(`/projects/${id}/deliver`);
  },

  // Complete project (client)
  completeProject: (id) => {
    return api.post(`/projects/${id}/complete`);
  },

  // Cancel project
  cancelProject: (id) => {
    return api.put(`/projects/${id}/cancel`);
  },
};

export default projectService;

