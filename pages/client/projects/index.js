import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  FaPlus, 
  FaClock, 
  FaDollarSign, 
  FaEye,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';

export default function ClientProjectsPage() {
  const { user, isClient, isFreelancer, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) {
      return;
    }

    // Role-based access control
    if (!isAuthenticated) {
      alert('يجب تسجيل الدخول أولاً');
      router.push('/login');
      return;
    }

    if (isFreelancer) {
      alert('❌ هذه الصفحة للعملاء فقط.\n\nكمستقل، يمكنك تصفح المشاريع المتاحة وتقديم عروض.');
      router.push('/freelancer/projects');
      return;
    }

    if (!isClient) {
      alert('❌ فقط العملاء يمكنهم الوصول لهذه الصفحة.');
      router.push('/');
      return;
    }

    loadProjects();
  }, [authLoading, isAuthenticated, isClient, isFreelancer]);

  const loadProjects = () => {
    // Try to load from localStorage first (for development)
    const savedProjects = JSON.parse(localStorage.getItem('myProjects') || '[]');
    
    if (savedProjects.length > 0) {
      // Map localStorage projects to expected format
      const mappedProjects = savedProjects.map(p => ({
        ...p,
        status: p.status || 'active',
        proposals: p.proposals || 0,
        views: p.views || 0,
        createdAt: p.createdAt || new Date().toISOString()
      }));
      setProjects([...mappedProjects, ...mockProjects]);
    } else {
      setProjects(mockProjects);
    }
  };

  // Mock data - Fallback examples
  const mockProjects = [
    {
      id: 1,
      title: 'تصميم شعار احترافي لشركتي',
      category: 'Graphics & Design',
      subcategory: 'Logo Design',
      budget: 500,
      budgetType: 'fixed',
      deliveryTime: '7 days',
      status: 'active',
      proposals: 12,
      views: 45,
      createdAt: '2024-01-15',
      description: 'أحتاج إلى تصميم شعار احترافي يعكس هوية شركتي في مجال التكنولوجيا...'
    },
    {
      id: 2,
      title: 'تطوير موقع إلكتروني للتجارة الإلكترونية',
      category: 'Programming & Tech',
      subcategory: 'Website Development',
      budget: 75,
      budgetType: 'hourly',
      deliveryTime: '1 month',
      status: 'in_progress',
      proposals: 8,
      views: 32,
      createdAt: '2024-01-10',
      selectedFreelancer: 'Ahmed Mohamed',
      description: 'بحاجة لتطوير متجر إلكتروني متكامل باستخدام React وNode.js...'
    },
    {
      id: 3,
      title: 'كتابة محتوى تسويقي لموقع الشركة',
      category: 'Writing & Translation',
      subcategory: 'Content Writing',
      budget: 300,
      budgetType: 'fixed',
      deliveryTime: '5 days',
      status: 'completed',
      proposals: 15,
      views: 67,
      createdAt: '2023-12-20',
      completedAt: '2023-12-28',
      description: 'أبحث عن كاتب محتوى محترف لكتابة محتوى تسويقي جذاب...'
    },
    {
      id: 4,
      title: 'تحرير فيديو ترويجي للمنتج',
      category: 'Video & Animation',
      subcategory: 'Video Editing',
      budget: 400,
      budgetType: 'fixed',
      deliveryTime: '10 days',
      status: 'cancelled',
      proposals: 6,
      views: 28,
      createdAt: '2023-12-15',
      description: 'أحتاج إلى محرر فيديو محترف لإنشاء فيديو ترويجي مدته دقيقتين...'
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'نشط', color: 'bg-green-100 text-green-700', icon: <FaCheckCircle /> },
      in_progress: { text: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-700', icon: <FaSpinner /> },
      completed: { text: 'مكتمل', color: 'bg-gray-100 text-gray-700', icon: <FaCheckCircle /> },
      cancelled: { text: 'ملغي', color: 'bg-red-100 text-red-700', icon: <FaTimesCircle /> },
    };
    const badge = badges[status] || badges.active;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${badge.color}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return project.status === 'active';
    if (activeTab === 'in_progress') return project.status === 'in_progress';
    if (activeTab === 'completed') return project.status === 'completed';
    return true;
  });

  const stats = {
    all: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    in_progress: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  return (
    <DashboardLayout>
      <Head>
        <title>مشاريعي | Fiverr Clone</title>
        <meta name="description" content="My Projects" />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">مشاريعي</h1>
            <p className="text-gray-600">إدارة جميع مشاريعك في مكان واحد</p>
          </div>
          <Link
            href="/client/projects/new"
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center gap-2"
          >
            <FaPlus />
            مشروع جديد
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">جميع المشاريع</p>
                <p className="text-3xl font-bold text-gray-900">{stats.all}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">المشاريع النشطة</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">قيد التنفيذ</p>
                <p className="text-3xl font-bold text-blue-600">{stats.in_progress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaSpinner className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">المكتملة</p>
                <p className="text-3xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-gray-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 border-b-0">
          <div className="flex gap-1 p-2">
            {[
              { id: 'all', label: 'الكل', count: stats.all },
              { id: 'active', label: 'نشط', count: stats.active },
              { id: 'in_progress', label: 'قيد التنفيذ', count: stats.in_progress },
              { id: 'completed', label: 'مكتمل', count: stats.completed },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-b-xl shadow-sm border border-gray-200">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مشاريع</h3>
              <p className="text-gray-600 mb-6">ابدأ بإنشاء مشروعك الأول</p>
              <Link
                href="/client/projects/new"
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
              >
                <FaPlus />
                إنشاء مشروع جديد
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 cursor-pointer">
                          {project.title}
                        </h3>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {project.category}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {project.subcategory}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-green-600" />
                        <span className="font-semibold">
                          ${project.budget} {project.budgetType === 'hourly' ? '/hr' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-blue-600" />
                        <span>{project.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-purple-600" />
                        <span>{project.proposals} عروض</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEye className="text-gray-400" />
                        <span>{project.views} مشاهدة</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/client/projects/${project.id}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
                      >
                        عرض التفاصيل
                      </Link>
                      {project.status === 'active' && (
                        <Link
                          href={`/client/projects/${project.id}/proposals`}
                          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm"
                        >
                          العروض ({project.proposals})
                        </Link>
                      )}
                    </div>
                  </div>

                  {project.selectedFreelancer && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        المستقل المختار: <span className="font-semibold text-gray-900">{project.selectedFreelancer}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

