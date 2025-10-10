# CRM Pro - Quick Start Guide

## 🚨 Current Issue: Registration 400 Error

If you're seeing a 400 Bad Request error on registration, follow these steps:

### Step 1: Start Backend First
```bash
# Terminal 1: Start backend
cd backend
npm install
npm run dev
```

Wait for this message: `🚀 Server running on port 3000`

### Step 2: Test Backend
Open in browser: http://localhost:3000/health

You should see:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Step 3: Start Frontend
```bash
# Terminal 2: Start frontend
npm install
npm run dev
```

### Step 4: Test Connection
Visit: http://localhost:5173/test-backend

This page will test all backend connections and show you exactly what's failing.

## 🔧 If Backend Won't Start

### Check MongoDB
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB (choose your OS)
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Windows:
net start MongoDB
```

### Check Ports
```bash
# Check if port 3000 is free
lsof -ti:3000

# If something is using it, kill it
kill -9 $(lsof -ti:3000)
```

### Check Environment
Make sure `backend/.env` exists:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/crm_database
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
```

## 🔧 If Frontend Won't Connect

### Check API Configuration
In `src/utils/api.js`, the base URL should be:
```javascript
baseURL: 'http://localhost:3000/api'
```

### Check Vite Proxy
In `vite.config.js`, the proxy should be:
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

### Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

## 🎯 Quick Test Commands

### Test Backend Health
```bash
curl http://localhost:3000/health
```

### Test Auth Endpoints
```bash
curl http://localhost:3000/api/auth/health
```

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.com","password":"admin123"}'
```

## 🚀 One-Command Solutions

### Reset Everything
```bash
# Kill all node processes
pkill -f node

# Clear ports
kill -9 $(lsof -ti:3000) 2>/dev/null || true
kill -9 $(lsof -ti:5173) 2>/dev/null || true

# Restart MongoDB
brew services restart mongodb-community || sudo systemctl restart mongod

# Clean install
rm -rf node_modules backend/node_modules
npm install
cd backend && npm install && cd ..

# Seed database
cd backend && npm run seed && cd ..

# Start everything
npm run dev:full
```

### Use Smart Startup Script
```bash
npm run start-crm
```

This script will:
- ✅ Check MongoDB
- ✅ Free up ports
- ✅ Install dependencies
- ✅ Seed database
- ✅ Start both servers

## 🔐 Login Credentials

After everything is running:

- **Admin**: admin@crm.com / admin123
- **Manager**: sarah.johnson@crm.com / password123  
- **User**: mike.chen@crm.com / password123

## 🆘 Still Having Issues?

### Check Logs
- Backend logs: Terminal where `npm run backend:dev` is running
- Frontend logs: Browser console (F12)
- MongoDB logs: Check MongoDB service logs

### Common Error Messages

**"ECONNREFUSED"**: MongoDB not running
**"EADDRINUSE"**: Port already in use
**"CORS error"**: Backend not accessible from frontend
**"400 Bad Request"**: Validation error (check backend logs)
**"500 Internal Server Error"**: Database connection issue

### Debug Mode
```bash
# Backend with debug logs
cd backend
DEBUG=* npm run dev

# Frontend with debug
VITE_DEBUG=true npm run dev
```

### Test Page
Visit http://localhost:5173/test-backend for comprehensive backend testing.

## 📞 Need Help?

1. Check the TROUBLESHOOTING.md file
2. Look at backend terminal logs
3. Check browser console
4. Use the test page at /test-backend
5. Try the one-command reset above

---

**Most issues are solved by ensuring MongoDB is running and ports 3000/5173 are free!**