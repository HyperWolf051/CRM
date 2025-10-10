import express from 'express';
import Contact from '../models/Contact.js';
import Deal from '../models/Deal.js';
import Company from '../models/Company.js';
import CalendarEvent from '../models/CalendarEvent.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get dashboard metrics (alias for overview)
// @route   GET /api/dashboard/metrics
// @access  Private
router.get('/metrics', asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';

  // Build base query - admin sees all, others see only their assigned items
  const baseQuery = isAdmin ? { isActive: true } : { assignedTo: userId, isActive: true };

  // Get counts
  const [
    totalContacts,
    totalDeals,
    totalCompanies,
    upcomingEvents,
    activeDeals,
    closedWonDeals,
    overdueDeals
  ] = await Promise.all([
    Contact.countDocuments(baseQuery),
    Deal.countDocuments(baseQuery),
    Company.countDocuments(baseQuery),
    CalendarEvent.countDocuments({
      $or: [
        { organizer: userId },
        { 'attendees.user': userId }
      ],
      startDate: { $gte: new Date() },
      status: 'scheduled',
      isActive: true
    }),
    Deal.countDocuments({
      ...baseQuery,
      stage: { $nin: ['closed_won', 'closed_lost'] }
    }),
    Deal.countDocuments({
      ...baseQuery,
      stage: 'closed_won'
    }),
    Deal.countDocuments({
      ...baseQuery,
      expectedCloseDate: { $lt: new Date() },
      stage: { $nin: ['closed_won', 'closed_lost'] }
    })
  ]);

  // Calculate total deal value
  const dealValueResult = await Deal.aggregate([
    { $match: baseQuery },
    {
      $group: {
        _id: null,
        totalValue: { $sum: '$value' },
        avgValue: { $avg: '$value' },
        weightedValue: { $sum: { $multiply: ['$value', { $divide: ['$probability', 100] }] } }
      }
    }
  ]);

  const dealValue = dealValueResult[0] || { totalValue: 0, avgValue: 0, weightedValue: 0 };

  res.json({
    success: true,
    data: {
      counts: {
        totalContacts,
        totalDeals,
        totalCompanies,
        upcomingEvents,
        activeDeals,
        closedWonDeals,
        overdueDeals
      },
      dealValue
    }
  });
}));

// @desc    Get dashboard overview
// @route   GET /api/dashboard/overview
// @access  Private
router.get('/overview', asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';

  // Build base query - admin sees all, others see only their assigned items
  const baseQuery = isAdmin ? { isActive: true } : { assignedTo: userId, isActive: true };

  // Get counts
  const [
    totalContacts,
    totalDeals,
    totalCompanies,
    upcomingEvents,
    activeDeals,
    closedWonDeals,
    overdueDeals
  ] = await Promise.all([
    Contact.countDocuments(baseQuery),
    Deal.countDocuments(baseQuery),
    Company.countDocuments(baseQuery),
    CalendarEvent.countDocuments({
      $or: [
        { organizer: userId },
        { 'attendees.user': userId }
      ],
      startDate: { $gte: new Date() },
      status: 'scheduled',
      isActive: true
    }),
    Deal.countDocuments({
      ...baseQuery,
      stage: { $nin: ['closed_won', 'closed_lost'] }
    }),
    Deal.countDocuments({
      ...baseQuery,
      stage: 'closed_won'
    }),
    Deal.countDocuments({
      ...baseQuery,
      expectedCloseDate: { $lt: new Date() },
      stage: { $nin: ['closed_won', 'closed_lost'] }
    })
  ]);

  // Calculate total deal value
  const dealValueResult = await Deal.aggregate([
    { $match: baseQuery },
    {
      $group: {
        _id: null,
        totalValue: { $sum: '$value' },
        avgValue: { $avg: '$value' },
        weightedValue: { $sum: { $multiply: ['$value', { $divide: ['$probability', 100] }] } }
      }
    }
  ]);

  const dealValue = dealValueResult[0] || { totalValue: 0, avgValue: 0, weightedValue: 0 };

  res.json({
    success: true,
    data: {
      counts: {
        totalContacts,
        totalDeals,
        totalCompanies,
        upcomingEvents,
        activeDeals,
        closedWonDeals,
        overdueDeals
      },
      dealValue
    }
  });
}));

