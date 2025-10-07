# Design Document

## Overview

This design document outlines the architecture, components, and technical approach for building a production-grade CRM frontend application. The application will be built using React 18 with Vite as the build tool, styled with Tailwind CSS, and designed for desktop-first usage (1024px and above). The design emphasizes clean, modern aesthetics inspired by companies like Linear, Notion, and Superhuman, with a focus on performance, maintainability, and exceptional user experience.

### Technology Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom configuration
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: React Context API + Custom Hooks
- **Font**: Poppins (Google Fonts)
- **Icons**: Lucide React (lightweight, modern icon library)
- **Drag & Drop**: @dnd-kit/core (for Kanban board)

### Design Philosophy

The application follows these core design principles:

1. **Minimal and Clean**: Generous whitespace, clear hierarchy, no visual clutter
2. **Fast and Responsive**: Optimistic UI updates, skeleton loaders, smooth transitions
3. **Accessible**: ARIA labels, keyboard navigation, focus indicators
4. **Consistent**: Reusable components, unified design tokens, predictable patterns
5. **Desktop-Optimized**: Designed for mouse and keyboard interaction on large screens

## Architecture

### Project Structure

```
crm-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── illustrations/
│   │       └── empty-state.svg
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Tooltip.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── Toast.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── ContactTable.jsx
│   │   ├── KanbanBoard.jsx
│   │   ├── MetricCard.jsx
│   │   └── ErrorBoundary.jsx
│   ├── layouts/
│   │   ├── AuthLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Contacts.jsx
│   │   ├── ContactDetails.jsx
│   │   ├── Deals.jsx
│   │   ├── Settings.jsx
│   │   └── NotFound.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useContacts.js
│   │   ├── useDeals.js
│   │   ├── useDashboard.js
│   │   ├── useToast.js
│   │   └── useKeyboardShortcut.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── utils/
│   │   ├── api.js
│   │   ├── validation.js
│   │   └── formatters.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .env
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── jsconfig.json (for @ alias)
└── package.json
```

### Routing Architecture

The application uses React Router DOM v6 with nested routes:

```
/ (redirect to /login if not authenticated, else /dashboard)
├── /login (AuthLayout)
├── /register (AuthLayout)
└── /app (DashboardLayout - protected)
    ├── /app/dashboard
    ├── /app/contacts
    ├── /app/contacts/:id
    ├── /app/deals
    └── /app/settings
```

Protected routes will be wrapped in a `ProtectedRoute` component that checks authentication status and redirects to `/login` if needed.

## Components and Interfaces

### Core Layout Components

#### DashboardLayout

The main application layout with persistent sidebar and topbar.

**Structure**:
```jsx
<div className="flex h-screen bg-gray-50">
  <Sidebar />
  <div className="flex-1 flex flex-col overflow-hidden">
    <Topbar />
    <main className="flex-1 overflow-y-auto p-6">
      <Outlet />
    </main>
  </div>
</div>
```

