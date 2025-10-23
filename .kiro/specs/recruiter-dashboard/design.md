# Design Document

## Overview

The Multi-Sector CRM is a comprehensive web application designed as a flexible business management system with recruitment as the primary sector focus. The system supports multiple business sectors through configurable layouts and data models, with the recruitment dashboard serving as the main interface for recruitment agencies and HR departments.

The application integrates with existing authentication systems and provides sector-specific interfaces while maintaining a unified data management approach. The recruitment sector includes candidate management, placement tracking, salary negotiations, and agency fee management based on real-world CSV data structures.

The design follows a professional white theme with modern business aesthetics, featuring a clean, minimalist interface that works seamlessly across desktop and mobile devices. The interface emphasizes data visualization, efficient workflow management, and intuitive user interactions with subtle shadows, clean typography, and strategic use of color for status indicators and branding.

## Architecture

### Multi-Sector Architecture
- **Sector Management**: Configurable business sector modules (Recruitment, Sales, Real Estate, etc.)
- **Authentication**: Leverages existing demo API authentication system
- **Routing**: Dynamic routing based on sector selection (`/app/{sector}` routes)
- **Layout**: Adaptive DashboardLayout with sector-specific navigation and branding
- **State Management**: React hooks with sector-aware state management
- **API Integration**: Unified API structure with sector-specific endpoints

### Data Import & Management
- **CSV Import**: Native support for CSV file uploads and parsing
- **Data Mapping**: Flexible field mapping for different CSV structures
- **Bulk Operations**: Import, export, and bulk edit capabilities
- **Data Validation**: Real-time validation during import process
- **Format Support**: CSV, Excel, JSON import/export formats

### Technology Stack
- **Frontend**: React 18+ with functional components and hooks
- **Styling**: Tailwind CSS (existing configuration)
- **Icons**: Lucide React (already installed)
- **Charts**: Custom chart components (extending existing Chart.jsx)
- **Routing**: React Router DOM (existing setup)

### Data Flow
```
User Authentication → Dashboard Layout → Recruiter Routes → Page Components → API Calls → State Updates → UI Rendering
```

## Components and Interfaces

### 1. Layout Components

#### RecruiterSidebar
- Clean white background with subtle shadow (240px width, collapsible on mobile)
- Company logo at top with proper branding
- Navigation items: Dashboard, Candidates, Jobs, Calendar, Analytics, Settings
- Active state highlighting with primary blue accent color
- User profile section at bottom with avatar and name
- Smooth hover effects and transitions
- Mobile: Collapses to hamburger menu with overlay

#### RecruiterTopbar
- Fixed header with white background and subtle bottom border
- Search bar with autocomplete functionality (candidates, jobs)
- Notification bell icon with badge count
- Quick actions dropdown (+ New Candidate, + New Job)
- User profile dropdown with avatar
- Breadcrumb navigation for current page context
- Responsive design with mobile-optimized layout

### 2. Dashboard Components

#### MetricCard
```jsx
interface MetricCardProps {
  title: string;
  value: number;
  trend: {
    value: number;
    direction: 'up' | 'down';
    period: string;
  };
  icon: LucideIcon;
  sparklineData?: number[];
  color: string;
  description?: string;
}
```

**Design Specifications:**
- White background with subtle shadow and rounded corners
- Colored accent border (left border) matching the metric type
- Icon with matching color theme
- Large number display with trend indicator
- Mini sparkline chart for visual data representation
- Hover effects with slight elevation increase

#### PipelineChart
```jsx
interface PipelineChartProps {
  data: {
    stage: string;
    count: number;
    color: string;
    conversionRate?: number;
  }[];
  orientation: 'horizontal' | 'vertical';
  showConversionRates: boolean;
}
```

**Design Specifications:**
- Horizontal bar chart or funnel visualization
- Stages: Applied → Screening → Interview → Offer → Hired
- Color coding: Blue (Applied), Purple (Screening), Amber (Interview), Cyan (Offer), Green (Hired)
- Conversion rates displayed between stages
- Interactive hover states with detailed tooltips
- Clean, minimal design with proper spacing

