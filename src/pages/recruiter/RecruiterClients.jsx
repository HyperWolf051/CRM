import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  Users,
  Briefcase,
  Calendar,
  MoreVertical,
  Edit,
  Eye,
  MessageSquare,
  Download,
  X,
  Grid3X3,
  List,
  Trophy,
  Award,
  Medal,
  TrendingUp,
  Target,
  Sparkles,
} from "lucide-react";
import { ClientAPI } from "@/services/api";

// Modern Helper Functions with Enhanced Styling
const getTierConfig = (tier) => {
  const configs = {
    platinum: {
      color: "from-purple-600 via-pink-500 to-purple-600",
      bg: "bg-gradient-to-r from-purple-50 to-pink-50",
      text: "text-purple-700",
      border: "border-purple-300",
      icon: Trophy,
      glow: "shadow-lg shadow-purple-500/30",
      metallic: "bg-gradient-to-br from-purple-400 via-pink-300 to-purple-500",
    },
    gold: {
      color: "from-yellow-500 via-amber-400 to-yellow-600",
      bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
      text: "text-yellow-700",
      border: "border-yellow-300",
      icon: Award,
      glow: "shadow-lg shadow-yellow-500/30",
      metallic: "bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-500",
    },
    silver: {
      color: "from-gray-400 via-slate-300 to-gray-500",
      bg: "bg-gradient-to-r from-gray-50 to-slate-50",
      text: "text-gray-700",
      border: "border-gray-300",
      icon: Medal,
      glow: "shadow-lg shadow-gray-500/30",
      metallic: "bg-gradient-to-br from-gray-300 via-slate-200 to-gray-400",
    },
    bronze: {
      color: "from-orange-500 via-amber-500 to-orange-600",
      bg: "bg-gradient-to-r from-orange-50 to-amber-50",
      text: "text-orange-700",
      border: "border-orange-300",
      icon: Medal,
      glow: "shadow-lg shadow-orange-500/30",
      metallic: "bg-gradient-to-br from-orange-400 via-amber-300 to-orange-500",
    },
  };
  return configs[tier] || configs.bronze;
};

const getStatusConfig = (status) => {
  const configs = {
    active: {
      bg: "bg-gradient-to-r from-emerald-50 to-green-50",
      text: "text-emerald-700",
      border: "border-emerald-300",
      dot: "bg-emerald-500 animate-pulse",
      gradient: "from-emerald-500 to-green-500",
    },
    inactive: {
      bg: "bg-gradient-to-r from-gray-50 to-slate-50",
      text: "text-gray-600",
      border: "border-gray-300",
      dot: "bg-gray-400",
      gradient: "from-gray-400 to-slate-400",
    },
    prospect: {
      bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
      text: "text-blue-700",
      border: "border-blue-300",
      dot: "bg-blue-500 animate-pulse",
      gradient: "from-blue-500 to-cyan-500",
    },
    blacklisted: {
      bg: "bg-gradient-to-r from-red-50 to-rose-50",
      text: "text-red-700",
      border: "border-red-300",
      dot: "bg-red-500",
      gradient: "from-red-500 to-rose-500",
    },
  };
  return configs[status] || configs.active;
};

