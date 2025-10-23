export default function CandidateTable({ 
  candidates = [], 
  onViewCandidate, 
  onScheduleInterview, 
  onSendEmail,
  sortBy = 'name',
  sortDirection = 'asc' 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidates</h3>
        <div className="text-center py-8 text-gray-500">
          Candidate table component - Coming soon
        </div>
      </div>
    </div>
  );
}