#### CandidateTable
```jsx
interface CandidateTableProps {
  candidates: Candidate[];
  onViewCandidate: (id: string) => void;
  onScheduleInterview: (id: string) => void;
  onSendEmail: (id: string) => void;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}
```

#### InterviewWidget
```jsx
interface InterviewWidgetProps {
  interviews: Interview[];
  onJoinInterview: (id: string) => void;
  onReschedule: (id: string) => void;
  maxItems: number;
}
```

### 3. Candidate Management Components

#### CandidateFilters
```jsx
interface CandidateFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  availablePositions: string[];
  availableSkills: string[];
}
```

#### CandidateCard
```jsx
interface CandidateCardProps {
  candidate: Candidate;
  onView: () => void;
  onScheduleInterview: () => void;
  onSendEmail: () => void;
  showQuickActions: boolean;
}
```

#### CandidateDetailModal
```jsx
interface CandidateDetailModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (status: CandidateStatus) => void;
  onAddNote: (note: string) => void;
}
```

### 4. Job Management Components

#### JobCard
```jsx
interface JobCardProps {
  job: Job;
  onEdit: () => void;
  onView: () => void;
  onClose: () => void;
  applicantCount: number;
  pipelineBreakdown: PipelineStage[];
}
```

#### JobForm
```jsx
interface JobFormProps {
  job?: Job;
  onSubmit: (jobData: JobFormData) => void;
  onCancel: () => void;
  isEditing: boolean;
}
```

### 5. Analytics Components

#### AnalyticsChart
```jsx
interface AnalyticsChartProps {
  type: 'line' | 'bar' | 'pie' | 'donut' | 'funnel';
  data: ChartData;
  title: string;
  timeRange: TimeRange;
  exportable: boolean;
}
```

#### TimeRangeSelector
```jsx
interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  customRangeEnabled: boolean;
}
```

### 6. Calendar Components

#### RecruiterCalendar
```jsx
interface RecruiterCalendarProps {
  view: 'month' | 'week' | 'day';
  interviews: Interview[];
  onViewChange: (view: CalendarView) => void;
  onInterviewClick: (interview: Interview) => void;
  onReschedule: (interviewId: string, newDate: Date) => void;
}
```

### 7. Data Import Components

#### CSVImportModal
```jsx
interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[], mapping: FieldMapping) => void;
  sector: BusinessSector;
  expectedFields: string[];
}
```

#### FieldMappingComponent
```jsx
interface FieldMappingProps {
  csvHeaders: string[];
  targetFields: string[];
  onMappingChange: (mapping: FieldMapping) => void;
  previewData: any[];
}
```

#### BulkActionsPanel
```jsx
interface BulkActionsPanelProps {
  selectedItems: string[];
  onBulkEdit: (updates: Partial<Candidate>) => void;
  onBulkDelete: () => void;
  onBulkExport: (format: 'csv' | 'excel' | 'pdf') => void;
  totalSelected: number;
}
```

### 8. Multi-Sector Components

#### SectorSelector
```jsx
interface SectorSelectorProps {
  currentSector: BusinessSector;
  availableSectors: BusinessSector[];
  onSectorChange: (sector: BusinessSector) => void;
  userPermissions: SectorPermissions;
}
```

#### AdaptiveNavigation
```jsx
interface AdaptiveNavigationProps {
  sector: BusinessSector;
  navigationItems: NavigationItem[];
  userRole: UserRole;
  onNavigate: (path: string) => void;
}
```

## Data Models

### Complete Recruitment Workflow (Based on CSV Analysis)

The system supports a complete 7-stage recruitment workflow:

1. **Registration** → 2. **Resume Sharing** → 3. **Shortlisting** → 4. **Lineup/Feedback** → 5. **Selection** → 6. **Closure** → 7. **Reporting**

### Core Entities

