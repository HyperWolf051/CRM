# CRM Pro - Installation Guide

This guide will help you set up the complete CRM Pro application with both frontend and backend components.

## 🎯 What You'll Get

After following this guide, you'll have:
- ✅ A fully functional CRM system
- ✅ Real backend API with MongoDB database
- ✅ Sample data with users, contacts, deals, and companies
- ✅ Admin panel with team management
- ✅ Working authentication and authorization
- ✅ Beautiful UI with hover effects and animations
- ✅ Calendar system with event management
- ✅ Notification system
- ✅ Dashboard with real analytics

## 🔧 Prerequisites

Before starting, make sure you have:

### Required
- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)

### Optional but Recommended
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - For API testing
- **VS Code** - Code editor with extensions

## 🚀 Quick Installation (Recommended)

### Option 1: Automated Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd crm-pro

# Run the automated setup script
npm run setup
```

The setup script will:
1. ✅ Check prerequisites
2. ✅ Install frontend dependencies
3. ✅ Install backend dependencies
4. ✅ Create environment configuration
5. ✅ Seed database with sample data
6. ✅ Display login credentials

### Option 2: Start Development Environment
```bash
# Start both frontend and backend
npm run dev:full
```

## 📋 Manual Installation (Alternative)

If you prefer manual setup or the automated script doesn't work:

### Step 1: Clone and Install Frontend
```bash
git clone <your-repo-url>
cd crm-pro
npm install
```

### Step 2: Setup Backend
```bash
cd backend
npm install
```

### Step 3: Configure Environment
Create `backend/.env` file:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/crm_database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### Step 4: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS (with Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### Step 5: Seed Database
```bash
cd backend
npm run seed
```

### Step 6: Start Servers
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev
```

## 🌐 Access the Application

Once everything is running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

## 🔐 Login Credentials

After seeding, use these credentials:

### Admin Account (Full Access)
- **Email**: admin@crm.com
- **Password**: admin123
- **Features**: Team management, all data access, user management
- **Redirect**: Automatically redirects to `/app/team`

### Manager Account
- **Email**: sarah.johnson@crm.com
- **Password**: password123
- **Features**: Team oversight, advanced reporting

### User Accounts
- **Email**: mike.chen@crm.com / **Password**: password123
- **Email**: emily.davis@crm.com / **Password**: password123
- **Features**: Standard CRM features

## 🎨 Key Features to Test

### 1. Admin Panel (admin@crm.com)
- Navigate to Team Management
- View team performance metrics
- Manage user roles and permissions
- Access system-wide analytics

### 2. Sales Pipeline
- Create and manage deals
- Drag and drop deals between stages
- Track deal activities and notes
- View pipeline analytics

### 3. Contact Management
- Add new contacts with company associations
- Schedule follow-ups
- Track contact interactions
- Import/export contact data

### 4. Calendar System
- Create events and meetings
- Invite attendees
- Set reminders
- View upcoming events

### 5. Notifications
- Real-time notifications
- Mark as read/unread
- Different notification types
- Action buttons

### 6. UI/UX Features
- Hover effects on buttons (background slide animations)
- Smooth page transitions
- Responsive design
- Dark/light theme support

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
net start MongoDB  # Windows
```

#### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Kill the process using the port
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 <process-id>
```

#### 3. Frontend Can't Connect to Backend
**Solution**: Check if backend is running and ports match
- Backend should be on port 3000
- Frontend should be on port 5173
- Check `vite.config.js` proxy configuration

#### 4. Database Seeding Fails
**Solution**: Clear database and try again
```bash
cd backend
# Connect to MongoDB and drop database
mongo
use crm_database
db.dropDatabase()
exit

# Run seed again
npm run seed
```

#### 5. JWT Token Issues
**Solution**: Clear browser storage
- Open browser DevTools (F12)
- Go to Application/Storage tab
- Clear localStorage and sessionStorage
- Refresh page and login again

### Getting Help

If you encounter issues:

1. **Check the logs**: Look at terminal output for error messages
2. **Verify prerequisites**: Ensure Node.js and MongoDB are properly installed
3. **Check ports**: Make sure ports 3000 and 5173 are available
4. **Clear cache**: Clear browser cache and localStorage
5. **Restart services**: Stop and restart both frontend and backend

## 📚 Next Steps

After successful installation:

1. **Explore the Admin Panel**: Login as admin and explore team management
2. **Create Sample Data**: Add your own contacts, deals, and companies
3. **Test Workflows**: Try the complete sales process from lead to close
4. **Customize Settings**: Adjust user preferences and system settings
5. **API Testing**: Use Postman to test API endpoints
6. **Mobile Testing**: Test responsive design on mobile devices

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**: Set production values in `.env`
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **Security**: Change JWT secret and enable HTTPS
4. **Build**: Run `npm run build` for frontend
5. **Process Manager**: Use PM2 for backend process management
6. **Reverse Proxy**: Use Nginx for load balancing and SSL

## 📞 Support

If you need help:
- Check the main README.md for detailed documentation
- Review the backend/README.md for API documentation
- Create an issue in the repository
- Check existing issues for solutions

---

**Happy CRM-ing! 🎉**