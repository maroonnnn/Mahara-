import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  FaArrowRight,
  FaDollarSign,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaEnvelope,
  FaStar,
  FaTimesCircle,
  FaEye
} from 'react-icons/fa';
import ReviewForm from '../../../components/reviews/ReviewForm';

export default function ClientProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isClient, isFreelancer, isAuthenticated, loading: authLoading } = useAuth();
  const [project, setProject] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('offers'); // Default to offers tab
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [completing, setCompleting] = useState(false);

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
      alert('❌ هذه الصفحة للعملاء فقط.\n\nيمكنك عرض تفاصيل المشروع وتقديم عرض من صفحة المشاريع المتاحة.');
      router.push('/freelancer/projects');
      return;
    }

    if (!isClient) {
      alert('❌ فقط العملاء يمكنهم الوصول لهذه الصفحة.');
      router.push('/');
      return;
    }

    if (id) {
      loadProjectAndOffers();
      checkReviewStatus();
      
      // Refresh offers every 10 seconds to see new offers
      const interval = setInterval(() => {
        if (id && isAuthenticated && isClient) {
          loadOffers();
        }
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [authLoading, id, isAuthenticated, isClient, isFreelancer]);
  
  const handleCompleteProject = async () => {
    if (!confirm('هل أنت متأكد من إكمال المشروع؟ سيتم تحويل المبلغ للمستقل.')) {
      return;
    }

    try {
      setCompleting(true);
      const projectService = (await import('../../../services/projectService')).default;
      await projectService.completeProject(id);
      
      alert('تم إكمال المشروع بنجاح! تم تحويل المبلغ للمستقل.');
      
      // Reload project to update status
      loadProjectAndOffers();
      checkReviewStatus();
    } catch (error) {
      console.error('Error completing project:', error);
      const message = error.response?.data?.message || 'حدث خطأ أثناء إكمال المشروع';
      alert(message);
    } finally {
      setCompleting(false);
    }
  };

  const checkReviewStatus = async () => {
    if (!id) return;
    
    try {
      const reviewService = (await import('../../../services/reviewService')).default;
      const response = await reviewService.getProjectReview(id);
      if (response.data) {
        setHasReview(true);
      }
    } catch (error) {
      // No review yet, that's okay
      setHasReview(false);
    }
  };

  const loadOffers = async () => {
    if (!id) return;
    
    try {
      const offerService = (await import('../../../services/offerService')).default;
      const offersResponse = await offerService.getProjectOffers(id);
      
      // Backend returns: { project: {...}, offers: [...], offers_count: 5 }
      const responseData = offersResponse.data || offersResponse;
      const offersList = responseData.offers || responseData.data || [];
      
      // Map offers to frontend format
      const mappedOffers = offersList.map(offer => ({
        id: offer.id,
        freelancer: {
          id: offer.freelancer?.id || offer.freelancer_id,
          name: offer.freelancer?.name || offer.freelancer_name || 'مستقل',
          rating: offer.freelancer?.rating || offer.freelancer_rating || 0,
          completedProjects: offer.freelancer?.completed_projects || offer.freelancer?.completedProjects || 0,
          avatar: offer.freelancer?.avatar || null
        },
        amount: parseFloat(offer.amount || 0),
        duration: offer.delivery_days 
          ? `${offer.delivery_days} ${offer.delivery_days === 1 ? 'يوم' : 'أيام'}` 
          : (offer.duration || 'غير محدد'),
        message: offer.cover_message || offer.message || offer.description || '',
        status: offer.status || 'pending',
        createdAt: offer.created_at || offer.createdAt
      }));
      
      setOffers(mappedOffers);
    } catch (offersError) {
      console.error('Error loading offers:', offersError);
    }
  };

  const loadProjectAndOffers = async () => {
    try {
      setLoading(true);
      const projectService = (await import('../../../services/projectService')).default;
      const offerService = (await import('../../../services/offerService')).default;
      
      // Load project details - try API first
      let projectLoaded = false;
      try {
        const projectResponse = await projectService.getProject(id);
        const projectData = projectResponse.data?.data || projectResponse.data;
        
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
            views: projectData.views || 0
          });
          projectLoaded = true;
        }
      } catch (projectError) {
        console.error('Error loading project from API:', projectError);
        // Try localStorage as fallback
      }
      
      // Fallback: Try to load from localStorage if API failed
      if (!projectLoaded) {
        try {
          const savedProjects = JSON.parse(localStorage.getItem('myProjects') || '[]');
          // Convert id to number for comparison (in case it's a string)
          const projectId = typeof id === 'string' ? parseInt(id) || id : id;
          
          // Find project by ID
          const foundProject = savedProjects.find(p => {
            const pId = typeof p.id === 'string' ? parseInt(p.id) || p.id : p.id;
            return pId == projectId || p.id == projectId || p.id.toString() === id.toString();
          });
          
          if (foundProject) {
            // Map localStorage project to frontend format
            setProject({
              id: foundProject.id,
              title: foundProject.title,
              description: foundProject.description,
              category: foundProject.category || 'غير محدد',
              subcategory: foundProject.subcategory || '',
              budget: parseFloat(foundProject.budget || 0),
              budgetType: foundProject.budgetType || 'fixed',
              deliveryTime: foundProject.deliveryTime 
                ? foundProject.deliveryTime
                    .replace(/\b(\d+)\s*days?\b/gi, (match, num) => `${num} ${num === '1' ? 'يوم' : 'أيام'}`)
                    .replace(/\b(\d+)\s*weeks?\b/gi, (match, num) => `${num} ${num === '1' ? 'أسبوع' : 'أسابيع'}`)
                    .replace(/\b(\d+)\s*months?\b/gi, (match, num) => `${num} ${num === '1' ? 'شهر' : 'أشهر'}`)
                : (foundProject.duration_days 
                  ? `${foundProject.duration_days} ${foundProject.duration_days === 1 ? 'يوم' : 'أيام'}` 
                  : 'غير محدد'),
              status: foundProject.status || 'open',
              skills: foundProject.skills || [],
              createdAt: foundProject.createdAt || foundProject.created_at,
              views: foundProject.views || 0
            });
            projectLoaded = true;
          }
        } catch (localError) {
          console.error('Error loading project from localStorage:', localError);
        }
      }
      
      // If still not loaded, set to null
      if (!projectLoaded) {
        setProject(null);
        setOffers([]);
        setLoading(false);
        return; // Exit early if project not found
      }
      
      // Load offers for this project (only if project exists)
      try {
        const offersResponse = await offerService.getProjectOffers(id);
        console.log('Offers API Response:', offersResponse);
        
        // Backend returns: { project: {...}, offers: [...], offers_count: 5 }
        const responseData = offersResponse.data || offersResponse;
        const offersList = responseData.offers || responseData.data || [];
        
        console.log('Offers List:', offersList);
        console.log('Offers Count:', offersList.length);
        
        // Map offers to frontend format
        const mappedOffers = offersList.map(offer => ({
          id: offer.id,
          freelancer: {
            id: offer.freelancer?.id || offer.freelancer_id,
            name: offer.freelancer?.name || offer.freelancer_name || 'مستقل',
            rating: offer.freelancer?.rating || offer.freelancer_rating || 0,
            completedProjects: offer.freelancer?.completed_projects || offer.freelancer?.completedProjects || 0,
            avatar: offer.freelancer?.avatar || null
          },
          amount: parseFloat(offer.amount || 0),
          duration: offer.delivery_days 
            ? `${offer.delivery_days} ${offer.delivery_days === 1 ? 'يوم' : 'أيام'}` 
            : (offer.duration || 'غير محدد'),
          message: offer.cover_message || offer.message || offer.description || '',
          status: offer.status || 'pending',
          createdAt: offer.created_at || offer.createdAt
        }));
        
        console.log('Mapped Offers:', mappedOffers);
        setOffers(mappedOffers);
      } catch (offersError) {
        console.error('Error loading offers:', offersError);
        console.error('Error details:', {
          message: offersError.message,
          response: offersError.response?.data,
          status: offersError.response?.status
        });
        // For new projects, no offers yet - show empty state
        setOffers([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading project data:', error);
      setProject(null);
      setOffers([]);
      setLoading(false);
    }
  };


  const PLATFORM_COMMISSION = 10; // 10% commission on projects

  const handleAcceptOffer = async (offerId) => {
    try {
      // Find the offer to get the amount
      const offer = offers.find(o => o.id === offerId);
      if (!offer) {
        alert('❌ العرض غير موجود');
        return;
      }

      // Calculate total amount with platform commission
      const offerAmount = offer.amount;
      const clientCommission = offerAmount * (PLATFORM_COMMISSION / 100);
      const totalAmount = offerAmount + clientCommission;

      // Check wallet balance
      const currentBalance = parseFloat(localStorage.getItem('walletBalance') || '1200'); // Mock balance

      if (currentBalance < totalAmount) {
        const shortage = totalAmount - currentBalance;
        const confirmDeposit = window.confirm(
          `❌ رصيدك الحالي: $${currentBalance.toFixed(2)}\n` +
          `💵 مبلغ العرض: $${offerAmount.toFixed(2)}\n` +
          `📊 عمولة المنصة (10%): $${clientCommission.toFixed(2)}\n` +
          `💰 المبلغ الإجمالي: $${totalAmount.toFixed(2)}\n` +
          `⚠️ ينقصك: $${shortage.toFixed(2)}\n\n` +
          `هل تريد الذهاب لصفحة الإيداع لإضافة رصيد؟`
        );
        
        if (confirmDeposit) {
          router.push('/client/wallet/deposit');
        }
        return;
      }

      // Confirm acceptance
      const confirmed = window.confirm(
        `هل أنت متأكد من قبول هذا العرض؟\n\n` +
        `💵 مبلغ العرض: $${offerAmount.toFixed(2)}\n` +
        `📊 عمولة المنصة (10%): $${clientCommission.toFixed(2)}\n` +
        `💰 المبلغ الإجمالي: $${totalAmount.toFixed(2)}\n` +
        `⏱ المدة: ${offer.duration}\n` +
        `👤 المستقل: ${offer.freelancer.name}\n\n` +
        `سيتم خصم المبلغ من محفظتك وحجزه حتى إتمام المشروع.`
      );

      if (!confirmed) return;

      const offerService = (await import('../../../services/offerService')).default;
      
      // Accept offer via API (needs both projectId and offerId)
      await offerService.acceptOffer(id, offerId);
      
      // Deduct from wallet (hold in escrow)
      const newBalance = currentBalance - totalAmount;
      localStorage.setItem('walletBalance', newBalance.toString());
      localStorage.setItem('escrowAmount', offerAmount.toString()); // Only offer amount in escrow, not commission
      
      // Track platform revenue from commission
      const platformRevenue = JSON.parse(localStorage.getItem('platformRevenue') || '{"total":0,"deposits":[],"withdrawals":[],"commissions":[]}');
      platformRevenue.total += clientCommission;
      platformRevenue.commissions.push({
        id: Date.now(),
        projectId: id,
        offerId: offerId,
        userId: offer.freelancer.id,
        userName: offer.freelancer.name,
        amount: offerAmount,
        fee: clientCommission,
        date: new Date().toISOString(),
        type: 'project_commission',
        source: 'client'
      });
      localStorage.setItem('platformRevenue', JSON.stringify(platformRevenue));
      
      alert(
        `✅ تم قبول العرض بنجاح!\n\n` +
        `💵 مبلغ العرض: $${offerAmount.toFixed(2)}\n` +
        `📊 عمولة المنصة: $${clientCommission.toFixed(2)}\n` +
        `💰 المبلغ المخصوم: $${totalAmount.toFixed(2)}\n` +
        `🔒 المبلغ محفوظ بأمان حتى إتمام المشروع\n` +
        `💼 رصيدك الجديد: $${newBalance.toFixed(2)}\n\n` +
        `سيتم إشعار المستقل وبدء العمل على المشروع.`
      );
      
      loadProjectAndOffers();
    } catch (error) {
      console.error('Error accepting offer:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'خطأ غير معروف';
      
      alert(`❌ حدث خطأ أثناء قبول العرض.\n\n${errorMessage}\n\nيرجى المحاولة مرة أخرى.`);
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      const offerService = (await import('../../../services/offerService')).default;
      
      if (window.confirm('هل أنت متأكد من رفض هذا العرض؟')) {
        await offerService.rejectOffer(offerId);
        alert('تم رفض العرض');
        loadProjectAndOffers();
      }
    } catch (error) {
      console.error('Error rejecting offer:', error);
      alert('حدث خطأ أثناء رفض العرض');
    }
  };

  const startConversation = (freelancerId) => {
    router.push(`/client/messages?freelancerId=${freelancerId}&projectId=${id}`);
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
              href="/client/projects"
              className="text-primary-500 hover:text-primary-600 font-semibold"
            >
              العودة إلى مشاريعي
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

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/client/projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowRight />
          <span>العودة إلى مشاريعي</span>
        </Link>

        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {project.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {project.subcategory}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
              <FaCheckCircle />
              {project.status === 'open' ? 'مفتوح' : 
               project.status === 'active' ? 'نشط' :
               project.status === 'in_progress' ? 'قيد التنفيذ' :
               project.status === 'delivered' ? 'تم التسليم - في انتظار الموافقة' :
               project.status === 'completed' ? 'مكتمل' :
               project.status === 'cancelled' ? 'ملغي' : project.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
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
              <p className="text-xs text-gray-500 mb-1">العروض المستلمة</p>
              <p className="font-bold text-gray-900 text-primary-600">{offers.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">المشاهدات</p>
              <p className="font-bold text-gray-900 flex items-center gap-1">
                <FaEye className="text-gray-400" />
                {project.views}
              </p>
            </div>
          </div>

          {/* Complete Project Button - Show when project is delivered */}
          {project.status === 'delivered' && (
            <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    تم تسليم المشروع من المستقل
                  </h3>
                  <p className="text-gray-600">
                    يرجى مراجعة العمل المقدم. إذا كان كل شيء على ما يرام، اضغط على "إكمال المشروع" لتحويل المبلغ للمستقل.
                  </p>
                </div>
                <button
                  onClick={handleCompleteProject}
                  disabled={completing}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <FaCheckCircle />
                  {completing ? 'جاري الإكمال...' : 'إكمال المشروع'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'details'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              تفاصيل المشروع
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'offers'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              العروض ({offers.length})
            </button>
            {project?.status === 'completed' && (
              <button
                onClick={() => setActiveTab('review')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'review'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {hasReview ? 'التقييم' : 'قيم المستقل'}
              </button>
            )}
          </div>

          <div className="p-8">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">وصف المشروع</h2>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{project.description}</p>
                </div>

                {project.skills && project.skills.length > 0 && (
                  <div>
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>💡 نصيحة:</strong> راجع العروض المستلمة واختر المستقل الأنسب بناءً على السعر، الوقت، والخبرة.
                  </p>
                </div>
              </div>
            )}

            {/* Offers Tab */}
            {activeTab === 'offers' && (
              <div className="space-y-4">
                {offers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUser className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد عروض بعد</h3>
                    <p className="text-gray-600">عندما يقدم المستقلون عروضهم، ستظهر هنا</p>
                  </div>
                ) : (
                  offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold">
                            {offer.freelancer.name.charAt(0)}
                          </div>
                          <div>
                            <Link
                              href={`/freelancer/${offer.freelancer.id}`}
                              className="block hover:text-primary-600 transition-colors"
                            >
                              <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-primary-600 transition-colors">
                                {offer.freelancer.name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-500" />
                                <span className="font-semibold">{offer.freelancer.rating}</span>
                              </div>
                              <span>•</span>
                              <span>{offer.freelancer.completedProjects} مشروع مكتمل</span>
                              <span>•</span>
                              <Link
                                href={`/freelancer/${offer.freelancer.id}`}
                                className="text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
                              >
                                <FaUser className="text-xs" />
                                عرض الملف الشخصي
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${offer.amount}</p>
                          <p className="text-sm text-gray-600">{offer.duration}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed">{offer.message}</p>
                      </div>

                      {offer.status === 'pending' && (
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleAcceptOffer(offer.id)}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                          >
                            <FaCheckCircle />
                            قبول العرض
                          </button>
                          <button
                            onClick={() => startConversation(offer.freelancer.id)}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center gap-2"
                          >
                            <FaEnvelope />
                            مراسلة
                          </button>
                          <button
                            onClick={() => handleRejectOffer(offer.id)}
                            className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold flex items-center gap-2"
                          >
                            <FaTimesCircle />
                            رفض
                          </button>
                        </div>
                      )}

                      {offer.status === 'accepted' && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700">
                            <FaCheckCircle />
                            <span className="font-semibold">تم قبول هذا العرض</span>
                          </div>
                        </div>
                      )}

                      {offer.status === 'rejected' && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                            <FaTimesCircle />
                            <span className="font-semibold">تم رفض هذا العرض</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Review Tab */}
            {activeTab === 'review' && project?.status === 'completed' && (
              <div className="space-y-6">
                {hasReview ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      تم إرسال التقييم بنجاح
                    </h3>
                    <p className="text-gray-600">
                      شكراً لك على تقييم المستقل. تم حفظ تقييمك بنجاح.
                    </p>
                  </div>
                ) : (
                  <ReviewForm
                    projectId={id}
                    onSuccess={() => {
                      setHasReview(true);
                      setShowReviewForm(false);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

