import Head from 'next/head';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
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
  const { language } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 1245,
    totalProjects: 589,
    totalRevenue: 125890,
    activeProjects: 156,
    newUsersThisMonth: 89,
    completedProjects: 433,
    pendingTransactions: 23,
    totalCategories: 12
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'user', message: 'New user registered: John Doe', time: '5 minutes ago' },
    { id: 2, type: 'project', message: 'New project posted: Website Development', time: '12 minutes ago' },
    { id: 3, type: 'transaction', message: 'Payment completed: $500', time: '25 minutes ago' },
    { id: 4, type: 'user', message: 'User verified: Sarah Smith', time: '1 hour ago' },
    { id: 5, type: 'project', message: 'Project completed: Logo Design', time: '2 hours ago' },
  ]);

  const statsCards = [
    {
      title: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users',
      value: stats.totalUsers,
      change: '+12%',
      isIncrease: true,
      icon: <FaUsers className="w-8 h-8" />,
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    {
      title: language === 'ar' ? 'إجمالي المشاريع' : 'Total Projects',
      value: stats.totalProjects,
      change: '+8%',
      isIncrease: true,
      icon: <FaProjectDiagram className="w-8 h-8" />,
      color: 'bg-green-500',
      link: '/admin/projects'
    },
    {
      title: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+15%',
      isIncrease: true,
      icon: <FaDollarSign className="w-8 h-8" />,
      color: 'bg-purple-500',
      link: '/admin/transactions'
    },
    {
      title: language === 'ar' ? 'المشاريع النشطة' : 'Active Projects',
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
        <title>{language === 'ar' ? 'لوحة تحكم المدير - Mahara' : 'Admin Dashboard - Mahara'}</title>
      </Head>

      <DashboardLayout requiredRole="admin">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'لوحة تحكم المدير' : 'Admin Dashboard'}
            </h1>
            <p className="text-gray-600">
              {language === 'ar' ? 'مرحباً بك، ' : 'Welcome back, '}{user?.name || 'Admin'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
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
            ))}
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'إحصائيات سريعة' : 'Quick Stats'}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'مستخدمون جدد هذا الشهر' : 'New Users This Month'}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">{stats.newUsersThisMonth}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'المشاريع المكتملة' : 'Completed Projects'}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">{stats.completedProjects}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'المعاملات المعلقة' : 'Pending Transactions'}
                  </span>
                  <span className="text-lg font-semibold text-orange-500">{stats.pendingTransactions}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'إجمالي الفئات' : 'Total Categories'}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">{stats.totalCategories}</span>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'الأنشطة الأخيرة' : 'Recent Activities'}
                </h2>
                <Link href="/admin/activities" className="text-primary-500 hover:text-primary-600 text-sm font-semibold">
                  {language === 'ar' ? 'عرض الكل' : 'View All'}
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/users" className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaUsers className="w-8 h-8 text-primary-500 mb-2" />
                <span className="text-sm font-semibold text-gray-700">
                  {language === 'ar' ? 'إدارة المستخدمين' : 'Manage Users'}
                </span>
              </Link>
              <Link href="/admin/projects" className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaProjectDiagram className="w-8 h-8 text-primary-500 mb-2" />
                <span className="text-sm font-semibold text-gray-700">
                  {language === 'ar' ? 'إدارة المشاريع' : 'Manage Projects'}
                </span>
              </Link>
              <Link href="/admin/transactions" className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaDollarSign className="w-8 h-8 text-primary-500 mb-2" />
                <span className="text-sm font-semibold text-gray-700">
                  {language === 'ar' ? 'المعاملات المالية' : 'Transactions'}
                </span>
              </Link>
              <Link href="/admin/reports" className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaChartLine className="w-8 h-8 text-primary-500 mb-2" />
                <span className="text-sm font-semibold text-gray-700">
                  {language === 'ar' ? 'التقارير' : 'Reports'}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

