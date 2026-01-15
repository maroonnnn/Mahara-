import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FaArrowLeft, FaChartLine, FaArrowUp, FaArrowDown, FaClock } from 'react-icons/fa';

function monthKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function monthLabel(date) {
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export default function FreelancerReports() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState({ available: 0, pending: 0, total: 0 });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const walletService = (await import('../../services/walletService')).default;

      // Wallet
      try {
        const walletResponse = await walletService.getWallet();
        const walletData = walletResponse.data?.data || walletResponse.data || {};
        setBalance({
          available: parseFloat(walletData.available || walletData.balance || 0),
          pending: parseFloat(walletData.pending || 0),
          total: parseFloat(walletData.total || walletData.balance || 0),
        });
      } catch (e) {
        console.error('Error loading wallet:', e);
      }

      // Transactions
      try {
        const transactionsResponse = await walletService.getTransactions();
        const transactionsData = transactionsResponse.data?.data || transactionsResponse.data || [];
        const transactionsList = Array.isArray(transactionsData) ? transactionsData : (transactionsData.data || []);

        const normalizeStatus = (rawStatus) => {
          const s = String(rawStatus || '').toLowerCase();
          if (!s) return 'completed';
          if (['pending', 'processing', 'in_progress', 'in-progress', 'queued'].includes(s)) return 'pending';
          if (['completed', 'complete', 'success', 'succeeded', 'paid', 'done'].includes(s)) return 'completed';
          return s;
        };

        const normalizeType = (rawType, amount) => {
          const t = String(rawType || '').toLowerCase();
          if (t.includes('withdraw')) return 'withdrawal';
          if (t.includes('deposit') || t.includes('topup') || t.includes('top_up')) return 'deposit';
          if (t.includes('payment') || t.includes('earning') || t.includes('income')) return 'earning';
          if (t.includes('fee') || t.includes('commission')) return 'fee';
          return amount < 0 ? 'withdrawal' : 'earning';
        };

        const mapped = transactionsList.map((t) => {
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
          const createdAt = rawDate ? new Date(rawDate) : new Date();

          return {
            id: t.id,
            type: normalizeType(t.type, amount),
            amount,
            description: description || 'Transaction',
            status: normalizeStatus(t.status),
            method,
            projectId: t.project_id ? `#${t.project_id}` : undefined,
            createdAt,
          };
        });

        setTransactions(mapped);
      } catch (e) {
        console.error('Error loading transactions:', e);
        setTransactions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'completed');
    const earnings = completed.filter((t) => t.type === 'earning' && t.amount > 0);
    const withdrawals = completed.filter((t) => t.type === 'withdrawal' && t.amount < 0);

    const totalEarned = earnings.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawn = withdrawals.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const now = new Date();
    const currentKey = monthKey(now);
    const thisMonthEarned = earnings
      .filter((t) => monthKey(t.createdAt) === currentKey)
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalEarned, totalWithdrawn, net: totalEarned - totalWithdrawn, thisMonthEarned };
  }, [transactions]);

  const monthly = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d);
    }

    const completed = transactions.filter((t) => t.status === 'completed');
    const groups = new Map();

    for (const d of months) {
      groups.set(monthKey(d), { label: monthLabel(d), earnings: 0, withdrawals: 0 });
    }

    for (const t of completed) {
      const k = monthKey(t.createdAt);
      if (!groups.has(k)) continue;
      const g = groups.get(k);
      if (t.type === 'earning' && t.amount > 0) g.earnings += t.amount;
      if (t.type === 'withdrawal' && t.amount < 0) g.withdrawals += Math.abs(t.amount);
    }

    const rows = months.map((d) => ({ key: monthKey(d), ...groups.get(monthKey(d)) }));
    const max = Math.max(...rows.map((r) => Math.max(r.earnings, r.withdrawals)), 1);
    return { rows, max };
  }, [transactions]);

  const recent = useMemo(() => {
    return [...transactions]
      .sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0))
      .slice(0, 10);
  }, [transactions]);

  return (
    <DashboardLayout>
      <Head>
        <title>Reports | Mahara</title>
      </Head>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/freelancer/wallet" className="text-gray-600 hover:text-primary-600">
                <FaArrowLeft />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            </div>
            <p className="text-gray-600 mt-1">Earnings and activity overview</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gray-600">
            <FaChartLine />
            <span className="text-sm">Last 6 months</span>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total earned</p>
            <p className="text-2xl font-bold text-gray-900">${summary.totalEarned.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">This month</p>
            <p className="text-2xl font-bold text-green-600">${summary.thisMonthEarned.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total withdrawn</p>
            <p className="text-2xl font-bold text-blue-600">${summary.totalWithdrawn.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Net</p>
            <p className="text-2xl font-bold text-gray-900">${summary.net.toLocaleString()}</p>
          </div>
        </div>

        {/* Wallet snapshot */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Wallet snapshot</p>
              <p className="text-lg font-semibold text-gray-900">Total balance: ${balance.total.toLocaleString()}</p>
              <p className="text-sm text-gray-600">
                Available: ${balance.available.toLocaleString()} • Pending: ${balance.pending.toLocaleString()}
              </p>
            </div>
            <Link
              href="/freelancer/wallet"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
            >
              Back to wallet
            </Link>
          </div>
        </div>

        {/* Monthly chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Monthly totals</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2 text-gray-700">
                <span className="inline-block w-3 h-3 rounded bg-green-500" /> Earnings
              </span>
              <span className="flex items-center gap-2 text-gray-700">
                <span className="inline-block w-3 h-3 rounded bg-blue-500" /> Withdrawals
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading…</div>
          ) : monthly.rows.every((r) => r.earnings === 0 && r.withdrawals === 0) ? (
            <div className="py-10 text-center text-gray-500">No transaction data yet.</div>
          ) : (
            <div className="space-y-4">
              {monthly.rows.map((r) => (
                <div key={r.key} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-2 text-sm font-semibold text-gray-700">{r.label}</div>
                  <div className="col-span-10 space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Earnings</span>
                        <span className="font-semibold text-gray-900">${r.earnings.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded">
                        <div
                          className="h-2 bg-green-500 rounded"
                          style={{ width: `${(r.earnings / monthly.max) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Withdrawals</span>
                        <span className="font-semibold text-gray-900">${r.withdrawals.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded">
                        <div
                          className="h-2 bg-blue-500 rounded"
                          style={{ width: `${(r.withdrawals / monthly.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent activity</h2>
          </div>
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading…</div>
          ) : recent.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No transactions yet.</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recent.map((t) => (
                <div key={t.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        t.status !== 'completed'
                          ? 'bg-yellow-100'
                          : t.type === 'earning'
                            ? 'bg-green-100'
                            : t.type === 'withdrawal'
                              ? 'bg-blue-100'
                              : 'bg-gray-100'
                      }`}
                    >
                      {t.status !== 'completed' ? (
                        <FaClock className="text-yellow-700" />
                      ) : t.type === 'earning' ? (
                        <FaArrowUp className="text-green-700" />
                      ) : t.type === 'withdrawal' ? (
                        <FaArrowDown className="text-blue-700" />
                      ) : (
                        <FaChartLine className="text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t.description}</p>
                      <p className="text-sm text-gray-500">
                        {t.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        {t.projectId ? ` • ${t.projectId}` : ''}
                        {t.method ? ` • ${t.method}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        t.status !== 'completed'
                          ? 'text-yellow-700'
                          : t.amount < 0
                            ? 'text-blue-700'
                            : 'text-green-700'
                      }`}
                    >
                      {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toLocaleString()}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {t.status === 'completed' ? 'Completed' : 'Pending'}
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

