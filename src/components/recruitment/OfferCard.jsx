import { 
  User, 
  Building2, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Edit,
  Send,
  MessageSquare,
  Trash2,
  FileText,
  Award,
  TrendingUp
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';

const statusConfig = {
  draft: {
    color: 'bg-gray-100 text-gray-800',
    icon: FileText,
    label: 'Draft'
  },
  sent: {
    color: 'bg-blue-100 text-blue-800',
    icon: Clock,
    label: 'Sent'
  },
  'under-review': {
    color: 'bg-purple-100 text-purple-800',
    icon: Eye,
    label: 'Under Review'
  },
  negotiating: {
    color: 'bg-amber-100 text-amber-800',
    icon: MessageSquare,
    label: 'Negotiating'
  },
  accepted: {
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    label: 'Accepted'
  },
  declined: {
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    label: 'Declined'
  },
  expired: {
    color: 'bg-gray-100 text-gray-800',
    icon: Clock,
    label: 'Expired'
  },
  withdrawn: {
    color: 'bg-orange-100 text-orange-800',
    icon: AlertCircle,
    label: 'Withdrawn'
  }
};

const priorityConfig = {
  low: { color: 'text-gray-500', label: 'Low' },
  medium: { color: 'text-blue-500', label: 'Medium' },
  high: { color: 'text-amber-500', label: 'High' },
  urgent: { color: 'text-red-500', label: 'Urgent' }
};

export default function OfferCard({ 
  offer, 
  onView, 
  onExtend, 
  onNegotiate, 
  onWithdraw, 
  onSelect,
  isSelected = false,
  showActions = true 
}) {
  const status = statusConfig[offer.status];
  const StatusIcon = status.icon;
  const priority = priorityConfig[offer.priority];

  const handleExtend = (e) => {
    e.stopPropagation();
    onExtend();
  };

  const handleNegotiate = (e) => {
    e.stopPropagation();
    onNegotiate();
  };

  const handleWithdraw = (e) => {
    e.stopPropagation();
    onWithdraw();
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const daysUntilExpiry = offer.timeline.expiryDate 
    ? Math.ceil((new Date(offer.timeline.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 3 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onView}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {showActions && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleSelect}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{offer.candidateName}</h3>
              <p className="text-sm text-gray-600">{offer.candidateEmail}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Priority Indicator */}
            <div className={`w-2 h-2 rounded-full ${
              offer.priority === 'urgent' ? 'bg-red-500' :
              offer.priority === 'high' ? 'bg-amber-500' :
              offer.priority === 'medium' ? 'bg-blue-500' :
              'bg-gray-400'
            }`} title={`${priority.label} Priority`} />
            
            {/* Status Badge */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </span>
          </div>
        </div>

        {/* Position and Client */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-700">
            <Award className="w-4 h-4 mr-2 text-purple-600" />
            <span className="font-medium">{offer.offerDetails.position}</span>
            <span className="text-gray-500 mx-2">•</span>
            <span className="text-sm">{offer.offerDetails.department}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Building2 className="w-4 h-4 mr-2 text-blue-600" />
            <span>{offer.clientName}</span>
          </div>
        </div>

        {/* Salary Information */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <div className="text-lg font-bold text-green-800">
                  {formatCurrency(offer.offerDetails.salary.base, offer.offerDetails.salary.currency)}
                </div>
                <div className="text-sm text-green-600 capitalize">
                  {offer.offerDetails.salary.frequency}
                </div>
              </div>
            </div>
            
            {/* Benefits Summary */}
            <div className="text-right">
              <div className="text-sm text-gray-600">Benefits</div>
              <div className="flex items-center space-x-1">
                {offer.offerDetails.benefits.healthInsurance && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Health Insurance" />
                )}
                {offer.offerDetails.benefits.retirement401k && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" title="401k" />
                )}
                {offer.offerDetails.benefits.remoteWork && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full" title="Remote Work" />
                )}
                {offer.offerDetails.benefits.flexibleSchedule && (
                  <div className="w-2 h-2 bg-amber-500 rounded-full" title="Flexible Schedule" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <div>
              <div className="text-xs text-gray-500">Created</div>
              <div>{formatDate(offer.timeline.createdAt)}</div>
            </div>
          </div>
          
          {offer.timeline.expiryDate && (
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <div>
                <div className="text-xs text-gray-500">Expires</div>
                <div className={`${
                  isExpired ? 'text-red-600 font-medium' :
                  isExpiringSoon ? 'text-amber-600 font-medium' :
                  'text-gray-700'
                }`}>
                  {formatDate(offer.timeline.expiryDate)}
                  {daysUntilExpiry !== null && (
                    <span className="ml-1 text-xs">
                      ({daysUntilExpiry > 0 ? `${daysUntilExpiry}d left` : 'Expired'})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Negotiations Count */}
        {offer.negotiations && offer.negotiations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center text-sm text-amber-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>{offer.negotiations.length} negotiation{offer.negotiations.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        {/* Expiry Warning */}
        {isExpiringSoon && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center text-sm text-amber-800">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-sm text-red-800">
              <XCircle className="w-4 h-4 mr-2" />
              <span>This offer has expired</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={onView}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              
              {offer.status === 'draft' && (
                <button
                  onClick={handleExtend}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              )}
              
              {(offer.status === 'sent' || offer.status === 'under-review') && (
                <button
                  onClick={handleNegotiate}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Negotiate</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit
                }}
                className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              {(offer.status === 'draft' || offer.status === 'sent') && (
                <button
                  onClick={handleWithdraw}
                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}