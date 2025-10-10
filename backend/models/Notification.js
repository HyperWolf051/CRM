import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'reminder'],
    default: 'info'
  },
  category: {
    type: String,
    enum: ['system', 'deal', 'contact', 'calendar', 'task', 'general'],
    default: 'general'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  actionUrl: {
    type: String,
    trim: true
  },
  actionText: {
    type: String,
    trim: true,
    maxlength: [50, 'Action text cannot exceed 50 characters']
  },
  relatedTo: {
    type: {
      type: String,
      enum: ['contact', 'deal', 'company', 'calendar_event', 'user'],
      required: false
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    }
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  expiresAt: {
    type: Date,
    default: null
  },
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
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ category: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ isActive: 1 });

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
});

// Virtual for formatted date
notificationSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Pre-save middleware to set readAt when isRead changes to true
notificationSchema.pre('save', function(next) {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

// Static method to find unread notifications for user
notificationSchema.statics.findUnreadForUser = function(userId) {
  return this.find({
    recipient: userId,
    isRead: false,
    isActive: true
  }).populate('sender').sort({ createdAt: -1 });
};

// Static method to find notifications for user with pagination
notificationSchema.statics.findForUser = function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  return this.find({
    recipient: userId,
    isActive: true
  })
  .populate('sender')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
};

// Static method to mark all as read for user
notificationSchema.statics.markAllAsReadForUser = function(userId) {
  return this.updateMany(
    { recipient: userId, isRead: false, isActive: true },
    { isRead: true, readAt: new Date() }
  );
};

// Static method to get notification counts by type for user
notificationSchema.statics.getCountsByType = async function(userId) {
  return await this.aggregate([
    { $match: { recipient: mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: '$type',
        total: { $sum: 1 },
        unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } }
      }
    }
  ]);
};

// Static method to create system notification
notificationSchema.statics.createSystemNotification = function(recipientId, title, message, options = {}) {
  return this.create({
    title,
    message,
    recipient: recipientId,
    type: options.type || 'info',
    category: 'system',
    priority: options.priority || 'medium',
    actionUrl: options.actionUrl,
    actionText: options.actionText,
    metadata: options.metadata || {},
    expiresAt: options.expiresAt
  });
};

// Static method to create deal notification
notificationSchema.statics.createDealNotification = function(recipientId, dealId, title, message, options = {}) {
  return this.create({
    title,
    message,
    recipient: recipientId,
    sender: options.senderId,
    type: options.type || 'info',
    category: 'deal',
    priority: options.priority || 'medium',
    actionUrl: options.actionUrl || `/app/deals/${dealId}`,
    actionText: options.actionText || 'View Deal',
    relatedTo: {
      type: 'deal',
      id: dealId
    },
    metadata: options.metadata || {}
  });
};

// Static method to create calendar notification
notificationSchema.statics.createCalendarNotification = function(recipientId, eventId, title, message, options = {}) {
  return this.create({
    title,
    message,
    recipient: recipientId,
    sender: options.senderId,
    type: options.type || 'reminder',
    category: 'calendar',
    priority: options.priority || 'high',
    actionUrl: options.actionUrl || `/app/calendar`,
    actionText: options.actionText || 'View Event',
    relatedTo: {
      type: 'calendar_event',
      id: eventId
    },
    metadata: options.metadata || {}
  });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;