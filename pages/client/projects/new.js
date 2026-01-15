import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-toastify';
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
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load categories from API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const categoryService = (await import('../../../services/categoryService')).default;
      const response = await categoryService.getCategories();
      const categoriesData = response.data?.data || response.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to empty array - user will see "no categories" message
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Role-based access control
  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please sign in first.');
      router.push('/login');
      return;
    }

    // Freelancers/Sellers cannot create projects
    if (isFreelancer) {
      toast.error('Freelancers cannot create projects.');
      router.push('/freelancer/projects'); // Redirect to browse projects
      return;
    }

    // Only clients can create projects
    if (!isClient) {
      toast.error('Only clients can create new projects.');
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
    e?.preventDefault?.();

    if (submitting) return;
    setSubmitting(true);
    
    // Validate required fields (check for empty strings and whitespace)
    if (!formData.title || !formData.title.trim()) {
      alert('Please enter a project title.');
      setSubmitting(false);
      return;
    }
    if (!formData.category) {
      alert('Please select a category.');
      setSubmitting(false);
      return;
    }
    if (!formData.subcategory || !formData.subcategory.trim()) {
      alert('Please enter a subcategory.');
      setSubmitting(false);
      return;
    }
    if (!formData.description || !formData.description.trim()) {
      alert('Please enter a project description.');
      setSubmitting(false);
      return;
    }
    if (!formData.budget || isNaN(parseFloat(formData.budget)) || parseFloat(formData.budget) < 5) {
      alert('Please enter a valid budget (minimum $5).');
      setSubmitting(false);
      return;
    }
    if (!formData.deliveryTime || isNaN(parseInt(formData.deliveryTime)) || parseInt(formData.deliveryTime) < 1) {
      alert('Please enter an expected delivery time (a positive whole number).');
      setSubmitting(false);
      return;
    }
    
    try {
      // Convert delivery time to days
      let durationDays = 1;
      if (formData.deliveryTime) {
        const time = parseInt(formData.deliveryTime);
        if (formData.deliveryUnit === 'days') {
          durationDays = time;
        } else if (formData.deliveryUnit === 'weeks') {
          durationDays = time * 7;
        } else if (formData.deliveryUnit === 'months') {
          durationDays = time * 30;
        }
      }

      // Get category ID from formData (already selected from dropdown)
      const categoryId = parseInt(formData.category);

      // Prepare project data for API (matching backend format)
      const projectData = {
        title: formData.title,
        description: formData.description,
        category_id: categoryId, // Backend expects category_id (integer)
        budget: parseFloat(formData.budget),
        duration_days: durationDays, // Backend expects duration_days (integer)
        // Additional fields for frontend use (stored in localStorage)
        category: formData.category,
        subcategory: formData.subcategory,
        skills: formData.skills,
        budgetType: formData.budgetType,
        deliveryTime: `${formData.deliveryTime} ${formData.deliveryUnit}`,
        additionalInfo: formData.additionalInfo,
        status: 'open'
      };
      
      console.log('Submitting project:', projectData);
      
      let projectCreated = false;
      let createdProject = null;
      
      try {
        // Try to call API to create project
        const projectService = (await import('../../../services/projectService')).default;
        const response = await projectService.createProject({
          title: projectData.title,
          description: projectData.description,
          category_id: projectData.category_id,
          budget: projectData.budget,
          duration_days: projectData.duration_days
        });
        
        console.log('Project created via API:', response);
        createdProject = response.data?.project || response.data;
        projectCreated = true;
        
        toast.success('Project posted successfully.');
        
        // Get category slug to redirect to category page
        const selectedCategoryObj = categories.find(cat => cat.id === categoryId);
        const categorySlug = selectedCategoryObj?.slug || 'programming-tech';
        
        // Redirect to category page to see the new project
        router.push(`/categories/${categorySlug}`);
        return; // Exit early on success
      } catch (apiError) {
        console.error('API Error:', apiError);
        console.error('API Error Details:', {
          status: apiError.response?.status,
          data: apiError.response?.data,
          message: apiError.message,
          config: apiError.config
        });
        
        const errorMessage = apiError.response?.data?.message || 
                           apiError.response?.data?.errors || 
                           apiError.message || 
                           'Unknown error';
        
        // If it's a validation error, show specific errors
        if (apiError.response?.status === 422) {
          const errors = apiError.response.data.errors || {};
          const errorText = Object.values(errors).flat().join('\n');
          alert('Validation error:\n' + errorText);
          return;
        }
        
        // If it's a network error (Backend not running)
        if (apiError.response?.status === 0 || !apiError.response) {
          alert('❌ Server connection error!\n\n' +
                'Please make sure:\n' +
                '1) Backend is running on http://127.0.0.1:8000\n' +
                '2) Run: cd Back-end; php artisan serve\n' +
                '3) Check your .env.local\n\n' +
                'Error: ' + errorMessage);
          return;
        }
        
        // If it's an authentication error
        if (apiError.response?.status === 401) {
          toast.error('Please sign in first.');
          router.push('/login');
          return;
        }
        
        // For other errors, show the error message
        alert('❌ Failed to create the project.\n\n' +
              'Error: ' + errorMessage + '\n\n' +
              'Please check:\n' +
              '1) Backend is running\n' +
              '2) You are signed in\n' +
              '3) The form data is valid');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to post the project. Please try again.\n\nError: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const validateStep = (stepNumber) => {
    if (stepNumber === 1) {
      // Validate step 1 fields
      if (!formData.title || !formData.title.trim()) {
        alert('Please enter a project title.');
        return false;
      }
      if (!formData.category) {
        alert('Please select a category.');
        return false;
      }
      if (!formData.subcategory || !formData.subcategory.trim()) {
        alert('Please enter a subcategory.');
        return false;
      }
      if (!formData.description || !formData.description.trim()) {
        alert('Please enter a project description.');
        return false;
      }
      return true;
    } else if (stepNumber === 2) {
      // Validate step 2 fields
      if (!formData.budget || isNaN(parseFloat(formData.budget)) || parseFloat(formData.budget) < 5) {
        alert('Please enter a valid budget (minimum $5).');
        return false;
      }
      if (!formData.deliveryTime || isNaN(parseInt(formData.deliveryTime)) || parseInt(formData.deliveryTime) < 1) {
        alert('Please enter an expected delivery time (a positive whole number).');
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    // Validate current step before moving to next
    if (!validateStep(step)) {
      return;
    }
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const selectedCategory = categories.find(cat => 
    cat.id?.toString() === formData.category?.toString() || 
    cat.id === parseInt(formData.category)
  );

  return (
    <DashboardLayout>
      <Head>
        <title>New Project | Mahara</title>
        <meta name="description" content="Create a new project and receive offers from top freelancers" />
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a new project</h1>
          <p className="text-gray-600">Tell us what you need and we’ll help you find the right freelancer.</p>
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
                    {stepNum === 1 && 'Project details'}
                    {stepNum === 2 && 'Budget & timeline'}
                    {stepNum === 3 && 'Review'}
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
        <form 
          onSubmit={(e) => {
            // Disable implicit form submit (e.g., pressing Enter).
            e.preventDefault();
          }} 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          
          {/* Step 1: Project Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaFileAlt className="text-primary-500" />
                Project details
              </h2>

              {/* Project Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Example: Professional logo design for my company"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Write a clear, concise title for your project.</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                {loadingCategories ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    Loading categories...
                  </div>
                ) : (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    disabled={categories.length === 0}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                )}
                {!loadingCategories && categories.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">No categories available. Please try again later.</p>
                )}
              </div>

              {/* Subcategory */}
              {formData.category && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    placeholder="Example: Website development, logo design, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter a subcategory for your project.</p>
                </div>
              )}

              {/* Project Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  placeholder="Describe what you need, requirements, goals, and any other details..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">The more detailed your description, the better the offers.</p>
              </div>

              {/* Skills Required */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Required skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    id="skillInput"
                    placeholder="Add a skill (e.g., Photoshop, Illustrator)"
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
                    Add
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
                  Attachments (optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FaPaperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Drag files here or</p>
                  <label className="cursor-pointer">
                    <span className="text-primary-500 hover:text-primary-600 font-semibold">browse files</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PDF, DOC, JPG, PNG, ZIP (max 10MB)</p>
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
                Budget & timeline
              </h2>

              {/* Budget Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Budget type <span className="text-red-500">*</span>
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
                    <div className="font-semibold mb-1">Fixed budget</div>
                    <div className="text-xs text-gray-600">One price for the whole project</div>
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
                    <div className="font-semibold mb-1">Hourly rate</div>
                    <div className="text-xs text-gray-600">Pay based on hours</div>
                  </button>
                </div>
              </div>

              {/* Budget Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget {formData.budgetType === 'hourly' ? '(per hour)' : ''} <span className="text-red-500">*</span>
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
                    ? 'Hourly rate' 
                    : 'Total project budget'}
                </p>
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected delivery time <span className="text-red-500">*</span>
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
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional information (optional)
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Any other details you want to add..."
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
                Review
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Project title</h3>
                  <p className="text-gray-900 font-medium">{formData.title || 'Not specified'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Category</h3>
                    <p className="text-gray-900">{categories.find(c => c.id?.toString() === formData.category?.toString())?.name || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Subcategory</h3>
                    <p className="text-gray-900">{formData.subcategory || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-900 whitespace-pre-line">{formData.description || 'Not specified'}</p>
                </div>

                {formData.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Required skills</h3>
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
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Budget type</h3>
                    <p className="text-gray-900">{formData.budgetType === 'fixed' ? 'Fixed budget' : 'Hourly rate'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Budget</h3>
                    <p className="text-gray-900 font-bold text-lg">${formData.budget || '0'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Expected delivery time</h3>
                  <p className="text-gray-900">
                    {formData.deliveryTime} {
                      formData.deliveryUnit === 'days' ? 'Days' : 
                      formData.deliveryUnit === 'weeks' ? 'Weeks' : 'Months'
                    }
                  </p>
                </div>

                {formData.attachments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Attachments</h3>
                    <div className="space-y-1">
                      {formData.attachments.map((file, index) => (
                        <p key={index} className="text-sm text-gray-700">📎 {file.name}</p>
                      ))}
                    </div>
                  </div>
                )}

                {formData.additionalInfo && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Additional information</h3>
                    <p className="text-gray-900 whitespace-pre-line">{formData.additionalInfo}</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> After posting, freelancers will be able to submit offers. 
                  You can review offers and choose the best fit for your project.
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
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                Next
                <FaArrowLeft />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FaCheckCircle />
                {submitting ? 'Posting...' : 'Post project'}
              </button>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

