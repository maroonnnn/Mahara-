import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Head from 'next/head';

export default function HomePage() {
  const { user, isAuthenticated, loading, isClient, isFreelancer, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Redirect based on user role
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
    } else {
      // Not authenticated, redirect to login
      router.push('/login');
    }
  }, [loading, isAuthenticated, user, isClient, isFreelancer, isAdmin, router]);

  // Show loading while redirecting
  return (
    <>
      <Head>
        <title>Fiverr Clone | Freelance Services Marketplace</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">جاري التحميل...</p>
          <p className="text-sm text-gray-500 mt-2">Loading your dashboard...</p>
        </div>
      </div>
    </>
  );
}
