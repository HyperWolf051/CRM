import { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, User, Briefcase, Calendar, Award
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

// Sample candidate data
const candidatesData = [
  {
    id: 1,
    name: "Mukesh Jena",
    gender: "Male",
    age: 28,
    role: "Oracle Developer",
    manager: "Trijal Thakur",
    currentSalary: "50,000",
    expectedSalary: "65,000",
    experience: "3.5 Years",
    status: "Shortlisted",
    lookingForJob: true,
    rating: 4,
    location: "Bangalore",
    phone: "+91 9876543210",
    email: "mukesh.jena@email.com",
    appliedDate: "2024-01-15",
    remarks: "Strong technical skills, good communication"
  },
  {
    id: 2,
    name: "Prateek Tomar",
    gender: "Male",
    age: 32,
    role: "CMA",
    manager: "Trijal Thakur",
    currentSalary: "35,000",
    expectedSalary: "45,000",
    experience: "7 Years",
    status: "Shortlisted",
    lookingForJob: true,
    rating: 5,
    location: "Delhi",
    phone: "+91 9876543211",
    email: "prateek.tomar@email.com",
    appliedDate: "2024-01-14",
    remarks: "Excellent analytical skills"
  },
  {
    id: 3,
    name: "Himanshu Sharma",
    gender: "Male",
    age: 22,
    role: "Executive Assistant",
    manager: "Trijal Thakur",
    currentSalary: "0",
    expectedSalary: "25,000",
    experience: "Fresher",
    status: "Applied",
    lookingForJob: true,
    rating: 3,
    location: "Mumbai",
    phone: "+91 9876543212",
    email: "himanshu.sharma@email.com",
    appliedDate: "2024-01-13",
    remarks: "Fresh graduate, eager to learn"
  },
  {
    id: 4,
    name: "Ankit Kumar",
    gender: "Male",
    age: 29,
    role: "Full Stack Developer",
    manager: "Trijal Thakur",
    currentSalary: "51,000",
    expectedSalary: "70,000",
    experience: "4 Years",
    status: "Joined",
    lookingForJob: false,
    rating: 5,
    location: "Pune",
    phone: "+91 9876543213",
    email: "ankit.kumar@email.com",
    appliedDate: "2024-01-10",
    remarks: "Excellent full-stack developer"
  },
  {
    id: 5,
    name: "Priya Singh",
    gender: "Female",
    age: 26,
    role: "UI/UX Designer",
    manager: "Trijal Thakur",
    currentSalary: "40,000",
    expectedSalary: "55,000",
    experience: "3 Years",
    status: "Scheduled",
    lookingForJob: true,
    rating: 4,
    location: "Hyderabad",
    phone: "+91 9876543214",
    email: "priya.singh@email.com",
    appliedDate: "2024-01-12",
    remarks: "Creative designer with good portfolio"
  },
  {
    id: 6,
    name: "Rahul Verma",
    gender: "Male",
    age: 31,
    role: "Project Manager",
    manager: "Trijal Thakur",
    currentSalary: "80,000",
    expectedSalary: "100,000",
    experience: "6 Years",
    status: "Rejected",
    lookingForJob: true,
    rating: 2,
    location: "Chennai",
    phone: "+91 9876543215",
    email: "rahul.verma@email.com",
    appliedDate: "2024-01-11",
    remarks: "Overqualified for the position"
  }
];

const statusOptions = [
  "All", "Applied", "Shortlisted", "Scheduled", "Selected", "Rejected", "Hold", "Joined", "Absent", "Interview Expired", "Job Left", "Rescheduled"
];

const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let filtered = candidatesData.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.manager.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      if (selectedStatus === 'Looking') {
        matchesFilter = candidate.lookingForJob;
      } else if (selectedStatus === 'NotLooking') {
        matchesFilter = !candidate.lookingForJob;
      } else if (selectedStatus === 'Fresher') {
        matchesFilter = candidate.experience === 'Fresher';
      } else if (selectedStatus === 'Experienced') {
        matchesFilter = candidate.experience !== 'Fresher';
      } else if (selectedStatus !== 'All') {
        matchesFilter = candidate.status === selectedStatus;
      }
      
      return matchesSearch && matchesFilter;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'experience') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, selectedStatus, sortBy, sortOrder]);



  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Candidates Management
          </h1>
          <p className="text-slate-600 mt-1">Manage and track all your candidates in one place</p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Candidates', value: candidatesData.length, color: 'from-blue-500 to-blue-600', icon: User },
          { label: 'Active Candidates', value: candidatesData.filter(c => c.lookingForJob).length, color: 'from-green-500 to-green-600', icon: Award },
          { label: 'Fresh Graduates', value: candidatesData.filter(c => c.experience === 'Fresher').length, color: 'from-purple-500 to-purple-600', icon: Calendar },
          { label: 'Experienced', value: candidatesData.filter(c => c.experience !== 'Fresher').length, color: 'from-cyan-500 to-cyan-600', icon: Briefcase },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="role">Sort by Role</option>
              <option value="experience">Sort by Experience</option>
              <option value="appliedDate">Sort by Date</option>
            </select>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {['All', 'Looking for Job', 'Not Looking', 'Fresher', 'Experienced'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                if (filter === 'All') setSelectedStatus('All');
                else if (filter === 'Looking for Job') setSelectedStatus('Looking');
                else if (filter === 'Not Looking') setSelectedStatus('NotLooking');
                else if (filter === 'Fresher') setSelectedStatus('Fresher');
                else if (filter === 'Experienced') setSelectedStatus('Experienced');
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                (selectedStatus === 'All' && filter === 'All') ||
                (selectedStatus === 'Looking' && filter === 'Looking for Job') ||
                (selectedStatus === 'NotLooking' && filter === 'Not Looking') ||
                (selectedStatus === 'Fresher' && filter === 'Fresher') ||
                (selectedStatus === 'Experienced' && filter === 'Experienced')
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
              <span className="ml-2 text-xs">
                ({filter === 'All' ? candidatesData.length :
                  filter === 'Looking for Job' ? candidatesData.filter(c => c.lookingForJob).length :
                  filter === 'Not Looking' ? candidatesData.filter(c => !c.lookingForJob).length :
                  filter === 'Fresher' ? candidatesData.filter(c => c.experience === 'Fresher').length :
                  candidatesData.filter(c => c.experience !== 'Fresher').length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Candidate Details</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Applied Role</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Manager</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Salary/Experience</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Contact Info</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="table-row-hover group cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{candidate.name}</p>
                        <p className="text-sm text-slate-500">{candidate.gender}, {candidate.age} years</p>
                        <p className="text-xs text-slate-400">{candidate.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900">{candidate.role}</p>
                    <p className="text-sm text-slate-500">Applied: {candidate.appliedDate}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-slate-900">{candidate.manager}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">Current:</span> ₹{candidate.currentSalary}
                      </p>
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">Expected:</span> ₹{candidate.expectedSalary}
                      </p>
                      <p className="text-xs text-slate-500">{candidate.experience}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-900 font-medium">{candidate.phone}</p>
                      <p className="text-sm text-slate-600">{candidate.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-slate-700">{candidate.remarks}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Add Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center justify-center z-50">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Candidates;