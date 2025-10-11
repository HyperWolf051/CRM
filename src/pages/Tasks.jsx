import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flag, 
  User, 
  Calendar,
  MoreHorizontal,
  Star,
  Trash2,
  Edit3
} from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Review Sarah Johnson\'s Portfolio',
      description: 'Evaluate technical skills and project experience for Senior Developer position',
      priority: 'high',
      status: 'pending',
      assignee: 'John Doe',
      dueDate: new Date(2024, 11, 16),
      category: 'interview',
      completed: false,
      starred: true
    },
    {
      id: 2,
      title: 'Prepare Interview Questions',
      description: 'Create technical and behavioral questions for Frontend Developer role',
      priority: 'medium',
      status: 'in-progress',
      assignee: 'Jane Smith',
      dueDate: new Date(2024, 11, 18),
      category: 'preparation',
      completed: false,
      starred: false
    },
    {
      id: 3,
      title: 'Send Offer Letter to Emma Wilson',
      description: 'Prepare and send official offer letter for UX Designer position',
      priority: 'high',
      status: 'pending',
      assignee: 'HR Team',
      dueDate: new Date(2024, 11, 15),
      category: 'offer',
      completed: false,
      starred: true
    },
    {
      id: 4,
      title: 'Update Job Posting',
      description: 'Refresh Backend Developer job description with new requirements',
      priority: 'low',
      status: 'completed',
      assignee: 'Mike Johnson',
      dueDate: new Date(2024, 11, 14),
      category: 'posting',
      completed: true,
      starred: false
    },
    {
      id: 5,
      title: 'Schedule Team Sync',
      description: 'Coordinate weekly team meeting for recruitment updates',
      priority: 'medium',
      status: 'pending',
      assignee: 'Sarah Davis',
      dueDate: new Date(2024, 11, 20),
      category: 'meeting',
      completed: false,
      starred: false
    },
    {
      id: 6,
      title: 'Follow up with References',
      description: 'Contact references for Michael Chen - Senior Developer candidate',
      priority: 'medium',
      status: 'in-progress',
      assignee: 'John Doe',
      dueDate: new Date(2024, 11, 17),
      category: 'reference',
      completed: false,
      starred: false
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const priorities = {
    high: { color: 'text-red-600 bg-red-50 border-red-200', label: 'High' },
    medium: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: 'Medium' },
    low: { color: 'text-green-600 bg-green-50 border-green-200', label: 'Low' }
  };

  const statuses = {
    pending: { color: 'text-gray-600 bg-gray-50 border-gray-200', label: 'Pending' },
    'in-progress': { color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'In Progress' },
    completed: { color: 'text-green-600 bg-green-50 border-green-200', label: 'Completed' }
  };

  const categories = {
    interview: { color: 'text-purple-600 bg-purple-50', label: 'Interview' },
    preparation: { color: 'text-blue-600 bg-blue-50', label: 'Preparation' },
    offer: { color: 'text-green-600 bg-green-50', label: 'Offer' },
    posting: { color: 'text-orange-600 bg-orange-50', label: 'Job Posting' },
    meeting: { color: 'text-indigo-600 bg-indigo-50', label: 'Meeting' },
    reference: { color: 'text-pink-600 bg-pink-50', label: 'Reference' }
  };

  const toggleTaskComplete = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, status: !task.completed ? 'completed' : 'pending' }
        : task
    ));
  };

  const toggleTaskStar = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, starred: !task.starred }
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && task.completed) ||
                         (filter === 'pending' && !task.completed) ||
                         (filter === 'starred' && task.starred) ||
                         (filter === task.priority);
    
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    const overdue = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;
    
    return { total, completed, pending, overdue };
  };

  const stats = getTaskStats();

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isOverdue = (date, completed) => {
    return !completed && new Date(date) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-slate-600 mt-1">Manage your recruitment tasks and deadlines</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-white text-sm font-medium 
                           rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                           btn-primary-slide">
            <Plus className="w-4 h-4 mr-2 inline" />
            New Task
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl shadow-xl p-6 business-card-hover metric-card-professional">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-900 metric-number">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl shadow-xl p-6 business-card-hover metric-card-professional">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-green-600 metric-number">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl shadow-xl p-6 business-card-hover metric-card-professional">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 metric-number">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl shadow-xl p-6 business-card-hover metric-card-professional">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600 metric-number">{stats.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Flag className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-xl
                         text-sm placeholder-slate-400 search-focus
                         focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                         hover:bg-white/80 hover:border-slate-300/50
                         transition-all duration-300"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {[
              { key: 'all', label: 'All Tasks' },
              { key: 'pending', label: 'Pending' },
              { key: 'completed', label: 'Completed' },
              { key: 'starred', label: 'Starred' },
              { key: 'high', label: 'High Priority' },
              { key: 'medium', label: 'Medium Priority' },
              { key: 'low', label: 'Low Priority' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  filter === filterOption.key
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl overflow-hidden">
        <div className="divide-y divide-slate-200/50">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-6 business-table-row ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="mt-1 hover:scale-110 transition-transform duration-200 icon-wiggle"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-lg font-medium ${
                            task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}>
                            {task.title}
                          </h3>
                          {task.starred && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <p className={`text-sm mb-3 ${
                          task.completed ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {task.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm">
                          {/* Priority */}
                          <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${priorities[task.priority].color}`}>
                            {priorities[task.priority].label}
                          </span>

                          {/* Category */}
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${categories[task.category].color}`}>
                            {categories[task.category].label}
                          </span>

                          {/* Assignee */}
                          <div className="flex items-center space-x-1 text-slate-500">
                            <User className="w-3 h-3" />
                            <span>{task.assignee}</span>
                          </div>

                          {/* Due Date */}
                          <div className={`flex items-center space-x-1 ${
                            isOverdue(task.dueDate, task.completed) ? 'text-red-600' : 'text-slate-500'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(task.dueDate)}</span>
                            {isOverdue(task.dueDate, task.completed) && (
                              <span className="text-xs font-medium">(Overdue)</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleTaskStar(task.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-110 icon-wiggle"
                          title={task.starred ? 'Remove from starred' : 'Add to starred'}
                        >
                          <Star className={`w-4 h-4 ${
                            task.starred ? 'text-yellow-500 fill-current' : 'text-slate-400'
                          }`} />
                        </button>
                        
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-110 icon-wiggle">
                          <Edit3 className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                        </button>
                        
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 icon-wiggle">
                          <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                        </button>
                        
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-110 icon-wiggle">
                          <MoreHorizontal className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;