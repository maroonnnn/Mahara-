import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import walletService from '../../../services/walletService';
import { 
  FaArrowRight,
  FaCheckCircle,
  FaLock,
  FaUniversity,
  FaCreditCard,
  FaExclamationTriangle
} from 'react-icons/fa';

export default function WithdrawPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank_transfer');
  const [processing, setProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    iban: ''
  });

  useEffect(() => {
    if (user) {
      loadWalletBalance();
    }
  }, [user]);

  const loadWalletBalance = async () => {
    try {
      setLoading(true);
      const walletResponse = await walletService.getWallet();
      const walletData = walletResponse.data?.data || walletResponse.data;
      setWalletBalance(parseFloat(walletData?.balance || 0));
    } catch (error) {
      console.error('Error loading wallet balance:', error);
      setWalletBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [50, 100, 250, 500, 1000];

  const handleQuickAmount = (value) => {
    if (value <= walletBalance) {
      setAmount(value.toString());
    }
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 10) {
      alert('❌ الحد الأدنى للسحب هو 10 دولار');
      return;
    }

    const withdrawAmount = parseFloat(amount);

    if (withdrawAmount > walletBalance) {
      alert('❌ الرصيد غير كافي. الرصيد الحالي: $' + walletBalance.toFixed(2));
      return;
    }

    if (withdrawAmount > 10000) {
      alert('❌ الحد الأقصى للسحب هو 10,000 دولار في المرة الواحدة');
      return;
    }

    // Validate bank details for bank transfer
    if (withdrawMethod === 'bank_transfer') {
      if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName) {
        alert('❌ يرجى إدخال جميع بيانات الحساب البنكي');
        return;
      }
    }

    setProcessing(true);

    try {
      const withdrawData = {
        amount: withdrawAmount,
        method: withdrawMethod,
        description: `سحب رصيد ${withdrawAmount.toFixed(2)} دولار عبر ${withdrawMethod === 'bank_transfer' ? 'تحويل بنكي' : withdrawMethod === 'paypal' ? 'PayPal' : 'بطاقة'}`,
        bank_details: withdrawMethod === 'bank_transfer' ? bankDetails : null
      };

      const response = await walletService.withdraw(withdrawData);
      console.log('Withdraw response:', response);

      // Get updated wallet balance
      const updatedWallet = await walletService.getWallet();
      const newBalance = parseFloat(updatedWallet.data?.balance || updatedWallet.data?.data?.balance || 0);

      alert(`✅ تم تقديم طلب السحب بنجاح!\n\n💰 المبلغ المطلوب سحبه: $${withdrawAmount.toFixed(2)}\n📊 الرصيد المتبقي: $${newBalance.toFixed(2)}\n\n⏳ سيتم معالجة طلبك خلال 1-3 أيام عمل`);
      
      router.push('/client/wallet');
    } catch (error) {
      console.error('Withdraw error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ أثناء السحب';
      alert(`❌ ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>سحب رصيد | Mahara</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FaArrowRight />
          <span>العودة</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">سحب رصيد</h1>
          <p className="text-gray-600">سحب الأموال من محفظتك إلى حسابك البنكي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Withdraw Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleWithdraw} className="space-y-6">
              {/* Current Balance */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg p-6 text-white">
                <p className="text-white/80 mb-2">الرصيد الحالي</p>
                {loading ? (
                  <div className="h-12 w-32 bg-white/20 animate-pulse rounded"></div>
                ) : (
                  <p className="text-4xl font-bold">${walletBalance.toLocaleString()}</p>
                )}
              </div>

              {/* Amount Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">المبلغ المراد سحبه</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    أدخل المبلغ (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= walletBalance)) {
                          setAmount(value);
                        }
                      }}
                      placeholder="0.00"
                      min="10"
                      max={walletBalance}
                      step="0.01"
                      required
                      className="w-full pl-12 pr-4 py-4 text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    الحد الأدنى: $10 | الحد الأقصى: ${walletBalance.toFixed(2)}
                  </p>
                  {amount && parseFloat(amount) > walletBalance && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠️ المبلغ المطلوب أكبر من الرصيد المتاح
                    </p>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-5 gap-3">
                  {quickAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleQuickAmount(value)}
                      disabled={value > walletBalance}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        amount === value.toString()
                          ? 'bg-primary-500 text-white'
                          : value > walletBalance
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ${value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Withdraw Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">طريقة السحب</h2>
                
                <div className="space-y-3">
                  {/* Bank Transfer */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    withdrawMethod === 'bank_transfer' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="withdrawMethod"
                      value="bank_transfer"
                      checked={withdrawMethod === 'bank_transfer'}
                      onChange={(e) => setWithdrawMethod(e.target.value)}
                      className="w-5 h-5 text-primary-500"
                    />
                    <FaUniversity className="text-2xl text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">تحويل بنكي</p>
                      <p className="text-xs text-gray-500">يستغرق 1-3 أيام عمل</p>
                    </div>
                  </label>

                  {/* PayPal */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    withdrawMethod === 'paypal' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="withdrawMethod"
                      value="paypal"
                      checked={withdrawMethod === 'paypal'}
                      onChange={(e) => setWithdrawMethod(e.target.value)}
                      className="w-5 h-5 text-primary-500"
                    />
                    <FaCreditCard className="text-2xl text-blue-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">PayPal</p>
                      <p className="text-xs text-gray-500">سحب فوري (يستغرق 24 ساعة)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Bank Details (if bank transfer selected) */}
              {withdrawMethod === 'bank_transfer' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">معلومات الحساب البنكي</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        اسم صاحب الحساب
                      </label>
                      <input
                        type="text"
                        name="accountName"
                        value={bankDetails.accountName}
                        onChange={handleBankChange}
                        placeholder="أحمد محمد"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        رقم الحساب
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={bankDetails.accountNumber}
                        onChange={handleBankChange}
                        placeholder="1234567890"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        اسم البنك
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={bankDetails.bankName}
                        onChange={handleBankChange}
                        placeholder="البنك الأهلي السعودي"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        IBAN (اختياري)
                      </label>
                      <input
                        type="text"
                        name="iban"
                        value={bankDetails.iban}
                        onChange={handleBankChange}
                        placeholder="SA1234567890123456789012"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal Email (if PayPal selected) */}
              {withdrawMethod === 'paypal' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">معلومات PayPal</h2>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      البريد الإلكتروني المرتبط بـ PayPal
                    </label>
                    <input
                      type="email"
                      name="paypalEmail"
                      placeholder="example@paypal.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={processing || !amount || parseFloat(amount) < 10 || parseFloat(amount) > walletBalance}
                  className="flex-1 px-6 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      تأكيد السحب
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص العملية</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الرصيد الحالي</span>
                  <span className="font-semibold text-gray-900">${walletBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المبلغ المطلوب سحبه</span>
                  <span className="font-semibold text-gray-900">
                    ${amount ? parseFloat(amount).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">الرصيد المتبقي</span>
                  <span className="font-bold text-primary-600 text-xl">
                    ${amount ? (walletBalance - parseFloat(amount)).toFixed(2) : walletBalance.toFixed(2)}
                  </span>
                </div>
                {amount && parseFloat(amount) > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                    💡 سيتم خصم ${parseFloat(amount).toFixed(2)} من محفظتك بعد معالجة الطلب
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-yellow-700 mb-2">
                  <FaExclamationTriangle />
                  <span className="font-semibold text-sm">مهم</span>
                </div>
                <p className="text-xs text-yellow-600">
                  • معالجة طلبات السحب تستغرق 1-3 أيام عمل
                  <br />
                  • تأكد من صحة بيانات الحساب البنكي
                  <br />
                  • لا يمكن إلغاء الطلب بعد التأكيد
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <FaLock />
                  <span className="font-semibold text-sm">آمن ومحمي</span>
                </div>
                <p className="text-xs text-green-600">
                  جميع المعاملات مشفرة ومحمية بأحدث تقنيات الأمان
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

