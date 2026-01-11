import Head from 'next/head';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash,
  FaTimes,
  FaSave
} from 'react-icons/fa';

export default function AdminCategories() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    is_active: true
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCategories();
      console.log('Categories API response:', response);
      
      const categoriesData = response.data || [];
      const categoriesList = Array.isArray(categoriesData) ? categoriesData : [];
      
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error(language === 'ar' ? 'فشل تحميل الفئات' : 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon || '',
        is_active: category.is_active !== undefined ? category.is_active : true
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        icon: '',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: '',
      is_active: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Update existing category
        await adminService.updateCategory(editingCategory.id, formData);
        toast.success(language === 'ar' ? 'تم تحديث الفئة بنجاح' : 'Category updated successfully');
      } else {
        // Add new category
        await adminService.createCategory(formData);
        toast.success(language === 'ar' ? 'تم إضافة الفئة بنجاح' : 'Category created successfully');
      }
      
      loadCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
      const message = error.response?.data?.message || (language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving category');
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الفئة؟' : 'Are you sure you want to delete this category?')) {
      try {
        await adminService.deleteCategory(id);
        toast.success(language === 'ar' ? 'تم حذف الفئة بنجاح' : 'Category deleted successfully');
        loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        const message = error.response?.data?.message || (language === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error deleting category');
        toast.error(message);
      }
    }
  };

  const handleToggleActive = async (id) => {
    const category = categories.find(cat => cat.id === id);
    if (!category) return;

    try {
      await adminService.updateCategory(id, {
        is_active: !category.is_active
      });
      toast.success(language === 'ar' ? 'تم تحديث حالة الفئة' : 'Category status updated');
      loadCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(language === 'ar' ? 'حدث خطأ أثناء التحديث' : 'Error updating category');
    }
  };

  return (
    <>
      <Head>
        <title>{language === 'ar' ? 'إدارة الفئات - Mahara' : 'Category Management - Mahara'}</title>
      </Head>

      <DashboardLayout requiredRole="admin">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'إدارة الفئات' : 'Category Management'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar' ? 'إدارة فئات المشاريع والخدمات' : 'Manage project and service categories'}
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              <FaPlus />
              {language === 'ar' ? 'إضافة فئة جديدة' : 'Add New Category'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm mb-2">{language === 'ar' ? 'إجمالي الفئات' : 'Total Categories'}</h3>
              <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm mb-2">{language === 'ar' ? 'الفئات النشطة' : 'Active Categories'}</h3>
              <p className="text-3xl font-bold text-green-600">{categories.filter(c => c.is_active).length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm mb-2">{language === 'ar' ? 'إجمالي المشاريع' : 'Total Projects'}</h3>
              <p className="text-3xl font-bold text-blue-600">{categories.reduce((sum, c) => sum + (c.projects_count || 0), 0)}</p>
            </div>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500 mb-4"></div>
              <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className={`bg-white rounded-lg shadow-md p-6 ${!category.active ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{category.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{category.name}</h3>
                      <p className="text-xs text-gray-500">{category.projects_count || 0} {language === 'ar' ? 'مشاريع' : 'projects'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.is_active ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(category.id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      category.is_active 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {category.is_active ? (language === 'ar' ? 'تعطيل' : 'Deactivate') : (language === 'ar' ? 'تفعيل' : 'Activate')}
                  </button>
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingCategory 
                      ? (language === 'ar' ? 'تعديل الفئة' : 'Edit Category')
                      : (language === 'ar' ? 'إضافة فئة جديدة' : 'Add New Category')}
                  </h2>
                  <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اسم الفئة' : 'Category Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'أيقونة (إيموجي)' : 'Icon (Emoji)'}
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="🎨"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                      {language === 'ar' ? 'الفئة نشطة' : 'Category Active'}
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                    >
                      <FaSave />
                      {language === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
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

