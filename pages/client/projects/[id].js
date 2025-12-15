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

export default function ClientProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isClient, isFreelancer, isAuthenticated, loading: authLoading } = useAuth();
  const [project, setProject] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

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
    }
  }, [authLoading, id, isAuthenticated, isClient, isFreelancer]);

  const loadProjectAndOffers = async () => {
    try {
      const projectService = (await import('../../../services/projectService')).default;
      const offerService = (await import('../../../services/offerService')).default;
      
      // Load project details
      const projectResponse = await projectService.getProject(id);
      setProject(projectResponse.data || mockProject);
      
      // Load offers for this project
      const offersResponse = await offerService.getProjectOffers(id);
      setOffers(offersResponse.data || mockOffers);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading project:', error);
      // Fallback to mock data
      setProject(mockProject);
      setOffers(mockOffers);
      setLoading(false);
    }
  };

  // Mock data
  const mockProject = {
    id: parseInt(id),
    title: 'تصميم شعار احترافي لشركتي',
    category: 'Graphics & Design',
    subcategory: 'Logo Design',
    budget: 500,
    budgetType: 'fixed',
    deliveryTime: '7 days',
    status: 'open',
    description: 'أحتاج إلى تصميم شعار احترافي يعكس هوية شركتي في مجال التكنولوجيا. يجب أن يكون عصري وبسيط ويمكن استخدامه في مختلف الوسائط.',
    skills: ['Photoshop', 'Illustrator', 'Logo Design'],
    createdAt: '2024-01-15',
    views: 45
  };

  const mockOffers = [
    {
      id: 1,
      freelancer: {
        id: 1,
        name: 'Ahmed Mohamed',
        rating: 4.9,
        completedProjects: 127,
        avatar: null
      },
      amount: 450,
      duration: '5 days',
      message: 'مرحباً! لدي خبرة 5 سنوات في تصميم الشعارات. سأصمم لك 3 مفاهيم مختلفة مع مراجعات غير محدودة حتى تحصل على التصميم المثالي.',
      status: 'pending',
      createdAt: '2024-01-16'
    },
    {
      id: 2,
      freelancer: {
        id: 2,
        name: 'Sara Ali',
        rating: 5.0,
        completedProjects: 89,
        avatar: null
      },
      amount: 500,
      duration: '7 days',
      message: 'أهلاً! أنا متخصصة في تصميم الهوية البصرية للشركات. سأقدم لك شعار فريد مع دليل الاستخدام وملفات بجميع الصيغ المطلوبة.',
      status: 'pending',
      createdAt: '2024-01-16'
    },
    {
      id: 3,
      freelancer: {
        id: 3,
        name: 'Omar Hassan',
        rating: 4.7,
        completedProjects: 215,
        avatar: null
      },
      amount: 380,
      duration: '4 days',
      message: 'مرحباً! يمكنني تسليم شعار احترافي وعصري خلال 4 أيام. لدي محفظة واسعة من تصاميم الشعارات في مجال التكنولوجيا.',
      status: 'pending',
      createdAt: '2024-01-17'
    }
  ];

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
      
      // Accept offer via API
      await offerService.acceptOffer(offerId);
      
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
      alert('❌ حدث خطأ أثناء قبول العرض. يرجى المحاولة مرة أخرى.');
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
              {project.status === 'open' ? 'مفتوح' : project.status}
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
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {offer.freelancer.name}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-500" />
                                <span className="font-semibold">{offer.freelancer.rating}</span>
                              </div>
                              <span>•</span>
                              <span>{offer.freelancer.completedProjects} مشروع مكتمل</span>
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

