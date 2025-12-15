import Head from 'next/head';
import Link from 'next/link';
import PublicLayout from '../components/layout/PublicLayout';
import { FaChevronRight, FaFire } from 'react-icons/fa';

export default function TrendingPage() {

  // Trending service categories
  const trendingCategories = [
    {
      id: 1,
      title: 'Publish Your Book',
      image: 'bg-gradient-to-br from-green-700 via-green-600 to-emerald-600',
      services: [
        { name: 'Book Design', href: '/categories/graphics-design' },
        { name: 'Book Editing', href: '/categories/writing-translation/proofreading-editing' },
        { name: 'Book & eBook Marketing', href: '/categories/digital-marketing/content-marketing' },
        { name: "Children's Book Illustration", href: '/categories/graphics-design/childrens-book' },
        { name: 'Beta Reading', href: '/categories/writing-translation' },
        { name: 'Convert to an E-Book', href: '/categories/writing-translation' },
        { name: 'Book & eBook Writing', href: '/categories/writing-translation/book-ebook-writing' },
      ]
    },
    {
      id: 2,
      title: 'Build Your Brand',
      image: 'bg-gradient-to-br from-orange-800 via-orange-700 to-orange-600',
      services: [
        { name: 'Brand Strategy', href: '/categories/business/brand-identity-strategy' },
        { name: 'Brand Style Guides', href: '/categories/graphics-design/brand-style-guides' },
        { name: 'Social Media Management', href: '/categories/digital-marketing/social-media-marketing' },
        { name: 'Social Media Design', href: '/categories/graphics-design/social-media' },
        { name: 'UGC Videos', href: '/categories/video-animation' },
        { name: 'Video Ads & Commercials', href: '/categories/video-animation/video-ads' },
        { name: 'Paid Social Media', href: '/categories/digital-marketing/social-media-advertising' },
      ]
    },
    {
      id: 3,
      title: 'Find a Job',
      image: 'bg-gradient-to-br from-pink-300 via-rose-300 to-pink-200',
      services: [
        { name: 'Resume Writing', href: '/categories/writing-translation/resume-writing' },
        { name: 'Resume Design', href: '/categories/graphics-design' },
        { name: 'Search & Apply', href: '/categories/business' },
        { name: 'Interview Prep', href: '/categories/business/business-consulting' },
        { name: 'Career Consulting', href: '/categories/business/business-consulting' },
        { name: 'LinkedIn Profiles', href: '/categories/writing-translation/linkedin-profiles' },
      ]
    },
    {
      id: 4,
      title: 'AI Services',
      image: 'bg-gradient-to-br from-green-700 via-emerald-600 to-green-600',
      services: [
        { name: 'AI Websites & Software', href: '/categories/programming-tech' },
        { name: 'AI Mobile Applications', href: '/categories/programming-tech/mobile-apps' },
        { name: 'AI Agents', href: '/categories/programming-tech/automation' },
        { name: 'AI Chatbots', href: '/categories/programming-tech/chatbots' },
        { name: 'AI Technology Consulting', href: '/categories/business/business-consulting' },
        { name: 'Generative Engine Optimization', href: '/categories/digital-marketing/seo' },
      ]
    },
    {
      id: 5,
      title: 'Create Your Website',
      image: 'bg-gradient-to-br from-orange-300 via-rose-300 to-pink-300',
      services: [
        { name: 'E-commerce & Dropshipping', href: '/categories/programming-tech/ecommerce-development' },
        { name: 'Shopify', href: '/categories/programming-tech/shopify' },
        { name: 'WordPress', href: '/categories/programming-tech/wordpress' },
        { name: 'Website Design', href: '/categories/graphics-design/website-design' },
        { name: 'E-Commerce Marketing', href: '/categories/digital-marketing/ecommerce-marketing' },
      ]
    },
  ];

  return (
    <PublicLayout>
      <Head>
        <title>Trending Services | Mahara</title>
        <meta name="description" content="Explore the most popular and trending services on our platform" />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white py-16 overflow-hidden">
        {/* Decorative Pattern - Checkered Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-pink-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-purple-600 rounded-full opacity-20 blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Trending Services
            </h1>
            <p className="text-lg text-white/90 mb-6">
              Popular picks, proven results.
            </p>
            <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-2.5 rounded-md hover:bg-white/20 transition-colors font-medium border border-white/30 flex items-center gap-2 mx-auto">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              How Mahara works
            </button>
          </div>
        </div>
      </div>


      {/* Trending Categories Section */}
      <div className="bg-white py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Explore our trending services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {trendingCategories.map((category) => (
              <div
                key={category.id}
                className="group cursor-pointer"
              >
                {/* Category Card */}
                <div className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all border border-gray-200">
                  {/* Category Header Image */}
                  <div className={`${category.image} h-48 flex items-center justify-center relative overflow-hidden`}>
                    {/* Decorative overlay for some categories */}
                    {category.id === 1 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-40 bg-white/20 backdrop-blur-sm rounded-lg border-2 border-white/40 p-3 transform -rotate-6">
                          <div className="space-y-2">
                            <div className="h-3 bg-white/60 rounded"></div>
                            <div className="h-2 bg-white/40 rounded w-3/4"></div>
                            <div className="h-2 bg-white/40 rounded"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {category.id === 2 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-7xl opacity-40 transform -rotate-12">🎨</div>
                      </div>
                    )}
                    {category.id === 3 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-36 h-44 bg-white/30 backdrop-blur-sm rounded-lg border-2 border-white/50 p-4 transform rotate-3">
                          <div className="space-y-2">
                            <div className="w-full h-24 bg-rose-400/50 rounded"></div>
                            <div className="h-2 bg-white/60 rounded"></div>
                            <div className="h-2 bg-white/60 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {category.id === 4 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-8xl opacity-50">🤖</div>
                      </div>
                    )}
                    {category.id === 5 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-40 bg-white/30 backdrop-blur-sm rounded-lg border-2 border-white/50 p-3 shadow-xl">
                          <div className="space-y-2">
                            <div className="h-8 bg-gradient-to-r from-orange-200 to-pink-200 rounded"></div>
                            <div className="space-y-1">
                              <div className="h-2 bg-white/60 rounded"></div>
                              <div className="h-2 bg-white/60 rounded w-3/4"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {category.title}
                    </h3>
                    <div className="space-y-2">
                      {category.services.map((service, index) => (
                        <Link
                          key={index}
                          href={service.href}
                          className="block text-sm text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Tell us what you need and we'll match you with freelancers perfect for your goal
            </h2>
            <p className="text-base text-gray-600 mb-6 italic">
              I have to build a new website for my ecommerce business.
            </p>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold">
              Complete brief
            </button>
          </div>
        </div>
      </div>

    </PublicLayout>
  );
}

