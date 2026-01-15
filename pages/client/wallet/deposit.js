import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  FaCreditCard, 
  FaMoneyBillWave,
  FaCheckCircle,
  FaArrowRight,
  FaLock,
  FaPaypal,
  FaUniversity
} from 'react-icons/fa';

export default function DepositPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const quickAmounts = [100, 250, 500, 1000, 2000, 5000];

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const calculateFees = () => {
    const depositAmount = parseFloat(amount) || 0;
    // No platform fee on deposits
    const platformFee = 0;
    const finalAmount = depositAmount;
    
    return {
      depositAmount,
      platformFee,
      finalAmount
    };
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 10) {
      alert('❌ Minimum deposit amount is $10.');
      return;
    }

    if (parseFloat(amount) > 10000) {
      alert('❌ Maximum deposit per transaction is $10,000.');
      return;
    }

    setProcessing(true);

    try {
      // Calculate amounts (no platform fee)
      const { depositAmount, finalAmount } = calculateFees();

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In real app, call payment gateway API (Stripe, PayPal, etc.)
      const walletService = (await import('../../../services/walletService')).default;
      
      // Send amount and description to the backend
      const methodNames = {
        'credit_card': 'Credit card',
        'paypal': 'PayPal',
        'bank_transfer': 'Bank transfer'
      };
      
      const depositData = {
        amount: depositAmount, // Send full amount (no commission)
        description: `Deposit $${depositAmount.toFixed(2)} via ${methodNames[paymentMethod] || paymentMethod}`,
        method: paymentMethod
      };

      const response = await walletService.deposit(depositData);
      console.log('Deposit response:', response);

      // Get updated wallet balance from response
      const updatedWallet = await walletService.getWallet();
      const newBalance = parseFloat(updatedWallet.data?.balance || updatedWallet.data?.data?.balance || 0);

      alert(`✅ Deposit successful!\n\n💰 Added to your wallet: $${finalAmount.toFixed(2)}\n\n💼 New balance: $${newBalance.toFixed(2)}`);
      
      // Redirect to wallet page - it will reload transactions automatically
      router.push('/client/wallet');
    } catch (error) {
      console.error('Deposit error:', error);
      alert('❌ Deposit failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Deposit | Mahara</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FaArrowRight />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deposit</h1>
          <p className="text-gray-600">Add funds to your wallet to use on projects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleDeposit} className="space-y-6">
              {/* Amount Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Deposit amount</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="10"
                      max="10000"
                      step="0.01"
                      required
                      className="w-full pl-12 pr-4 py-4 text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Min: $10 | Max: $10,000</p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleQuickAmount(value)}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        amount === value.toString()
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ${value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment method</h2>
                
                <div className="space-y-3">
                  {/* Credit Card */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'credit_card' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary-500"
                    />
                    <FaCreditCard className="text-2xl text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Credit / Debit card</p>
                      <p className="text-xs text-gray-500">Visa, Mastercard, Amex</p>
                    </div>
                  </label>

                  {/* PayPal */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'paypal' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary-500"
                    />
                    <FaPaypal className="text-2xl text-blue-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">PayPal</p>
                      <p className="text-xs text-gray-500">Fast and secure</p>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary-500"
                    />
                    <FaUniversity className="text-2xl text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Bank transfer</p>
                      <p className="text-xs text-gray-500">Takes 1–3 business days</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Card Details (if credit card selected) */}
              {paymentMethod === 'credit_card' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Card details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cardholder name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardDetails.cardName}
                        onChange={handleCardChange}
                        placeholder="AHMED MOHAMED"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expiry date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          maxLength="4"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing || !amount || parseFloat(amount) < 10}
                  className="flex-1 px-6 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Confirm deposit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deposit amount</span>
                  <span className="font-semibold text-gray-900">${calculateFees().depositAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Final amount</span>
                  <span className="font-bold text-green-600 text-xl">${calculateFees().finalAmount.toFixed(2)}</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                  💡 The full $${calculateFees().finalAmount.toFixed(2)} will be added to your wallet with no platform fee
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <FaLock />
                  <span className="font-semibold text-sm">Secure payment</span>
                </div>
                <p className="text-xs text-green-600">
                  All transactions are encrypted and protected using modern security standards
                </p>
              </div>

              <div className="text-xs text-gray-500 space-y-2">
                <p>- Funds are added instantly to your wallet</p>
                <p>- You can use your balance on all projects</p>
                <p>- Refunds may be possible within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

