# Recruitment Components

This directory contains all the React components specific to the recruitment functionality of the CRM system.

## Components Overview

### Core Components
- **MetricCard**: Displays key recruitment metrics with trends and sparkline charts
- **PipelineChart**: Visualizes the recruitment pipeline from registration to placement
- **CandidateTable**: Table view for candidate listings with sorting and actions
- **CandidateCard**: Card view for individual candidate display
- **InterviewWidget**: Shows upcoming interviews with quick actions
- **CandidateFilters**: Filter panel for candidate search and filtering
- **JobCard**: Displays job postings with applicant pipeline breakdown
- **JobForm**: Form for creating and editing job postings

### Layout Components
- **RecruiterSidebar**: Recruitment-specific navigation sidebar
- **RecruiterTopbar**: Top navigation bar with search and quick actions

## Usage

```jsx
import { MetricCard, PipelineChart } from '@/components/recruitment';

// Example usage
<MetricCard
  title="Total Candidates"
  value={1247}
  trend={{ value: 12, direction: 'up', period: 'this month' }}
  icon={Users}
  color="blue"
/>

<PipelineChart 
  data={pipelineData}
  showConversionRates={true}
/>
```

## Design System

### Colors
- **Blue**: Primary actions, candidates
- **Green**: Success states, placements
- **Purple**: Screening, secondary actions
- **Amber**: Pending states, interviews
- **Cyan**: Offers, selections
- **Red**: Rejections, errors

### Status Badges
- `new`: Blue background
- `shortlisted`: Purple background
- `interviewed`: Amber background
- `selected`: Cyan background
- `placed`: Green background
- `rejected`: Red background

## Data Flow

Components use the recruitment hooks from `@/hooks/useRecruitment` for data management:
- `useRecruitmentMetrics()`: Dashboard metrics
- `useRecruitmentPipeline()`: Pipeline visualization data
- `useRecentActivity()`: Recent candidates and interviews
- `useCandidates()`: Candidate listing with filters
- `useJobs()`: Job listings with filters