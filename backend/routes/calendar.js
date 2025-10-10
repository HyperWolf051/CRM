import express from 'express';
import CalendarEvent from '../models/CalendarEvent.js';
import { protect } from '../middleware/auth.js';
import { validateCalendarEventCreation, validateObjectId, validatePagination } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all calendar events
// @route   GET /api/calendar
// @access  Private
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const { startDate, endDate, type, status } = req.query;

  // Build query for events where user is organizer or attendee
  let query = {
    $or: [
      { organizer: req.user._id },
      { 'attendees.user': req.user._id }
    ],
    isActive: true
  };

  // Date range filter
  if (startDate && endDate) {
    query.$and = [
      { startDate: { $lte: new Date(endDate) } },
      { endDate: { $gte: new Date(startDate) } }
    ];
  }
  
  if (type) {
    query.type = type;
  }
  
  if (status) {
    query.status = status;
  }

  const events = await CalendarEvent.find(query)
    .populate('organizer', 'name email')
    .populate('attendees.user', 'name email')
    .sort({ startDate: 1 })
    .skip(skip)
    .limit(limit);

  const total = await CalendarEvent.countDocuments(query);

  res.json({
    success: true,
    data: events,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// @desc    Get calendar event by ID
// @route   GET /api/calendar/:id
// @access  Private
router.get('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id)
    .populate('organizer', 'name email')
    .populate('attendees.user', 'name email');

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Calendar event not found'
    });
  }

  // Check if user can access this event (organizer or attendee)
  const canAccess = event.organizer._id.toString() === req.user._id.toString() ||
    event.attendees.some(attendee => 
      attendee.user && attendee.user._id.toString() === req.user._id.toString()
    );

  if (!canAccess) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.json({
    success: true,
    data: event
  });
}));

// @desc    Create new calendar event
// @route   POST /api/calendar
// @access  Private
router.post('/', validateCalendarEventCreation, asyncHandler(async (req, res) => {
  const eventData = {
    ...req.body,
    organizer: req.user._id
  };

  const event = await CalendarEvent.create(eventData);
  
  await event.populate('organizer', 'name email');
  await event.populate('attendees.user', 'name email');

  res.status(201).json({
    success: true,
    message: 'Calendar event created successfully',
    data: event
  });
}));

// @desc    Update calendar event
// @route   PUT /api/calendar/:id
// @access  Private
router.put('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Calendar event not found'
    });
  }

  // Only organizer can update the event
  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Only the organizer can update this event'
    });
  }

  const updatedEvent = await CalendarEvent.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
  .populate('organizer', 'name email')
  .populate('attendees.user', 'name email');

  res.json({
    success: true,
    message: 'Calendar event updated successfully',
    data: updatedEvent
  });
}));

// @desc    Delete calendar event
// @route   DELETE /api/calendar/:id
// @access  Private
router.delete('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Calendar event not found'
    });
  }

  // Only organizer can delete the event
  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Only the organizer can delete this event'
    });
  }

  // Soft delete
  event.isActive = false;
  await event.save();

  res.json({
    success: true,
    message: 'Calendar event deleted successfully'
  });
}));

// @desc    Get upcoming events
// @route   GET /api/calendar/upcoming
// @access  Private
router.get('/upcoming', asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  
  const events = await CalendarEvent.findUpcoming(req.user._id, days);

  res.json({
    success: true,
    data: events
  });
}));

// @desc    Get events for a specific date
// @route   GET /api/calendar/date/:date
// @access  Private
router.get('/date/:date', asyncHandler(async (req, res) => {
  const date = new Date(req.params.date);
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const events = await CalendarEvent.find({
    $or: [
      { organizer: req.user._id },
      { 'attendees.user': req.user._id }
    ],
    $and: [
      { startDate: { $lte: endOfDay } },
      { endDate: { $gte: startOfDay } }
    ],
    isActive: true
  })
  .populate('organizer', 'name email')
  .populate('attendees.user', 'name email')
  .sort({ startDate: 1 });

  res.json({
    success: true,
    data: events
  });
}));

// @desc    Update event status
// @route   PUT /api/calendar/:id/status
// @access  Private
router.put('/:id/status', validateObjectId('id'), asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['scheduled', 'completed', 'cancelled', 'rescheduled'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Valid status is required'
    });
  }

  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Calendar event not found'
    });
  }

  // Only organizer can update status
  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Only the organizer can update event status'
    });
  }

  event.status = status;
  await event.save();

  res.json({
    success: true,
    message: 'Event status updated successfully',
    data: event
  });
}));

// @desc    Update attendee response
// @route   PUT /api/calendar/:id/attendee-response
// @access  Private
router.put('/:id/attendee-response', validateObjectId('id'), asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['pending', 'accepted', 'declined', 'tentative'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Valid response status is required'
    });
  }

  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Calendar event not found'
    });
  }

  // Find the attendee record for the current user
  const attendeeIndex = event.attendees.findIndex(
    attendee => attendee.user && attendee.user.toString() === req.user._id.toString()
  );

  if (attendeeIndex === -1) {
    return res.status(403).json({
      success: false,
      message: 'You are not an attendee of this event'
    });
  }

  event.attendees[attendeeIndex].status = status;
  await event.save();

  res.json({
    success: true,
    message: 'Response updated successfully',
    data: event.attendees[attendeeIndex]
  });
}));

// @desc    Add attendee to event
// @route   POST /api/calendar/:id/attendees
// @access  Private
router.post('/:id/attendees', validateObjectId('id'), asyncHandler(async (req, res) => {
  const { userId, email, name } = req.body;

  if (!userId && !email) {
    return res.status(400).json({
      success: false,
      message: 'Either userId or email is required'
    });
  }

  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Calendar event not found'
    });
  }

  // Only organizer can add attendees
  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Only the organizer can add attendees'
    });
  }

  // Check if attendee already exists
  const existingAttendee = event.attendees.find(attendee => 
    (userId && attendee.user && attendee.user.toString() === userId) ||
    (email && attendee.email === email)
  );

  if (existingAttendee) {
    return res.status(400).json({
      success: false,
      message: 'Attendee already exists'
    });
  }

  const newAttendee = {
    user: userId || null,
    email: email || null,
    name: name || null,
    status: 'pending'
  };

  event.attendees.push(newAttendee);
  await event.save();
  await event.populate('attendees.user', 'name email');

  res.json({
    success: true,
    message: 'Attendee added successfully',
    data: event.attendees[event.attendees.length - 1]
  });
}));

// @desc    Get calendar statistics
// @route   GET /api/calendar/stats
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totalEvents = await CalendarEvent.countDocuments({
    $or: [
      { organizer: userId },
      { 'attendees.user': userId }
    ],
    isActive: true
  });

  const upcomingEvents = await CalendarEvent.countDocuments({
    $or: [
      { organizer: userId },
      { 'attendees.user': userId }
    ],
    startDate: { $gte: new Date() },
    status: 'scheduled',
    isActive: true
  });

  const todayEvents = await CalendarEvent.countDocuments({
    $or: [
      { organizer: userId },
      { 'attendees.user': userId }
    ],
    startDate: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lt: new Date(new Date().setHours(23, 59, 59, 999))
    },
    isActive: true
  });

  const typeStats = await CalendarEvent.aggregate([
    {
      $match: {
        $or: [
          { organizer: userId },
          { 'attendees.user': userId }
        ],
        isActive: true
      }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      totalEvents,
      upcomingEvents,
      todayEvents,
      typeDistribution: typeStats
    }
  });
}));

export default router;