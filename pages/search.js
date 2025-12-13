import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaSearch,
  FaClock,
  FaDollarSign,
  FaEye,
  FaFileAlt,
  FaFilter,
  FaSort,
  FaMapMarkerAlt
} from 'react-icons/fa';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query; // Get search query from URL
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, projects, freelancers
  const [sortBy, setSortBy] = useState('relevant'); // relevant, newest, budget-high, budget-low

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      performSearch(q);
    }
  }, [q]);

  const performSearch = (query) => {
    setLoading(true);

    // Get all projects from localStorage
    const allProjects = JSON.parse(localStorage.getItem('myProjects') || '[]');
    
    // Search logic
    const searchTerm = query.toLowerCase();
    const filteredProjects = allProjects.filter(project => {
      return (
        project.title?.toLowerCase().includes(searchTerm) ||
        project.description?.toLowerCase().includes(searchTerm) ||
        project.category?.toLowerCase().includes(searchTerm) ||
        project.skills?.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    });

    // Sort results
    let sortedProjects = [...filteredProjects];
    switch (sortBy) {
      case 'newest':
        sortedProjects.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'budget-high':
        sortedProjects.sort((a, b) => (b.budget || 0) - (a.budget || 0));
        break;
      case 'budget-low':
        sortedProjects.sort((a, b) => (a.budget || 0) - (b.budget || 0));
        break;
      default: // relevant
        // Already filtered by relevance
        break;
    }

    setResults(sortedProjects);
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: { text: 'مفتوح', color: 'bg-green-100 text-green-700' },
      in_progress: { text: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-700' },
      completed: { text: 'مكتمل', color: 'bg-gray-100 text-gray-700' },
      cancelled: { text: 'ملغي', color: 'bg-red-100 text-red-700' }
    };
    return badges[status] || badges.open;
  };

  return (
    <>
      <Head>
        <title>Search: {q || ''} | Fiverr Clone</title>
      </Head>

      <DashboardLayout allowUnauthenticated={true}>
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مشاريع، خدمات، مستقلين..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center gap-2"
              >
                <FaSearch />
                بحث
              </button>
            </form>
          </div>

          {/* Search Info & Filters */}
          <div className="flex items-center justify-between mb-6">
            <div>
              {q && (
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  نتائج البحث عن: "{q}"
                </h1>
              )}
              <p className="text-gray-600">
                {loading ? (
                  'جاري البحث...'
                ) : (
                  <>
                    <span className="font-semibold text-gray-900">{results.length}</span> نتيجة
                  </>
                )}
              </p>
            </div>

            {/* Sort & Filter */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <label className="block text-sm text-gray-600 mb-1">ترتيب حسب</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    if (q) performSearch(q);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="relevant">الأكثر صلة</option>
                  <option value="newest">الأحدث</option>
                  <option value="budget-high">الميزانية (الأعلى)</option>
                  <option value="budget-low">الميزانية (الأقل)</option>
                </select>
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <label className="block text-sm text-gray-600 mb-1">تصفية</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="all">الكل</option>
                  <option value="projects">المشاريع فقط</option>
                  <option value="freelancers">المستقلين فقط</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
                <p className="text-gray-600">جاري البحث...</p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-600 mb-6">
                {q ? `لم نجد أي نتائج لـ "${q}"` : 'جرب البحث عن شيء آخر'}
              </p>
              <div className="flex flex-col items-center gap-3 text-sm text-gray-600">
                <p className="font-semibold">نصائح للبحث:</p>
                <ul className="text-right space-y-1">
                  <li>• تحقق من الإملاء</li>
                  <li>• جرب كلمات مفتاحية مختلفة</li>
                  <li>• استخدم كلمات أكثر عمومية</li>
                  <li>• جرب مصطلحات ذات صلة</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((project) => {
                const badge = getStatusBadge(project.status);
                const isFreelancer = user?.role === 'freelancer';
                const projectUrl = isFreelancer 
                  ? `/freelancer/projects/${project.id}`
                  : `/client/projects/${project.id}`;

                return (
                  <div
                    key={project.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-6">
                      {/* Project Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FaFileAlt className="text-primary-600 text-xl" />
                          </div>
                          <div className="flex-1">
                            <Link href={projectUrl}>
                              <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                                {project.title}
                              </h3>
                            </Link>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                        </div>

                        {/* Tags & Details */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {project.category}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                            {badge.text}
                          </span>
                          {project.skills?.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {project.skills?.length > 3 && (
                            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">
                              +{project.skills.length - 3} المزيد
                            </span>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {project.client?.name && (
                            <div className="flex items-center gap-1">
                              <FaMapMarkerAlt className="w-3 h-3" />
                              <span>العميل: {project.client.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            <span>{project.deliveryTime || 'غير محدد'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaEye className="w-3 h-3" />
                            <span>{project.views || 0} مشاهدة</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="text-right">
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">الميزانية</p>
                          <p className="text-3xl font-bold text-gray-900">${project.budget}</p>
                        </div>
                        <Link
                          href={projectUrl}
                          className="block w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-center"
                        >
                          {isFreelancer ? 'تقديم عرض' : 'عرض التفاصيل'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Suggestions */}
          {!loading && q && results.length === 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">قد يعجبك أيضاً</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['تصميم جرافيك', 'تطوير ويب', 'كتابة محتوى'].map((suggestion, index) => (
                  <Link
                    key={index}
                    href={`/search?q=${encodeURIComponent(suggestion)}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
                  >
                    <p className="text-gray-700 font-medium">{suggestion}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}

