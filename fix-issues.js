#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (color, message) => console.log(`${colors[color]}${message}${colors.reset}`);

console.log('🔧 CRM Pro Issue Fixer');
console.log('=====================\n');

const runCommand = (command) => {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
};

const fixIssues = async () => {
  // 1. Check and kill processes on ports 3000 and 5173
  log('blue', '1. Checking ports...');
  
  const port3000 = await runCommand('lsof -ti:3000');
  if (port3000.stdout.trim()) {
    log('yellow', '   Killing process on port 3000...');
    await runCommand(`kill -9 ${port3000.stdout.trim()}`);
    log('green', '   ✅ Port 3000 freed');
  } else {
    log('green', '   ✅ Port 3000 is free');
  }

  const port5173 = await runCommand('lsof -ti:5173');
  if (port5173.stdout.trim()) {
    log('yellow', '   Killing process on port 5173...');
    await runCommand(`kill -9 ${port5173.stdout.trim()}`);
    log('green', '   ✅ Port 5173 freed');
  } else {
    log('green', '   ✅ Port 5173 is free');
  }

  // 2. Check MongoDB
  log('blue', '\n2. Checking MongoDB...');
  const mongoCheck = await runCommand('ps aux | grep mongod | grep -v grep');
  if (mongoCheck.stdout.trim()) {
    log('green', '   ✅ MongoDB is running');
  } else {
    log('yellow', '   ⚠️  MongoDB not running. Attempting to start...');
    
    // Try different MongoDB start commands
    const mongoStart = await runCommand('brew services start mongodb-community || sudo systemctl start mongod || net start MongoDB');
    if (mongoStart.error) {
      log('red', '   ❌ Could not start MongoDB automatically');
      log('yellow', '   💡 Please start MongoDB manually');
    } else {
      log('green', '   ✅ MongoDB started');
    }
  }

  // 3. Check and create .env file
  log('blue', '\n3. Checking backend configuration...');
  const envPath = path.join(__dirname, 'backend', '.env');
  if (!fs.existsSync(envPath)) {
    log('yellow', '   Creating .env file...');
    const envContent = `PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/crm_database
JWT_SECRET=crm-secret-key-${Date.now()}
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100`;
    
    fs.writeFileSync(envPath, envContent);
    log('green', '   ✅ .env file created');
  } else {
    log('green', '   ✅ .env file exists');
  }

  // 4. Check dependencies
  log('blue', '\n4. Checking dependencies...');
  
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    log('yellow', '   Installing frontend dependencies...');
    const frontendInstall = spawn('npm', ['install'], { stdio: 'inherit' });
    await new Promise((resolve) => {
      frontendInstall.on('close', resolve);
    });
    log('green', '   ✅ Frontend dependencies installed');
  } else {
    log('green', '   ✅ Frontend dependencies exist');
  }

  if (!fs.existsSync(path.join(__dirname, 'backend', 'node_modules'))) {
    log('yellow', '   Installing backend dependencies...');
    const backendInstall = spawn('npm', ['install'], { 
      cwd: path.join(__dirname, 'backend'),
      stdio: 'inherit' 
    });
    await new Promise((resolve) => {
      backendInstall.on('close', resolve);
    });
    log('green', '   ✅ Backend dependencies installed');
  } else {
    log('green', '   ✅ Backend dependencies exist');
  }

  // 5. Test database connection and seed if needed
  log('blue', '\n5. Checking database...');
  const dbCheck = await runCommand('mongo crm_database --eval "db.users.count()" --quiet');
  if (dbCheck.error || !dbCheck.stdout.trim() || dbCheck.stdout.trim() === '0') {
    log('yellow', '   Seeding database...');
    const seed = spawn('npm', ['run', 'seed'], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'inherit'
    });
    await new Promise((resolve) => {
      seed.on('close', resolve);
    });
    log('green', '   ✅ Database seeded');
  } else {
    log('green', '   ✅ Database has data');
  }

  // 6. Final instructions
  log('blue', '\n🎉 Issue fixing complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Open two terminals');
  console.log('2. Terminal 1: cd backend && npm run dev');
  console.log('3. Terminal 2: npm run dev');
  console.log('4. Visit: http://localhost:5173');
  console.log('5. Test backend: http://localhost:5173/test-backend');
  
  console.log('\n🔐 Login credentials:');
  console.log('   Admin: admin@crm.com / admin123');
  console.log('   User:  mike.chen@crm.com / password123');

  console.log('\n🔧 If issues persist:');
  console.log('   - Check MongoDB is running: ps aux | grep mongod');
  console.log('   - Check ports: lsof -ti:3000 && lsof -ti:5173');
  console.log('   - View logs in terminal where servers are running');
  console.log('   - Visit /test-backend page for detailed diagnostics');
};

fixIssues().catch(error => {
  log('red', `\n💥 Fix script failed: ${error.message}`);
  process.exit(1);
});