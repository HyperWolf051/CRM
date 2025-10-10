import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false
  },
  position: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'prospect', 'customer', 'lead'],
    default: 'prospect'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'email_campaign', 'cold_call', 'event', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastContactDate: {
    type: Date,
    default: null
  },
  nextFollowUp: {
    type: Date,
    default: null
  },
  dealValue: {
    type: Number,
    default: 0,
    min: [0, 'Deal value cannot be negative']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
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
contactSchema.index({ email: 1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ company: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ isActive: 1 });
contactSchema.index({ firstName: 1, lastName: 1 });
contactSchema.index({ nextFollowUp: 1 });

// Virtual for full name
contactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for initials
contactSchema.virtual('initials').get(function() {
  return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
});

// Static method to find contacts by status
contactSchema.statics.findByStatus = function(status) {
  return this.find({ status, isActive: true }).populate('assignedTo company');
};

// Static method to find contacts assigned to user
contactSchema.statics.findByAssignee = function(userId) {
  return this.find({ assignedTo: userId, isActive: true }).populate('company');
};

// Static method to find contacts needing follow-up
contactSchema.statics.findNeedingFollowUp = function() {
  return this.find({
    nextFollowUp: { $lte: new Date() },
    isActive: true
  }).populate('assignedTo company');
};

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;