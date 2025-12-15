import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PublicLayout from '../../components/layout/PublicLayout';
import PortfolioGrid from '../../components/portfolio/PortfolioGrid';
import { portfolioService } from '../../services/portfolioService';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  FaStar, 
  FaCheckCircle, 
  FaGlobe, 
  FaLinkedin, 
  FaGithub,
  FaSpinner,
  FaImage,
  FaEnvelope
} from 'react-icons/fa';

export default function SellerProfilePage() {
  const router = useRouter();
  const { username } = router.query;
  const { language } = useLanguage();
  const [seller, setSeller] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);

  useEffect(() => {
    if (username) {
      fetchSellerData();
    }
  }, [username]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      
      // Try to load seller profile data from localStorage (from onboarding)
      const profileData = localStorage.getItem('sellerProfile');
      let sellerInfo = {
        id: 1,
        username: username,
        name: 'Aylar Abdiyeva',
        title: '3D Interior Designer & Architect',
        bio: 'Professional 3D interior designer with 5+ years of experience in creating stunning interior designs and realistic 3D renderings.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        rating: 4.9,
        reviews: 137,
        completedProjects: 89,
        responseTime: '4 Hrs',
        badges: ['Vetted Pro', 'Level 2', 'Top Rated'],
        skills: ['3D Modeling', 'Interior Design', 'Architectural Visualization', 'VRay Rendering'],
        location: 'New York, USA',
        joinedDate: '2020-01-15',
        website: 'https://aylarabdiyeva.com',
        linkedin: 'https://linkedin.com/in/aylarabdiyeva',
        github: 'https://github.com/aylarabdiyeva'
      };
      
      // If profile data exists, merge it with default data
      if (profileData) {
        const profile = JSON.parse(profileData);
        sellerInfo = {
          ...sellerInfo,
          name: profile.personalInfo.fullName || sellerInfo.name,
          title: profile.professionalInfo.occupation || sellerInfo.title,
          bio: profile.personalInfo.description || sellerInfo.bio,
          avatar: profile.personalInfo.profilePicture || sellerInfo.avatar,
          skills: profile.professionalInfo.skills || sellerInfo.skills,
          website: profile.professionalInfo.personalWebsite || sellerInfo.website,
          languages: profile.personalInfo.languages || [],
          education: profile.professionalInfo.education || [],
          certifications: profile.professionalInfo.certification || [],
        };
      }
      
      const mockSeller = sellerInfo;

      // Mock portfolio data
      const mockPortfolio = [
        {
          id: 1,
          title: 'Modern Interior Design',
          description: 'A beautiful modern interior design for a luxury apartment',
          image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          project_url: 'https://example.com',
          technologies: ['3D Max', 'Photoshop', 'VRay'],
          category: 'Interior Design',
          completed_date: '2024-01-15'
        },
        {
          id: 2,
          title: 'Luxury Kitchen Design',
          description: 'High-end kitchen design with custom cabinetry',
          image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          project_url: 'https://example.com',
          technologies: ['3D Max', 'VRay', 'AutoCAD'],
          category: 'Interior Design',
          completed_date: '2024-02-20'
        },
        {
          id: 3,
          title: 'Contemporary Bedroom',
          description: 'Modern bedroom design with minimalist approach',
          image_url: 'https://images.unsplash.com/photo-1556912173-0e02237a6743?w=800&h=600&fit=crop',
          project_url: 'https://example.com',
          technologies: ['3D Max', 'Photoshop'],
          category: 'Interior Design',
          completed_date: '2024-03-10'
        },
      ];

      setSeller(mockSeller);
      setPortfolioItems(mockPortfolio);
      
      // In a real app:
      // const sellerData = await api.get(`/sellers/${username}`);
      // const portfolioData = await portfolioService.getPortfolio(sellerData.id);
      // setSeller(sellerData);
      // setPortfolioItems(portfolioData.portfolio_items || []);
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <FaSpinner className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      </PublicLayout>
    );
  }

  if (!seller) {
    return (
      <PublicLayout>
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'البائع غير موجود' : 'Seller Not Found'}
          </h1>
          <Link href="/" className="text-primary-500 hover:text-primary-600">
            {language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{seller.name} - {language === 'ar' ? 'ملف البائع' : 'Seller Profile'} | Mahara</title>
        <meta name="description" content={seller.bio} />
      </Head>

      <PublicLayout>
        <div className="bg-gray-50 min-h-screen">
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200">
            <div className="container-custom py-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-primary-300 flex items-center justify-center text-primary-700 text-4xl font-bold overflow-hidden">
                    {seller.avatar ? (
                      <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
                    ) : (
                      seller.name.charAt(0)
                    )}
                  </div>
                </div>

                {/* Seller Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
                    {seller.badges.map((badge, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="text-xl text-gray-600 mb-4">{seller.title}</p>
                  <p className="text-gray-700 mb-4">{seller.bio}</p>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(seller.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-900">{seller.rating}</span>
                      <span className="text-gray-600">({seller.reviews} {language === 'ar' ? 'مراجعة' : 'reviews'})</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-semibold text-gray-900">{seller.completedProjects}</span> {language === 'ar' ? 'مشروع مكتمل' : 'completed projects'}
                    </div>
                    <div className="text-gray-600">
                      {language === 'ar' ? 'وقت الاستجابة' : 'Response time'}: <span className="font-semibold text-gray-900">{seller.responseTime}</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-4">
                    {seller.website && (
                      <a
                        href={seller.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary-500"
                      >
                        <FaGlobe className="w-5 h-5" />
                      </a>
                    )}
                    {seller.linkedin && (
                      <a
                        href={seller.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary-500"
                      >
                        <FaLinkedin className="w-5 h-5" />
                      </a>
                    )}
                    {seller.github && (
                      <a
                        href={seller.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary-500"
                      >
                        <FaGithub className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  <Link
                    href={`/messages?seller=${seller.username}`}
                    className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
                  >
                    <FaEnvelope />
                    <span>{language === 'ar' ? 'تواصل معي' : 'Contact Me'}</span>
                  </Link>
                </div>
              </div>

              {/* Skills */}
              {seller.skills && seller.skills.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    {language === 'ar' ? 'المهارات' : 'Skills'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {seller.skills.map((skill, index) => (
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
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="container-custom py-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'محفظة الأعمال' : 'Portfolio'}
              </h2>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'استكشف أعمالي السابقة'
                  : 'Explore my previous work'
                }
              </p>
            </div>

            <PortfolioGrid 
              portfolioItems={portfolioItems}
              onItemClick={(item) => setSelectedPortfolioItem(item)}
            />
          </div>

          {/* Portfolio Item Modal */}
          {selectedPortfolioItem && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedPortfolioItem(null)}
            >
              <div 
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <img
                    src={selectedPortfolioItem.image_url}
                    alt={selectedPortfolioItem.title}
                    className="w-full h-auto"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedPortfolioItem.title}
                  </h3>
                  {selectedPortfolioItem.description && (
                    <p className="text-gray-700 mb-4">{selectedPortfolioItem.description}</p>
                  )}
                  {selectedPortfolioItem.project_url && (
                    <a
                      href={selectedPortfolioItem.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:text-primary-600 font-semibold"
                    >
                      {language === 'ar' ? 'عرض المشروع' : 'View Project'} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </PublicLayout>
    </>
  );
}

