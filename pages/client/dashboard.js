import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import projectService from '../../services/projectService';
import walletService from '../../services/walletService';
import { 
  FaPlus,
  FaProjectDiagram,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaEnvelope,
  FaUsers,
  FaChartLine
} from 'react-icons/fa';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [otherProjects, setOtherProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherProjectsLoading, setOtherProjectsLoading] = useState(true);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    if (user) {
      loadData();
      loadOtherProjects();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Try to load from API first
      try {
        const projectsResponse = await projectService.getMyProjects();
        const projectsData = projectsResponse.data?.data || projectsResponse.data || [];
        
        // Handle paginated response
        const projectsList = Array.isArray(projectsData) 
          ? projectsData 
          : (projectsData.data || []);
        
        // Sort by created_at (newest first) and take first 3
        const sortedProjects = [...projectsList].sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt || 0);
          const dateB = new Date(b.created_at || b.createdAt || 0);
          return dateB - dateA;
        });
        
        setProjects(sortedProjects.slice(0, 3));
        
        // Load wallet balance
        try {
          const walletResponse = await walletService.getWallet();
          setWallet(walletResponse.data?.data || walletResponse.data);
        } catch (error) {
          console.error('Error loading wallet:', error);
          setWallet({ balance: 0 });
        }
        
        setLoading(false);
        return; // Exit early on success
      } catch (apiError) {
        console.error('API Error:', apiError);
        // If API fails, try localStorage as fallback
      }
      
      // Fallback: Load from localStorage (filtered by current user)
      const savedProjects = JSON.parse(localStorage.getItem('myProjects') || '[]');
      
      // Filter projects by current user ID
      const userProjects = savedProjects.filter(p => {
        const projectClientId = p.client?.id || p.client_id;
        return projectClientId === user?.id;
      });
      
      if (userProjects.length > 0) {
        // Sort by created_at (newest first) and take first 3
        const sortedProjects = [...userProjects].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.created_at || 0);
          const dateB = new Date(b.createdAt || b.created_at || 0);
          return dateB - dateA;
        });
        setProjects(sortedProjects.slice(0, 3));
      } else {
        setProjects([]);
      }

      // Load wallet balance (fallback)
      try {
        const walletResponse = await walletService.getWallet();
        setWallet(walletResponse.data?.data || walletResponse.data);
      } catch (error) {
        console.error('Error loading wallet:', error);
        setWallet({ balance: 0 });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setProjects([]);
      setWallet({ balance: 0 });
    } finally {
      setLoading(false);
    }
  };

  const loadOtherProjects = async () => {
    try {
      setOtherProjectsLoading(true);
      
      // Load open projects from API
      const response = await projectService.getOpenProjects();
      console.log('Open projects API response:', response);
      
      // Handle Laravel pagination response structure
      const responseData = response.data || response;
      const allOpenProjects = responseData.data || responseData || [];
      
      console.log('All open projects:', allOpenProjects);
      console.log('Current user ID:', user?.id);
      
      // Filter out current user's projects to show only "other" projects
      // (Backend already filters this, but we do it again as a safety measure)
      const filteredProjects = allOpenProjects.filter(project => {
        const projectClientId = project.client_id || project.client?.id;
        const isNotOwnProject = projectClientId !== user?.id;
        console.log(`Project ${project.id}: client_id=${projectClientId}, isNotOwn=${isNotOwnProject}`);
        return isNotOwnProject;
      });
      
      console.log('Filtered projects (other users):', filteredProjects);
      
      // Sort by created_at (newest first) and take first 6
      const sortedProjects = [...filteredProjects].sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateB - dateA;
      });
      
      setOtherProjects(sortedProjects.slice(0, 6));
    } catch (error) {
      console.error('Error loading other projects:', error);
      console.error('Error details:', error.response?.data || error.message);
      setOtherProjects([]);
    } finally {
      setOtherProjectsLoading(false);
    }
  };

  // Calculate statistics from actual data
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => 
      p.status === 'open' || p.status === 'in_progress' || p.status === 'active'
    ).length,
    completedProjects: projects.filter(p => 
      p.status === 'completed' || p.status === 'done'
    ).length,
    totalSpent: wallet?.balance ? Math.abs(wallet.balance) : 0
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard | Mahara</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name || 'Client'}
          </h1>
          <p className="text-gray-600">Manage your projects and track progress.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total projects</p>
                {loading ? (
                  <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaProjectDiagram className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Active projects</p>
                {loading ? (
                  <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-green-600">{stats.activeProjects}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Completed</p>
                {loading ? (
                  <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-blue-600">{stats.completedProjects}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total spent</p>
                {loading ? (
                  <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaDollarSign className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Have a new project?</h2>
              <p className="text-primary-100">Post it now and receive offers from top freelancers.</p>
            </div>
            <Link
              href="/client/projects/new"
              className="px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2"
            >
              <FaPlus />
              New project
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent projects</h2>
            <Link
              href="/client/projects"
              className="text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-2"
            >
              View all
              <FaChartLine />
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FaProjectDiagram className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">Create your first project and receive offers from freelancers.</p>
              <Link
                href="/client/projects/new"
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
              >
                <FaPlus />
                Create a project
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/client/projects/${project.id}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                          {project.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {project.category?.name || project.category || 'Not specified'}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {project.status === 'open' ? 'Open' : 
                           project.status === 'active' ? 'Active' :
                           project.status === 'in_progress' ? 'In progress' :
                           project.status === 'completed' ? 'Completed' :
                           project.status === 'cancelled' ? 'Cancelled' : project.status || 'Open'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-gray-900">${project.budget || 0}</p>
                      <p className="text-sm text-gray-500">
                        {project.deliveryTime 
                          ? project.deliveryTime
                              .replace(/\b(\d+)\s*days?\b/gi, (match, num) => `${num} day${num === '1' ? '' : 's'}`)
                              .replace(/\b(\d+)\s*weeks?\b/gi, (match, num) => `${num} week${num === '1' ? '' : 's'}`)
                              .replace(/\b(\d+)\s*months?\b/gi, (match, num) => `${num} month${num === '1' ? '' : 's'}`)
                          : (project.duration_days 
                            ? `${project.duration_days} ${project.duration_days === 1 ? 'day' : 'days'}` 
                            : 'Not specified')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Other Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Open projects</h2>
            <Link
              href="/freelancer/projects"
              className="text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-2"
            >
              View all
              <FaChartLine />
            </Link>
          </div>

          {otherProjectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : otherProjects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FaProjectDiagram className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No open projects right now</h3>
              <p className="text-gray-600 mb-4">There are no open projects from other clients at the moment.</p>
              <p className="text-sm text-gray-500">
                This section shows projects created by other clients for inspiration and review. Content will appear when other clients post new projects.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col h-full">
                    <Link href={`/projects/${project.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer line-clamp-2">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {project.category?.name || project.category || 'Not specified'}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {project.status === 'open' ? 'Open' : 
                         project.status === 'active' ? 'Active' :
                         project.status === 'in_progress' ? 'In progress' :
                         project.status === 'completed' ? 'Completed' :
                         project.status === 'cancelled' ? 'Cancelled' : project.status || 'Open'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xl font-bold text-gray-900">${project.budget}</p>
                        {project.duration_days && (
                          <p className="text-xs text-gray-500">
                            {project.duration_days} day{project.duration_days === 1 ? '' : 's'}
                          </p>
                        )}
                      </div>
                      {project.client && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">
                            {project.client.name || project.client.name || 'Client'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/client/projects"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <FaProjectDiagram className="text-primary-600 text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900">My projects</p>
                <p className="text-sm text-gray-500">Manage all projects</p>
              </div>
            </div>
          </Link>

          <Link
            href="/client/messages"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Messages</p>
                <p className="text-sm text-gray-500">Chat with freelancers</p>
              </div>
            </div>
          </Link>

          <Link
            href="/client/wallet"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <FaDollarSign className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Wallet</p>
                <p className="text-sm text-gray-500">Manage balance</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
