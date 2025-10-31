import React, { useState } from 'react';
import { CheckCircle, X, Calendar, Clock, AlertCircle, Edit } from 'lucide-react';

const STATUS_OPTIONS = [
  {
    value: 'scheduled',
    label: 'Scheduled',
    color: 'bg-blue-100 text-blue-800',
    icon: Calendar,
    description: 'Interview is scheduled and confirmed'
  },
  {
    value: 'in-progress',
    label: 'In Progress',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    description: 'Interview is currently happening'
  },
  {
    value: 'completed',
    label: 'Completed',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    description: 'Interview has been completed'
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: X,
    description: 'Interview has been cancelled'
  },
  {
    value: 'rescheduled',
    label: 'Rescheduled',
    color: 'bg-orange-100 text-orange-800',
    icon: Edit,
    description: 'Interview has been rescheduled'
  },
  {
    value: 'no-show',
    label: 'No Show',
    color: 'bg-gray-100 text-gray-800',
    icon: AlertCircle,
    description: 'Candidate did not attend the interview'
  }
];

const InterviewStatusModal = ({ isOpen, onClose, interview, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(interview?.status || 'scheduled');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await onUpdateStatus(interview.id, selectedStatus, notes);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Update Interview Status</h2>
                <p className="text-sm text-slate-600">
                  {interview?.candidateName} - {interview?.jobTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Current Status */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-1">Current Status</p>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  STATUS_OPTIONS.find(s => s.value === interview?.status)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {STATUS_OPTIONS.find(s => s.value === interview?.status)?.label || interview?.status}
                </span>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                New Status
              </label>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedStatus === status.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {React.createElement(status.icon, {
                        className: `w-5 h-5 ${
                          selectedStatus === status.value ? 'text-blue-600' : 'text-slate-600'
                        }`
                      })}
                      <div className="flex-1">
                        <div className={`font-medium ${
                          selectedStatus === status.value ? 'text-blue-900' : 'text-slate-900'
                        }`}>
                          {status.label}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          {status.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add any additional notes about the status change..."
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading || selectedStatus === interview?.status}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <CheckCircle className="w-4 h-4" />
                <span>Update Status</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewStatusModal;