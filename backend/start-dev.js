#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting CRM Backend Development Server...\n');

// Start the backend server
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

server.on('close', (code) => {
  console.log(`\n❌ Backend server exited with code ${code}`);
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down backend server...');
  server.kill();
  process.exit(0);
});

console.log('✅ Backend server is starting up!');
console.log('🔧 API will be available at: http://localhost:3000');
console.log('🏥 Health check: http://localhost:3000/health');
console.log('\n💡 Press Ctrl+C to stop the server\n');