#### Candidate (Based on CSV Data Structure)
```typescript
interface Candidate {
  id: string;
  cvNo: string; // CV number from registration
  
  // Core Information (from registrationdata.csv)
  name: string;
  phone: string;
  email: string;
  location: string; // City, State
  interestedFor: string; // Position interested in
  declaration?: string;
  currentCompany?: string;
  industry?: string;
  designation: string;
  totalExperience: string;
  lastSalary: string; // e.g., "5K"
  salaryExpectation: string; // e.g., "10K"
  qualification: string;
  allocation: string; // Sheet assignment (e.g., "Sheet-6")
  
  // Registration Details
  registration: {
    date: Date;
    resource: string; // e.g., "Naukari", "LinkedIn"
    registrationStatus: 'Yes' | 'No';
    registrationAmount?: number;
  };
  
  // Resume Sharing (resumeshare.csv)
  resumeSharing: {
    shortlistsForClient?: string;
    resumeShareStatus: 'Done' | 'Pending';
    remark?: string;
  };
  
  // Shortlisting (shortlist.csv)
  shortlisting: {
    shortlistDate?: Date;
    shortlistsForClient?: string;
    resource?: string;
    shortlistStatus: 'Done' | 'Pending';
  };
  
  // Lineup & Feedback (lineupfeedback.csv)
  lineupFeedback: {
    shortlistDate?: Date;
    clientName?: string;
    feedbacks: ClientFeedback[];
    scheduledDates: Date[];
    lineupStatus: 'Done' | 'Pending';
  };
  
  // Selection (selection.csv)
  selection: {
    client?: string;
    selectionDate?: Date;
    selectionStatus?: 'Selected' | 'Rejected' | 'Pending';
  };
  
  // Closure (closernew.csv)
  closure: {
    joiningDate?: Date;
    placedIn?: string; // Company placed in
    offeredSalary?: number;
    charges?: number; // Agency fees/commission
    joiningStatus?: 'Yes' | 'No';
  };
  
  // Current Status
  currentStage: RecruitmentStage;
  overallStatus: CandidateStatus;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

interface ClientFeedback {
  feedbackNumber: number; // 1, 2, 3
  clientName: string;
  feedback: 'Selected' | 'Rejected' | 'Hold' | 'Joined' | 'Pending';
  scheduledDate?: Date;
}

type RecruitmentStage = 
  | 'registration' 
  | 'resume-sharing' 
  | 'shortlisting' 
  | 'lineup-feedback' 
  | 'selection' 
  | 'closure' 
  | 'completed';

type CandidateStatus = 
  | 'new' 
  | 'in-process' 
  | 'shortlisted' 
  | 'interviewed' 
  | 'selected' 
  | 'placed' 
  | 'rejected';
```

#### DailyReport (Based on reports.csv)
```typescript
interface DailyReport {
  id: string;
  date: Date;
  teamMember: string; // e.g., "Deep", "TEAM ALPHA"
  
  // Login/Logout tracking
  loginTime?: string;
  logoutTime?: string;
  
  // Daily lineup (interviews scheduled)
  todaysLineup: LineupEntry[];
  
  // Next day planning
  nextDayLineup: LineupEntry[];
  
  // Hot requirements (active job openings)
  hotRequirements: string[];
  
  // Daily tasks and completion status
  tasks: DailyTask[];
  
  // Shortlisted candidates
  shortlisted: ShortlistedEntry[];
  
  // Conversion metrics
  conversionReport: {
    callDuration: string; // e.g., "167calls // 2hrs 5min 25s"
    todaysLineups: number;
    nextDayLineups: number;
    registration: number;
    profilesMail: number;
    prospect: number;
    closure: number;
    googleReviews?: string;
    creativePosting?: boolean;
  };
}

interface LineupEntry {
  serialNo: number;
  client: string;
  candidateName: string;
  position: string;
  salary: string;
  feedback?: string;
  mailSent?: boolean;
  interviewSheet?: boolean;
  remark?: string;
}

interface DailyTask {
  task: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface ShortlistedEntry {
  serialNo: number;
  client: string;
  candidateName: string;
  position: string;
}
```

