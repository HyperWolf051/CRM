import { Link } from 'react-router-dom';
import { Home, FileQuestion } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center">
            <FileQuestion className="w-16 h-16 text-primary-500" />
          </div>
        </div>
        
        {/* Large 404 */}
        <div className="mb-6">
          <h1 className="text-8xl font-bold text-primary-500 mb-2">404</h1>
        </div>
        
        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Page Not Found</h2>
          <p className="text-gray-600 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          <Button
            as={Link}
            to="/app/dashboard"
            variant="primary"
            icon={<Home className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Back to Dashboard
          </Button>
          
          <div className="text-sm">
            <span className="text-gray-500">or </span>
            <Link
              to="/login"
              className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              go to login page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}