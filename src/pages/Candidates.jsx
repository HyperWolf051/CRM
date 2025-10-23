import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Mail, Phone, Eye, Edit, Trash2, Users, X } from 'lucide-react';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const Candidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      phone: '+91 98765 43210',
      position: 'Senior React Developer',
      experience: '5 years',
      location: 'Bengaluru, Karnataka',
      address: 'HSR Layout, Bengaluru, Karnataka 560102',
      dateOfBirth: '1992-08-15',
      nationality: 'Indian',
      education: 'B.Tech Computer Science - IIT Bombay',
      linkedIn: 'https://linkedin.com/in/priyasharma',
      portfolio: 'https://priyasharma.dev',
      status: 'active',
      appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      salary: '₹18,00,000',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      avatar: null,
      rating: 4.8,
      interviews: 2,
      notes: 'Excellent technical skills, great cultural fit. Strong communication skills.',
      resumeUrl: '/resumes/priya-sharma.pdf'
    },
    {
      id: 2,
      name: 'Arjun Patel',
      email: 'arjun.patel@outlook.com',
      phone: '+91 87654 32109',
      position: 'Full Stack Developer',
      experience: '3 years',
      location: 'Pune, Maharashtra',
      address: 'Koregaon Park, Pune, Maharashtra 411001',
      dateOfBirth: '1994-12-22',
      nationality: 'Indian',
      education: 'B.E. Information Technology - Pune University',
      linkedIn: 'https://linkedin.com/in/arjunpatel',
      portfolio: 'https://arjunpatel.in',
      status: 'interviewing',
      appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      salary: '₹12,00,000',
      skills: ['JavaScript', 'Python', 'Django', 'React'],
      avatar: null,
      rating: 4.5,
      interviews: 1,
      notes: 'Strong backend skills, good problem-solving abilities.',
      resumeUrl: '/resumes/arjun-patel.pdf'
    },
    {
      id: 3,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@yahoo.com',
      phone: '+91 76543 21098',
      position: 'UI/UX Designer',
      experience: '4 years',
      location: 'Hyderabad, Telangana',
      address: 'Gachibowli, Hyderabad, Telangana 500032',
      dateOfBirth: '1991-03-10',
      nationality: 'Indian',
      education: 'M.Des Visual Communication - NID Ahmedabad',
      linkedIn: 'https://linkedin.com/in/snehareddy',
      portfolio: 'https://snehareddy.design',
      status: 'active',
      appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      salary: '₹15,00,000',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      avatar: null,
      rating: 4.9,
      interviews: 3,
      notes: 'Creative designer with excellent user experience skills.',
      resumeUrl: '/resumes/sneha-reddy.pdf'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
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
    notes: ''
  });

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.email || !newCandidate.position) {
      alert('Please fill in all required fields (Name, Email, Position)');
      return;
    }

    const candidate = {
      id: Math.max(...candidates.map(c => c.id), 0) + 1,
      ...newCandidate,
      skills: newCandidate.skills ? newCandidate.skills.split(',').map(s => s.trim()) : [],
      status: 'active',
      appliedDate: new Date().toISOString().split('T')[0],
      avatar: null,
      rating: 0,
      interviews: 0,
      resumeUrl: null
    };

    setCandidates([...candidates, candidate]);
    
    setNewCandidate({
      name: '', email: '', phone: '', position: '', experience: '', location: '',
      address: '', dateOfBirth: '', nationality: '', education: '', linkedIn: '',
      portfolio: '', salary: '', skills: '', notes: ''
    });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Candidates
            </h1>
            <p className="text-slate-600 mt-1">Manage your talent pipeline and candidate relationships</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/app/candidates/add')}
            >
              Add Candidate
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex gap-6 px-6">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6">
            {candidates.length === 0 ? (
              <EmptyState
                icon={<Users className="w-16 h-16" />}
                title="No candidates yet"
                description="Start building your talent pipeline by adding candidates to your database. You can import from LinkedIn, upload resumes, or add them manually."
                action={
                  <Button
                    variant="primary"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => navigate('/app/candidates/add')}
                  >
                    Add Your First Candidate
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-xl font-bold text-white">
                          {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{candidate.name}</h3>
                            <p className="text-slate-600 font-medium">{candidate.position}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 
                                               overflow-hidden group hover:shadow-md">
                              <Eye className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 
                                              transform scale-0 group-hover:scale-100 
                                              transition-transform duration-200 ease-out rounded-lg"></div>
                            </button>
                            <button className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 
                                               overflow-hidden group hover:shadow-md">
                              <Edit className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 
                                              transform scale-0 group-hover:scale-100 
                                              transition-transform duration-200 ease-out rounded-lg"></div>
                            </button>
                            <button className="relative p-2 rounded-lg transition-all duration-200 hover:scale-110 
                                               overflow-hidden group hover:shadow-md">
                              <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-white relative z-10 transition-colors duration-200" />
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 
                                              transform scale-0 group-hover:scale-100 
                                              transition-transform duration-200 ease-out rounded-lg"></div>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4" />
                            <span>{candidate.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4" />
                            <span>{candidate.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Add New Candidate
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="relative p-2 rounded-lg transition-all duration-200 overflow-hidden group hover:shadow-md"
                >
                  <X className="w-5 h-5 text-slate-500 group-hover:text-white relative z-10 transition-colors duration-200" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-500 
                                  transform scale-0 group-hover:scale-100 
                                  transition-transform duration-200 ease-out rounded-lg"></div>
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={newCandidate.name}
                        onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={newCandidate.email}
                        onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="candidate@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={newCandidate.phone}
                        onChange={(e) => setNewCandidate({...newCandidate, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={newCandidate.dateOfBirth}
                        onChange={(e) => setNewCandidate({...newCandidate, dateOfBirth: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={newCandidate.location}
                        onChange={(e) => setNewCandidate({...newCandidate, location: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="City, State"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Nationality</label>
                      <input
                        type="text"
                        value={newCandidate.nationality}
                        onChange={(e) => setNewCandidate({...newCandidate, nationality: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="Nationality"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={newCandidate.address}
                        onChange={(e) => setNewCandidate({...newCandidate, address: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="Full address"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Position *</label>
                      <input
                        type="text"
                        value={newCandidate.position}
                        onChange={(e) => setNewCandidate({...newCandidate, position: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="Job title or position"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Experience</label>
                      <input
                        type="text"
                        value={newCandidate.experience}
                        onChange={(e) => setNewCandidate({...newCandidate, experience: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="e.g., 5 years"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Expected Salary</label>
                      <input
                        type="text"
                        value={newCandidate.salary}
                        onChange={(e) => setNewCandidate({...newCandidate, salary: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="₹18,00,000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Education</label>
                      <input
                        type="text"
                        value={newCandidate.education}
                        onChange={(e) => setNewCandidate({...newCandidate, education: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="Degree - University"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={newCandidate.linkedIn}
                        onChange={(e) => setNewCandidate({...newCandidate, linkedIn: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Portfolio/Website</label>
                      <input
                        type="url"
                        value={newCandidate.portfolio}
                        onChange={(e) => setNewCandidate({...newCandidate, portfolio: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="https://portfolio.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
                      <input
                        type="text"
                        value={newCandidate.skills}
                        onChange={(e) => setNewCandidate({...newCandidate, skills: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                        placeholder="React, TypeScript, Node.js, AWS (comma separated)"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                      <textarea
                        value={newCandidate.notes}
                        onChange={(e) => setNewCandidate({...newCandidate, notes: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 resize-none"
                        placeholder="Additional notes about the candidate..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewCandidate({
                      name: '', email: '', phone: '', position: '', experience: '', location: '',
                      address: '', dateOfBirth: '', nationality: '', education: '', linkedIn: '',
                      portfolio: '', salary: '', skills: '', notes: ''
                    });
                  }}
                  className="relative px-6 py-3 text-slate-600 hover:text-white font-medium rounded-xl 
                             transition-all duration-200 overflow-hidden group border border-slate-300 hover:border-slate-500"
                >
                  <span className="relative z-10">Cancel</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-600 
                                  transform -translate-x-full group-hover:translate-x-0 
                                  transition-transform duration-200 ease-out"></div>
                </button>
                <button
                  onClick={handleAddCandidate}
                  className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium 
                             rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 
                             overflow-hidden group"
                >
                  <span className="relative z-10">Add Candidate</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 
                                  transform translate-y-full group-hover:translate-y-0 
                                  transition-transform duration-200 ease-out"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;