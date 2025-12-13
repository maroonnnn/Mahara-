import { useState } from 'react';
import { FaImage, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PortfolioGrid({ portfolioItems, onItemClick }) {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imageErrors, setImageErrors] = useState({});

  // Get unique categories from portfolio items
  const categories = ['all', ...new Set(portfolioItems?.map(item => item.category).filter(Boolean))];

  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems?.filter(item => item.category === selectedCategory);

  if (!portfolioItems || portfolioItems.length === 0) {
    return (
      <div className="text-center py-12">
        <FaImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">
          {language === 'ar' ? 'لا توجد عناصر محفظة لعرضها' : 'No portfolio items to display'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' 
                ? (language === 'ar' ? 'الكل' : 'All') 
                : category
              }
            </button>
          ))}
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id || index}
            className="relative group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => onItemClick && onItemClick(item)}
          >
            {/* Image Container */}
            <div className="relative w-full aspect-square bg-gray-200 overflow-hidden">
              {imageErrors[item.id || index] ? (
                <div className="w-full h-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center">
                  <FaImage className="w-12 h-12 text-white opacity-50" />
                </div>
              ) : (
                <img
                  src={item.image_url || item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={() => setImageErrors(prev => ({ ...prev, [item.id || index]: true }))}
                />
              )}
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    <FaExternalLinkAlt className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              {item.category && (
                <div className="absolute top-3 left-3 bg-primary-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  {item.category}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
              )}
              
              {/* Technologies */}
              {item.technologies && item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {item.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{item.technologies.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Completed Date */}
              {item.completed_date && (
                <p className="text-xs text-gray-500 mt-3">
                  {new Date(item.completed_date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                    year: 'numeric',
                    month: 'short'
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

