import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import PublicLayout from '../../components/layout/PublicLayout';
import { 
  FaCheck, 
  FaUser, 
  FaBriefcase, 
  FaShieldAlt,
  FaCamera,
  FaGlobe
} from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function SellerOnboarding() {
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data for all steps
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    displayName: '',
    profilePicture: null,
    profilePicturePreview: null,
    description: '',
    languages: [{ language: '', level: '' }],
    
    // Professional Info
    occupation: '',
    occupationOther: '',
    skills: [],
    education: [{ country: '', college: '', title: '', major: '', year: '' }],
    certification: [{ certificate: '', certifiedFrom: '', year: '' }],
    personalWebsite: '',
    
    // Account Security
    email: user?.email || '',
    emailVerified: false,
    phone: '',
    phoneVerified: false,
  });

  const steps = [
    { 
      number: 1, 
      title: language === 'ar' ? 'معلومات شخصية' : 'Personal Info',
      icon: <FaUser />,
      description: language === 'ar' ? 'أخبرنا المزيد عنك' : 'Tell us a bit about yourself'
    },
    { 
      number: 2, 
      title: language === 'ar' ? 'معلومات مهنية' : 'Professional Info',
      icon: <FaBriefcase />,
      description: language === 'ar' ? 'ما هي مهاراتك وخبرتك' : 'What are your skills and experience'
    },
    { 
      number: 3, 
      title: language === 'ar' ? 'أمان الحساب' : 'Account Security',
      icon: <FaShieldAlt />,
      description: language === 'ar' ? 'تأكيد بريدك الإلكتروني ورقم هاتفك' : 'Verify your email and phone number'
    },
  ];

  const occupationOptions = [
    'Business',
    'Customer Care',
    'Data Science',
    'Game Concept Design',
    'Market Research',
    'Sales',
    'Other'
  ];

  const skillOptions = [
    'Business Consulting',
    'Business Plans',
    'CRM Management',
    'E-Commerce Management',
    'ERP Management',
    'Game Concept Design',
    'HR Consulting',
    'Legal Consulting',
    'Presentations',
    'Project Management',
    'Supply Chain Management',
    'Virtual Assistant',
  ];

  const languageOptions = [
    'English',
    'Arabic',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Russian',
    'Portuguese',
    'Italian',
  ];

  const levelOptions = [
    { value: 'basic', label: language === 'ar' ? 'مبتدئ' : 'Basic' },
    { value: 'conversational', label: language === 'ar' ? 'محادثة' : 'Conversational' },
    { value: 'fluent', label: language === 'ar' ? 'متقن' : 'Fluent' },
    { value: 'native', label: language === 'ar' ? 'أصلي' : 'Native/Bilingual' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: file,
        profilePicturePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleLanguageChange = (index, field, value) => {
    const newLanguages = [...formData.languages];
    newLanguages[index][field] = value;
    setFormData(prev => ({ ...prev, languages: newLanguages }));
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', level: '' }]
    }));
  };

  const removeLanguage = (index) => {
    if (formData.languages.length > 1) {
      const newLanguages = formData.languages.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, languages: newLanguages }));
    }
  };

  const handleSkillToggle = (skill) => {
    const newSkills = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { country: '', college: '', title: '', major: '', year: '' }]
    }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certification: [...prev.certification, { certificate: '', certifiedFrom: '', year: '' }]
    }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.fullName.trim()) {
        toast.error(language === 'ar' ? 'الاسم الكامل مطلوب' : 'Full name is required');
        return false;
      }
      if (!formData.displayName.trim()) {
        toast.error(language === 'ar' ? 'الاسم المعروض مطلوب' : 'Display name is required');
        return false;
      }
      if (!formData.description.trim()) {
        toast.error(language === 'ar' ? 'الوصف مطلوب' : 'Description is required');
        return false;
      }
      if (formData.description.length > 600) {
        toast.error(language === 'ar' ? 'الوصف يجب ألا يتجاوز 600 حرف' : 'Description must not exceed 600 characters');
        return false;
      }
    } else if (step === 2) {
      if (!formData.occupation) {
        toast.error(language === 'ar' ? 'المهنة مطلوبة' : 'Occupation is required');
        return false;
      }
      if (formData.skills.length === 0) {
        toast.error(language === 'ar' ? 'يرجى اختيار مهارة واحدة على الأقل' : 'Please select at least one skill');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Prepare data for submission
      const onboardingData = {
        personalInfo: {
          fullName: formData.fullName,
          displayName: formData.displayName,
          profilePicture: formData.profilePicture,
          description: formData.description,
          languages: formData.languages.filter(lang => lang.language && lang.level),
        },
        professionalInfo: {
          occupation: formData.occupation,
          occupationOther: formData.occupationOther,
          skills: formData.skills,
          education: formData.education.filter(edu => edu.country || edu.college),
          certification: formData.certification.filter(cert => cert.certificate),
          personalWebsite: formData.personalWebsite,
        },
        accountSecurity: {
          emailVerified: formData.emailVerified,
          phoneVerified: formData.phoneVerified,
          phone: formData.phone,
        }
      };

      // Save to localStorage for now (will be replaced with API call)
      localStorage.setItem('sellerProfile', JSON.stringify(onboardingData));
      
      // Update user and mark profile as completed
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.role !== 'seller' && currentUser.role !== 'freelancer') {
        currentUser.role = 'freelancer';
      }
      currentUser.profileCompleted = true;
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      // Mark profile as completed
      localStorage.setItem(`profileCompleted_${currentUser.id}`, 'true');

      // Here you would submit to your API
      // const response = await sellerService.completeOnboarding(onboardingData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(language === 'ar' ? 'تم إكمال عملية التسجيل بنجاح! 🎉' : 'Onboarding completed successfully! 🎉');
      
      // Redirect to freelancer dashboard
      router.push('/freelancer/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error(language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى' : 'An error occurred. Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{language === 'ar' ? 'انضم كبائع - Fiverr' : 'Become a Seller - Fiverr'}</title>
      </Head>

      <PublicLayout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo and Progress Stepper */}
            <div className="mb-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary-500 mb-2">fiverr.</h1>
              </div>

              {/* Progress Stepper */}
              <div className="flex items-center justify-between mb-8">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex-1 relative">
                    <div className="flex items-center">
                      {/* Circle */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                        currentStep > step.number
                          ? 'bg-green-500 text-white'
                          : currentStep === step.number
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {currentStep > step.number ? <FaCheck /> : step.icon}
                      </div>

                      {/* Line */}
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 transition-all ${
                          currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>

                    {/* Label */}
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-semibold ${
                        currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-gray-600">
                  {steps[currentStep - 1].description}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  * {language === 'ar' ? 'حقول إلزامية' : 'Mandatory fields'}
                </p>
              </div>

              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}*
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={language === 'ar' ? 'أحمد' : 'Ahmad'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'اللقب' : 'Last Name'}
                      </label>
                      <input
                        type="text"
                        placeholder={language === 'ar' ? 'محمد' : 'Mohammed'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الاسم المعروض' : 'Display Name'}*
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder={language === 'ar' ? 'أحمد م.' : 'Ahmad A.'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'صورة الملف الشخصي' : 'Profile Picture'}*
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {formData.profilePicturePreview ? (
                          <img src={formData.profilePicturePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <FaCamera className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <label className="cursor-pointer px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
                        <span className="text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'اختر صورة' : 'Choose Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الوصف' : 'Description'}*
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="5"
                      maxLength="600"
                      placeholder={language === 'ar' 
                        ? 'أنا منصة تساعد الطلاب والمدربين على التواصل بسهولة...' 
                        : 'I am a platform that helps students and instructors connect easily...'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-sm text-gray-500 mt-1 text-right">
                      {formData.description.length} / 600
                    </p>
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اللغات' : 'Languages'}*
                    </label>
                    {formData.languages.map((lang, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <select
                          value={lang.language}
                          onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                          className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">{language === 'ar' ? 'اللغة' : 'Language'}</option>
                          {languageOptions.map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                        <select
                          value={lang.level}
                          onChange={(e) => handleLanguageChange(index, 'level', e.target.value)}
                          className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">{language === 'ar' ? 'المستوى' : 'Level'}</option>
                          {levelOptions.map(l => (
                            <option key={l.value} value={l.value}>{l.label}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeLanguage(index)}
                          className="col-span-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          {language === 'ar' ? 'إزالة' : 'Remove'}
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addLanguage}
                      className="text-primary-500 hover:text-primary-600 font-semibold text-sm"
                    >
                      + {language === 'ar' ? 'إضافة لغة جديدة' : 'Add New'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Info */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Occupation */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'مهنتك' : 'Your Occupation'}*
                      </label>
                      <select
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">{language === 'ar' ? 'اختر واحداً' : 'Choose one'}</option>
                        {occupationOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'منذ' : 'From'}
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>2025</option>
                        <option>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                        <option>2020</option>
                      </select>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'المهارات' : 'Skills'}*
                    </label>
                    <p className="text-sm text-gray-500 mb-3">
                      {language === 'ar' ? 'اختر ما يصل إلى 5 من مهاراتك الأفضل' : 'Choose two to five of your best skills at business'}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {skillOptions.map(skill => (
                        <label
                          key={skill}
                          className={`flex items-center gap-2 px-3 py-2 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.skills.includes(skill)
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(skill)}
                            onChange={() => handleSkillToggle(skill)}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm">{skill}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="mt-3 text-primary-500 hover:text-primary-600 font-semibold text-sm"
                    >
                      + {language === 'ar' ? 'إضافة أخرى' : 'Add New'}
                    </button>
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'التعليم' : 'Education'}
                    </label>
                    {formData.education.map((edu, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 p-4 border border-gray-200 rounded-lg">
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option>{language === 'ar' ? 'الدولة/الكلية/الجامعة' : 'Country of College/University'}</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option>{language === 'ar' ? 'الكلية/الجامعة' : 'College/University Name'}</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option>{language === 'ar' ? 'اللقب' : 'Title'}</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option>{language === 'ar' ? 'التخصص' : 'Major'}</option>
                        </select>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addEducation}
                      className="text-primary-500 hover:text-primary-600 font-semibold text-sm"
                    >
                      + {language === 'ar' ? 'إضافة' : 'Add'}
                    </button>
                  </div>

                  {/* Certification */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الشهادات' : 'Certification'}
                    </label>
                    {formData.certification.map((cert, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 p-4 border border-gray-200 rounded-lg">
                        <input
                          type="text"
                          placeholder={language === 'ar' ? 'الشهادة أو الجائزة' : 'Certificate or Award'}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                          type="text"
                          placeholder={language === 'ar' ? 'معتمد من (مثل: Udemy)' : 'Certified from (e.g. Udemy)'}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option>{language === 'ar' ? 'السنة' : 'Year'}</option>
                          {Array.from({ length: 30 }, (_, i) => 2025 - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addCertification}
                      className="text-primary-500 hover:text-primary-600 font-semibold text-sm"
                    >
                      + {language === 'ar' ? 'إضافة' : 'Add'}
                    </button>
                  </div>

                  {/* Personal Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaGlobe className="inline mr-2" />
                      {language === 'ar' ? 'الموقع الشخصي' : 'Personal Website'}
                    </label>
                    <input
                      type="url"
                      name="personalWebsite"
                      value={formData.personalWebsite}
                      onChange={handleInputChange}
                      placeholder={language === 'ar' ? 'أدخل رابطاً إلى موقعك المهني' : 'Provide a link to your own professional website'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Account Security */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <p className="text-gray-600 mb-6">
                    {language === 'ar' 
                      ? 'من أجل سلامتك وأمانك في مجتمعنا، يرجى التحقق من بريدك الإلكتروني ورقم هاتفك حتى نتمكن من بناء حساب أكثر أماناً.'
                      : 'From your safety and security to our community, Please verify your email and phone number so that we can build a more secure account.'}
                  </p>

                  {/* Email */}
                  <div className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                        </h3>
                        <p className="text-sm text-gray-600">{formData.email || 'Private'}</p>
                      </div>
                      <button
                        type="button"
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                          formData.emailVerified
                            ? 'bg-gray-200 text-gray-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                        onClick={() => {
                          if (!formData.emailVerified) {
                            toast.success(language === 'ar' ? 'تم إرسال رمز التحقق' : 'Verification code sent');
                            setFormData(prev => ({ ...prev, emailVerified: true }));
                          }
                        }}
                      >
                        {formData.emailVerified 
                          ? (language === 'ar' ? 'تم التحقق' : 'Verified')
                          : (language === 'ar' ? 'تحقق' : 'Verify')}
                      </button>
                    </div>
                    {formData.emailVerified && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <FaCheck />
                        <span>{language === 'ar' ? 'تم التحقق من البريد الإلكتروني' : 'Email verified successfully'}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formData.phone || (language === 'ar' ? 'خاص' : 'Private')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {language === 'ar' ? 'لن نستخدم رقم هاتفك لأي شيء آخر غير التحقق' : "We'll never use your phone number for anything other than verification"}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                        onClick={() => {
                          const phone = prompt(language === 'ar' ? 'أدخل رقم هاتفك:' : 'Enter your phone number:');
                          if (phone) {
                            setFormData(prev => ({ ...prev, phone, phoneVerified: true }));
                            toast.success(language === 'ar' ? 'تم التحقق من رقم الهاتف' : 'Phone verified');
                          }
                        }}
                      >
                        {formData.phoneVerified 
                          ? (language === 'ar' ? 'تم التحقق' : 'Verified')
                          : (language === 'ar' ? 'إضافة رقم الهاتف' : 'Add Phone Number')}
                      </button>
                    </div>
                    {formData.phoneVerified && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <FaCheck />
                        <span>{language === 'ar' ? 'تم التحقق من رقم الهاتف' : 'Phone verified successfully'}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {language === 'ar' ? 'السابق' : 'Back'}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="px-8 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : currentStep === 3 ? (
                    language === 'ar' ? 'إنهاء' : 'Continue'
                  ) : (
                    language === 'ar' ? 'التالي' : 'Continue'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}

