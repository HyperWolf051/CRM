# Implementation Plan

- [x] 1. Initialize project and configure build tools





  - Create Vite React project with TypeScript support disabled (using JSX)
  - Install dependencies: react-router-dom, axios, lucide-react, @dnd-kit/core, @dnd-kit/sortable
  - Configure jsconfig.json for absolute imports with @ alias
  - Create .env.example file with VITE_API_BASE_URL placeholder
  - _Requirements: 1.1, 1.4, 1.6, 1.7_

- [x] 2. Configure Tailwind CSS with custom design tokens





  - Install Tailwind CSS and PostCSS
  - Create tailwind.config.js with extended theme (colors, typography, spacing, shadows, transitions)
  - Configure PostCSS with Tailwind and autoprefixer
  - Import Poppins font from Google Fonts in index.css
  - Set up base styles and CSS reset in index.css
  - _Requirements: 1.2, 1.3, 2.1, 2.2_

- [x] 3. Create project folder structure





  - Create folders: src/components/ui, src/components, src/layouts, src/pages, src/hooks, src/context, src/utils, src/assets/illustrations
  - Set up empty index files for organized exports
  - _Requirements: 1.5_

- [x] 4. Build foundational UI components





- [x] 4.1 Implement Button component


  - Create Button.jsx with variants (primary, secondary, ghost, danger)
  - Add size props (sm, md, lg)
  - Include loading state with spinner
  - Add icon support and disabled state
  - Style with Tailwind classes following design tokens
  - _Requirements: 2.3, 2.7_

- [x] 4.2 Implement Input component


  - Create Input.jsx with label, error state, and icon support
  - Add validation error display below input
  - Include focus ring styling with accent color
  - Support different input types (text, email, password, number)
  - _Requirements: 2.3, 2.6, 2.7_

- [x] 4.3 Implement Card component


  - Create Card.jsx as container with shadow and border
  - Add padding size variants (sm, md, lg)
  - Style with white background and rounded corners
  - _Requirements: 2.3, 2.8_

- [x] 4.4 Implement Avatar component


  - Create Avatar.jsx with image and fallback initials
  - Add size variants (sm, md, lg)
  - Generate colored background based on name hash
  - Handle missing image gracefully
  - _Requirements: 2.3_

- [x] 4.5 Implement Badge component


  - Create Badge.jsx with variant support (success, warning, danger, info, neutral)
  - Style with appropriate colors for each variant
  - Add small, rounded styling
  - _Requirements: 2.3_

- [x] 4.6 Implement SkeletonLoader component


  - Create SkeletonLoader.jsx with shimmer animation
  - Add width and height props
  - Use CSS gradient animation for loading effect
  - _Requirements: 2.4_

- [x] 4.7 Implement EmptyState component


  - Create EmptyState.jsx with icon, title, description, and action button
  - Center layout with generous spacing
  - Add illustration or icon support
  - _Requirements: 2.5_


- [x] 4.8 Implement Modal component

  - Create Modal.jsx with backdrop and centered content
  - Add close on backdrop click and ESC key
  - Include fade-in animation
  - Implement focus trap for accessibility
  - _Requirements: 2.3, 2.7, 9.6_

- [x] 4.9 Implement Tooltip component


  - Create Tooltip.jsx with position variants (top, bottom, left, right)
  - Use CSS positioning for hover display
  - Add smooth fade-in transition
  - _Requirements: 2.3, 2.7, 10.2_

- [x] 4.10 Implement Dropdown component


  - Create Dropdown.jsx with trigger and menu items
  - Add click outside to close functionality
  - Include keyboard navigation (arrow keys, enter, escape)
  - Style with shadow and border
  - _Requirements: 2.3, 2.9_

- [x] 5. Create Toast notification system




- [x] 5.1 Implement Toast component


  - Create Toast.jsx with type variants (success, error, info)
  - Add slide-in animation from top-right
  - Include auto-dismiss with configurable duration
  - Add close button
  - _Requirements: 2.3, 10.3_

