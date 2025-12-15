import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaPinterest, 
  FaGlobe,
  FaChevronDown,
  FaUniversalAccess
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { language, changeLanguage } = useLanguage();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const languageRef = useRef(null);
  const currencyRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setCurrencyOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Section */}
      <div className="container-custom py-12 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Categories Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/categories/graphics-design" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Graphics & Design
                </Link>
              </li>
              <li>
                <Link href="/categories/digital-marketing" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="/categories/writing-translation" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Writing & Translation
                </Link>
              </li>
              <li>
                <Link href="/categories/video-animation" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Video & Animation
                </Link>
              </li>
              <li>
                <Link href="/categories/music-audio" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Music & Audio
                </Link>
              </li>
              <li>
                <Link href="/categories/programming-tech" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Programming & Tech
                </Link>
              </li>
              <li>
                <Link href="/categories/ai-services" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  AI Services
                </Link>
              </li>
              <li>
                <Link href="/categories/consulting" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Consulting
                </Link>
              </li>
              <li>
                <Link href="/categories/data" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Data
                </Link>
              </li>
              <li>
                <Link href="/categories/business" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/categories/personal-growth" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Personal Growth & Hobbies
                </Link>
              </li>
              <li>
                <Link href="/categories/photography" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Photography
                </Link>
              </li>
              <li>
                <Link href="/categories/finance" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Finance
                </Link>
              </li>
              <li>
                <Link href="/categories/end-to-end-projects" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  End-to-End Projects
                </Link>
              </li>
              <li>
                <Link href="/categories/service-catalog" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Service Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* For Clients Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">For Clients</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  How Mahara Works
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Customer Success Stories
                </Link>
              </li>
              <li>
                <Link href="/trust-safety" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link href="/quality-guide" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Quality Guide
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Mahara Guides
                </Link>
              </li>
              <li>
                <Link href="/answers" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Mahara Answers
                </Link>
              </li>
              <li>
                <Link href="/freelancers" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Browse Freelance By Skill
                </Link>
              </li>
            </ul>
          </div>

          {/* For Freelancers Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">For Freelancers</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/become-seller" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Become a Mahara Freelancer
                </Link>
              </li>
              <li>
                <Link href="/become-agency" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Become an Agency
                </Link>
              </li>
              <li>
                <Link href="/freelancer-equity" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Freelancer Equity Program
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Community Hub
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Solutions Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Business Solutions</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/pro" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Mahara Pro
                </Link>
              </li>
              <li>
                <Link href="/project-management" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Project Management Service
                </Link>
              </li>
              <li>
                <Link href="/expert-sourcing" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Expert Sourcing Service
                </Link>
              </li>
              <li>
                <Link href="/clearvoice" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  ClearVoice - Content Marketing
                </Link>
              </li>
              <li>
                <Link href="/autods" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  AutoDS - Dropshipping Tool
                </Link>
              </li>
              <li>
                <Link href="/ai-store" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  AI store builder
                </Link>
              </li>
              <li>
                <Link href="/logo-maker" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Mahara Logo Maker
                </Link>
              </li>
              <li>
                <Link href="/contact-sales" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  About Mahara
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="/social-impact" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Social Impact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy#do-not-sell" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Do not sell or share my personal information
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link href="/creator-network" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Creator Network
                </Link>
              </li>
              <li>
                <Link href="/affiliates" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Affiliates
                </Link>
              </li>
              <li>
                <Link href="/invite" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Invite a Friend
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Press & News
                </Link>
              </li>
              <li>
                <Link href="/investor-relations" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">
                  Investor Relations
                </Link>
              </li>
            </ul>
            </div>
          </div>
        </div>

      {/* Bottom Bar */}
      <div className="container-custom py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left Side - Logo and Copyright */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold text-primary-500 lowercase">
                mahara<span className="text-primary-500">.</span>
              </span>
            </Link>
            <span className="text-gray-600 text-sm">
              © Mahara International Ltd. {currentYear}
            </span>
          </div>

          {/* Right Side - Social Media, Language, Currency, Accessibility */}
          <div className="flex items-center gap-6">
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a 
                href="https://www.tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-500 transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-500 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://www.pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-500 transition-colors"
                aria-label="Pinterest"
              >
                <FaPinterest className="w-5 h-5" />
              </a>
              <a 
                href="https://www.twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
            </div>

            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => {
                  setLanguageOpen(!languageOpen);
                  setCurrencyOpen(false);
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors text-sm"
              >
                <FaGlobe className="w-4 h-4" />
                <span suppressHydrationWarning>{languages.find(l => l.code === language)?.name || 'English'}</span>
                <FaChevronDown className={`w-3 h-3 transition-transform ${languageOpen ? 'rotate-180' : ''}`} />
              </button>
              {languageOpen && (
                <div className={`absolute bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setLanguageOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        language === lang.code ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      <span className={`ml-auto text-primary-500 ${language === lang.code ? '' : 'invisible'}`} suppressHydrationWarning>
                        ✓
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => {
                  setCurrencyOpen(!currencyOpen);
                  setLanguageOpen(false);
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors text-sm"
              >
                <span>$ USD</span>
                <FaChevronDown className={`w-3 h-3 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} />
              </button>
              {currencyOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <button 
                    onClick={() => setCurrencyOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    $ USD
                  </button>
                  <button 
                    onClick={() => setCurrencyOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    € EUR
                  </button>
                  <button 
                    onClick={() => setCurrencyOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    £ GBP
                  </button>
                  <button 
                    onClick={() => setCurrencyOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    ¥ JPY
                  </button>
                </div>
              )}
            </div>

            {/* Accessibility Icon */}
            <button
              className="text-gray-600 hover:text-primary-500 transition-colors"
              aria-label="Accessibility"
            >
              <FaUniversalAccess className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

