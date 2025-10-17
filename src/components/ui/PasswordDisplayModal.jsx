import { useState } from 'react';
import { 
  Copy, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Mail, 
  User, 
  Key,
  X,
  Send
} from 'lucide-react';

const PasswordDisplayModal = ({ 
  isOpen, 
  onClose, 
  memberName, 
  memberEmail, 
  temporaryPassword,
  onEmailSent 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const sendEmailCredentials = async () => {
    setIsSendingEmail(true);
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEmailSent(true);
      if (onEmailSent) onEmailSent();
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleClose = () => {
    setShowPassword(false);
    setCopied(false);
    setEmailSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 600 }}>
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Account Created Successfully!</h3>
                <p className="text-sm text-slate-600">Team member has been added to the system</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Member Information */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-slate-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">{memberName}</p>
                <p className="text-xs text-slate-600">New Team Member</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-slate-600" />
              <p className="text-sm text-slate-700">{memberEmail}</p>
            </div>
          </div>

          {/* Temporary Password Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-semibold text-slate-900">Temporary Password</h4>
            </div>
            
            <div className="relative">
              <div className="flex items-center space-x-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex-1 font-mono text-lg tracking-wider text-slate-900">
                  {showPassword ? temporaryPassword : '••••••••'}
                </div>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 hover:bg-amber-100 rounded-lg transition-colors duration-200"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-amber-700" />
                  ) : (
                    <Eye className="w-4 h-4 text-amber-700" />
                  )}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-amber-100 rounded-lg transition-colors duration-200 group"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-amber-700 group-hover:text-amber-800" />
                  )}
                </button>
              </div>
              
              {copied && (
                <div className="absolute -top-8 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded animate-in fade-in duration-200">
                  Copied!
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Important Security Notice</p>
                  <p>Please share this temporary password securely with the new team member. They should change it upon first login.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={sendEmailCredentials}
              disabled={isSendingEmail || emailSent}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingEmail ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sending Email...</span>
                </>
              ) : emailSent ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Email Sent Successfully!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Email Credentials to {memberName}</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors duration-200"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Password</span>
              </button>
              
              <button
                onClick={handleClose}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 text-green-700 font-medium rounded-xl hover:bg-green-200 transition-colors duration-200"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Done</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-xs text-slate-500 space-y-1">
            <p>• The team member can use this password to log in for the first time</p>
            <p>• They will be prompted to change their password after login</p>
            <p>• This temporary password will expire in 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordDisplayModal;