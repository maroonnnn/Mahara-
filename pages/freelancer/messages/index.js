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
        router.push(`/freelancer/messages/${existingConv.id}`);
      } else {
        // Create new conversation
        // In real app: await messageService.startConversation({ projectId, otherUserId: clientId })
        // For now, show message and reload
        alert('سيتم إنشاء محادثة جديدة. يرجى الانتظار...');
        await loadConversations();
      }
    } catch (error) {
      console.error('Error handling project conversation:', error);
    }
  };

  const loadConversations = async () => {
    try {
      // Mock data - Replace with actual API call
      const mockConversations = [
        {
          id: 1,
          projectId: 1,
          projectTitle: 'تصميم شعار احترافي لشركتي',
          otherUser: {
            id: 1,
            name: 'Abdalrhmn bobes',
            avatar: null,
            isOnline: true
          },
          lastMessage: {
            text: 'شكراً لك! التصميم رائع',
            timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
            senderId: 1,
            isRead: false
          },
          unreadCount: 1,
          updatedAt: new Date(Date.now() - 10 * 60000)
        },
        {
          id: 2,
          projectId: 2,
          projectTitle: 'تطوير موقع إلكتروني للتجارة الإلكترونية',
          otherUser: {
            id: 1,
            name: 'Abdalrhmn bobes',
            avatar: null,
            isOnline: false
          },
          lastMessage: {
            text: 'متى يمكنك البدء في المشروع؟',
            timestamp: new Date(Date.now() - 3 * 60 * 60000), // 3 hours ago
            senderId: 1,
            isRead: true
          },
          unreadCount: 0,
          updatedAt: new Date(Date.now() - 3 * 60 * 60000)
        },
      ];

      setConversations(mockConversations);
      setLoading(false);
    } catch (error) {
      console.error('Error loading conversations:', error);
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
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return date.toLocaleDateString('ar-SA');
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
        <title>الرسائل | Mahara</title>
        <meta name="description" content="Messages and conversations" />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaEnvelope className="text-primary-500" />
              الرسائل
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
          <p className="text-gray-600">تواصل مع العملاء حول المشاريع</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث في الرسائل..."
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
              <p className="text-gray-600">جاري تحميل الرسائل...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-12 text-center">
              <FaEnvelope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'لا توجد نتائج' : 'لا توجد رسائل'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'جرب البحث بكلمات مختلفة' 
                  : 'ستظهر الرسائل هنا عند بدء العملاء التواصل معك'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/freelancer/messages/${conversation.id}`}
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

