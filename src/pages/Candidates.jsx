import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Eye,
  Edit,
  Trash2,
  Users
} from 'lucide-react';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const Candidates = () => {
  const [candidates] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior React Developer',
      experience: '5 years',
      location: 'San Francisco, CA',
      address: '123 Tech Street, San Francisco, CA 94105',
      dateOfBirth: '1990-05-15',
      nationality: 'American',
      education: 'BS Computer Science - Stanford University',
      linkedIn: 'https://linkedin.com/in/sarahjohnson',
      portfolio: 'https://sarahjohnson.dev',
      status: 'active',
      appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      salary: '$120,000',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      avatar: null,
      rating: 4.8,
      interviews: 2,
      notes: 'Excellent technical skills, great cultural fit. Strong communication skills.',
      resumeUrl: '/resumes/sarah-johnson.pdf'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

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
              onClick={() => setShowAddModal(true)}
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
                    onClick={() => setShowAddModal(true)}
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
                            <button className="p-2 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110">
                              <Eye className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                            </button>
                            <button className="p-2 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110">
                              <Edit className="w-4 h-4 text-slate-400 hover:text-green-600" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110">
                              <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
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
    </div>
  );
};

export default Candidates;