import Head from 'next/head';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, [filterType, filterStatus]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterType !== 'all') {
        params.type = filterType;
      }
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      
      const response = await adminService.getTransactions(params);
      console.log('Transactions API response:', response);
      
      const transactionsData = response.data?.data || response.data || [];
      const transactionsList = Array.isArray(transactionsData) ? transactionsData : (transactionsData.data || []);
      
      // Transform transactions to match frontend format
      const formattedTransactions = transactionsList.map(txn => {
        const details = typeof txn.details === 'string' ? JSON.parse(txn.details) : (txn.details || {});
        const method = details.method || 'N/A';
        
        return {
          id: `TXN-${txn.id}`,
          type: txn.type,
          user: txn.wallet?.user?.name || 'N/A',
          userId: txn.wallet?.user?.id,
          project: details.project || details.note || '-',
          amount: Math.abs(parseFloat(txn.amount || 0)),
          status: txn.status,
          date: txn.created_at ? new Date(txn.created_at).toLocaleDateString('ar-SA') : '-',
          method: method === 'credit_card' ? 'Credit Card' :
                  method === 'paypal' ? 'PayPal' :
                  method === 'bank_transfer' ? 'Bank Transfer' :
                  method === 'unknown' ? 'N/A' : method
        };
      });
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error(language === 'ar' ? 'فشل تحميل المعاملات' : 'Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        loadTransactions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Client-side filtering for search term only (status and type are filtered by API)
  const filteredTransactions = transactions.filter(txn => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return txn.id.toLowerCase().includes(search) ||
           txn.user.toLowerCase().includes(search) ||
           txn.project.toLowerCase().includes(search);
  });

  const totalRevenue = transactions
    .filter(t => t.status === 'completed' && (t.type === 'payment' || t.type === 'deposit'))
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
      case 'deposit':
        return { classes: 'bg-green-100 text-green-800', text: language === 'ar' ? 'إيداع' : 'Deposit' };
      case 'withdraw':
        return { classes: 'bg-purple-100 text-purple-800', text: language === 'ar' ? 'سحب' : 'Withdraw' };
      case 'payment':
        return { classes: 'bg-blue-100 text-blue-800', text: language === 'ar' ? 'دفع' : 'Payment' };
      case 'refund':
        return { classes: 'bg-orange-100 text-orange-800', text: language === 'ar' ? 'استرجاع' : 'Refund' };
      default:
        return { classes: 'bg-gray-100 text-gray-800', text: type };
    }
  };

  return (
    <>
      <Head>
        <title>{language === 'ar' ? 'إدارة المعاملات المالية - Mahara' : 'Transaction Management - Mahara'}</title>
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
                  <option value="deposit">{language === 'ar' ? 'إيداع' : 'Deposit'}</option>
                  <option value="withdraw">{language === 'ar' ? 'سحب' : 'Withdraw'}</option>
                  <option value="payment">{language === 'ar' ? 'دفع' : 'Payment'}</option>
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
            
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500 mb-4"></div>
                <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">{language === 'ar' ? 'لا توجد معاملات' : 'No transactions found'}</p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