#### Job
```typescript
interface Job {
  id: string;
  title: string;
  client: string; // Client company name
  department?: string;
  location: {
    type: 'remote' | 'hybrid' | 'onsite';
    city?: string;
    country?: string;
  };
  employment: {
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    experienceLevel: 'junior' | 'mid' | 'senior' | 'lead';
  };
  description?: string;
  requirements: {
    skills?: string[];
    experience?: string;
    education?: string;
  };
  compensation: {
    salaryRange?: {
      min: number;
      max: number;
      currency: string;
    };
    benefits?: string[];
  };
  status: 'hot-requirement' | 'active' | 'paused' | 'closed';
  applicants: {
    total: number;
    pipeline: PipelineBreakdown;
  };
  postedDate: Date;
  closingDate?: Date;
  createdBy: string;
}
```

#### Interview
```typescript
interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  type: 'phone' | 'video' | 'in-person';
  scheduledDate: Date;
  duration: number;
  interviewer: {
    id: string;
    name: string;
    email: string;
  };
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  meetingLink?: string;
  location?: string;
  notes?: string;
  feedback?: InterviewFeedback;
}
```

### Supporting Types

#### CandidateStatus
```typescript
type CandidateStatus = 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
```

#### PipelineStage
```typescript
interface PipelineStage {
  name: string;
  count: number;
  color: string;
  conversionRate?: number;
}
```

### Multi-Sector Types

#### BusinessSector
```typescript
interface BusinessSector {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  primaryColor: string;
  routes: SectorRoute[];
  dataModels: DataModel[];
  permissions: SectorPermissions;
}

type SectorType = 'recruitment' | 'sales' | 'real-estate' | 'healthcare' | 'education';
```

#### CSV Import Types
```typescript
interface CSVImportConfig {
  sector: SectorType;
  requiredFields: string[];
  optionalFields: string[];
  fieldValidation: Record<string, ValidationRule>;
  defaultMapping: Record<string, string>;
}

interface FieldMapping {
  csvField: string;
  targetField: string;
  transformation?: (value: any) => any;
  validation?: ValidationRule;
}

interface ImportResult {
  successful: number;
  failed: number;
  errors: ImportError[];
  data: any[];
}
```

#### Recruitment-Specific Types (from CSV)
```typescript
interface RecruitmentCandidate {
  // Direct CSV mapping
  joiningDate: Date;
  allocation: string; // Sheet-6, etc.
  name: string;
  phone: string;
  email: string;
  lastSalary: string | number; // "5K", etc.
  placedIn?: string;
  designation?: string;
  offeredSalary?: number;
  charges?: number;
  
  // Extended fields
  id: string;
  status: 'active' | 'placed' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

### Error Boundaries
- Implement React Error Boundaries for graceful error handling
- Separate error boundaries for different sections (Dashboard, Candidates, Jobs, etc.)
- Fallback UI components for each error boundary

### API Error Handling
```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
}

interface ErrorHandlingStrategy {
  retry: boolean;
  maxRetries: number;
  fallbackData?: any;
  userMessage: string;
}
```

### Validation
- Form validation using custom validation utilities
- Real-time validation feedback
- Server-side validation error handling
- File upload validation (resume, documents)

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing for custom hooks
- Utility function testing
- Mock API responses for isolated testing

### Integration Testing
- User workflow testing (candidate application process)
- API integration testing
- Form submission and validation testing
- Navigation and routing testing

### Accessibility Testing
- WCAG 2.1 AA compliance testing
- Keyboard navigation testing
- Screen reader compatibility
- Color contrast validation
- Focus management testing

### Performance Testing
- Component rendering performance
- Large dataset handling (1000+ candidates)
- Chart rendering performance
- Mobile device performance
- Bundle size optimization

## UI/UX Design Specifications

### Color Palette
```css
/* Primary Colors - Professional Blue */
--primary-50: #f0f9ff;
--primary-100: #e0f2fe;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Status Colors */
--success: #10b981;    /* Green for hired/success */
--warning: #f59e0b;    /* Amber for pending/interview */
--danger: #ef4444;     /* Red for rejected/error */
--info: #06b6d4;       /* Cyan for offers */
--purple: #8b5cf6;     /* Purple for screening */

