import { body, param, query, validationResult } from 'express-validator';

// Middleware to handle validation results
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Common validation rules
export const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address');

export const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long');

export const validateName = body('name')
  .trim()
  .isLength({ min: 2, max: 100 })
  .withMessage('Name must be between 2 and 100 characters')
  .matches(/^[a-zA-Z\s\-\.\']+$/)
  .withMessage('Name can only contain letters, spaces, hyphens, dots, and apostrophes');

export const validateObjectId = (field) => 
  param(field)
    .isMongoId()
    .withMessage(`Invalid ${field} ID format`);

export const validateOptionalObjectId = (field) =>
  body(field)
    .optional()
    .isMongoId()
    .withMessage(`Invalid ${field} ID format`);

// User validation rules
export const validateUserRegistration = [
  validateName,
  validateEmail,
  validatePassword,
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'user'])
    .withMessage('Role must be admin, manager, or user'),
  handleValidationErrors
];

export const validateUserLogin = [
  validateEmail,
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'user'])
    .withMessage('Role must be admin, manager, or user'),
  handleValidationErrors
];

// Contact validation rules
export const validateContactCreation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters'),
  validateEmail,
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  validateOptionalObjectId('company'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'prospect', 'customer', 'lead'])
    .withMessage('Invalid status'),
  body('source')
    .optional()
    .isIn(['website', 'referral', 'social_media', 'email_campaign', 'cold_call', 'event', 'other'])
    .withMessage('Invalid source'),
  handleValidationErrors
];

// Deal validation rules
export const validateDealCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Deal title is required and must be less than 200 characters'),
  body('value')
    .isNumeric({ min: 0 })
    .withMessage('Deal value must be a positive number'),
  body('stage')
    .optional()
    .isIn(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'])
    .withMessage('Invalid deal stage'),
  body('probability')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Probability must be between 0 and 100'),
  body('expectedCloseDate')
    .isISO8601()
    .withMessage('Expected close date must be a valid date'),
  validateOptionalObjectId('contact'),
  validateOptionalObjectId('company'),
  handleValidationErrors
];

// Company validation rules
export const validateCompanyCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Company name is required and must be less than 200 characters'),
  body('industry')
    .optional()
    .isIn([
      'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
      'Retail', 'Real Estate', 'Consulting', 'Marketing', 'Legal',
      'Non-profit', 'Government', 'Entertainment', 'Food & Beverage',
      'Transportation', 'Energy', 'Construction', 'Other'
    ])
    .withMessage('Invalid industry'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  handleValidationErrors
];

// Calendar event validation rules
export const validateCalendarEventCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Event title is required and must be less than 200 characters'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('type')
    .optional()
    .isIn(['meeting', 'call', 'task', 'reminder', 'follow_up', 'demo', 'other'])
    .withMessage('Invalid event type'),
  handleValidationErrors
];

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];