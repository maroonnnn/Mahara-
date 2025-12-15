import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ChatWindow from '../../../components/messages/ChatWindow';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  FaArrowRight, 
  FaUser,
  FaClock,
  FaDollarSign,
  FaFileAlt
} from 'react-icons/fa';

export default function FreelancerChatPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadConversation();
    }
  }, [id]);

  const loadConversation = async () => {
    try {
      // Mock data - Replace with actual API call
      const mockConversation = {
        id: parseInt(id),
        projectId: 1,
        project: {
          id: 1,
          title: 'تصميم شعار احترافي لشركتي',
          budget: 500,
          budgetType: 'fixed',
          deliveryTime: '7 days',
          status: 'in_progress',
          category: 'Graphics & Design',
          subcategory: 'Logo Design'
        },
        otherUser: {
          id: 1,
          name: 'Abdalrhmn bobes',
          email: 'abdalrhmn@example.com',
          avatar: null,
          isOnline: true
        }
      };

      setConversation(mockConversation);
      setLoading(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setLoading(false);
    }
  };

  const handleMessageSent = (message) => {
    console.log('Message sent:', message);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Head>
          <title>الرسائل | Mahara</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!conversation) {
    return (
      <DashboardLayout>
        <Head>
          <title>الرسائل | Mahara</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">المحادثة غير موجودة</h2>
            <Link
              href="/freelancer/messages"
              className="text-primary-500 hover:text-primary-600 font-semibold"
            >
              العودة إلى الرسائل
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head>
        <title>المحادثة | Mahara</title>
        <meta name="description" content="Chat conversation" />
      </Head>

      <div className="max-w-7xl mx-auto" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col min-h-0">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/freelancer/messages"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaArrowRight className="text-gray-600" />
                </Link>
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold">
                    {conversation.otherUser.name.charAt(0)}
                  </div>
                  {conversation.otherUser.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {conversation.otherUser.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {conversation.otherUser.isOnline ? 'متصل الآن' : 'غير متصل'}
                  </p>
                </div>
              </div>

              <Link
                href={`/freelancer/projects/${conversation.projectId}`}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                عرض المشروع
              </Link>
            </div>
          </div>

          {/* Project Info Bar */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FaFileAlt className="text-gray-400" />
                <span className="text-gray-700 font-semibold">{conversation.project.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaDollarSign className="text-green-600" />
                <span className="text-gray-700">${conversation.project.budget}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-blue-600" />
                <span className="text-gray-700">{conversation.project.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  conversation.project.status === 'in_progress' 
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {conversation.project.status === 'in_progress' ? 'قيد التنفيذ' : 'نشط'}
                </span>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ChatWindow
              conversationId={conversation.id}
              projectId={conversation.projectId}
              otherUser={conversation.otherUser}
              currentUserId={user?.id}
              onMessageSent={handleMessageSent}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

