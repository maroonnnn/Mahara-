import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaEnvelope,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaFileAlt,
  FaPaperPlane
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useLanguage } from '../../contexts/LanguageContext';

export default function FreelancerActiveProjectsPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [delivering, setDelivering] = useState({});

  useEffect(() => {
    if (user) {
      loadActiveProjects();
    }
  }, [user]);

  const loadActiveProjects = async () => {
    try {
      setLoading(true);
      const projectService = (await import('../../services/projectService')).default;
      const response = await projectService.getActiveProjects();
      
      const projectsData = response.data || [];
      const projectsList = Array.isArray(projectsData) ? projectsData : [];
      
      // Map projects to frontend format
      const mappedProjects = projectsList.map(p => {
        // Calculate deadline from start date and duration
        let deadline = null;
        if (p.created_at && p.duration_days) {
          const startDate = new Date(p.created_at);
          const deadlineDate = new Date(startDate);
          deadlineDate.setDate(deadlineDate.getDate() + p.duration_days);
          deadline = deadlineDate.toISOString().split('T')[0];
        }
        
        // Calculate progress (mock for now - in real app, this would come from backend)
        const progress = 0; // TODO: Add progress tracking in backend
        
        return {
          id: p.id,
          title: p.title,
          client: {
            id: p.client?.id || p.client_id,
            name: p.client?.name || 'عميل'
          },
          budget: parseFloat(p.budget || 0),
          budgetType: p.budget_type || 'fixed',
          deliveryTime: p.duration_days 
            ? `${p.duration_days} ${p.duration_days === 1 ? 'يوم' : 'أيام'}` 
            : 'غير محدد',
          status: p.status || 'in_progress',
          progress: progress,
          startDate: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : null,
          deadline: deadline,
          conversationId: p.id // Use project ID as conversation ID
        };
      });
      
      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error loading active projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverProject = async (projectId) => {
    if (!confirm(language === 'ar' 
      ? 'هل أنت متأكد من تسليم هذا المشروع؟ سيتم إشعار العميل بانتظار موافقته.'
      : 'Are you sure you want to deliver this project? The client will be notified and will need to approve.')) {
      return;
    }

    try {
      setDelivering(prev => ({ ...prev, [projectId]: true }));
      const projectService = (await import('../../services/projectService')).default;
      await projectService.deliverProject(projectId);
      
      toast.success(language === 'ar' 
        ? 'تم تسليم المشروع بنجاح! سيتم إشعار العميل.'
        : 'Project delivered successfully! The client will be notified.');
      
      // Reload projects to update status
      loadActiveProjects();
    } catch (error) {
      console.error('Error delivering project:', error);
      const message = error.response?.data?.message || 
        (language === 'ar' ? 'حدث خطأ أثناء تسليم المشروع' : 'Error delivering project');
      toast.error(message);
    } finally {
      setDelivering(prev => ({ ...prev, [projectId]: false }));
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>المشاريع النشطة |Mahara</title>
        <meta name="description" content="مشاريعك النشطة قيد التنفيذ" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">المشاريع النشطة</h1>
          <p className="text-gray-600">مشاريعك قيد التنفيذ</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل المشاريع النشطة...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مشاريع نشطة</h3>
            <p className="text-gray-600 mb-6">ابدأ بتقديم عروض على المشاريع المتاحة</p>
            <Link
              href="/freelancer/projects"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              تصفح المشاريع
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-green-600" />
                        <span className="font-semibold">
                          ${project.budget} {project.budgetType === 'hourly' ? '/ساعة' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-blue-600" />
                        <span>الموعد النهائي: {project.deadline}</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">التقدم</span>
                        <span className="font-semibold text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                      {project.client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{project.client.name}</p>
                      <p className="text-xs text-gray-500">العميل</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {project.status === 'in_progress' && (
                      <button
                        onClick={() => handleDeliverProject(project.id)}
                        disabled={delivering[project.id]}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <FaPaperPlane />
                        {delivering[project.id] 
                          ? (language === 'ar' ? 'جاري التسليم...' : 'Delivering...')
                          : (language === 'ar' ? 'تسليم المشروع' : 'Deliver Project')
                        }
                      </button>
                    )}
                    {project.status === 'delivered' && (
                      <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold flex items-center gap-2">
                        <FaCheckCircle />
                        {language === 'ar' ? 'في انتظار موافقة العميل' : 'Awaiting Client Approval'}
                      </div>
                    )}
                    <Link
                      href={`/freelancer/messages/${project.conversationId}`}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center gap-2"
                    >
                      <FaEnvelope />
                      {language === 'ar' ? 'فتح المحادثة' : 'Open Chat'}
                    </Link>
                    <Link
                      href={`/freelancer/projects/${project.id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                    >
                      {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

