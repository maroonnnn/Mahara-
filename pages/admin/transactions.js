import Head from 'next/head';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
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
        const method = details.method || 'غير محدد';
        
        return {
          id: `TXN-${txn.id}`,
          type: txn.type,
          user: txn.wallet?.user?.name || 'غير محدد',
          userId: txn.wallet?.user?.id,
          project: details.project || details.note || '-',
          amount: Math.abs(parseFloat(txn.amount || 0)),
          status: txn.status,
          date: txn.created_at ? new Date(txn.created_at).toLocaleDateString('ar-SA') : '-',
          method: method === 'credit_card' ? 'بطاقة ائتمانية' :
                  method === 'paypal' ? 'باي بال' :
                  method === 'bank_transfer' ? 'تحويل بنكي' :
                  method === 'manual_deposit' ? 'إيداع يدوي' :
                  method === 'unknown' ? 'غير محدد' : method
        };
      });
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('فشل تحميل المعاملات');
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
          text: 'مكتمل'
        };
      case 'pending':
        return {
          icon: <FaClock />,
          classes: 'bg-yellow-100 text-yellow-800',
          text: 'معلق'
        };
      case 'failed':
        return {
          icon: <FaTimesCircle />,
          classes: 'bg-red-100 text-red-800',
          text: 'فشل'
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
        return { classes: 'bg-green-100 text-green-800', text: 'إيداع' };
      case 'withdraw':
        return { classes: 'bg-purple-100 text-purple-800', text: 'سحب' };
      case 'payment':
        return { classes: 'bg-blue-100 text-blue-800', text: 'دفع' };
      case 'refund':
        return { classes: 'bg-orange-100 text-orange-800', text: 'استرجاع' };
      default:
        return { classes: 'bg-gray-100 text-gray-800', text: type };
    }
  };

  return (
    <>
      <Head>
        <title>إدارة المعاملات المالية - Mahara</title>
      </Head>

      <DashboardLayout requiredRole="admin">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              إدارة المعاملات المالية
            </h1>
            <p className="text-gray-600">
              مراقبة وإدارة جميع المعاملات المالية
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">
                  إجمالي الإيرادات
                </h3>
                <FaDollarSign className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">
                  المعاملات المعلقة
                </h3>
                <FaClock className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-3xl font-bold">${pendingAmount.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">
                  إجمالي المعاملات
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
                  placeholder="البحث عن معاملة..."
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
                  <option value="all">جميع الأنواع</option>
                  <option value="deposit">إيداع</option>
                  <option value="withdraw">سحب</option>
                  <option value="payment">دفع</option>
                  <option value="refund">استرجاع</option>
                </select>
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="completed">مكتمل</option>
                  <option value="pending">معلق</option>
                  <option value="failed">فشل</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                المعاملات الأخيرة
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                <FaDownload />
                تصدير
              </button>
            </div>
            
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500 mb-4"></div>
                <p className="text-gray-600">جاري التحميل...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">لا توجد معاملات</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      معرف المعاملة
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المشروع
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الطريقة
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

