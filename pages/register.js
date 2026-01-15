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
    { value: 'client', label: 'Client (I’m looking for services)' },
    { value: 'freelancer', label: 'Freelancer (I provide services)' },
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
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    // Backend requires minimum 8 characters
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    if (!formData.role) newErrors.role = 'Please select an account type';
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
        <title>Create Account - Mahara</title>
      </Head>

      <PublicLayout>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-600">
                Join thousands of users on Mahara.
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
                  label="Full name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  className="mb-4"
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  className="mb-4"
                  required
                />

                <Select
                  label="Account type"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={roleOptions}
                  error={errors.role}
                  className="mb-4"
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  className="mb-4"
                  required
                />

                <Input
                  label="Confirm password"
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
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                      Sign in
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

