import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaCamera, 
  FaSave,
  FaDollarSign,
  FaGlobe,
  FaLinkedin,
  FaGithub,
  FaBriefcase,
  FaTimes,
  FaExternalLinkAlt,
  FaPlus,
  FaFolderOpen,
  FaSpinner
} from 'react-icons/fa';
import Link from 'next/link';
import ReviewList from '../../components/reviews/ReviewList';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function FreelancerProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    title: '',
    hourlyRate: '',
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: ''
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const [featuredProjects, setFeaturedProjects] = useState([]);

  // Load profile data from API
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const sellerService = (await import('../../services/sellerService')).default;
      const response = await sellerService.getMyProfile();
      
      const profile = response.data || {};
      const userData = profile.user || {};
      
      // Parse skills (can be JSON string or array)
      let skillsList = [];
      if (profile.skills) {
        if (typeof profile.skills === 'string') {
          try {
            skillsList = JSON.parse(profile.skills);
          } catch {
            // If not JSON, treat as comma-separated
            skillsList = profile.skills.split(',').map(s => s.trim()).filter(s => s);
          }
        } else if (Array.isArray(profile.skills)) {
          skillsList = profile.skills;
        }
      }

      setFormData({
        name: userData.name || user?.name || '',
        email: userData.email || user?.email || '',
        bio: profile.bio || '',
        title: profile.title || '',
        hourlyRate: profile.hourly_rate || '',
        portfolioUrl: profile.portfolio_url || '',
        linkedinUrl: profile.linkedin_url || '',
        githubUrl: profile.github_url || ''
      });

      setSkills(skillsList);
      
      // Load portfolio items
      if (profile.portfolioItems && Array.isArray(profile.portfolioItems)) {
        setFeaturedProjects(profile.portfolioItems.slice(0, 3).map(item => ({
          id: item.id,
          title: item.title,
          image: item.image_url || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop',
          demo: item.project_url || '#',
        })));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // If profile doesn't exist (404), initialize with user data only
      if (error.response?.status === 404) {
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          bio: '',
          title: '',
          hourlyRate: '',
          portfolioUrl: '',
          linkedinUrl: '',
          githubUrl: ''
        });
        setSkills([]);
      } else {
        toast.error('حدث خطأ في تحميل الملف الشخصي');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const sellerService = (await import('../../services/sellerService')).default;
      
      // Prepare data for API
      const updateData = {
        display_name: formData.name,
        title: formData.title,
        bio: formData.bio,
        skills: JSON.stringify(skills), // Send as JSON string
        hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        portfolio_url: formData.portfolioUrl || null,
        linkedin_url: formData.linkedinUrl || null,
        github_url: formData.githubUrl || null,
      };

      await sellerService.updateProfile(updateData);
      
      toast.success('تم تحديث الملف الشخصي بنجاح!');
      
      // Reload profile to get updated data
      await loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ في تحديث الملف الشخصي');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>الملف الشخصي | Mahara</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">الملف الشخصي</h1>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaSpinner className="w-12 h-12 text-primary-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">جاري تحميل الملف الشخصي...</p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">الصورة الشخصية</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FaCamera className="text-gray-600" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{formData.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{formData.title}</p>
                <p className="text-sm text-gray-500 mb-3">
                  مستقل منذ {user?.created_at ? new Date(user.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' }) : '2024'}
                </p>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  تغيير الصورة
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">المعلومات الشخصية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المسمى الوظيفي
                </label>
                <div className="relative">
                  <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Full Stack Developer, Graphic Designer"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نبذة عنك
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="اكتب نبذة مختصرة عنك وعن خبراتك..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">المعلومات المهنية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  السعر بالساعة (USD)
                </label>
                <div className="relative">
                  <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    min="5"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">المهارات</h2>
            
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="أضف مهارة جديدة..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                >
                  إضافة
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-primary-900"
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">الروابط الاجتماعية والمعرض</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رابط معرض الأعمال (Portfolio)
                </label>
                <div className="relative">
                  <FaGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://portfolio.example.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <FaLinkedin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GitHub
                </label>
                <div className="relative">
                  <FaGithub className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  التقييمات والمراجعات
                </h2>
                <p className="text-sm text-gray-600">شاهد تقييمات العملاء عنك</p>
              </div>
              {user?.id && (
                <Link 
                  href={`/freelancer/${user.id}`}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold text-sm"
                >
                  <FaExternalLinkAlt />
                  عرض الملف الشخصي العام
                </Link>
              )}
            </div>
            
            {user?.id ? (
              <ReviewList freelancerId={user.id} />
            ) : (
              <div className="text-center py-8">
                <FaStar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">لا توجد تقييمات بعد</p>
              </div>
            )}
          </div>

          {/* Featured Projects Showcase */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl shadow-sm border border-primary-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <FaFolderOpen className="text-primary-600" />
                  معرض المشاريع المميزة
                </h2>
                <p className="text-sm text-gray-600">اعرض أفضل أعمالك للعملاء المحتملين</p>
              </div>
              <Link href="/freelancer/portfolio" className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-sm">
                <FaPlus />
                إدارة المشاريع
              </Link>
            </div>

            {featuredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-sm line-clamp-1">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-3">
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-semibold"
                      >
                        <FaExternalLinkAlt className="w-3 h-3" />
                        عرض المشروع
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <FaFolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">لم تقم بإضافة مشاريع بعد</p>
                <Link href="/freelancer/portfolio" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold">
                  <FaPlus />
                  إضافة مشروع
                </Link>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-primary-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-primary-600">{featuredProjects.length}</span> مشاريع مميزة
                </p>
                <Link href="/freelancer/portfolio" className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                  عرض جميع المشاريع
                  <FaExternalLinkAlt className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <FaSave />
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </DashboardLayout>
  );
}

