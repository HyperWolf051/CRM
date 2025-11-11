import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  Key,
  Book,
  Terminal,
  ExternalLink
} from 'lucide-react';

const APIDocumentation = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');

  const copyToClipboard = (text, endpoint) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const languages = [
    { id: 'curl', label: 'cURL' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'php', label: 'PHP' }
  ];

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/candidates',
      description: 'List all candidates',
      params: [
        { name: 'page', type: 'integer', description: 'Page number' },
        { name: 'perPage', type: 'integer', description: 'Items per page' },
        { name: 'status', type: 'string', description: 'Filter by status' }
      ],
      examples: {
        curl: `curl -X GET "https://api.example.com/api/v1/candidates?page=1&perPage=20" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
        javascript: `fetch('https://api.example.com/api/v1/candidates?page=1&perPage=20', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
        python: `import requests

url = "https://api.example.com/api/v1/candidates"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
params = {"page": 1, "perPage": 20}

response = requests.get(url, headers=headers, params=params)
data = response.json()`,
        php: `<?php
$url = "https://api.example.com/api/v1/candidates?page=1&perPage=20";
$headers = [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
?>`
      }
    },
    {
      method: 'POST',
      path: '/api/v1/candidates',
      description: 'Create a new candidate',
      params: [
        { name: 'name', type: 'string', description: 'Candidate name', required: true },
        { name: 'email', type: 'string', description: 'Email address', required: true },
        { name: 'phone', type: 'string', description: 'Phone number' },
        { name: 'position', type: 'string', description: 'Applied position' }
      ],
      examples: {
        curl: `curl -X POST "https://api.example.com/api/v1/candidates" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "position": "Senior Developer"
  }'`,
        javascript: `fetch('https://api.example.com/api/v1/candidates', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    position: 'Senior Developer'
  })
})
.then(response => response.json())
.then(data => console.log(data));`,
        python: `import requests
import json

url = "https://api.example.com/api/v1/candidates"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "position": "Senior Developer"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()`,
        php: `<?php
$url = "https://api.example.com/api/v1/candidates";
$headers = [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json"
];
$data = json_encode([
    "name" => "John Doe",
    "email" => "john@example.com",
    "phone" => "+1234567890",
    "position" => "Senior Developer"
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
?>`
      }
    },
    {
      method: 'GET',
      path: '/api/v1/jobs',
      description: 'List all jobs',
      params: [
        { name: 'status', type: 'string', description: 'Filter by status' },
        { name: 'location', type: 'string', description: 'Filter by location' }
      ],
      examples: {
        curl: `curl -X GET "https://api.example.com/api/v1/jobs" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
        javascript: `fetch('https://api.example.com/api/v1/jobs', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
        python: `import requests

url = "https://api.example.com/api/v1/jobs"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
data = response.json()`,
        php: `<?php
$url = "https://api.example.com/api/v1/jobs";
$headers = [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
?>`
      }
    }
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">API Documentation</h1>
        <p className="text-gray-600">Complete reference for the Recruitment API</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Key className="w-8 h-8 text-gray-700 mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">Authentication</h3>
          <p className="text-sm text-gray-600 mb-2">
            Use Bearer token authentication for all API requests
          </p>
          <a href="#authentication" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Learn more <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Terminal className="w-8 h-8 text-gray-700 mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">Rate Limits</h3>
          <p className="text-sm text-gray-600 mb-2">
            100 requests per minute for standard tier
          </p>
          <a href="#rate-limits" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View limits <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Book className="w-8 h-8 text-gray-700 mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">Webhooks</h3>
          <p className="text-sm text-gray-600 mb-2">
            Real-time notifications for events
          </p>
          <a href="#webhooks" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Configure <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <div className="flex gap-2">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedLanguage === lang.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-6">
        {endpoints.map((endpoint, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Endpoint Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  endpoint.method === 'GET' 
                    ? 'bg-blue-100 text-blue-700'
                    : endpoint.method === 'POST'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
              </div>
              <p className="text-sm text-gray-600">{endpoint.description}</p>
            </div>

            {/* Parameters */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Parameters</h4>
              <div className="space-y-2">
                {endpoint.params.map((param, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {param.name}
                    </code>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{param.type}</span>
                        {param.required && (
                          <span className="text-xs text-red-600">required</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{param.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Example */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Example Request</h4>
                <button
                  onClick={() => copyToClipboard(endpoint.examples[selectedLanguage], index)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  {copiedEndpoint === index ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{endpoint.examples[selectedLanguage]}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Sections */}
      <div className="mt-8 space-y-6">
        <div id="authentication" className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Authentication</h2>
          <p className="text-gray-600 mb-4">
            All API requests require authentication using a Bearer token. Include your API key in the Authorization header:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </pre>
        </div>

        <div id="rate-limits" className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Rate Limits</h2>
          <div className="space-y-2 text-gray-600">
            <p><strong>Standard:</strong> 100 requests per minute</p>
            <p><strong>Premium:</strong> 1,000 requests per minute</p>
            <p><strong>Enterprise:</strong> 10,000 requests per minute</p>
          </div>
          <p className="text-gray-600 mt-4">
            Rate limit information is included in response headers:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mt-2">
            <code>{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;
