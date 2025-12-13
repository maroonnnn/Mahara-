import Link from 'next/link';
import PublicLayout from '../components/layout/PublicLayout';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function ForbiddenPage() {
  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            غير مصرّح لك بالوصول
          </h2>
          <p className="text-gray-600 mb-8">
            ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة
          </p>
          <Link href="/" className="btn-primary inline-block">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

