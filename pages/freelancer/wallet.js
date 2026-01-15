import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  FaWallet, 
  FaDollarSign, 
  FaArrowUp, 
  FaArrowDown, 
  FaClock,
  FaCheckCircle,
  FaMoneyBillWave,
  FaChartLine
} from 'react-icons/fa';

export default function FreelancerWallet() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const [balance, setBalance] = useState({
    available: 0,
    pending: 0,
    total: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    projectsCompleted: 0,
    averagePerProject: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const walletService = (await import('../../services/walletService')).default;
      
      // Load wallet balance
      try {
        const walletResponse = await walletService.getWallet();
        const walletData = walletResponse.data?.data || walletResponse.data || {};
        setBalance({
          available: parseFloat(walletData.available || walletData.balance || 0),
          pending: parseFloat(walletData.pending || 0),
          total: parseFloat(walletData.total || walletData.balance || 0)
        });
      } catch (error) {
        console.error('Error loading wallet:', error);
        setBalance({ available: 0, pending: 0, total: 0 });
      }

      // Load transactions
      try {
        const transactionsResponse = await walletService.getTransactions();
        const transactionsData = transactionsResponse.data?.data || transactionsResponse.data || [];
        const transactionsList = Array.isArray(transactionsData) ? transactionsData : (transactionsData.data || []);
        
        const normalizeStatus = (rawStatus) => {
          const s = String(rawStatus || '').toLowerCase();
          if (!s) return 'completed';
          if (['pending', 'processing', 'in_progress', 'in-progress', 'queued'].includes(s)) return 'pending';
          if (['completed', 'complete', 'success', 'succeeded', 'paid', 'done'].includes(s)) return 'completed';
          return s; // fallback
        };

        const normalizeType = (rawType, amount) => {
          const t = String(rawType || '').toLowerCase();
          if (t.includes('withdraw')) return 'withdrawal';
          if (t.includes('deposit') || t.includes('topup') || t.includes('top_up')) return 'deposit';
          // Incoming project money is often "payment" on the API
          if (t.includes('payment') || t.includes('earning') || t.includes('income')) return 'earning';
          // Fees/commissions (if returned) shouldn't count as earnings
          if (t.includes('fee') || t.includes('commission')) return 'fee';
          return amount < 0 ? 'withdrawal' : 'earning';
        };

        const mappedTransactions = transactionsList.map((t) => {
          const amount = parseFloat(t.amount || 0);

          let description = t.description || t.note || '';
          let method = t.method || '';
          if (t.details) {
            try {
              const details = typeof t.details === 'string' ? JSON.parse(t.details) : t.details;
              description = description || details?.note || details?.description || '';
              method = method || details?.method || '';
            } catch {
              // ignore invalid JSON
            }
          }

          const rawDate = t.created_at || t.date;
          const date = rawDate
            ? new Date(rawDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

          return {
            id: t.id,
            type: normalizeType(t.type, amount),
            amount,
            description: description || 'Transaction',
            date,
            status: normalizeStatus(t.status),
            projectId: t.project_id ? `#${t.project_id}` : undefined,
            method
          };
        });
        
        setTransactions(mappedTransactions);
        
        // Calculate stats
        const completedEarnings = mappedTransactions.filter(
          (t) => t.type === 'earning' && t.status === 'completed' && t.amount > 0
        );

        const totalEarnings = completedEarnings.reduce((sum, t) => sum + t.amount, 0);
        
        const now = new Date();
        const thisMonth = completedEarnings
          .filter((t) => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
          })
          .reduce((sum, t) => sum + t.amount, 0);
        
        const projectsCompleted = new Set(completedEarnings.map((t) => t.projectId).filter(Boolean)).size || completedEarnings.length;
        
        setStats({
          totalEarnings,
          thisMonth,
          projectsCompleted,
          averagePerProject: projectsCompleted > 0 ? totalEarnings / projectsCompleted : 0
        });
      } catch (error) {
        console.error('Error loading transactions:', error);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWithdrawalFees = (amount) => {
    const withdrawAmount = parseFloat(amount) || 0;
    // No platform fee on withdrawals
    const platformFee = 0;
    const finalAmount = withdrawAmount;
    
    return {
      withdrawAmount,
      platformFee,
      finalAmount
    };
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (parseFloat(withdrawAmount) > balance.available) {
      alert('❌ Insufficient available balance to withdraw.');
      return;
    }
    if (parseFloat(withdrawAmount) < 50) {
      alert('❌ Minimum withdrawal amount is $50.');
      return;
    }

    const { withdrawAmount: amount, finalAmount } = calculateWithdrawalFees(withdrawAmount);

    alert(`✅ Withdrawal request submitted: $${amount.toFixed(2)}\n\n💰 You will receive: $${finalAmount.toFixed(2)}\n\n⏱️ Processing time: 3–5 business days.`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Wallet | Mahara</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Wallet</h1>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Available Balance */}
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/80 text-sm">Available balance</p>
              <FaWallet className="text-2xl text-white/30" />
            </div>
            <p className="text-4xl font-bold mb-2">${balance.available.toLocaleString()}</p>
            <p className="text-white/70 text-xs">Available to withdraw now</p>
          </div>

          {/* Pending Balance */}
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/80 text-sm">Pending</p>
              <FaClock className="text-2xl text-white/30" />
            </div>
            <p className="text-4xl font-bold mb-2">${balance.pending.toLocaleString()}</p>
            <p className="text-white/70 text-xs">From ongoing projects</p>
          </div>

          {/* Total Balance */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/80 text-sm">Total balance</p>
              <FaDollarSign className="text-2xl text-white/30" />
            </div>
            <p className="text-4xl font-bold mb-2">${balance.total.toLocaleString()}</p>
            <p className="text-white/70 text-xs">Available + pending</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setShowWithdrawModal(true)}
              className="flex-1 min-w-[200px] px-6 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <FaArrowDown />
              Withdraw
            </button>
            <button className="flex-1 min-w-[200px] px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center gap-2">
              <FaChartLine />
              View reports
            </button>
          </div>
        </div>

        {/* Earnings Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total earnings</p>
            <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">This month</p>
            <p className="text-2xl font-bold text-green-600">${stats.thisMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Projects completed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.projectsCompleted}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Average per project</p>
            <p className="text-2xl font-bold text-gray-900">${stats.averagePerProject.toFixed(2)}</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Transaction history</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === 'earning' ? 'bg-green-100' : 
                    transaction.type === 'withdrawal' ? 'bg-blue-100' : 
                    'bg-yellow-100'
                  }`}>
                    {transaction.type === 'earning' ? (
                      <FaArrowUp className="text-green-600" />
                    ) : transaction.type === 'withdrawal' ? (
                      <FaArrowDown className="text-blue-600" />
                    ) : (
                      <FaClock className="text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                      {transaction.projectId && (
                        <span className="text-xs text-gray-500">• {transaction.projectId}</span>
                      )}
                      {transaction.method && (
                        <span className="text-xs text-gray-500">• {transaction.method}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    transaction.amount < 0 ? 'text-blue-600' : 
                    transaction.status === 'pending' ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawal Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 Withdrawal info</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>- Minimum withdrawal: $50</li>
            <li>- No platform fee on withdrawals</li>
            <li>- Processing time: 3–5 business days</li>
            <li>- Methods: bank transfer, PayPal, Payoneer</li>
            <li>- You can request one withdrawal every 24 hours</li>
          </ul>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Withdraw</h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Available to withdraw</p>
              <p className="text-3xl font-bold text-green-600">${balance.available.toLocaleString()}</p>
            </div>

            <form onSubmit={handleWithdraw}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (USD)
                </label>
                <div className="relative">
                  <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="50"
                    max={balance.available}
                    step="0.01"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum: $50</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Withdrawal method
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="bank">Bank transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="payoneer">Payoneer</option>
                </select>
              </div>

              {withdrawAmount && parseFloat(withdrawAmount) >= 50 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Withdrawal amount</span>
                    <span className="font-semibold">${calculateWithdrawalFees(withdrawAmount).withdrawAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between">
                    <span className="font-bold text-gray-900">You will receive</span>
                    <span className="font-bold text-green-600">${calculateWithdrawalFees(withdrawAmount).finalAmount.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-700">
                    💡 You’ll receive the full $${calculateWithdrawalFees(withdrawAmount).finalAmount.toFixed(2)} with no platform fee
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawAmount('');
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <FaCheckCircle />
                  Confirm withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

