import Head from 'next/head';
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  FaSearch, 
  FaEye, 
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa';
import Link from 'next/link';

export default function AdminProjects() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'E-commerce Website Development',
      client: 'John Doe',
      freelancer: 'Sarah Smith',
      budget: 5000,
      status: 'active',
      deadline: '2024-12-01',
      category: 'Web Development'
    },
    {
      id: 2,
      title: 'Logo Design for Startup',
      client: 'Mike Johnson',
      freelancer: 'Emily Brown',
      budget: 500,
      status: 'completed',
      deadline: '2024-10-15',
      category: 'Graphic Design'
    },
    {
      id: 3,
      title: 'Mobile App UI/UX Design',
      client: 'David Wilson',
      freelancer: 'John Doe',
      budget: 3000,
      status: 'active',
      deadline: '2024-11-20',
      category: 'UI/UX Design'
    },
    {
      id: 4,
      title: 'SEO Optimization Service',
      client: 'Sarah Smith',
      freelancer: 'Mike Johnson',
      budget: 1200,
      status: 'pending',
      deadline: '2024-11-10',
      category: 'Digital Marketing'
    },
    {
      id: 5,
      title: 'Video Editing for YouTube',
      client: 'Emily Brown',
      freelancer: 'David Wilson',
      budget: 800,
      status: 'active',
      deadline: '2024-10-25',
      category: 'Video & Animation'
    },
  ]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.freelancer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return {
          icon: <FaClock />,
          classes: 'bg-blue-100 text-blue-800',
          text: language === 'ar' ? 'نشط' : 'Active'
        };
      case 'completed':
        return {
          icon: <FaCheckCircle />,
          classes: 'bg-green-100 text-green-800',
          text: language === 'ar' ? 'مكتمل' : 'Completed'
        };
      case 'pending':
        return {
          icon: <FaClock />,
          classes: 'bg-yellow-100 text-yellow-800',
          text: language === 'ar' ? 'معلق' : 'Pending'
        };
      case 'cancelled':
        return {
          icon: <FaTimesCircle />,
          classes: 'bg-red-100 text-red-800',
          text: language === 'ar' ? 'ملغى' : 'Cancelled'
        };
      default:
        return {
          icon: null,
          classes: 'bg-gray-100 text-gray-800',
          text: status
        };
    }
  };

  return (
    <>
      <Head>
        <title>{language === 'ar' ? 'إدارة المشاريع - Fiverr' : 'Project Management - Fiverr'}</title>
      </Head>

      <DashboardLayout requiredRole="admin">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'إدارة المشاريع' : 'Project Management'}
            </h1>
            <p className="text-gray-600">
              {language === 'ar' ? 'مراقبة وإدارة جميع المشاريع على المنصة' : 'Monitor and manage all platform projects'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'إجمالي المشاريع' : 'Total Projects'}</p>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                </div>
                <FaSearch className="text-gray-400 w-8 h-8" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'المشاريع النشطة' : 'Active'}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {projects.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <FaClock className="text-blue-400 w-8 h-8" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'المكتملة' : 'Completed'}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {projects.filter(p => p.status === 'completed').length}
                  </p>
                </div>
                <FaCheckCircle className="text-green-400 w-8 h-8" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'المعلقة' : 'Pending'}</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {projects.filter(p => p.status === 'pending').length}
                  </p>
                </div>
                <FaClock className="text-yellow-400 w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'البحث عن مشروع...' : 'Search projects...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                  <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                  <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                  <option value="pending">{language === 'ar' ? 'معلق' : 'Pending'}</option>
                  <option value="cancelled">{language === 'ar' ? 'ملغى' : 'Cancelled'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'المشروع' : 'Project'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'العميل' : 'Client'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'المستقل' : 'Freelancer'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'الميزانية' : 'Budget'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'الموعد النهائي' : 'Deadline'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => {
                    const statusInfo = getStatusBadge(project.status);
                    return (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{project.title}</div>
                            <div className="text-sm text-gray-500">{project.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.freelancer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ${project.budget.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.classes}`}>
                            {statusInfo.icon}
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.deadline}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-blue-600 hover:text-blue-900" title={language === 'ar' ? 'عرض' : 'View'}>
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900" title={language === 'ar' ? 'حذف' : 'Delete'}>
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{language === 'ar' ? 'لا توجد مشاريع' : 'No projects found'}</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

