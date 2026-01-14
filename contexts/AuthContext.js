import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      // Laravel returns 'access_token' not 'token'
      const { user, access_token, token } = response.data;
      const authToken = access_token || token; // Support both formats

      setUser(user);
      setToken(authToken);

      // Store in localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('تم تسجيل الدخول بنجاح');

      // Redirect based on role
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'freelancer') {
        // Check if profile is completed
        const profileCompleted = user.profileCompleted || localStorage.getItem(`profileCompleted_${user.id}`);
        if (!profileCompleted) {
          // Freelancer hasn't completed onboarding - redirect to onboarding
          toast.info('يرجى إكمال معلومات ملفك الشخصي');
          router.push('/seller/onboarding');
        } else {
          // Profile completed - go to dashboard
          router.push('/freelancer/dashboard');
        }
      } else if (user.role === 'client') {
        router.push('/client/dashboard');
      } else {
        // Default fallback
        router.push('/dashboard');
      }

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'فشل تسجيل الدخول';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      // Laravel returns 'access_token' not 'token'
      const { user, access_token, token } = response.data;
      const authToken = access_token || token; // Support both formats

      setUser(user);
      setToken(authToken);

      // Store in localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('تم إنشاء الحساب بنجاح');

      // Redirect based on role
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'freelancer') {
        // Check if profile is completed
        const profileCompleted = user.profileCompleted || localStorage.getItem(`profileCompleted_${user.id}`);
        if (!profileCompleted) {
          // New freelancer - redirect to onboarding
          router.push('/seller/onboarding');
        } else {
          // Profile already completed - go to dashboard
          router.push('/freelancer/dashboard');
        }
      } else if (user.role === 'client') {
        router.push('/client/dashboard');
      } else {
        // Default fallback
        router.push('/dashboard');
      }

      return { success: true };
    } catch (error) {
      let message = 'فشل إنشاء الحساب';
      let fieldErrors = {};

      // Log error for debugging
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      if (!error.response) {
        // Network error - backend not reachable
        message = 'خطأ في الاتصال بالخادم. يرجى التحقق من أن الخادم يعمل على ' + (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000');
      } else if (error.response.data) {
        const data = error.response.data;
        
        // Handle validation errors (Laravel returns errors object for 422)
        if (error.response.status === 422 && data.errors && typeof data.errors === 'object') {
          fieldErrors = data.errors;
          // Get first error message as general message
          const firstErrorKey = Object.keys(data.errors)[0];
          const firstError = Array.isArray(data.errors[firstErrorKey]) 
            ? data.errors[firstErrorKey][0] 
            : data.errors[firstErrorKey];
          message = firstError || 'البيانات المدخلة غير صحيحة. يرجى التحقق من جميع الحقول.';
        } 
        // Handle error message
        else if (data.message) {
          message = data.message;
        }
        // Handle error string directly
        else if (typeof data === 'string') {
          message = data;
        }
        // Handle status-specific errors
        else if (error.response.status === 422) {
          message = 'البيانات المدخلة غير صحيحة. يرجى التحقق من جميع الحقول.';
        } else if (error.response.status === 409) {
          message = 'البريد الإلكتروني أو اسم المستخدم موجود مسبقاً.';
        } else if (error.response.status === 500) {
          message = data.error || 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
        }
      }

      toast.error(message);
      return { success: false, error: message, fieldErrors };
    }
  };

  // Logout function
  const logout = async () => {
    // Clear local state first to prevent any auth checks from triggering
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Try to call logout API, but don't wait for it or fail if it errors
    try {
      await authService.logout();
    } catch (error) {
      // Silently ignore logout API errors - we've already cleared local state
      console.log('Logout API call failed (this is OK):', error);
    }
    
    toast.info('تم تسجيل الخروج');
    router.push('/login');
  };

  // Update profile
  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Check user role
  const isClient = user?.role === 'client';
  const isFreelancer = user?.role === 'freelancer';
  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    isClient,
    isFreelancer,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

