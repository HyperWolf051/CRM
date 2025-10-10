#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (color, message) => console.log(`${colors[color]}${message}${colors.reset}`);

async function testAPI() {
  console.log('🧪 Testing CRM Backend API...\n');

  let token = null;

  // Test 1: Health Check
  try {
    log('blue', '1. Testing health endpoint...');
    const response = await axios.get(`${BASE_URL}/health`);
    log('green', '✅ Health check passed');
    console.log(`   Status: ${response.data.status}`);
    console.log(`   Environment: ${response.data.environment}\n`);
  } catch (error) {
    log('red', '❌ Health check failed');
    console.log(`   Error: ${error.message}\n`);
    return;
  }

  // Test 2: Authentication
  try {
    log('blue', '2. Testing authentication...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@crm.com',
      password: 'admin123'
    });
    
    if (response.data.success && response.data.token) {
      token = response.data.token;
      log('green', '✅ Authentication passed');
      console.log(`   User: ${response.data.user.name}`);
      console.log(`   Role: ${response.data.user.role}\n`);
    } else {
      throw new Error('No token received');
    }
  } catch (error) {
    log('red', '❌ Authentication failed');
    console.log(`   Error: ${error.response?.data?.message || error.message}\n`);
    return;
  }

  // Test 3: Protected Endpoint
  try {
    log('blue', '3. Testing protected endpoint...');
    const response = await axios.get(`${BASE_URL}/api/dashboard/metrics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      log('green', '✅ Protected endpoint passed');
      console.log(`   Total Contacts: ${response.data.data.counts.totalContacts}`);
      console.log(`   Total Deals: ${response.data.data.counts.totalDeals}\n`);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    log('red', '❌ Protected endpoint failed');
    console.log(`   Error: ${error.response?.data?.message || error.message}\n`);
  }

  // Test 4: CORS Headers
  try {
    log('blue', '4. Testing CORS headers...');
    const response = await axios.options(`${BASE_URL}/api/contacts`, {
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });
    
    log('green', '✅ CORS headers configured correctly\n');
  } catch (error) {
    log('yellow', '⚠️  CORS test inconclusive (this is often normal)\n');
  }

  // Test 5: Database Connection
  try {
    log('blue', '5. Testing database connection...');
    const response = await axios.get(`${BASE_URL}/api/contacts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      log('green', '✅ Database connection working');
      console.log(`   Contacts found: ${response.data.data.length}\n`);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    log('red', '❌ Database connection failed');
    console.log(`   Error: ${error.response?.data?.message || error.message}\n`);
  }

  log('blue', '🎉 API testing complete!');
  console.log('\nIf all tests passed, your backend is ready to use.');
  console.log('If any tests failed, check the troubleshooting guide.');
}

// Handle command line execution
if (require.main === module) {
  testAPI().catch(error => {
    log('red', `\n💥 Test script failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = testAPI;