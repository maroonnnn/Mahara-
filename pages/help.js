import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PublicLayout from '../components/layout/PublicLayout';
import { 
  FaQuestionCircle,
  FaBook,
  FaEnvelope,
  FaComments,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaFileAlt,
  FaVideo,
  FaPhone
} from 'react-icons/fa';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  // FAQ Sections - يمكنك إضافة المزيد لاحقاً
  const faqSections = [
    {
      title: 'Getting Started',
      icon: <FaBook />,
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'You can create an account by clicking on the "Join" button in the header and filling out the registration form.'
        },
        {
          question: 'How do I post a project?',
          answer: 'After logging in, go to your dashboard and click on "New Project" to create and post your project.'
        }
      ]
    },
    {
      title: 'For Clients',
      icon: <FaFileAlt />,
      questions: [
        {
          question: 'How do I hire a freelancer?',
          answer: 'Browse available projects, review freelancer profiles, and send them a message to discuss your project.'
        },
        {
          question: 'How does payment work?',
          answer: 'Payment is processed securely through our wallet system. You can deposit funds and pay freelancers directly.'
        }
      ]
    },
    {
      title: 'For Freelancers',
      icon: <FaVideo />,
      questions: [
        {
          question: 'How do I become a freelancer?',
          answer: 'Register as a freelancer and complete your profile. You can then browse projects and submit offers.'
        },
        {
          question: 'How do I get paid?',
          answer: 'Once a project is completed and approved, funds will be transferred to your wallet. You can withdraw them anytime.'
        }
      ]
    }
  ];

  const helpCategories = [
    {
      title: 'Account & Profile',
      description: 'Learn how to manage your account and profile settings',
      icon: <FaQuestionCircle />,
      link: '#account'
    },
    {
      title: 'Projects & Offers',
      description: 'Everything about creating projects and submitting offers',
      icon: <FaFileAlt />,
      link: '#projects'
    },
    {
      title: 'Payments & Wallet',
      description: 'Understanding payments, deposits, and withdrawals',
      icon: <FaBook />,
      link: '#payments'
    },
    {
      title: 'Messaging',
      description: 'How to communicate with clients and freelancers',
      icon: <FaComments />,
      link: '#messaging'
    }
  ];

  return (
    <PublicLayout>
      <Head>
        <title>Help & Support | Mahara</title>
        <meta name="description" content="Get help and support for using Mahara platform" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help & Support
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to your questions or contact our support team
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                />
              </div>
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {helpCategories.map((category, index) => (
              <Link
                key={index}
                href={category.link}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4 group-hover:bg-primary-200 transition-colors">
                  <div className="text-primary-600 text-xl">
                    {category.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>

          {/* FAQ Sections */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>

            {faqSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="text-primary-600 text-xl">
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {section.questions.map((faq, faqIndex) => {
                    const isOpen = openSection === `${sectionIndex}-${faqIndex}`;
                    return (
                      <div key={faqIndex} className="p-6">
                        <button
                          onClick={() => toggleSection(`${sectionIndex}-${faqIndex}`)}
                          className="w-full flex items-center justify-between text-left"
                        >
                          <h4 className="text-lg font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </h4>
                          {isOpen ? (
                            <FaChevronUp className="text-gray-400 flex-shrink-0" />
                          ) : (
                            <FaChevronDown className="text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="mt-4 text-gray-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Support Section */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Still need help?
              </h2>
              <p className="text-primary-100 mb-8 text-lg">
                Our support team is here to help you. Get in touch with us through any of the following methods.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 mx-auto">
                    <FaEnvelope className="text-2xl" />
                  </div>
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-primary-100 text-sm mb-3">
                    Send us an email and we'll get back to you within 24 hours
                  </p>
                  <a
                    href="mailto:support@mahara.com"
                    className="text-white font-semibold hover:underline"
                  >
                    support@mahara.com
                  </a>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 mx-auto">
                    <FaComments className="text-2xl" />
                  </div>
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-primary-100 text-sm mb-3">
                    Chat with our support team in real-time
                  </p>
                  <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Start Chat
                  </button>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 mx-auto">
                    <FaPhone className="text-2xl" />
                  </div>
                  <h3 className="font-semibold mb-2">Phone Support</h3>
                  <p className="text-primary-100 text-sm mb-3">
                    Call us for immediate assistance
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="text-white font-semibold hover:underline"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Additional Resources
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/terms"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Terms of Service
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="/privacy"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="/about"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