- [x] 5.2 Implement ToastContext and useToast hook


  - Create ToastContext.jsx to manage toast state
  - Implement showToast and hideToast methods
  - Create useToast hook for easy access
  - Handle stacked toasts with proper positioning
  - _Requirements: 10.3_

- [x] 6. Set up API client and utilities






- [x] 6.1 Create Axios API client

  - Create utils/api.js with Axios instance
  - Configure base URL from environment variable
  - Add request interceptor to include auth token
  - Add response interceptor for 401 error handling
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 6.2 Create validation utilities


  - Create utils/validation.js with email, password, and phone validators
  - Implement validateEmail function with regex
  - Implement validatePassword function (min 8 chars, 1 uppercase, 1 number)
  - Add required field validation
  - _Requirements: 2.6, 4.2, 4.4_

- [x] 6.3 Create formatter utilities


  - Create utils/formatters.js for currency, date, and phone formatting
  - Implement formatCurrency function
  - Implement formatDate function
  - Implement formatPhone function
  - _Requirements: 5.2, 6.1_

- [x] 7. Implement authentication system




- [x] 7.1 Create AuthContext and useAuth hook


  - Create context/AuthContext.jsx with user, token, isAuthenticated state
  - Implement login, register, logout, and updateUser methods
  - Load token from localStorage on mount
  - Create useAuth hook for consuming context
  - _Requirements: 4.7, 4.3, 4.8_

- [x] 7.2 Create ProtectedRoute component


  - Create ProtectedRoute wrapper component
  - Check authentication status
  - Redirect to /login if not authenticated
  - Allow access if authenticated
  - _Requirements: 4.1_

- [x] 7.3 Build Login page


  - Create pages/Login.jsx with email and password inputs
  - Add form validation with error display
  - Implement login submission with API call
  - Store token in localStorage on success
  - Display error toast on failure
  - Redirect to dashboard on success
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 7.4 Build Register page


  - Create pages/Register.jsx with name, email, password, and confirm password inputs
  - Add form validation for all fields
  - Implement registration submission with API call
  - Redirect to dashboard on success
  - Display error messages for validation failures
  - _Requirements: 4.5, 4.6_

- [x] 8. Create application layouts





- [x] 8.1 Build AuthLayout


  - Create layouts/AuthLayout.jsx for login/register pages
  - Center content with branded background
  - Add logo and tagline
  - Use Outlet for nested routes
  - _Requirements: 3.1_

- [x] 8.2 Build Sidebar component


  - Create components/Sidebar.jsx with navigation items
  - Add icons using lucide-react (LayoutDashboard, Users, TrendingUp, Settings, LogOut)
  - Implement active route highlighting using useLocation
  - Add hover states with smooth transitions
  - Style with fixed width (240px) and dark background
  - _Requirements: 3.1, 3.2, 3.4_

- [x] 8.3 Build Topbar component


  - Create components/Topbar.jsx with page title, notification bell, and user avatar
  - Add notification badge with count
  - Implement user dropdown menu with profile and logout options
  - Style with white background and bottom border
  - _Requirements: 3.3_

- [x] 8.4 Build DashboardLayout


  - Create layouts/DashboardLayout.jsx with Sidebar and Topbar
  - Use flexbox for layout (sidebar left, content right)
  - Add Outlet for nested routes
  - Set main content area with overflow scroll
  - _Requirements: 3.1, 3.5, 3.6, 3.7_

- [x] 9. Set up routing configuration





  - Configure React Router in App.jsx with route definitions
  - Create routes for /, /login, /register, /app/dashboard, /app/contacts, /app/contacts/:id, /app/deals, /app/settings
  - Wrap /app routes with ProtectedRoute
  - Add redirect from / to /login or /dashboard based on auth
  - Implement 404 NotFound page
  - _Requirements: 4.1, 12.1_

