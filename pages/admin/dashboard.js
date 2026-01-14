import Head from 'next/head';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaDollarSign, 
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaEye
} from 'react-icons/fa';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalRevenue: 0,
    activeProjects: 0,
    newUsersThisMonth: 0,
    completedProjects: 0,
    pendingTransactions: 0,
    totalCategories: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      console.log('Dashboard API response:', response);
      
      const data = response.data?.stats || response.data || {};
      const recentUsersData = response.data?.recentUsers || [];
      const recentProjectsData = response.data?.recentProjects || [];
      
      setStats({
        totalUsers: data.totalUsers || 0,
        totalProjects: data.totalProjects || 0,
        totalRevenue: parseFloat(data.totalRevenue || 0),
        activeProjects: data.activeProjects || 0,
        newUsersThisMonth: data.newUsersThisMonth || 0,
        completedProjects: data.completedProjects || 0,
        pendingTransactions: data.pendingTransactions || 0,
        totalCategories: data.totalCategories || 0
      });

      // Format recent activities from users and projects
      const activities = [];
      
      // Add recent users
      recentUsersData.slice(0, 3).forEach(user => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user',
          message: `انضم مستخدم جديد: ${user.name}`,
          time: new Date(user.created_at).toLocaleDateString('ar-SA')
        });
      });

      // Add recent projects
      recentProjectsData.slice(0, 2).forEach(project => {
        activities.push({
          id: `project-${project.id}`,
          type: 'project',
          message: `مشروع جديد: ${project.title}`,
          time: new Date(project.created_at).toLocaleDateString('ar-SA')
        });
      });

      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats.totalUsers,
      change: '+12%',
      isIncrease: true,
      icon: <FaUsers className="w-8 h-8" />,
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    {
      title: 'إجمالي المشاريع',
      value: stats.totalProjects,
      change: '+8%',
      isIncrease: true,
      icon: <FaProjectDiagram className="w-8 h-8" />,
      color: 'bg-green-500',
      link: '/admin/projects'
    },
    {
      title: 'إجمالي الإيرادات',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+15%',
      isIncrease: true,
      icon: <FaDollarSign className="w-8 h-8" />,
      color: 'bg-purple-500',
      link: '/admin/transactions'
    },
    {
      title: 'المشاريع النشطة',
      value: stats.activeProjects,
      change: '-3%',
      isIncrease: false,
      icon: <FaChartLine className="w-8 h-8" />,
      color: 'bg-orange-500',
      link: '/admin/projects'
    },
  ];

  return (
    <>
      <Head>
        <title>لوحة تحكم المدير - Mahara</title>
      </Head>

      <DashboardLayout requiredRole="admin">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              لوحة تحكم المدير
            </h1>
            <p className="text-gray-600">
              مرحباً بك، {user?.name || 'المدير'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              statsCards.map((stat, index) => (
                <Link href={stat.link} key={index}>
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} text-white p-3 rounded-lg`}>
                        {stat.icon}
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-semibold ${
                        stat.isIncrease ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.isIncrease ? <FaArrowUp /> : <FaArrowDown />}
                        {stat.change}
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                إحصائيات سريعة
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">
                    مستخدمون جدد هذا الشهر
                  </span>
                  <span className="text-lg font-semibold text-gray-900">{stats.newUsersThisMonth}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">
                    المشاريع المكتملة
                  </span>
                  <span className="text-lg font-semibold text-gray-900">{stats.completedProjects}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">
                    المعاملات المعلقة
                  </span>
                  <span className="text-lg font-semibold text-orange-500">{stats.pendingTransactions}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">
                    إجمالي الفئات
                  </span>
                  <span className="text-lg font-semibold text-gray-900">{stats.totalCategories}</span>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  الأنشطة الأخيرة
                </h2>
                <Link href="/admin/activities" className="text-primary-500 hover:text-primary-600 text-sm font-semibold">
                  عرض الكل
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    لا توجد أنشطة حديثة
                  </p>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'project' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'user' && <FaUsers className="w-4 h-4" />}
                        {activity.type === 'project' && <FaProjectDiagram className="w-4 h-4" />}
                        {activity.type === 'transaction' && <FaDollarSign className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              إجراءات سريعة
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/users" className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaUsers className="w-8 h-8 text-primary-500 mb-2" />
                <span className="text-sm font-semibold text-gray-700">
                  إدارة المستخدمين
                </span>
              </Link>
              <Link href="/admin/projects" className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaProjectDiagram className="w-8 h-8 text-primary-500 mb-2" />
                <span className="text-sm font-semibold text-gray-700">
                  إدارة المشاريع
                </span>
              </Link>
              <Link href="/admin/transactions" className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaDollarSign className="w-8 h-8 text-primary-500 mb-2" />
                <span className="text-sm font-semibold text-gray-700">
                  المعاملات المالية
                </span>
              </Link>
              <Link href="/admin/reports" className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaChartLine className="w-8 h-8 text-primary-500 mb-2" />
                <span className="text-sm font-semibold text-gray-700">
                  التقارير
                </span>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

