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
      toast.error('Failed to load revenue data');
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
    if (!revenueData) return { commissions: 0, total: 0 };

    const filteredCommissions = filterTransactions(revenueData.commissions || [], filterPeriod);
    const commissions = filteredCommissions.reduce((sum, c) => sum + (c.fee || 0), 0);
    const total = commissions;

    return { commissions, total };
  };

  const stats = calculateStats();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
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
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Revenue | Admin Dashboard</title>
      </Head>

      <DashboardLayout requiredRole="admin">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue</h1>
              <p className="text-gray-600">Overview of platform revenue</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Period Filter */}
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
              </select>

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <FaFileDownload />
                Export CSV
              </button>
            </div>
          </div>

          {/* Revenue Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/80 text-sm">Total revenue</p>
                <FaDollarSign className="text-2xl text-white/30" />
              </div>
              <p className="text-4xl font-bold mb-2">${stats.total.toFixed(2)}</p>
              <p className="text-white/70 text-xs">
                {filterPeriod === 'all' ? 'All time' : 
                 filterPeriod === 'today' ? 'Today' :
                 filterPeriod === 'week' ? 'Last 7 days' : 'Last 30 days'}
              </p>
            </div>

            {/* Project Commissions */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/80 text-sm">Project commissions</p>
                <FaProjectDiagram className="text-2xl text-white/30" />
              </div>
              <p className="text-4xl font-bold mb-2">${stats.commissions.toFixed(2)}</p>
              <p className="text-white/70 text-xs">
                {revenueData.commissions.length} projects
              </p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent transactions</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                ...revenueData.commissions.map(c => ({ ...c, category: 'commission' }))
              ]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 20)
                .map((transaction, index) => (
                  <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100">
                        <FaDollarSign className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Project commission
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
                        from ${(transaction.amount || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {revenueData.commissions.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <FaChartLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p>No transactions yet</p>
                <p className="text-sm mt-2">Revenue will appear here once transactions occur</p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">💡 Commission system</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>- <strong>Project commission:</strong> 5% of each project payment</li>
              <li>- All revenue is recorded automatically in the system</li>
              <li>- You can export reports as CSV for analysis</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

