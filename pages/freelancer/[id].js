import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PublicLayout from '../../components/layout/PublicLayout';
import PortfolioGrid from '../../components/portfolio/PortfolioGrid';
import ReviewList from '../../components/reviews/ReviewList';
import { 
  FaStar, 
  FaCheckCircle, 
  FaGlobe, 
  FaLinkedin, 
  FaGithub,
  FaMapMarkerAlt,
  FaEnvelope,
  FaUser,
  FaBriefcase,
  FaClock,
  FaDollarSign,
  FaImage
} from 'react-icons/fa';

export default function FreelancerPublicProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadFreelancerProfile();
    }
  }, [id]);

  const loadFreelancerProfile = async () => {
    try {
      setLoading(true);
      const sellerServiceModule = await import('../../services/sellerService');
      const sellerService = sellerServiceModule.sellerService || sellerServiceModule.default;
      
      try {
        // Try to get freelancer profile by ID
        const response = await sellerService.getFreelancerProfileById(id);
        const profileData = response.data?.data || response.data;
        console.log('Freelancer profile loaded:', profileData);
        console.log('Portfolio items:', profileData?.portfolio_items);
        setFreelancer(profileData);
      } catch (apiError) {
        console.error('Error loading freelancer profile from API:', apiError);
        // Fallback: Try to get by username if ID doesn't work
        // This is a fallback, the backend should support /freelancers/{id}/profile
        setFreelancer(null);
      }
    } catch (error) {
      console.error('Error loading freelancer profile:', error);
      setFreelancer(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <Head>
          <title>ملف المستقل | Mahara</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!freelancer) {
    return (
      <PublicLayout>
        <Head>
          <title>المستقل غير موجود | Mahara</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">المستقل غير موجود</h2>
            <Link
              href="/"
              className="text-primary-500 hover:text-primary-600 font-semibold"
            >
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Head>
        <title>{freelancer.user?.name || freelancer.name || 'ملف المستقل'} | Mahara</title>
        <meta name="description" content={freelancer.bio || 'ملف المستقل الشخصي'} />
      </Head>

      <div className="max-w-6xl mx-auto py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold">
                {(freelancer.user?.name || freelancer.name || 'م').charAt(0)}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {freelancer.user?.name || freelancer.name || 'مستقل'}
              </h1>
              {freelancer.title && (
                <p className="text-lg text-gray-600 mb-4">{freelancer.title}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                {freelancer.user?.rating || freelancer.rating ? (
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span className="font-semibold">{freelancer.user?.rating || freelancer.rating}</span>
                    <span className="text-gray-400">({freelancer.reviews_count || 0} تقييم)</span>
                  </div>
                ) : null}
                {freelancer.location && (
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{freelancer.location}</span>
                  </div>
                )}
                {freelancer.hourly_rate && (
                  <div className="flex items-center gap-1">
                    <FaDollarSign className="text-green-600" />
                    <span>${freelancer.hourly_rate}/ساعة</span>
                  </div>
                )}
              </div>

              {freelancer.bio && (
                <p className="text-gray-700 leading-relaxed mb-4">{freelancer.bio}</p>
              )}

              {/* Social Links - Quick Access */}
              {(freelancer.github_url || freelancer.portfolio_url || freelancer.linkedin_url) && (
                <div className="flex flex-wrap gap-3">
                  {freelancer.github_url && (
                    <a
                      href={freelancer.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
                    >
                      <FaGithub />
                      <span>GitHub</span>
                    </a>
                  )}
                  {freelancer.portfolio_url && (
                    <a
                      href={freelancer.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                    >
                      <FaGlobe />
                      <span>الموقع الشخصي</span>
                    </a>
                  )}
                  {freelancer.linkedin_url && (
                    <a
                      href={freelancer.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <FaLinkedin />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {freelancer.completed_projects || freelancer.completedProjects || 0}
            </div>
            <div className="text-sm text-gray-600">مشروع مكتمل</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="text-3xl font-bold text-green-600">
                {freelancer.average_rating || freelancer.user?.rating || freelancer.rating || '0.0'}
              </div>
              <FaStar className="text-yellow-400 text-xl" />
            </div>
            <div className="text-sm text-gray-600">
              التقييم ({freelancer.total_reviews || 0} {freelancer.total_reviews === 1 ? 'تقييم' : 'تقييمات'})
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {freelancer.experience_years || freelancer.experienceYears || 0}
            </div>
            <div className="text-sm text-gray-600">سنة خبرة</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {freelancer.skills?.length || 0}
            </div>
            <div className="text-sm text-gray-600">مهارة</div>
          </div>
        </div>

        {/* Skills */}
        {freelancer.skills && freelancer.skills.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">المهارات</h2>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {(freelancer.portfolio_url || freelancer.linkedin_url || freelancer.github_url) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">روابط التواصل</h2>
            <div className="flex flex-wrap gap-4">
              {freelancer.portfolio_url && (
                <a
                  href={freelancer.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-600 rounded-lg transition-colors"
                >
                  <FaGlobe className="text-xl" />
                  <span>الموقع الشخصي</span>
                </a>
              )}
              {freelancer.github_url && (
                <a
                  href={freelancer.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-600 rounded-lg transition-colors"
                >
                  <FaGithub className="text-xl" />
                  <span>GitHub</span>
                </a>
              )}
              {freelancer.linkedin_url && (
                <a
                  href={freelancer.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-600 rounded-lg transition-colors"
                >
                  <FaLinkedin className="text-xl" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Portfolio Section */}
        {freelancer.portfolio_items && freelancer.portfolio_items.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">معرض الأعمال</h2>
            <PortfolioGrid 
              portfolioItems={freelancer.portfolio_items.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                image_url: item.image_url,
                image: item.image_url,
                project_url: item.project_url,
                category: item.category?.name || item.category,
                completion_date: item.completion_date,
                completed_date: item.completion_date
              }))}
              onItemClick={(item) => {
                if (item.project_url) {
                  window.open(item.project_url, '_blank');
                }
              }}
            />
          </div>
        )}

        {(!freelancer.portfolio_items || freelancer.portfolio_items.length === 0) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mb-6">
            <FaImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد أعمال في المعرض</h3>
            <p className="text-gray-600">لم يضف المستقل أي أعمال إلى معرضه بعد</p>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">التقييمات والمراجعات</h2>
          <ReviewList freelancerId={freelancer.user_id || freelancer.user?.id || id} />
        </div>
      </div>
    </PublicLayout>
  );
}