export default function RecruiterClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const mockClients = [
        {
          id: "1",
          name: "TechCorp Solutions",
          industry: "Information Technology",
          website: "https://techcorp.com",
          primaryContact: {
            name: "Sarah Johnson",
            designation: "HR Director",
            email: "sarah.johnson@techcorp.com",
            phone: "+91 98765 43210",
          },
          companyDetails: {
            size: "large",
            location: {
              city: "Bangalore",
              state: "Karnataka",
              country: "India",
            },
          },
          status: "active",
          tier: "platinum",
          metrics: {
            totalJobsPosted: 45,
            activeJobs: 8,
            candidatesHired: 32,
            averageTimeToHire: 21,
            offerAcceptanceRate: 85,
          },
          lastContactDate: new Date("2024-01-15"),
          nextFollowUpDate: new Date("2024-02-01"),
        },
        {
          id: "2",
          name: "InnovateLabs Pvt Ltd",
          industry: "Software Development",
          website: "https://innovatelabs.in",
          primaryContact: {
            name: "Rajesh Kumar",
            designation: "Talent Acquisition Manager",
            email: "rajesh.kumar@innovatelabs.in",
            phone: "+91 87654 32109",
          },
          companyDetails: {
            size: "medium",
            location: {
              city: "Pune",
              state: "Maharashtra",
              country: "India",
            },
          },
          status: "active",
          tier: "gold",
          metrics: {
            totalJobsPosted: 28,
            activeJobs: 5,
            candidatesHired: 19,
            averageTimeToHire: 18,
            offerAcceptanceRate: 78,
          },
          lastContactDate: new Date("2024-01-20"),
          nextFollowUpDate: new Date("2024-01-28"),
        },
        {
          id: "3",
          name: "Global Finance Corp",
          industry: "Financial Services",
          website: "https://globalfinance.com",
          primaryContact: {
            name: "Priya Sharma",
            designation: "Head of Recruitment",
            email: "priya.sharma@globalfinance.com",
            phone: "+91 76543 21098",
          },
          companyDetails: {
            size: "enterprise",
            location: {
              city: "Mumbai",
              state: "Maharashtra",
              country: "India",
            },
          },
          status: "active",
          tier: "silver",
          metrics: {
            totalJobsPosted: 67,
            activeJobs: 12,
            candidatesHired: 48,
            averageTimeToHire: 25,
            offerAcceptanceRate: 72,
          },
          lastContactDate: new Date("2024-01-10"),
          nextFollowUpDate: new Date("2024-02-05"),
        },
      ];

      setClients(mockClients);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.primaryContact.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || client.status === filterStatus;
      const matchesTier = filterTier === "all" || client.tier === filterTier;

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [clients, searchTerm, filterStatus, filterTier]);

  const stats = useMemo(
    () => ({
      totalClients: clients.length,
      totalActiveJobs: clients.reduce(
        (sum, client) => sum + client.metrics.activeJobs,
        0
      ),
      totalHired: clients.reduce(
        (sum, client) => sum + client.metrics.candidatesHired,
        0
      ),
      avgAcceptanceRate:
        clients.length > 0
          ? Math.round(
              clients.reduce(
                (sum, client) => sum + client.metrics.offerAcceptanceRate,
                0
              ) / clients.length
            )
          : 0,
    }),
    [clients]
  );

  const hasActiveFilters =
    searchTerm || filterStatus !== "all" || filterTier !== "all";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <Sparkles className="w-6 h-6 text-violet-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header with Glassmorphism - Matching Companies Page */}
      <div className="backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Header Content */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Client Management
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage relationships and track recruitment performance
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="border-gray-200 text-gray-700 hover:bg-gray-50 backdrop-blur-sm px-4 py-2 border rounded-xl font-medium transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <Link
                to="/app/recruiter/clients/add"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-4 py-2 rounded-xl text-white font-semibold transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Client</span>
              </Link>
            </div>
          </div>

          {/* Enhanced Stats Cards - Matching Companies Page */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <StatCard
              icon={Building2}
              value={stats.totalClients}
              label="Total Clients"
              gradient="from-violet-500 to-purple-500"
              bgColor="bg-violet-50"
            />
            <StatCard
              icon={Briefcase}
              value={stats.totalActiveJobs}
              label="Active Jobs"
              gradient="from-blue-500 to-cyan-500"
              bgColor="bg-blue-50"
            />
            <StatCard
              icon={Users}
              value={stats.totalHired}
              label="Total Hired"
              gradient="from-emerald-500 to-teal-500"
              bgColor="bg-emerald-50"
            />
            <StatCard
              icon={Target}
              value={`${stats.avgAcceptanceRate}%`}
              label="Acceptance Rate"
              gradient="from-amber-500 to-orange-500"
              bgColor="bg-amber-50"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Compact Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {/* Compact Search */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-violet-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all placeholder-gray-400 text-gray-900 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Modern Filter Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all font-medium cursor-pointer text-gray-700 hover:bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="prospect">Prospect</option>
                <option value="blacklisted">Blacklisted</option>
              </select>

              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all font-medium cursor-pointer text-gray-700 hover:bg-white"
              >
                <option value="all">All Tiers</option>
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-violet-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white text-violet-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm font-medium text-gray-600">
            Showing{" "}
            <span className="text-violet-600 font-semibold">
              {filteredClients.length}
            </span>{" "}
            of{" "}
            <span className="text-gray-900 font-semibold">
              {stats.totalClients}
            </span>{" "}
            clients
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterTier("all");
              }}
              className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center space-x-1 hover:underline transition-all"
            >
              <X className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Clients Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredClients.map((client) => (
                    <ClientRow key={client.id} client={client} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <Building2 className="w-10 h-10 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-violet-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No clients found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {hasActiveFilters
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by adding your first client to begin tracking relationships."}
            </p>
            {!hasActiveFilters && (
              <Link
                to="/app/recruiter/clients/add"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Client
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, gradient, bgColor }) {
  // Extract color from gradient for consistent styling
  const iconColor =
    gradient.includes("violet") || gradient.includes("purple")
      ? "text-violet-600"
      : gradient.includes("blue") || gradient.includes("cyan")
      ? "text-blue-600"
      : gradient.includes("emerald") || gradient.includes("teal")
      ? "text-emerald-600"
      : "text-orange-600";

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between">
      <div>
        <p className={`${iconColor} text-sm font-medium`}>{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-green-600 text-xs flex items-center mt-1">
          <TrendingUp className="w-3 h-3 mr-1" />
          Active
        </p>
      </div>
      <div
        className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
  );
}

function ClientCard({ client }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const tierConfig = getTierConfig(client.tier);
  const statusConfig = getStatusConfig(client.status);
  const TierIcon = tierConfig.icon;

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 p-4 overflow-hidden">
      {/* Decorative gradient */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tierConfig.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}
      ></div>

      <div className="relative">
        {/* Compact Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-gray-600" />
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r ${tierConfig.color} rounded-md flex items-center justify-center shadow-md ${tierConfig.glow}`}
              >
                <TierIcon className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 mb-1 truncate group-hover:text-violet-600 transition-colors">
                {client.name}
              </h3>
              <p className="text-xs text-gray-600 mb-2 truncate">
                {client.industry}
              </p>

              {/* Compact Status Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center px-2 py-0.5 ${statusConfig.bg} ${statusConfig.text} rounded-md text-xs font-medium border ${statusConfig.border}`}
                >
                  <span
                    className={`w-1 h-1 ${statusConfig.dot} rounded-full mr-1`}
                  ></span>
                  {client.status}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 ${tierConfig.bg} ${tierConfig.text} rounded-md text-xs font-medium border ${tierConfig.border}`}
                >
                  <TierIcon className="w-2.5 h-2.5 mr-1" />
                  {client.tier}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                ></div>
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to={`/app/recruiter/clients/${client.id}`}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-3 text-gray-400" />
                    View Details
                  </Link>
                  <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Edit className="w-4 h-4 mr-3 text-gray-400" />
                    Edit Client
                  </button>
                  <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <MessageSquare className="w-4 h-4 mr-3 text-gray-400" />
                    Send Message
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center text-sm text-gray-600 hover:text-violet-600 transition-colors group/item">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mr-3 group-hover/item:bg-violet-50 transition-colors">
              <Phone className="w-4 h-4 text-gray-400 group-hover/item:text-violet-600" />
            </div>
            <span className="font-medium truncate">
              {client.primaryContact.phone}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 hover:text-violet-600 transition-colors group/item">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mr-3 group-hover/item:bg-violet-50 transition-colors">
              <Mail className="w-4 h-4 text-gray-400 group-hover/item:text-violet-600" />
            </div>
            <span className="font-medium truncate">
              {client.primaryContact.email}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 hover:text-violet-600 transition-colors group/item">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mr-3 group-hover/item:bg-violet-50 transition-colors">
              <MapPin className="w-4 h-4 text-gray-400 group-hover/item:text-violet-600" />
            </div>
            <span className="font-medium truncate">
              {client.companyDetails.location.city},{" "}
              {client.companyDetails.location.state}
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-xl hover:bg-violet-50 transition-colors group/metric">
            <div className="text-2xl font-bold text-gray-900 mb-1 group-hover/metric:text-violet-600 transition-colors">
              {client.metrics.activeJobs}
            </div>
            <div className="text-xs text-gray-600 font-medium">Active Jobs</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors group/metric">
            <div className="text-2xl font-bold text-gray-900 mb-1 group-hover/metric:text-emerald-600 transition-colors">
              {client.metrics.candidatesHired}
            </div>
            <div className="text-xs text-gray-600 font-medium">Hired</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors group/metric">
            <div className="text-2xl font-bold text-gray-900 mb-1 group-hover/metric:text-amber-600 transition-colors">
              {client.metrics.offerAcceptanceRate}%
            </div>
            <div className="text-xs text-gray-600 font-medium">Accept Rate</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              (window.location.href = `mailto:${client.primaryContact.email}`)
            }
            className="flex-1 p-3 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl transition-all flex items-center justify-center group/btn"
            title="Send Email"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              (window.location.href = `tel:${client.primaryContact.phone}`)
            }
            className="flex-1 p-3 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 rounded-xl transition-all flex items-center justify-center group/btn"
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            className="flex-1 p-3 bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-xl transition-all flex items-center justify-center group/btn"
            title="Schedule Meeting"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <Link
            to={`/app/recruiter/clients/${client.id}`}
            className="flex-[2] px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all text-center text-sm shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function ClientRow({ client }) {
  const tierConfig = getTierConfig(client.tier);
  const statusConfig = getStatusConfig(client.status);
  const TierIcon = tierConfig.icon;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-3">
              <Building2 className="w-5 h-5 text-gray-600" />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r ${tierConfig.color} rounded flex items-center justify-center`}
            >
              <TierIcon className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {client.name}
            </div>
            <div className="text-sm text-gray-500">{client.industry}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {client.primaryContact.name}
        </div>
        <div className="text-sm text-gray-500">
          {client.primaryContact.email}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 ${statusConfig.bg} ${statusConfig.text} rounded-lg text-xs font-medium border ${statusConfig.border}`}
          >
            <span
              className={`w-1.5 h-1.5 ${statusConfig.dot} rounded-full mr-1.5`}
            ></span>
            {client.status}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-1 ${tierConfig.bg} ${tierConfig.text} rounded-lg text-xs font-medium border ${tierConfig.border}`}
          >
            <TierIcon className="w-3 h-3 mr-1" />
            {client.tier}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Briefcase className="w-4 h-4 mr-1.5 text-gray-400" />
            <span className="font-medium">{client.metrics.activeJobs}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1.5 text-gray-400" />
            <span className="font-medium">
              {client.metrics.candidatesHired}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Star className="w-4 h-4 mr-1.5 text-yellow-400 fill-current" />
            <span className="font-medium">
              {client.metrics.offerAcceptanceRate}%
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/app/recruiter/clients/${client.id}`}
            className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
            title="Message"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
