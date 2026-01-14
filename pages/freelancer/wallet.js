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
        
        const mappedTransactions = transactionsList.map(t => ({
          id: t.id,
          type: t.type || (t.amount < 0 ? 'withdrawal' : 'earning'),
          amount: parseFloat(t.amount || 0),
          description: t.description || t.note || 'معاملة',
          date: t.created_at || t.date || new Date().toISOString().split('T')[0],
          status: t.status || 'completed',
          projectId: t.project_id ? `#${t.project_id}` : undefined,
          method: t.method
        }));
        
        setTransactions(mappedTransactions);
        
        // Calculate stats
        const totalEarnings = mappedTransactions
          .filter(t => t.type === 'earning' && t.status === 'completed')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const thisMonth = mappedTransactions
          .filter(t => {
            const transactionDate = new Date(t.date);
            const now = new Date();
            return t.type === 'earning' && 
                   t.status === 'completed' &&
                   transactionDate.getMonth() === now.getMonth() &&
                   transactionDate.getFullYear() === now.getFullYear();
          })
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const projectsCompleted = mappedTransactions
          .filter(t => t.type === 'earning' && t.status === 'completed').length;
        
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

  const PLATFORM_FEE_PERCENTAGE = 5; // 5% platform fee

  const calculateWithdrawalFees = (amount) => {
    const withdrawAmount = parseFloat(amount) || 0;
    const platformFee = withdrawAmount * (PLATFORM_FEE_PERCENTAGE / 100);
    const finalAmount = withdrawAmount - platformFee;
    
    return {
      withdrawAmount,
      platformFee,
      finalAmount
    };
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (parseFloat(withdrawAmount) > balance.available) {
      alert('❌ الرصيد المتاح غير كافٍ للسحب');
      return;
    }
    if (parseFloat(withdrawAmount) < 50) {
      alert('❌ الحد الأدنى للسحب هو 50 دولار');
      return;
    }

    const { withdrawAmount: amount, platformFee, finalAmount } = calculateWithdrawalFees(withdrawAmount);

    // Track platform revenue
    const platformRevenue = JSON.parse(localStorage.getItem('platformRevenue') || '{"total":0,"deposits":[],"withdrawals":[],"commissions":[]}');
    platformRevenue.total += platformFee;
    platformRevenue.withdrawals.push({
      id: Date.now(),
      userId: 'freelancer-id', // Replace with actual user ID
      userName: 'المستقل', // Replace with actual user name
      amount: amount,
      fee: platformFee,
      finalAmount: finalAmount,
      date: new Date().toISOString(),
      type: 'freelancer_withdrawal'
    });
    localStorage.setItem('platformRevenue', JSON.stringify(platformRevenue));

    alert(`✅ تم طلب سحب ${amount.toFixed(2)} دولار بنجاح!\n\n💰 المبلغ الذي ستستلمه: $${finalAmount.toFixed(2)}\n📊 عمولة المنصة (5%): $${platformFee.toFixed(2)}\n\n⏱️ سيتم معالجة الطلب خلال 3-5 أيام عمل.`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  return (
    <DashboardLayout>
      <Head>
        <title>المحفظة | Mahara</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">المحفظة</h1>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Available Balance */}
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/80 text-sm">الرصيد المتاح</p>
              <FaWallet className="text-2xl text-white/30" />
            </div>
            <p className="text-4xl font-bold mb-2">${balance.available.toLocaleString()}</p>
            <p className="text-white/70 text-xs">يمكن سحبه الآن</p>
          </div>

          {/* Pending Balance */}
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/80 text-sm">قيد الانتظار</p>
              <FaClock className="text-2xl text-white/30" />
            </div>
            <p className="text-4xl font-bold mb-2">${balance.pending.toLocaleString()}</p>
            <p className="text-white/70 text-xs">من المشاريع الجارية</p>
          </div>

          {/* Total Balance */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/80 text-sm">الرصيد الإجمالي</p>
              <FaDollarSign className="text-2xl text-white/30" />
            </div>
            <p className="text-4xl font-bold mb-2">${balance.total.toLocaleString()}</p>
            <p className="text-white/70 text-xs">متاح + معلق</p>
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
              سحب الرصيد
            </button>
            <button className="flex-1 min-w-[200px] px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center gap-2">
              <FaChartLine />
              عرض التقارير
            </button>
          </div>
        </div>

        {/* Earnings Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">إجمالي الأرباح</p>
            <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">أرباح هذا الشهر</p>
            <p className="text-2xl font-bold text-green-600">${stats.thisMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">مشاريع مكتملة</p>
            <p className="text-2xl font-bold text-gray-900">{stats.projectsCompleted}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">متوسط الربح</p>
            <p className="text-2xl font-bold text-gray-900">${stats.averagePerProject}</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">سجل المعاملات</h2>
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
                    {transaction.status === 'completed' ? 'مكتمل' : 'معلق'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawal Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 معلومات عن السحب</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• الحد الأدنى للسحب: 50 دولار</li>
            <li>• عمولة المنصة: 5% من مبلغ السحب</li>
            <li>• مدة المعالجة: 3-5 أيام عمل</li>
            <li>• طرق السحب المتاحة: التحويل البنكي، PayPal، Payoneer</li>
            <li>• يمكنك طلب سحب واحد كل 24 ساعة</li>
          </ul>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">سحب الرصيد</h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">الرصيد المتاح للسحب</p>
              <p className="text-3xl font-bold text-green-600">${balance.available.toLocaleString()}</p>
            </div>

            <form onSubmit={handleWithdraw}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المبلغ المراد سحبه (USD)
                </label>
                <div className="relative">
                  <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="أدخل المبلغ"
                    min="50"
                    max={balance.available}
                    step="0.01"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">الحد الأدنى: 50 دولار</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  طريقة السحب
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="bank">التحويل البنكي</option>
                  <option value="paypal">PayPal</option>
                  <option value="payoneer">Payoneer</option>
                </select>
              </div>

              {withdrawAmount && parseFloat(withdrawAmount) >= 50 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">مبلغ السحب</span>
                    <span className="font-semibold">${calculateWithdrawalFees(withdrawAmount).withdrawAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">عمولة المنصة (5%)</span>
                    <span className="font-semibold text-red-600">-${calculateWithdrawalFees(withdrawAmount).platformFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between">
                    <span className="font-bold text-gray-900">سيتم تحويله</span>
                    <span className="font-bold text-green-600">${calculateWithdrawalFees(withdrawAmount).finalAmount.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-700">
                    💡 سيتم تحويل ${calculateWithdrawalFees(withdrawAmount).finalAmount.toFixed(2)} بعد خصم عمولة المنصة
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
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <FaCheckCircle />
                  تأكيد السحب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

