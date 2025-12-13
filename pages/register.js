import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PublicLayout from '../components/layout/PublicLayout';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Link from 'next/link';
import Head from 'next/head';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: 'client', label: 'عميل (أبحث عن خدمات)' },
    { value: 'freelancer', label: 'مستقل (أقدم خدمات)' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'الاسم مطلوب';
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
    if (formData.password.length < 6) newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'كلمة المرور غير متطابقة';
    }
    if (!formData.role) newErrors.role = 'يجب اختيار نوع الحساب';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (!result.success) {
      // Set general error
      const newErrors = { general: result.error };
      
      // Set field-specific errors if available
      if (result.fieldErrors) {
        Object.keys(result.fieldErrors).forEach(field => {
          const errorValue = result.fieldErrors[field];
          newErrors[field] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        });
      }
      
      setErrors(newErrors);
    }
  };

  return (
    <>
      <Head>
        <title>إنشاء حساب - FreelanceHub</title>
      </Head>

      <PublicLayout>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                إنشاء حساب جديد
              </h1>
              <p className="text-gray-600">
                انضم إلى آلاف المستخدمين على المنصة
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <form onSubmit={handleSubmit}>
                {errors.general && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {errors.general}
                  </div>
                )}

                <Input
                  label="الاسم الكامل"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  className="mb-4"
                  required
                />

                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  className="mb-4"
                  required
                />

                <Select
                  label="نوع الحساب"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={roleOptions}
                  error={errors.role}
                  className="mb-4"
                  required
                />

                <Input
                  label="كلمة المرور"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  className="mb-4"
                  required
                />

                <Input
                  label="تأكيد كلمة المرور"
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  error={errors.password_confirmation}
                  className="mb-6"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    لديك حساب بالفعل؟{' '}
                    <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                      تسجيل الدخول
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}

