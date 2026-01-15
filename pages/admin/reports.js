import Head from 'next/head';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { 
  FaDownload, 
  FaChartLine, 
  FaChartBar,
  FaChartPie,
  FaUsers,
  FaProjectDiagram,
  FaDollarSign
} from 'react-icons/fa';

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [reportData, setReportData] = useState({
    users: {
      total: 0,
      new: 0,
      active: 0,
      growth: '0%'
    },
    projects: {
      total: 0,
      active: 0,
      completed: 0,
      growth: '0%'
    },
    revenue: {
      total: 0,
      thisPeriod: 0,
      lastPeriod: 0,
      growth: '0%'
    }
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    loadReports();
  }, [selectedPeriod]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await adminService.getReports(selectedPeriod);
      const data = response.data;
      
      setReportData({
        users: {
          total: data.users?.total || 0,
          new: data.users?.new || 0,
          active: data.users?.active || 0,
          growth: data.users?.growth || '0%'
        },
        projects: {
          total: data.projects?.total || 0,
          active: data.projects?.active || 0,
          completed: data.projects?.completed || 0,
          growth: data.projects?.growth || '0%'
        },
        revenue: {
          total: data.revenue?.total || 0,
          thisPeriod: data.revenue?.thisPeriod || 0,
          lastPeriod: data.revenue?.lastPeriod || 0,
          growth: data.revenue?.growth || '0%'
        }
      });
      
      setMonthlyData(data.monthlyTrends || []);
      setTopCategories(data.topCategories || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <FaChartLine className="w-6 h-6" />,
      description: 'High-level performance summary'
    },
    {
      id: 'users',
      title: 'Users report',
      icon: <FaUsers className="w-6 h-6" />,
      description: 'User activity analysis'
    },
    {
      id: 'projects',
      title: 'Projects report',
      icon: <FaProjectDiagram className="w-6 h-6" />,
      description: 'Project performance analysis'
    },
    {
      id: 'revenue',
      title: 'Revenue report',
      icon: <FaDollarSign className="w-6 h-6" />,
      description: 'Revenue and growth analysis'
    }
  ];

  return (
    <>
      <Head>
        <title>Reports & Analytics - Mahara</title>
      </Head>

      <DashboardLayout requiredRole="admin">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Reports & analytics
              </h1>
              <p className="text-gray-600">
                Detailed insights and performance reports
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
              </select>
              <button className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold">
                <FaDownload />
                Export
              </button>
            </div>
          </div>

          {/* Report Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`text-left p-6 rounded-lg border-2 transition-all ${
                  selectedReport === report.id
                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                }`}
              >
                <div className={`mb-4 ${selectedReport === report.id ? 'text-primary-600' : 'text-gray-400'}`}>
                  {report.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{report.title}</h3>
                <p className="text-sm text-gray-600">{report.description}</p>
              </button>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaUsers className="w-10 h-10 opacity-75" />
                <div>
                  <p className="text-sm opacity-90">Total users</p>
                  <p className="text-3xl font-bold">{reportData.users.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">New users: {reportData.users.new}</span>
                <span className="font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">{reportData.users.growth}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaProjectDiagram className="w-10 h-10 opacity-75" />
                <div>
                  <p className="text-sm opacity-90">Total projects</p>
                  <p className="text-3xl font-bold">{reportData.projects.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">Active: {reportData.projects.active}</span>
                <span className="font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">{reportData.projects.growth}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaDollarSign className="w-10 h-10 opacity-75" />
                <div>
                  <p className="text-sm opacity-90">Total revenue</p>
                  <p className="text-3xl font-bold">${reportData.revenue.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">This period: ${reportData.revenue.thisPeriod.toLocaleString()}</span>
                <span className="font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">{reportData.revenue.growth}</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Monthly trends
                </h2>
                <FaChartLine className="w-6 h-6 text-gray-400" />
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : monthlyData.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No data</p>
              ) : (
                <div className="space-y-4">
                  {monthlyData.map((data, index) => {
                    const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1);
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 text-sm font-semibold text-gray-700">{data.month}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Revenue</span>
                            <span className="text-xs font-semibold text-gray-900">${data.revenue.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                              style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Top categories
                </h2>
                <FaChartPie className="w-6 h-6 text-gray-400" />
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : topCategories.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No categories</p>
              ) : (
                <div className="space-y-4">
                  {topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                        <p className="text-xs text-gray-600">{category.projects} projects</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${category.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Export options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaDownload />
                Export PDF
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaDownload />
                Export Excel
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaDownload />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

