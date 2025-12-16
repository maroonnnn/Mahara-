import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { categories } from '../../data/categories';
import { 
  FaSearch, 
  FaBell, 
  FaEnvelope, 
  FaHeart, 
  FaUser, 
  FaSignOutAlt,
  FaGlobe,
  FaBars,
  FaTimes,
  FaChevronDown
} from 'react-icons/fa';

export default function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [proMenuOpen, setProMenuOpen] = useState(false);
  const [exploreMenuOpen, setExploreMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const userMenuRef = useRef(null);
  const proMenuRef = useRef(null);
  const exploreMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const categoryRefs = useRef({});
  const categoryTimeoutRef = useRef(null);
  const router = useRouter();

  // Track if component has mounted to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (proMenuRef.current && !proMenuRef.current.contains(event.target)) {
        setProMenuOpen(false);
      }
      if (exploreMenuRef.current && !exploreMenuRef.current.contains(event.target)) {
        setExploreMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
      // Close category dropdowns when clicking outside
      if (openCategoryIndex !== null) {
        let clickedInsideCategory = false;
        Object.values(categoryRefs.current).forEach(ref => {
          if (ref && ref.contains(event.target)) {
            clickedInsideCategory = true;
          }
        });
        if (!clickedInsideCategory) {
          setOpenCategoryIndex(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openCategoryIndex]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200" style={{ overflow: 'visible' }}>
      {/* Primary Navigation Bar */}
      <nav className="border-b border-gray-200" style={{ overflow: 'visible' }}>
        <div className="container-custom" style={{ overflow: 'visible' }}>
          <div className="flex items-center justify-between h-16">
          {/* Logo */}
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
              <span className="text-3xl font-bold text-primary-500 lowercase">
                mahara<span className="text-primary-500">.</span>
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service are you looking for today?"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  className="bg-gray-700 text-white px-6 py-2 rounded-r-md hover:bg-gray-800 transition-colors"
                >
                  <FaSearch />
                </button>
              </form>
            </div>

            {/* Right Side Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/pro" className="text-gray-700 hover:text-primary-500 text-sm font-medium">
                    Upgrade to Pro
                  </Link>
                  <Link href="/notifications" className="text-gray-700 hover:text-primary-500 relative">
                    <FaBell className="w-5 h-5" />
            </Link>
                  <Link href="/messages" className="text-gray-700 hover:text-primary-500 relative">
                    <FaEnvelope className="w-5 h-5" />
            </Link>
                  <Link href="/favorites" className="text-gray-700 hover:text-primary-500 relative">
                    <FaHeart className="w-5 h-5" />
            </Link>
                  <Link href="/orders" className="text-gray-700 hover:text-primary-500 text-sm font-medium">
                    Orders
            </Link>
                  <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                      className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary-500 bg-white hover:border-primary-600 transition-colors"
                >
                      <FaUser className="w-4 h-4 text-primary-500" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                </button>

                {userMenuOpen && (
                      <div className={`absolute mt-2 w-64 bg-white rounded-lg shadow-xl py-2 border border-gray-200 ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                        {/* Top Section */}
                        <div className="px-4 py-2 border-b border-gray-100">
                          <Link href={`/${user?.role}/profile`} className="block py-2 text-gray-700 hover:text-primary-500 text-sm">
                            Profile
                          </Link>
                          <Link href="/projects/new" className="block py-2 text-gray-700 hover:text-primary-500 text-sm">
                            Post a project brief
                          </Link>
                          <Link href="/briefs" className="block py-2 text-gray-700 hover:text-primary-500 text-sm">
                            Your briefs
                          </Link>
                          <Link href="/refer" className="block py-2 text-primary-500 hover:text-primary-600 text-sm font-medium">
                            Refer a friend
                          </Link>
                        </div>

                        {/* Account Management */}
                        <div className="px-4 py-2 border-b border-gray-100">
                          <Link href="/become-seller" className="block py-2 text-gray-700 hover:text-primary-500 text-sm">
                            Become a Seller
                          </Link>
                          <Link href="/settings" className="block py-2 text-gray-700 hover:text-primary-500 text-sm">
                            Account settings
                          </Link>
                          <Link href="/billing" className="block py-2 text-gray-700 hover:text-primary-500 text-sm">
                            Billing and payments
                          </Link>
                        </div>

                        {/* Exclusive Features */}
                        <div className="px-4 py-2 border-b border-gray-100">
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 px-2">
                            Exclusive features
                          </div>
                          <Link href="/pro" className="block py-2">
                            <span className="inline-block bg-primary-500 text-white px-3 py-1 rounded text-xs font-semibold">
                              Mahara Pro
                            </span>
                          </Link>
                          <Link href="/team/invite" className="block py-2 text-gray-700 hover:text-primary-500 text-sm">
                            Invite your teammates
                          </Link>
                          <Link href="/find-freelancer" className="block py-2 text-gray-700 hover:text-primary-500 text-sm">
                            Let us find your freelancer
                          </Link>
                          <Link href="/build-team" className="block py-2 text-gray-700 hover:text-primary-500 text-sm">
                            Let us build a freelance team
                    </Link>
                        </div>

                        {/* Bottom Section */}
                        <div className="px-4 py-2">
                          <div className="relative">
                            <button
                              onClick={() => {
                                const newLang = language === 'en' ? 'ar' : 'en';
                                changeLanguage(newLang);
                              }}
                              className="flex items-center w-full py-2 text-gray-700 hover:text-primary-500 text-sm"
                            >
                              <FaGlobe className="w-4 h-4 mr-2" />
                              {language === 'en' ? 'English' : 'العربية'}
                            </button>
                          </div>
                          <Link href="/currency" className="block py-2 text-gray-700 hover:text-primary-500 text-sm">
                            $ USD
                    </Link>
                          <Link href="/help" className="block py-2 text-gray-700 hover:text-primary-500 text-sm border-t border-gray-200 pt-3 mt-2">
                            Help & support
                    </Link>
                    <button
                      onClick={logout}
                            className="w-full text-left py-2 text-gray-700 hover:text-red-600 text-sm flex items-center"
                    >
                            <FaSignOutAlt className="w-4 h-4 mr-2" />
                            Sign out
                    </button>
                        </div>
                  </div>
                )}
              </div>
                </>
              ) : (
                <>
                  {/* Mahara Pro Dropdown */}
                  <div className="relative" ref={proMenuRef}>
                    <button
                      onClick={() => {
                        setProMenuOpen(!proMenuOpen);
                        setExploreMenuOpen(false);
                        setLanguageMenuOpen(false);
                      }}
                      className="flex items-center gap-1 text-gray-700 hover:text-primary-500 text-sm font-medium transition-colors"
                    >
                      Mahara Pro
                      <FaChevronDown className={`w-3 h-3 transition-transform ${proMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {proMenuOpen && (
                      <div className={`absolute mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-50 ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                        <Link href="/pro" className="block px-4 py-2 text-gray-700 hover:text-primary-500 text-sm">
                          Explore Mahara Pro
                        </Link>
                        <Link href="/pro/sellers" className="block px-4 py-2 text-gray-700 hover:text-primary-500 text-sm">
                          Pro Services
                        </Link>
                        <Link href="/pro/business" className="block px-4 py-2 text-gray-700 hover:text-primary-500 text-sm">
                          Pro for Business
                        </Link>
                  </div>
                )}
              </div>

                  {/* Explore Dropdown */}
                  <div className="relative" ref={exploreMenuRef}>
                    <button
                      onClick={() => {
                        setExploreMenuOpen(!exploreMenuOpen);
                        setProMenuOpen(false);
                        setLanguageMenuOpen(false);
                      }}
                      className="flex items-center gap-1 text-gray-700 hover:text-primary-500 text-sm font-medium transition-colors"
                    >
                      Explore
                      <FaChevronDown className={`w-3 h-3 transition-transform ${exploreMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {exploreMenuOpen && (
                      <div className={`absolute mt-2 w-64 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-50 ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Categories</div>
                          {categories.map((category, index) => (
                            <Link
                              key={index}
                              href={category.href}
                              className="flex items-center py-2 text-gray-700 hover:text-primary-500 text-sm"
                            >
                              {category.emoji && <span className="mr-2">{category.emoji}</span>}
                              {category.name}
                            </Link>
                          ))}
                        </div>
                        <Link href="/inspiration" className="block px-4 py-2 text-gray-700 hover:text-primary-500 text-sm">
                          Get Inspired
                </Link>
                        <Link href="/learn" className="block px-4 py-2 text-gray-700 hover:text-primary-500 text-sm">
                          Learn from Mahara
                </Link>
              </div>
                    )}
                  </div>

                  {/* Language Selector */}
                  <div className="relative" ref={languageMenuRef}>
                    <button
                      onClick={() => {
                        setLanguageMenuOpen(!languageMenuOpen);
                        setProMenuOpen(false);
                        setExploreMenuOpen(false);
                      }}
                      className="flex items-center gap-1 text-gray-700 hover:text-primary-500 text-sm font-medium transition-colors"
                    >
                      <FaGlobe className="w-4 h-4" />
                      <span suppressHydrationWarning>{languages.find(l => l.code === language)?.name || 'English'}</span>
                      <FaChevronDown className={`w-3 h-3 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {languageMenuOpen && (
                      <div className={`absolute mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-50 ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              changeLanguage(lang.code);
                              setLanguageMenuOpen(false);
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

                        <Link href="/become-seller" className="text-gray-700 hover:text-primary-500 text-sm font-medium">
                          Become a Seller
                        </Link>
                  <Link href="/login" className="text-gray-700 hover:text-primary-500 text-sm font-medium">
                    Sign In
                  </Link>
                  <Link href="/register" className="bg-primary-500 text-white px-5 py-2 rounded-md hover:bg-primary-600 text-sm font-medium transition-colors">
                    Join
                  </Link>
                </>
            )}
          </div>

          {/* Mobile Menu Button */}
            <button onClick={toggleMobileMenu} className="lg:hidden text-gray-700">
              {mobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              {/* Mobile Search Bar */}
              <form onSubmit={handleSearch} className="flex mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service are you looking for today?"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  className="bg-gray-700 text-white px-6 py-2 rounded-r-md hover:bg-gray-800 transition-colors"
                >
                  <FaSearch />
                </button>
              </form>

              {/* Mobile Categories */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
            <Link
                      key={index}
                      href={category.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-primary-500 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {category.emoji && <span className="mr-1">{category.emoji}</span>}
                      {category.name}
            </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Navigation */}
              {isAuthenticated ? (
                <>
            <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary-500 text-sm"
            >
                    Orders
            </Link>
            <Link
                    href="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary-500 text-sm"
            >
                    Favorites
            </Link>
            <Link
                    href="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary-500 text-sm"
            >
                    Messages
            </Link>
                <Link
                    href="/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary-500 text-sm"
                >
                    Notifications
                </Link>
                <Link
                  href={`/${user?.role}/profile`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary-500 text-sm"
                >
                    Profile
                </Link>
                <Link
                    href="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary-500 text-sm"
                >
                    Settings
                </Link>
                <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 text-red-600 hover:text-red-700 text-sm"
                  >
                    Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary-500 text-sm font-medium"
                >
                    Sign In
                </Link>
                <Link
                  href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                    Join
                </Link>
              </>
            )}
          </div>
        )}
        </div>
      </nav>

            {/* Categories Navigation Bar */}
            <nav className="hidden lg:block bg-white border-b border-gray-100 relative z-40" style={{ overflow: 'visible' }}>
              <div className="container-custom" style={{ overflow: 'visible' }}>
                <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide" style={{ overflowY: 'visible' }}>
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      ref={(el) => (categoryRefs.current[index] = el)}
                      className="relative"
                      onMouseEnter={() => {
                        if (categoryTimeoutRef.current) {
                          clearTimeout(categoryTimeoutRef.current);
                          categoryTimeoutRef.current = null;
                        }
                        if ((category.sections && category.sections.length > 0) || (category.subCategories && category.subCategories.length > 0)) {
                          setOpenCategoryIndex(index);
                        }
                      }}
                      onMouseLeave={() => {
                        categoryTimeoutRef.current = setTimeout(() => {
                          setOpenCategoryIndex(null);
                        }, 200);
                      }}
                    >
                      <div className="flex items-center cursor-pointer">
                        <Link
                          href={category.href}
                          className={`flex items-center whitespace-nowrap py-3 text-sm font-medium transition-colors ${
                            mounted && router.asPath === category.href
                              ? 'text-primary-500'
                              : 'text-gray-700 hover:text-primary-500'
                          }`}
                          onClick={(e) => {
                            if (mounted && router.asPath === category.href) {
                              e.preventDefault();
                            }
                          }}
                          suppressHydrationWarning
                        >
                          {category.emoji && <span className="mr-1">{category.emoji}</span>}
                          {category.name}
                        </Link>
                        {((category.sections && category.sections.length > 0) || (category.subCategories && category.subCategories.length > 0)) && (
                          <span className="ml-1">
                            <FaChevronDown className={`w-3 h-3 transition-transform ${openCategoryIndex === index ? 'rotate-180' : ''}`} />
                          </span>
                        )}
                      </div>

                      {/* Dropdown Menu - Sections Layout */}
                      {openCategoryIndex === index && category.sections && category.sections.length > 0 && (
                        <div 
                          className={`category-dropdown absolute top-full w-[900px] ${language === 'ar' ? 'right-0' : 'left-0'}`}
                          style={{ marginTop: '0px', zIndex: 1000 }}
                          onMouseEnter={() => {
                            if (categoryTimeoutRef.current) {
                              clearTimeout(categoryTimeoutRef.current);
                              categoryTimeoutRef.current = null;
                            }
                            setOpenCategoryIndex(index);
                          }}
                          onMouseLeave={() => {
                            categoryTimeoutRef.current = setTimeout(() => {
                              setOpenCategoryIndex(null);
                            }, 200);
                          }}
                        >
                          <div className="pt-1">
                            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                              <div className="p-6">
                                <div className={`grid gap-6 ${
                                  category.sections.length === 2 ? 'grid-cols-2' :
                                  category.sections.length === 3 ? 'grid-cols-3' :
                                  category.sections.length === 4 ? 'grid-cols-4' :
                                  'grid-cols-3'
                                }`}>
                                  {category.sections.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="space-y-3">
                                      <h3 className="font-bold text-gray-900 text-sm mb-3 border-b border-gray-200 pb-2">
                                        {section.title}
                                      </h3>
                                      <div className="space-y-2">
                                        {section.items.map((item, itemIndex) => (
                                          <Link
                                            key={itemIndex}
                                            href={item.href}
                                            className="block text-sm text-gray-700 hover:text-primary-600 hover:underline transition-colors"
                                            onClick={() => setOpenCategoryIndex(null)}
                                          >
                                            {item.name}
                                            {item.badge && (
                                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                                {item.badge}
                                              </span>
                                            )}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dropdown Menu - Simple List (fallback for old format) */}
                      {openCategoryIndex === index && category.subCategories && category.subCategories.length > 0 && !(category.sections && category.sections.length > 0) && (
                        <div 
                          className={`category-dropdown absolute top-full w-72 ${language === 'ar' ? 'right-0' : 'left-0'}`}
                          style={{ marginTop: '0px', zIndex: 1000 }}
                          onMouseEnter={() => {
                            if (categoryTimeoutRef.current) {
                              clearTimeout(categoryTimeoutRef.current);
                              categoryTimeoutRef.current = null;
                            }
                            setOpenCategoryIndex(index);
                          }}
                          onMouseLeave={() => {
                            categoryTimeoutRef.current = setTimeout(() => {
                              setOpenCategoryIndex(null);
                            }, 200);
                          }}
                        >
                          <div className="pt-1">
                            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                              <Link
                                href={category.href}
                                className={`block px-4 py-3 text-sm font-semibold border-b border-gray-100 transition-colors ${
                                  mounted && router.asPath === category.href
                                    ? 'text-primary-600 cursor-default'
                                    : 'text-gray-900 hover:bg-gray-50'
                                }`}
                                onClick={(e) => {
                                  if (mounted && router.asPath === category.href) {
                                    e.preventDefault();
                                  } else {
                                    setOpenCategoryIndex(null);
                                  }
                                }}
                                suppressHydrationWarning
                              >
                                View All {category.name}
                              </Link>
                              <div className="max-h-[500px] overflow-y-auto py-2 scrollbar-hide">
                                {category.subCategories.map((subCategory, subIndex) => (
                                  <Link
                                    key={subIndex}
                                    href={subCategory.href}
                                    className={`block px-4 py-2.5 text-sm transition-colors ${
                                      mounted && router.asPath === subCategory.href
                                        ? 'text-primary-600 font-medium bg-primary-50 cursor-default'
                                        : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                                    }`}
                                    onClick={(e) => {
                                      if (mounted && router.asPath === subCategory.href) {
                                        e.preventDefault();
                                      } else {
                                        setOpenCategoryIndex(null);
                                      }
                                    }}
                                    suppressHydrationWarning
                                  >
                                    {subCategory.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
      </nav>
    </header>
  );
}

