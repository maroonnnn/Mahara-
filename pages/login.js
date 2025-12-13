import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PublicLayout from '../components/layout/PublicLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Link from 'next/link';
import Head from 'next/head';

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
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
    const result = await login(formData);
    setLoading(false);

    if (!result.success) {
      setErrors({ general: result.error });
    }
  };

  return (
    <>
      <Head>
        <title>تسجيل الدخول - FreelanceHub</title>
      </Head>

      <PublicLayout>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                تسجيل الدخول
              </h1>
              <p className="text-gray-600">
                مرحباً بعودتك! سجّل دخولك للمتابعة
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
                  label="البريد الإلكتروني"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
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
                  className="mb-6"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    ليس لديك حساب؟{' '}
                    <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                      إنشاء حساب جديد
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

