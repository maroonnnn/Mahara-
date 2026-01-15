import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import walletService from '../../services/walletService';
import { FaWallet, FaDollarSign, FaArrowUp, FaArrowDown, FaCreditCard } from 'react-icons/fa';

export default function ClientWallet() {
  const router = useRouter();
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user]);

  // Reload when returning from deposit/withdraw pages
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url === '/client/wallet' && user) {
        // Small delay to ensure backend has processed the transaction
        setTimeout(() => {
          loadWalletData();
        }, 500);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, user]);

  // Reload when page becomes visible (e.g., returning from deposit page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        loadWalletData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also reload when the page is focused (e.g., returning from another page)
    const handleFocus = () => {
      if (user) {
        loadWalletData();
      }
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      
      // Initialize to empty state first (for new users)
      setWallet({ balance: 0 });
      setTransactions([]);
      
      // Load wallet balance
      try {
        const walletResponse = await walletService.getWallet();
        const walletData = walletResponse.data?.data || walletResponse.data;
        
        if (walletData) {
          setWallet({
            balance: parseFloat(walletData.balance || 0)
          });
        } else {
          setWallet({ balance: 0 });
        }
      } catch (error) {
        console.error('Error loading wallet:', error);
        // For new users, set balance to 0
        setWallet({ balance: 0 });
      }

      // Load transactions
      try {
        const transactionsResponse = await walletService.getTransactions();
        const transactionsData = transactionsResponse.data?.data || transactionsResponse.data || [];
        const transactionsList = Array.isArray(transactionsData) 
          ? transactionsData 
          : (transactionsData.data || []);
        
        // Only set transactions if we have real data from API
        if (transactionsList && transactionsList.length > 0) {
          // Map transactions to display format
          const mappedTransactions = transactionsList.map(t => {
            // Get description from details JSON or use default
            let description = '';
            let method = '';
            if (t.details) {
              const details = typeof t.details === 'string' ? JSON.parse(t.details) : t.details;
              description = details.note || details.description || '';
              method = details.method || '';
            }
            
            // Generate title based on transaction type and details
            let title = '';
            if (t.type === 'deposit') {
              if (description) {
                title = description;
              } else if (method) {
                const methodNames = {
                  'credit_card': 'Credit card',
                  'paypal': 'PayPal',
                  'bank_transfer': 'Bank transfer',
                  'unknown': 'Deposit'
                };
                title = `Deposit via ${methodNames[method] || method}`;
              } else {
                title = 'Deposit';
              }
            } else if (t.type === 'withdraw') {
              title = description || 'Withdraw';
            } else if (t.type === 'payment') {
              title = description || 'Project payment';
            } else if (t.type === 'refund') {
              title = description || 'Refund';
            } else {
              title = description || 'Transaction';
            }
            
            // Format date
            const date = t.created_at 
              ? new Date(t.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : new Date().toLocaleDateString('en-US');
            
            return {
              id: t.id,
              type: t.type || (t.amount < 0 ? 'payment' : 'deposit'),
              amount: parseFloat(t.amount || 0),
              title: title,
              description: description,
              method: method,
              date: date,
              status: t.status || 'completed'
            };
          });
          
          setTransactions(mappedTransactions);
        } else {
          // No transactions for new users
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        // For new users, no transactions
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      // Initialize to empty state for new users
      setWallet({ balance: 0 });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Wallet | Mahara</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Wallet</h1>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-2">Current balance</p>
              {loading ? (
                <div className="h-16 w-32 bg-white/20 animate-pulse rounded"></div>
              ) : (
                <p className="text-5xl font-bold">${(wallet?.balance || 0).toLocaleString()}</p>
              )}
            </div>
            <FaWallet className="text-6xl text-white/20" />
          </div>
          <div className="mt-6 flex gap-4">
            <Link href="/client/wallet/deposit" className="px-6 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Add funds
            </Link>
            <Link href="/client/wallet/withdraw" className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold">
              Withdraw
            </Link>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent transactions</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <FaWallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions</h3>
              <p className="text-gray-600 mb-6">You haven’t made any transactions yet.</p>
              <Link
                href="/client/wallet/deposit"
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
              >
                Add funds
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === 'payment' || transaction.type === 'withdraw' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {transaction.type === 'payment' || transaction.type === 'withdraw' ? (
                      <FaArrowDown className="text-red-600" />
                    ) : (
                      <FaArrowUp className="text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {transaction.title || transaction.description || 
                       (transaction.type === 'deposit' ? 'Deposit' : 
                        transaction.type === 'withdraw' ? 'Withdraw' :
                        transaction.type === 'payment' ? 'Project payment' :
                        transaction.type === 'refund' ? 'Refund' :
                        'Transaction')}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                    {transaction.method && (
                      <p className="text-xs text-gray-400 mt-1">
                        {transaction.method === 'credit_card' ? 'Credit card' :
                         transaction.method === 'paypal' ? 'PayPal' :
                         transaction.method === 'bank_transfer' ? 'Bank transfer' :
                         transaction.method}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    transaction.type === 'payment' || transaction.type === 'withdraw' 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {transaction.type === 'payment' || transaction.type === 'withdraw' ? '-' : '+'}${Math.abs(transaction.amount)}
                  </p>
                  <span className={`text-xs text-gray-500 px-2 py-1 rounded-full ${
                    transaction.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : transaction.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {transaction.status === 'completed' ? 'Completed' : 
                     transaction.status === 'pending' ? 'Pending' : 
                     'Failed'}
                  </span>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

