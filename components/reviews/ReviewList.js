import { useState, useEffect } from 'react';
import { FaStar, FaUser } from 'react-icons/fa';
import reviewService from '../../services/reviewService';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ReviewList({ freelancerId }) {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [freelancerId, page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getFreelancerReviews(freelancerId, page);
      const data = response.data?.data || response.data || [];
      
      if (page === 1) {
        setReviews(data);
      } else {
        setReviews(prev => [...prev, ...data]);
      }
      
      setHasMore(response.data?.next_page_url ? true : false);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <FaStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">
          {language === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center">
                {review.client?.name ? (
                  <span className="font-semibold">
                    {review.client.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <FaUser className="w-6 h-6" />
                )}
              </div>
            </div>

            {/* Review Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {review.client?.name || (language === 'ar' ? 'عميل' : 'Client')}
                  </h4>
                  {review.project && (
                    <p className="text-sm text-gray-500">
                      {language === 'ar' ? 'مشروع:' : 'Project:'} {review.project.title}
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(review.created_at)}
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`w-5 h-5 ${
                      star <= review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700">
                  {review.rating}.0
                </span>
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:bg-gray-400"
          >
            {loading 
              ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...')
              : (language === 'ar' ? 'تحميل المزيد' : 'Load More')
            }
          </button>
        </div>
      )}
    </div>
  );
}
