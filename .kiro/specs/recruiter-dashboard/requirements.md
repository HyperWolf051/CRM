# Requirements Document

## Introduction

This document outlines the requirements for a professional recruiter dashboard web application designed specifically for agents/employees. The dashboard will serve as a comprehensive tool for managing job candidates, tracking application pipelines, and monitoring recruitment metrics. This is separate from the existing admin dashboard for companies and will integrate with the current demo API and authentication system.

## Requirements

### Requirement 1

**User Story:** As a recruiter agent, I want to access a professional dashboard after logging in with demo credentials, so that I can manage my recruitment activities efficiently.

#### Acceptance Criteria

1. WHEN a user logs in with demo account credentials THEN the system SHALL redirect them to the recruiter dashboard
2. WHEN the dashboard loads THEN the system SHALL display a white theme modern interface with professional styling
3. WHEN the user accesses the dashboard THEN the system SHALL authenticate using the existing demo API
4. IF the user is not authenticated THEN the system SHALL redirect to the login page

### Requirement 2

**User Story:** As a recruiter agent, I want to view key recruitment metrics at a glance, so that I can quickly assess my performance and workload.

#### Acceptance Criteria

1. WHEN the dashboard loads THEN the system SHALL display four key metric cards showing total candidates, active jobs, interviews scheduled, and offers extended
2. WHEN displaying metrics THEN each card SHALL include an icon, metric value, label, and trend indicator
3. WHEN showing trend data THEN the system SHALL display percentage changes from the previous month
4. WHEN metrics are updated THEN the system SHALL show mini sparkline charts for visual representation

### Requirement 3

**User Story:** As a recruiter agent, I want to visualize the application pipeline, so that I can understand conversion rates and bottlenecks in my recruitment process.

#### Acceptance Criteria

1. WHEN viewing the dashboard THEN the system SHALL display an application pipeline chart showing stages: Applied, Screening, Interview, Offer, Hired
2. WHEN displaying pipeline data THEN the system SHALL show candidate counts for each stage
3. WHEN showing pipeline stages THEN the system SHALL use different colors for each stage
4. WHEN displaying conversion data THEN the system SHALL show conversion rates between stages

### Requirement 4

**User Story:** As a recruiter agent, I want to see recent candidates and upcoming interviews, so that I can prioritize my daily activities.

#### Acceptance Criteria

1. WHEN accessing the dashboard THEN the system SHALL display a table of the last 10 candidates with avatar, name, position, status, applied date, and rating
2. WHEN showing candidate status THEN the system SHALL use color-coded badges (New, Screening, Interview, Offer, Rejected, Hired)
3. WHEN displaying upcoming interviews THEN the system SHALL show the next 5 interviews with candidate name, position, date/time, and interview type
4. WHEN showing interview actions THEN the system SHALL provide Join/Reschedule buttons for each interview

### Requirement 5

**User Story:** As a recruiter agent, I want to manage candidates effectively, so that I can track their progress through the recruitment pipeline.

#### Acceptance Criteria

1. WHEN accessing the candidates page THEN the system SHALL provide filters for name, email, skills, status, position, experience level, location, and date range
2. WHEN viewing candidates THEN the system SHALL offer both grid and list view options
3. WHEN displaying candidate information THEN the system SHALL show avatar, name, current job title, position applied for, key skills, status badge, and rating
4. WHEN interacting with candidates THEN the system SHALL provide quick actions for viewing profile, scheduling interviews, and sending emails

### Requirement 6

**User Story:** As a recruiter agent, I want to view detailed candidate information, so that I can make informed decisions about their application.

#### Acceptance Criteria

1. WHEN viewing a candidate detail THEN the system SHALL display comprehensive information in a tabbed interface
2. WHEN accessing candidate profile THEN the system SHALL show contact information, resume download, summary, experience, education, skills, and certifications
3. WHEN viewing application details THEN the system SHALL display position applied for, application date, current stage, interview history, and uploaded documents
4. WHEN managing candidate interactions THEN the system SHALL provide functionality to add notes, schedule interviews, send emails, and update status

### Requirement 7

**User Story:** As a recruiter agent, I want to manage job postings, so that I can attract suitable candidates for open positions.

#### Acceptance Criteria

1. WHEN accessing the jobs page THEN the system SHALL display active jobs with title, department, location, applicant count, posted date, and status
2. WHEN creating a new job THEN the system SHALL provide a form with fields for title, department, location, employment type, experience level, description, skills, and salary range
3. WHEN managing jobs THEN the system SHALL allow editing, viewing, and closing of job postings
4. WHEN displaying job information THEN the system SHALL show pipeline breakdown of applicants for each job

### Requirement 8

**User Story:** As a recruiter agent, I want to view recruitment analytics, so that I can measure my performance and identify areas for improvement.

#### Acceptance Criteria

1. WHEN accessing analytics THEN the system SHALL provide time period selectors (Last 7 days, 30 days, 3 months, Custom)
2. WHEN viewing analytics THEN the system SHALL display charts for applications over time, candidate sources, time to hire, offer acceptance rate, top performing job posts, and interview-to-hire conversion
3. WHEN analyzing data THEN the system SHALL provide export functionality for CSV/PDF formats
4. WHEN displaying metrics THEN the system SHALL use appropriate chart types (line, pie, bar, donut, funnel) for different data

### Requirement 9

**User Story:** As a recruiter agent, I want to manage my interview schedule, so that I can efficiently coordinate meetings with candidates.

#### Acceptance Criteria

1. WHEN accessing the calendar THEN the system SHALL provide month, week, and day view options
2. WHEN viewing interviews THEN the system SHALL use color-coding for different interview types
3. WHEN managing schedule THEN the system SHALL support drag-and-drop rescheduling
4. WHEN interacting with calendar events THEN the system SHALL allow clicking to view interview details and filtering by interviewer or position

### Requirement 10

**User Story:** As a recruiter agent, I want a responsive and accessible interface, so that I can use the dashboard effectively on any device.

#### Acceptance Criteria

1. WHEN using mobile devices THEN the system SHALL collapse the sidebar to a hamburger menu
2. WHEN viewing on small screens THEN the system SHALL stack cards vertically and make tables scrollable
3. WHEN interacting on touch devices THEN the system SHALL provide touch-friendly tap targets (minimum 44x44px)
4. WHEN using keyboard navigation THEN the system SHALL support proper focus states and ARIA labels for accessibility
5. WHEN displaying content THEN the system SHALL maintain sufficient color contrast for WCAG AA compliance