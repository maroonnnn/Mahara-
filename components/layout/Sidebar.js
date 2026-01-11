import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaPlus,
  FaFileContract,
  FaComments,
  FaWallet,
  FaUser,
  FaUsers,
  FaChartBar,
  FaCog,
  FaEnvelope,
  FaDollarSign,
} from 'react-icons/fa';

export default function Sidebar() {
  const { user, isClient, isFreelancer, isAdmin } = useAuth();
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  // Client menu items
  const clientMenu = [
    { name: 'لوحة التحكم', path: '/client/dashboard', icon: <FaTachometerAlt /> },
    { name: 'مشاريعي', path: '/client/projects', icon: <FaProjectDiagram /> },
    { name: 'مشروع جديد', path: '/client/projects/new', icon: <FaPlus /> },
    { name: 'الرسائل', path: '/client/messages', icon: <FaEnvelope /> },
    { name: 'المحفظة', path: '/client/wallet', icon: <FaWallet /> },
    { name: 'الملف الشخصي', path: '/client/profile', icon: <FaUser /> },
  ];

  // Freelancer menu items
  const freelancerMenu = [
    { name: 'لوحة التحكم', path: '/freelancer/dashboard', icon: <FaTachometerAlt /> },
    { name: 'المشاريع المتاحة', path: '/freelancer/projects', icon: <FaProjectDiagram /> },
    { name: 'عروضي', path: '/freelancer/my-offers', icon: <FaFileContract /> },
    { name: 'المشاريع النشطة', path: '/freelancer/active-projects', icon: <FaComments /> },
    { name: 'المشاريع المكتملة', path: '/freelancer/completed-projects', icon: <FaChartBar /> },
    { name: 'الرسائل', path: '/freelancer/messages', icon: <FaEnvelope /> },
    { name: 'المحفظة', path: '/freelancer/wallet', icon: <FaWallet /> },
    { name: 'الملف الشخصي', path: '/freelancer/profile', icon: <FaUser /> },
  ];

  // Admin menu items
  const adminMenu = [
    { name: 'لوحة التحكم', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'الإيرادات والأرباح', path: '/admin/revenue', icon: <FaDollarSign /> },
    { name: 'المستخدمون', path: '/admin/users', icon: <FaUsers /> },
    { name: 'المشاريع', path: '/admin/projects', icon: <FaProjectDiagram /> },
    { name: 'المعاملات المالية', path: '/admin/transactions', icon: <FaWallet /> },
    { name: 'الفئات', path: '/admin/categories', icon: <FaCog /> },
    { name: 'التقارير', path: '/admin/reports', icon: <FaChartBar /> },
  ];

  // Portfolio menu (accessible without full authentication)
  const portfolioMenu = [
    { name: 'Portfolio', path: '/seller/portfolio', icon: <FaUser /> },
  ];

  let menuItems = [];
  if (isClient) menuItems = clientMenu;
  else if (isFreelancer) menuItems = freelancerMenu;
  else if (isAdmin) menuItems = adminMenu;
  else menuItems = portfolioMenu; // Default menu for unauthenticated users

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen p-6 hidden lg:block">
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          {user ? 'مرحباً،' : 'Welcome'}
        </p>
        <p className="text-lg font-semibold text-gray-800">
          {user?.name || 'Guest'}
        </p>
        {user && (
          <p className="text-xs text-gray-400">
            {isClient && 'عميل'}
            {isFreelancer && 'مستقل'}
            {isAdmin && 'مدير'}
          </p>
        )}
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

