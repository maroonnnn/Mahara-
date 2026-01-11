import api from './api';

const messageService = {
  // Get all conversations for the current user
  getConversations: () => {
    return api.get('/messages/conversations');
  },

  // Get single conversation by ID
  getConversation: (id) => {
    return api.get(`/messages/conversations/${id}`);
  },

  // Get messages for a project/conversation
  getProjectMessages: (projectId) => {
    return api.get(`/projects/${projectId}/messages`);
  },

  // Get messages for a conversation (by conversation ID)
  getConversationMessages: (conversationId) => {
    return api.get(`/messages/conversations/${conversationId}`);
  },

  // Send message (for a project)
  sendMessage: (projectId, data) => {
    return api.post(`/projects/${projectId}/messages`, data);
  },

  // Alternative: Send message with project_id in body
  sendMessageWithBody: (data) => {
    return api.post('/messages', data);
  },

  // Mark message as read
  markAsRead: (id) => {
    return api.put(`/messages/${id}/read`);
  },

  // Mark all messages as read for a project
  markAllAsRead: (projectId) => {
    return api.put(`/projects/${projectId}/messages/read-all`);
  },

  // Mark all messages as read for a conversation
  markConversationAsRead: (conversationId) => {
    return api.put(`/messages/conversations/${conversationId}/read-all`);
  },

  // Get unread messages count
  getUnreadCount: () => {
    return api.get('/messages/unread-count');
  },

  // Start a new conversation
  startConversation: (data) => {
    return api.post('/messages/conversations', data);
  },
};

export default messageService;

