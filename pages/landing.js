import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import PublicLayout from '../components/layout/PublicLayout';
import { FaSearch, FaCheck, FaStar } from 'react-icons/fa';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const popularServices = [
    { title: 'Website Development', color: 'bg-green-700', image: '💻' },
    { title: 'Logo Design', color: 'bg-orange-600', image: '🎨' },
    { title: 'Video Editing', color: 'bg-pink-600', image: '🎬' },
    { title: 'Software Development', color: 'bg-green-800', image: '⚙️' },
    { title: 'Book Publishing', color: 'bg-yellow-700', image: '📚' },
    { title: 'Architecture & Interior Design', color: 'bg-red-600', image: '🏛️' },
  ];

  const categories = [
    { name: 'Programming & Tech', icon: '💻' },
    { name: 'Graphics & Design', icon: '🎨' },
    { name: 'Digital Marketing', icon: '📱' },
    { name: 'Writing & Translation', icon: '✍️' },
    { name: 'Video & Animation', icon: '🎥' },
    { name: 'AI Services', icon: '🤖' },
    { name: 'Music & Audio', icon: '🎵' },
    { name: 'Business', icon: '💼' },
    { name: 'Consulting', icon: '📊' },
  ];

  const trustedBy = [
    'Google', 'Netflix', 'Meta', 'PayPal', 'P&G'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <Head>
        <title>Mahara | منصة الخدمات الحرة - اعثر على المواهب المناسبة</title>
        <meta name="description" content="Mahara - منصة عربية لربط المستقلين بالعملاء. ابحث عن خدمات احترافية في البرمجة، التصميم، التسويق، والمزيد" />
      </Head>

      <PublicLayout>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80')"
            }}
          ></div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                المستقلون لدينا
                <br />
                سيأخذونها من هنا
              </h1>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-2xl">
                  <input
                    type="text"
                    placeholder="ابحث عن أي خدمة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-6 py-4 text-gray-800 text-lg focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 transition-colors"
                  >
                    <FaSearch className="text-2xl" />
                  </button>
                </div>
              </form>

              {/* Popular Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-white text-sm">شائع:</span>
                {['تطوير المواقع', 'تصميم شعار', 'تحرير فيديو', 'WordPress', 'التسويق الرقمي'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-1 rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Trusted By Section */}
          <div className="relative bg-white bg-opacity-10 backdrop-blur-sm border-t border-white border-opacity-20">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <span className="text-white text-sm opacity-80">موثوق من قبل:</span>
                {trustedBy.map((company) => (
                  <span key={company} className="text-white font-semibold text-lg opacity-90">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 group-hover:text-primary-600">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Services Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">الخدمات الشائعة</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularServices.map((service) => (
                <Link
                  key={service.title}
                  href={`/search?q=${encodeURIComponent(service.title)}`}
                  className={`${service.color} rounded-lg p-6 text-white hover:opacity-90 transition-opacity group`}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {service.image}
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* How Mahara Works Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              كيف تعمل Mahara
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-3xl text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">ابحث عن الخدمة المناسبة</h3>
                <p className="text-gray-600">
                  تصفح آلاف الخدمات الاحترافية واختر ما يناسب احتياجاتك
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-3xl text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">اطلب بثقة</h3>
                <p className="text-gray-600">
                  تواصل مع المستقل واطلب الخدمة بنظام دفع آمن ومحمي
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-3xl text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">احصل على نتيجة ممتازة</h3>
                <p className="text-gray-600">
                  استلم عملك المنجز بجودة عالية في الوقت المحدد
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              ماذا يقول عملاؤنا
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "الناس يحبون شعارنا، ونحن نحب Mahara."
                </p>
                <p className="text-sm text-gray-500">- مؤسس شركة ناشئة</p>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Mahara مورد رائع لأي شخص في مجال الشركات الناشئة."
                </p>
                <p className="text-sm text-gray-500">- مدير تسويق</p>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Mahara يمكّنني من إنجاز الأمور بسرعة وكفاءة."
                </p>
                <p className="text-sm text-gray-500">- صاحب مشروع</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Become a Seller */}
        <div className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">انضم كمستقل الآن</h2>
            <p className="text-xl mb-8 opacity-90">
              ابدأ في تقديم خدماتك واكسب المال من مهاراتك
            </p>
            <Link
              href="/become-seller"
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              ابدأ البيع على Mahara
            </Link>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="py-20 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">جاهز للبدء؟</h2>
            <p className="text-xl mb-8 text-gray-300">
              انضم إلى آلاف المستخدمين واكتشف المواهب المناسبة لمشروعك
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                إنشاء حساب
              </Link>
              <Link
                href="/login"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}

