import Head from 'next/head';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, [filterStatus]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      
      const response = await adminService.getProjects(params);
      console.log('Projects API response:', response);
      
      const projectsData = response.data?.data || response.data || [];
      const projectsList = Array.isArray(projectsData) ? projectsData : (projectsData.data || []);
      
      // Transform projects to match frontend format
      const formattedProjects = projectsList.map(project => ({
        id: project.id,
        title: project.title,
        client: project.client?.name || 'غير محدد',
        freelancer: project.accepted_offer?.freelancer?.name || project.acceptedOffer?.freelancer?.name || '-',
        budget: parseFloat(project.budget || 0),
        status: project.status,
        deadline: project.deadline ? new Date(project.deadline).toLocaleDateString('ar-SA') : '-',
        category: project.category?.name || 'غير محدد'
      }));
      
      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('فشل تحميل المشاريع');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        loadProjects();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Client-side filtering for search term only (status is filtered by API)
  const filteredProjects = projects.filter(project => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return project.title.toLowerCase().includes(search) ||
           project.client.toLowerCase().includes(search) ||
           project.freelancer.toLowerCase().includes(search);
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'in_progress':
        return {
          icon: <FaClock />,
          classes: 'bg-blue-100 text-blue-800',
          text: 'قيد التنفيذ'
        };
      case 'completed':
        return {
          icon: <FaCheckCircle />,
          classes: 'bg-green-100 text-green-800',
          text: 'مكتمل'
        };
      case 'open':
        return {
          icon: <FaClock />,
          classes: 'bg-yellow-100 text-yellow-800',
          text: 'مفتوح'
        };
      case 'cancelled':
        return {
          icon: <FaTimesCircle />,
          classes: 'bg-red-100 text-red-800',
          text: 'ملغى'
        };
      case 'active':
      case 'pending':
        return {
          icon: <FaClock />,
          classes: 'bg-blue-100 text-blue-800',
          text: 'نشط'
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
        <title>إدارة المشاريع - Mahara</title>
      </Head>

      <DashboardLayout requiredRole="admin">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              إدارة المشاريع
            </h1>
            <p className="text-gray-600">
              مراقبة وإدارة جميع المشاريع على المنصة
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">إجمالي المشاريع</p>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                </div>
                <FaSearch className="text-gray-400 w-8 h-8" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">المشاريع النشطة</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {projects.filter(p => p.status === 'in_progress' || p.status === 'active').length}
                  </p>
                </div>
                <FaClock className="text-blue-400 w-8 h-8" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">المكتملة</p>
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
                  <p className="text-gray-600 text-sm">المعلقة</p>
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
                  placeholder="البحث عن مشروع..."
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
                  <option value="all">جميع الحالات</option>
                  <option value="open">مفتوح</option>
                  <option value="in_progress">قيد التنفيذ</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500 mb-4"></div>
                <p className="text-gray-600">جاري التحميل...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">لا توجد مشاريع</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المشروع
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العميل
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المستقل
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الميزانية
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الموعد النهائي
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
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
                            <button className="text-blue-600 hover:text-blue-900" title="عرض">
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900" title="حذف">
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
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

