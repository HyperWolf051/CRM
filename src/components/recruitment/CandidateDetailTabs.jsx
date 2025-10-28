import { 
  Building, DollarSign, GraduationCap, Award, 
  Calendar, MapPin, User, Briefcase, FileText, 
  Download, Upload, Plus, MessageSquare, Clock,
  CheckCircle, AlertCircle, Target, TrendingUp,
  Mail, Phone, Edit, Save, X
} from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';

// Profile Tab Component
export const ProfileTab = ({ candidate, isEditing }) => {
  const [editData, setEditData] = useState({
    name: candidate.name || '',
    email: candidate.email || '',
    phone: candidate.phone || '',
    location: candidate.location || '',
    currentCompany: candidate.currentCompany || '',
    designation: candidate.designation || '',
    totalExperience: candidate.totalExperience || '',
    lastSalary: candidate.lastSalary || '',
    salaryExpectation: candidate.salaryExpectation || '',
    qualification: candidate.qualification || '',
    industry: candidate.industry || ''
  });

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{candidate.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={editData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{candidate.email}</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{candidate.phone}</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{candidate.location}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
          Professional Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Company</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.currentCompany}
                onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{candidate.currentCompany || 'Not specified'}</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{candidate.designation}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Experience</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.totalExperience}
                onChange={(e) => handleInputChange('totalExperience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{candidate.totalExperience}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{candidate.industry || 'Not specified'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Salary</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.lastSalary}
                onChange={(e) => handleInputChange('lastSalary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{candidate.lastSalary}</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salary Expectation</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.salaryExpectation}
                onChange={(e) => handleInputChange('salaryExpectation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{candidate.salaryExpectation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
          Education
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.qualification}
              onChange={(e) => handleInputChange('qualification', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{candidate.qualification}</p>
          )}
        </div>
      </div>

      {/* Skills */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />
            Skills
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill, index) => (
              <span key={index} className="inline-block bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <span className="font-medium text-gray-700">CV Number:</span>
            <p className="text-gray-900 mt-1">{candidate.cvNo}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Allocation:</span>
            <p className="text-gray-900 mt-1">{candidate.allocation}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Registration Date:</span>
            <p className="text-gray-900 mt-1">
              {candidate.registration?.date ? new Date(candidate.registration.date).toLocaleDateString() : 'Not specified'}
            </p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Registration Source:</span>
            <p className="text-gray-900 mt-1">{candidate.registration?.resource || 'Not specified'}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Created By:</span>
            <p className="text-gray-900 mt-1">{candidate.createdByName}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Last Modified By:</span>
            <p className="text-gray-900 mt-1">{candidate.lastModifiedByName || 'Not modified'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Application Tab Component
export const ApplicationTab = ({ candidate }) => {
  return (
    <div className="space-y-8">
      {/* Application Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Application Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position Applied For</label>
            <p className="text-gray-900">{candidate.interestedFor}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Application Date</label>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-gray-900">
                {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : 'Not specified'}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Stage</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              candidate.currentStage === 'registration' ? 'bg-blue-100 text-blue-800' :
              candidate.currentStage === 'resume-sharing' ? 'bg-purple-100 text-purple-800' :
              candidate.currentStage === 'shortlisting' ? 'bg-amber-100 text-amber-800' :
              candidate.currentStage === 'lineup-feedback' ? 'bg-cyan-100 text-cyan-800' :
              candidate.currentStage === 'selection' ? 'bg-green-100 text-green-800' :
              candidate.currentStage === 'closure' ? 'bg-emerald-100 text-emerald-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {candidate.currentStage?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Overall Status</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              candidate.overallStatus === 'new' ? 'bg-blue-100 text-blue-800' :
              candidate.overallStatus === 'in-process' ? 'bg-yellow-100 text-yellow-800' :
              candidate.overallStatus === 'shortlisted' ? 'bg-purple-100 text-purple-800' :
              candidate.overallStatus === 'interviewed' ? 'bg-cyan-100 text-cyan-800' :
              candidate.overallStatus === 'selected' ? 'bg-green-100 text-green-800' :
              candidate.overallStatus === 'placed' ? 'bg-emerald-100 text-emerald-800' :
              'bg-red-100 text-red-800'
            }`}>
              {candidate.overallStatus?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        </div>
      </div>

      {/* Resume Sharing Stage */}
      {candidate.resumeSharing && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-600" />
            Resume Sharing
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
              <p className="text-gray-900">{candidate.resumeSharing.shortlistsForClient || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                candidate.resumeSharing.resumeShareStatus === 'Done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {candidate.resumeSharing.resumeShareStatus}
              </span>
            </div>
            
            {candidate.resumeSharing.remark && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <p className="text-gray-900">{candidate.resumeSharing.remark}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shortlisting Stage */}
      {candidate.shortlisting && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-amber-600" />
            Shortlisting
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shortlist Date</label>
              <p className="text-gray-900">
                {candidate.shortlisting.shortlistDate ? new Date(candidate.shortlisting.shortlistDate).toLocaleDateString() : 'Not specified'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
              <p className="text-gray-900">{candidate.shortlisting.shortlistsForClient || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resource</label>
              <p className="text-gray-900">{candidate.shortlisting.resource || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                candidate.shortlisting.shortlistStatus === 'Done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {candidate.shortlisting.shortlistStatus}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Client Feedback Section */}
      {candidate.lineupFeedback && candidate.lineupFeedback.feedbacks && candidate.lineupFeedback.feedbacks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-cyan-600" />
            Client Feedback
          </h3>
          
          <div className="space-y-4">
            {candidate.lineupFeedback.feedbacks.map((feedback, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{feedback.clientName}</h4>
                    <p className="text-sm text-gray-500">Feedback #{feedback.feedbackNumber}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    feedback.feedback === 'Selected' ? 'bg-green-100 text-green-800' :
                    feedback.feedback === 'Rejected' ? 'bg-red-100 text-red-800' :
                    feedback.feedback === 'Hold' ? 'bg-yellow-100 text-yellow-800' :
                    feedback.feedback === 'Joined' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {feedback.feedback}
                  </span>
                </div>
                {feedback.scheduledDate && (
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Scheduled: {new Date(feedback.scheduledDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selection Stage */}
      {candidate.selection && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Selection
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
              <p className="text-gray-900">{candidate.selection.client || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selection Date</label>
              <p className="text-gray-900">
                {candidate.selection.selectionDate ? new Date(candidate.selection.selectionDate).toLocaleDateString() : 'Not specified'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selection Status</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                candidate.selection.selectionStatus === 'Selected' ? 'bg-green-100 text-green-800' :
                candidate.selection.selectionStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {candidate.selection.selectionStatus || 'Pending'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Closure Stage */}
      {candidate.closure && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-emerald-600" />
            Closure
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Placed In</label>
              <p className="text-gray-900">{candidate.closure.placedIn || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
              <p className="text-gray-900">
                {candidate.closure.joiningDate ? new Date(candidate.closure.joiningDate).toLocaleDateString() : 'Not specified'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Offered Salary</label>
              <p className="text-gray-900">{candidate.closure.offeredSalary || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agency Charges</label>
              <p className="text-gray-900">{candidate.closure.charges || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Joining Status</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                candidate.closure.joiningStatus === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {candidate.closure.joiningStatus === 'Yes' ? 'Joined' : 'Not Joined'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Documents Tab Component
export const DocumentsTab = ({ candidate, onDocumentUpload, uploadingDocument }) => {
  const documents = candidate.documents || [];
  
  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-600" />
            Upload Documents
          </h3>
          
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={onDocumentUpload}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              disabled={uploadingDocument}
            />
            <Button
              variant="primary"
              size="sm"
              icon={uploadingDocument ? <Clock className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              disabled={uploadingDocument}
            >
              {uploadingDocument ? 'Uploading...' : 'Add Document'}
            </Button>
          </label>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG</p>
          <p>Maximum file size: 10MB</p>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Documents ({documents.length})
        </h3>
        
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No documents uploaded yet</p>
            <p className="text-sm">Upload resumes, certificates, and other relevant documents</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>Uploaded by {doc.uploadedBy}</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download className="w-4 h-4" />}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<X className="w-4 h-4" />}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resume Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume Shared With</label>
            <p className="text-gray-900">{candidate.resumeSharing?.shortlistsForClient || 'Not shared yet'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume Share Status</label>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              candidate.resumeSharing?.resumeShareStatus === 'Done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {candidate.resumeSharing?.resumeShareStatus || 'Pending'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notes Tab Component
export const NotesTab = ({ candidate, newNote, setNewNote, onAddNote }) => {
  const notes = candidate.notes || [];
  
  return (
    <div className="space-y-6">
      {/* Add Note Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-blue-600" />
          Add Note
        </h3>
        
        <div className="space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note about this candidate..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
          />
          
          <div className="flex justify-end">
            <Button
              onClick={onAddNote}
              disabled={!newNote.trim()}
              variant="primary"
              size="sm"
            >
              Add Note
            </Button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
          Notes ({notes.length})
        </h3>
        
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No notes added yet</p>
            <p className="text-sm">Add notes to track important information about this candidate</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{note.createdByName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {note.isPrivate && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Private
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Change History Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Recent Activity
        </h3>
        
        {candidate.changeHistory && candidate.changeHistory.length > 0 ? (
          <div className="space-y-4">
            {candidate.changeHistory.slice(0, 5).map((change, index) => (
              <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{change.changedByName}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(change.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{change.changeType.replace('_', ' ')}</p>
                  {change.reason && (
                    <p className="text-xs text-gray-500 mt-1 italic">Reason: {change.reason}</p>
                  )}
                </div>
              </div>
            ))}
            
            {candidate.changeHistory.length > 5 && (
              <div className="text-center">
                <Button variant="outline" size="sm">
                  View All Activity ({candidate.changeHistory.length})
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No activity history available</p>
          </div>
        )}
      </div>
    </div>
  );
};