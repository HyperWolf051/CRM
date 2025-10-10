# CRM Pro - Troubleshooting Guide

This guide helps you resolve common issues when setting up and running the CRM Pro application.

## 🚨 Common Issues & Solutions

### 1. CORS Errors

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Symptoms**:
- Frontend can't connect to backend
- API requests fail with CORS errors
- Console shows "No 'Access-Control-Allow-Origin' header"

**Solutions**:

#### Option A: Check Backend Configuration
```bash
# Make sure backend is running on port 3000
cd backend
npm run dev
```

#### Option B: Verify Environment Variables
Check `backend/.env` file:
```env
FRONTEND_URL=http://localhost:5173
PORT=3000
```

#### Option C: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### 2. 500 Internal Server Error

**Error**: `GET http://localhost:3000/api/dashboard/metrics 500`

**Symptoms**:
- API endpoints return 500 errors
- Backend logs show database connection errors
- Dashboard doesn't load

**Solutions**:

#### Option A: Check MongoDB Connection
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB (Linux/macOS)
sudo systemctl start mongod
brew services start mongodb-community

# Start MongoDB (Windows)
net start MongoDB
```

#### Option B: Check Database Connection String
In `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/crm_database
```

#### Option C: Seed Database
```bash
cd backend
npm run seed
```

### 3. Frontend Type Errors

**Error**: `TypeError: deals?.filter is not a function`

**Symptoms**:
- Components crash with filter errors
- Data not displaying properly
- Console shows "is not a function" errors

**Solutions**:

#### Option A: Clear Browser Storage
1. Open DevTools (F12)
2. Go to Application/Storage tab
3. Clear localStorage and sessionStorage
4. Refresh page

#### Option B: Check API Response Format
The API should return:
```json
{
  "success": true,
  "data": [...] // Array of items
}
```

### 4. Authentication Issues

**Error**: `Invalid token` or `Access denied`

**Symptoms**:
- Can't login with correct credentials
- Redirected to login page repeatedly
- Token expired errors

**Solutions**:

#### Option A: Use Correct Credentials
```
Admin: admin@crm.com / admin123
Manager: sarah.johnson@crm.com / password123
User: mike.chen@crm.com / password123
```

#### Option B: Clear Authentication Data
```javascript
// In browser console
localStorage.removeItem('authToken');
localStorage.removeItem('isDemoMode');
location.reload();
```

#### Option C: Check JWT Secret
In `backend/.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 5. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Symptoms**:
- Backend won't start
- Port conflict errors
- "Address already in use" messages

**Solutions**:

#### Option A: Kill Process Using Port
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>

# Or use killall (macOS/Linux)
killall node
```

#### Option B: Use Different Port
In `backend/.env`:
```env
PORT=3001
```

And update frontend proxy in `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

### 6. Database Connection Failed

**Error**: `MongooseError: connect ECONNREFUSED`

**Symptoms**:
- Backend can't connect to MongoDB
- Database operations fail
- "Connection refused" errors

**Solutions**:

#### Option A: Install MongoDB
```bash
# macOS with Homebrew
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Windows - Download from mongodb.com
```

#### Option B: Start MongoDB Service
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### Option C: Use MongoDB Atlas (Cloud)
1. Create account at mongodb.com/atlas
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 7. Frontend Build Errors

**Error**: Build fails with module errors

**Symptoms**:
- `npm run build` fails
- Missing module errors
- TypeScript errors

**Solutions**:

#### Option A: Clear Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Option B: Update Dependencies
```bash
npm update
```

#### Option C: Check Node Version
```bash
node --version  # Should be v16+
npm --version   # Should be v7+
```

## 🔧 Development Tools

### Check Backend Health
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Test API Endpoints
```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.com","password":"admin123"}'

# Test protected endpoint (replace TOKEN with actual token)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/dashboard/metrics
```

### Check Database
```bash
# Connect to MongoDB
mongo

# Switch to CRM database
use crm_database

# List collections
show collections

# Count documents
db.users.count()
db.contacts.count()
db.deals.count()
```

## 🚀 Quick Fixes

### Reset Everything
```bash
# Stop all processes
pkill -f node

# Clear database
mongo crm_database --eval "db.dropDatabase()"

# Reinstall dependencies
rm -rf node_modules backend/node_modules
npm install
cd backend && npm install

# Reseed database
npm run seed

# Start fresh
npm run dev:full
```

### Emergency Demo Mode
If backend is completely broken, the frontend has demo mode:
1. Try logging in with any demo credentials
2. Frontend will fall back to demo data
3. All features work with sample data

## 📞 Getting Help

### Check Logs
- **Backend logs**: Check terminal where `npm run backend:dev` is running
- **Frontend logs**: Check browser console (F12)
- **MongoDB logs**: Check MongoDB log files

### Common Log Locations
- **MongoDB (Linux)**: `/var/log/mongodb/mongod.log`
- **MongoDB (macOS)**: `/usr/local/var/log/mongodb/mongo.log`
- **MongoDB (Windows)**: `C:\Program Files\MongoDB\Server\4.4\log\mongod.log`

### Debug Mode
Set environment variables for more verbose logging:
```bash
# Backend
DEBUG=* npm run dev

# Frontend
VITE_DEBUG=true npm run dev
```

### Still Need Help?
1. Check the main README.md
2. Review the INSTALLATION.md guide
3. Check existing GitHub issues
4. Create a new issue with:
   - Error messages
   - Steps to reproduce
   - System information
   - Log files

---

**Remember**: Most issues are resolved by ensuring MongoDB is running and ports 3000/5173 are available!