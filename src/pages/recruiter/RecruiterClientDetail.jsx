import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  Users,
  Briefcase,
  MessageSquare,
  FileText,
  Edit,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { ClientAPI } from '@/services/api';
import ClientCommunicationModal from '@/components/recruitment/ClientCommunicationModal';
import ClientFeedbackModal from '@/components/recruitment/ClientFeedbackModal';

export default function RecruiterClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [communications, setCommunications] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    loadClientData();
  }, [id]);

  const loadClientData = async () => {
    setLoading(true);
    try {
      // Mock data for demo purposes
      const mockClient = {
        id: id,
        name: 'TechCorp Solutions',
        industry: 'Information Technology',
        website: 'https://techcorp.com',
        primaryContact: {
          name: 'Sarah Johnson',
          designation: 'HR Director',
          email: 'sarah.johnson@techcorp.com',
          phone: '+91 98765 43210',
          directLine: '+91 80 2345 6789'
        },
        contacts: [
          {
            id: '1',
            name: 'Sarah Johnson',
            designation: 'HR Director',
            email: 'sarah.johnson@techcorp.com',
            phone: '+91 98765 43210',
            department: 'Human Resources',
            isPrimary: true,
            isActive: true
          },
          {
            id: '2',
            name: 'Michael Chen',
            designation: 'Engineering Manager',
            email: 'michael.chen@techcorp.com',
            phone: '+91 98765 43211',
            department: 'Engineering',
            isPrimary: false,
            isActive: true
          }
        ],
        companyDetails: {
          size: 'large',
          location: {
            address: '123 Tech Park, Electronic City',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
            pincode: '560100'
          },
          establishedYear: 2010,
          description: 'Leading technology solutions provider specializing in enterprise software development and digital transformation services.'
        },
        businessInfo: {
          gstNumber: '29ABCDE1234F1Z5',
          panNumber: 'ABCDE1234F',
          paymentTerms: '30 days',
          preferredCurrency: 'INR'
        },
        preferences: {
          preferredCommunication: 'email',
          interviewTypes: ['video', 'in-person'],
          noticePeriod: '2 weeks',
          salaryNegotiation: true,
          backgroundChecks: true,
          documentRequirements: ['Resume', 'ID Proof', 'Educational Certificates']
        },
        status: 'active',
        tier: 'platinum',
        metrics: {
          totalJobsPosted: 45,
          activeJobs: 8,
          candidatesHired: 32,
          averageTimeToHire: 21,
          offerAcceptanceRate: 85,
          repeatBusinessRate: 92
        },
        financial: {
          totalRevenue: 2500000,
          outstandingAmount: 150000,
          creditLimit: 500000
        },
        tags: ['Enterprise', 'Technology', 'High-Volume'],
        categories: ['IT Services', 'Software Development'],
        assignedRecruiter: 'John Doe',
        accountManager: 'Jane Smith',
        createdAt: new Date('2023-01-15'),
        lastContactDate: new Date('2024-01-15'),
        nextFollowUpDate: new Date('2024-02-01')
      };

      const mockCommunications = [
        {
          id: '1',
          type: 'email',
          subject: 'New Job Requirements - Senior Developer',
          content: 'We have 3 new positions for senior developers. Please find the detailed requirements attached.',
          direction: 'inbound',
          createdAt: new Date('2024-01-20'),
          createdBy: 'Sarah Johnson',
          status: 'completed'
        },
        {
          id: '2',
          type: 'phone',
          subject: 'Follow-up on candidate submissions',
          content: 'Discussed the status of 5 candidates submitted last week. Client is interested in 3 candidates.',
          direction: 'outbound',
          createdAt: new Date('2024-01-18'),
          createdBy: 'John Doe',
          status: 'completed'
        }
      ];

      const mockFeedback = [
        {
          id: '1',
          candidateId: 'cand-1',
          jobId: 'job-1',
          feedbackType: 'interview',
          rating: 4,
          feedback: 'Strong technical skills, good communication. Fits well with team culture.',
          recommendation: 'hire',
          interviewDate: new Date('2024-01-15'),
          interviewer: 'Michael Chen',
          submittedAt: new Date('2024-01-16'),
          status: 'Selected'
        },
        {
          id: '2',
          candidateId: 'cand-2',
          jobId: 'job-1',
          feedbackType: 'interview',
          rating: 2,
          feedback: 'Technical skills are adequate but lacks experience in required technologies.',
          recommendation: 'reject',
          interviewDate: new Date('2024-01-12'),
          interviewer: 'Sarah Johnson',
          submittedAt: new Date('2024-01-13'),
          status: 'Rejected'
        }
      ];

      const mockRequirements = [
        {
          id: '1',
          title: 'Senior Full Stack Developer',
          priority: 'high',
          status: 'open',
          candidatesSubmitted: 8,
          candidatesInterviewed: 3,
          candidatesSelected: 1,
          createdAt: new Date('2024-01-10'),
          deadline: new Date('2024-02-15')
        },
        {
          id: '2',
          title: 'DevOps Engineer',
          priority: 'urgent',
          status: 'in-progress',
          candidatesSubmitted: 12,
          candidatesInterviewed: 5,
          candidatesSelected: 0,
          createdAt: new Date('2024-01-05'),
          deadline: new Date('2024-02-01')
        }
      ];

      setClient(mockClient);
      setCommunications(mockCommunications);
      setFeedback(mockFeedback);
      setRequirements(mockRequirements);
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommunicationSubmit = async (communicationData) => {
    try {
      // Add to communications list
      setCommunications(prev => [communicationData, ...prev]);
      console.log('Communication saved:', communicationData);
    } catch (error) {
      console.error('Error saving communication:', error);
    }
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      // Add to feedback list
      setFeedback(prev => [feedbackData, ...prev]);
      console.log('Feedback saved:', feedbackData);
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Client not found</h3>
        <p className="mt-1 text-sm text-gray-500">The client you're looking for doesn't exist.</p>
        <Link
          to="/app/recruiter/clients"
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/app/recruiter/clients"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">{client.industry}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowCommunicationModal(true)}
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-2 inline" />
            Contact
          </button>
          <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Edit className="w-4 h-4 mr-2 inline" />
            Edit
          </button>
        </div>
      </div>

      {/* Client Overview Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{client.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTierColor(client.tier)}`}>
                    {client.tier}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="w-4 h-4 mr-2" />
                <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {client.website}
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {client.companyDetails.location.city}, {client.companyDetails.location.state}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Established {client.companyDetails.establishedYear}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Primary Contact</h4>
            <div className="space-y-2">
              <div>
                <div className="font-medium text-gray-900">{client.primaryContact.name}</div>
                <div className="text-sm text-gray-500">{client.primaryContact.designation}</div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <a href={`mailto:${client.primaryContact.email}`} className="text-blue-600 hover:underline">
                  {client.primaryContact.email}
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <a href={`tel:${client.primaryContact.phone}`} className="text-blue-600 hover:underline">
                  {client.primaryContact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{client.metrics.activeJobs}</div>
                <div className="text-xs text-gray-500">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{client.metrics.candidatesHired}</div>
                <div className="text-xs text-gray-500">Hired</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{client.metrics.averageTimeToHire}d</div>
                <div className="text-xs text-gray-500">Avg. Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{client.metrics.offerAcceptanceRate}%</div>
                <div className="text-xs text-gray-500">Accept Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: Building2 },
              { id: 'communications', name: 'Communications', icon: MessageSquare },
              { id: 'feedback', name: 'Feedback', icon: Star },
              { id: 'requirements', name: 'Requirements', icon: Briefcase }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab client={client} />}
          {activeTab === 'communications' && <CommunicationsTab communications={communications} onAddCommunication={() => setShowCommunicationModal(true)} />}
          {activeTab === 'feedback' && <FeedbackTab feedback={feedback} onAddFeedback={() => setShowFeedbackModal(true)} />}
          {activeTab === 'requirements' && <RequirementsTab requirements={requirements} />}
        </div>
      </div>

      {/* Modals */}
      <ClientCommunicationModal
        isOpen={showCommunicationModal}
        onClose={() => setShowCommunicationModal(false)}
        client={client}
        onSubmit={handleCommunicationSubmit}
      />

      <ClientFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        client={client}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}

function OverviewTab({ client }) {
  return (
    <div className="space-y-6">
      {/* Company Details */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Company Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Company Size</label>
              <p className="text-gray-900 capitalize">{client.companyDetails.size}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">GST Number</label>
              <p className="text-gray-900">{client.businessInfo.gstNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Payment Terms</label>
              <p className="text-gray-900">{client.businessInfo.paymentTerms}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Address</label>
              <p className="text-gray-900">
                {client.companyDetails.location.address}<br />
                {client.companyDetails.location.city}, {client.companyDetails.location.state} {client.companyDetails.location.pincode}<br />
                {client.companyDetails.location.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recruitment Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Preferred Communication</label>
              <p className="text-gray-900 capitalize">{client.preferences.preferredCommunication}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Interview Types</label>
              <p className="text-gray-900">{client.preferences.interviewTypes.join(', ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Notice Period</label>
              <p className="text-gray-900">{client.preferences.noticePeriod}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Background Checks</label>
              <p className="text-gray-900">{client.preferences.backgroundChecks ? 'Required' : 'Not Required'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Document Requirements</label>
              <p className="text-gray-900">{client.preferences.documentRequirements.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tags and Categories */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tags & Categories</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Tags</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {client.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Categories</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {client.categories.map((category, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunicationsTab({ communications, onAddCommunication }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Communication History</h3>
        <button 
          onClick={onAddCommunication}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Communication
        </button>
      </div>

      <div className="space-y-4">
        {communications.map((comm) => (
          <div key={comm.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  comm.direction === 'inbound' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {comm.type === 'email' ? (
                    <Mail className={`w-4 h-4 ${comm.direction === 'inbound' ? 'text-green-600' : 'text-blue-600'}`} />
                  ) : (
                    <Phone className={`w-4 h-4 ${comm.direction === 'inbound' ? 'text-green-600' : 'text-blue-600'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{comm.subject}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      comm.direction === 'inbound' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {comm.direction}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{comm.content}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{comm.createdBy}</span>
                    <span>{comm.createdAt.toLocaleDateString()}</span>
                    <span className="capitalize">{comm.type}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedbackTab({ feedback, onAddFeedback }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Client Feedback</h3>
        <button 
          onClick={onAddFeedback}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Feedback
        </button>
      </div>

      <div className="space-y-4">
        {feedback.map((fb) => (
          <div key={fb.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < fb.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                    fb.status === 'Selected' ? 'bg-green-100 text-green-800 border-green-200' :
                    fb.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                    'bg-yellow-100 text-yellow-800 border-yellow-200'
                  }`}>
                    {fb.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {fb.feedbackType} • {fb.interviewer}
                  </span>
                </div>
                <p className="text-gray-900 mb-2">{fb.feedback}</p>
                <div className="text-sm text-gray-500">
                  Interview Date: {fb.interviewDate.toLocaleDateString()} • 
                  Submitted: {fb.submittedAt.toLocaleDateString()}
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                fb.recommendation === 'hire' ? 'bg-green-100' :
                fb.recommendation === 'reject' ? 'bg-red-100' :
                'bg-yellow-100'
              }`}>
                {fb.recommendation === 'hire' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : fb.recommendation === 'reject' ? (
                  <XCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequirementsTab({ requirements }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Job Requirements</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Requirement
        </button>
      </div>

      <div className="space-y-4">
        {requirements.map((req) => (
          <div key={req.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900">{req.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                    req.priority === 'urgent' ? 'bg-red-100 text-red-800 border-red-200' :
                    req.priority === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                    'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    {req.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                    req.status === 'open' ? 'bg-green-100 text-green-800 border-green-200' :
                    req.status === 'in-progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {req.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{req.candidatesSubmitted}</div>
                    <div className="text-xs text-gray-500">Submitted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{req.candidatesInterviewed}</div>
                    <div className="text-xs text-gray-500">Interviewed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{req.candidatesSelected}</div>
                    <div className="text-xs text-gray-500">Selected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {Math.round((req.candidatesSelected / req.candidatesSubmitted) * 100) || 0}%
                    </div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created: {req.createdAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Deadline: {req.deadline.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions
function getTierColor(tier) {
  const colors = {
    platinum: 'bg-purple-100 text-purple-800 border-purple-200',
    gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    silver: 'bg-gray-100 text-gray-800 border-gray-200',
    bronze: 'bg-orange-100 text-orange-800 border-orange-200'
  };
  return colors[tier] || colors.bronze;
}

function getStatusColor(status) {
  const colors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    prospect: 'bg-blue-100 text-blue-800 border-blue-200',
    blacklisted: 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[status] || colors.active;
}