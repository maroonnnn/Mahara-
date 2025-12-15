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

  // Mock data - Replace with actual API calls
  const availableProjects = [
    {
      id: 1,
      title: 'تصميم شعار احترافي لشركتي',
      category: 'Graphics & Design',
      subcategory: 'Logo Design',
      budget: 500,
      budgetType: 'fixed',
      deliveryTime: '7 days',
      proposals: 12,
      views: 45,
      createdAt: '2024-01-20',
      description: 'أحتاج إلى تصميم شعار احترافي يعكس هوية شركتي في مجال التكنولوجيا...',
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
      proposals: 8,
      views: 32,
      createdAt: '2024-01-19',
      description: 'بحاجة لتطوير متجر إلكتروني متكامل باستخدام React وNode.js...',
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
      proposals: 20,
      views: 89,
      createdAt: '2024-01-18',
      description: 'أحتاج إلى تصميم 10 بنرات إعلانية لحملة تسويقية على فيسبوك وإنستغرام...',
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
      proposals: 15,
      views: 67,
      createdAt: '2024-01-17',
      description: 'أبحث عن كاتب محتوى محترف لكتابة محتوى تسويقي جذاب...',
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
      proposals: 5,
      views: 120,
      createdAt: '2024-01-16',
      description: 'مطلوب تطوير تطبيق جوال لحجز المواعيد الطبية باستخدام React Native...',
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
      proposals: 6,
      views: 28,
      createdAt: '2024-01-15',
      description: 'أحتاج إلى محرر فيديو محترف لإنشاء فيديو ترويجي مدته دقيقتين...',
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
      proposals: 18,
      views: 56,
      createdAt: '2024-01-14',
      description: 'مطلوب ترجمة احترافية لمحتوى موقع تقني من الإنجليزية للعربية (5000 كلمة)...',
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
      proposals: 10,
      views: 95,
      createdAt: '2024-01-13',
      description: 'بحاجة لتصميم واجهة مستخدم عصرية وجذابة لتطبيق توصيل طعام...',
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
      proposals: 7,
      views: 44,
      createdAt: '2024-01-12',
      description: 'أحتاج لمتخصص Google Ads لإنشاء وإدارة حملة إعلانية...',
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
      proposals: 14,
      views: 78,
      createdAt: '2024-01-11',
      description: 'مطلوب خبير SEO لتحسين محركات البحث وكتابة محتوى متوافق مع السيو...',
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
      proposals: 9,
      views: 65,
      createdAt: '2024-01-10',
      description: 'بحاجة لتطوير نظام إدارة محتوى مخصص باستخدام WordPress مع إضافات خاصة...',
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
      proposals: 22,
      views: 102,
      createdAt: '2024-01-09',
      description: 'أحتاج إلى تصميم 5 إنفوجرافيك احترافي لعرض إحصائيات ومعلومات...',
      client: {
        name: 'Research Institute',
        rating: 4.9
      }
    },
  ];

  const stats = {
    totalProjects: availableProjects.length,
    myOffers: 8,
    activeProjects: 3,
    earnings: 2850
  };

  // Sort projects by date (newest first)
  const sortedProjects = [...availableProjects].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const filteredProjects = sortedProjects.filter(project => {
    const searchLower = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.category.toLowerCase().includes(searchLower)
    );
  });

  // Show only the 2 newest projects on dashboard
  const newestProjects = filteredProjects.slice(0, 2);
  const hasMoreProjects = filteredProjects.length > 2;

  return (
    <DashboardLayout>
      <Head>
        <title>لوحة التحكم | Mahara</title>
        <meta name="description" content="Freelancer Dashboard" />
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
                <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
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
                <p className="text-3xl font-bold text-primary-600">{stats.myOffers}</p>
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
                <p className="text-3xl font-bold text-green-600">{stats.activeProjects}</p>
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
                <p className="text-3xl font-bold text-gray-900">${stats.earnings}</p>
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
                          ${project.budget} {project.budgetType === 'hourly' ? '/hr' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-blue-600" />
                        <span>{project.deliveryTime}</span>
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