/* Background & Surface Colors */
--white: #ffffff;
--gray-50: #f9fafb;    /* Light background */
--gray-100: #f3f4f6;   /* Card backgrounds */
--gray-200: #e5e7eb;   /* Borders */
--gray-300: #d1d5db;   /* Dividers */
--gray-400: #9ca3af;   /* Placeholder text */
--gray-500: #6b7280;   /* Secondary text */
--gray-600: #4b5563;   /* Primary text */
--gray-900: #111827;   /* Headings */

/* Glassmorphism Effects */
--glass-bg: rgba(255, 255, 255, 0.8);
--glass-border: rgba(255, 255, 255, 0.2);
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

### Typography
- Font Family: Poppins (existing)
- Heading Scale: 2xl, xl, lg for page titles and section headers
- Body Text: base (16px) for primary content
- Small Text: sm (14px) for secondary information
- Micro Text: xs (12px) for labels and metadata

### Spacing System
- Base unit: 4px (0.25rem)
- Component padding: 16px (p-4) to 24px (p-6)
- Section margins: 24px (mb-6) to 32px (mb-8)
- Card spacing: 16px (p-4) internal padding

### Interactive Elements
- Button heights: 40px (h-10) for primary, 36px (h-9) for secondary
- Input heights: 40px (h-10) with 12px (px-3) horizontal padding
- Hover states: 150ms transition duration
- Focus states: 2px blue ring with offset

### Status Badge System
```css
/* Status Badge Colors */
.status-new { background: #dbeafe; color: #1e40af; }      /* Blue */
.status-screening { background: #ede9fe; color: #7c3aed; } /* Purple */
.status-interview { background: #fef3c7; color: #d97706; } /* Amber */
.status-offer { background: #cffafe; color: #0891b2; }     /* Cyan */
.status-hired { background: #d1fae5; color: #059669; }     /* Green */
.status-rejected { background: #fee2e2; color: #dc2626; }  /* Red */
```

### Responsive Breakpoints
- Mobile: < 768px (stack layouts, full-width components, hamburger menu)
- Tablet: 768px - 1024px (2-column layouts, condensed sidebar)
- Desktop: > 1024px (3-4 column layouts, full sidebar navigation)

### Layout Specifications
- Sidebar: 240px width on desktop, overlay on mobile
- Top bar: 64px height, fixed position
- Main content: Proper padding and margins for readability
- Cards: Consistent 16px padding, 8px border radius
- Grid gaps: 24px between major sections, 16px between cards

### Animation Guidelines
- Micro-interactions: 150ms ease-out
- Page transitions: 300ms ease-in-out
- Chart animations: 1000ms ease-out with staggered delays
- Loading states: Skeleton loaders with shimmer effects

## Performance Considerations

### Code Splitting
- Lazy load page components
- Dynamic imports for heavy chart libraries
- Route-based code splitting

### Data Management
- Implement pagination for large datasets
- Virtual scrolling for candidate lists
- Debounced search inputs (300ms delay)
- Optimistic updates for better UX

### Caching Strategy
- Browser caching for static assets
- API response caching with TTL
- Local storage for user preferences
- Session storage for form data

### Bundle Optimization
- Tree shaking for unused code
- Image optimization and lazy loading
- CSS purging for unused styles
- Compression and minification

## Page-Specific Layouts

### Dashboard Overview Layout
```
┌─────────────────────────────────────────────────────────┐
│ [Metric Cards Grid - 4 columns]                        │
├─────────────────────────────────────────────────────────┤
│ [Pipeline Chart]          │ [Recent Candidates Table]   │
├─────────────────────────────────────────────────────────┤
│ [Upcoming Interviews]     │ [Activity Feed]             │
└─────────────────────────────────────────────────────────┘
```

