import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaClock, 
  FaDollarSign, 
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaFileAlt,
  FaHourglassHalf,
  FaEnvelope
} from 'react-icons/fa';

export default function MyOffersPage() {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      // Try to load from API
      const offerService = (await import('../../services/offerService')).default;
      const response = await offerService.getMyOffers();
      setOffers(response.data || mockOffers);
    } catch (error) {
      console.log('API not available, using mock data');
      // Fallback to mock data
      setOffers(mockOffers);
    }
    setLoading(false);
  };

  // Mock data
  const mockOffers = [
    {
      id: 1,
      project: {
        id: 1,
        title: 'تصميم شعار احترافي لشركتي',
        client: {
          name: 'Abdalrhmn bobes',
          rating: 4.8
        }
      },
      amount: 450,
      duration: '5 أيام',
      message: 'مرحباً! لدي خبرة 5 سنوات في تصميم الشعارات. سأصمم لك 3 مفاهيم مختلفة مع مراجعات غير محدودة.',
      status: 'pending',
      createdAt: '2024-01-16',
      views: 12
    },
    {
      id: 2,
      project: {
        id: 2,
        title: 'تطوير موقع إلكتروني للتجارة الإلكترونية',
        client: {
          name: 'Tech Company',
          rating: 5.0
        }
      },
      amount: 2200,
      duration: '30 يوم',
      message: 'يمكنني تطوير متجر إلكتروني متكامل باستخدام React و Node.js مع جميع المميزات المطلوبة.',
      status: 'accepted',
      createdAt: '2024-01-15',
      views: 8,
      acceptedAt: '2024-01-16'
    },
    {
      id: 3,
      project: {
        id: 3,
        title: 'كتابة محتوى تسويقي لموقع الشركة',
        client: {
          name: 'Marketing Agency',
          rating: 4.9
        }
      },
      amount: 280,
      duration: '4 أيام',
      message: 'أنا متخصص في كتابة المحتوى التسويقي وسأقدم محتوى احترافي وجذاب.',
      status: 'rejected',
      createdAt: '2024-01-14',
      views: 5,
      rejectedAt: '2024-01-15'
    },
    {
      id: 4,
      project: {
        id: 4,
        title: 'تصميم واجهة مستخدم لتطبيق جوال',
        client: {
          name: 'Startup Co',
          rating: 4.7
        }
      },
      amount: 800,
      duration: '10 أيام',
      message: 'لدي خبرة واسعة في تصميم UI/UX للتطبيقات. سأقدم تصاميم عصرية وسهلة الاستخدام.',
      status: 'pending',
      createdAt: '2024-01-13',
      views: 20
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: { 
        text: 'قيد المراجعة', 
        color: 'bg-yellow-100 text-yellow-700', 
        icon: <FaHourglassHalf /> 
      },
      accepted: { 
        text: 'مقبول', 
        color: 'bg-green-100 text-green-700', 
        icon: <FaCheckCircle /> 
      },
      rejected: { 
        text: 'مرفوض', 
        color: 'bg-red-100 text-red-700', 
        icon: <FaTimesCircle /> 
      },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${badge.color}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const filteredOffers = offers.filter(offer => {
    if (filter === 'all') return true;
    return offer.status === filter;
  });

  const stats = {
    total: offers.length,
    pending: offers.filter(o => o.status === 'pending').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Head>
          <title>عروضي | Fiverr Clone</title>
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

  return (
    <DashboardLayout>
      <Head>
        <title>عروضي | Fiverr Clone</title>
        <meta name="description" content="My submitted offers" />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">عروضي</h1>
          <p className="text-gray-600">جميع العروض التي قدمتها على المشاريع</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">إجمالي العروض</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">قيد المراجعة</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">مقبولة</p>
            <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">مرفوضة</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-1 p-2">
            {[
              { id: 'all', label: 'الكل', count: stats.total },
              { id: 'pending', label: 'قيد المراجعة', count: stats.pending },
              { id: 'accepted', label: 'مقبولة', count: stats.accepted },
              { id: 'rejected', label: 'مرفوضة', count: stats.rejected },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  filter === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-4">
          {filteredOffers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد عروض</h3>
              <p className="text-gray-600 mb-6">
                {filter !== 'all' 
                  ? `لا توجد عروض ${filter === 'pending' ? 'قيد المراجعة' : filter === 'accepted' ? 'مقبولة' : 'مرفوضة'}`
                  : 'لم تقدم أي عروض بعد'}
              </p>
              <Link
                href="/freelancer/projects"
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
              >
                تصفح المشاريع المتاحة
              </Link>
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Link 
                        href={`/freelancer/projects/${offer.project.id}`}
                        className="flex-1"
                      >
                        <h3 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer">
                          {offer.project.title}
                        </h3>
                      </Link>
                      {getStatusBadge(offer.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                          {offer.project.client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{offer.project.client.name}</p>
                          <p className="text-xs text-gray-500">⭐ {offer.project.client.rating}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-green-600" />
                      <span className="font-semibold text-gray-900">${offer.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-600" />
                      <span>{offer.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEye className="text-gray-400" />
                      <span>{offer.views} مشاهدة</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      تم الإرسال: {offer.createdAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {offer.status === 'accepted' && (
                      <Link
                        href={`/freelancer/messages/${offer.project.id}`}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center gap-2 text-sm"
                      >
                        <FaEnvelope />
                        فتح المحادثة
                      </Link>
                    )}
                    <Link
                      href={`/freelancer/projects/${offer.project.id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm"
                    >
                      عرض المشروع
                    </Link>
                  </div>
                </div>

                {offer.status === 'accepted' && offer.acceptedAt && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      🎉 <strong>تهانينا!</strong> تم قبول عرضك في {offer.acceptedAt}
                    </p>
                  </div>
                )}

                {offer.status === 'rejected' && offer.rejectedAt && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      تم رفض العرض في {offer.rejectedAt}. لا تقلق، هناك الكثير من الفرص الأخرى!
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Tips */}
        {offers.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">💡 نصائح لتحسين فرص قبول عروضك</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• اكتب عروض مخصصة لكل مشروع وتجنب النسخ واللصق</li>
              <li>• اذكر خبراتك السابقة المشابهة للمشروع</li>
              <li>• قدم أسعار تنافسية ومنطقية</li>
              <li>• التزم بمدة تسليم واقعية</li>
              <li>• أظهر اهتمامك بالمشروع واطرح أسئلة توضيحية</li>
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

