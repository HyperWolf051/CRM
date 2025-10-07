import { memo } from 'react';
import Button from './ui/Button';

const TestCredentials = memo(({ onFillCredentials }) => {
  const testAccounts = [
    {
      name: 'Admin User',
      email: 'admin@crm.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      name: 'Sales User',
      email: 'sales@crm.com',
      password: 'sales123',
      role: 'user'
    },
    {
      name: 'Demo User',
      email: 'demo@crm.com',
      password: 'demo123',
      role: 'user'
    }
  ];

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="text-sm font-semibold text-blue-800 mb-3">
        🧪 Test Credentials (Works Offline)
      </h4>
      <div className="space-y-2">
        {testAccounts.map((account, index) => (
          <div key={index} className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-700 text-sm">{account.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {account.email} / {account.password}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFillCredentials(account.email, account.password)}
                className="ml-3 text-xs px-3 py-1 bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
              >
                Use
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 p-2 bg-blue-100 rounded">
        <p className="text-xs text-blue-700">
          ✨ Click "Use" to auto-fill and login with demo data - no backend required!
        </p>
      </div>
    </div>
  );
});

export default TestCredentials;