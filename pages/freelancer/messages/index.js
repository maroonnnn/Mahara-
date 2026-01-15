import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import messageService from '../../../services/messageService';
import { 
  FaEnvelope, 
  FaSearch, 
  FaCircle,
  FaUser
} from 'react-icons/fa';

export default function FreelancerMessagesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadConversations();
    loadUnreadCount();
    
    // Check if coming from project page
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    if (projectId) {
      // Try to find existing conversation or create new one
      handleProjectConversation(projectId);
    }
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      loadConversations();
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleProjectConversation = async (projectId) => {
    try {
      // Wait for conversations to load first
      await loadConversations();
      
      // Check if conversation exists for this project
      const existingConv = conversations.find(c => c.projectId === parseInt(projectId));
      if (existingConv) {
        // Redirect to project-based messages page
        router.push(`/freelancer/messages/${existingConv.projectId}`);
      } else {
        // Project doesn't have an accepted offer yet, so messaging is not available
        alert('You can’t start messaging until an offer on this project is accepted.');
        router.push(`/freelancer/projects/${projectId}`);
      }
    } catch (error) {
      console.error('Error handling project conversation:', error);
      alert('Something went wrong while opening the conversation.');
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await messageService.getConversations();
      const conversationsData = response.data?.data || response.data || [];
      const conversationsList = Array.isArray(conversationsData) ? conversationsData : (conversationsData.data || []);
      
      // Map conversations to frontend format
      const mappedConversations = conversationsList.map(conv => ({
        id: conv.id,
        projectId: conv.project_id || conv.projectId,
        projectTitle: conv.project?.title || conv.project_title || 'Project',
        otherUser: {
          id: conv.other_user?.id || conv.other_user_id,
          name: conv.other_user?.name || conv.other_user_name || 'Client',
          avatar: conv.other_user?.avatar || null,
          isOnline: conv.other_user?.is_online || false
        },
        lastMessage: {
          text: conv.last_message?.text || conv.last_message_text || '',
          timestamp: conv.last_message?.timestamp 
            ? (conv.last_message.timestamp instanceof Date 
                ? conv.last_message.timestamp 
                : new Date(conv.last_message.timestamp))
            : (conv.last_message_timestamp 
                ? new Date(conv.last_message_timestamp)
                : new Date()),
          senderId: conv.last_message?.sender_id || conv.last_message_sender_id,
          isRead: conv.last_message?.is_read || conv.last_message_is_read || false
        },
        unreadCount: conv.unread_count || 0,
        updatedAt: conv.updated_at 
          ? (conv.updated_at instanceof Date ? conv.updated_at : new Date(conv.updated_at))
          : (conv.updatedAt 
              ? (conv.updatedAt instanceof Date ? conv.updatedAt : new Date(conv.updatedAt))
              : new Date())
      }));
      
      setConversations(mappedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const formatTime = (date) => {
    // Convert to Date object if it's a string
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diff = now - dateObj;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
    return dateObj.toLocaleDateString('en-US');
  };

  const filteredConversations = conversations.filter(conv => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.projectTitle.toLowerCase().includes(searchLower) ||
      conv.otherUser.name.toLowerCase().includes(searchLower) ||
      conv.lastMessage.text.toLowerCase().includes(searchLower)
    );
  });

  return (
    <DashboardLayout>
      <Head>
        <title>Messages | Mahara</title>
        <meta name="description" content="Messages and conversations with clients" />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaEnvelope className="text-primary-500" />
              Messages
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
          <p className="text-gray-600">Chat with clients about projects</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading messages...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-12 text-center">
              <FaEnvelope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No results' : 'No messages'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'Try different keywords.' 
                  : 'Messages will appear here when clients start a conversation.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/freelancer/messages/${conversation.projectId}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold">
                        {conversation.otherUser.name.charAt(0)}
                      </div>
                      {conversation.otherUser.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {conversation.otherUser.name}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.projectTitle}
                          </p>
                        </div>
                        <div className="text-left ml-4 flex-shrink-0">
                          <p className="text-xs text-gray-500 mb-1">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </p>
                          {!conversation.lastMessage.isRead && conversation.lastMessage.senderId !== user?.id && (
                            <FaCircle className="text-primary-500 text-xs mx-auto" />
                          )}
                        </div>
                      </div>

                      <p className={`text-sm truncate ${
                        !conversation.lastMessage.isRead && conversation.lastMessage.senderId !== user?.id
                          ? 'font-semibold text-gray-900'
                          : 'text-gray-600'
                      }`}>
                        {conversation.lastMessage.text}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

