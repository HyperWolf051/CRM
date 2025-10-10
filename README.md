# CRM Pro - Complete Customer Relationship Management System

A modern, full-stack CRM application built with React, Node.js, Express, and MongoDB. Features real-time data, comprehensive user management, sales pipeline tracking, and advanced analytics.

![CRM Pro Dashboard](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=CRM+Pro+Dashboard)

## 🚀 Features

### Frontend (React + Vite)
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Real-time Updates**: Live data synchronization
- **Advanced Animations**: Smooth transitions and hover effects
- **Role-based Access**: Different views for admin, manager, and user roles
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: User preference-based theming
- **Accessibility**: WCAG compliant with keyboard navigation

### Backend (Node.js + Express)
- **RESTful API**: Complete REST API with proper HTTP methods
- **Authentication**: JWT-based secure authentication
- **Authorization**: Role-based access control (RBAC)
- **Data Validation**: Comprehensive input validation
- **Security**: Rate limiting, CORS, helmet security headers
- **Error Handling**: Centralized error handling with user-friendly messages
- **Database**: MongoDB with Mongoose ODM

### Core Modules
- **👥 User Management**: Complete user lifecycle with role management
- **📞 Contact Management**: Comprehensive contact profiles with company associations
- **💼 Deal Pipeline**: Sales opportunity tracking with customizable stages
- **🏢 Company Management**: Company profiles with industry categorization
- **📅 Calendar System**: Event scheduling with attendee management
- **🔔 Notifications**: Real-time notification system
- **📊 Dashboard Analytics**: Performance metrics and reporting
- **⚙️ Settings**: User preferences and system configuration

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing with lazy loading
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful icon library
- **DnD Kit** - Drag and drop functionality

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation middleware

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **Nodemon** - Development server auto-restart

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn**
- **MongoDB** (v4.4 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/crm-pro.git
cd crm-pro
```

### 2. Complete Setup (Recommended)
```bash
# Install all dependencies and seed database
npm run setup
```

### 3. Start Development Servers
```bash
# Start both frontend and backend
npm run dev:full
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

## 🔐 Default Login Credentials

After seeding the database, you can login with:

### Admin Account
- **Email**: admin@crm.com
- **Password**: admin123
- **Access**: Full system access, redirects to team management

### Manager Account
- **Email**: sarah.johnson@crm.com
- **Password**: password123
- **Access**: Team oversight and advanced features

### User Accounts
- **Email**: mike.chen@crm.com / **Password**: password123
- **Email**: emily.davis@crm.com / **Password**: password123
- **Access**: Standard user features

## 📁 Project Structure

```
crm-pro/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── scripts/            # Database scripts
│   └── server.js           # Main server file
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── layouts/            # Layout components
├── public/                 # Static assets
└── package.json           # Project dependencies
```

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually:

### Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Seed the database with sample data
npm run seed

# Start backend development server
npm run dev
```

## 🌟 Key Features Explained

### Admin Panel
- **Team Management**: Complete user management with role assignments
- **System Analytics**: Comprehensive performance metrics
- **User Activity Monitoring**: Track user engagement and productivity
- **Data Export**: Export reports and analytics

### Sales Pipeline
- **Drag & Drop Interface**: Intuitive deal management
- **Custom Stages**: Configurable pipeline stages
- **Activity Tracking**: Complete interaction history
- **Forecasting**: Revenue predictions and analytics

### Contact Management
- **360° Contact View**: Complete contact profiles
- **Company Associations**: Link contacts to companies
- **Communication History**: Track all interactions
- **Follow-up Reminders**: Automated follow-up scheduling

### Calendar Integration
- **Event Scheduling**: Create and manage events
- **Attendee Management**: Invite and track attendees
- **Recurring Events**: Set up repeating events
- **Reminder System**: Automated event reminders

## 🎨 UI/UX Features

### Animations & Interactions
- **Hover Effects**: Beautiful button hover animations with background slides
- **Page Transitions**: Smooth page-to-page transitions
- **Loading States**: Elegant loading animations
- **Micro-interactions**: Delightful user feedback

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Perfect tablet experience
- **Desktop Enhanced**: Rich desktop features
- **Cross-browser**: Compatible with all modern browsers

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API request rate limiting
- **CORS Protection**: Cross-origin resource sharing configuration
- **Input Validation**: Comprehensive request validation
- **XSS Protection**: Cross-site scripting prevention
- **CSRF Protection**: Cross-site request forgery prevention

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/auth/login      # User login
POST /api/auth/register   # User registration
GET  /api/auth/me         # Get current user
POST /api/auth/logout     # User logout
```

### Core Resource Endpoints
```
# Users
GET    /api/users         # Get all users
POST   /api/users         # Create user
PUT    /api/users/:id     # Update user
DELETE /api/users/:id     # Delete user

# Contacts
GET    /api/contacts      # Get all contacts
POST   /api/contacts      # Create contact
PUT    /api/contacts/:id  # Update contact
DELETE /api/contacts/:id  # Delete contact

# Deals
GET    /api/deals         # Get all deals
POST   /api/deals         # Create deal
PUT    /api/deals/:id     # Update deal
DELETE /api/deals/:id     # Delete deal

# Companies
GET    /api/companies     # Get all companies
POST   /api/companies     # Create company
PUT    /api/companies/:id # Update company
DELETE /api/companies/:id # Delete company
```

## 🧪 Testing

### Run Frontend Tests
```bash
npm test
```

### Run Backend Tests
```bash
cd backend
npm test
```

### Run All Tests
```bash
npm run test:all
```

## 🚀 Production Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Deployment
```bash
cd backend

# Set production environment
export NODE_ENV=production

# Start production server
npm start
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/crm-pro/issues) page
2. Create a new issue with detailed information
3. Join our [Discord community](https://discord.gg/your-invite)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the excellent database
- All contributors who helped make this project better

## 📈 Roadmap

- [ ] Email integration
- [ ] SMS notifications
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Third-party integrations (Slack, Zapier)
- [ ] AI-powered insights
- [ ] Multi-language support

---

**Made with ❤️ by the CRM Pro Team**