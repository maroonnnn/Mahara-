import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  FaSearch,
  FaClock, 
  FaDollarSign, 
  FaEye,
  FaFileAlt,
  FaFilter,
  FaUsers
} from 'react-icons/fa';

export default function FreelancerProjectsPage() {
  const { user, isClient, isFreelancer, isAuthenticated, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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

    if (isClient) {
      alert('❌ هذه الصفحة للمستقلين (البائعين) فقط.\n\nكعميل، يمكنك إنشاء مشروع جديد من لوحة التحكم.');
      router.push('/client/projects');
      return;
    }

    if (!isFreelancer) {
      alert('❌ فقط المستقلين يمكنهم الوصول لهذه الصفحة.');
      router.push('/');
      return;
    }

    loadProjects();
  }, [authLoading, isAuthenticated, isClient, isFreelancer]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectService = (await import('../../../services/projectService')).default;
      const response = await projectService.getOpenProjects();
      console.log('Projects API Response:', response);
      
      // Laravel pagination returns: { data: [...], current_page: 1, ... }
      // Axios wraps it: { data: { data: [...], current_page: 1, ... } }
      let projectsList = [];
      
      // Handle Axios response structure
      const responseData = response.data || response;
      
      // Check if it's paginated response (Laravel pagination)
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        projectsList = responseData.data;
      } else if (Array.isArray(responseData)) {
        projectsList = responseData;
      } else if (responseData && Array.isArray(responseData)) {
        projectsList = responseData;
      }
      
      console.log('Projects List:', projectsList);
      console.log('Projects Count:', projectsList.length);
      
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
        status: p.status || 'open',
        proposals: p.offers_count || 0,
        views: p.views || 0,
        createdAt: p.created_at || p.createdAt,
        client: p.client || {
          name: 'عميل',
          rating: 5.0
        }
      }));
      
      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Removed mock data - using API only
  /*
  const mockProjects = [
    {
      id: 1,
      title: 'تصميم شعار احترافي لشركتي',
      category: 'Graphics & Design',
      subcategory: 'Logo Design',
      budget: 500,
      budgetType: 'fixed',
      deliveryTime: '7 days',
      status: 'open',
      proposals: 12,
      views: 45,
      createdAt: '2024-01-20',
      description: 'أحتاج إلى تصميم شعار احترافي يعكس هوية شركتي في مجال التكنولوجيا. يجب أن يكون عصري وبسيط ويمكن استخدامه في مختلف الوسائط.',
      client: {
        name: 'Abdalrhmn bobes',
        rating: 4.8
      }
    },
    {
      id: 2,
      title: 'تطوير موقع إلكتروني للتجارة الإلكترونية',
      category: 'Programming & Tech',
      subcategory: 'Website Development',
      budget: 75,
      budgetType: 'hourly',
      deliveryTime: '1 month',
      status: 'open',
      proposals: 8,
      views: 32,
      createdAt: '2024-01-19',
      description: 'بحاجة لتطوير متجر إلكتروني متكامل باستخدام React وNode.js مع دعم الدفع الإلكتروني وإدارة المخزون.',
      client: {
        name: 'Tech Company',
        rating: 5.0
      }
    },
    {
      id: 3,
      title: 'تصميم بنر إعلاني للسوشيال ميديا',
      category: 'Graphics & Design',
      subcategory: 'Social Media Design',
      budget: 150,
      budgetType: 'fixed',
      deliveryTime: '3 days',
      status: 'open',
      proposals: 20,
      views: 89,
      createdAt: '2024-01-18',
      description: 'أحتاج إلى تصميم 10 بنرات إعلانية لحملة تسويقية على فيسبوك وإنستغرام بتصاميم جذابة واحترافية.',
      client: {
        name: 'Digital Marketing Pro',
        rating: 4.9
      }
    },
    {
      id: 4,
      title: 'كتابة محتوى تسويقي لموقع الشركة',
      category: 'Writing & Translation',
      subcategory: 'Content Writing',
      budget: 300,
      budgetType: 'fixed',
      deliveryTime: '5 days',
      status: 'open',
      proposals: 15,
      views: 67,
      createdAt: '2024-01-17',
      description: 'أبحث عن كاتب محتوى محترف لكتابة محتوى تسويقي جذاب لصفحات الموقع الرئيسية.',
      client: {
        name: 'Marketing Agency',
        rating: 4.9
      }
    },
    {
      id: 5,
      title: 'تطوير تطبيق جوال iOS و Android',
      category: 'Programming & Tech',
      subcategory: 'Mobile Apps',
      budget: 3500,
      budgetType: 'fixed',
      deliveryTime: '2 months',
      status: 'open',
      proposals: 5,
      views: 120,
      createdAt: '2024-01-16',
      description: 'مطلوب تطوير تطبيق جوال لحجز المواعيد الطبية باستخدام React Native مع نظام إشعارات وإدارة المواعيد.',
      client: {
        name: 'HealthCare Solutions',
        rating: 4.6
      }
    },
    {
      id: 6,
      title: 'تحرير فيديو ترويجي للمنتج',
      category: 'Video & Animation',
      subcategory: 'Video Editing',
      budget: 400,
      budgetType: 'fixed',
      deliveryTime: '10 days',
      status: 'open',
      proposals: 6,
      views: 28,
      createdAt: '2024-01-15',
      description: 'أحتاج إلى محرر فيديو محترف لإنشاء فيديو ترويجي مدته دقيقتين مع موسيقى ومؤثرات احترافية.',
      client: {
        name: 'Media Company',
        rating: 4.7
      }
    },
    {
      id: 7,
      title: 'ترجمة محتوى من الإنجليزية للعربية',
      category: 'Writing & Translation',
      subcategory: 'Translation',
      budget: 200,
      budgetType: 'fixed',
      deliveryTime: '7 days',
      status: 'open',
      proposals: 18,
      views: 56,
      createdAt: '2024-01-14',
      description: 'مطلوب ترجمة احترافية لمحتوى موقع تقني من الإنجليزية للعربية بحوالي 5000 كلمة.',
      client: {
        name: 'Global Content',
        rating: 4.8
      }
    },
    {
      id: 8,
      title: 'تصميم واجهة مستخدم UI/UX لتطبيق',
      category: 'Graphics & Design',
      subcategory: 'UI/UX Design',
      budget: 800,
      budgetType: 'fixed',
      deliveryTime: '2 weeks',
      status: 'open',
      proposals: 10,
      views: 95,
      createdAt: '2024-01-13',
      description: 'بحاجة لتصميم واجهة مستخدم عصرية وجذابة لتطبيق توصيل طعام مع تجربة مستخدم سلسة.',
      client: {
        name: 'Food Delivery Inc',
        rating: 5.0
      }
    },
    {
      id: 9,
      title: 'إنشاء حملة إعلانية على جوجل',
      category: 'Digital Marketing',
      subcategory: 'Google Ads',
      budget: 600,
      budgetType: 'fixed',
      deliveryTime: '1 week',
      status: 'open',
      proposals: 7,
      views: 44,
      createdAt: '2024-01-12',
      description: 'أحتاج لمتخصص Google Ads لإنشاء وإدارة حملة إعلانية لمتجر إلكتروني.',
      client: {
        name: 'E-commerce Store',
        rating: 4.5
      }
    },
    {
      id: 10,
      title: 'كتابة وتحسين SEO لموقع',
      category: 'Digital Marketing',
      subcategory: 'SEO',
      budget: 450,
      budgetType: 'fixed',
      deliveryTime: '10 days',
      status: 'open',
      proposals: 14,
      views: 78,
      createdAt: '2024-01-11',
      description: 'مطلوب خبير SEO لتحسين محركات البحث وكتابة محتوى متوافق مع السيو لـ 20 صفحة.',
      client: {
        name: 'Online Business',
        rating: 4.7
      }
    },
    {
      id: 11,
      title: 'تطوير نظام إدارة محتوى CMS',
      category: 'Programming & Tech',
      subcategory: 'WordPress',
      budget: 1200,
      budgetType: 'fixed',
      deliveryTime: '3 weeks',
      status: 'open',
      proposals: 9,
      views: 65,
      createdAt: '2024-01-10',
      description: 'بحاجة لتطوير نظام إدارة محتوى مخصص باستخدام WordPress مع إضافات خاصة.',
      client: {
        name: 'News Portal',
        rating: 4.6
      }
    },
    {
      id: 12,
      title: 'تصميم إنفوجرافيك احترافي',
      category: 'Graphics & Design',
      subcategory: 'Infographic Design',
      budget: 180,
      budgetType: 'fixed',
      deliveryTime: '5 days',
      status: 'open',
      proposals: 22,
      views: 102,
      createdAt: '2024-01-09',
      description: 'أحتاج إلى تصميم 5 إنفوجرافيك احترافي لعرض إحصائيات ومعلومات بشكل جذاب.',
      client: {
        name: 'Research Institute',
        rating: 4.9
      }
    },
  ];
  */

  const categories = [
    'all', 'Graphics & Design', 'Programming & Tech', 
    'Writing & Translation', 'Digital Marketing', 'Video & Animation'
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory && project.status === 'open';
  });

  return (
    <DashboardLayout>
      <Head>
        <title>المشاريع المتاحة | Mahara</title>
        <meta name="description" content="تصفح المشاريع المفتوحة وقدم عروضك للعملاء" />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">المشاريع المتاحة</h1>
          <p className="text-gray-600">تصفح المشاريع المفتوحة وقدم عروضك</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في المشاريع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FaFilter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'جميع الفئات' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مشاريع</h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'جرب البحث بكلمات مختلفة أو اختر فئة أخرى'
                  : 'لا توجد مشاريع مفتوحة حالياً'}
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link href={`/freelancer/projects/${project.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors cursor-pointer">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
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

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-green-600" />
                      <span className="font-semibold">
                        ${project.budget} {project.budgetType === 'hourly' ? '/ساعة' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-600" />
                      <span>{project.deliveryTime?.replace('days', 'أيام')?.replace('day', 'يوم')?.replace('weeks', 'أسابيع')?.replace('week', 'أسبوع')?.replace('months', 'أشهر')?.replace('month', 'شهر') || project.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-purple-600" />
                      <span>{project.proposals || 0} عروض</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEye className="text-gray-400" />
                      <span>{project.views || 0} مشاهدة</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{project.client?.name || 'عميل'}</p>
                      <p className="text-xs text-gray-500">⭐ {project.client?.rating || '5.0'}</p>
                    </div>
                    <Link
                      href={`/freelancer/projects/${project.id}`}
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

