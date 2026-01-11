import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  FaFileAlt,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaStar,
  FaUser,
  FaEye
} from 'react-icons/fa';

export default function FreelancerCompletedProjectsPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCompletedProjects();
    }
  }, [user]);

  const loadCompletedProjects = async () => {
    try {
      setLoading(true);
      const projectService = (await import('../../services/projectService')).default;
      const response = await projectService.getCompletedProjects();
      
      const projectsData = response.data?.data || response.data || [];
      const projectsList = Array.isArray(projectsData) ? projectsData : [];
      
      // Map projects to frontend format
      const mappedProjects = projectsList.map(p => {
        return {
          id: p.id,
          title: p.title,
          client: {
            id: p.client?.id || p.client_id,
            name: p.client?.name || 'عميل'
          },
          budget: parseFloat(p.budget || 0),
          budgetType: p.budget_type || 'fixed',
          deliveryTime: p.duration_days 
            ? `${p.duration_days} ${p.duration_days === 1 ? 'يوم' : 'أيام'}` 
            : 'غير محدد',
          status: p.status || 'completed',
          completedAt: p.updated_at || p.created_at,
          review: p.reviews && p.reviews.length > 0 ? p.reviews[0] : null,
          category: p.category?.name || 'غير محدد'
        };
      });
      
      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error loading completed projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>{language === 'ar' ? 'المشاريع المكتملة | Mahara' : 'Completed Projects | Mahara'}</title>
        <meta name="description" content={language === 'ar' ? 'مشاريعك المكتملة' : 'Your completed projects'} />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'المشاريع المكتملة' : 'Completed Projects'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'المشاريع التي قمت بتسليمها أو تم إكمالها' : 'Projects you have delivered or completed'}
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد مشاريع مكتملة' : 'No completed projects'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? 'المشاريع التي تقوم بتسليمها ستظهر هنا'
                : 'Projects you deliver will appear here'}
            </p>
            <Link
              href="/freelancer/active-projects"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              {language === 'ar' ? 'عرض المشاريع النشطة' : 'View Active Projects'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
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
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="mb-3">
                      {project.status === 'delivered' ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                          <FaClock className="text-yellow-600" />
                          {language === 'ar' ? 'في انتظار موافقة العميل' : 'Awaiting Client Approval'}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          <FaCheckCircle className="text-green-600" />
                          {language === 'ar' ? 'مكتمل' : 'Completed'}
                        </div>
                      )}
                      {project.completedAt && (
                        <span className="ml-3 text-sm text-gray-500">
                          {language === 'ar' ? 'تم التسليم:' : 'Delivered:'} {formatDate(project.completedAt)}
                        </span>
                      )}
                    </div>

                    {/* Review Display */}
                    {project.review && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= project.review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {project.review.rating}.0
                          </span>
                        </div>
                        {project.review.comment && (
                          <p className="text-gray-700 text-sm italic">
                            "{project.review.comment}"
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          - {project.client.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                      {project.client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{project.client.name}</p>
                      <p className="text-xs text-gray-500">{language === 'ar' ? 'العميل' : 'Client'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/freelancer/projects/${project.id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                    >
                      {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
