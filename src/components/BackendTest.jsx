import { useState } from 'react';
import api from '@/utils/api';

const BackendTest = () => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test, success, message, data = null) => {
    setResults(prev => [...prev, { test, success, message, data, timestamp: new Date() }]);
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    // Test 1: Health check
    try {
      const response = await fetch('http://localhost:3000/health');
      const data = await response.json();
      addResult('Health Check', true, 'Backend is running', data);
    } catch (error) {
      addResult('Health Check', false, `Backend not accessible: ${error.message}`);
    }

    // Test 2: Auth health check
    try {
      const response = await api.get('/auth/health');
      addResult('Auth Health', true, 'Auth routes working', response.data);
    } catch (error) {
      addResult('Auth Health', false, `Auth routes failed: ${error.message}`);
    }

    // Test 3: Test registration endpoint
    try {
      const response = await api.post('/auth/test-register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      });
      addResult('Test Registration', true, 'Test endpoint working', response.data);
    } catch (error) {
      addResult('Test Registration', false, `Test endpoint failed: ${error.message}`);
    }

    // Test 4: Actual registration
    try {
      const response = await api.post('/auth/register', {
        name: 'Test User ' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'test123456'
      });
      addResult('Real Registration', true, 'Registration working', response.data);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      addResult('Real Registration', false, `Registration failed: ${message}`, error.response?.data);
    }

    // Test 5: Login test
    try {
      const response = await api.post('/auth/login', {
        email: 'admin@crm.com',
        password: 'admin123'
      });
      addResult('Login Test', true, 'Login working', response.data);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      addResult('Login Test', false, `Login failed: ${message}`);
    }

    setTesting(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Backend Connection Test</h2>
      
      <button
        onClick={runTests}
        disabled={testing}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
      >
        {testing ? 'Testing...' : 'Run Backend Tests'}
      </button>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded border-l-4 ${
              result.success 
                ? 'bg-green-50 border-green-500 text-green-800' 
                : 'bg-red-50 border-red-500 text-red-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {result.success ? '✅' : '❌'} {result.test}
              </h3>
              <span className="text-xs opacity-75">
                {result.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm mt-1">{result.message}</p>
            {result.data && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer">View Details</summary>
                <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && !testing && (
        <div className="text-gray-500 text-center py-8">
          Click "Run Backend Tests" to check backend connectivity
        </div>
      )}
    </div>
  );
};

export default BackendTest;