// @desc    Get recent activities
// @route   GET /api/dashboard/recent-activities
// @access  Private
router.get('/recent-activities', asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';
  const limit = parseInt(req.query.limit) || 10;

  const baseQuery = isAdmin ? { isActive: true } : { assignedTo: userId, isActive: true };

  // Get recent contacts, deals, and companies
  const [recentContacts, recentDeals, recentCompanies] = await Promise.all([
    Contact.find(baseQuery)
      .populate('assignedTo', 'name')
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .limit(Math.ceil(limit / 3)),
    Deal.find(baseQuery)
      .populate('assignedTo', 'name')
      .populate('contact', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(Math.ceil(limit / 3)),
    Company.find(baseQuery)
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(Math.ceil(limit / 3))
  ]);

  // Combine and format activities
  const activities = [];

  recentContacts.forEach(contact => {
    activities.push({
      id: contact._id,
      type: 'contact',
      title: `New contact: ${contact.fullName}`,
      description: `Added ${contact.fullName} from ${contact.company?.name || 'Unknown Company'}`,
      date: contact.createdAt,
      assignedTo: contact.assignedTo?.name,
      url: `/app/contacts/${contact._id}`
    });
  });

  recentDeals.forEach(deal => {
    activities.push({
      id: deal._id,
      type: 'deal',
      title: `New deal: ${deal.title}`,
      description: `Created deal worth ${deal.formattedValue} with ${deal.contact?.firstName} ${deal.contact?.lastName}`,
      date: deal.createdAt,
      assignedTo: deal.assignedTo?.name,
      url: `/app/deals/${deal._id}`
    });
  });

  recentCompanies.forEach(company => {
    activities.push({
      id: company._id,
      type: 'company',
      title: `New company: ${company.name}`,
      description: `Added ${company.name} in ${company.industry || 'Unknown'} industry`,
      date: company.createdAt,
      assignedTo: company.assignedTo?.name,
      url: `/app/companies/${company._id}`
    });
  });

  // Sort by date and limit
  activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  const limitedActivities = activities.slice(0, limit);

  res.json({
    success: true,
    data: limitedActivities
  });
}));

// @desc    Get sales pipeline
// @route   GET /api/dashboard/sales-pipeline
// @access  Private
router.get('/sales-pipeline', asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';

  const baseQuery = isAdmin ? { isActive: true } : { assignedTo: userId, isActive: true };

  const pipelineData = await Deal.aggregate([
    { $match: baseQuery },
    {
      $group: {
        _id: '$stage',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' },
        avgValue: { $avg: '$value' },
        deals: {
          $push: {
            id: '$_id',
            title: '$title',
            value: '$value',
            probability: '$probability',
            expectedCloseDate: '$expectedCloseDate'
          }
        }
      }
    },
    {
      $addFields: {
        stage: '$_id',
        weightedValue: { $multiply: ['$totalValue', { $divide: ['$avgValue', 100] }] }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Define stage order and labels
  const stageOrder = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
  const stageLabels = {
    lead: 'Lead',
    qualified: 'Qualified',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    closed_won: 'Closed Won',
    closed_lost: 'Closed Lost'
  };

  // Ensure all stages are represented
  const pipeline = stageOrder.map(stage => {
    const stageData = pipelineData.find(item => item._id === stage);
    return {
      stage,
      label: stageLabels[stage],
      count: stageData?.count || 0,
      totalValue: stageData?.totalValue || 0,
      avgValue: stageData?.avgValue || 0,
      deals: stageData?.deals || []
    };
  });

  res.json({
    success: true,
    data: pipeline
  });
}));

// @desc    Get upcoming events
// @route   GET /api/dashboard/upcoming-events
// @access  Private
router.get('/upcoming-events', asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const days = parseInt(req.query.days) || 7;
  const limit = parseInt(req.query.limit) || 10;

  const events = await CalendarEvent.findUpcoming(userId, days)
    .limit(limit);

  res.json({
    success: true,
    data: events
  });
}));

