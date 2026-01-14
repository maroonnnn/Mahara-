import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PublicLayout from '../../components/layout/PublicLayout';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaArrowRight,
  FaDollarSign,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaEnvelope,
  FaPaperPlane,
  FaStar,
  FaEye,
  FaUsers
} from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isClient, isFreelancer, isAuthenticated, loading: authLoading } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerData, setOfferData] = useState({
    amount: '',
    duration: '',
    durationUnit: 'days',
    message: ''
  });
  const [submittingOffer, setSubmittingOffer] = useState(false);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id, authLoading]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const projectService = (await import('../../services/projectService')).default;
      const response = await projectService.getProject(id);
      
      console.log('Project API Response:', response);
      
      const projectData = response.data?.data || response.data || response;
      
      if (projectData && projectData.id) {
        setProject({
          id: projectData.id,
          title: projectData.title,
          description: projectData.description,
          category: projectData.category?.name || projectData.category_name || 'غير محدد',
          subcategory: projectData.subcategory || '',
          budget: parseFloat(projectData.budget || 0),
          budgetType: projectData.budget_type || 'fixed',
          deliveryTime: projectData.duration_days 
            ? `${projectData.duration_days} ${projectData.duration_days === 1 ? 'يوم' : 'أيام'}` 
            : (projectData.delivery_time || 'غير محدد'),
          status: projectData.status || 'open',
          skills: projectData.skills || [],
          createdAt: projectData.created_at || projectData.createdAt,
          acceptedOffer: projectData.accepted_offer || projectData.acceptedOffer,
          offersCount: projectData.offers_count || projectData.offers?.length || 0,
          views: projectData.views || 0,
          client: projectData.client || {
            id: projectData.client_id,
            name: projectData.client_name || 'عميل',
            rating: projectData.client_rating || 5.0,
            completedProjects: projectData.client_completed_projects || 0
          }
        });
      } else {
        console.warn('Project data not found or invalid:', projectData);
        setProject(null);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error('حدث خطأ في تحميل المشروع');
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول أولاً لتقديم عرض');
      router.push('/login');
      return;
    }

    if (!isFreelancer) {
      toast.error('فقط المستقلون يمكنهم تقديم العروض');
      return;
    }

    try {
      setSubmittingOffer(true);
      const offerService = (await import('../../services/offerService')).default;
      
      // Convert duration to days (backend expects delivery_days as integer)
      let deliveryDays = parseInt(offerData.duration) || 1;
      if (offerData.durationUnit === 'weeks') {
        deliveryDays = deliveryDays * 7;
      } else if (offerData.durationUnit === 'months') {
        deliveryDays = deliveryDays * 30;
      }
      
      // Backend expects: amount, delivery_days, cover_message
      await offerService.submitOffer(project.id, {
        amount: parseFloat(offerData.amount),
        delivery_days: deliveryDays,
        cover_message: offerData.message || ''
      });

      toast.success('تم تقديم العرض بنجاح!');
      setShowOfferForm(false);
      setOfferData({ amount: '', duration: '', durationUnit: 'days', message: '' });
      
      // Reload project to update offers count
      await loadProject();
    } catch (error) {
      console.error('Error submitting offer:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null) ||
                          'حدث خطأ في تقديم العرض';
      toast.error(errorMessage);
    } finally {
      setSubmittingOffer(false);
    }
  };

  const startConversation = () => {
    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول أولاً');
      router.push('/login');
      return;
    }
    router.push(`/messages?project=${project.id}`);
  };

  // Use DashboardLayout for authenticated freelancers, PublicLayout for others
  const Layout = isAuthenticated && isFreelancer ? DashboardLayout : PublicLayout;

  if (loading) {
    return (
      <Layout>
        <Head>
          <title>جاري التحميل... | Mahara</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل المشروع...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <Head>
          <title>المشروع غير موجود | Mahara</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-gray-600 mb-8">المشروع غير موجود</p>
            <Link href="/" className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors">
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{project.title} | Mahara</title>
        <meta name="description" content={project.description} />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-primary-500">الرئيسية</Link>
              <span className="mx-2">/</span>
              <Link href={`/categories/${project.category?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary-500">
                {project.category}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{project.title}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <FaClock />
                      <span>{project.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDollarSign />
                      <span className="font-semibold">
                        ${project.budget} {project.budgetType === 'hourly' ? '/ساعة' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers />
                      <span>{project.offersCount || 0} عروض</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEye />
                      <span>{project.views || 0} مشاهدة</span>
                    </div>
                  </div>
                </div>
                <div className="ml-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    project.status === 'open' ? 'bg-green-500' :
                    project.status === 'in_progress' ? 'bg-blue-500' :
                    project.status === 'completed' ? 'bg-gray-500' :
                    'bg-yellow-500'
                  }`}>
                    {project.status === 'open' ? 'مفتوح' :
                     project.status === 'in_progress' ? 'قيد التنفيذ' :
                     project.status === 'completed' ? 'مكتمل' :
                     project.status === 'delivered' ? 'تم التسليم' :
                     project.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">وصف المشروع</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{project.description}</p>
              </div>

              {/* Skills */}
              {project.skills && project.skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">المهارات المطلوبة</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Info */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                    {project.client.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{project.client.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaStar className="text-yellow-400" />
                      <span>{project.client.rating || 5.0}</span>
                      <span className="mx-2">•</span>
                      <span>{project.client.completedProjects || 0} مشروع مكتمل</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {project.status === 'open' && (
                <div className="flex gap-4">
                  {isAuthenticated && isFreelancer ? (
                    <>
                      {!showOfferForm ? (
                        <>
                          <button
                            onClick={() => setShowOfferForm(true)}
                            className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center justify-center gap-2"
                          >
                            <FaPaperPlane />
                            تقديم عرض
                          </button>
                          <button
                            onClick={startConversation}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2"
                          >
                            <FaEnvelope />
                            إرسال رسالة
                          </button>
                        </>
                      ) : (
                        <div className="w-full bg-gray-50 rounded-lg p-6 border border-gray-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">تقديم عرض</h3>
                          <form onSubmit={handleSubmitOffer} className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                المبلغ (USD)
                              </label>
                              <div className="relative">
                                <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                  type="number"
                                  value={offerData.amount}
                                  onChange={(e) => setOfferData({ ...offerData, amount: e.target.value })}
                                  required
                                  min="1"
                                  step="0.01"
                                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                المدة
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={offerData.duration}
                                  onChange={(e) => setOfferData({ ...offerData, duration: e.target.value })}
                                  required
                                  min="1"
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  placeholder="عدد الأيام"
                                />
                                <select
                                  value={offerData.durationUnit}
                                  onChange={(e) => setOfferData({ ...offerData, durationUnit: e.target.value })}
                                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                  <option value="days">أيام</option>
                                  <option value="weeks">أسابيع</option>
                                  <option value="months">أشهر</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                رسالة (اختياري)
                              </label>
                              <textarea
                                value={offerData.message}
                                onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                placeholder="اكتب رسالة للعميل..."
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowOfferForm(false);
                                  setOfferData({ amount: '', duration: '', durationUnit: 'days', message: '' });
                                }}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                              >
                                إلغاء
                              </button>
                              <button
                                type="submit"
                                disabled={submittingOffer}
                                className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {submittingOffer ? 'جاري الإرسال...' : 'إرسال العرض'}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </>
                  ) : isAuthenticated && isClient ? (
                    <Link
                      href={`/client/projects/${project.id}`}
                      className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      عرض تفاصيل المشروع
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      تسجيل الدخول لتقديم عرض
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
