import { Mail, Phone, Eye, Calendar, MapPin, User, Star, Trash2 } from 'lucide-react';

// Helper function to get stage display info
const getStageInfo = (stage) => {
  const stageMap = {
    'registration': { label: 'Registration', color: 'bg-blue-100 text-blue-800', progress: 1 },
    'resume-sharing': { label: 'Resume Sharing', color: 'bg-purple-100 text-purple-800', progress: 2 },
    'shortlisting': { label: 'Shortlisting', color: 'bg-amber-100 text-amber-800', progress: 3 },
    'lineup-feedback': { label: 'Lineup & Feedback', color: 'bg-cyan-100 text-cyan-800', progress: 4 },
    'selection': { label: 'Selection', color: 'bg-green-100 text-green-800', progress: 5 },
    'closure': { label: 'Closure', color: 'bg-emerald-100 text-emerald-800', progress: 6 },
    'completed': { label: 'Completed', color: 'bg-gray-100 text-gray-800', progress: 7 }
  };
  return stageMap[stage] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800', progress: 0 };
};

// Helper function to get status display info
const getStatusInfo = (status) => {
  const statusMap = {
    'new': { label: 'New', color: 'bg-blue-100 text-blue-800' },
    'in-process': { label: 'In Process', color: 'bg-yellow-100 text-yellow-800' },
    'shortlisted': { label: 'Shortlisted', color: 'bg-purple-100 text-purple-800' },
    'interviewed': { label: 'Interviewed', color: 'bg-cyan-100 text-cyan-800' },
    'selected': { label: 'Selected', color: 'bg-green-100 text-green-800' },
    'placed': { label: 'Placed', color: 'bg-emerald-100 text-emerald-800' },
    'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800' }
  };
  return statusMap[status] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
};

export default function CandidateCard({ 
  candidate, 
  onView, 
  onScheduleInterview, 
  onSendEmail, 
  onDelete,
  showQuickActions = true,
  viewMode = 'grid' // 'grid' or 'list'
}) {
  const stageInfo = getStageInfo(candidate.currentStage);
  const statusInfo = getStatusInfo(candidate.overallStatus);

  if (viewMode === 'list') {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-6 hover:shadow-2xl transition-shadow">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-xl font-bold text-white">
              {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{candidate.name}</h3>
                  {candidate.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{candidate.rating}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-slate-600 font-medium mb-1">{candidate.interestedFor || candidate.position}</p>
                
                <div className="flex items-center space-x-4 mb-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${stageInfo.color}`}>
                    {stageInfo.label}
                  </span>
                  {candidate.allocation && (
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {candidate.allocation}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{candidate.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{candidate.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="truncate">Added by {candidate.createdByName}</span>
                  </div>
                </div>
                
                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 4).map((skill, index) => (
                      <span key={index} className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 4 && (
                      <span className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded">
                        +{candidate.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {showQuickActions && (
                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={onView}
                    title="View Profile"
                    className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
                    <Eye className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
                  </button>
                  <button 
                    onClick={onScheduleInterview}
                    title="Schedule Interview"
                    className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
                    <Calendar className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
                  </button>
                  <button 
                    onClick={onSendEmail}
                    title="Send Email"
                    className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
                    <Mail className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
                  </button>
                  {onDelete && (
                    <button 
                      onClick={onDelete}
                      title="Delete Candidate"
                      className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
                      <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-6 hover:shadow-2xl transition-shadow">
      <div className="text-center mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-3">
          <span className="text-2xl font-bold text-white">
            {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{candidate.name}</h3>
        <p className="text-slate-600 text-sm mb-2">{candidate.interestedFor || candidate.position}</p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${stageInfo.color}`}>
            {stageInfo.label}
          </span>
        </div>
        
        {candidate.allocation && (
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mb-3">
            {candidate.allocation}
          </span>
        )}
        
        {candidate.rating && (
          <div className="flex items-center justify-center space-x-1 mb-3">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{candidate.rating}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2 text-sm text-slate-600 mb-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{candidate.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 flex-shrink-0" />
          <span>{candidate.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{candidate.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Added by {candidate.createdByName}</span>
        </div>
      </div>
      
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {candidate.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                {skill}
              </span>
            ))}
            {candidate.skills.length > 3 && (
              <span className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded">
                +{candidate.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
      
      {showQuickActions && (
        <div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-100">
          <button 
            onClick={onView}
            title="View Profile"
            className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
            <Eye className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
          </button>
          <button 
            onClick={onScheduleInterview}
            title="Schedule Interview"
            className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
            <Calendar className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
          </button>
          <button 
            onClick={onSendEmail}
            title="Send Email"
            className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
            <Mail className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
          </button>
          {onDelete && (
            <button 
              onClick={onDelete}
              title="Delete Candidate"
              className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 overflow-hidden group hover:shadow-md">
              <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out rounded-lg"></div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}