**Props**: None (uses React Router's Outlet)

#### Sidebar

Vertical navigation with icons and labels.

**Props**:
- None (reads current route from React Router)

**Features**:
- Active route highlighting
- Hover states with smooth transitions
- Logout button at bottom
- Fixed width: 240px

**Navigation Items**:
- Dashboard (LayoutDashboard icon)
- Contacts (Users icon)
- Deals (TrendingUp icon)
- Settings (Settings icon)
- Logout (LogOut icon)

#### Topbar

Horizontal bar with page title, search, and user actions.

**Props**:
- `title`: string (current page title)

**Features**:
- Page title on the left
- Search input in the center (optional, for future)
- Notification bell icon (badge with count)
- User avatar with dropdown menu

### UI Component Library

#### Button

Reusable button component with variants.

**Props**:
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: React element (optional)
- `loading`: boolean
- `disabled`: boolean
- `onClick`: function
- `children`: React node

**Variants**:
- **Primary**: Solid background with accent color (purple/blue)
- **Secondary**: Outlined with border
- **Ghost**: Transparent with hover background
- **Danger**: Red for destructive actions

#### Input

Text input with label, error state, and icon support.

**Props**:
- `label`: string
- `type`: 'text' | 'email' | 'password' | 'number'
- `placeholder`: string
- `value`: string
- `onChange`: function
- `error`: string (error message)
- `icon`: React element (optional)
- `disabled`: boolean

**Features**:
- Floating label animation
- Error message below input
- Focus ring with accent color
- Icon on the left side

#### Modal

Centered modal with backdrop.

**Props**:
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `children`: React node
- `footer`: React node (optional)

**Features**:
- Backdrop click to close
- ESC key to close
- Smooth fade-in animation
- Focus trap

#### Tooltip

Hover tooltip for icons and buttons.

**Props**:
- `content`: string
- `position`: 'top' | 'bottom' | 'left' | 'right'
- `children`: React element

**Implementation**: Uses CSS positioning and hover state

#### Avatar

User profile picture with fallback initials.

**Props**:
- `src`: string (image URL)
- `name`: string (for fallback initials)
- `size`: 'sm' | 'md' | 'lg'

**Features**:
- Circular shape
- Fallback to initials if no image
- Colored background based on name hash

#### Card

Container component with shadow and border.

**Props**:
- `children`: React node
- `className`: string (additional classes)
- `padding`: 'sm' | 'md' | 'lg'

**Styling**:
- White background
- Subtle shadow
- Rounded corners (8px)
- Border: 1px solid gray-200

#### Badge

Small label for status indicators.

**Props**:
- `variant`: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
- `children`: React node

**Variants**:
- Success: Green background
- Warning: Yellow background
- Danger: Red background
- Info: Blue background
- Neutral: Gray background

#### SkeletonLoader

Animated loading placeholder.

**Props**:
- `width`: string | number
- `height`: string | number
- `className`: string

**Animation**: Shimmer effect using CSS gradient animation

#### EmptyState

Placeholder for empty lists/tables.

**Props**:
- `icon`: React element
- `title`: string
- `description`: string
- `action`: React element (optional button)

**Features**:
- Centered layout
- Illustration or icon
- Call-to-action button

#### Toast

Notification component for success/error messages.

**Props**:
- `type`: 'success' | 'error' | 'info'
- `message`: string
- `duration`: number (ms)

**Features**:
- Slide-in animation from top-right
- Auto-dismiss after duration
- Close button
- Stacked toasts

### Feature Components

#### MetricCard

Dashboard metric display.

**Props**:
- `title`: string
- `value`: string | number
- `icon`: React element
- `trend`: number (percentage change)
- `loading`: boolean

**Features**:
- Large value display
- Icon in colored circle
- Trend indicator (up/down arrow with percentage)
- Skeleton loader state

#### ContactTable

Table for displaying contacts list.

**Props**:
- `contacts`: array of contact objects
- `loading`: boolean
- `onContactClick`: function

**Columns**:
- Avatar + Name
- Email
- Phone
- Company
- Status (badge)
- Actions (dropdown menu)

**Features**:
- Sortable columns
- Row hover effect
- Click row to view details
- Skeleton rows when loading

#### KanbanBoard

Drag-and-drop board for deals pipeline.

**Props**:
- `stages`: array of stage objects
- `deals`: array of deal objects
- `onDealMove`: function
- `onDealClick`: function

**Structure**:
- Horizontal scrollable container
- Columns for each stage
- Deal cards within columns
- Drag-and-drop using @dnd-kit

**Deal Card**:
- Deal name
- Deal value (formatted currency)
- Contact name
- Small avatar
- Colored border based on stage

## Data Models

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
}
```

### Contact

```typescript
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'lead';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Deal

