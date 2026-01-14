import api from './api';

const notificationService = {
  // Get all notifications
  getNotifications: (params) => {
    return api.get('/notifications', { params });
  },

  // Get unread notifications count
  getUnreadCount: () => {
    return api.get('/notifications/unread-count');
  },

  // Mark notification as read
  markAsRead: (id) => {
    return api.put(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    return api.put('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: (id) => {
    return api.delete(`/notifications/${id}`);
  },
};

export default notificationService;
