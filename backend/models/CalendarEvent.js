import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  allDay: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['meeting', 'call', 'task', 'reminder', 'follow_up', 'demo', 'other'],
    default: 'meeting'
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  location: {
    type: String,
    trim: true
  },
  isVirtual: {
    type: Boolean,
    default: false
  },
  meetingLink: {
    type: String,
    trim: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'tentative'],
      default: 'pending'
    }
  }],
  relatedTo: {
    type: {
      type: String,
      enum: ['contact', 'deal', 'company'],
      required: false
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    }
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'notification', 'sms'],
      default: 'notification'
    },
    minutes: {
      type: Number,
      min: [0, 'Reminder minutes cannot be negative'],
      default: 15
    },
    sent: {
      type: Boolean,
      default: false
    }
  }],
  recurrence: {
    type: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'none'
    },
    interval: {
      type: Number,
      min: [1, 'Recurrence interval must be at least 1'],
      default: 1
    },
    endDate: Date,
    daysOfWeek: [{
      type: Number,
      min: [0, 'Day of week must be 0-6'],
      max: [6, 'Day of week must be 0-6']
    }]
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
calendarEventSchema.index({ organizer: 1 });
calendarEventSchema.index({ startDate: 1 });
calendarEventSchema.index({ endDate: 1 });
calendarEventSchema.index({ 'attendees.user': 1 });
calendarEventSchema.index({ type: 1 });
calendarEventSchema.index({ status: 1 });
calendarEventSchema.index({ isActive: 1 });

// Virtual for duration in minutes
calendarEventSchema.virtual('duration').get(function() {
  if (!this.startDate || !this.endDate) return 0;
  return Math.round((this.endDate - this.startDate) / (1000 * 60));
});

// Virtual for formatted duration
calendarEventSchema.virtual('formattedDuration').get(function() {
  const minutes = this.duration;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
});

// Virtual to check if event is today
calendarEventSchema.virtual('isToday').get(function() {
  const today = new Date();
  const eventDate = new Date(this.startDate);
  return today.toDateString() === eventDate.toDateString();
});

// Virtual to check if event is upcoming
calendarEventSchema.virtual('isUpcoming').get(function() {
  return this.startDate > new Date();
});

// Virtual to check if event is past
calendarEventSchema.virtual('isPast').get(function() {
  return this.endDate < new Date();
});

// Pre-save validation
calendarEventSchema.pre('save', function(next) {
  // Ensure end date is after start date
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  
  // Set default reminders for new events
  if (this.isNew && this.reminders.length === 0) {
    this.reminders.push({ type: 'notification', minutes: 15 });
  }
  
  next();
});

// Static method to find events for a user
calendarEventSchema.statics.findForUser = function(userId, startDate, endDate) {
  const query = {
    $or: [
      { organizer: userId },
      { 'attendees.user': userId }
    ],
    isActive: true
  };
  
  if (startDate && endDate) {
    query.$and = [
      { startDate: { $lte: endDate } },
      { endDate: { $gte: startDate } }
    ];
  }
  
  return this.find(query).populate('organizer attendees.user');
};

// Static method to find upcoming events
calendarEventSchema.statics.findUpcoming = function(userId, days = 7) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return this.find({
    $or: [
      { organizer: userId },
      { 'attendees.user': userId }
    ],
    startDate: { $gte: now, $lte: futureDate },
    status: { $ne: 'cancelled' },
    isActive: true
  }).populate('organizer attendees.user').sort({ startDate: 1 });
};

// Static method to find events needing reminders
calendarEventSchema.statics.findNeedingReminders = function() {
  const now = new Date();
  
  return this.find({
    'reminders.sent': false,
    startDate: { $gt: now },
    status: 'scheduled',
    isActive: true
  }).populate('organizer attendees.user');
};

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

export default CalendarEvent;