```typescript
interface Deal {
  id: string;
  name: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  contactId: string;
  contactName: string;
  probability: number; // 0-100
  expectedCloseDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### DashboardMetrics

```typescript
interface DashboardMetrics {
  totalContacts: number;
  activeDeals: number;
  revenue: number;
  conversionRate: number;
  contactsTrend: number; // percentage change
  dealsTrend: number;
  revenueTrend: number;
  conversionTrend: number;
}
```

## Design System Tokens

### Color Palette

```javascript
// tailwind.config.js theme extension
colors: {
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6', // Main accent
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
}
```

### Typography Scale

```javascript
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
}
```

### Spacing Scale

Uses Tailwind's default spacing scale (4px base unit).

### Border Radius

```javascript
borderRadius: {
  none: '0',
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
}
```

### Shadows

```javascript
boxShadow: {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
}
```

### Transitions

```javascript
transitionDuration: {
  DEFAULT: '150ms',
  fast: '100ms',
  slow: '300ms',
}
```

## State Management

### Authentication State

Managed by `AuthContext` and `useAuth` hook.

**Context State**:
```javascript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
}
```

**Methods**:
- `login(email, password)`: Authenticate user
- `register(name, email, password)`: Create new account
- `logout()`: Clear session and redirect
- `updateUser(userData)`: Update user profile

**Implementation**:
- Token stored in localStorage
- Auto-load token on app mount
- Axios interceptor adds token to requests

### Toast Notifications

Managed by `ToastContext` and `useToast` hook.

**Methods**:
- `showToast(type, message, duration)`: Display toast
- `hideToast(id)`: Dismiss specific toast

**Implementation**:
- Array of toast objects in context
- Auto-dismiss with setTimeout
- Stacked positioning (top-right corner)

### Data Fetching

Custom hooks for each resource type.

**Pattern**:
```javascript
function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return { contacts, loading, error, refetch: fetchContacts };
}
```

## API Integration

### Axios Configuration

**Base Setup** (`utils/api.js`):
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Endpoints

**Authentication**:
- `POST /auth/login`: Login with email/password
- `POST /auth/register`: Create new account
- `POST /auth/logout`: Invalidate token
- `GET /auth/me`: Get current user

**Contacts**:
- `GET /contacts`: List all contacts
- `GET /contacts/:id`: Get contact details
- `POST /contacts`: Create new contact
- `PUT /contacts/:id`: Update contact
- `DELETE /contacts/:id`: Delete contact

**Deals**:
- `GET /deals`: List all deals
- `GET /deals/:id`: Get deal details
- `POST /deals`: Create new deal
- `PUT /deals/:id`: Update deal
- `PATCH /deals/:id/stage`: Update deal stage
- `DELETE /deals/:id`: Delete deal

**Dashboard**:
- `GET /dashboard/metrics`: Get dashboard metrics

**Settings**:
- `PUT /users/me`: Update user profile
- `PUT /users/me/password`: Change password

## Error Handling

### Error Boundary

Wrap the entire app in an `ErrorBoundary` component to catch React errors.

**Features**:
- Catch errors in component tree
- Display fallback UI
- Log errors to console (or external service)
- Provide "Reload" button

### API Error Handling

**Strategy**:
1. Axios interceptor catches 401 errors → redirect to login
2. Other errors returned to calling code
3. Custom hooks set error state
4. Components display error messages or toast notifications

**Error Display**:
- Form errors: Inline below input fields
- API errors: Toast notification
- Critical errors: Error boundary fallback

### Validation

**Client-side validation** (`utils/validation.js`):
- Email format validation
- Password strength requirements (min 8 chars, 1 uppercase, 1 number)
- Required field checks
- Phone number format
- URL format

**Implementation**:
```javascript
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[0-9]/.test(password);
};
```

## Testing Strategy

### Unit Testing

**Tools**: Vitest + React Testing Library

**Coverage**:
- UI components (Button, Input, Modal, etc.)
- Utility functions (validation, formatters)
- Custom hooks (useAuth, useContacts, etc.)

**Example Test**:
```javascript
describe('Button', () => {
  it('renders with correct variant', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-500');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Integration Testing

**Focus**:
- Authentication flow (login → dashboard)
- Contact CRUD operations
- Deal drag-and-drop
- Form validation and submission

### E2E Testing (Optional)

**Tools**: Playwright or Cypress

**Critical Paths**:
- User registration and login
- Create and edit contact
- Move deal through pipeline
- Update settings

## Performance Optimization

### Code Splitting

Use React.lazy() for route-based code splitting:
```javascript
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Contacts = lazy(() => import('@/pages/Contacts'));
```

### Memoization

- Use `React.memo()` for expensive components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for event handlers passed to children

### Image Optimization

- Use WebP format for illustrations
- Lazy load images below the fold
- Use appropriate image sizes (no oversized images)

### Bundle Size

- Tree-shake unused code
- Use lightweight icon library (Lucide React)
- Minimize dependencies
- Analyze bundle with `vite-bundle-visualizer`

## Accessibility

### Keyboard Navigation

- Tab order follows visual flow
- Focus indicators on all interactive elements
- ESC key closes modals and dropdowns
- Enter key submits forms
- Arrow keys navigate lists and menus

### ARIA Labels

- `aria-label` on icon-only buttons
- `aria-describedby` for error messages
- `role` attributes for custom components
- `aria-expanded` for dropdowns
- `aria-current` for active navigation items

### Screen Reader Support

- Semantic HTML elements
- Alt text for images
- Live regions for dynamic content (toasts)
- Skip to main content link

### Color Contrast

- WCAG AA compliance (4.5:1 for normal text)
- Don't rely solely on color for information
- Test with color blindness simulators

## Responsive Behavior

### Breakpoints

```javascript
screens: {
  lg: '1024px',  // Minimum supported
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
}
```

### Layout Adaptations

**1024px - 1280px**:
- Sidebar: 200px width
- Reduce padding slightly
- Metric cards: 2 columns

**1280px - 1920px**:
- Sidebar: 240px width
- Standard padding
- Metric cards: 4 columns

**1920px+**:
- Max content width: 1600px (centered)
- Larger font sizes for readability
- More generous spacing

## Security Considerations

### Authentication

- Store JWT token in localStorage (httpOnly cookies preferred for production)
- Token expiration handling
- Automatic logout on 401 responses
- CSRF protection (if using cookies)

### Input Sanitization

- Validate all user inputs
- Escape HTML in user-generated content
- Prevent XSS attacks

### API Security

- HTTPS only in production
- CORS configuration
- Rate limiting (backend)
- Input validation on backend

## Deployment

### Build Process

```bash
npm run build
```

Outputs to `dist/` directory.

### Environment Variables

**Development** (`.env`):
```
VITE_API_BASE_URL=http://localhost:3000/api
```

**Production** (`.env.production`):
```
VITE_API_BASE_URL=https://api.yourcrm.com
```

### Hosting

Recommended platforms:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps

### CI/CD

1. Run linter (ESLint)
2. Run tests (Vitest)
3. Build production bundle
4. Deploy to hosting platform

## Future Enhancements

### Phase 2 Features

- Advanced search and filtering
- Bulk actions (delete, export)
- Data export (CSV, PDF)
- Email integration
- Calendar view for deals
- Activity timeline for contacts
- Custom fields
- Team collaboration features
- Real-time updates (WebSockets)

### Mobile App

Separate native mobile app using React Native, sharing business logic and API client with web app.

### Analytics

- User behavior tracking
- Performance monitoring
- Error tracking (Sentry)
- Usage analytics (Mixpanel, Amplitude)
