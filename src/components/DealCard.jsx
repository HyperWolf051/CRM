import { memo } from 'react';
import PropTypes from 'prop-types';
import Avatar from './ui/Avatar';
import { formatCurrency } from '../utils/formatters';
import { DealPropType } from '@/utils/propTypes';

const STAGE_COLORS = {
  lead: 'border-l-gray-400',
  qualified: 'border-l-blue-400',
  proposal: 'border-l-yellow-400',
  negotiation: 'border-l-orange-400',
  closed_won: 'border-l-green-400',
  closed_lost: 'border-l-red-400',
};

const DealCard = memo(function DealCard({ deal, onClick, isDragging = false }) {
  const stageColor = STAGE_COLORS[deal.stage] || 'border-l-gray-400';

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 border-l-4 ${stageColor} p-4 cursor-pointer hover:shadow-md transition-all duration-150 transform hover:scale-105 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${isDragging ? 'shadow-lg rotate-2 scale-105' : ''
        }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Deal: ${deal.name}, Value: ${formatCurrency(deal.value)}, Contact: ${deal.contactName}`}
    >
      <div className="space-y-3">
        {/* Deal Name */}
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">
          {deal.name}
        </h4>

        {/* Deal Value */}
        <div className="text-lg font-bold text-primary-600">
          {formatCurrency(deal.value)}
        </div>

        {/* Contact Info */}
        <div className="flex items-center space-x-2">
          <Avatar
            src={deal.contactAvatar}
            name={deal.contactName}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 truncate">
              {deal.contactName}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        {deal.probability && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Probability</span>
            <span className="font-medium">{deal.probability}%</span>
          </div>
        )}

        {deal.expectedCloseDate && (
          <div className="text-xs text-gray-500">
            Expected close: {new Date(deal.expectedCloseDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
});

DealCard.propTypes = {
  deal: DealPropType.isRequired,
  onClick: PropTypes.func,
  isDragging: PropTypes.bool,
};

export default DealCard;