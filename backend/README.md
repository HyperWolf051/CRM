# CRM Backend API

A comprehensive Node.js/Express backend API for the CRM application with MongoDB database integration.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user CRUD operations with role management
- **Contact Management**: Full contact lifecycle management with company associations
- **Deal Pipeline**: Sales pipeline management with stages and activities
- **Company Management**: Company profiles with industry categorization
- **Calendar System**: Event scheduling with attendee management
- **Notifications**: Real-time notification system
- **Dashboard Analytics**: Performance metrics and reporting
- **Data Validation**: Comprehensive input validation and sanitization
- **Security**: Rate limiting, CORS, helmet security headers
- **Error Handling**: Centralized error handling with user-friendly messages

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository and navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/crm_database
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**:
   Make sure MongoDB is running on your system.

5. **Seed the database** (optional):

   ```bash
   npm run seed
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/change-password` - Change password

### Users

- `GET /api/users` - Get all users (Admin/Manager)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/role` - Update user role (Admin)
- `PUT /api/users/:id/activate` - Activate user (Admin)
- `PUT /api/users/:id/deactivate` - Deactivate user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Contacts

- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get contact by ID
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `GET /api/contacts/status/:status` - Get contacts by status
- `PUT /api/contacts/:id/status` - Update contact status

### Deals

- `GET /api/deals` - Get all deals
- `GET /api/deals/:id` - Get deal by ID
- `POST /api/deals` - Create new deal
- `PUT /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal
- `GET /api/deals/stage/:stage` - Get deals by stage
- `PUT /api/deals/:id/stage` - Update deal stage
- `POST /api/deals/:id/activities` - Add activity to deal

### Companies

- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company by ID
- `POST /api/companies` - Create new company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company
- `GET /api/companies/industry/:industry` - Get companies by industry
- `PUT /api/companies/:id/status` - Update company status

### Calendar

- `GET /api/calendar` - Get calendar events
- `GET /api/calendar/:id` - Get event by ID
- `POST /api/calendar` - Create new event
- `PUT /api/calendar/:id` - Update event
- `DELETE /api/calendar/:id` - Delete event
- `GET /api/calendar/upcoming` - Get upcoming events
- `PUT /api/calendar/:id/status` - Update event status

### Dashboard

- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/recent-activities` - Get recent activities
- `GET /api/dashboard/sales-pipeline` - Get sales pipeline data
- `GET /api/dashboard/performance` - Get performance metrics
- `GET /api/dashboard/team-performance` - Get team performance (Admin)

### Notifications

- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread` - Get unread notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Default Admin Account

After seeding the database, you can login with:

- **Email**: admin@crm.com
- **Password**: admin123

## Database Schema

### User

- Personal information (name, email, phone)
- Role-based access (admin, manager, user)
- Preferences and settings
- Activity tracking

### Contact

- Personal and professional details
- Company association
- Status tracking (prospect, customer, lead)
- Follow-up scheduling

### Deal

- Sales opportunity tracking
- Pipeline stage management
- Value and probability tracking
- Activity history

### Company

- Company profile information
- Industry categorization
- Revenue and employee data
- Relationship status

### Calendar Event

- Event scheduling and management
- Attendee management
- Recurring events support
- Reminder system

### Notification

- User notification system
- Category-based organization
- Priority levels
- Action links

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API request rate limiting
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: MongoDB injection prevention

## Error Handling

The API includes comprehensive error handling:

- Validation errors with field-specific messages
- Authentication and authorization errors
- Database operation errors
- Network and server errors
- User-friendly error messages

## Development

### Running Tests

```bash
npm test
```

### Code Linting

```bash
npm run lint
```

### Database Operations

```bash
# Seed database with sample data
npm run seed

# Clear database (be careful!)
npm run clear-db
```

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a production MongoDB instance
3. Set strong JWT secret
4. Configure proper CORS origins
5. Set up SSL/TLS certificates
6. Use process manager like PM2
7. Set up monitoring and logging

## API Documentation

For detailed API documentation with request/response examples, visit:
`http://localhost:3000/api-docs` (when running in development mode)

## Support

For issues and questions, please check the main project documentation or create an issue in the repository.
