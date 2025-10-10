import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  industry: {
    type: String,
    trim: true,
    enum: [
      'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
      'Retail', 'Real Estate', 'Consulting', 'Marketing', 'Legal',
      'Non-profit', 'Government', 'Entertainment', 'Food & Beverage',
      'Transportation', 'Energy', 'Construction', 'Other'
    ]
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    default: '1-10'
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  logo: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['prospect', 'customer', 'partner', 'inactive'],
    default: 'prospect'
  },
  tags: [{
    type: String,
    trim: true
  }],
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  revenue: {
    type: Number,
    min: [0, 'Revenue cannot be negative'],
    default: 0
  },
  employees: {
    type: Number,
    min: [1, 'Employee count must be at least 1'],
    default: 1
  },
  foundedYear: {
    type: Number,
    min: [1800, 'Founded year seems too early'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  lastContactDate: {
    type: Date,
    default: null
  },
  nextFollowUp: {
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
companySchema.index({ name: 1 });
companySchema.index({ assignedTo: 1 });
companySchema.index({ industry: 1 });
companySchema.index({ status: 1 });
companySchema.index({ isActive: 1 });
companySchema.index({ revenue: -1 }); // Descending for highest revenue first

// Virtual for company initials
companySchema.virtual('initials').get(function() {
  return this.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

// Virtual for formatted revenue
companySchema.virtual('formattedRevenue').get(function() {
  if (!this.revenue) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(this.revenue);
});

// Virtual for company age
companySchema.virtual('age').get(function() {
  if (!this.foundedYear) return null;
  return new Date().getFullYear() - this.foundedYear;
});

// Virtual for full address
companySchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  const { street, city, state, zipCode, country } = this.address;
  const parts = [street, city, state, zipCode, country].filter(Boolean);
  return parts.join(', ');
});

// Static method to find companies by status
companySchema.statics.findByStatus = function(status) {
  return this.find({ status, isActive: true }).populate('assignedTo');
};

// Static method to find companies by industry
companySchema.statics.findByIndustry = function(industry) {
  return this.find({ industry, isActive: true }).populate('assignedTo');
};

// Static method to find companies assigned to user
companySchema.statics.findByAssignee = function(userId) {
  return this.find({ assignedTo: userId, isActive: true });
};

// Static method to find companies needing follow-up
companySchema.statics.findNeedingFollowUp = function() {
  return this.find({
    nextFollowUp: { $lte: new Date() },
    isActive: true
  }).populate('assignedTo');
};

// Static method to get industry distribution
companySchema.statics.getIndustryDistribution = async function() {
  return await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$industry',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$revenue' },
        avgRevenue: { $avg: '$revenue' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

const Company = mongoose.model('Company', companySchema);

export default Company;