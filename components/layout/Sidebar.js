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
    { name: 'Dashboard', path: '/client/dashboard', icon: <FaTachometerAlt /> },
    { name: 'My Projects', path: '/client/projects', icon: <FaProjectDiagram /> },
    { name: 'New Project', path: '/client/projects/new', icon: <FaPlus /> },
    { name: 'Messages', path: '/client/messages', icon: <FaEnvelope /> },
    { name: 'Wallet', path: '/client/wallet', icon: <FaWallet /> },
    { name: 'Profile', path: '/client/profile', icon: <FaUser /> },
  ];

  // Freelancer menu items
  const freelancerMenu = [
    { name: 'Dashboard', path: '/freelancer/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Available Projects', path: '/freelancer/projects', icon: <FaProjectDiagram /> },
    { name: 'My Offers', path: '/freelancer/my-offers', icon: <FaFileContract /> },
    { name: 'Active Projects', path: '/freelancer/active-projects', icon: <FaComments /> },
    { name: 'Completed Projects', path: '/freelancer/completed-projects', icon: <FaChartBar /> },
    { name: 'Messages', path: '/freelancer/messages', icon: <FaEnvelope /> },
    { name: 'Wallet', path: '/freelancer/wallet', icon: <FaWallet /> },
    { name: 'Profile', path: '/freelancer/profile', icon: <FaUser /> },
  ];

  // Admin menu items
  const adminMenu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Revenue', path: '/admin/revenue', icon: <FaDollarSign /> },
    { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Projects', path: '/admin/projects', icon: <FaProjectDiagram /> },
    { name: 'Transactions', path: '/admin/transactions', icon: <FaWallet /> },
    { name: 'Categories', path: '/admin/categories', icon: <FaCog /> },
    { name: 'Reports', path: '/admin/reports', icon: <FaChartBar /> },
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
          {user ? 'Welcome,' : 'Welcome'}
        </p>
        <p className="text-lg font-semibold text-gray-800">
          {user?.name || 'Guest'}
        </p>
        {user && (
          <p className="text-xs text-gray-400">
            {isClient && 'Client'}
            {isFreelancer && 'Freelancer'}
            {isAdmin && 'Admin'}
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

