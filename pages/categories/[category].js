import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import PublicLayout from '../../components/layout/PublicLayout';
import { categories, getCategoryBySlug, getSubcategoriesFromCategory } from '../../data/categories';
import projectService from '../../services/projectService';
import categoryService from '../../services/categoryService';
import { useAuth } from '../../contexts/AuthContext';
import { FaChevronRight, FaStar, FaClock, FaDollarSign, FaUsers, FaEye } from 'react-icons/fa';

export default function CategoryPage() {
  const router = useRouter();
  const { category: categorySlug } = router.query;
  const { user, isClient, isFreelancer, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState(null);
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'budget', 'offers'

  const [category, setCategory] = useState(null);

  const loadCategoryProjects = async () => {
    try {
      setLoading(true);
      
      // First, get category data from API using slug
      try {
        const categoriesResponse = await categoryService.getCategories();
        const categories = categoriesResponse.data?.data || categoriesResponse.data || [];
        
        // Find category by slug
        const foundCategory = categories.find(cat => 
          cat.slug === categorySlug
        );
        
        console.log('Looking for category slug:', categorySlug);
        console.log('Available categories:', categories.map(c => ({ id: c.id, slug: c.slug, name: c.name })));
        console.log('Found category:', foundCategory);
        
        if (foundCategory) {
          setCategory(foundCategory);
          setCategoryId(foundCategory.id);
          
          // Load projects for this category
          console.log('Loading projects for category ID:', foundCategory.id);
          
          // Build query params based on sort option
          const queryParams = { 
            category_id: foundCategory.id 
          };
          
          // Add sorting parameters
          if (sortBy === 'budget') {
            queryParams.sort_by = 'budget';
            queryParams.sort_order = 'desc';
          } else if (sortBy === 'offers') {
            queryParams.sort_by = 'offers';
            queryParams.sort_order = 'desc';
          } else {
            // latest is default
            queryParams.sort_by = 'created_at';
            queryParams.sort_order = 'desc';
          }
          
          const response = await projectService.getOpenProjects(queryParams);
          
          console.log('Projects API Response:', response);
          
          // Handle paginated response
          const responseData = response.data || response;
          let projectsList = [];
          
          if (responseData && responseData.data && Array.isArray(responseData.data)) {
            projectsList = responseData.data;
          } else if (Array.isArray(responseData)) {
            projectsList = responseData;
          }
          
          console.log('Category Projects List:', projectsList);
          console.log('Projects Count:', projectsList.length);
          
          // Map projects to display format
          const mappedProjects = projectsList.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            category: p.category?.name || p.category_name || foundCategory.name || 'غير محدد',
            budget: parseFloat(p.budget || 0),
            budgetType: p.budget_type || 'fixed',
            deliveryTime: p.duration_days 
              ? `${p.duration_days} ${p.duration_days === 1 ? 'يوم' : 'أيام'}` 
              : 'غير محدد',
            status: p.status || 'open',
            proposals: p.offers_count || p.proposals || 0,
            views: p.views || 0,
            createdAt: p.created_at || p.createdAt,
            client: p.client || {
              name: 'عميل'
            }
          }));
          
          setProjects(mappedProjects);
        } else {
          // Category not found in API, try static data as fallback
          const staticCategory = getCategoryBySlug(categorySlug);
          if (staticCategory) {
            setCategory(staticCategory);
            setProjects([]);
          } else {
            setCategory(null);
            setProjects([]);
          }
        }
      } catch (apiError) {
        console.error('Error loading category projects:', apiError);
        // Fallback to static data
        const staticCategory = getCategoryBySlug(categorySlug);
        if (staticCategory) {
          setCategory(staticCategory);
        } else {
          setCategory(null);
        }
        setProjects([]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback to static data
      const staticCategory = getCategoryBySlug(categorySlug);
      if (staticCategory) {
        setCategory(staticCategory);
      } else {
        setCategory(null);
      }
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Load category ID and projects - MUST be before any conditional return
  useEffect(() => {
    if (categorySlug) {
      loadCategoryProjects();
    }
  }, [categorySlug, sortBy]);

  // Early return for invalid category - AFTER all hooks
  if (!category && !loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
            <Link href="/" className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors">
              Go to Homepage
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Show loading state while category is being loaded
  if (loading || !category) {
    return (
      <PublicLayout>
        <Head>
          <title>Loading Category | Mahara</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل التصنيف...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const subcategories = getSubcategoriesFromCategory(category);

  return (
    <PublicLayout>
      <Head>
        <title>{category.name || 'Category'} Services | Mahara</title>
        <meta name="description" content={category.description || ''} />
      </Head>

      {/* Hero Section */}
      <div className={`${category.heroColor || 'bg-gradient-to-r from-primary-600 to-primary-800'} text-white py-20 relative overflow-hidden`}>
        {/* Background Illustrations */}
        <div className="absolute inset-0">
          {/* Programming & Tech - Code Editor Windows */}
          {category.slug === 'programming-tech' && (
            <>
              {/* Code Window 1 */}
              <div className="absolute top-10 left-[10%] w-80 h-48 bg-black/40 backdrop-blur-md rounded-lg border-2 border-white/40 p-4 transform -rotate-3 shadow-2xl">
                <div className="flex gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-2 text-sm font-mono text-green-300">
                  <div>function develop() {'{'}</div>
                  <div className="ml-4">return success;</div>
                  <div>{'}'}</div>
                </div>
              </div>
              {/* Code Window 2 */}
              <div className="absolute bottom-20 right-[15%] w-64 h-40 bg-black/40 backdrop-blur-md rounded-lg border-2 border-white/40 p-4 transform rotate-2 shadow-2xl">
                <div className="flex gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-1 text-sm font-mono text-blue-300">
                  <div>{'<code>'}</div>
                  <div className="ml-4">Build it.</div>
                  <div>{'</code>'}</div>
                </div>
              </div>
              {/* Floating circles */}
              <div className="absolute top-20 right-[30%] w-24 h-24 rounded-full bg-cyan-400/40 backdrop-blur-md border-2 border-white/40"></div>
              <div className="absolute bottom-32 left-[25%] w-20 h-20 rounded-full bg-green-400/40 backdrop-blur-md border-2 border-white/40"></div>
            </>
          )}

          {/* Graphics & Design - Design Elements */}
          {category.slug === 'graphics-design' && (
            <>
              <div className="absolute top-10 right-[10%] w-72 h-56 bg-white/30 backdrop-blur-md rounded-2xl border-2 border-white/50 transform rotate-6 shadow-2xl"></div>
              <div className="absolute bottom-20 left-[15%] w-64 h-48 bg-white/30 backdrop-blur-md rounded-2xl border-2 border-white/50 transform -rotate-3 shadow-2xl"></div>
              <div className="absolute top-1/2 right-[25%] w-32 h-32 rounded-full bg-gradient-to-br from-pink-400/60 to-purple-400/60 backdrop-blur-md border-2 border-white/50 shadow-2xl"></div>
              <div className="absolute top-32 left-[20%] w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400/60 to-orange-400/60 backdrop-blur-md border-2 border-white/50 shadow-2xl"></div>
            </>
          )}

          {/* Digital Marketing - Chart/Graph Elements */}
          {category.slug === 'digital-marketing' && (
            <>
              <div className="absolute top-16 right-[12%] w-80 h-52 bg-white/30 backdrop-blur-md rounded-xl border-2 border-white/50 p-6 transform rotate-3 shadow-2xl">
                <div className="flex items-end justify-around h-full gap-2">
                  <div className="w-12 h-20 bg-white/70 rounded-t-lg"></div>
                  <div className="w-12 h-32 bg-white/90 rounded-t-lg"></div>
                  <div className="w-12 h-24 bg-white/70 rounded-t-lg"></div>
                  <div className="w-12 h-36 bg-white rounded-t-lg"></div>
                </div>
              </div>
              <div className="absolute bottom-24 left-[18%] w-40 h-40 border-4 border-white/60 rounded-full flex items-center justify-center transform -rotate-12 bg-white/20 backdrop-blur-md">
                <div className="text-5xl">📱</div>
              </div>
            </>
          )}

          {/* Writing & Translation - Book/Document Elements */}
          {category.slug === 'writing-translation' && (
            <>
              <div className="absolute top-12 right-[15%] w-64 h-80 bg-white/40 backdrop-blur-md rounded-lg border-2 border-white/50 p-6 transform rotate-6 shadow-2xl">
                <div className="space-y-3">
                  <div className="h-4 bg-white/70 rounded w-3/4"></div>
                  <div className="h-3 bg-white/60 rounded"></div>
                  <div className="h-3 bg-white/60 rounded w-5/6"></div>
                  <div className="h-3 bg-white/60 rounded"></div>
                  <div className="text-5xl mt-8 opacity-70">✍️</div>
                </div>
              </div>
              <div className="absolute bottom-20 left-[12%] text-8xl opacity-40 font-serif text-white">
                Aa
              </div>
            </>
          )}

          {/* Video & Animation - Video Player */}
          {category.slug === 'video-animation' && (
            <>
              <div className="absolute top-16 right-[10%] w-96 h-56 bg-black/50 backdrop-blur-md rounded-xl border-2 border-white/50 overflow-hidden transform -rotate-2 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/40 to-green-500/40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl">
                    <div className="w-0 h-0 border-l-[20px] border-l-gray-800 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-20 left-[15%] w-64 h-40 bg-white/30 backdrop-blur-md rounded-lg border-2 border-white/50 p-4 transform rotate-3 shadow-2xl">
                <div className="flex gap-2">
                  <div className="w-full h-2 bg-white/70 rounded"></div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-white/60 rounded w-3/4"></div>
                  <div className="h-3 bg-white/60 rounded w-1/2"></div>
                </div>
              </div>
            </>
          )}

          {/* Music & Audio - Audio Waveforms */}
          {category.slug === 'music-audio' && (
            <>
              <div className="absolute top-20 right-[12%] w-96 h-48 bg-white/30 backdrop-blur-md rounded-xl border-2 border-white/50 p-6 transform -rotate-3 shadow-2xl">
                <div className="flex items-end justify-around h-full gap-1">
                  {[3, 5, 4, 7, 6, 8, 5, 9, 7, 6, 8, 5, 4, 6, 7].map((height, i) => (
                    <div key={i} className={`w-4 bg-white rounded-full`} style={{ height: `${height * 10}%` }}></div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-24 left-[15%] text-9xl opacity-50">
                🎵
              </div>
            </>
          )}

          {/* Data - Data Grid/Chart */}
          {category.slug === 'data' && (
            <>
              <div className="absolute top-16 right-[10%] w-80 h-64 bg-white/30 backdrop-blur-md rounded-xl border-2 border-white/50 p-6 transform rotate-2 shadow-2xl">
                <div className="grid grid-cols-4 gap-2 h-full">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-white/70 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-20 left-[15%] text-8xl opacity-50">
                📊
              </div>
            </>
          )}

          {/* Business - Document/Charts */}
          {category.slug === 'business' && (
            <>
              <div className="absolute top-12 right-[12%] w-72 h-80 bg-white/30 backdrop-blur-md rounded-xl border-2 border-white/50 p-8 transform -rotate-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="h-6 bg-white/70 rounded w-1/2"></div>
                  <div className="flex gap-4 mt-8">
                    <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center text-3xl">📈</div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/60 rounded"></div>
                      <div className="h-3 bg-white/60 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-24 left-[18%] text-8xl opacity-50">
                💼
              </div>
            </>
          )}
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              {category.name}
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-black">
              {category.description}
            </p>
            <button className="bg-black/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-black transition-colors font-medium border border-black flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              How Mahara Works
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-500">
              Home
            </Link>
            <FaChevronRight className="mx-2 w-3 h-3" />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Most Popular Services */}
      {category.subCategories && category.subCategories.length > 0 && (
        <div className="bg-white py-8 border-b border-gray-200">
          <div className="container-custom">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Most popular in {category.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              {subcategories.slice(0, 6).map((sub, index) => (
                <Link
                  key={index}
                  href={sub.href}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:border-primary-500 hover:text-primary-500 transition-colors"
                >
                  <span className="text-sm font-medium">{sub.name}</span>
                  <FaChevronRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Open Projects Section */}
      <div className="bg-white py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              المشاريع المفتوحة في {category.name}
            </h2>
            <div className="flex items-center gap-4">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="latest">الأحدث</option>
                <option value="budget">الأعلى ميزانية</option>
                <option value="offers">الأكثر عروض</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل المشاريع...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مشاريع مفتوحة حالياً</h3>
              <p className="text-gray-600 mb-6">
                {isFreelancer 
                  ? 'لا توجد مشاريع متاحة حالياً في هذه الفئة. كن أول من يقدم عرضاً عندما يتم نشر مشروع جديد!'
                  : 'كن أول من ينشر مشروع في هذه الفئة!'}
              </p>
              {isClient && (
                <Link
                  href="/client/projects/new"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                >
                  إنشاء مشروع جديد
                </Link>
              )}
              {!isAuthenticated && (
                <Link
                  href="/register?role=client"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                >
                  سجل كعميل لإنشاء مشروع
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-primary-500 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 flex-1">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {project.category}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        مفتوح
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaDollarSign className="text-green-600" />
                          <span className="font-semibold">
                            ${project.budget} {project.budgetType === 'hourly' ? '/ساعة' : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaClock className="text-blue-600" />
                          <span>{project.deliveryTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-purple-600" />
                        <span>{project.proposals || 0} عروض</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaEye className="text-gray-400" />
                        <span>{project.views || 0} مشاهدة</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {projects.length >= 8 && (
                <div className="text-center mt-8">
                  <button className="px-8 py-3 border-2 border-primary-500 text-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-colors font-medium">
                    عرض المزيد
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Related Categories Section */}
      <div className="bg-gray-50 py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories
              .filter(cat => cat.slug !== categorySlug)
              .slice(0, 6)
              .map((cat, index) => (
                <Link
                  key={index}
                  href={cat.href}
                  className="bg-white rounded-lg p-4 hover:shadow-lg transition-all border border-gray-200 hover:border-primary-500 text-center group"
                >
                  {cat.emoji && (
                    <div className="text-3xl mb-2">{cat.emoji}</div>
                  )}
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

