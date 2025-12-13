import Head from 'next/head';
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  FaSearch, 
  FaDownload,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaDollarSign
} from 'react-icons/fa';

export default function AdminTransactions() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-001',
      type: 'payment',
      user: 'John Doe',
      project: 'E-commerce Website',
      amount: 5000,
      status: 'completed',
      date: '2024-10-15',
      method: 'PayPal'
    },
    {
      id: 'TXN-002',
      type: 'withdrawal',
      user: 'Sarah Smith',
      project: 'Logo Design',
      amount: 450,
      status: 'pending',
      date: '2024-10-20',
      method: 'Bank Transfer'
    },
    {
      id: 'TXN-003',
      type: 'payment',
      user: 'Mike Johnson',
      project: 'Mobile App Design',
      amount: 3000,
      status: 'completed',
      date: '2024-10-18',
      method: 'Credit Card'
    },
    {
      id: 'TXN-004',
      type: 'refund',
      user: 'Emily Brown',
      project: 'SEO Service',
      amount: 1200,
      status: 'failed',
      date: '2024-10-22',
      method: 'PayPal'
    },
    {
      id: 'TXN-005',
      type: 'payment',
      user: 'David Wilson',
      project: 'Video Editing',
      amount: 800,
      status: 'completed',
      date: '2024-10-19',
      method: 'Stripe'
    },
  ]);

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    const matchesType = filterType === 'all' || txn.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalRevenue = transactions
    .filter(t => t.status === 'completed' && t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return {
          icon: <FaCheckCircle />,
          classes: 'bg-green-100 text-green-800',
          text: language === 'ar' ? 'مكتمل' : 'Completed'
        };
      case 'pending':
        return {
          icon: <FaClock />,
          classes: 'bg-yellow-100 text-yellow-800',
          text: language === 'ar' ? 'معلق' : 'Pending'
        };
      case 'failed':
        return {
          icon: <FaTimesCircle />,
          classes: 'bg-red-100 text-red-800',
          text: language === 'ar' ? 'فشل' : 'Failed'
        };
      default:
        return {
          icon: null,
          classes: 'bg-gray-100 text-gray-800',
          text: status
        };
    }
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'payment':
        return { classes: 'bg-blue-100 text-blue-800', text: language === 'ar' ? 'دفع' : 'Payment' };
      case 'withdrawal':
        return { classes: 'bg-purple-100 text-purple-800', text: language === 'ar' ? 'سحب' : 'Withdrawal' };
      case 'refund':
        return { classes: 'bg-orange-100 text-orange-800', text: language === 'ar' ? 'استرجاع' : 'Refund' };
      default:
        return { classes: 'bg-gray-100 text-gray-800', text: type };
    }
  };

  return (
    <>
      <Head>
        <title>{language === 'ar' ? 'إدارة المعاملات المالية - Fiverr' : 'Transaction Management - Fiverr'}</title>
      </Head>

      <DashboardLayout requiredRole="admin">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'إدارة المعاملات المالية' : 'Transaction Management'}
            </h1>
            <p className="text-gray-600">
              {language === 'ar' ? 'مراقبة وإدارة جميع المعاملات المالية' : 'Monitor and manage all financial transactions'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">
                  {language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
                </h3>
                <FaDollarSign className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">
                  {language === 'ar' ? 'المعاملات المعلقة' : 'Pending Transactions'}
                </h3>
                <FaClock className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-3xl font-bold">${pendingAmount.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">
                  {language === 'ar' ? 'إجمالي المعاملات' : 'Total Transactions'}
                </h3>
                <FaCheckCircle className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-3xl font-bold">{transactions.length}</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'البحث عن معاملة...' : 'Search transactions...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
                  <option value="payment">{language === 'ar' ? 'دفع' : 'Payment'}</option>
                  <option value="withdrawal">{language === 'ar' ? 'سحب' : 'Withdrawal'}</option>
                  <option value="refund">{language === 'ar' ? 'استرجاع' : 'Refund'}</option>
                </select>
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                  <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                  <option value="pending">{language === 'ar' ? 'معلق' : 'Pending'}</option>
                  <option value="failed">{language === 'ar' ? 'فشل' : 'Failed'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'ar' ? 'المعاملات الأخيرة' : 'Recent Transactions'}
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                <FaDownload />
                {language === 'ar' ? 'تصدير' : 'Export'}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'معرف المعاملة' : 'Transaction ID'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'النوع' : 'Type'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'المستخدم' : 'User'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'المشروع' : 'Project'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'المبلغ' : 'Amount'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'التاريخ' : 'Date'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'الطريقة' : 'Method'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((txn) => {
                    const statusInfo = getStatusBadge(txn.status);
                    const typeInfo = getTypeBadge(txn.type);
                    return (
                      <tr key={txn.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                          {txn.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeInfo.classes}`}>
                            {typeInfo.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {txn.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {txn.project}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ${txn.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.classes}`}>
                            {statusInfo.icon}
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {txn.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {txn.method}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{language === 'ar' ? 'لا توجد معاملات' : 'No transactions found'}</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

