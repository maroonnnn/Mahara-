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
  FaTimes,
  FaExternalLinkAlt,
  FaGithub,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaCode
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
      liveDemo: 'https://example.com/portfolio1',
      githubLink: '',
      technologies: ['Adobe Illustrator', 'Photoshop'],
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      title: 'تطوير موقع إلكتروني للتجارة الإلكترونية',
      description: 'موقع متكامل للتجارة الإلكترونية باستخدام React وNode.js مع نظام دفع آمن وإدارة المنتجات',
      category: 'Programming & Tech',
      images: [
        'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
      ],
      liveDemo: 'https://example.com/portfolio2',
      githubLink: 'https://github.com/username/ecommerce-project',
      technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      createdAt: '2024-01-05'
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagePreview, setImagePreview] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    liveDemo: '',
    githubLink: '',
    technologies: [],
    images: []
  });
  
  const [newTech, setNewTech] = useState('');

  const handleAddPortfolio = () => {
    setShowAddForm(true);
    setImagePreview([]);
    setFormData({
      title: '',
      description: '',
      category: '',
      liveDemo: '',
      githubLink: '',
      technologies: [],
      images: []
    });
  };

  const handleEditPortfolio = (portfolio) => {
    setEditingId(portfolio.id);
    setShowAddForm(true);
    setImagePreview(portfolio.images || []);
    setFormData({
      title: portfolio.title,
      description: portfolio.description,
      category: portfolio.category,
      liveDemo: portfolio.liveDemo || '',
      githubLink: portfolio.githubLink || '',
      technologies: portfolio.technologies || [],
      images: portfolio.images || []
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...newPreviews]);
    
    // In a real app, you'd upload to a server here
    // For now, we'll use placeholder URLs
    const newImageUrls = files.map((file, index) => 
      `https://images.unsplash.com/photo-${Date.now() + index}?w=400&h=300&fit=crop`
    );
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImageUrls]
    }));
  };

  const handleRemoveImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const handleRemoveTechnology = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
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
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPortfolios(prev => [...prev, newPortfolio]);
    }
    
    setShowAddForm(false);
    setEditingId(null);
    setImagePreview([]);
    setFormData({
      title: '',
      description: '',
      category: '',
      liveDemo: '',
      githubLink: '',
      technologies: [],
      images: []
    });
  };

  const handleDeletePortfolio = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا العمل من الحافظة؟')) {
      setPortfolios(prev => prev.filter(p => p.id !== id));
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

              {/* Live Demo & GitHub Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaPlay className="text-green-500" />
                    رابط العرض المباشر (Live Demo)
                  </label>
                  <input
                    type="url"
                    value={formData.liveDemo}
                    onChange={(e) => setFormData({ ...formData, liveDemo: e.target.value })}
                    placeholder="https://your-project.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaGithub className="text-gray-800" />
                    رابط GitHub
                  </label>
                  <input
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Technologies Used */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaCode className="text-blue-500" />
                  التقنيات المستخدمة
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTechnology();
                      }
                    }}
                    placeholder="مثال: React, Node.js, Photoshop"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTechnology}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                  >
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        className="hover:text-blue-900"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
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

                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {imagePreview.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  {portfolio.images && portfolio.images.length > 0 ? (
                    <>
                      <img
                        src={portfolio.images[0]}
                        alt={portfolio.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {portfolio.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded-full">
                          +{portfolio.images.length - 1}
                        </div>
                      )}
                    </>
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
                  
                  {/* Technologies */}
                  {portfolio.technologies && portfolio.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {portfolio.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {portfolio.technologies.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          +{portfolio.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Category & Links */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-semibold">
                      {portfolio.category}
                    </span>
                    <div className="flex items-center gap-3">
                      {portfolio.liveDemo && (
                        <a
                          href={portfolio.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-green-600 hover:text-green-700 transition-colors"
                          title="عرض مباشر"
                        >
                          <FaExternalLinkAlt className="w-4 h-4" />
                        </a>
                      )}
                      {portfolio.githubLink && (
                        <a
                          href={portfolio.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-800 hover:text-gray-900 transition-colors"
                          title="GitHub"
                        >
                          <FaGithub className="w-4 h-4" />
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
              {viewingProject.images && viewingProject.images.length > 0 && (
                <div className="relative bg-gray-900">
                  <img
                    src={viewingProject.images[currentImageIndex]}
                    alt={viewingProject.title}
                    className="w-full h-96 object-contain"
                  />
                  
                  {viewingProject.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all"
                      >
                        <FaChevronLeft className="text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all"
                      >
                        <FaChevronRight className="text-gray-800" />
                      </button>
                      
                      {/* Image indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {viewingProject.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentImageIndex ? 'bg-white w-8' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
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

                {/* Technologies */}
                {viewingProject.technologies && viewingProject.technologies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FaCode className="text-blue-500" />
                      التقنيات المستخدمة
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingProject.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {(viewingProject.liveDemo || viewingProject.githubLink) && (
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    {viewingProject.liveDemo && (
                      <a
                        href={viewingProject.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                      >
                        <FaExternalLinkAlt />
                        عرض مباشر
                      </a>
                    )}
                    {viewingProject.githubLink && (
                      <a
                        href={viewingProject.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold"
                      >
                        <FaGithub />
                        GitHub
                      </a>
                    )}
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