### Candidates Page Layout
```
┌─────────────────────────────────────────────────────────┐
│ [Filters Panel] │ [Search & View Toggle] │ [Actions]    │
├─────────────────────────────────────────────────────────┤
│                 │ [Candidates Grid/List View]           │
│   [Filters]     │                                       │
│                 │ [Pagination]                          │
└─────────────────────────────────────────────────────────┘
```

### Jobs Page Layout
```
┌─────────────────────────────────────────────────────────┐
│ [Page Header] │ [+ New Job Button]                      │
├─────────────────────────────────────────────────────────┤
│ [Active Jobs Grid - 3 columns]                         │
│                                                         │
│ [Job Cards with Pipeline Breakdown]                     │
└─────────────────────────────────────────────────────────┘
```

### Data Management Page Layout
```
┌─────────────────────────────────────────────────────────┐
│ [Sector Selector] │ [Import CSV] │ [Export] │ [Bulk]    │
├─────────────────────────────────────────────────────────┤
│ [Search & Filters Panel]                               │
├─────────────────────────────────────────────────────────┤
│ [Data Table with Bulk Selection]                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ☐ Name        │ Phone      │ Email      │ Status   │ │
│ │ ☐ Tanishka N. │ 78982...   │ tanish...  │ Active   │ │
│ │ ☐ [More rows...]                                   │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ [Pagination] │ [Items per page] │ [Selected: X items]   │
└─────────────────────────────────────────────────────────┘
```

### CSV Import Modal Layout
```
┌─────────────────────────────────────────────────────────┐
│ Import CSV Data                                    [×]  │
├─────────────────────────────────────────────────────────┤
│ Step 1: Upload File                                     │
│ [Drag & Drop Area or Browse Button]                     │
├─────────────────────────────────────────────────────────┤
│ Step 2: Map Fields                                      │
│ CSV Column        →    Target Field                     │
│ "NAME"           →    [Name ▼]                         │
│ "PHONE"          →    [Phone ▼]                        │
│ "EMAIL"          →    [Email ▼]                        │
│ "LAST SALARY"    →    [Last Salary ▼]                 │
├─────────────────────────────────────────────────────────┤
│ Step 3: Preview (First 5 rows)                         │
│ [Data Preview Table]                                    │
├─────────────────────────────────────────────────────────┤
│ [Cancel] │ [Import X Records]                          │
└─────────────────────────────────────────────────────────┘
```

## Micro-Interactions & Animations

### Button Interactions
- Hover: Slight elevation (shadow increase) + color darkening
- Active: Scale down to 98% with quick spring back
- Loading: Spinner with disabled state

### Card Interactions
- Hover: Subtle elevation increase (2px shadow → 8px shadow)
- Click: Brief scale animation (100% → 98% → 100%)

### Form Interactions
- Focus: Blue ring with 2px offset
- Validation: Smooth color transitions for error/success states
- Auto-complete: Fade-in dropdown with staggered item animations

### Data Loading
- Skeleton loaders with shimmer effect
- Staggered animations for list items (50ms delay between items)
- Smooth transitions when data loads

## Accessibility Enhancements

### Keyboard Navigation
- Tab order follows logical flow
- Skip links for main content areas
- Arrow key navigation for data tables
- Enter/Space activation for custom controls

### Screen Reader Support
- Proper ARIA labels for all interactive elements
- Live regions for dynamic content updates
- Descriptive alt text for charts and graphs
- Status announcements for form submissions

### Color & Contrast
- WCAG AA compliant color contrast ratios (4.5:1 minimum)
- Color is not the only indicator of status (icons + text)
- High contrast mode support
- Reduced motion preferences respected

This design provides a comprehensive foundation for implementing the recruiter dashboard while maintaining consistency with the existing CRM system and ensuring scalability for future enhancements.