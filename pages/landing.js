import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import PublicLayout from '../components/layout/PublicLayout';
import { useLanguage } from '../contexts/LanguageContext';
import { FaSearch, FaCheck, FaStar, FaCode, FaPalette, FaVideo, FaPenNib } from 'react-icons/fa';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { t, language } = useLanguage();

  const popularServices = [
    { key: 'websiteDevelopment', color: 'bg-green-700', image: '💻' },
    { key: 'logoDesign', color: 'bg-orange-600', image: '🎨' },
    { key: 'videoEditing', color: 'bg-pink-600', image: '🎬' },
    { key: 'softwareDevelopment', color: 'bg-green-800', image: '⚙️' },
    { key: 'bookPublishing', color: 'bg-yellow-700', image: '📚' },
    { key: 'architectureInterior', color: 'bg-red-600', image: '🏛️' },
  ];

  const categories = [
    { key: 'programmingTech', icon: '💻' },
    { key: 'graphicsDesign', icon: '🎨' },
    { key: 'digitalMarketing', icon: '📱' },
    { key: 'writingTranslation', icon: '✍️' },
    { key: 'videoAnimation', icon: '🎥' },
  
  ];

  const trustedBy = [
    'Google', 'Netflix', 'Meta', 'PayPal', 'P&G'
  ];

  // What's done on Mahara section
  const maharaProjects = [
    {
      id: 1,
      title: language === 'ar' ? 'تطوير موقع إلكتروني متكامل' : 'Complete Website Development',
      description: language === 'ar' 
        ? 'موقع إلكتروني احترافي للتجارة الإلكترونية مع نظام إدارة محتوى متقدم'
        : 'Professional e-commerce website with advanced content management system',
      category: language === 'ar' ? 'برمجة وتطوير' : 'Programming & Development',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      icon: <FaCode className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: language === 'ar' ? 'تصميم هوية بصرية كاملة' : 'Complete Visual Identity Design',
      description: language === 'ar' 
        ? 'شعار احترافي وكتيب هوية بصرية مع دليل استخدام العلامة التجارية'
        : 'Professional logo and brand identity guide with brand usage manual',
      category: language === 'ar' ? 'تصميم جرافيكي' : 'Graphic Design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      icon: <FaPalette className="w-8 h-8" />,
      color: 'bg-purple-500'
    },
    {
      id: 3,
      title: language === 'ar' ? 'إنتاج فيديو ترويجي احترافي' : 'Professional Promotional Video',
      description: language === 'ar' 
        ? 'فيديو ترويجي عالي الجودة مع مؤثرات بصرية وموسيقى تصويرية'
        : 'High-quality promotional video with visual effects and background music',
      category: language === 'ar' ? 'فيديو ورسوم متحركة' : 'Video & Animation',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop',
      icon: <FaVideo className="w-8 h-8" />,
      color: 'bg-red-500'
    },
    {
      id: 4,
      title: language === 'ar' ? 'كتابة محتوى تسويقي احترافي' : 'Professional Marketing Content',
      description: language === 'ar' 
        ? 'محتوى تسويقي احترافي لوسائل التواصل الاجتماعي وحملات إعلانية'
        : 'Professional marketing content for social media and advertising campaigns',
      category: language === 'ar' ? 'كتابة وترجمة' : 'Writing & Translation',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
      icon: <FaPenNib className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      id: 5,
      title: language === 'ar' ? 'تطوير تطبيق جوال متقدم' : 'Advanced Mobile App Development',
      description: language === 'ar' 
        ? 'تطبيق جوال متكامل لأنظمة iOS و Android مع واجهة مستخدم حديثة'
        : 'Complete mobile app for iOS and Android with modern user interface',
      category: language === 'ar' ? 'برمجة وتطوير' : 'Programming & Development',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      icon: <FaCode className="w-8 h-8" />,
      color: 'bg-indigo-500'
    },
    {
      id: 6,
      title: language === 'ar' ? 'تصميم واجهة مستخدم احترافية' : 'Professional UI/UX Design',
      description: language === 'ar' 
        ? 'تصميم واجهة مستخدم تجريبية كاملة مع نماذج تفاعلية عالية الجودة'
        : 'Complete user interface design with high-quality interactive prototypes',
      category: language === 'ar' ? 'تصميم جرافيكي' : 'Graphic Design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      icon: <FaPalette className="w-8 h-8" />,
      color: 'bg-pink-500'
    },
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
        <title>
          {language === 'ar' 
            ? 'Mahara | منصة الخدمات الحرة - اعثر على المواهب المناسبة'
            : 'Mahara | Freelance Services Marketplace - Find the Right Talent'}
        </title>
        <meta name="description" content={
          language === 'ar'
            ? 'Mahara - منصة عربية لربط المستقلين بالعملاء. ابحث عن خدمات احترافية في البرمجة، التصميم، التسويق، والمزيد'
            : 'Mahara - Arabic platform connecting freelancers with clients. Search for professional services in programming, design, marketing, and more'
        } />
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
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-28 lg:py-32">
            <div className="max-w-full md:max-w-2xl lg:max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                {t('landing.heroTitle')}
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                {t('landing.heroSubtitle')}
              </h1>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-lg overflow-hidden shadow-2xl">
                  <input
                    type="text"
                    placeholder={t('landing.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-gray-800 text-base sm:text-lg focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 transition-colors flex items-center justify-center"
                  >
                    <FaSearch className="text-lg sm:text-2xl" />
                  </button>
                </div>
              </form>

              {/* Popular Tags */}
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 items-center">
                <span className="text-white text-xs sm:text-sm font-medium">{t('landing.popular')}:</span>
                {language === 'ar' 
                  ? ['تطوير المواقع', 'تصميم شعار', 'تحرير فيديو', 'WordPress', 'التسويق الرقمي'].map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm transition-colors whitespace-nowrap"
                      >
                        {tag}
                      </Link>
                    ))
                  : ['Website Development', 'Logo Design', 'Video Editing', 'WordPress', 'Digital Marketing'].map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm transition-colors whitespace-nowrap"
                      >
                        {tag}
                      </Link>
                    ))
                }
              </div>
            </div>
          </div>

          {/* Trusted By Section */}
          <div className="relative bg-white bg-opacity-10 backdrop-blur-sm border-t border-white border-opacity-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 flex-wrap">
                <span className="text-white text-xs sm:text-sm opacity-80 font-medium">{t('landing.trustedBy')}:</span>
                {trustedBy.map((company) => (
                  <span key={company} className="text-white font-semibold text-sm sm:text-base md:text-lg opacity-90">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-gray-50 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.key}
                  href={`/categories/${category.key.toLowerCase().replace(/([A-Z])/g, '-$1')}`}
                  className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
                >
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-primary-600 leading-tight">
                    {t(`categories.${category.key}`)}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Services Section */}
        <div className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">{t('landing.popularServices')}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {popularServices.map((service) => (
                <Link
                  key={service.key}
                  href={`/search?q=${encodeURIComponent(t(`services.${service.key}`))}`}
                  className={`${service.color} rounded-lg p-5 sm:p-6 text-white hover:opacity-90 transition-opacity group`}
                >
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    {service.image}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold">{t(`services.${service.key}`)}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* How Mahara Works Section */}
        <div className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
              {t('landing.howMaharaWorks')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center px-4">
                <div className="bg-primary-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FaSearch className="text-2xl sm:text-3xl text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{t('landing.step1Title')}</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t('landing.step1Desc')}
                </p>
              </div>

              <div className="text-center px-4">
                <div className="bg-primary-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FaCheck className="text-2xl sm:text-3xl text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{t('landing.step2Title')}</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t('landing.step2Desc')}
                </p>
              </div>

              <div className="text-center px-4">
                <div className="bg-primary-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FaStar className="text-2xl sm:text-3xl text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{t('landing.step3Title')}</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t('landing.step3Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Done on Mahara Section */}
        <div className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'ماذا يُنجز على Mahara؟' : 'What\'s Done on Mahara?'}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'ar' 
                  ? 'اكتشف مجموعة من المشاريع الاحترافية التي تم إنجازها بنجاح على منصتنا'
                  : 'Discover a collection of professional projects successfully completed on our platform'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {maharaProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Project Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className={`absolute top-4 right-4 ${project.color} text-white p-3 rounded-full shadow-lg`}>
                      {project.icon}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <span className="text-white text-sm font-semibold bg-primary-500 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                  10K+
                </div>
                <div className="text-gray-600 text-sm sm:text-base">
                  {language === 'ar' ? 'مشروع مكتمل' : 'Completed Projects'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                  5K+
                </div>
                <div className="text-gray-600 text-sm sm:text-base">
                  {language === 'ar' ? 'مستقل محترف' : 'Professional Freelancers'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                  8K+
                </div>
                <div className="text-gray-600 text-sm sm:text-base">
                  {language === 'ar' ? 'عميل راضٍ' : 'Satisfied Clients'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                  98%
                </div>
                <div className="text-gray-600 text-sm sm:text-base">
                  {language === 'ar' ? 'معدل الرضا' : 'Satisfaction Rate'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
              {t('landing.whatClientsSay')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm sm:text-base" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 italic">
                  "{t('landing.testimonial1')}"
                </p>
                <p className="text-xs sm:text-sm text-gray-500">- {language === 'ar' ? 'مؤسس شركة ناشئة' : 'Startup Founder'}</p>
              </div>

              <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm sm:text-base" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 italic">
                  "{t('landing.testimonial2')}"
                </p>
                <p className="text-xs sm:text-sm text-gray-500">- {language === 'ar' ? 'مدير تسويق' : 'Marketing Manager'}</p>
              </div>

              <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm sm:text-base" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 italic">
                  "{t('landing.testimonial3')}"
                </p>
                <p className="text-xs sm:text-sm text-gray-500">- {language === 'ar' ? 'صاحب مشروع' : 'Project Owner'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Become a Seller */}
        <div className="py-12 sm:py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t('landing.becomeSellerTitle')}</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90">
              {t('landing.becomeSellerDesc')}
            </p>
            <Link
              href="/become-seller"
              className="inline-block bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors"
            >
              {t('landing.becomeSellerBtn')}
            </Link>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="py-16 sm:py-20 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">{t('landing.readyToStart')}</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-300">
              {t('landing.readyToStartDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors text-center"
              >
                {t('landing.createAccount')}
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors text-center"
              >
                {t('landing.signIn')}
              </Link>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}