// @desc    Get performance metrics
// @route   GET /api/dashboard/performance
// @access  Private
router.get('/performance', asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';
  const period = req.query.period || 'month'; // week, month, quarter, year

  // Calculate date range
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'quarter':
      startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default: // month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const baseQuery = isAdmin ? { isActive: true } : { assignedTo: userId, isActive: true };
  const dateQuery = { ...baseQuery, createdAt: { $gte: startDate } };

  const [
    newContacts,
    newDeals,
    closedDeals,
    totalRevenue,
    conversionRate
  ] = await Promise.all([
    Contact.countDocuments(dateQuery),
    Deal.countDocuments(dateQuery),
    Deal.countDocuments({
      ...baseQuery,
      stage: 'closed_won',
      actualCloseDate: { $gte: startDate }
    }),
    Deal.aggregate([
      {
        $match: {
          ...baseQuery,
          stage: 'closed_won',
          actualCloseDate: { $gte: startDate }
        }
      },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]),
    // Calculate conversion rate (closed won / total deals)
    Deal.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          totalDeals: { $sum: 1 },
          closedWon: {
            $sum: { $cond: [{ $eq: ['$stage', 'closed_won'] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          conversionRate: {
            $cond: [
              { $eq: ['$totalDeals', 0] },
              0,
              { $multiply: [{ $divide: ['$closedWon', '$totalDeals'] }, 100] }
            ]
          }
        }
      }
    ])
  ]);

  const revenue = totalRevenue[0]?.total || 0;
  const conversion = conversionRate[0]?.conversionRate || 0;

  res.json({
    success: true,
    data: {
      period,
      metrics: {
        newContacts,
        newDeals,
        closedDeals,
        totalRevenue: revenue,
        conversionRate: Math.round(conversion * 100) / 100
      }
    }
  });
}));

// @desc    Get team performance (Admin only)
// @route   GET /api/dashboard/team-performance
// @access  Private (Admin)
router.get('/team-performance', asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }

  const teamStats = await User.aggregate([
    { $match: { isActive: true, role: { $ne: 'admin' } } },
    {
      $lookup: {
        from: 'deals',
        localField: '_id',
        foreignField: 'assignedTo',
        as: 'deals'
      }
    },
    {
      $lookup: {
        from: 'contacts',
        localField: '_id',
        foreignField: 'assignedTo',
        as: 'contacts'
      }
    },
    {
      $addFields: {
        totalDeals: { $size: '$deals' },
        totalContacts: { $size: '$contacts' },
        closedDeals: {
          $size: {
            $filter: {
              input: '$deals',
              cond: { $eq: ['$$this.stage', 'closed_won'] }
            }
          }
        },
        totalRevenue: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: '$deals',
                  cond: { $eq: ['$$this.stage', 'closed_won'] }
                }
              },
              as: 'deal',
              in: '$$deal.value'
            }
          }
        }
      }
    },
    {
      $project: {
        name: 1,
        email: 1,
        role: 1,
        totalDeals: 1,
        totalContacts: 1,
        closedDeals: 1,
        totalRevenue: 1,
        conversionRate: {
          $cond: [
            { $eq: ['$totalDeals', 0] },
            0,
            { $multiply: [{ $divide: ['$closedDeals', '$totalDeals'] }, 100] }
          ]
        }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);

  res.json({
    success: true,
    data: teamStats
  });
}));

// @desc    Get notifications summary
// @route   GET /api/dashboard/notifications
// @access  Private
router.get('/notifications', asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get overdue deals
  const overdueDeals = await Deal.find({
    assignedTo: userId,
    expectedCloseDate: { $lt: new Date() },
    stage: { $nin: ['closed_won', 'closed_lost'] },
    isActive: true
  }).populate('contact', 'firstName lastName');

  // Get contacts needing follow-up
  const followUpContacts = await Contact.find({
    assignedTo: userId,
    nextFollowUp: { $lte: new Date() },
    isActive: true
  }).populate('company', 'name');

  // Get today's events
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayEvents = await CalendarEvent.find({
    $or: [
      { organizer: userId },
      { 'attendees.user': userId }
    ],
    startDate: { $gte: todayStart, $lte: todayEnd },
    status: 'scheduled',
    isActive: true
  }).sort({ startDate: 1 });

  res.json({
    success: true,
    data: {
      overdueDeals: overdueDeals.map(deal => ({
        id: deal._id,
        title: deal.title,
        value: deal.value,
        contact: deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : null,
        expectedCloseDate: deal.expectedCloseDate,
        daysOverdue: Math.ceil((new Date() - deal.expectedCloseDate) / (1000 * 60 * 60 * 24))
      })),
      followUpContacts: followUpContacts.map(contact => ({
        id: contact._id,
        name: contact.fullName,
        company: contact.company?.name,
        nextFollowUp: contact.nextFollowUp,
        daysOverdue: Math.ceil((new Date() - contact.nextFollowUp) / (1000 * 60 * 60 * 24))
      })),
      todayEvents: todayEvents.map(event => ({
        id: event._id,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        type: event.type
      }))
    }
  });
}));

export default router;