/**
 * Integration Test Runner
 * Runs all integration and E2E tests for the recruitment dashboard
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const testSuites = [
  {
    name: 'Unit Tests',
    command: 'vitest run --reporter=verbose',
    description: 'Running unit tests for components and utilities'
  },
  {
    name: 'Integration Tests',
    command: 'vitest run src/tests/integration --reporter=verbose',
    description: 'Running integration tests for API and services'
  },
  {
    name: 'E2E Tests',
    command: 'vitest run src/tests/e2e --reporter=verbose',
    description: 'Running end-to-end tests for complete workflows'
  }
];

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

async function runTestSuite(suite) {
  log.header(`${suite.name}`);
  log.info(suite.description);
  
  try {
    const { stdout, stderr } = await execAsync(suite.command);
    
    if (stdout) {
      console.log(stdout);
    }
    
    if (stderr && !stderr.includes('PASS')) {
      log.warning('Test warnings:');
      console.log(stderr);
    }
    
    log.success(`${suite.name} completed successfully`);
    return { success: true, suite: suite.name };
  } catch (error) {
    log.error(`${suite.name} failed`);
    console.error(error.stdout || error.message);
    return { success: false, suite: suite.name, error: error.message };
  }
}

async function runAllTests() {
  log.header('🚀 Starting Recruitment Dashboard Test Suite');
  
  const startTime = Date.now();
  const results = [];
  
  for (const suite of testSuites) {
    const result = await runTestSuite(suite);
    results.push(result);
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Summary
  log.header('📊 Test Summary');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Total Suites: ${results.length}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Duration: ${duration}s`);
  
  if (failed > 0) {
    log.error('\nFailed test suites:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.suite}`);
    });
    process.exit(1);
  } else {
    log.success('\n✨ All tests passed!');
    process.exit(0);
  }
}

// Run tests
runAllTests().catch(error => {
  log.error('Test runner failed');
  console.error(error);
  process.exit(1);
});
