import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import portfolioService from '../../services/portfolioService';
import categoryService from '../../services/categoryService';
import { toast } from 'react-toastify';
import { 
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaFileAlt,
  FaLink,
  FaSave,
  FaTimes,
  FaExternalLinkAlt,
  FaGithub,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaCode,
  FaSpinner
} from 'react-icons/fa';

export default function FreelancerPortfolioPage() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagePreview, setImagePreview] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    project_url: '',
    image_url: ''
  });
  
  const [newTech, setNewTech] = useState('');

  // Load portfolio items and categories on mount
  useEffect(() => {
    if (user) {
      loadPortfolios();
      loadCategories();
    }
  }, [user]);

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      const response = await portfolioService.getMyPortfolio();
      // Handle paginated response
      const portfolioData = response.data || response;
      const portfolioList = Array.isArray(portfolioData) ? portfolioData : (portfolioData.data || []);
      
      // Map backend data to frontend format
      const mappedPortfolios = portfolioList.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category?.name || '',
        category_id: item.category_id,
        images: item.image_url ? [item.image_url] : [],
        liveDemo: item.project_url || '',
        project_url: item.project_url,
        image_url: item.image_url,
        completion_date: item.completion_date,
        createdAt: item.created_at || item.completion_date
      }));
      
      setPortfolios(mappedPortfolios);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      toast.error('فشل تحميل أعمال الحافظة');
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      const categoriesData = response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddPortfolio = () => {
    setEditingId(null);
    setShowAddForm(true);
    setImagePreview([]);
    setFormData({
      title: '',
      description: '',
      category_id: '',
      project_url: '',
      image_url: ''
    });
  };

  const handleEditPortfolio = (portfolio) => {
    setEditingId(portfolio.id);
    setShowAddForm(true);
    setImagePreview(portfolio.images || []);
    setFormData({
      title: portfolio.title,
      description: portfolio.description || '',
      category_id: portfolio.category_id || '',
      project_url: portfolio.project_url || portfolio.liveDemo || '',
      image_url: portfolio.image_url || (portfolio.images && portfolio.images[0]) || ''
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview([previewUrl]);
    
    // For now, we'll use a placeholder URL
    // In production, you'd upload to a server and get the URL
    const imageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop`;
    setFormData(prev => ({
      ...prev,
      image_url: imageUrl
    }));
  };

  const handleRemoveImage = () => {
    setImagePreview([]);
    setFormData(prev => ({
      ...prev,
      image_url: ''
    }));
  };


  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Prepare data for API
      const portfolioData = {
        title: formData.title,
        description: formData.description || null,
        image_url: formData.image_url || null,
        project_url: formData.project_url || null,
        category_id: formData.category_id || null,
        completion_date: new Date().toISOString().split('T')[0]
      };

      if (editingId) {
        // Update existing
        await portfolioService.updateItem(editingId, portfolioData);
        toast.success('تم تحديث العمل بنجاح');
      } else {
        // Add new
        await portfolioService.createItem(portfolioData);
        toast.success('تم إضافة العمل بنجاح');
      }
      
      // Reload portfolios
      await loadPortfolios();
      
      setShowAddForm(false);
      setEditingId(null);
      setImagePreview([]);
      setFormData({
        title: '',
        description: '',
        category_id: '',
        project_url: '',
        image_url: ''
      });
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ في حفظ العمل');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذا العمل من الحافظة؟')) {
      try {
        await portfolioService.deleteItem(id);
        toast.success('تم حذف العمل بنجاح');
        await loadPortfolios();
      } catch (error) {
        console.error('Error deleting portfolio:', error);
        toast.error('حدث خطأ في حذف العمل');
      }
    }
  };

  const nextImage = () => {
    if (viewingProject && viewingProject.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === viewingProject.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (viewingProject && viewingProject.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? viewingProject.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>الحافظة | Mahara</title>
        <meta name="description" content="معرض أعمالك ومشاريعك السابقة" />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الحافظة</h1>
            <p className="text-gray-600">اعرض أعمالك السابقة للعملاء</p>
          </div>
          <button
            onClick={handleAddPortfolio}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center gap-2"
          >
            <FaPlus />
            إضافة عمل
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'تعديل العمل' : 'إضافة عمل جديد'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePortfolio} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  عنوان المشروع <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: تصميم شعار لشركة تكنولوجيا"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الوصف <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  placeholder="اكتب وصفاً مفصلاً عن المشروع، التحديات التي واجهتها، والحلول التي قدمتها..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الفئة
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Project URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaPlay className="text-green-500" />
                  رابط المشروع (Project URL)
                </label>
                <input
                  type="url"
                  value={formData.project_url}
                  onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  placeholder="https://your-project.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  صور المشروع
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <FaImage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2 font-medium">اسحب الصور هنا أو انقر للتصفح</p>
                  <label className="cursor-pointer">
                    <span className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold">
                      اختر الصور
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF (حجم أقصى 5 ميجابايت لكل صورة)</p>
                </div>

                {/* Image Preview */}
                {imagePreview.length > 0 && (
                  <div className="mt-4">
                    <div className="relative inline-block group">
                      <img
                        src={imagePreview[0]}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      حفظ
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Portfolio Grid */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaSpinner className="w-12 h-12 text-primary-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">جاري تحميل أعمال الحافظة...</p>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد أعمال في الحافظة</h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة أعمالك السابقة لعرضها للعملاء</p>
            <button
              onClick={handleAddPortfolio}
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              <FaPlus />
              إضافة عمل
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div 
                  className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer group"
                  onClick={() => {
                    setViewingProject(portfolio);
                    setCurrentImageIndex(0);
                  }}
                >
                  {portfolio.image_url ? (
                    <img
                      src={portfolio.image_url}
                      alt={portfolio.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImage className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      عرض التفاصيل
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPortfolio(portfolio);
                      }}
                      className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                      title="تعديل"
                    >
                      <FaEdit className="text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePortfolio(portfolio.id);
                      }}
                      className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-100 transition-colors"
                      title="حذف"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {portfolio.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[40px]">
                    {portfolio.description}
                  </p>
                  
                  {/* Category & Links */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-semibold">
                      {portfolio.category || 'غير محدد'}
                    </span>
                    <div className="flex items-center gap-3">
                      {portfolio.project_url && (
                        <a
                          href={portfolio.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-green-600 hover:text-green-700 transition-colors"
                          title="عرض مباشر"
                        >
                          <FaExternalLinkAlt className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Detail Modal */}
        {viewingProject && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => setViewingProject(null)}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-900">{viewingProject.title}</h2>
                <button
                  onClick={() => setViewingProject(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Image Gallery */}
              {viewingProject.image_url && (
                <div className="relative bg-gray-900">
                  <img
                    src={viewingProject.image_url}
                    alt={viewingProject.title}
                    className="w-full h-96 object-contain"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Category */}
                <div>
                  <span className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-semibold">
                    {viewingProject.category}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">وصف المشروع</h3>
                  <p className="text-gray-700 leading-relaxed">{viewingProject.description}</p>
                </div>

                {/* Links */}
                {viewingProject.project_url && (
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <a
                      href={viewingProject.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                    >
                      <FaExternalLinkAlt />
                      عرض مباشر
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

