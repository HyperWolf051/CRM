#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 CRM Pro Startup Script');
console.log('=========================\n');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (color, message) => console.log(`${colors[color]}${message}${colors.reset}`);

// Check if MongoDB is running
const checkMongoDB = () => {
  return new Promise((resolve) => {
    exec('ps aux | grep mongod | grep -v grep', (error, stdout) => {
      if (stdout.trim()) {
        log('green', '✅ MongoDB is running');
        resolve(true);
      } else {
        log('yellow', '⚠️  MongoDB not detected. Attempting to start...');
        
        // Try to start MongoDB
        exec('brew services start mongodb-community || sudo systemctl start mongod || net start MongoDB', (error) => {
          if (error) {
            log('red', '❌ Could not start MongoDB automatically');
            log('yellow', '💡 Please start MongoDB manually:');
            console.log('   macOS: brew services start mongodb-community');
            console.log('   Linux: sudo systemctl start mongod');
            console.log('   Windows: net start MongoDB\n');
            resolve(false);
          } else {
            log('green', '✅ MongoDB started successfully');
            resolve(true);
          }
        });
      }
    });
  });
};

// Check if ports are available
const checkPort = (port) => {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (stdout.trim()) {
        log('yellow', `⚠️  Port ${port} is in use. Attempting to free it...`);
        exec(`kill -9 ${stdout.trim()}`, (killError) => {
          if (killError) {
            log('red', `❌ Could not free port ${port}`);
            resolve(false);
          } else {
            log('green', `✅ Port ${port} freed`);
            resolve(true);
          }
        });
      } else {
        log('green', `✅ Port ${port} is available`);
        resolve(true);
      }
    });
  });
};

// Check if backend dependencies are installed
const checkBackendDeps = () => {
  const backendNodeModules = path.join(__dirname, 'backend', 'node_modules');
  if (!fs.existsSync(backendNodeModules)) {
    log('yellow', '⚠️  Backend dependencies not found. Installing...');
    return new Promise((resolve, reject) => {
      const install = spawn('npm', ['install'], {
        cwd: path.join(__dirname, 'backend'),
        stdio: 'inherit',
        shell: true
      });
      
      install.on('close', (code) => {
        if (code === 0) {
          log('green', '✅ Backend dependencies installed');
          resolve(true);
        } else {
          log('red', '❌ Failed to install backend dependencies');
          reject(false);
        }
      });
    });
  } else {
    log('green', '✅ Backend dependencies found');
    return Promise.resolve(true);
  }
};

// Check if frontend dependencies are installed
const checkFrontendDeps = () => {
  const frontendNodeModules = path.join(__dirname, 'node_modules');
  if (!fs.existsSync(frontendNodeModules)) {
    log('yellow', '⚠️  Frontend dependencies not found. Installing...');
    return new Promise((resolve, reject) => {
      const install = spawn('npm', ['install'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
      });
      
      install.on('close', (code) => {
        if (code === 0) {
          log('green', '✅ Frontend dependencies installed');
          resolve(true);
        } else {
          log('red', '❌ Failed to install frontend dependencies');
          reject(false);
        }
      });
    });
  } else {
    log('green', '✅ Frontend dependencies found');
    return Promise.resolve(true);
  }
};

// Check if database is seeded
const checkDatabase = () => {
  return new Promise((resolve) => {
    exec('mongo crm_database --eval "db.users.count()" --quiet', (error, stdout) => {
      if (error || !stdout.trim() || stdout.trim() === '0') {
        log('yellow', '⚠️  Database not seeded. Seeding with sample data...');
        const seed = spawn('npm', ['run', 'seed'], {
          cwd: path.join(__dirname, 'backend'),
          stdio: 'inherit',
          shell: true
        });
        
        seed.on('close', (code) => {
          if (code === 0) {
            log('green', '✅ Database seeded successfully');
            resolve(true);
          } else {
            log('red', '❌ Failed to seed database');
            resolve(false);
          }
        });
      } else {
        log('green', '✅ Database already seeded');
        resolve(true);
      }
    });
  });
};

// Main startup function
const startCRM = async () => {
  try {
    log('blue', '🔍 Checking prerequisites...\n');
    
    // Check MongoDB
    const mongoOK = await checkMongoDB();
    if (!mongoOK) {
      log('red', '❌ MongoDB is required. Please install and start MongoDB.');
      process.exit(1);
    }
    
    // Check ports
    const port3000OK = await checkPort(3000);
    const port5173OK = await checkPort(5173);
    
    if (!port3000OK || !port5173OK) {
      log('red', '❌ Required ports are not available.');
      process.exit(1);
    }
    
    // Check dependencies
    await checkFrontendDeps();
    await checkBackendDeps();
    
    // Check database
    await checkDatabase();
    
    log('blue', '\n🚀 Starting CRM Pro...\n');
    
    // Start backend
    log('blue', '📡 Starting backend server...');
    const backend = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'pipe',
      shell: true
    });
    
    backend.stdout.on('data', (data) => {
      console.log(`[Backend] ${data.toString().trim()}`);
    });
    
    backend.stderr.on('data', (data) => {
      console.error(`[Backend Error] ${data.toString().trim()}`);
    });
    
    // Wait for backend to start, then start frontend
    setTimeout(() => {
      log('blue', '🎨 Starting frontend server...');
      const frontend = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: true
      });
      
      frontend.stdout.on('data', (data) => {
        console.log(`[Frontend] ${data.toString().trim()}`);
      });
      
      frontend.stderr.on('data', (data) => {
        console.error(`[Frontend Error] ${data.toString().trim()}`);
      });
      
      frontend.on('close', (code) => {
        log('red', `\n❌ Frontend process exited with code ${code}`);
        backend.kill();
        process.exit(code);
      });
    }, 5000);
    
    backend.on('close', (code) => {
      log('red', `\n❌ Backend process exited with code ${code}`);
      process.exit(code);
    });
    
    // Handle Ctrl+C
    process.on('SIGINT', () => {
      log('yellow', '\n🛑 Shutting down CRM Pro...');
      backend.kill();
      process.exit(0);
    });
    
    setTimeout(() => {
      console.log('\n' + '='.repeat(60));
      log('green', '🎉 CRM Pro is starting up!');
      console.log('');
      log('blue', '📱 Frontend: http://localhost:5173');
      log('blue', '🔧 Backend:  http://localhost:3000');
      log('blue', '🏥 Health:   http://localhost:3000/health');
      console.log('');
      log('yellow', '🔐 Login Credentials:');
      console.log('   Admin:   admin@crm.com / admin123');
      console.log('   Manager: sarah.johnson@crm.com / password123');
      console.log('   User:    mike.chen@crm.com / password123');
      console.log('');
      log('yellow', '💡 Press Ctrl+C to stop both servers');
      console.log('='.repeat(60) + '\n');
    }, 8000);
    
  } catch (error) {
    log('red', `\n💥 Startup failed: ${error.message}`);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check that ports 3000 and 5173 are available');
    console.log('3. Ensure you have Node.js v16+ installed');
    console.log('4. Try running: npm run setup');
    console.log('5. Check TROUBLESHOOTING.md for more help\n');
    process.exit(1);
  }
};

// Run the startup script
startCRM();