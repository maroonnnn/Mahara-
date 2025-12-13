import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import PublicLayout from '../../../components/layout/PublicLayout';
import { getCategoryBySlug, getSubcategoryBySlug } from '../../../data/categories';
import { FaSearch, FaChevronRight, FaStar, FaHeart, FaFilter, FaChevronDown, FaPlay, FaVideo } from 'react-icons/fa';

export default function SubcategoryPage() {
  const router = useRouter();
  const { category: categorySlug, subcategory: subcategorySlug } = router.query;
  const [searchQuery, setSearchQuery] = useState('');
  const [proServices, setProServices] = useState(false);
  const [instantResponse, setInstantResponse] = useState(false);
  
  // Dropdown states
  const [serviceOptionsOpen, setServiceOptionsOpen] = useState(false);
  const [sellerDetailsOpen, setSellerDetailsOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [deliveryTimeOpen, setDeliveryTimeOpen] = useState(false);
  
  // Filter selections
  const [selectedServiceOptions, setSelectedServiceOptions] = useState([]);
  const [selectedSellerLevels, setSelectedSellerLevels] = useState([]);
  const [selectedBudgetOptions, setSelectedBudgetOptions] = useState([]);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState([]);
  
  // Refs for click outside
  const serviceOptionsRef = useRef(null);
  const sellerDetailsRef = useRef(null);
  const budgetRef = useRef(null);
  const deliveryTimeRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (serviceOptionsRef.current && !serviceOptionsRef.current.contains(event.target)) {
        setServiceOptionsOpen(false);
      }
      if (sellerDetailsRef.current && !sellerDetailsRef.current.contains(event.target)) {
        setSellerDetailsOpen(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(event.target)) {
        setBudgetOpen(false);
      }
      if (deliveryTimeRef.current && !deliveryTimeRef.current.contains(event.target)) {
        setDeliveryTimeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleServiceOption = (option) => {
    setSelectedServiceOptions(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const toggleSellerLevel = (level) => {
    setSelectedSellerLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const toggleBudgetOption = (option) => {
    setSelectedBudgetOptions(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const toggleDeliveryTime = (time) => {
    setSelectedDeliveryTime(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const clearAllFilters = () => {
    setSelectedServiceOptions([]);
    setSelectedSellerLevels([]);
    setSelectedBudgetOptions([]);
    setSelectedDeliveryTime([]);
    setProServices(false);
    setInstantResponse(false);
  };

  // Get category and subcategory data
  const category = getCategoryBySlug(categorySlug);
  const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug);

  if (!category || !subcategory) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
            <Link href="/" className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors">
              Go to Homepage
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&category=${categorySlug}&subcategory=${subcategorySlug}`);
    }
  };

  // Service options - These would ideally come from the data
  const serviceOptions = [
    { icon: '📱', name: `${subcategory.name} Management`, slug: 'management' },
    { icon: '💰', name: 'Paid Services', slug: 'paid' },
    { icon: '🌱', name: 'Organic Growth', slug: 'organic' },
    { icon: '⚙️', name: 'Setup & Integration', slug: 'setup' },
    { icon: '📝', name: 'Content Creation', slug: 'content' },
    { icon: '📊', name: 'Analytics & Reporting', slug: 'analytics' },
  ];

  return (
    <PublicLayout>
      <Head>
        <title>{subcategory.name} | {category.name} Services | Fiverr Clone</title>
        <meta name="description" content={`Find the best ${subcategory.name} services on our platform`} />
      </Head>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <FaChevronRight className="mx-2 w-3 h-3" />
            <Link href={category.href} className="hover:text-gray-900 transition-colors">
              {category.name}
            </Link>
            <FaChevronRight className="mx-2 w-3 h-3" />
            <span className="text-gray-900 font-semibold">{subcategory.name}</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white py-6 border-b border-gray-200">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {subcategory.name}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <p>Boost your online presence with compelling social media content.</p>
            <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              How Fiverr Works
            </button>
          </div>
        </div>
      </div>

      {/* Service Option Tiles */}
      <div className="bg-white py-6 border-b border-gray-200 overflow-x-auto">
        <div className="container-custom">
          <div className="flex gap-4 min-w-max pb-2">
            {serviceOptions.map((option, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center min-w-[140px] p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-2">{option.icon}</div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600 text-center">
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white py-4 border-b border-gray-200 sticky top-[64px] z-30">
        <div className="container-custom">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Service Options Dropdown */}
              <div className="relative" ref={serviceOptionsRef}>
                <button
                  onClick={() => {
                    setServiceOptionsOpen(!serviceOptionsOpen);
                    setSellerDetailsOpen(false);
                    setBudgetOpen(false);
                    setDeliveryTimeOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors bg-white ${
                    serviceOptionsOpen ? 'border-gray-900 shadow-md' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-700">Service options</span>
                  <FaChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${serviceOptionsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {serviceOptionsOpen && (
                  <div className="absolute top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-4 px-4 z-50">
                    <div className="space-y-3">
                      {['Video consultations', 'Samples', 'Portfolio', 'Awards'].map((option) => (
                        <label key={option} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={selectedServiceOptions.includes(option)}
                            onChange={() => toggleServiceOption(option)}
                            className="mr-3 w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Seller Details Dropdown */}
              <div className="relative" ref={sellerDetailsRef}>
                <button
                  onClick={() => {
                    setSellerDetailsOpen(!sellerDetailsOpen);
                    setServiceOptionsOpen(false);
                    setBudgetOpen(false);
                    setDeliveryTimeOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors bg-white ${
                    sellerDetailsOpen ? 'border-gray-900 shadow-md' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-700">Seller details</span>
                  <FaChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${sellerDetailsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {sellerDetailsOpen && (
                  <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-4 px-4 z-50">
                    <h3 className="font-semibold text-gray-900 mb-3">Seller level</h3>
                    <div className="space-y-3 mb-4">
                      {[
                        { label: 'Top Rated Seller', count: '1,016' },
                        { label: 'Level 2', count: '8,177' },
                        { label: 'Level 1', count: '6,836' },
                        { label: 'New Seller', count: '40,578' }
                      ].map((level) => (
                        <label key={level.label} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedSellerLevels.includes(level.label)}
                              onChange={() => toggleSellerLevel(level.label)}
                              className="mr-3 w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{level.label}</span>
                          </div>
                          <span className="text-xs text-gray-500">({level.count})</span>
                        </label>
                      ))}
                    </div>
                    <hr className="my-4 border-gray-200" />
                    <h3 className="font-semibold text-gray-900 mb-3">Rate type</h3>
                    <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="radio"
                        name="rateType"
                        className="mr-3 w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
                      />
                      <div>
                        <div className="text-sm text-gray-700 flex items-center gap-2">
                          Offers hourly rates 
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded">New</span>
                          <span className="text-xs text-gray-500">(7,303)</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Hire hourly for long-term projects, exclusively on Fiverr Pro</div>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Budget Dropdown */}
              <div className="relative" ref={budgetRef}>
                <button
                  onClick={() => {
                    setBudgetOpen(!budgetOpen);
                    setServiceOptionsOpen(false);
                    setSellerDetailsOpen(false);
                    setDeliveryTimeOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors bg-white ${
                    budgetOpen ? 'border-gray-900 shadow-md' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-700">Budget</span>
                  <FaChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${budgetOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {budgetOpen && (
                  <div className="absolute top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-4 px-4 z-50">
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="budget"
                          className="mr-3 w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Hire hourly</span>
                      </label>
                      <p className="text-xs text-gray-500 ml-7 -mt-2">Pay on an hourly basis, only on Fiverr Pro. <Link href="#" className="text-primary-500 hover:underline">Upgrade for free</Link></p>
                    </div>
                    <hr className="my-4 border-gray-200" />
                    <p className="text-xs text-gray-500 text-center mb-3">OR</p>
                    <hr className="mb-4 border-gray-200" />
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-700 text-sm">Value</h3>
                      {[
                        { label: 'Under $80', value: 'under-80' },
                        { label: 'Mid-range   $80-$175', value: '80-175' },
                        { label: 'High-end   $175 & Above', value: '175-above' },
                        { label: 'Custom', value: 'custom' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={selectedBudgetOptions.includes(option.value)}
                            onChange={() => toggleBudgetOption(option.value)}
                            className="mr-3 w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Clear all
                      </button>
                      <button
                        onClick={() => setBudgetOpen(false)}
                        className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Time Dropdown */}
              <div className="relative" ref={deliveryTimeRef}>
                <button
                  onClick={() => {
                    setDeliveryTimeOpen(!deliveryTimeOpen);
                    setServiceOptionsOpen(false);
                    setSellerDetailsOpen(false);
                    setBudgetOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors bg-white ${
                    deliveryTimeOpen ? 'border-gray-900 shadow-md' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-700">Delivery time</span>
                  <FaChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${deliveryTimeOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {deliveryTimeOpen && (
                  <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-4 px-4 z-50">
                    <div className="space-y-3">
                      {[
                        { label: 'Express 24H', value: '24h' },
                        { label: 'Up to 3 days', value: '3days' },
                        { label: 'Up to 7 days', value: '7days' },
                        { label: 'Anytime', value: 'anytime' }
                      ].map((time) => (
                        <label key={time.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="radio"
                            name="deliveryTime"
                            checked={selectedDeliveryTime.includes(time.value)}
                            onChange={() => {
                              setSelectedDeliveryTime([time.value]);
                            }}
                            className="mr-3 w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{time.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedDeliveryTime([])}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Clear all
                      </button>
                      <button
                        onClick={() => setDeliveryTimeOpen(false)}
                        className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pro Services & Instant Response Toggles */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={proServices}
                    onChange={(e) => setProServices(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${proServices ? 'bg-primary-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${proServices ? 'transform translate-x-5' : ''}`}></div>
                  </div>
                </div>
                <span className="text-sm text-gray-700">Pro services</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={instantResponse}
                    onChange={(e) => setInstantResponse(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${instantResponse ? 'bg-primary-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${instantResponse ? 'transform translate-x-5' : ''}`}></div>
                  </div>
                </div>
                <span className="text-sm text-gray-700">
                  Instant response
                  <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded">New</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-gray-50 py-8">
        <div className="container-custom">

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 text-sm">
              <span className="font-bold text-gray-900">120,000+</span> results
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium bg-white">
                <option>Best selling</option>
                <option>Recommended</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => {
              const rating = (4.5 + Math.random() * 0.5).toFixed(1);
              const reviews = Math.floor(Math.random() * 2000 + 100);
              const price = Math.floor(Math.random() * 150 + 50);
              const isAd = item === 1;
              const hasVideo = item % 3 === 0;
              const badges = item % 2 === 0 ? ['Top Rated', 'Vetted Pro'] : item % 3 === 0 ? ['Top Rated'] : [];
              
              return (
                <div key={item} className="group cursor-pointer">
                  {/* Ad Label */}
                  {isAd && (
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <span className="font-semibold">Ad</span>
                    </div>
                  )}
                  
                  <div className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    {/* Service Image */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 overflow-hidden">
                      {/* Placeholder with gradient */}
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs opacity-50">
                        {subcategory.name}
                      </div>
                      
                      {/* Video Indicator */}
                      {hasVideo && (
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                          <FaPlay className="w-2 h-2" />
                          <span>Video</span>
                        </div>
                      )}
                      
                      {/* Heart Icon */}
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg">
                        <FaHeart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                      </button>
                    </div>

                    {/* Service Info */}
                    <div className="p-4">
                      {/* Seller Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                          {String.fromCharCode(65 + (item % 26))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            seller{item}
                          </p>
                        </div>
                        {badges.length > 0 && (
                          <div className="flex gap-1">
                            {badges.map((badge, idx) => (
                              <span key={idx} className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-semibold">
                                {badge === 'Top Rated' ? '★★★' : badge === 'Vetted Pro' ? 'Pro' : badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Service Title */}
                      <h3 className="text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                        I will be your {subcategory.name.toLowerCase()} manager and content creator
                      </h3>

                      {/* Rating & Reviews */}
                      <div className="flex items-center gap-1 mb-3">
                        <FaStar className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                        <span className="text-sm font-bold text-gray-900">{rating}</span>
                        <span className="text-sm text-gray-500">({reviews.toLocaleString()})</span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-gray-500">
                          {hasVideo && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                          )}
                          <span className="text-xs">Offers video consultations</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">From</span>
                          <span className="text-lg font-bold text-gray-900">${price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <button disabled className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
              Previous
            </button>
            {[1, 2, 3, 4, 5, '...', 10].map((page, index) => (
              page === '...' ? (
                <span key={index} className="px-2 text-gray-500">...</span>
              ) : (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                    page === 1
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Services by Category Section */}
      <div className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Services related to {subcategory.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {['Social Media Strategy', 'Content Calendar', 'Instagram Marketing', 'Facebook Marketing', 
              'LinkedIn Marketing', 'Twitter Marketing', 'TikTok Marketing', 'Pinterest Marketing',
              'Social Media Analytics', 'Community Management', 'Influencer Outreach', 'Hashtag Research'].map((tag, index) => (
              <Link
                key={index}
                href="#"
                className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:border-gray-900 hover:bg-white transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-12">
        <div className="container-custom">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About {subcategory.name} Services
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Looking to boost your brand's online presence? Our {subcategory.name.toLowerCase()} experts are here to help you create engaging content, 
                grow your audience, and drive meaningful results across all major social platforms.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From strategy development to daily management, our vetted professionals offer comprehensive {subcategory.name.toLowerCase()} solutions 
                tailored to your business goals. Whether you need help with content creation, community management, or analytics, 
                you'll find the perfect freelancer for your project.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {subcategory.name} FAQs
          </h2>
          <div className="max-w-3xl space-y-4">
            {[
              {
                q: `What is ${subcategory.name}?`,
                a: `${subcategory.name} involves creating and managing content across social media platforms to build brand awareness, engage audiences, and drive business results.`
              },
              {
                q: `Why do I need ${subcategory.name.toLowerCase()} services?`,
                a: 'Professional social media management helps you maintain a consistent online presence, engage with your audience effectively, and achieve your marketing goals.'
              },
              {
                q: 'How much do services cost?',
                a: 'Prices vary based on the scope of work, platforms covered, and deliverables. You can find services starting from as low as $50.'
              }
            ].map((faq, index) => (
              <details key={index} className="bg-white rounded-lg p-5 border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-primary-600 transition-colors">
                  {faq.q}
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