- [x] 10. Build Dashboard page with metrics





- [x] 10.1 Create MetricCard component


  - Create components/MetricCard.jsx to display metric value, label, icon, and trend
  - Add trend indicator with up/down arrow and percentage
  - Include skeleton loader state
  - Style with Card component and colored icon circle
  - _Requirements: 5.2_

- [x] 10.2 Create useDashboard hook


  - Create hooks/useDashboard.js for fetching dashboard metrics
  - Implement loading, error, and data states
  - Fetch data from /dashboard/metrics endpoint
  - Return metrics, loading, error, and refetch function
  - _Requirements: 5.6, 9.4_

- [x] 10.3 Build Dashboard page


  - Create pages/Dashboard.jsx with grid of MetricCard components
  - Display Total Contacts, Active Deals, Revenue, and Conversion Rate metrics
  - Show skeleton loaders while loading
  - Use responsive grid (4 columns on large screens, 2 on medium)
  - _Requirements: 5.1, 5.3, 5.4_

- [x] 11. Build Contacts list and details pages





- [x] 11.1 Create ContactTable component


  - Create components/ContactTable.jsx with table layout
  - Display columns: Avatar + Name, Email, Phone, Company, Status (badge), Actions (dropdown)
  - Add row hover effect and click handler
  - Implement skeleton rows for loading state
  - Show EmptyState when no contacts
  - _Requirements: 6.1, 6.2, 6.3, 6.8_

- [x] 11.2 Create useContacts hook


  - Create hooks/useContacts.js for fetching contacts list
  - Implement loading, error, and data states
  - Fetch data from /contacts endpoint
  - Add createContact, updateContact, and deleteContact methods
  - Return contacts, loading, error, and CRUD functions
  - _Requirements: 6.1, 6.3, 9.4_

- [x] 11.3 Build Contacts list page


  - Create pages/Contacts.jsx with ContactTable and "Add Contact" button
  - Implement search/filter functionality
  - Add Modal for creating new contact
  - Handle contact click to navigate to details page
  - Display loading and error states
  - _Requirements: 6.1, 6.7, 6.9_

- [x] 11.4 Build Contact Details page


  - Create pages/ContactDetails.jsx to display full contact information
  - Show name, email, phone, company, address, and notes
  - Add Edit and Delete buttons
  - Implement edit mode with form inputs
  - Handle delete with confirmation modal
  - _Requirements: 6.4, 6.5, 6.6_

- [x] 12. Build Deals pipeline with Kanban board




- [x] 12.1 Create KanbanBoard component


  - Create components/KanbanBoard.jsx with horizontal scrollable columns
  - Set up @dnd-kit for drag-and-drop functionality
  - Create columns for each deal stage (Lead, Qualified, Proposal, Negotiation, Closed Won, Closed Lost)
  - Render deal cards within columns
  - Implement drag-and-drop between columns
  - _Requirements: 7.1, 7.3, 7.5_

- [x] 12.2 Create DealCard component


  - Create components/DealCard.jsx to display deal name, value, contact name, and avatar
  - Add colored border based on stage
  - Format currency value
  - Add click handler to open deal details
  - _Requirements: 7.2_

- [x] 12.3 Create useDeals hook


  - Create hooks/useDeals.js for fetching deals list
  - Implement loading, error, and data states
  - Fetch data from /deals endpoint
  - Add updateDealStage method for drag-and-drop
  - Add createDeal, updateDeal, and deleteDeal methods
  - _Requirements: 7.4, 9.4_

- [x] 12.4 Build Deals page


  - Create pages/Deals.jsx with KanbanBoard component
  - Add "Add Deal" button to open modal
  - Implement deal creation modal with form
  - Handle deal click to open details modal
  - Display skeleton loaders in columns while loading
  - _Requirements: 7.6, 7.7, 7.8_

- [x] 13. Build Settings page





