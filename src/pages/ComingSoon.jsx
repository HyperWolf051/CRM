import { memo } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

const ComingSoon = memo(({ title = "Coming Soon", description = "This feature is under development" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce-subtle">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            {title}
          </h1>
          <p className="text-slate-600 text-lg mb-8">
            {description}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">What's Coming</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Advanced features and functionality
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Beautiful, intuitive interface
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Seamless integration with existing tools
              </li>
            </ul>
          </div>
          
          <Link to="/app/dashboard">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default ComingSoon;