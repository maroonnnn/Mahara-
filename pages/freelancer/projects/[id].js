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
  FaFileAlt,
  FaUser,
  FaCheckCircle,
  FaEnvelope,
  FaPaperPlane
} from 'react-icons/fa';

export default function FreelancerProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isClient, isFreelancer, isAuthenticated, loading: authLoading } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
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

    // Role-based access control
    if (!isAuthenticated) {
      alert('يجب تسجيل الدخول أولاً');
      router.push('/login');
      return;
    }

    if (isClient) {
      alert('❌ هذه الصفحة للمستقلين (البائعين) فقط.\n\nكعميل، يمكنك عرض مشروعك ومراجعة العروض من لوحة التحكم.');
      router.push('/client/projects');
      return;
    }

    if (!isFreelancer) {
      alert('❌ فقط المستقلين يمكنهم تقديم عروض على المشاريع.');
      router.push('/');
      return;
    }

    if (id) {
      loadProject();
      checkExistingOffer();
    }
  }, [authLoading, id, isAuthenticated, isClient, isFreelancer]);

  const loadProject = async () => {
    try {
      // Mock data - Replace with actual API call
      const mockProject = {
        id: parseInt(id),
        title: 'تصميم شعار احترافي لشركتي',
        category: 'Graphics & Design',
        subcategory: 'Logo Design',
        budget: 500,
        budgetType: 'fixed',
        deliveryTime: '7 days',
        status: 'open',
        description: 'أحتاج إلى تصميم شعار احترافي يعكس هوية شركتي في مجال التكنولوجيا. يجب أن يكون عصري وبسيط ويمكن استخدامه في مختلف الوسائط. أريد أن يكون الشعار قابلاً للتطبيق على الموقع الإلكتروني والبطاقات والمواد التسويقية.',
        skills: ['Photoshop', 'Illustrator', 'Logo Design'],
        createdAt: '2024-01-15',
        client: {
          id: 1,
          name: 'Abdalrhmn bobes',
          rating: 4.8,
          completedProjects: 15
        }
      };

      setProject(mockProject);
      setLoading(false);
    } catch (error) {
      console.error('Error loading project:', error);
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
    
    try {
      const offerService = (await import('../../../services/offerService')).default;
      
      // Prepare offer data
      const offerPayload = {
        project_id: parseInt(id),
        amount: parseFloat(offerData.amount),
        duration: `${offerData.duration} ${offerData.durationUnit}`,
        message: offerData.message,
        status: 'pending'
      };
      
      console.log('Submitting offer:', offerPayload);
      
      // Submit offer to API
      const response = await offerService.submitOffer(offerPayload);
      
      setOfferSubmitted(true);
      setShowOfferForm(false);
      alert('تم تقديم العرض بنجاح! سيتم إشعار العميل وسيتمكن من رؤية عرضك في صفحة العروض.');
    } catch (error) {
      console.error('Error submitting offer:', error);
      alert('حدث خطأ أثناء تقديم العرض. يرجى المحاولة مرة أخرى.');
    }
  };

  const startConversation = async () => {
    try {
      // Check if conversation exists, if not create one
      // Mock - In real app, call messageService.startConversation()
      router.push(`/freelancer/messages?projectId=${id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Head>
          <title>تفاصيل المشروع | Fiverr Clone</title>
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
          <title>المشروع غير موجود | Fiverr Clone</title>
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
        <title>{project.title} | Fiverr Clone</title>
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
                {project.status === 'open' ? 'مفتوح' : project.status}
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
          ) : (
            <div className="flex gap-3">
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
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

