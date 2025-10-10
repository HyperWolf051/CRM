import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Deal title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  value: {
    type: Number,
    required: [true, 'Deal value is required'],
    min: [0, 'Deal value cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  stage: {
    type: String,
    enum: ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
    default: 'lead'
  },
  probability: {
    type: Number,
    min: [0, 'Probability cannot be less than 0'],
    max: [100, 'Probability cannot be more than 100'],
    default: 10
  },
  expectedCloseDate: {
    type: Date,
    required: [true, 'Expected close date is required']
  },
  actualCloseDate: {
    type: Date,
    default: null
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'email_campaign', 'cold_call', 'event', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  activities: [{
    type: {
      type: String,
      enum: ['call', 'email', 'meeting', 'note', 'task'],
      required: true
    },
    description: {
      type: String,
      required: true,
      maxlength: [500, 'Activity description cannot exceed 500 characters']
    },
    date: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
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
dealSchema.index({ assignedTo: 1 });
dealSchema.index({ contact: 1 });
dealSchema.index({ company: 1 });
dealSchema.index({ stage: 1 });
dealSchema.index({ expectedCloseDate: 1 });
dealSchema.index({ isActive: 1 });
dealSchema.index({ value: -1 }); // Descending for highest value first

// Virtual for formatted value
dealSchema.virtual('formattedValue').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.value);
});

// Virtual for days until close
dealSchema.virtual('daysUntilClose').get(function() {
  if (!this.expectedCloseDate) return null;
  const today = new Date();
  const closeDate = new Date(this.expectedCloseDate);
  const diffTime = closeDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for weighted value (value * probability)
dealSchema.virtual('weightedValue').get(function() {
  return (this.value * this.probability) / 100;
});

// Pre-save middleware to set actual close date when deal is closed
dealSchema.pre('save', function(next) {
  if (this.isModified('stage') && (this.stage === 'closed_won' || this.stage === 'closed_lost')) {
    if (!this.actualCloseDate) {
      this.actualCloseDate = new Date();
    }
  }
  next();
});

// Static method to find deals by stage
dealSchema.statics.findByStage = function(stage) {
  return this.find({ stage, isActive: true }).populate('contact company assignedTo');
};

// Static method to find deals assigned to user
dealSchema.statics.findByAssignee = function(userId) {
  return this.find({ assignedTo: userId, isActive: true }).populate('contact company');
};

// Static method to find overdue deals
dealSchema.statics.findOverdue = function() {
  return this.find({
    expectedCloseDate: { $lt: new Date() },
    stage: { $nin: ['closed_won', 'closed_lost'] },
    isActive: true
  }).populate('contact company assignedTo');
};

// Static method to get pipeline summary
dealSchema.statics.getPipelineSummary = async function() {
  return await this.aggregate([
    { $match: { isActive: true, stage: { $nin: ['closed_won', 'closed_lost'] } } },
    {
      $group: {
        _id: '$stage',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' },
        avgValue: { $avg: '$value' },
        weightedValue: { $sum: { $multiply: ['$value', { $divide: ['$probability', 100] }] } }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;