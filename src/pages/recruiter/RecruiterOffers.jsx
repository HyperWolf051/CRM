import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Filter, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Building2,
  FileText,
  TrendingUp,
  Users,
  Target,
  Award
} from 'lucide-react';
import { useOffers } from '@/hooks/useOffers';
import OfferCard from '@/components/recruitment/OfferCard';
import OfferFilters from '@/components/recruitment/OfferFilters';
import OfferFormModal from '@/components/recruitment/OfferFormModal';
import OfferPipelineChart from '@/components/recruitment/OfferPipelineChart';
import BulkActionsPanel from '@/components/recruitment/BulkActionsPanel';

export default function RecruiterOffers() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    position: [],
    client: [],
    salaryRange: null,
    dateRange: null,
    priority: [],
    createdBy: []
  });

  const { 
    offers, 
    loading, 
    pipelineData, 
    createOffer, 
    updateOffer, 
    deleteOffer,
    extendOffer,
    withdrawOffer,
    negotiateOffer
  } = useOffers(filters, searchQuery);

  // Filter offers based on search and filters
  const filteredOffers = useMemo(() => {
    if (!offers) return [];
    
    let filtered = [...offers];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(offer => 
        offer.candidateName.toLowerCase().includes(query) ||
        offer.jobTitle.toLowerCase().includes(query) ||
        offer.clientName.toLowerCase().includes(query) ||
        offer.offerDetails.position.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [offers, searchQuery]);

  // Pipeline summary data
  const pipelineSummary = useMemo(() => {
    if (!offers) return [];
    
    const statusCounts = offers.reduce((acc, offer) => {
      acc[offer.status] = (acc[offer.status] || 0) + 1;
      return acc;
    }, {});

    return [
      {
        status: 'draft',
        count: statusCounts.draft || 0,
        label: 'Draft',
        color: 'bg-gray-500',
        icon: FileText
      },
      {
        status: 'sent',
        count: statusCounts.sent || 0,
        label: 'Sent',
        color: 'bg-blue-500',
        icon: Clock
      },
      {
        status: 'negotiating',
        count: statusCounts.negotiating || 0,
        label: 'Negotiating',
        color: 'bg-amber-500',
        icon: AlertCircle
      },
      {
        status: 'accepted',
        count: statusCounts.accepted || 0,
        label: 'Accepted',
        color: 'bg-green-500',
        icon: CheckCircle
      }
    ];
  }, [offers]);

  const handleCreateOffer = async (offerData) => {
    try {
      await createOffer(offerData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create offer:', error);
    }
  };

  const handleExtendOffer = async (offerId) => {
    try {
      await extendOffer(offerId);
    } catch (error) {
      console.error('Failed to extend offer:', error);
    }
  };

  const handleNegotiateOffer = async (offerId, negotiationData) => {
    try {
      await negotiateOffer(offerId, negotiationData);
    } catch (error) {
      console.error('Failed to negotiate offer:', error);
    }
  };

  const handleWithdrawOffer = async (offerId) => {
    try {
      await withdrawOffer(offerId);
    } catch (error) {
      console.error('Failed to withdraw offer:', error);
    }
  };

  const handleViewOffer = (offerId) => {
    navigate(`/app/recruiter/offers/${offerId}`);
  };

  const handleBulkAction = async (action, data) => {
    try {
      switch (action) {
        case 'delete':
          await Promise.all(selectedOffers.map(id => deleteOffer(id)));
          break;
        case 'export':
          // Handle export functionality
          break;
        case 'update-status':
          await Promise.all(selectedOffers.map(id => updateOffer(id, { status: data.status })));
          break;
      }
      setSelectedOffers([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const handleSelectOffer = (offerId) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOffers.length === filteredOffers.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(filteredOffers.map(offer => offer.id));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Job Offers</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and track job offers throughout the negotiation process</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-target"
        >
          <Plus className="w-4 h-4" />
          <span>Create Offer</span>
        </button>
      </div>

      {/* Pipeline Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {pipelineSummary.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.status} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{item.count}</p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Offer Pipeline</h3>
          <div className="flex items-center space-x-2">
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
        </div>
        <OfferPipelineChart data={pipelineData} />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-2 sm:gap-3">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-3 sm:py-2 border rounded-lg transition-colors touch-target ${
                showFilters 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filters</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-3 sm:py-2 text-sm touch-target ${
                  viewMode === 'cards' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-3 sm:py-2 text-sm border-l border-gray-300 touch-target ${
                  viewMode === 'table' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <OfferFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={() => setFilters({
                status: [],
                position: [],
                client: [],
                salaryRange: null,
                dateRange: null,
                priority: [],
                createdBy: []
              })}
            />
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedOffers.length > 0 && (
        <BulkActionsPanel
          selectedItems={selectedOffers}
          onBulkAction={handleBulkAction}
          totalSelected={selectedOffers.length}
          actions={[
            { id: 'export', label: 'Export Selected', icon: Download },
            { id: 'delete', label: 'Delete Selected', icon: Trash2, variant: 'danger' }
          ]}
        />
      )}

      {/* Offers Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || Object.values(filters).some(f => f?.length > 0)
              ? 'Try adjusting your search or filters'
              : 'Create your first job offer to get started'
            }
          </p>
          {!searchQuery && !Object.values(filters).some(f => f?.length > 0) && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Offer</span>
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onView={() => handleViewOffer(offer.id)}
              onExtend={() => handleExtendOffer(offer.id)}
              onNegotiate={(data) => handleNegotiateOffer(offer.id, data)}
              onWithdraw={() => handleWithdrawOffer(offer.id)}
              onSelect={() => handleSelectOffer(offer.id)}
              isSelected={selectedOffers.includes(offer.id)}
              showActions={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOffers.length === filteredOffers.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                    />
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOffers.includes(offer.id)}
                        onChange={() => handleSelectOffer(offer.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{offer.candidateName}</div>
                          <div className="text-sm text-gray-500 truncate">{offer.candidateEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm text-gray-900 truncate">{offer.offerDetails.position}</div>
                      <div className="text-sm text-gray-500 truncate">{offer.offerDetails.department}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center min-w-0">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate">{offer.clientName}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-600 mr-1 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                          {offer.offerDetails.salary.base.toLocaleString()} {offer.offerDetails.salary.currency}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{offer.offerDetails.salary.frequency}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        offer.status === 'declined' ? 'bg-red-100 text-red-800' :
                        offer.status === 'negotiating' ? 'bg-amber-100 text-amber-800' :
                        offer.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
                        <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                        {new Date(offer.timeline.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOffer(offer.id)}
                          className="text-blue-600 hover:text-blue-800 p-2 touch-target"
                          aria-label="View offer"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {/* Handle edit */}}
                          className="text-gray-600 hover:text-gray-800 p-2 touch-target"
                          aria-label="Edit offer"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Offer Modal */}
      {showCreateModal && (
        <OfferFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateOffer}
        />
      )}
    </div>
  );
}