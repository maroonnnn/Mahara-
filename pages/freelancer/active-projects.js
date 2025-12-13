import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  FaEnvelope,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaFileAlt
} from 'react-icons/fa';

export default function FreelancerActiveProjectsPage() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'تصميم شعار احترافي لشركتي',
      client: {
        id: 1,
        name: 'Abdalrhmn bobes'
      },
      budget: 500,
      budgetType: 'fixed',
      deliveryTime: '7 days',
      status: 'in_progress',
      progress: 60,
      startDate: '2024-01-15',
      deadline: '2024-01-22',
      conversationId: 1
    },
    {
      id: 2,
      title: 'تطوير موقع إلكتروني',
      client: {
        id: 2,
        name: 'Tech Company'
      },
      budget: 75,
      budgetType: 'hourly',
      deliveryTime: '1 month',
      status: 'in_progress',
      progress: 30,
      startDate: '2024-01-10',
      deadline: '2024-02-10',
      conversationId: 2
    },
  ]);

  return (
    <DashboardLayout>
      <Head>
        <title>المشاريع النشطة | Fiverr Clone</title>
        <meta name="description" content="Active projects" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">المشاريع النشطة</h1>
          <p className="text-gray-600">مشاريعك قيد التنفيذ</p>
        </div>

        {projects.length === 0 ? (
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
                          ${project.budget} {project.budgetType === 'hourly' ? '/hr' : ''}
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
                    <Link
                      href={`/freelancer/messages/${project.conversationId}`}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center gap-2"
                    >
                      <FaEnvelope />
                      فتح المحادثة
                    </Link>
                    <Link
                      href={`/freelancer/projects/${project.id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                    >
                      عرض التفاصيل
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

