import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const DemoModeButton = memo(() => {
  const { loginAsDemo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    try {
      loginAsDemo();
      showToast('success', '🚀 Demo mode activated! Exploring with sample data.');
      navigate('/app/dashboard');
    } catch (error) {
      showToast('error', 'Failed to start demo mode. Please try again.');
    }
  };

  return (
    <div className="text-center mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>
      
      <div className="mt-6">
        <Button
          variant="outline"
          onClick={handleDemoLogin}
          className="w-full bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
        >
          🚀 Try Demo Mode
        </Button>
        <p className="mt-2 text-xs text-emerald-600">
          ✨ Explore the full CRM with sample data - no registration required!
        </p>
      </div>
    </div>
  );
});

export default DemoModeButton;