import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { 
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaUsers,
  FaProjectDiagram,
  FaWallet,
  FaCalendarAlt,
  FaFileDownload
} from 'react-icons/fa';

export default function AdminRevenuePage() {
  const router = useRouter();
  const { user, isAdmin, authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('all'); // all, today, week, month

  // The DashboardLayout with requiredRole="admin" handles the auth check
  // No need for duplicate check here

  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getRevenue();
      console.log('Revenue API response:', response);
      
      const data = response.data || {};
      
      setRevenueData({
        total: parseFloat(data.total || 0),
        deposits: data.deposits || [],
        withdrawals: data.withdrawals || [],
        commissions: data.commissionTransactions || []
      });
    } catch (error) {
      console.error('Error loading revenue data:', error);
      toast.error('فشل تحميل بيانات الإيرادات');
      setRevenueData({
        total: 0,
        deposits: [],
        withdrawals: [],
        commissions: []
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = (transactions, period) => {
    if (period === 'all') return transactions;
    
    const now = new Date();
    const filtered = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      
      switch (period) {
        case 'today':
          return transactionDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return transactionDate >= monthAgo;
        default:
          return true;
      }
    });
    
    return filtered;
  };

  const calculateStats = () => {
    if (!revenueData) return { depositFees: 0, withdrawalFees: 0, commissions: 0, total: 0 };

    const filteredDeposits = filterTransactions(revenueData.deposits || [], filterPeriod);
    const filteredWithdrawals = filterTransactions(revenueData.withdrawals || [], filterPeriod);
    const filteredCommissions = filterTransactions(revenueData.commissions || [], filterPeriod);

    const depositFees = filteredDeposits.reduce((sum, d) => sum + (d.fee || 0), 0);
    const withdrawalFees = filteredWithdrawals.reduce((sum, w) => sum + (w.fee || 0), 0);
    const commissions = filteredCommissions.reduce((sum, c) => sum + (c.fee || 0), 0);
    const total = depositFees + withdrawalFees + commissions;

    return { depositFees, withdrawalFees, commissions, total };
  };

  const stats = calculateStats();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    if (!revenueData) return;

    const allTransactions = [
      ...revenueData.deposits.map(d => ({ ...d, category: 'Deposit Fee' })),
      ...revenueData.withdrawals.map(w => ({ ...w, category: 'Withdrawal Fee' })),
      ...revenueData.commissions.map(c => ({ ...c, category: 'Commission' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const csvContent = [
      ['Date', 'Category', 'User', 'Amount', 'Fee', 'Type'].join(','),
      ...allTransactions.map(t => [
        formatDate(t.date),
        t.category,
        t.userName || 'N/A',
        t.amount || 0,
        t.fee || 0,
        t.type || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform-revenue-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading || !revenueData) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>الإيرادات والأرباح | لوحة تحكم الإدارة</title>
      </Head>

      <DashboardLayout requiredRole="admin">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">الإيرادات والأرباح</h1>
              <p className="text-gray-600">نظرة شاملة على إيرادات المنصة</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Period Filter */}
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">كل الفترة</option>
                <option value="today">اليوم</option>
                <option value="week">آخر 7 أيام</option>
                <option value="month">آخر 30 يوم</option>
              </select>

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <FaFileDownload />
                تصدير CSV
              </button>
            </div>
          </div>

          {/* Revenue Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/80 text-sm">إجمالي الإيرادات</p>
                <FaDollarSign className="text-2xl text-white/30" />
              </div>
              <p className="text-4xl font-bold mb-2">${stats.total.toFixed(2)}</p>
              <p className="text-white/70 text-xs">
                {filterPeriod === 'all' ? 'كل الوقت' : 
                 filterPeriod === 'today' ? 'اليوم' :
                 filterPeriod === 'week' ? 'آخر أسبوع' : 'آخر شهر'}
              </p>
            </div>

            {/* Deposit Fees */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/80 text-sm">عمولات الإيداع</p>
                <FaArrowDown className="text-2xl text-white/30" />
              </div>
              <p className="text-4xl font-bold mb-2">${stats.depositFees.toFixed(2)}</p>
              <p className="text-white/70 text-xs">
                {revenueData.deposits.length} عملية إيداع
              </p>
            </div>

            {/* Withdrawal Fees */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/80 text-sm">عمولات السحب</p>
                <FaArrowUp className="text-2xl text-white/30" />
              </div>
              <p className="text-4xl font-bold mb-2">${stats.withdrawalFees.toFixed(2)}</p>
              <p className="text-white/70 text-xs">
                {revenueData.withdrawals.length} عملية سحب
              </p>
            </div>

            {/* Project Commissions */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/80 text-sm">عمولات المشاريع</p>
                <FaProjectDiagram className="text-2xl text-white/30" />
              </div>
              <p className="text-4xl font-bold mb-2">${stats.commissions.toFixed(2)}</p>
              <p className="text-white/70 text-xs">
                {revenueData.commissions.length} مشروع
              </p>
            </div>
          </div>

          {/* Revenue Breakdown Chart (Placeholder) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">توزيع الإيرادات</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">عمولات الإيداع</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.total > 0 ? ((stats.depositFees / stats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">عمولات السحب</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.total > 0 ? ((stats.withdrawalFees / stats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">عمولات المشاريع</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.total > 0 ? ((stats.commissions / stats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">آخر المعاملات</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                ...revenueData.deposits.map(d => ({ ...d, category: 'deposit' })),
                ...revenueData.withdrawals.map(w => ({ ...w, category: 'withdrawal' })),
                ...revenueData.commissions.map(c => ({ ...c, category: 'commission' }))
              ]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 20)
                .map((transaction, index) => (
                  <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.category === 'deposit' ? 'bg-blue-100' :
                        transaction.category === 'withdrawal' ? 'bg-purple-100' :
                        'bg-orange-100'
                      }`}>
                        {transaction.category === 'deposit' ? (
                          <FaArrowDown className="text-blue-600" />
                        ) : transaction.category === 'withdrawal' ? (
                          <FaArrowUp className="text-purple-600" />
                        ) : (
                          <FaDollarSign className="text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {transaction.category === 'deposit' ? 'عمولة إيداع' :
                           transaction.category === 'withdrawal' ? 'عمولة سحب' :
                           'عمولة مشروع'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                          {transaction.userName && (
                            <span className="text-xs text-gray-500">• {transaction.userName}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        +${(transaction.fee || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        من ${(transaction.amount || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {revenueData.deposits.length === 0 && revenueData.withdrawals.length === 0 && revenueData.commissions.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <FaChartLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p>لا توجد معاملات بعد</p>
                <p className="text-sm mt-2">ستظهر الإيرادات هنا عند حدوث معاملات</p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">💡 نظام العمولات</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• <strong>عمولة الإيداع:</strong> 5% من كل عملية إيداع للعملاء</li>
              <li>• <strong>عمولة السحب:</strong> 5% من كل عملية سحب للمستقلين</li>
              <li>• <strong>عمولة المشروع:</strong> 5% من كل عملية دفع للمشاريع</li>
              <li>• يتم تسجيل جميع الإيرادات تلقائياً في النظام</li>
              <li>• يمكنك تصدير التقارير بصيغة CSV للتحليل</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

