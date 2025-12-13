import Head from 'next/head';
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
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
  const { language } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Mock data
  const reportData = {
    users: {
      total: 1245,
      new: 89,
      active: 856,
      growth: '+12%'
    },
    projects: {
      total: 589,
      active: 156,
      completed: 433,
      growth: '+8%'
    },
    revenue: {
      total: 125890,
      thisMonth: 18450,
      lastMonth: 16200,
      growth: '+15%'
    }
  };

  const monthlyData = [
    { month: 'Jan', users: 95, projects: 45, revenue: 12500 },
    { month: 'Feb', users: 110, projects: 52, revenue: 14200 },
    { month: 'Mar', users: 125, projects: 58, revenue: 15800 },
    { month: 'Apr', users: 140, projects: 65, revenue: 17500 },
    { month: 'May', users: 155, projects: 72, revenue: 19200 },
    { month: 'Jun', users: 168, projects: 78, revenue: 20800 },
  ];

  const topCategories = [
    { name: 'Programming & Tech', projects: 243, revenue: 48600 },
    { name: 'Digital Marketing', projects: 189, revenue: 37800 },
    { name: 'Graphics & Design', projects: 156, revenue: 31200 },
    { name: 'Writing & Translation', projects: 134, revenue: 26800 },
    { name: 'Video & Animation', projects: 98, revenue: 19600 },
  ];

  const reportTypes = [
    {
      id: 'overview',
      title: language === 'ar' ? 'نظرة عامة' : 'Overview',
      icon: <FaChartLine className="w-6 h-6" />,
      description: language === 'ar' ? 'ملخص شامل للأداء' : 'Comprehensive performance summary'
    },
    {
      id: 'users',
      title: language === 'ar' ? 'تقرير المستخدمين' : 'User Report',
      icon: <FaUsers className="w-6 h-6" />,
      description: language === 'ar' ? 'تحليل نشاط المستخدمين' : 'User activity analysis'
    },
    {
      id: 'projects',
      title: language === 'ar' ? 'تقرير المشاريع' : 'Projects Report',
      icon: <FaProjectDiagram className="w-6 h-6" />,
      description: language === 'ar' ? 'تحليل المشاريع والأداء' : 'Projects and performance analysis'
    },
    {
      id: 'revenue',
      title: language === 'ar' ? 'تقرير الإيرادات' : 'Revenue Report',
      icon: <FaDollarSign className="w-6 h-6" />,
      description: language === 'ar' ? 'تحليل الإيرادات والنمو' : 'Revenue and growth analysis'
    }
  ];

  return (
    <>
      <Head>
        <title>{language === 'ar' ? 'التقارير والإحصائيات - Fiverr' : 'Reports & Analytics - Fiverr'}</title>
      </Head>

      <DashboardLayout requiredRole="admin">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Analytics'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar' ? 'تحليلات شاملة وتقارير مفصلة' : 'Comprehensive analytics and detailed reports'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="week">{language === 'ar' ? 'أسبوع' : 'This Week'}</option>
                <option value="month">{language === 'ar' ? 'شهر' : 'This Month'}</option>
                <option value="quarter">{language === 'ar' ? 'ربع سنة' : 'This Quarter'}</option>
                <option value="year">{language === 'ar' ? 'سنة' : 'This Year'}</option>
              </select>
              <button className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold">
                <FaDownload />
                {language === 'ar' ? 'تصدير' : 'Export'}
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
                  <p className="text-sm opacity-90">{language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}</p>
                  <p className="text-3xl font-bold">{reportData.users.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">{language === 'ar' ? 'مستخدمون جدد:' : 'New:'} {reportData.users.new}</span>
                <span className="font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">{reportData.users.growth}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaProjectDiagram className="w-10 h-10 opacity-75" />
                <div>
                  <p className="text-sm opacity-90">{language === 'ar' ? 'إجمالي المشاريع' : 'Total Projects'}</p>
                  <p className="text-3xl font-bold">{reportData.projects.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">{language === 'ar' ? 'نشط:' : 'Active:'} {reportData.projects.active}</span>
                <span className="font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">{reportData.projects.growth}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaDollarSign className="w-10 h-10 opacity-75" />
                <div>
                  <p className="text-sm opacity-90">{language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</p>
                  <p className="text-3xl font-bold">${reportData.revenue.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">{language === 'ar' ? 'هذا الشهر:' : 'This month:'} ${reportData.revenue.thisMonth.toLocaleString()}</span>
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
                  {language === 'ar' ? 'الاتجاهات الشهرية' : 'Monthly Trends'}
                </h2>
                <FaChartLine className="w-6 h-6 text-gray-400" />
              </div>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-semibold text-gray-700">{data.month}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">{language === 'ar' ? 'الإيرادات' : 'Revenue'}</span>
                        <span className="text-xs font-semibold text-gray-900">${data.revenue.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                          style={{ width: `${(data.revenue / 25000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'أفضل الفئات' : 'Top Categories'}
                </h2>
                <FaChartPie className="w-6 h-6 text-gray-400" />
              </div>
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-xs text-gray-600">{category.projects} {language === 'ar' ? 'مشاريع' : 'projects'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${category.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'خيارات التصدير' : 'Export Options'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaDownload />
                {language === 'ar' ? 'تصدير PDF' : 'Export as PDF'}
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaDownload />
                {language === 'ar' ? 'تصدير Excel' : 'Export as Excel'}
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <FaDownload />
                {language === 'ar' ? 'تصدير CSV' : 'Export as CSV'}
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

