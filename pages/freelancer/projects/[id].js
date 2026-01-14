import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function FreelancerProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  // Redirect to the public project details page
  useEffect(() => {
    if (id) {
      router.replace(`/projects/${id}`);
    }
  }, [id, router]);

  // Show loading while redirecting
  return null;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [delivering, setDelivering] = useState(false);
  const { language } = useLanguage();
  const [offerData, setOfferData] = useState({
    amount: '',
    duration: '',
    durationUnit: 'days',
    message: ''
  });

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) {
      return;
    }

    // Load project regardless of authentication (projects are public)
    if (id) {
      loadProject();
      
      // Only check for existing offer if user is authenticated and is a freelancer
      if (isAuthenticated && isFreelancer) {
        checkExistingOffer();
      }
    }
  }, [authLoading, id, isAuthenticated, isFreelancer]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const projectService = (await import('../../../services/projectService')).default;
      const response = await projectService.getProject(id);
      const projectData = response.data?.data || response.data;
      
      if (projectData) {
        // Map project data to frontend format
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
          client: projectData.client || {
            id: projectData.client_id,
            name: projectData.client_name || 'عميل',
            rating: projectData.client_rating || 5.0,
            completedProjects: projectData.client_completed_projects || 0
          }
        });
      } else {
        setProject(null);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingOffer = async () => {
    // Check if freelancer already submitted an offer
    // Mock - Replace with actual API call
    setOfferSubmitted(false);
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    
    // Check authentication before submitting offer
    if (!isAuthenticated) {
      alert('يجب تسجيل الدخول أولاً لتقديم عرض');
      router.push('/login');
      return;
    }
    
    if (!isFreelancer) {
      alert('❌ فقط المستقلين يمكنهم تقديم عروض على المشاريع.');
      if (isClient) {
        router.push('/client/projects');
      } else {
        router.push('/');
      }
      return;
    }
    
    try {
      const offerService = (await import('../../../services/offerService')).default;
      
      // Convert duration to days (backend expects delivery_days as integer)
      let deliveryDays = parseInt(offerData.duration) || 1;
      if (offerData.durationUnit === 'weeks') {
        deliveryDays = deliveryDays * 7;
      } else if (offerData.durationUnit === 'months') {
        deliveryDays = deliveryDays * 30;
      }
      
      // Prepare offer data matching backend format
      // Backend expects: amount (numeric), delivery_days (integer), cover_message (string)
      const offerPayload = {
        amount: parseFloat(offerData.amount),
        delivery_days: deliveryDays,
        cover_message: offerData.message || ''
      };
      
      console.log('Submitting offer:', offerPayload);
      
      // Submit offer to API
      const response = await offerService.submitOffer(id, offerPayload);
      
      console.log('Offer submitted successfully:', response);
      
      setOfferSubmitted(true);
      setShowOfferForm(false);
      alert('تم تقديم العرض بنجاح! سيتم إشعار العميل وسيتمكن من رؤية عرضك في صفحة العروض.');
    } catch (error) {
      console.error('Error submitting offer:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null) ||
                          error.message || 
                          'خطأ غير معروف';
      
      alert(`حدث خطأ أثناء تقديم العرض.\n\n${errorMessage}\n\nيرجى المحاولة مرة أخرى.`);
    }
  };

  const startConversation = async () => {
    // Check authentication before starting conversation
    if (!isAuthenticated) {
      alert('يجب تسجيل الدخول أولاً لإرسال رسالة');
      router.push('/login');
      return;
    }
    
    try {
      // Check if project has accepted offer (required for messaging)
      // For now, just redirect to messages page - it will show error if no accepted offer
      router.push(`/freelancer/messages?projectId=${id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('حدث خطأ أثناء فتح المحادثة. يرجى المحاولة مرة أخرى.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Head>
          <title>تفاصيل المشروع | Mahara</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <Head>
          <title>المشروع غير موجود | Mahara</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">المشروع غير موجود</h2>
            <Link
              href="/freelancer/projects"
              className="text-primary-500 hover:text-primary-600 font-semibold"
            >
              العودة إلى المشاريع
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head>
        <title>{project.title} | Mahara</title>
        <meta name="description" content={project.description} />
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/freelancer/projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowRight />
          <span>العودة إلى المشاريع</span>
        </Link>

        {/* Project Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {project.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {project.subcategory}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500 mb-1">الميزانية</p>
              <p className="font-bold text-gray-900 flex items-center gap-1">
                <FaDollarSign className="text-green-600" />
                ${project.budget} {project.budgetType === 'hourly' ? '/hr' : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">وقت التسليم</p>
              <p className="font-bold text-gray-900 flex items-center gap-1">
                <FaClock className="text-blue-600" />
                {project.deliveryTime}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">الحالة</p>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                {project.status === 'open' ? 'مفتوح' : 
                 project.status === 'active' ? 'نشط' :
                 project.status === 'in_progress' ? 'قيد التنفيذ' :
                 project.status === 'delivered' ? 'تم التسليم - في انتظار الموافقة' :
                 project.status === 'completed' ? 'مكتمل' :
                 project.status === 'cancelled' ? 'ملغي' : project.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">تاريخ النشر</p>
              <p className="font-bold text-gray-900 text-sm">{project.createdAt}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">وصف المشروع</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{project.description}</p>
          </div>

          {project.skills && project.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">المهارات المطلوبة</h2>
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
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">معلومات العميل</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold">
                {(project.client?.name || 'عميل').charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{project.client?.name || 'عميل'}</p>
                <p className="text-sm text-gray-600">
                  ⭐ {project.client?.rating || '5.0'} | {project.client?.completedProjects || 0} مشروع مكتمل
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {offerSubmitted ? (
            <div className="text-center">
              <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">تم تقديم العرض بنجاح!</h3>
              <p className="text-gray-600 mb-6">سيتم إشعار العميل ومراجعة عرضك</p>
              <button
                onClick={startConversation}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center gap-2 mx-auto"
              >
                <FaEnvelope />
                إرسال رسالة للعميل
              </button>
            </div>
          ) : showOfferForm ? (
            <form onSubmit={handleSubmitOffer} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">تقديم عرض</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    المبلغ المقترح <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={offerData.amount}
                      onChange={(e) => setOfferData({ ...offerData, amount: e.target.value })}
                      placeholder="500"
                      className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    مدة التنفيذ <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={offerData.duration}
                      onChange={(e) => setOfferData({ ...offerData, duration: e.target.value })}
                      placeholder="7"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                      min="1"
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
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رسالة العرض <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={offerData.message}
                  onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
                  rows="5"
                  placeholder="اكتب رسالة توضح لماذا أنت الأنسب لهذا المشروع..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <FaPaperPlane />
                  إرسال العرض
                </button>
                <button
                  type="button"
                  onClick={() => setShowOfferForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          ) : project.acceptedOffer && project.acceptedOffer.freelancer_id === user?.id && project.status === 'in_progress' ? (
            <div className="space-y-4">
              <button
                onClick={handleDeliverProject}
                disabled={delivering}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FaPaperPlane />
                {delivering 
                  ? (language === 'ar' ? 'جاري التسليم...' : 'Delivering...')
                  : (language === 'ar' ? 'تسليم المشروع' : 'Deliver Project')
                }
              </button>
              <button
                onClick={startConversation}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <FaEnvelope />
                {language === 'ar' ? 'فتح المحادثة' : 'Open Chat'}
              </button>
            </div>
          ) : project.status === 'delivered' ? (
            <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <FaCheckCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'تم تسليم المشروع' : 'Project Delivered'}
              </h3>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'في انتظار موافقة العميل على التسليم'
                  : 'Waiting for client approval'}
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              {isAuthenticated && isFreelancer ? (
                <>
                  <button
                    onClick={() => setShowOfferForm(true)}
                    className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <FaPaperPlane />
                    {language === 'ar' ? 'تقديم عرض' : 'Submit Offer'}
                  </button>
                  <button
                    onClick={startConversation}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2"
                  >
                    <FaEnvelope />
                    {language === 'ar' ? 'إرسال رسالة' : 'Send Message'}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <FaPaperPlane />
                  {language === 'ar' ? 'تسجيل الدخول لتقديم عرض' : 'Login to Submit Offer'}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

