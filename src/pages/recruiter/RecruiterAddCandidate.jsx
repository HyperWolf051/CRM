import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { CandidateAPI } from '@/services/api';
import { useDuplicateDetection } from '@/hooks/useDuplicateDetection';
import { candidateUtils } from '@/utils/candidateUtils';
import DuplicateDetectionModal from '@/components/recruitment/DuplicateDetectionModal';
import MergePreviewModal from '@/components/recruitment/MergePreviewModal';
import { duplicateDetectionUtils } from '@/utils/duplicateDetection';

const RecruiterAddCandidate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [candidate, setCandidate] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    location: '',
    address: '',
    dateOfBirth: '',
    nationality: '',
    education: '',
    linkedIn: '',
    portfolio: '',
    salary: '',
    skills: '',
    notes: '',
    allocation: '',
    currentStage: 'registration',
    overallStatus: 'new'
  });

  // Duplicate detection state
  const {
    isLoading: isDuplicateLoading,
    duplicateResult,
    checkDuplicates,
    mergeCandidates,
    clearDuplicateResult
  } = useDuplicateDetection();

  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [selectedDuplicate, setSelectedDuplicate] = useState(null);
  const [mergePreview, setMergePreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!candidate.name || !candidate.email) {
      alert('Please fill in the required fields (Name and Email)');
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare candidate data for duplicate checking
      const candidateData = {
        ...candidate,
        interestedFor: candidate.position, // Map position to interestedFor
        skills: candidate.skills ? candidate.skills.split(',').map(s => s.trim()) : []
      };
      
      // Check for duplicates first
      const duplicateCheck = await checkDuplicates(candidateData);
      
      if (duplicateCheck.hasMatches && duplicateCheck.matches.length > 0) {
        // Show duplicate detection modal
        setShowDuplicateModal(true);
        setIsLoading(false);
        return;
      }
      
      // No duplicates found, proceed with creation
      await createCandidate(candidateData);
      
    } catch (err) {
      console.error('Error adding candidate:', err);
      alert('Failed to add candidate. Please try again.');
      setIsLoading(false);
    }
  };

  const createCandidate = async (candidateData) => {
    try {
      // Create candidate using utility function for proper structure
      const currentUser = { id: 'current-user', name: 'Current User' }; // Should come from auth context
      const newCandidate = candidateUtils.createNewCandidate(candidateData, currentUser.id, currentUser.name);
      
      const result = await CandidateAPI.create(newCandidate);
      
      if (result.success) {
        alert('Candidate added successfully!');
        navigate('/app/recruiter/candidates');
      } else {
        alert('Failed to add candidate: ' + result.message);
      }
    } catch (err) {
      console.error('Error creating candidate:', err);
      alert('Failed to add candidate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle duplicate detection modal actions
  const handleMergeCandidate = (duplicateId, duplicateCandidate) => {
    setSelectedDuplicate(duplicateCandidate);
    
    // Generate merge preview
    const candidateData = {
      ...candidate,
      interestedFor: candidate.position,
      skills: candidate.skills ? candidate.skills.split(',').map(s => s.trim()) : []
    };
    
    const currentUser = { id: 'current-user', name: 'Current User' };
    const newCandidate = candidateUtils.createNewCandidate(candidateData, currentUser.id, currentUser.name);
    
    const preview = duplicateDetectionUtils.generateMergePreview(duplicateCandidate, newCandidate);
    setMergePreview(preview);
    setShowDuplicateModal(false);
    setShowMergeModal(true);
  };

  const handleCreateNewAnyway = async () => {
    setShowDuplicateModal(false);
    
    const candidateData = {
      ...candidate,
      interestedFor: candidate.position,
      skills: candidate.skills ? candidate.skills.split(',').map(s => s.trim()) : []
    };
    
    await createCandidate(candidateData);
  };

  const handleLinkRelated = async (candidateIds) => {
    // For now, just create the candidate anyway
    // In a full implementation, you would link the candidates
    console.log('Linking candidates as related:', candidateIds);
    await handleCreateNewAnyway();
  };

  const handleConfirmMerge = async (mergeDecisions, preservedData) => {
    try {
      setIsLoading(true);
      
      const result = await mergeCandidates(
        mergePreview.primaryCandidate,
        mergePreview.duplicateCandidate,
        mergeDecisions
      );
      
      if (result.success) {
        alert('Candidates merged successfully!');
        navigate('/app/recruiter/candidates');
      } else {
        alert('Failed to merge candidates: ' + result.error);
      }
    } catch (err) {
      console.error('Error merging candidates:', err);
      alert('Failed to merge candidates. Please try again.');
    } finally {
      setIsLoading(false);
      setShowMergeModal(false);
    }
  };

  const handleCloseDuplicateModal = () => {
    setShowDuplicateModal(false);
    clearDuplicateResult();
  };

  const handleCloseMergeModal = () => {
    setShowMergeModal(false);
    setMergePreview(null);
    setSelectedDuplicate(null);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/app/recruiter/candidates');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/app/recruiter/candidates')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Candidate</h1>
            <p className="text-gray-600">Add a new candidate to your recruitment pipeline</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => setCandidate({...candidate, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={candidate.email}
                    onChange={(e) => setCandidate({...candidate, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="candidate@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={candidate.phone}
                    onChange={(e) => setCandidate({...candidate, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={candidate.dateOfBirth}
                    onChange={(e) => setCandidate({...candidate, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={candidate.location}
                    onChange={(e) => setCandidate({...candidate, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={candidate.nationality}
                    onChange={(e) => setCandidate({...candidate, nationality: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nationality"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={candidate.address}
                    onChange={(e) => setCandidate({...candidate, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full address"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    value={candidate.position}
                    onChange={(e) => setCandidate({...candidate, position: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Job title or position"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={candidate.experience}
                    onChange={(e) => setCandidate({...candidate, experience: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 5 years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Salary
                  </label>
                  <input
                    type="text"
                    value={candidate.salary}
                    onChange={(e) => setCandidate({...candidate, salary: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="₹18,00,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <input
                    type="text"
                    value={candidate.education}
                    onChange={(e) => setCandidate({...candidate, education: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Degree - University"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={candidate.linkedIn}
                    onChange={(e) => setCandidate({...candidate, linkedIn: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio/Website
                  </label>
                  <input
                    type="url"
                    value={candidate.portfolio}
                    onChange={(e) => setCandidate({...candidate, portfolio: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://portfolio.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <input
                    type="text"
                    value={candidate.skills}
                    onChange={(e) => setCandidate({...candidate, skills: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="React, TypeScript, Node.js, AWS (comma separated)"
                  />
                </div>
              </div>
            </div>

            {/* Recruitment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allocation
                  </label>
                  <select
                    value={candidate.allocation}
                    onChange={(e) => setCandidate({...candidate, allocation: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select allocation...</option>
                    <option value="Sheet-1">Sheet-1</option>
                    <option value="Sheet-2">Sheet-2</option>
                    <option value="Sheet-3">Sheet-3</option>
                    <option value="Sheet-4">Sheet-4</option>
                    <option value="Sheet-5">Sheet-5</option>
                    <option value="Sheet-6">Sheet-6</option>
                    <option value="Team Alpha">Team Alpha</option>
                    <option value="Team Beta">Team Beta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stage
                  </label>
                  <select
                    value={candidate.currentStage}
                    onChange={(e) => setCandidate({...candidate, currentStage: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="registration">Registration</option>
                    <option value="resume-sharing">Resume Sharing</option>
                    <option value="shortlisting">Shortlisting</option>
                    <option value="lineup-feedback">Lineup & Feedback</option>
                    <option value="selection">Selection</option>
                    <option value="closure">Closure</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={candidate.notes}
                    onChange={(e) => setCandidate({...candidate, notes: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Additional notes about the candidate..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Adding...' : 'Add Candidate'}</span>
          </button>
        </div>
      </form>

      {/* Duplicate Detection Modal */}
      <DuplicateDetectionModal
        isOpen={showDuplicateModal}
        onClose={handleCloseDuplicateModal}
        newCandidate={{
          ...candidate,
          interestedFor: candidate.position
        }}
        duplicates={duplicateResult?.matches || []}
        onMerge={handleMergeCandidate}
        onCreateNew={handleCreateNewAnyway}
        onLinkRelated={handleLinkRelated}
        isLoading={isDuplicateLoading || isLoading}
      />

      {/* Merge Preview Modal */}
      <MergePreviewModal
        isOpen={showMergeModal}
        onClose={handleCloseMergeModal}
        mergePreview={mergePreview}
        onConfirmMerge={handleConfirmMerge}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RecruiterAddCandidate;