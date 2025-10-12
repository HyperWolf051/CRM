import { 
  Mail, 
  MapPin, 
  Star, 
  MessageSquare, 
  Eye, 
  Edit, 
  Calendar 
} from 'lucide-react';

const CandidateCard = ({ 
  candidate, 
  onView, 
  onEdit, 
  onContact, 
  onSchedule,
  compact = false 
}) => (
  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
    <div className="flex items-start space-x-4">
      {/* Candidate Avatar */}
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold text-white">
            {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
        {/* Status Indicator */}
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
          candidate.status === 'Available' ? 'bg-green-500' :
          candidate.status === 'Interviewed' ? 'bg-blue-500' :
          candidate.status === 'Hired' ? 'bg-purple-500' :
          'bg-gray-400'
        }`}></div>
      </div>
      
      {/* Candidate Info */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
              {candidate.name}
            </h3>
            <p className="text-sm font-medium text-gray-600">{candidate.role}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
            candidate.status === 'Available' ? 'bg-green-100 text-green-800 border-green-200' :
            candidate.status === 'Interviewed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
            candidate.status === 'Hired' ? 'bg-purple-100 text-purple-800 border-purple-200' :
            'bg-gray-100 text-gray-800 border-gray-200'
          }`}>
            {candidate.status}
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="truncate">{candidate.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate">{candidate.address}</span>
          </div>
        </div>
        
        {/* Skills */}
        {candidate.skills && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {candidate.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                  +{candidate.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Rating & Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {candidate.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{candidate.rating}</span>
              </div>
            )}
            {candidate.interviews && (
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span>{candidate.interviews} interviews</span>
              </div>
            )}
          </div>
          
          {/* Salary Expectation */}
          {candidate.salary && (
            <div className="text-sm font-medium text-green-600">
              {candidate.salary}
            </div>
          )}
        </div>
      </div>
    </div>
    
    {/* Action Buttons */}
    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onView && onView(candidate)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group/btn"
          title="View Profile"
        >
          <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => onEdit && onEdit(candidate)}
          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group/btn"
          title="Edit"
        >
          <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => onContact && onContact(candidate)}
          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 group/btn"
          title="Contact"
        >
          <Mail className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>
      
      <button
        onClick={() => onSchedule && onSchedule(candidate)}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
      >
        <Calendar className="w-4 h-4" />
        <span>Schedule</span>
      </button>
    </div>
  </div>
);

export default CandidateCard;