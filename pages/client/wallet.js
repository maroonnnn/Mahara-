import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FaWallet, FaDollarSign, FaArrowUp, FaArrowDown, FaCreditCard } from 'react-icons/fa';

export default function ClientWallet() {
  const transactions = [
    { id: 1, type: 'payment', amount: -500, description: 'دفع للمشروع #1234', date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'refund', amount: 200, description: 'استرداد من المشروع #1230', date: '2024-01-10', status: 'completed' },
    { id: 3, type: 'payment', amount: -300, description: 'دفع للمشروع #1228', date: '2024-01-05', status: 'completed' },
  ];

  return (
    <DashboardLayout>
      <Head>
        <title>المحفظة | Mahara</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">المحفظة</h1>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-2">الرصيد الحالي</p>
              <p className="text-5xl font-bold">$1,200</p>
            </div>
            <FaWallet className="text-6xl text-white/20" />
          </div>
          <div className="mt-6 flex gap-4">
            <Link href="/client/wallet/deposit" className="px-6 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              إضافة رصيد
            </Link>
            <button className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold">
              سحب الرصيد
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">المعاملات الأخيرة</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === 'payment' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {transaction.type === 'payment' ? (
                      <FaArrowDown className="text-red-600" />
                    ) : (
                      <FaArrowUp className="text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount)}
                  </p>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {transaction.status === 'completed' ? 'مكتمل' : 'معلق'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