- [x] 13.1 Create Settings page with User Information section


  - Create pages/Settings.jsx with tabbed or sectioned layout
  - Add User Information section with name, email, and avatar fields
  - Implement form validation
  - Add "Save Changes" button
  - Display success toast on save
  - _Requirements: 8.1, 8.2, 8.5_

- [x] 13.2 Add password change functionality


  - Add password change section with current password, new password, and confirm password fields
  - Validate password strength
  - Send PUT request to /users/me/password
  - Display success or error messages
  - _Requirements: 8.2, 8.3, 8.6_

- [x] 13.3 Add Preferences section


  - Add Preferences section with notification settings
  - Include language selector (optional)
  - Add dark mode toggle (optional)
  - Save preferences to API
  - _Requirements: 8.4_
-

- [x] 14. Implement keyboard shortcuts



- [x] 14.1 Create useKeyboardShortcut hook


  - Create hooks/useKeyboardShortcut.js to handle keyboard events
  - Add event listener for keydown
  - Support key combinations
  - Clean up listener on unmount
  - _Requirements: 10.4, 10.5_

- [x] 14.2 Add keyboard shortcuts to pages


  - Implement "/" to focus search input on Contacts page
  - Implement "c" to open Add Contact modal
  - Add ESC to close modals globally
  - Ensure shortcuts don't interfere with form inputs
  - _Requirements: 10.4, 10.5_

- [x] 15. Add error handling and boundaries





- [x] 15.1 Create ErrorBoundary component


  - Create components/ErrorBoundary.jsx to catch React errors
  - Display fallback UI with error message
  - Add "Reload" button to recover
  - Log errors to console
  - _Requirements: 10.7, 12.4_

- [x] 15.2 Create NotFound page


  - Create pages/NotFound.jsx for 404 errors
  - Display friendly message and illustration
  - Add link back to Dashboard
  - Style consistently with app design
  - _Requirements: 12.1_

- [x] 15.3 Implement form validation error display


  - Ensure all forms display inline error messages
  - Style error messages in red below inputs
  - Clear errors on input change
  - _Requirements: 12.2_

- [x] 15.4 Add API error handling with toasts


  - Display error toasts for failed API requests
  - Show user-friendly error messages
  - Add retry functionality where appropriate
  - Handle offline state with message
  - _Requirements: 12.3, 12.5, 12.6_

- [x] 16. Add animations and transitions





  - Add route transition animations using CSS or Framer Motion
  - Implement smooth hover states on all interactive elements
  - Add fade-in animations for modals and dropdowns
  - Ensure all transitions use consistent timing (150ms default)
  - _Requirements: 10.1, 2.7_

- [x] 17. Implement accessibility features





  - Add ARIA labels to all icon-only buttons
  - Ensure proper focus indicators on all interactive elements
  - Add aria-describedby for error messages
  - Implement keyboard navigation for dropdowns and modals
  - Add aria-current for active navigation items
  - Test tab order and ensure logical flow
  - _Requirements: 2.9, 10.6_

- [x] 18. Optimize for desktop responsiveness







  - Test layout on screen sizes from 1024px to 2560px
  - Adjust sidebar width for smaller desktop screens (1024px-1280px)
  - Ensure tables use horizontal scrolling when needed
  - Verify Kanban board scrolls smoothly horizontally
  - Adjust metric card grid for different screen sizes
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 19. Write unit tests for core components





  - Write tests for Button component (variants, onClick, loading state)
  - Write tests for Input component (validation, error display)
  - Write tests for Modal component (open/close, ESC key)
  - Write tests for validation utilities
  - Write tests for useAuth hook
  - _Requirements: 2.3, 2.6, 4.7_

- [x] 20. Final polish and optimization




  - Implement code splitting with React.lazy for routes
  - Add React.memo to expensive components
  - Optimize images and use WebP format
  - Run bundle analyzer and reduce bundle size
  - Test all user flows end-to-end
  - Fix any remaining bugs or UI inconsistencies
  - _Requirements: 1.1, 2.8_
