import BackendTest from '@/components/BackendTest';

const BackendTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">CRM Backend Test Page</h1>
        <BackendTest />
        
        <div className="mt-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Debug Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold">Expected Backend URL:</h3>
              <p className="text-blue-600">http://localhost:3000</p>
            </div>
            <div>
              <h3 className="font-semibold">Expected Frontend URL:</h3>
              <p className="text-blue-600">http://localhost:5173</p>
            </div>
            <div>
              <h3 className="font-semibold">API Base URL:</h3>
              <p className="text-blue-600">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Environment:</h3>
              <p className="text-blue-600">{import.meta.env.MODE}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Manual Test URLs:</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a 
                  href="http://localhost:3000/health" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  http://localhost:3000/health
                </a> - Backend health check
              </li>
              <li>
                <a 
                  href="http://localhost:3000/api/auth/health" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  http://localhost:3000/api/auth/health
                </a> - Auth routes health check
              </li>
            </ul>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold text-yellow-800">Troubleshooting Steps:</h3>
            <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2 space-y-1">
              <li>Make sure MongoDB is running</li>
              <li>Check if backend server is running on port 3000</li>
              <li>Verify no other process is using port 3000</li>
              <li>Check browser console for CORS errors</li>
              <li>Try accessing the health check URLs directly</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendTestPage;