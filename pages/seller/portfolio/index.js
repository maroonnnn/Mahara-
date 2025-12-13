import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PortfolioGrid from '../../../components/portfolio/PortfolioGrid';
import { portfolioService } from '../../../services/portfolioService';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaImage, 
  FaSpinner,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function SellerPortfolioPage() {
  const { user, isAuthenticated, isFreelancer } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    project_url: '',
    technologies: '',
    category: '',
    completed_date: ''
  });

  useEffect(() => {
    // Load seller profile from localStorage
    const profileData = localStorage.getItem('sellerProfile');
    if (profileData) {
      setSellerProfile(JSON.parse(profileData));
      setShowWelcome(true);
    }
    
    // Allow access even without authentication for testing
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      // In a real app, this would use portfolioService.getMyPortfolio()
      // For now, using mock data
      const mockData = [
        {
          id: 1,
          title: 'Modern Interior Design',
          description: 'A beautiful modern interior design for a luxury apartment',
          image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          project_url: 'https://example.com',
          technologies: ['3D Max', 'Photoshop', 'VRay'],
          category: 'Interior Design',
          completed_date: '2024-01-15'
        },
        {
          id: 2,
          title: 'E-commerce Website',
          description: 'Full-stack e-commerce website with payment integration',
          image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
          project_url: 'https://example.com',
          technologies: ['React', 'Node.js', 'MongoDB'],
          category: 'Web Development',
          completed_date: '2024-02-20'
        },
      ];
      setPortfolioItems(mockData);
      // const data = await portfolioService.getMyPortfolio();
      // setPortfolioItems(data.portfolio_items || []);
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل تحميل المحفظة' : 'Failed to load portfolio');
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      project_url: '',
      technologies: '',
      category: '',
      completed_date: ''
    });
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url || '',
      project_url: item.project_url || '',
      technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : (item.technologies || ''),
      category: item.category || '',
      completed_date: item.completed_date || ''
    });
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = async (itemId) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العنصر؟' : 'Are you sure you want to delete this item?')) {
      return;
    }

    try {
      // await portfolioService.deletePortfolioItem(itemId);
      setPortfolioItems(prev => prev.filter(item => item.id !== itemId));
      toast.success(language === 'ar' ? 'تم الحذف بنجاح' : 'Item deleted successfully');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل الحذف' : 'Failed to delete item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (selectedItem) {
        // await portfolioService.updatePortfolioItem(selectedItem.id, data);
        setPortfolioItems(prev => prev.map(item => 
          item.id === selectedItem.id ? { ...item, ...data, technologies: data.technologies } : item
        ));
        toast.success(language === 'ar' ? 'تم التحديث بنجاح' : 'Portfolio item updated successfully');
      } else {
        // const newItem = await portfolioService.createPortfolioItem(data);
        const newItem = {
          id: Date.now(),
          ...data,
          technologies: data.technologies
        };
        setPortfolioItems(prev => [...prev, newItem]);
        toast.success(language === 'ar' ? 'تمت الإضافة بنجاح' : 'Portfolio item added successfully');
      }
      setShowModal(false);
    } catch (error) {
      toast.error(language === 'ar' ? 'فشلت العملية' : 'Operation failed');
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <FaSpinner className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{language === 'ar' ? 'محفظة الأعمال - Fiverr' : 'Portfolio - Fiverr'}</title>
      </Head>

      <DashboardLayout allowUnauthenticated={true}>
        <div className="py-8">
          {/* Welcome Message */}
          {showWelcome && sellerProfile && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 mb-8 relative">
              <button
                onClick={() => setShowWelcome(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
              <div className="flex items-start gap-4">
                <div className="bg-green-500 text-white p-3 rounded-full">
                  <FaCheckCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {language === 'ar' ? 'مرحباً بك، ' : 'Welcome, '}{sellerProfile.personalInfo.displayName}!
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {language === 'ar' 
                      ? 'تم إكمال ملفك الشخصي بنجاح! الآن يمكنك إضافة مشاريعك إلى محفظة الأعمال لعرض مهاراتك للعملاء.'
                      : 'Your profile is complete! Now you can add projects to your portfolio to showcase your skills to clients.'}
                  </p>
                  
                  {/* Profile Summary */}
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'المهنة:' : 'Occupation:'}</p>
                        <p className="font-semibold text-gray-900">{sellerProfile.professionalInfo.occupation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'المهارات:' : 'Skills:'}</p>
                        <p className="font-semibold text-gray-900">
                          {sellerProfile.professionalInfo.skills.slice(0, 3).join(', ')}
                          {sellerProfile.professionalInfo.skills.length > 3 && ` +${sellerProfile.professionalInfo.skills.length - 3}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'اللغات:' : 'Languages:'}</p>
                        <p className="font-semibold text-gray-900">
                          {sellerProfile.personalInfo.languages.map(l => l.language).slice(0, 3).join(', ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'حالة الحساب:' : 'Account Status:'}</p>
                        <div className="flex items-center gap-2">
                          {sellerProfile.accountSecurity.emailVerified && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {language === 'ar' ? 'بريد موثق' : 'Email Verified'}
                            </span>
                          )}
                          {sellerProfile.accountSecurity.phoneVerified && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {language === 'ar' ? 'هاتف موثق' : 'Phone Verified'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-3">
                    <Link
                      href="/seller/create-gig"
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                    >
                      {language === 'ar' ? 'أنشئ أول خدمة' : 'Create Your First Gig'}
                    </Link>
                    <Link
                      href="/seller/profile/edit"
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-semibold"
                    >
                      {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'محفظة أعمالي' : 'My Portfolio'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'اعرض أفضل أعمالك للعملاء المحتملين'
                  : 'Showcase your best work to potential clients'
                }
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <FaPlus />
              <span>{language === 'ar' ? 'إضافة مشروع' : 'Add Project'}</span>
            </button>
          </div>

          {/* Portfolio Grid */}
          <PortfolioGrid 
            portfolioItems={portfolioItems} 
            onItemClick={handleItemClick}
          />

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedItem 
                      ? (language === 'ar' ? 'تعديل المشروع' : 'Edit Project')
                      : (language === 'ar' ? 'إضافة مشروع جديد' : 'Add New Project')
                    }
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'العنوان' : 'Title'} *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الوصف' : 'Description'}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رابط الصورة' : 'Image URL'} *
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رابط المشروع' : 'Project URL'}
                    </label>
                    <input
                      type="url"
                      value={formData.project_url}
                      onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الفئة' : 'Category'}
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder={language === 'ar' ? 'مثل: تصميم الويب' : 'e.g., Web Design'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'تاريخ الإتمام' : 'Completed Date'}
                      </label>
                      <input
                        type="date"
                        value={formData.completed_date}
                        onChange={(e) => setFormData({ ...formData, completed_date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'التقنيات المستخدمة' : 'Technologies Used'}
                    </label>
                    <input
                      type="text"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={language === 'ar' ? 'مفصولة بفواصل: React, Node.js' : 'Separated by commas: React, Node.js'}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'ar' ? 'افصل بين التقنيات بفواصل' : 'Separate technologies with commas'}
                    </p>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                    >
                      {selectedItem 
                        ? (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')
                        : (language === 'ar' ? 'إضافة' : 'Add')
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}

