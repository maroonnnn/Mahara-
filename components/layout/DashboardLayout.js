import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Loading from '../common/Loading';

export default function DashboardLayout({ children, requiredRole, allowUnauthenticated = false }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Skip authentication check if allowUnauthenticated is true
    if (allowUnauthenticated) {
      return;
    }

    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (!loading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      router.push('/403'); // Forbidden page
    }
  }, [isAuthenticated, loading, user, requiredRole, router, allowUnauthenticated]);

  if (loading && !allowUnauthenticated) {
    return <Loading />;
  }

  if (!isAuthenticated && !allowUnauthenticated) {
    return <Loading />;
  }

  if (requiredRole && user?.role !== requiredRole && !allowUnauthenticated) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

