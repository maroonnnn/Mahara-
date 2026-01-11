import Head from 'next/head';
import Link from 'next/link';
import PublicLayout from '../components/layout/PublicLayout';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';
import { 
  FaSearch,
  FaHandshake,
  FaCheckCircle
} from 'react-icons/fa';

export default function BecomeSellerPage() {
  const { isAuthenticated, user } = useAuth();
  const { language, isRTL } = useLanguage();
  const [imageErrors, setImageErrors] = useState({});
  const [roleImageErrors, setRoleImageErrors] = useState({});

  const steps = [
    {
      icon: <FaSearch className="w-12 h-12" />,
      title: language === 'ar' ? 'تصفح المشاريع' : 'Browse Projects',
      description: language === 'ar' 
        ? 'استكشف المشاريع المتاحة من العملاء، ابحث عن المشاريع التي تناسب مهاراتك وخبرتك.'
        : 'Explore available projects from clients, search for projects that match your skills and expertise.'
    },
    {
      icon: <FaHandshake className="w-12 h-12" />,
      title: language === 'ar' ? 'قدم عرضك' : 'Submit Your Offer',
      description: language === 'ar' 
        ? 'قدم عرضاً تنافسياً يتضمن السعر والوقت المطلوب. تواصل مع العملاء واجب على أسئلتهم.'
        : 'Submit a competitive offer with your price and timeline. Communicate with clients and answer their questions.'
    },
    {
      icon: <FaCheckCircle className="w-12 h-12" />,
      title: language === 'ar' ? 'أكمل المشروع واحصل على الدفع' : 'Complete & Get Paid',
      description: language === 'ar' 
        ? 'بعد قبول عرضك، أكمل المشروع بجودة عالية. احصل على الدفع مباشرة في محفظتك بعد إتمام العمل.'
        : 'After your offer is accepted, complete the project with high quality. Get paid directly to your wallet upon completion.'
    },
  ];

  const communityRoles = [
    {
      title: language === 'ar' ? 'أنا مصمم' : 'I am a Designer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      initial: 'D'
    },
    {
      title: language === 'ar' ? 'أنا مطور' : 'I am a Developer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      initial: 'D'
    },
    {
      title: language === 'ar' ? 'أنا محرر فيديو' : 'I am a Video Editor',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      initial: 'V'
    },
    {
      title: language === 'ar' ? 'أنا موسيقي' : 'I am a Musician',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      initial: 'M'
    },
    {
      title: language === 'ar' ? 'أنا فنان صوتيات' : 'I am a Voiceover Artist',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      initial: 'V'
    },
  ];

  const buyerStories = [
    {
      name: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
      role: language === 'ar' ? 'رائد أعمال' : 'Entrepreneur',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      initial: 'A',
      text: language === 'ar' 
        ? 'وجدت أفضل المطورين لمشروعي على Mahara. النظام سهل والدفع آمن.'
        : 'Found the best developers for my project on Mahara. The system is easy and payments are secure.'
    },
    {
      name: language === 'ar' ? 'سارة علي' : 'Sara Ali',
      role: language === 'ar' ? 'مديرة تسويق' : 'Marketing Manager',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      initial: 'S',
      text: language === 'ar' 
        ? 'استخدمت Mahara لتوظيف مصمم جرافيكي لعلامتنا التجارية. النتيجة كانت رائعة!'
        : 'Used Mahara to hire a graphic designer for our brand. The result was amazing!'
    },
    {
      name: language === 'ar' ? 'خالد حسن' : 'Khalid Hassan',
      role: language === 'ar' ? 'مؤسس شركة ناشئة' : 'Startup Founder',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      initial: 'K',
      text: language === 'ar' 
        ? 'Mahara ساعدني في إيجاد مواهب محترفة بأسعار معقولة. أنصح به بشدة.'
        : 'Mahara helped me find professional talent at reasonable prices. Highly recommended.'
    },
    {
      name: language === 'ar' ? 'فاطمة إبراهيم' : 'Fatima Ibrahim',
      role: language === 'ar' ? 'مديرة مشروع' : 'Project Manager',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      initial: 'F',
      text: language === 'ar' 
        ? 'التواصل مع المستقلين سلس وسريع. حصلت على ما أردته في الوقت المحدد.'
        : 'Communication with freelancers is smooth and fast. Got exactly what I needed on time.'
    },
    {
      name: language === 'ar' ? 'محمد عبدالله' : 'Mohammed Abdullah',
      role: language === 'ar' ? 'رجل أعمال' : 'Business Owner',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      initial: 'M',
      text: language === 'ar' 
        ? 'منصة Mahara وفرت لي الوقت والجهد في البحث عن المواهب المناسبة لمشاريعي.'
        : 'Mahara platform saved me time and effort in finding the right talent for my projects.'
    },
    {
      name: language === 'ar' ? 'نورا سالم' : 'Nora Salem',
      role: language === 'ar' ? 'مستشارة أعمال' : 'Business Consultant',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
      initial: 'N',
      text: language === 'ar' 
        ? 'جودة العمل المقدم من المستقلين على Mahara ممتازة. سأستخدمها دائماً.'
        : 'The quality of work from freelancers on Mahara is excellent. I\'ll always use it.'
    },
  ];

  return (
    <>
      <Head>
        <title>{language === 'ar' ? 'كن بائعاً - Mahara' : 'Become a Seller - Mahara'}</title>
        <meta name="description" content={language === 'ar' ? 'ابدأ بيع خدماتك على Mahara واكتسب المال من مهاراتك' : 'Start selling your services on Mahara and make money from your skills'} />
      </Head>

      <PublicLayout>
        <div className="bg-white">
          {/* Hero Section */}
          <div className="relative bg-gray-900 text-white overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop)',
                filter: 'blur(3px)'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/80"></div>
            <div className="relative container-custom py-24 md:py-32">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  {language === 'ar' ? 'اعمل بطريقتك' : 'Work Your Way'}
                </h1>
                <p className="text-2xl md:text-3xl mb-10 text-gray-200">
                  {language === 'ar' 
                    ? 'أنت تجلب المهارة. نحن نجعل الكسب سهلاً.'
                    : 'You bring the skill. We\'ll make earning easy.'
                  }
                </p>
                {isAuthenticated ? (
                  <Link 
                    href="/seller/onboarding"
                    className="inline-block bg-primary-500 text-white px-10 py-5 rounded-lg font-semibold text-xl hover:bg-primary-600 transition-colors"
                  >
                    {language === 'ar' ? 'كن بائعاً' : 'Become a Seller'}
                  </Link>
                ) : (
                  <Link 
                    href="/seller/onboarding"
                    className="inline-block bg-primary-500 text-white px-10 py-5 rounded-lg font-semibold text-xl hover:bg-primary-600 transition-colors"
                  >
                    {language === 'ar' ? 'كن بائعاً' : 'Become a Seller'}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-white border-b border-gray-200">
            <div className="container-custom py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-gray-600 text-sm mb-2">
                    {language === 'ar' ? 'يتم شراء خدمة كل' : 'A Gig is Bought Every'}
                  </div>
                  <div className="text-4xl font-bold text-primary-600">4 SEC</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 text-sm mb-2">
                    {language === 'ar' ? 'المعاملات' : 'Transactions'}
                  </div>
                  <div className="text-4xl font-bold text-primary-600">50M+</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 text-sm mb-2">
                    {language === 'ar' ? 'نطاق السعر' : 'Price Range'}
                  </div>
                  <div className="text-4xl font-bold text-primary-600">$5 - $10,000</div>
                </div>
              </div>
            </div>
          </div>

          {/* Freelance Community Section */}
          <div className="bg-white py-20">
            <div className="container-custom">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
                {language === 'ar' ? 'انضم إلى مجتمعنا المتنامي للعمل الحر' : 'Join our growing freelance community'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {communityRoles.map((role, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200">
                      {roleImageErrors[index] ? (
                        <div className="absolute inset-0 bg-primary-500 flex items-center justify-center">
                          <span className="text-white text-4xl font-bold">{role.initial}</span>
                        </div>
                      ) : (
                        <img 
                          src={role.image}
                          alt={role.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={() => setRoleImageErrors(prev => ({ ...prev, [index]: true }))}
                        />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6">
                        <p className="text-white font-semibold text-lg">{role.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {/* CTA Card */}
                <div className="relative group cursor-pointer">
                  <Link href="/seller/onboarding" className="block">
                    <div className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center p-8 hover:border-primary-500 hover:bg-primary-50 transition-all group">
                      <p className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600">
                        {language === 'ar' ? 'ما هي مهارتك؟' : 'What\'s Your Skill?'}
                      </p>
                      <span className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-primary-600 transition-colors">
                        {language === 'ar' ? 'كن بائعاً' : 'Become a Seller'}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="container-custom py-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
              {language === 'ar' ? 'كيف يعمل' : 'How it works'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-start">
                  <div className="text-primary-500 mb-6">{step.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Buyer Stories Section */}
          <div className="container-custom py-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
              {language === 'ar' ? 'قصص المشترين' : 'Buyer stories'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buyerStories.map((story, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      {imageErrors[index] ? (
                        <div className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-xl font-bold">
                          {story.initial}
                        </div>
                      ) : (
                        <img 
                          src={story.avatar} 
                          alt={story.name}
                          className="w-16 h-16 rounded-full object-cover"
                          onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-900 text-base mb-4 leading-relaxed">
                    "{story.text}"
                  </p>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="font-semibold text-gray-900 text-sm">{story.name}</p>
                    <p className="text-gray-600 text-xs">{story.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary-500 text-white py-16">
            <div className="container-custom text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'ar' ? 'جاهز للبدء؟' : 'Ready to Get Started?'}
              </h2>
              {isAuthenticated ? (
                <Link 
                  href="/seller/onboarding"
                  className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors mt-6"
                >
                  <span>{language === 'ar' ? 'ابدأ الآن' : 'Get Started'}</span>
                </Link>
              ) : (
                <Link 
                  href="/register?role=seller"
                  className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors mt-6"
                >
                  <span>{language === 'ar' ? 'سجل مجاناً' : 'Sign Up Free'}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}

