import api from './api';

const messageService = {
  // Get all conversations for the current user
  getConversations: () => {
    return api.get('/messages/conversations');
  },

  // Get messages for a project/conversation
  getProjectMessages: (projectId) => {
    return api.get(`/projects/${projectId}/messages`);
  },

  // Get messages for a conversation (by conversation ID)
  getConversationMessages: (conversationId) => {
    return api.get(`/messages/conversations/${conversationId}`);
  },

  // Send message
  sendMessage: (data) => {
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

