import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { FaBriefcase, FaUser, FaChartLine, FaEnvelope, FaArrowRight } from 'react-icons/fa';

export default function SwitchModePage() {
  const router = useRouter();
  const { user, updateProfile, isAuthenticated } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.role || 'client');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSwitchMode = () => {
    const updatedUser = {
      ...user,
      role: selectedRole
    };
    
    updateProfile(updatedUser);
    
    // Redirect based on new role
    if (selectedRole === 'freelancer') {
      router.push('/freelancer/dashboard');
    } else if (selectedRole === 'client') {
      router.push('/dashboard');
    }
  };

  const modes = [
    {
      id: 'client',
      title: 'Client Mode',
      titleAr: 'وضع العميل',
      description: 'Post projects, hire talent, and manage your work',
      descriptionAr: 'انشر المشاريع، وظف المواهب، وأدر أعمالك',
      icon: <FaUser className="w-8 h-8" />,
      color: 'blue',
      features: [
        'Post unlimited projects',
        'Receive offers from freelancers',
        'Manage active projects',
        'Secure payment system',
        'Direct messaging'
      ]
    },
    {
      id: 'freelancer',
      title: 'Freelancer Mode',
      titleAr: 'وضع المستقل',
      description: 'Browse projects, submit offers, and build your business',
      descriptionAr: 'تصفح المشاريع، قدم العروض، وابنِ عملك',
      icon: <FaBriefcase className="w-8 h-8" />,
      color: 'green',
      features: [
        'Browse available projects',
        'Submit competitive offers',
        'Showcase your portfolio',
        'Earn and withdraw',
        'Build your reputation'
      ]
    }
  ];

  const currentMode = modes.find(m => m.id === user?.role);
  const otherMode = modes.find(m => m.id === selectedRole);

  return (
    <DashboardLayout>
      <Head>
        <title>Switch Mode | Fiverr Clone</title>
        <meta name="description" content="Switch between Client and Freelancer modes" />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Switch Mode</h1>
          <p className="text-gray-600">
            You're currently in <span className="font-semibold text-primary-600">{currentMode?.title}</span>. 
            Switch modes to access different features.
          </p>
        </div>

        {/* Current Mode Info */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              {currentMode?.icon}
            </div>
            <div>
              <p className="text-primary-100 text-sm mb-1">Currently Active</p>
              <h2 className="text-2xl font-bold">{currentMode?.titleAr}</h2>
              <p className="text-primary-100">{currentMode?.descriptionAr}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
            {currentMode?.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Select Mode</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {modes.map((mode) => (
              <div
                key={mode.id}
                onClick={() => setSelectedRole(mode.id)}
                className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedRole === mode.id
                    ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {selectedRole === mode.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                      ✓
                    </div>
                  </div>
                )}

                <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${
                  mode.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {mode.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{mode.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{mode.description}</p>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700 uppercase">Features:</p>
                  {mode.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaChartLine className="w-3 h-3 text-primary-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Switch Button */}
          {selectedRole !== user?.role && (
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Switching from</p>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{currentMode?.title}</span>
                    <FaArrowRight className="text-gray-400" />
                    <span className="font-semibold text-primary-600">{otherMode?.title}</span>
                  </div>
                </div>
                <button
                  onClick={handleSwitchMode}
                  className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center gap-2 shadow-lg"
                >
                  Switch to {otherMode?.title}
                  <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {selectedRole === user?.role && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                You're already in <strong>{currentMode?.title}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaEnvelope className="text-primary-600 text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Switch Anytime</h3>
              <p className="text-sm text-gray-600 mb-3">
                You can switch between Client and Freelancer modes at any time. Your data, messages, 
                and wallet balance will be preserved across modes.
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                  All your projects and offers remain accessible
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                  Messages and conversations are synced
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                  One wallet for both client and freelancer activities
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

