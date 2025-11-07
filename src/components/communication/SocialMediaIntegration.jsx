import React, { useState, useEffect } from 'react';
import { 
  Linkedin, 
  Twitter, 
  Facebook, 
  Link, 
  Unlink, 
  Share2, 
  Calendar, 
  Eye, 
  Heart, 
  MessageCircle, 
  BarChart3,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useCommunication } from '../../hooks/useCommunication';

const SocialMediaIntegration = () => {
  const { 
    socialMediaIntegrations, 
    fetchSocialMediaIntegrations, 
    connectSocialMedia, 
    postToSocialMedia,
    loading 
  } = useCommunication();

  const [activeTab, setActiveTab] = useState('integrations');
  const [showPostForm, setShowPostForm] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(null);
  const [newPost, setNewPost] = useState({
    platform: 'linkedin',
    content: '',
    jobId: '',
    scheduledAt: '',
    status: 'draft'
  });

  const [posts, setPosts] = useState([
    {
      id: '1',
      platform: 'linkedin',
      content: 'We are hiring! Looking for a Senior Software Engineer with React experience. Join our amazing team! #hiring #react #javascript',
      jobId: 'job1',
      publishedAt: new Date('2024-01-15T10:30:00'),
      status: 'published',
      engagement: { likes: 45, shares: 12, comments: 8, clicks: 156 }
    },
    {
      id: '2',
      platform: 'twitter',
      content: 'Great opportunity for a Product Manager in San Francisco! Remote work available. Apply now! #productmanager #remote #jobs',
      jobId: 'job2',
      scheduledAt: new Date('2024-01-20T14:00:00'),
      status: 'scheduled',
      engagement: { likes: 0, shares: 0, comments: 0, clicks: 0 }
    }
  ]);

  useEffect(() => {
    fetchSocialMediaIntegrations();
  }, [fetchSocialMediaIntegrations]);

  const handleConnect = async (platform) => {
    try {
      // In a real implementation, this would redirect to OAuth flow
      await connectSocialMedia(platform, 'mock-auth-code');
      setShowConnectModal(null);
    } catch (error) {
      console.error('Error connecting social media:', error);
    }
  };

  const handleDisconnect = (platform) => {
    // Implementation for disconnecting social media
    console.log('Disconnecting', platform);
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...newPost,
        publishedAt: newPost.scheduledAt ? null : new Date(),
        status: newPost.scheduledAt ? 'scheduled' : 'published'
      };
      
      const result = await postToSocialMedia(postData);
      setPosts(prev => [...prev, { ...result, engagement: { likes: 0, shares: 0, comments: 0, clicks: 0 } }]);
      
      setNewPost({
        platform: 'linkedin',
        content: '',
        jobId: '',
        scheduledAt: '',
        status: 'draft'
      });
      setShowPostForm(false);
    } catch (error) {
      console.error('Error posting to social media:', error);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'facebook': return <Facebook className="h-5 w-5" />;
      default: return <Share2 className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'linkedin': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'twitter': return 'text-sky-600 bg-sky-100 border-sky-200';
      case 'facebook': return 'text-blue-800 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Eye className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalEngagement = posts.reduce((acc, post) => ({
    likes: acc.likes + post.engagement.likes,
    shares: acc.shares + post.engagement.shares,
    comments: acc.comments + post.engagement.comments,
    clicks: acc.clicks + post.engagement.clicks
  }), { likes: 0, shares: 0, comments: 0, clicks: 0 });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Share2 className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Social Media Integration
              </h2>
              <p className="text-sm text-gray-500">
                Connect and manage your social media presence
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPostForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 py-4">
          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
              activeTab === 'integrations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Integrations</span>
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
              activeTab === 'posts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Posts</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              {posts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialMediaIntegrations.map((integration) => (
              <div key={integration.platform} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getPlatformColor(integration.platform)}`}>
                      {getPlatformIcon(integration.platform)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">
                        {integration.platform}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {integration.isConnected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    integration.isConnected ? 'bg-green-400' : 'bg-gray-300'
                  }`} />
                </div>

                {integration.isConnected ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p>Permissions: {integration.permissions.join(', ')}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDisconnect(integration.platform)}
                        className="flex items-center space-x-1 px-3 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors text-sm"
                      >
                        <Unlink className="h-3 w-3" />
                        <span>Disconnect</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors text-sm">
                        <Settings className="h-3 w-3" />
                        <span>Settings</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConnectModal(integration.platform)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Link className="h-4 w-4" />
                    <span>Connect</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${getPlatformColor(post.platform)}`}>
                      {getPlatformIcon(post.platform)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900 capitalize">
                          {post.platform}
                        </span>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(post.status)}
                          <span className="text-sm text-gray-500 capitalize">
                            {post.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-3">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {post.publishedAt && (
                            <span>Published: {formatDate(post.publishedAt)}</span>
                          )}
                          {post.scheduledAt && (
                            <span>Scheduled: {formatDate(post.scheduledAt)}</span>
                          )}
                        </div>
                        {post.status === 'published' && (
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Heart className="h-3 w-3" />
                              <span>{post.engagement.likes}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Share2 className="h-3 w-3" />
                              <span>{post.engagement.shares}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{post.engagement.comments}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{post.engagement.clicks}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Share2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No posts yet. Create your first social media post!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Posts</p>
                  <p className="text-2xl font-bold text-blue-900">{posts.length}</p>
                </div>
                <Share2 className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Likes</p>
                  <p className="text-2xl font-bold text-green-900">{totalEngagement.likes}</p>
                </div>
                <Heart className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Shares</p>
                  <p className="text-2xl font-bold text-purple-900">{totalEngagement.shares}</p>
                </div>
                <Share2 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Total Clicks</p>
                  <p className="text-2xl font-bold text-orange-900">{totalEngagement.clicks}</p>
                </div>
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Create Social Media Post</h3>
              <button
                onClick={() => setShowPostForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmitPost} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={newPost.platform}
                    onChange={(e) => setNewPost(prev => ({ ...prev, platform: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Job (Optional)
                  </label>
                  <select
                    value={newPost.jobId}
                    onChange={(e) => setNewPost(prev => ({ ...prev, jobId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a job</option>
                    <option value="job1">Senior Software Engineer</option>
                    <option value="job2">Product Manager</option>
                    <option value="job3">UX Designer</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Write your post content..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newPost.content.length}/280 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={newPost.scheduledAt}
                  onChange={(e) => setNewPost(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to post immediately
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {newPost.scheduledAt ? 'Schedule Post' : 'Post Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Connect {showConnectModal}
              </h3>
              <button
                onClick={() => setShowConnectModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className={`inline-flex p-4 rounded-full ${getPlatformColor(showConnectModal)} mb-4`}>
                  {getPlatformIcon(showConnectModal)}
                </div>
                <p className="text-gray-600">
                  Connect your {showConnectModal} account to start posting job opportunities and engaging with candidates.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConnectModal(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConnect(showConnectModal)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaIntegration;