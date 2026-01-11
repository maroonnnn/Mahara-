import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaSearch,
  FaDollarSign,
  FaClock,
  FaFileAlt,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaEye,
  FaPaperPlane
} from 'react-icons/fa';

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalProjects: 0,
    myOffers: 0,
    activeProjects: 0,
    earnings: 0
  });
  const [availableProjects, setAvailableProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const projectService = (await import('../../services/projectService')).default;
      const offerService = (await import('../../services/offerService')).default;
      const walletService = (await import('../../services/walletService')).default;

      // Load available projects
      try {
        const projectsResponse = await projectService.getOpenProjects();
        console.log('Projects API Response:', projectsResponse);
        console.log('Projects API Response Data:', projectsResponse.data);
        
        // Laravel pagination returns: { data: [...], current_page: 1, ... }
        // Axios wraps it: { data: { data: [...], current_page: 1, ... } }
        let projectsList = [];
        
        // Handle Axios response structure
        const responseData = projectsResponse.data || projectsResponse;
        
        // Check if it's paginated response (Laravel pagination)
        if (responseData && responseData.data && Array.isArray(responseData.data)) {
          // Laravel paginated response: { data: [...], current_page: 1, ... }
          projectsList = responseData.data;
        } else if (Array.isArray(responseData)) {
          // Direct array response
          projectsList = responseData;
        } else if (responseData && typeof responseData === 'object') {
          // Try to find array in response
          if (responseData.projects && Array.isArray(responseData.projects)) {
            projectsList = responseData.projects;
          } else if (responseData.items && Array.isArray(responseData.items)) {
            projectsList = responseData.items;
          } else {
            console.warn('Unexpected response format:', responseData);
            projectsList = [];
          }
        } else {
          console.warn('Unexpected response format:', responseData);
          projectsList = [];
        }
        
        console.log('Projects List:', projectsList);
        console.log('Projects Count:', projectsList.length);
        
        if (projectsList.length === 0) {
          console.warn('No projects found. Response structure:', {
            responseData,
            hasData: !!responseData?.data,
            isArray: Array.isArray(responseData),
            keys: responseData ? Object.keys(responseData) : []
          });
        }
        
        // Map projects to frontend format
        const mappedProjects = projectsList.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          category: p.category?.name || p.category_name || 'غير محدد',
          subcategory: p.subcategory || '',
          budget: parseFloat(p.budget || 0),
          budgetType: p.budget_type || 'fixed',
          deliveryTime: p.duration_days 
            ? `${p.duration_days} ${p.duration_days === 1 ? 'يوم' : 'أيام'}` 
            : (p.delivery_time || 'غير محدد'),
          proposals: p.offers_count || 0,
          views: p.views || 0,
          createdAt: p.created_at || p.createdAt,
          client: p.client || {
            name: 'عميل',
            rating: 5.0
          }
        }));
        
        setAvailableProjects(mappedProjects);
        
        // Load my offers
        let myOffersCount = 0;
        try {
          const offersResponse = await offerService.getMyOffers();
          const offersData = offersResponse.data?.data || offersResponse.data || [];
          const offersList = Array.isArray(offersData) ? offersData : (offersData.data || []);
          myOffersCount = offersList.length;
        } catch (error) {
          console.error('Error loading offers:', error);
          myOffersCount = 0;
        }

        // Load active projects
        let activeProjectsCount = 0;
        try {
          const activeResponse = await projectService.getActiveProjects();
          const activeData = activeResponse.data?.data || activeResponse.data || [];
          const activeList = Array.isArray(activeData) ? activeData : (activeData.data || []);
          activeProjectsCount = activeList.length;
        } catch (error) {
          console.error('Error loading active projects:', error);
          activeProjectsCount = 0;
        }

        // Load earnings
        let earnings = 0;
        try {
          const walletResponse = await walletService.getWallet();
          const walletData = walletResponse.data?.data || walletResponse.data || {};
          earnings = parseFloat(walletData.balance || walletData.available || 0);
        } catch (error) {
          console.error('Error loading wallet:', error);
          earnings = 0;
        }

        // Update stats (use the loaded projects count)
        setStats({
          totalProjects: mappedProjects.length,
          myOffers: myOffersCount,
          activeProjects: activeProjectsCount,
          earnings: earnings
        });
      } catch (error) {
        console.error('Error loading projects:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config
        });
        setAvailableProjects([]);
        
        // Still try to load other stats even if projects fail
        let myOffersCount = 0;
        let activeProjectsCount = 0;
        let earnings = 0;
        
        try {
          const offersResponse = await offerService.getMyOffers();
          const offersData = offersResponse.data?.data || offersResponse.data || [];
          const offersList = Array.isArray(offersData) ? offersData : (offersData.data || []);
          myOffersCount = offersList.length;
        } catch (e) {
          console.error('Error loading offers:', e);
        }
        
        try {
          const activeResponse = await projectService.getActiveProjects();
          const activeData = activeResponse.data?.data || activeResponse.data || [];
          const activeList = Array.isArray(activeData) ? activeData : (activeData.data || []);
          activeProjectsCount = activeList.length;
        } catch (e) {
          console.error('Error loading active projects:', e);
        }
        
        try {
          const walletResponse = await walletService.getWallet();
          const walletData = walletResponse.data?.data || walletResponse.data || {};
          earnings = parseFloat(walletData.balance || walletData.available || 0);
        } catch (e) {
          console.error('Error loading wallet:', e);
        }
        
        setStats({
          totalProjects: 0,
          myOffers: myOffersCount,
          activeProjects: activeProjectsCount,
          earnings: earnings
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort and filter projects
  const sortedProjects = [...availableProjects].sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const filteredProjects = sortedProjects.filter(project => {
    const searchLower = searchQuery.toLowerCase();
    return (
      project.title?.toLowerCase().includes(searchLower) ||
      project.description?.toLowerCase().includes(searchLower) ||
      project.category?.toLowerCase().includes(searchLower)
    );
  });

  // Show only the 2 newest projects on dashboard
  const newestProjects = filteredProjects.slice(0, 2);
  const hasMoreProjects = filteredProjects.length > 2;

  return (
    <DashboardLayout>
      <Head>
        <title>لوحة التحكم | Mahara</title>
        <meta name="description" content="لوحة تحكم المستقل - تصفح المشاريع المتاحة وقدم عروضك" />
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً، {user?.name || 'مستقل'}
          </h1>
          <p className="text-gray-600">تصفح المشاريع المتاحة وقدم عروضك</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">المشاريع المتاحة</p>
                {loading ? (
                  <div className="h-10 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaFileAlt className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">عروضي</p>
                {loading ? (
                  <div className="h-10 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-primary-600">{stats.myOffers}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FaPaperPlane className="text-primary-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">المشاريع النشطة</p>
                {loading ? (
                  <div className="h-10 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-green-600">{stats.activeProjects}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">الأرباح</p>
                {loading ? (
                  <div className="h-10 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">${stats.earnings.toLocaleString()}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaDollarSign className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">ابدأ العمل الآن</h2>
              <p className="text-primary-100">تصفح المشاريع المتاحة وقدم عروضك للعملاء</p>
            </div>
            <Link
              href="/freelancer/projects"
              className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2"
            >
              تصفح المشاريع
              <FaArrowRight />
            </Link>
          </div>
        </div>

        {/* Available Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">أحدث المشاريع</h2>
              <p className="text-sm text-gray-500 mt-1">المشاريع الأحدث المتاحة للتقديم</p>
            </div>
            <Link
              href="/freelancer/projects"
              className="text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-2"
            >
              عرض جميع المشاريع
              <FaArrowRight />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في المشاريع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Projects Grid */}
          {newestProjects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مشاريع</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'جرب البحث بكلمات مختلفة' 
                  : 'لا توجد مشاريع مفتوحة حالياً'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newestProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link href={`/freelancer/projects/${project.id}`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors cursor-pointer line-clamp-2">
                          {project.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {project.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {project.subcategory}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaDollarSign className="text-green-600" />
                        <span className="font-semibold">
                          ${project.budget} {project.budgetType === 'hourly' ? '/ساعة' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-blue-600" />
                        <span>{project.deliveryTime?.replace('days', 'أيام')?.replace('day', 'يوم')?.replace('weeks', 'أسابيع')?.replace('week', 'أسبوع')?.replace('months', 'أشهر')?.replace('month', 'شهر') || project.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-purple-600" />
                        <span>{project.proposals}</span>
                      </div>
                    </div>

                    <Link
                      href={`/freelancer/projects/${project.id}`}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-sm"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                        {project.client.name.charAt(0)}
                      </div>
                      <span>{project.client.name}</span>
                      <span>⭐ {project.client.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {hasMoreProjects && (
              <div className="mt-6 text-center">
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6">
                  <p className="text-gray-600 mb-4">
                    يوجد <span className="font-bold text-primary-600">{filteredProjects.length - 2}</span> مشروع إضافي متاح
                  </p>
                  <Link
                    href="/freelancer/projects"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                  >
                    عرض جميع المشاريع ({filteredProjects.length})
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            )}
          </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

