#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🎯 CRM Pro Setup Script');
console.log('========================\n');

const runCommand = (command, cwd = __dirname) => {
  return new Promise((resolve, reject) => {
    console.log(`📦 Running: ${command}`);
    const process = spawn(command, { 
      shell: true, 
      stdio: 'inherit',
      cwd 
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
};

const checkPrerequisites = () => {
  console.log('🔍 Checking prerequisites...\n');
  
  return new Promise((resolve, reject) => {
    // Check Node.js version
    exec('node --version', (error, stdout) => {
      if (error) {
        console.error('❌ Node.js is not installed. Please install Node.js v16 or higher.');
        reject(error);
        return;
      }
      
      const version = stdout.trim();
      console.log(`✅ Node.js ${version} found`);
      
      // Check npm
      exec('npm --version', (error, stdout) => {
        if (error) {
          console.error('❌ npm is not installed.');
          reject(error);
          return;
        }
        
        const npmVersion = stdout.trim();
        console.log(`✅ npm ${npmVersion} found`);
        
        // Check MongoDB
        exec('mongod --version', (error, stdout) => {
          if (error) {
            console.log('⚠️  MongoDB not found in PATH. Make sure MongoDB is installed and running.');
            console.log('   You can download it from: https://www.mongodb.com/try/download/community\n');
          } else {
            console.log('✅ MongoDB found');
          }
          
          console.log('');
          resolve();
        });
      });
    });
  });
};

const createEnvFile = () => {
  const envPath = path.join(__dirname, 'backend', '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating backend .env file...');
    
    const envContent = `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/crm_database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-${Date.now()}
JWT_EXPIRES_IN=7d

# Email Configuration (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Backend .env file created\n');
  } else {
    console.log('✅ Backend .env file already exists\n');
  }
};

const setup = async () => {
  try {
    await checkPrerequisites();
    
    console.log('📦 Installing frontend dependencies...');
    await runCommand('npm install');
    console.log('✅ Frontend dependencies installed\n');
    
    console.log('📦 Installing backend dependencies...');
    await runCommand('npm install', path.join(__dirname, 'backend'));
    console.log('✅ Backend dependencies installed\n');
    
    createEnvFile();
    
    console.log('🌱 Seeding database with sample data...');
    await runCommand('npm run seed', path.join(__dirname, 'backend'));
    console.log('✅ Database seeded successfully\n');
    
    console.log('🎉 Setup completed successfully!\n');
    console.log('🚀 Quick Start Commands:');
    console.log('   npm run dev:full     # Start both frontend and backend');
    console.log('   npm run dev          # Start frontend only');
    console.log('   npm run backend:dev  # Start backend only\n');
    
    console.log('🔐 Default Login Credentials:');
    console.log('   Admin:   admin@crm.com / admin123');
    console.log('   Manager: sarah.johnson@crm.com / password123');
    console.log('   User:    mike.chen@crm.com / password123\n');
    
    console.log('🌐 URLs:');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Backend:  http://localhost:3000');
    console.log('   API Docs: http://localhost:3000/health\n');
    
    console.log('💡 Next Steps:');
    console.log('   1. Make sure MongoDB is running');
    console.log('   2. Run "npm run dev:full" to start the application');
    console.log('   3. Open http://localhost:5173 in your browser');
    console.log('   4. Login with admin@crm.com / admin123\n');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure you have Node.js v16+ installed');
    console.log('   2. Make sure you have npm installed');
    console.log('   3. Make sure MongoDB is installed and running');
    console.log('   4. Check your internet connection');
    console.log('   5. Try running the commands manually\n');
    process.exit(1);
  }
};

setup();