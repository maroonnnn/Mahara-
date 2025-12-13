import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  FaFileAlt, 
  FaDollarSign, 
  FaClock, 
  FaListAlt,
  FaPaperclip,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';

export default function NewProjectPage() {
  const router = useRouter();
  const { user, isClient, isFreelancer, isAuthenticated, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);

  // Role-based access control
  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      alert('يجب تسجيل الدخول أولاً');
      router.push('/login');
      return;
    }

    // Freelancers/Sellers cannot create projects
    if (isFreelancer) {
      alert('❌ عذراً! لا يمكن للمستقلين (البائعين) إنشاء مشاريع.\n\nيمكنك فقط تقديم عروض على المشاريع المتاحة.');
      router.push('/freelancer/projects'); // Redirect to browse projects
      return;
    }

    // Only clients can create projects
    if (!isClient) {
      alert('❌ عذراً! فقط العملاء يمكنهم إنشاء مشاريع جديدة.');
      router.push('/');
      return;
    }
  }, [authLoading, isAuthenticated, isClient, isFreelancer, router]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    skills: [],
    budget: '',
    budgetType: 'fixed', // fixed or hourly
    deliveryTime: '',
    deliveryUnit: 'days', // days, weeks, months
    attachments: [],
    additionalInfo: ''
  });

  const categories = [
    { 
      id: 'graphics-design', 
      name: 'Graphics & Design',
      subcategories: ['Logo Design', 'Brand Style Guides', 'Web Design', 'Social Media Design', 'Illustration']
    },
    { 
      id: 'digital-marketing', 
      name: 'Digital Marketing',
      subcategories: ['Social Media Marketing', 'SEO', 'Content Marketing', 'Email Marketing', 'Influencer Marketing']
    },
    { 
      id: 'writing-translation', 
      name: 'Writing & Translation',
      subcategories: ['Content Writing', 'Copywriting', 'Translation', 'Proofreading', 'Resume Writing']
    },
    { 
      id: 'video-animation', 
      name: 'Video & Animation',
      subcategories: ['Video Editing', 'Animation', 'Video Ads', 'Logo Animation', '3D Product Animation']
    },
    { 
      id: 'programming-tech', 
      name: 'Programming & Tech',
      subcategories: ['Website Development', 'Mobile Apps', 'WordPress', 'E-commerce Development', 'API Development']
    },
    { 
      id: 'music-audio', 
      name: 'Music & Audio',
      subcategories: ['Voice Over', 'Music Production', 'Audio Editing', 'Podcast Editing', 'Sound Design']
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      category: e.target.value,
      subcategory: '' // Reset subcategory when category changes
    }));
  };

  const handleSkillAdd = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.category || !formData.subcategory || !formData.description || !formData.budget || !formData.deliveryTime) {
      alert('يرجى ملء جميع الحقول المطلوبة (المعلمة بعلامة *)');
      return;
    }

    if (parseFloat(formData.budget) < 5) {
      alert('الميزانية يجب أن تكون 5 دولار على الأقل');
      return;
    }
    
    try {
      // Prepare project data for API
      const projectData = {
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        skills: formData.skills,
        budget: parseFloat(formData.budget),
        budgetType: formData.budgetType,
        deliveryTime: `${formData.deliveryTime} ${formData.deliveryUnit}`,
        additionalInfo: formData.additionalInfo,
        status: 'open' // Project starts as open for freelancers to view
      };
      
      console.log('Submitting project:', projectData);
      
      try {
        // Try to call API to create project
        const projectService = (await import('../../../services/projectService')).default;
        const response = await projectService.createProject(projectData);
        console.log('Project created via API:', response);
      } catch (apiError) {
        console.log('API not available, using mock mode:', apiError.message);
        // If API fails, continue anyway (mock mode)
      }
      
      // Show success message and redirect (works even without backend)
      alert('تم نشر المشروع بنجاح! 🎉\n\nسيتمكن المستقلون من رؤيته الآن وتقديم عروضهم.\n\n(ملاحظة: في بيئة التطوير الحالية، المشروع محفوظ محلياً. قم بتشغيل الـ Backend لحفظ البيانات بشكل دائم)');
      
      // Save to localStorage as backup (for development)
      const savedProjects = JSON.parse(localStorage.getItem('myProjects') || '[]');
      savedProjects.push({
        id: Date.now(),
        ...projectData,
        createdAt: new Date().toISOString(),
        views: 0,
        proposals: 0,
        client: {
          id: user?.id || 1,
          name: user?.name || 'عميل',
          rating: user?.rating || 5.0,
          completedProjects: user?.completedProjects || 0
        }
      });
      localStorage.setItem('myProjects', JSON.stringify(savedProjects));
      
      // Redirect to projects page
      router.push('/client/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('حدث خطأ أثناء نشر المشروع. يرجى المحاولة مرة أخرى.\n\nالخطأ: ' + error.message);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <DashboardLayout>
      <Head>
        <title>مشروع جديد | Fiverr Clone</title>
        <meta name="description" content="Create a new project brief" />
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء مشروع جديد</h1>
          <p className="text-gray-600">أخبرنا بما تحتاجه وسنساعدك في العثور على المستقل المناسب</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    step >= stepNum 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > stepNum ? <FaCheckCircle /> : stepNum}
                  </div>
                  <span className={`text-xs mt-2 ${step >= stepNum ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
                    {stepNum === 1 && 'تفاصيل المشروع'}
                    {stepNum === 2 && 'الميزانية والوقت'}
                    {stepNum === 3 && 'المراجعة'}
                  </span>
                </div>
                {stepNum < 3 && (
                  <div className={`h-1 flex-1 mx-4 ${step > stepNum ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          
          {/* Step 1: Project Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaFileAlt className="text-primary-500" />
                تفاصيل المشروع
              </h2>

              {/* Project Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  عنوان المشروع <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="مثال: تصميم شعار احترافي لشركتي"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">اكتب عنواناً واضحاً وموجزاً لمشروعك</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الفئة <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              {formData.category && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الفئة الفرعية <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">اختر الفئة الفرعية</option>
                    {selectedCategory?.subcategories.map(subcat => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Project Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  وصف المشروع <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  placeholder="اشرح بالتفصيل ما تحتاجه، المتطلبات، الأهداف، والتفاصيل الأخرى..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">كلما كان الوصف أكثر تفصيلاً، كانت العروض أفضل</p>
              </div>

              {/* Skills Required */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المهارات المطلوبة
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    id="skillInput"
                    placeholder="أضف مهارة (مثل: Photoshop, Illustrator)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSkillAdd(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('skillInput');
                      handleSkillAdd(input.value);
                      input.value = '';
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill)}
                        className="text-primary-700 hover:text-primary-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المرفقات (اختياري)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FaPaperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">اسحب الملفات هنا أو</p>
                  <label className="cursor-pointer">
                    <span className="text-primary-500 hover:text-primary-600 font-semibold">تصفح الملفات</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PDF, DOC, JPG, PNG, ZIP (حجم أقصى 10 ميجابايت)</p>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              attachments: prev.attachments.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Budget & Timeline */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaDollarSign className="text-primary-500" />
                الميزانية والوقت
              </h2>

              {/* Budget Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  نوع الميزانية <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, budgetType: 'fixed' }))}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.budgetType === 'fixed'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold mb-1">ميزانية ثابتة</div>
                    <div className="text-xs text-gray-600">سعر محدد للمشروع بالكامل</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, budgetType: 'hourly' }))}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.budgetType === 'hourly'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold mb-1">سعر بالساعة</div>
                    <div className="text-xs text-gray-600">دفع حسب عدد الساعات</div>
                  </button>
                </div>
              </div>

              {/* Budget Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الميزانية {formData.budgetType === 'hourly' ? '(بالساعة)' : ''} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder={formData.budgetType === 'hourly' ? '50' : '500'}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    min="5"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.budgetType === 'hourly' 
                    ? 'السعر بالساعة الواحدة' 
                    : 'الميزانية الإجمالية للمشروع'}
                </p>
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  وقت التسليم المتوقع <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    placeholder="7"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    min="1"
                  />
                  <select
                    name="deliveryUnit"
                    value={formData.deliveryUnit}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="days">أيام</option>
                    <option value="weeks">أسابيع</option>
                    <option value="months">أشهر</option>
                  </select>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  معلومات إضافية (اختياري)
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="أي تفاصيل أخرى تريد إضافتها..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaCheckCircle className="text-primary-500" />
                مراجعة المشروع
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">عنوان المشروع</h3>
                  <p className="text-gray-900 font-medium">{formData.title || 'غير محدد'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">الفئة</h3>
                    <p className="text-gray-900">{categories.find(c => c.id === formData.category)?.name || 'غير محدد'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">الفئة الفرعية</h3>
                    <p className="text-gray-900">{formData.subcategory || 'غير محدد'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">الوصف</h3>
                  <p className="text-gray-900 whitespace-pre-line">{formData.description || 'غير محدد'}</p>
                </div>

                {formData.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">المهارات المطلوبة</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">نوع الميزانية</h3>
                    <p className="text-gray-900">{formData.budgetType === 'fixed' ? 'ميزانية ثابتة' : 'سعر بالساعة'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">الميزانية</h3>
                    <p className="text-gray-900 font-bold text-lg">${formData.budget || '0'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">وقت التسليم المتوقع</h3>
                  <p className="text-gray-900">
                    {formData.deliveryTime} {
                      formData.deliveryUnit === 'days' ? 'أيام' : 
                      formData.deliveryUnit === 'weeks' ? 'أسابيع' : 'أشهر'
                    }
                  </p>
                </div>

                {formData.attachments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">المرفقات</h3>
                    <div className="space-y-1">
                      {formData.attachments.map((file, index) => (
                        <p key={index} className="text-sm text-gray-700">📎 {file.name}</p>
                      ))}
                    </div>
                  </div>
                )}

                {formData.additionalInfo && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">معلومات إضافية</h3>
                    <p className="text-gray-900 whitespace-pre-line">{formData.additionalInfo}</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>ملاحظة:</strong> بعد نشر المشروع، سيتمكن المستقلون من إرسال عروضهم. 
                  يمكنك مراجعة العروض واختيار الأفضل لمشروعك.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                step === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaArrowRight />
              السابق
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                التالي
                <FaArrowLeft />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaCheckCircle />
                نشر المشروع
              </button>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

