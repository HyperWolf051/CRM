#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting CRM Pro Development Environment...\n');

// Start backend
console.log('📡 Starting Backend Server...');
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

// Wait a bit for backend to start, then start frontend
setTimeout(() => {
  console.log('🎨 Starting Frontend Server...');
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
    console.log(`\n❌ Frontend process exited with code ${code}`);
    backend.kill();
    process.exit(code);
  });
}, 3000);

backend.on('close', (code) => {
  console.log(`\n❌ Backend process exited with code ${code}`);
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  process.exit(0);
});

console.log('\n✅ Development environment is starting up!');
console.log('📱 Frontend will be available at: http://localhost:5173');
console.log('🔧 Backend API will be available at: http://localhost:3000');
console.log('\n💡 Press Ctrl+C to stop both servers\n');