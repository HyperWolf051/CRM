import { Eye, Calendar, Mail, Star, Clock } from 'lucide-react';
import { useState } from 'react';

export default function RecentCandidatesWidget({ 
  candidates = [], 
  loading = false,
  onViewCandidate,
  onScheduleInterview,
  onSendEmail 
}) {
  const [hoveredCandidate, setHoveredCandidate] = useState(null);

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      shortlisted: 'bg-purple-100 text-purple-800 border-purple-200',
      interviewed: 'bg-amber-100 text-amber-800 border-amber-200',
      selected: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      placed: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return statusClasses[status] || statusClasses.new;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-3 h-3 fill-amber-200 text-amber-400" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
      );
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Candidates</h3>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Candidates</h3>
        <button 
          onClick={() => window.location.href = '/app/recruiter/candidates'}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          View All
        </button>
      </div>
      
      {candidates.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No recent candidates</p>
        </div>
      ) : (
        <div className="space-y-2">
          {candidates.map((candidate) => (
            <div 
              key={candidate.id} 
              className={`group relative p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                hoveredCandidate === candidate.id 
                  ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
              onMouseEnter={() => setHoveredCandidate(candidate.id)}
              onMouseLeave={() => setHoveredCandidate(null)}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {candidate.name.charAt(0)}
                  </div>
                  {candidate.status === 'new' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                {/* Candidate Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {candidate.name}
                    </p>
                    {candidate.rating && (
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {renderStars(candidate.rating)}
                        </div>
                        <span className="text-xs text-gray-500">
                          {candidate.rating}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate mb-1">
                    {candidate.position}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(candidate.status)}`}>
                      {candidate.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(candidate.appliedDate)}
                    </span>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className={`flex items-center space-x-1 transition-opacity duration-200 ${
                  hoveredCandidate === candidate.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewCandidate?.(candidate.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                    title="View Profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onScheduleInterview?.(candidate.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-md transition-colors"
                    title="Schedule Interview"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSendEmail?.(candidate.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-100 rounded-md transition-colors"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Hover overlay for main click action */}
              <div 
                className="absolute inset-0 rounded-lg cursor-pointer"
                onClick={() => onViewCandidate?.(candidate.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}