import Link from 'next/link';
import PublicLayout from '../components/layout/PublicLayout';
import { FaQuestionCircle } from 'react-icons/fa';

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <FaQuestionCircle className="text-6xl text-primary-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page not found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you’re looking for doesn’t exist or has been moved.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Back to home
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

