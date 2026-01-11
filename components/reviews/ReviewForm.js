import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import reviewService from '../../services/reviewService';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ReviewForm({ projectId, onSuccess, onCancel }) {
  const { language } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkCanReview();
  }, [projectId]);

  const checkCanReview = async () => {
    try {
      setChecking(true);
      const response = await reviewService.canReview(projectId);
      setCanReview(response.data?.can_review || false);
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      setCanReview(false);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error(language === 'ar' ? 'يرجى اختيار تقييم' : 'Please select a rating');
      return;
    }

    try {
      setLoading(true);
      await reviewService.createReview(projectId, {
        rating,
        comment: comment.trim() || null
      });
      
      toast.success(language === 'ar' ? 'تم إرسال التقييم بنجاح' : 'Review submitted successfully');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const message = error.response?.data?.message || 
        (language === 'ar' ? 'حدث خطأ أثناء إرسال التقييم' : 'Error submitting review');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!canReview) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">
          {language === 'ar' 
            ? 'لا يمكنك تقييم هذا المشروع. يجب أن يكون المشروع مكتملاً وأن تكون صاحب المشروع.'
            : 'You cannot review this project. The project must be completed and you must be the project owner.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        {language === 'ar' ? 'قيم المستقل' : 'Rate the Freelancer'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {language === 'ar' ? 'التقييم' : 'Rating'} <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <FaStar
                  className={`w-10 h-10 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-lg font-semibold text-gray-700 ml-2">
                {rating} {language === 'ar' ? 'نجمة' : 'star'}{rating > 1 ? (language === 'ar' ? 'ات' : 's') : ''}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'تعليق (اختياري)' : 'Comment (Optional)'}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            maxLength={2000}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder={language === 'ar' 
              ? 'شارك تجربتك مع هذا المستقل...'
              : 'Share your experience with this freelancer...'}
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/2000 {language === 'ar' ? 'حرف' : 'characters'}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || rating === 0}
            className="flex-1 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading 
              ? (language === 'ar' ? 'جاري الإرسال...' : 'Submitting...')
              : (language === 'ar' ? 'إرسال التقييم' : 'Submit Review')
            }
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
