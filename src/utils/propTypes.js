/**
 * Common PropTypes definitions for the CRM application
 */
import PropTypes from 'prop-types';

// User object shape
export const UserPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  role: PropTypes.oneOf(['admin', 'user', 'recruiter']).isRequired,
  dashboardType: PropTypes.oneOf(['crm', 'recruiter']),
  isDemo: PropTypes.bool
});

// Contact object shape
export const ContactPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string,
  company: PropTypes.string,
  position: PropTypes.string,
  status: PropTypes.oneOf(['active', 'inactive', 'pending']),
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
});

// Deal object shape
export const DealPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  stage: PropTypes.string.isRequired,
  probability: PropTypes.number,
  expectedCloseDate: PropTypes.string,
  contactId: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
});

// Candidate object shape
export const CandidatePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string,
  position: PropTypes.string,
  experience: PropTypes.string,
  skills: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.oneOf(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']),
  resumeUrl: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
});

// Metric object shape
export const MetricPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.shape({
    value: PropTypes.number,
    isPositive: PropTypes.bool,
    period: PropTypes.string
  }),
  icon: PropTypes.elementType,
  color: PropTypes.oneOf(['blue', 'green', 'amber', 'purple', 'red']),
  description: PropTypes.string,
  loading: PropTypes.bool
});

// Toast notification shape
export const ToastPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  message: PropTypes.string.isRequired,
  duration: PropTypes.number
});

// Common component props
export const LoadingPropType = PropTypes.bool;
export const ClassNamePropType = PropTypes.string;
export const ChildrenPropType = PropTypes.node;
export const OnClickPropType = PropTypes.func;

// Form validation shapes
export const ValidationErrorPropType = PropTypes.shape({
  field: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
});

export const FormStatePropType = PropTypes.shape({
  isSubmitting: PropTypes.bool,
  errors: PropTypes.arrayOf(ValidationErrorPropType),
  touched: PropTypes.objectOf(PropTypes.bool),
  values: PropTypes.object
});