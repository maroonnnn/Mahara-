import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaPlus,
  FaProjectDiagram,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaEnvelope,
  FaUsers,
  FaChartLine
} from 'react-icons/fa';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    // Load from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('myProjects') || '[]');
    setProjects(savedProjects.slice(0, 3)); // Show only 3 recent
  };

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'open').length,
    completedProjects: 0,
    totalSpent: 0
  };

  return (
    <DashboardLayout>
      <Head>
        <title>لوحة التحكم | Fiverr Clone</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً، {user?.name || 'عميل'}
          </h1>
          <p className="text-gray-600">إدارة مشاريعك وتتبع التقدم</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">إجمالي المشاريع</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaProjectDiagram className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">المشاريع النشطة</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeProjects}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">المكتملة</p>
                <p className="text-3xl font-bold text-blue-600">{stats.completedProjects}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">المصروفات</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalSpent}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaDollarSign className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">هل لديك مشروع جديد؟</h2>
              <p className="text-primary-100">أنشئ مشروعك الآن واحصل على عروض من أفضل المستقلين</p>
            </div>
            <Link
              href="/client/projects/new"
              className="px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2"
            >
              <FaPlus />
              مشروع جديد
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">مشاريعي الأخيرة</h2>
            <Link
              href="/client/projects"
              className="text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-2"
            >
              عرض الكل
              <FaChartLine />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FaProjectDiagram className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مشاريع بعد</h3>
              <p className="text-gray-600 mb-6">ابدأ بإنشاء مشروعك الأول واحصل على عروض من المستقلين</p>
              <Link
                href="/client/projects/new"
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
              >
                <FaPlus />
                إنشاء مشروع جديد
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/client/projects/${project.id}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                          {project.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {project.category}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {project.status || 'open'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-gray-900">${project.budget}</p>
                      <p className="text-sm text-gray-500">{project.deliveryTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/client/projects"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <FaProjectDiagram className="text-primary-600 text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900">مشاريعي</p>
                <p className="text-sm text-gray-500">إدارة جميع المشاريع</p>
              </div>
            </div>
          </Link>

          <Link
            href="/client/messages"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900">الرسائل</p>
                <p className="text-sm text-gray-500">التواصل مع المستقلين</p>
              </div>
            </div>
          </Link>

          <Link
            href="/client/wallet"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <FaDollarSign className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900">المحفظة</p>
                <p className="text-sm text-gray-500">إدارة الرصيد</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
