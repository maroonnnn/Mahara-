import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import LandingPage from './landing';

export default function HomePage() {
  const { user, isAuthenticated, loading, isClient, isFreelancer, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Redirect based on user role if authenticated
    if (isAuthenticated && user) {
      if (isClient) {
        router.push('/client/dashboard');
      } else if (isFreelancer) {
        router.push('/freelancer/dashboard');
      } else if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
    // If not authenticated, show landing page (no redirect)
  }, [loading, isAuthenticated, user, isClient, isFreelancer, isAdmin, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show loading while redirecting (handled by useEffect)
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">جاري التوجيه...</p>
        </div>
      </div>
    );
  }

  // Not authenticated, show landing page
  return <LandingPage />;
}
