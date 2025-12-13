import Head from 'next/head';
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaBan,
  FaCheckCircle,
  FaEye,
  FaUserShield
} from 'react-icons/fa';

export default function AdminUsers() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with API call
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'freelancer',
      status: 'active',
      joinDate: '2024-01-15',
      projects: 12,
      revenue: 5400
    },
    {
      id: 2, 
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      role: 'client',
      status: 'active',
      joinDate: '2024-02-20',
      projects: 5,
      revenue: 2100
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'freelancer',
      status: 'suspended',
      joinDate: '2023-12-10',
      projects: 25,
      revenue: 12500
    },
    {
      id: 4,
      name: 'Emily Brown',
      email: 'emily@example.com',
      role: 'client',
      status: 'active',
      joinDate: '2024-03-05',
      projects: 3,
      revenue: 900
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david@example.com',
      role: 'freelancer',
      status: 'active',
      joinDate: '2024-01-28',
      projects: 18,
      revenue: 8700
    },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSuspendUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' } : user
    ));
  };

  const handleDeleteUser = (userId) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <>
      <Head>
        <title>{language === 'ar' ? 'إدارة المستخدمين - Fiverr' : 'User Management - Fiverr'}</title>
      </Head>

      <DashboardLayout requiredRole="admin">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
            </h1>
            <p className="text-gray-600">
              {language === 'ar' ? 'إدارة ومراقبة جميع المستخدمين' : 'Manage and monitor all platform users'}
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'البحث عن مستخدم...' : 'Search users...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">{language === 'ar' ? 'جميع الأدوار' : 'All Roles'}</option>
                  <option value="client">{language === 'ar' ? 'عميل' : 'Client'}</option>
                  <option value="freelancer">{language === 'ar' ? 'مستقل' : 'Freelancer'}</option>
                  <option value="admin">{language === 'ar' ? 'مدير' : 'Admin'}</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                  <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                  <option value="suspended">{language === 'ar' ? 'موقوف' : 'Suspended'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'المستخدم' : 'User'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'الدور' : 'Role'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'المشاريع' : 'Projects'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'الإيرادات' : 'Revenue'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'freelancer' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'admin' ? (language === 'ar' ? 'مدير' : 'Admin') :
                           user.role === 'freelancer' ? (language === 'ar' ? 'مستقل' : 'Freelancer') :
                           (language === 'ar' ? 'عميل' : 'Client')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`flex items-center gap-1 text-sm ${
                          user.status === 'active' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {user.status === 'active' ? <FaCheckCircle /> : <FaBan />}
                          {user.status === 'active' ? 
                            (language === 'ar' ? 'نشط' : 'Active') : 
                            (language === 'ar' ? 'موقوف' : 'Suspended')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.projects}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${user.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.joinDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-blue-600 hover:text-blue-900" title={language === 'ar' ? 'عرض' : 'View'}>
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900" title={language === 'ar' ? 'تعديل' : 'Edit'}>
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleSuspendUser(user.id)}
                            className={`${user.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                            title={user.status === 'active' ? (language === 'ar' ? 'تعليق' : 'Suspend') : (language === 'ar' ? 'تفعيل' : 'Activate')}
                          >
                            <FaBan className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title={language === 'ar' ? 'حذف' : 'Delete'}
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{language === 'ar' ? 'لا يوجد مستخدمون' : 'No users found'}</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-700">
              {language === 'ar' ? 'عرض' : 'Showing'} <span className="font-semibold">1</span> {language === 'ar' ? 'إلى' : 'to'} <span className="font-semibold">{filteredUsers.length}</span> {language === 'ar' ? 'من' : 'of'} <span className="font-semibold">{users.length}</span> {language === 'ar' ? 'النتائج' : 'results'}
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                {language === 'ar' ? 'السابق' : 'Previous'}
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                {language === 'ar' ? 'التالي' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

