import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (works in browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Laravel typically returns data in response.data
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        response: {
          status: 0,
          data: {
            message: 'خطأ في الاتصال بالخادم. يرجى التحقق من أن الخادم يعمل.',
          },
        },
      });
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    // Handle 422 Validation errors (Laravel format)
    if (error.response?.status === 422) {
      const errors = error.response.data.errors || {};
      const message = error.response.data.message || 'البيانات المدخلة غير صحيحة';
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response.data,
            message,
            errors,
          },
        },
      });
    }

    // Handle 419 CSRF token mismatch (Laravel)
    if (error.response?.status === 419) {
      console.error('CSRF token mismatch. Please refresh the page.');
    }

    // Return the error as-is for other cases
    return Promise.reject(error);
  }
);

export default api;

