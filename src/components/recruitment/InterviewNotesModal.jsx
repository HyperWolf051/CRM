import React, { useState } from 'react';
import { MessageSquare, Plus, Save, X } from 'lucide-react';

const InterviewNotesModal = ({ isOpen, onClose, interview, onSaveNotes }) => {
  const [notes, setNotes] = useState(interview?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSaveNotes(interview.id, notes);
      onClose();
    } catch (error) {
      console.error('Error saving notes:', error);
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Interview Notes</h2>
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={8}
                placeholder="Add your interview notes, observations, and feedback here..."
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
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <Save className="w-4 h-4" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewNotesModal;