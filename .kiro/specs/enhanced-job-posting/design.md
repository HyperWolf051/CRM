# Design Document

## Overview

This design document outlines the technical approach for enhancing the Add Post Job functionality by moving it from a modal/inline implementation to a dedicated page with comprehensive features including file uploads, preview functionality, enhanced validation, and improved accessibility. The solution will integrate seamlessly with the existing CRM frontend while providing a superior user experience for job posting.

## Architecture

### Route Structure
```
/jobs/new - New dedicated job posting page
/jobs     - Existing jobs list page (updated to navigate to /jobs/new)
```

### Component Hierarchy
```
JobPostingPage
├── JobPostingHeader (Back button, page title)
├── JobPostingForm
│   ├── BasicInfoSection (title, company, location, employment type)
│   ├── CompensationSection (salary range, benefits)
│   ├── JobDetailsSection (description, requirements, skills)
│   ├── AttachmentsSection (file upload with drag-and-drop)
│   └── FormActions (Preview, Submit buttons)
├── JobPreviewModal (preview functionality)
├── SuccessToast (success notifications)
└── ErrorBanner (error handling)
```

### State Management
- **Form State**: React Hook Form for form management and validation
- **File Upload State**: Custom hook for file management
- **Navigation State**: React Router for routing and navigation
- **Toast State**: Context provider for global toast notifications
- **Error State**: Local state for error handling and display

## Components and Interfaces

### 1. JobPostingPage Component
**Purpose**: Main container component for the job posting page
**Props**: None (route-based)
**State**: 
- Form data management
- Loading states
- Error handling
- Navigation confirmation for unsaved changes

```typescript
interface JobPostingPageProps {}

interface JobFormData {
  title: string;
  company: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  salaryMin?: number;
  salaryMax?: number;
  salaryType: 'range' | 'exact' | 'negotiable';
  description: string;
  requirements: string;
  skills: string[];
  benefits?: string;
  attachments: File[];
  isRemote: boolean;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
}
```

### 2. JobPostingHeader Component
**Purpose**: Page header with navigation and title
**Props**: 
- `onBack`: Function to handle back navigation
- `hasUnsavedChanges`: Boolean to trigger confirmation dialog

```typescript
interface JobPostingHeaderProps {
  onBack: () => void;
  hasUnsavedChanges: boolean;
  title?: string;
}
```

### 3. JobPostingForm Component
**Purpose**: Main form container with validation and submission
**Props**:
- `onSubmit`: Form submission handler
- `onPreview`: Preview trigger handler
- `initialData`: Optional initial form data

```typescript
interface JobPostingFormProps {
  onSubmit: (data: JobFormData) => Promise<void>;
  onPreview: (data: JobFormData) => void;
  initialData?: Partial<JobFormData>;
  isSubmitting?: boolean;
}
```

### 4. Form Section Components

#### BasicInfoSection
**Purpose**: Job title, company, location, employment type
**Features**:
- Auto-focus on job title field
- Real-time validation
- Employment type dropdown
- Remote work toggle

#### CompensationSection  
**Purpose**: Salary information and benefits
**Features**:
- Salary range or exact amount input
- Currency formatting
- Benefits text area

#### JobDetailsSection
**Purpose**: Job description, requirements, and skills
**Features**:
- Rich text editor for description
- Skills tag input with autocomplete
- Requirements text area

#### AttachmentsSection
**Purpose**: File upload functionality
**Features**:
- Drag-and-drop file upload
- File type validation (PDF, DOC, DOCX, TXT)
- File size validation (10MB per file, 50MB total)
- Progress indicators
- File removal functionality

```typescript
interface AttachmentsSectionProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFileSize: number;
  maxTotalSize: number;
  allowedTypes: string[];
}
```

### 5. JobPreviewModal Component
**Purpose**: Preview job posting before submission
**Props**:
- `isOpen`: Modal visibility state
- `jobData`: Form data to preview
- `onClose`: Close modal handler
- `onEdit`: Return to edit handler
- `onPublish`: Publish job handler

```typescript
interface JobPreviewModalProps {
  isOpen: boolean;
  jobData: JobFormData;
  onClose: () => void;
  onEdit: () => void;
  onPublish: () => void;
}
```

### 6. Toast and Error Components

#### SuccessToast
**Purpose**: Success notifications with animations
**Features**:
- Slide-in animation
- Auto-dismiss after 5 seconds
- Action buttons (View Job, Dismiss)

#### ErrorBanner
**Purpose**: Error display and retry functionality
**Features**:
- Dismissible error messages
- Retry button for network errors
- Field-specific error mapping

## Data Models

### Job Posting Data Model
```typescript
interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: EmploymentType;
  salary: {
    min?: number;
    max?: number;
    type: 'range' | 'exact' | 'negotiable';
    currency: string;
  };
  description: string;
  requirements: string;
  skills: string[];
  benefits?: string;
  isRemote: boolean;
  experienceLevel: ExperienceLevel;
  attachments: JobAttachment[];
  status: 'draft' | 'published' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface JobAttachment {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
}

type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';
```

### Form Validation Schema
```typescript
const jobPostingSchema = {
  title: {
    required: 'Job title is required',
    minLength: { value: 3, message: 'Title must be at least 3 characters' },
    maxLength: { value: 100, message: 'Title must be less than 100 characters' }
  },
  company: {
    required: 'Company name is required',
    minLength: { value: 2, message: 'Company name must be at least 2 characters' }
  },
  location: {
    required: 'Location is required'
  },
  description: {
    required: 'Job description is required',
    minLength: { value: 50, message: 'Description must be at least 50 characters' }
  },
  requirements: {
    required: 'Job requirements are required',
    minLength: { value: 20, message: 'Requirements must be at least 20 characters' }
  },
  skills: {
    validate: (value: string[]) => value.length > 0 || 'At least one skill is required'
  }
};
```

## Error Handling

### Client-Side Validation
- **Real-time validation**: Validate fields on blur and change
- **Form submission validation**: Comprehensive validation before API call
- **File validation**: Size, type, and count validation for uploads
- **Accessibility**: ARIA live regions for error announcements

### Server-Side Error Handling
- **API Error Mapping**: Map server validation errors to form fields
- **Network Error Handling**: Retry mechanisms for network failures
- **File Upload Errors**: Specific error messages for upload failures
- **Generic Error Fallback**: User-friendly messages for unexpected errors

### Error Display Strategy
```typescript
interface ErrorState {
  type: 'field' | 'form' | 'network' | 'server';
  message: string;
  field?: string;
  retryable: boolean;
  details?: any;
}

// Error Banner Component
const ErrorBanner = ({ error, onRetry, onDismiss }) => {
  return (
    <div className="error-banner" role="alert" aria-live="polite">
      <ErrorIcon />
      <div>
        <h4>{error.message}</h4>
        {error.retryable && (
          <button onClick={onRetry}>Try Again</button>
        )}
      </div>
      <button onClick={onDismiss} aria-label="Dismiss error">×</button>
    </div>
  );
};
```

## Testing Strategy

### Unit Tests
- **Form Validation**: Test all validation rules and error messages
- **File Upload Logic**: Test file validation, size limits, and error handling
- **Component Rendering**: Test component props and state management
- **Utility Functions**: Test helper functions for formatting and validation

### Integration Tests
- **Routing**: Test navigation between Jobs list and job posting page
- **Form Submission**: Test complete form submission workflow
- **API Integration**: Test API calls and response handling
- **File Upload Integration**: Test file upload API integration

### Accessibility Tests
- **Keyboard Navigation**: Test tab order and keyboard interactions
- **Screen Reader**: Test ARIA labels and announcements
- **Focus Management**: Test focus behavior on page load and navigation
- **Color Contrast**: Verify WCAG compliance for all UI elements

### Visual Tests
- **Component Snapshots**: Visual regression tests for all components
- **Responsive Design**: Test layouts across different screen sizes
- **Animation Testing**: Test smooth transitions and loading states
- **Cross-browser**: Test compatibility across major browsers

### End-to-End Tests
```typescript
// Example E2E test scenarios
describe('Job Posting Workflow', () => {
  test('Complete job posting creation', async () => {
    // Navigate to job posting page
    // Fill out form with valid data
    // Upload attachments
    // Preview job posting
    // Submit and verify success
    // Verify redirect to jobs list
    // Verify success toast
    // Verify new job appears in list
  });

  test('Form validation and error handling', async () => {
    // Navigate to job posting page
    // Submit empty form
    // Verify validation errors
    // Fill invalid data
    // Verify specific error messages
    // Correct errors and submit successfully
  });

  test('Back navigation with unsaved changes', async () => {
    // Navigate to job posting page
    // Fill partial form data
    // Click back button
    // Verify confirmation dialog
    // Test both confirm and cancel options
  });
});
```

## Performance Considerations

### Code Splitting
- **Lazy Loading**: Load job posting page components on demand
- **Dynamic Imports**: Split large dependencies (rich text editor, file upload)
- **Bundle Optimization**: Separate vendor and application bundles

### File Upload Optimization
- **Chunked Upload**: Large files uploaded in chunks
- **Progress Tracking**: Real-time upload progress indicators
- **Concurrent Uploads**: Multiple files uploaded simultaneously
- **Error Recovery**: Resume failed uploads

### Form Performance
- **Debounced Validation**: Prevent excessive validation calls
- **Memoized Components**: Optimize re-renders with React.memo
- **Virtual Scrolling**: For large skill lists or dropdowns
- **Optimistic Updates**: Immediate UI feedback before API confirmation

## Security Considerations

### File Upload Security
- **File Type Validation**: Server-side MIME type verification
- **Virus Scanning**: Integrate with antivirus scanning service
- **Size Limits**: Enforce strict file size limits
- **Sanitization**: Clean file names and metadata

### Form Security
- **Input Sanitization**: Sanitize all text inputs
- **XSS Prevention**: Escape user-generated content
- **CSRF Protection**: Include CSRF tokens in API calls
- **Rate Limiting**: Prevent form submission abuse

### Data Privacy
- **Sensitive Data**: Encrypt sensitive job posting data
- **Access Control**: Verify user permissions for job creation
- **Audit Logging**: Log job posting creation and modifications
- **Data Retention**: Implement data retention policies

## Implementation Phases

### Phase 1: Core Infrastructure
1. Set up new route and basic page structure
2. Implement form components with basic validation
3. Add navigation and back button functionality
4. Integrate with existing design system

### Phase 2: Enhanced Features
1. Implement file upload functionality
2. Add job preview modal
3. Enhance form validation and error handling
4. Add success/error toast notifications

### Phase 3: Polish and Testing
1. Implement animations and micro-interactions
2. Add comprehensive accessibility features
3. Write unit and integration tests
4. Performance optimization and code splitting

### Phase 4: Advanced Features
1. Rich text editor for job descriptions
2. Advanced skill tagging system
3. Job template functionality
4. Analytics and tracking integration

This design provides a comprehensive foundation for implementing the enhanced job posting functionality while maintaining consistency with the existing CRM system and ensuring a superior user experience.