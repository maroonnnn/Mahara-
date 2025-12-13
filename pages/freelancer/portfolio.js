import { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaFileAlt,
  FaLink,
  FaSave,
  FaTimes
} from 'react-icons/fa';

export default function FreelancerPortfolioPage() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([
    {
      id: 1,
      title: 'تصميم شعار لشركة تكنولوجيا',
      description: 'تصميم شعار عصري وحديث لشركة متخصصة في التكنولوجيا',
      category: 'Graphics & Design',
      images: [
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400&h=300&fit=crop'
      ],
      link: 'https://example.com/portfolio1',
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      title: 'تطوير موقع إلكتروني للتجارة الإلكترونية',
      description: 'موقع متكامل للتجارة الإلكترونية باستخدام React وNode.js',
      category: 'Programming & Tech',
      images: [
        'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop'
      ],
      link: 'https://example.com/portfolio2',
      createdAt: '2024-01-05'
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    link: '',
    images: []
  });

  const handleAddPortfolio = () => {
    setShowAddForm(true);
    setFormData({
      title: '',
      description: '',
      category: '',
      link: '',
      images: []
    });
  };

  const handleEditPortfolio = (portfolio) => {
    setEditingId(portfolio.id);
    setShowAddForm(true);
    setFormData({
      title: portfolio.title,
      description: portfolio.description,
      category: portfolio.category,
      link: portfolio.link,
      images: portfolio.images
    });
  };

  const handleSavePortfolio = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing
      setPortfolios(prev => prev.map(p => 
        p.id === editingId ? { ...p, ...formData } : p
      ));
    } else {
      // Add new
      const newPortfolio = {
        id: portfolios.length + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPortfolios(prev => [...prev, newPortfolio]);
    }
    
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      link: '',
      images: []
    });
  };

  const handleDeletePortfolio = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا العمل من الحافظة؟')) {
      setPortfolios(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>الحافظة | Fiverr Clone</title>
        <meta name="description" content="Portfolio" />
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

            <form onSubmit={handleSavePortfolio} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  العنوان <span className="text-red-500">*</span>
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
                  placeholder="اكتب وصفاً مفصلاً عن العمل..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الفئة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">اختر الفئة</option>
                    <option value="Graphics & Design">Graphics & Design</option>
                    <option value="Programming & Tech">Programming & Tech</option>
                    <option value="Writing & Translation">Writing & Translation</option>
                    <option value="Video & Animation">Video & Animation</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رابط العمل (اختياري)
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الصور (اختياري)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FaImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">اسحب الصور هنا أو</p>
                  <label className="cursor-pointer">
                    <span className="text-primary-500 hover:text-primary-600 font-semibold">تصفح الصور</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG (حجم أقصى 5 ميجابايت لكل صورة)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <FaSave />
                  حفظ
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
        {portfolios.length === 0 ? (
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
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {portfolio.images && portfolio.images.length > 0 ? (
                    <img
                      src={portfolio.images[0]}
                      alt={portfolio.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImage className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleEditPortfolio(portfolio)}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                      title="تعديل"
                    >
                      <FaEdit className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeletePortfolio(portfolio.id)}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-red-100 transition-colors"
                      title="حذف"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {portfolio.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {portfolio.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                      {portfolio.category}
                    </span>
                    {portfolio.link && (
                      <a
                        href={portfolio.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600"
                        title="عرض العمل"
                      >
                        <FaLink />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

