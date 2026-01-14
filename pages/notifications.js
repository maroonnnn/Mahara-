import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notificationService';
import { toast } from 'react-toastify';
import { 
  FaBell, 
  FaCheck, 
  FaTrash,
  FaCircle,
  FaProjectDiagram,
  FaHandshake
} from 'react-icons/fa';

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadNotifications();
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      const data = response.data?.data || response.data || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('فشل تحميل الإشعارات');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('فشل تحديث الإشعار');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      toast.success('تم تحديد جميع الإشعارات كمقروءة');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('فشل تحديث الإشعارات');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success('تم حذف الإشعار');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('فشل حذف الإشعار');
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'offer_submitted':
        return <FaProjectDiagram className="w-5 h-5 text-blue-500" />;
      case 'offer_accepted':
        return <FaHandshake className="w-5 h-5 text-green-500" />;
      default:
        return <FaBell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.related_type === 'project' && notification.related_id) {
      if (user?.role === 'client') {
        router.push(`/client/projects/${notification.related_id}`);
      } else if (user?.role === 'freelancer') {
        router.push(`/projects/${notification.related_id}`);
      }
    } else if (notification.related_type === 'offer' && notification.related_id) {
      // For offer notifications, we need to get the project ID from the offer
      // For now, redirect to client projects page if client, or projects page if freelancer
      if (user?.role === 'client') {
        // Try to find the project that has this offer
        router.push('/client/projects');
      } else {
        router.push('/freelancer/projects');
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <DashboardLayout>
      <Head>
        <title>الإشعارات - Mahara</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الإشعارات</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : 'لا توجد إشعارات غير مقروءة'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-semibold flex items-center gap-2"
            >
              <FaCheck />
              تحديد الكل كمقروء
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500 mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد إشعارات</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all ${
                  !notification.is_read ? 'border-r-4 border-primary-500' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(notification.created_at).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.is_read && (
                          <FaCircle className="w-2 h-2 text-primary-500" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
