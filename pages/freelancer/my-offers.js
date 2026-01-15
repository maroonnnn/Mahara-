import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaClock, 
  FaDollarSign, 
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaFileAlt,
  FaHourglassHalf,
  FaEnvelope
} from 'react-icons/fa';

export default function MyOffersPage() {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const offerService = (await import('../../services/offerService')).default;
      const response = await offerService.getMyOffers();
      const offersData = response.data?.data || response.data || [];
      const offersList = Array.isArray(offersData) ? offersData : (offersData.data || []);
      
      // Map offers to frontend format
      const mappedOffers = offersList.map(offer => ({
        id: offer.id,
        project: {
          id: offer.project?.id || offer.project_id,
          title: offer.project?.title || offer.project_title || 'Project',
          client: {
            name: offer.project?.client?.name || offer.client_name || 'Client',
            rating: offer.project?.client?.rating || offer.client_rating || 5.0
          }
        },
        amount: parseFloat(offer.amount || 0),
        duration: offer.duration_days 
          ? `${offer.duration_days} ${offer.duration_days === 1 ? 'day' : 'days'}` 
          : (offer.duration || 'Not specified'),
        message: offer.message || offer.description || '',
        status: offer.status || 'pending',
        createdAt: offer.created_at || offer.createdAt,
        views: offer.views || 0,
        acceptedAt: offer.accepted_at,
        rejectedAt: offer.rejected_at
      }));
      
      setOffers(mappedOffers);
    } catch (error) {
      console.error('Error loading offers:', error);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };


  const getStatusBadge = (status) => {
    const badges = {
      pending: { 
        text: 'Pending', 
        color: 'bg-yellow-100 text-yellow-700', 
        icon: <FaHourglassHalf /> 
      },
      accepted: { 
        text: 'Accepted', 
        color: 'bg-green-100 text-green-700', 
        icon: <FaCheckCircle /> 
      },
      rejected: { 
        text: 'Rejected', 
        color: 'bg-red-100 text-red-700', 
        icon: <FaTimesCircle /> 
      },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${badge.color}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const filteredOffers = offers.filter(offer => {
    if (filter === 'all') return true;
    return offer.status === filter;
  });

  const stats = {
    total: offers.length,
    pending: offers.filter(o => o.status === 'pending').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Head>
          <title>My Offers | Mahara</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head>
        <title>My Offers | Mahara</title>
        <meta name="description" content="All offers you have submitted to projects" />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Offers</h1>
          <p className="text-gray-600">All offers you have submitted to projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total offers</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Accepted</p>
            <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-1 p-2">
            {[
              { id: 'all', label: 'All', count: stats.total },
              { id: 'pending', label: 'Pending', count: stats.pending },
              { id: 'accepted', label: 'Accepted', count: stats.accepted },
              { id: 'rejected', label: 'Rejected', count: stats.rejected },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  filter === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-4">
          {filteredOffers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers</h3>
              <p className="text-gray-600 mb-6">
                {filter !== 'all' 
                  ? `No ${filter} offers`
                  : 'You haven’t submitted any offers yet.'}
              </p>
              <Link
                href="/freelancer/projects"
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
              >
                Browse available projects
              </Link>
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Link 
                        href={`/freelancer/projects/${offer.project.id}`}
                        className="flex-1"
                      >
                        <h3 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer">
                          {offer.project.title}
                        </h3>
                      </Link>
                      {getStatusBadge(offer.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                          {offer.project.client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{offer.project.client.name}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-green-600" />
                      <span className="font-semibold text-gray-900">${offer.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-600" />
                      <span>{offer.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEye className="text-gray-400" />
                      <span>{offer.views} views</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Sent: {offer.createdAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {offer.status === 'accepted' && (
                      <Link
                        href={`/freelancer/messages/${offer.project.id}`}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold flex items-center gap-2 text-sm"
                      >
                        <FaEnvelope />
                        Open chat
                      </Link>
                    )}
                    <Link
                      href={`/freelancer/projects/${offer.project.id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm"
                    >
                      View project
                    </Link>
                  </div>
                </div>

                {offer.status === 'accepted' && offer.acceptedAt && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      🎉 <strong>Congrats!</strong> Your offer was accepted on {offer.acceptedAt}
                    </p>
                  </div>
                )}

                {offer.status === 'rejected' && offer.rejectedAt && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      Your offer was rejected on {offer.rejectedAt}. Don’t worry—there are plenty of other opportunities!
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Tips */}
        {offers.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">💡 Tips to increase your chances</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>- Write tailored offers for each project (avoid copy/paste).</li>
              <li>- Mention relevant experience and similar work.</li>
              <li>- Offer competitive, realistic pricing.</li>
              <li>- Commit to a realistic delivery timeline.</li>
              <li>- Ask clarifying questions to show you understand the requirements.</li>
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

