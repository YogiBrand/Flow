import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Save, 
  Bot, 
  Settings, 
  Brain, 
  MessageSquare, 
  Zap,
  Plus,
  Trash2,
  TestTube,
  Play,
  Upload,
  Link,
  Globe,
  Mail,
  Database,
  FileText,
  Calendar,
  AlertTriangle,
  User,
  Code,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  Edit,
  X,
  Check,
  Clock,
  Webhook,
  Slack,
  Search,
  Filter,
  Building,
  Users,
  MapPin,
  Linkedin,
  Hash,
  Target,
  DollarSign,
  Briefcase,
  ArrowLeft,
  CheckCircle,
  Circle,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  TrendingUp,
  Image,
  Video,
  Mic,
  BookOpen,
  ExternalLink,
  Download,
  FolderOpen,
  Table,
  Type,
  Layers,
  Camera
} from 'lucide-react';

interface AIAgentBuilderNewProps {
  agent?: any | null;
  onBack: () => void;
}

// Tool configuration interface
interface ToolInput {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'email' | 'url' | 'select' | 'boolean';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  letAgentDecide: boolean;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  inputs: ToolInput[];
  enabled: boolean;
  icon: any;
  color: string;
}

interface KnowledgeItem {
  id: string;
  name: string;
  type: 'file' | 'text' | 'website' | 'social_media' | 'table';
  content?: string;
  source?: string;
  size?: string;
  createdAt: string;
}

interface SocialMediaAccount {
  id: string;
  platform: 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'youtube' | 'tiktok';
  username: string;
  displayName: string;
  profileImage: string;
  isConnected: boolean;
  followerCount?: number;
}

const AIAgentBuilderNew: React.FC<AIAgentBuilderNewProps> = ({ agent, onBack }) => {
  const [activeTab, setActiveTab] = useState('knowledge');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showToolWizard, setShowToolWizard] = useState(false);
  const [showToolLibrary, setShowToolLibrary] = useState(false);
  const [showNewToolBuilder, setShowNewToolBuilder] = useState(false);
  const [showSocialMediaImport, setShowSocialMediaImport] = useState(false);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: '1',
      name: 'Brand Guidelines.pdf',
      type: 'file',
      source: 'Upload',
      size: '2.4 MB',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Product Information',
      type: 'text',
      content: 'Our flagship product is designed for...',
      size: '1.2 KB',
      createdAt: '2024-01-14'
    }
  ]);

  // Mock social media accounts from the database
  const [socialMediaAccounts] = useState<SocialMediaAccount[]>([
    {
      id: '1',
      platform: 'instagram',
      username: '@johndoe',
      displayName: 'John Doe',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      isConnected: true,
      followerCount: 15400
    },
    {
      id: '2',
      platform: 'linkedin',
      username: 'john-doe-marketing',
      displayName: 'John Doe',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      isConnected: true,
      followerCount: 2800
    },
    {
      id: '3',
      platform: 'twitter',
      username: '@johndoemarketing',
      displayName: 'John Doe Marketing',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      isConnected: true,
      followerCount: 8900
    },
    {
      id: '4',
      platform: 'youtube',
      username: 'JohnDoeChannel',
      displayName: 'John Doe Channel',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      isConnected: false
    }
  ]);

  const [currentAgent] = useState({
    id: `agent_${Date.now()}`,
    name: 'Marketing Agent',
    description: 'Automate your marketing workflows with intelligent lead processing and engagement.',
    tools: [
      {
        id: 'lead_enrichment',
        name: 'Lead Enrichment',
        description: 'Enrich lead data with comprehensive contact and company information',
        category: 'Data Processing',
        enabled: true,
        icon: Users,
        color: 'bg-blue-500',
        inputs: [
          {
            id: 'job_title',
            name: 'Job title',
            description: "The contact's job title",
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'company_size',
            name: 'Company size',
            description: 'Number of employees (integer values only)',
            type: 'number',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'industry',
            name: 'Industry',
            description: "The contact's industry",
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'email_category',
            name: 'Email category',
            description: 'work email or personal email',
            type: 'select',
            options: ['work email', 'personal email'],
            required: false,
            letAgentDecide: true
          }
        ]
      },
      {
        id: 'lead_scoring',
        name: 'Lead Scoring',
        description: 'Score and qualify leads based on predefined criteria',
        category: 'Analysis',
        enabled: false,
        icon: Target,
        color: 'bg-green-500',
        inputs: [
          {
            id: 'current_job_title',
            name: 'Current job title',
            description: 'Input the current job title of the user',
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'personal_linkedin_url',
            name: 'Personal LinkedIn URL',
            description: 'LinkedIn profile URL',
            type: 'url',
            required: false,
            letAgentDecide: true
          }
        ]
      },
      {
        id: 'company_lookup',
        name: 'Company Lookup',
        description: 'Research and gather company information',
        category: 'Research',
        enabled: false,
        icon: Building,
        color: 'bg-purple-500',
        inputs: [
          {
            id: 'company_name',
            name: 'Company name',
            description: "The company's name",
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'email',
            name: 'Email',
            description: "Contact email address",
            type: 'email',
            required: false,
            letAgentDecide: true
          }
        ]
      },
      {
        id: 'email_validator',
        name: 'Email Validator',
        description: 'Validate and verify email addresses',
        category: 'Validation',
        enabled: false,
        icon: Mail,
        color: 'bg-orange-500',
        inputs: [
          {
            id: 'email_address',
            name: 'Email address',
            description: 'The email address to validate',
            type: 'email',
            required: true,
            letAgentDecide: false
          }
        ]
      }
    ]
  });

  const tabs = [
    { id: 'prompt', label: 'Prompt', icon: Brain, color: 'text-purple-600' },
    { id: 'tools', label: 'Tools', icon: Zap, color: 'text-blue-600' },
    { id: 'knowledge', label: 'Knowledge', icon: FileText, color: 'text-green-600' },
    { id: 'triggers', label: 'Triggers', icon: Calendar, color: 'text-yellow-600' },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle, color: 'text-red-600' },
    { id: 'metadata', label: 'Metadata', icon: Settings, color: 'text-gray-600' },
    { id: 'variables', label: 'Variables', icon: Code, color: 'text-indigo-600' }
  ];

  const toggleToolEnabled = (toolId: string) => {
    // Tool toggle logic here
  };

  const getInputIcon = (type: string) => {
    switch (type) {
      case 'email':
        return Mail;
      case 'url':
        return Link;
      case 'number':
        return Hash;
      case 'select':
        return ChevronDown;
      default:
        return FileText;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return Instagram;
      case 'linkedin':
        return Linkedin;
      case 'twitter':
        return Twitter;
      case 'facebook':
        return Facebook;
      case 'youtube':
        return Youtube;
      case 'tiktok':
        return Video;
      default:
        return Globe;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'linkedin':
        return 'bg-blue-600';
      case 'twitter':
        return 'bg-sky-500';
      case 'facebook':
        return 'bg-blue-700';
      case 'youtube':
        return 'bg-red-600';
      case 'tiktok':
        return 'bg-black';
      default:
        return 'bg-gray-500';
    }
  };

  // Social Media Import Wizard Component
  const SocialMediaImportWizard = ({ onClose }: { onClose: () => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAccount, setSelectedAccount] = useState<SocialMediaAccount | null>(null);
    const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
    const [importSettings, setImportSettings] = useState({
      dateRange: 'last_30_days',
      includeComments: false,
      includeMetrics: true,
      maxPosts: 100
    });

    const steps = [
      { id: 'account', title: 'Select Account', icon: User },
      { id: 'content', title: 'Choose Content', icon: FileText },
      { id: 'settings', title: 'Import Settings', icon: Settings },
      { id: 'review', title: 'Review & Import', icon: CheckCircle }
    ];

    const getContentOptions = (platform: string) => {
      switch (platform) {
        case 'instagram':
          return [
            { id: 'posts', label: 'All Posts', description: 'Import all your Instagram posts', icon: Image },
            { id: 'stories', label: 'Story Highlights', description: 'Import saved story highlights', icon: Circle },
            { id: 'reels', label: 'Reels', description: 'Import your Reels content', icon: Video },
            { id: 'captions', label: 'Captions Only', description: 'Import just the text captions', icon: Type }
          ];
        case 'linkedin':
          return [
            { id: 'posts', label: 'Posts', description: 'Import your LinkedIn posts', icon: FileText },
            { id: 'articles', label: 'Articles', description: 'Import published articles', icon: BookOpen },
            { id: 'profile', label: 'Profile Info', description: 'Import profile summary and experience', icon: User },
            { id: 'comments', label: 'Comments', description: 'Import your comments on posts', icon: MessageSquare }
          ];
        case 'twitter':
          return [
            { id: 'tweets', label: 'Tweets', description: 'Import your tweets', icon: Twitter },
            { id: 'threads', label: 'Threads', description: 'Import tweet threads', icon: Layers },
            { id: 'replies', label: 'Replies', description: 'Import your replies to others', icon: MessageSquare },
            { id: 'likes', label: 'Liked Tweets', description: 'Import tweets you liked', icon: Heart }
          ];
        case 'youtube':
          return [
            { id: 'videos', label: 'Videos', description: 'Import video titles and descriptions', icon: Video },
            { id: 'transcripts', label: 'Transcripts', description: 'Import video transcripts', icon: FileText },
            { id: 'comments', label: 'Comments', description: 'Import video comments', icon: MessageSquare },
            { id: 'playlists', label: 'Playlists', description: 'Import playlist information', icon: FolderOpen }
          ];
        default:
          return [];
      }
    };

    const renderStepContent = () => {
      switch (currentStep) {
        case 0:
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Social Media Account</h3>
                <p className="text-gray-600">Choose which account you want to import content from</p>
              </div>

              <div className="space-y-3">
                {socialMediaAccounts.map((account) => {
                  const PlatformIcon = getPlatformIcon(account.platform);
                  const platformColor = getPlatformColor(account.platform);
                  
                  return (
                    <div
                      key={account.id}
                      onClick={() => account.isConnected && setSelectedAccount(account)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedAccount?.id === account.id
                          ? 'border-blue-500 bg-blue-50'
                          : account.isConnected
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-100 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${platformColor} rounded-xl flex items-center justify-center`}>
                          <PlatformIcon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{account.displayName}</h4>
                            {account.isConnected && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Connected</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{account.username}</p>
                          {account.followerCount && (
                            <p className="text-xs text-gray-500">{account.followerCount.toLocaleString()} followers</p>
                          )}
                        </div>

                        {!account.isConnected && (
                          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );

        case 1:
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Content to Import</h3>
                <p className="text-gray-600">Select what type of content you want to import from {selectedAccount?.displayName}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getContentOptions(selectedAccount?.platform || '').map((option) => (
                  <div
                    key={option.id}
                    onClick={() => {
                      setSelectedContentTypes(prev => 
                        prev.includes(option.id)
                          ? prev.filter(id => id !== option.id)
                          : [...prev, option.id]
                      );
                    }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedContentTypes.includes(option.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <option.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{option.label}</h4>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Import Settings</h3>
                <p className="text-gray-600">Configure how you want to import the content</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
                  <select
                    value={importSettings.dateRange}
                    onChange={(e) => setImportSettings(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="last_7_days">Last 7 days</option>
                    <option value="last_30_days">Last 30 days</option>
                    <option value="last_90_days">Last 90 days</option>
                    <option value="last_year">Last year</option>
                    <option value="all_time">All time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Maximum Posts</label>
                  <input
                    type="number"
                    value={importSettings.maxPosts}
                    onChange={(e) => setImportSettings(prev => ({ ...prev, maxPosts: parseInt(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="100"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={importSettings.includeComments}
                      onChange={(e) => setImportSettings(prev => ({ ...prev, includeComments: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Include comments and replies</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={importSettings.includeMetrics}
                      onChange={(e) => setImportSettings(prev => ({ ...prev, includeMetrics: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Include engagement metrics (likes, shares, etc.)</span>
                  </label>
                </div>
              </div>
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Import Settings</h3>
                <p className="text-gray-600">Confirm your settings before importing</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${getPlatformColor(selectedAccount?.platform || '')} rounded-lg flex items-center justify-center`}>
                    {selectedAccount && React.createElement(getPlatformIcon(selectedAccount.platform), { className: "w-5 h-5 text-white" })}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedAccount?.displayName}</h4>
                    <p className="text-sm text-gray-600">{selectedAccount?.username}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Content Types ({selectedContentTypes.length})</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedContentTypes.map((type) => {
                      const option = getContentOptions(selectedAccount?.platform || '').find(o => o.id === type);
                      return (
                        <span key={type} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {option?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Date Range:</span>
                    <p className="text-gray-600">{importSettings.dateRange.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Max Posts:</span>
                    <p className="text-gray-600">{importSettings.maxPosts}</p>
                  </div>
                </div>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Wizard Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Knowledge</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-3 ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      index < currentStep 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : index === currentStep 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      {index < currentStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Wizard Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {renderStepContent()}
          </div>

          {/* Wizard Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-3">
                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={
                      (currentStep === 0 && !selectedAccount) ||
                      (currentStep === 1 && selectedContentTypes.length === 0)
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Handle import logic here
                      const newKnowledgeItem: KnowledgeItem = {
                        id: `social_${Date.now()}`,
                        name: `${selectedAccount?.platform} - ${selectedContentTypes.join(', ')}`,
                        type: 'social_media',
                        source: selectedAccount?.username,
                        size: `${selectedContentTypes.length} content types`,
                        createdAt: new Date().toISOString().split('T')[0]
                      };
                      setKnowledgeItems(prev => [...prev, newKnowledgeItem]);
                      onClose();
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Import Content
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Tool Library Modal Component
  const ToolLibraryModal = ({ onClose }: { onClose: () => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const availableTools = [
      {
        id: 'web_scraper',
        name: 'Web Scraper',
        description: 'Extract data from web pages',
        type: 'web_scraper' as const,
        category: 'Data Processing',
        icon: Globe,
        verified: true
      },
      {
        id: 'search_tool',
        name: 'Search Tool',
        description: 'Search the web for information',
        type: 'search_tool' as const,
        category: 'Research',
        icon: Search,
        verified: true
      },
      {
        id: 'api_call',
        name: 'API Call',
        description: 'Make HTTP requests to external APIs',
        type: 'api_call' as const,
        category: 'Integration',
        icon: Link,
        verified: true
      },
      {
        id: 'data_extractor',
        name: 'Data Extractor',
        description: 'Extract and process structured data',
        type: 'data_extractor' as const,
        category: 'Data Processing',
        icon: Database,
        verified: true
      },
      {
        id: 'code_interpreter',
        name: 'Code Interpreter',
        description: 'Execute Python code for data analysis',
        type: 'code_interpreter' as const,
        category: 'Development',
        icon: Code,
        verified: true
      },
      {
        id: 'email_sender',
        name: 'Email Sender',
        description: 'Send emails via SMTP or API',
        type: 'email_sender' as const,
        category: 'Communication',
        icon: Mail,
        verified: true
      }
    ];

    const categories = [
      { id: 'all', label: 'All Tools' },
      { id: 'trending', label: 'Trending' },
      { id: 'your_tools', label: 'Your Tools' },
      { id: 'from_community', label: 'From Community' }
    ];

    const filteredTools = availableTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Tools</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search 9,000+ tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* New Tool Button */}
            <button
              onClick={() => {
                onClose();
                setShowNewToolBuilder(true);
              }}
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 mb-4"
            >
              <Plus className="w-4 h-4" />
              New tool
            </button>

            {/* Categories */}
            <div className="flex gap-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => {
                    // Add tool to agent
                    onClose();
                  }}
                  className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                      <tool.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{tool.name}</h4>
                        {tool.verified && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // New Tool Builder Component
  const NewToolBuilder = ({ onClose }: { onClose: () => void }) => {
    const [toolName, setToolName] = useState('');
    const [toolDescription, setToolDescription] = useState('');
    const [inputs, setInputs] = useState<any[]>([]);
    const [steps, setSteps] = useState<any[]>([]);
    const [showStepSearch, setShowStepSearch] = useState(false);

    const inputTypes = [
      { id: 'text', label: 'Text', icon: Type },
      { id: 'long_text', label: 'Long text', icon: FileText },
      { id: 'number', label: 'Number', icon: Hash },
      { id: 'json', label: 'JSON', icon: Code },
      { id: 'file_url', label: 'File to URL', icon: Link },
      { id: 'table', label: 'Table', icon: Table }
    ];

    const moreInputTypes = [
      { id: 'checkbox', label: 'Checkbox', icon: CheckCircle },
      { id: 'text_list', label: 'Text list', icon: FileText },
      { id: 'json_list', label: 'List of JSONs', icon: Code },
      { id: 'file_text', label: 'File to text', icon: FileText },
      { id: 'multiple_files', label: 'Multiple files to URLs', icon: Link },
      { id: 'api_key', label: 'API key input', icon: Key },
      { id: 'oauth', label: 'OAuth account', icon: User }
    ];

    const stepTypes = [
      { id: 'llm', label: 'LLM', icon: Brain, color: 'bg-purple-500' },
      { id: 'knowledge', label: 'Knowledge', icon: BookOpen, color: 'bg-green-500' },
      { id: 'google', label: 'Google', icon: Search, color: 'bg-blue-500' },
      { id: 'api', label: 'API', icon: Link, color: 'bg-orange-500' },
      { id: 'python', label: 'Python', icon: Code, color: 'bg-yellow-500' },
      { id: 'javascript', label: 'Javascript', icon: Code, color: 'bg-indigo-500' }
    ];

    const availableSteps = [
      { id: 'api', name: 'API', description: 'Run an API request', verified: true, icon: Link },
      { id: 'extract_website', name: 'Extract website content', description: 'Scrape and access website content from a link or URL', verified: true, icon: Globe },
      { id: 'google_search', name: 'Google Search', description: 'Search the web for keywords using Google and get the top website results', verified: true, icon: Search },
      { id: 'javascript', name: 'Javascript Code', description: 'Run Javascript code', verified: true, icon: Code },
      { id: 'llm', name: 'LLM', description: 'Use a large language model such as GPT', verified: true, icon: Brain },
      { id: 'llm_vision', name: 'LLM Vision', description: 'Use a large multimodal model such as GPT4o or Gemini 1.5 Pro', verified: true, icon: Eye },
      { id: 'note', name: 'Note', description: 'Insert markdown notes', verified: true, icon: FileText },
      { id: 'python', name: 'Python Code', description: 'Run Python code', verified: true, icon: Code }
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-50 z-50"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Tools</span>
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Untitled tool</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Unsaved</span>
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium">
                Save changes
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
                <Play className="w-4 h-4" />
                Run tool
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Title and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-600" />
              </div>
              <input
                type="text"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                placeholder="Type title..."
                className="text-2xl font-semibold text-gray-900 bg-transparent border-none outline-none flex-1"
              />
            </div>
            <input
              type="text"
              value={toolDescription}
              onChange={(e) => setToolDescription(e.target.value)}
              placeholder="Type short description..."
              className="text-gray-600 bg-transparent border-none outline-none w-full"
            />
          </div>

          {/* Inputs Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Inputs</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configure
                </button>
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  For Agent
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">Add type of input:</p>
              <div className="flex flex-wrap gap-2">
                {inputTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      const newInput = {
                        id: `input_${Date.now()}`,
                        type: type.id,
                        label: type.label,
                        name: '',
                        description: '',
                        required: false
                      };
                      setInputs(prev => [...prev, newInput]);
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </button>
                ))}
                <div className="relative">
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    More
                  </button>
                </div>
              </div>
            </div>

            {inputs.length > 0 && (
              <div className="space-y-3">
                {inputs.map((input) => (
                  <div key={input.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{input.label}</h4>
                      <button
                        onClick={() => setInputs(prev => prev.filter(i => i.id !== input.id))}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Input name"
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Steps Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Steps</h3>
            </div>
            
            <p className="text-gray-600 text-sm mb-6">
              Define the logic of your tool. Chain together LLM prompts, call APIs, run code and more.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setShowStepSearch(true)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
              {stepTypes.map((type) => (
                <button
                  key={type.id}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </button>
              ))}
            </div>

            {/* Step Search Modal */}
            {showStepSearch && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Add Step</h3>
                      <button
                        onClick={() => setShowStepSearch(false)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search 9,000+ tool steps..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex gap-1 mt-4">
                      <button className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm">All</button>
                      <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Your tools</button>
                      <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">From community</button>
                    </div>
                  </div>
                  <div className="p-4 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableSteps.map((step) => (
                        <div
                          key={step.id}
                          onClick={() => {
                            setSteps(prev => [...prev, { ...step, id: `step_${Date.now()}` }]);
                            setShowStepSearch(false);
                          }}
                          className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <step.icon className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900 text-sm">{step.name}</h4>
                                {step.verified && (
                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600">{step.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {steps.length > 0 && (
              <div className="space-y-3">
                {steps.map((step) => (
                  <div key={step.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                          <step.icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{step.name}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSteps(prev => prev.filter(s => s.id !== step.id))}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Knowledge Tab Component
  const KnowledgeTab = () => {
    const [knowledgeText, setKnowledgeText] = useState('');
    const [activeKnowledgeTab, setActiveKnowledgeTab] = useState<'upload' | 'social_media'>('upload');

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        Array.from(files).forEach(file => {
          const newItem: KnowledgeItem = {
            id: `file_${Date.now()}_${Math.random()}`,
            name: file.name,
            type: 'file',
            source: 'Upload',
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            createdAt: new Date().toISOString().split('T')[0]
          };
          setKnowledgeItems(prev => [...prev, newItem]);
        });
      }
    };

    const addTextKnowledge = () => {
      if (knowledgeText.trim()) {
        const newItem: KnowledgeItem = {
          id: `text_${Date.now()}`,
          name: 'Custom Text Knowledge',
          type: 'text',
          content: knowledgeText,
          size: `${knowledgeText.length} chars`,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setKnowledgeItems(prev => [...prev, newItem]);
        setKnowledgeText('');
      }
    };

    const getKnowledgeIcon = (type: string) => {
      switch (type) {
        case 'file':
          return FileText;
        case 'text':
          return Type;
        case 'website':
          return Globe;
        case 'social_media':
          return Users;
        case 'table':
          return Table;
        default:
          return FileText;
      }
    };

    const getKnowledgeColor = (type: string) => {
      switch (type) {
        case 'file':
          return 'bg-blue-100 text-blue-600';
        case 'text':
          return 'bg-green-100 text-green-600';
        case 'website':
          return 'bg-purple-100 text-purple-600';
        case 'social_media':
          return 'bg-orange-100 text-orange-600';
        case 'table':
          return 'bg-yellow-100 text-yellow-600';
        default:
          return 'bg-gray-100 text-gray-600';
      }
    };

    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Knowledge</h2>
          <p className="text-gray-600">Import data to teach your agents about new topics.</p>
        </div>

        {/* Knowledge Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveKnowledgeTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeKnowledgeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload Knowledge
            </button>
            <button
              onClick={() => setActiveKnowledgeTab('social_media')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeKnowledgeTab === 'social_media'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Import Social Media Content
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeKnowledgeTab === 'upload' && (
          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload knowledge</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".csv,.json,.pdf,.xlsx,.xls,.txt,.md,.docx,.pptx"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-2">
                    Drag & drop or <span className="text-blue-600 hover:text-blue-700">choose files</span> to upload.
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    Supported formats: .csv, .json, .pdf, .xlsx, .xls, .txt, .md, .docx, .pptx.
                  </p>
                  <p className="text-sm text-gray-500">Max 5 files per upload.</p>
                </label>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <p className="text-gray-600 mb-4">or</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Add existing knowledge</span>
                  </div>
                </button>
                
                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Import website</span>
                  </div>
                </button>
                
                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <Table className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Blank table</span>
                  </div>
                </button>
                
                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <Type className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Markdown/Text</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Text Editor Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Text Knowledge</h3>
              <textarea
                value={knowledgeText}
                onChange={(e) => setKnowledgeText(e.target.value)}
                placeholder="Enter your knowledge content here..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={addTextKnowledge}
                  disabled={!knowledgeText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Knowledge
                </button>
              </div>
            </div>
          </div>
        )}

        {activeKnowledgeTab === 'social_media' && (
          <div className="space-y-8">
            {/* Social Media Import Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Import Social Media Content</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Import your social media posts, profiles, and content to train your AI agent with your brand voice and style.
              </p>
              <button
                onClick={() => setShowSocialMediaImport(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Import
              </button>
            </div>

            {/* Connected Accounts Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Accounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialMediaAccounts.filter(account => account.isConnected).map((account) => {
                  const PlatformIcon = getPlatformIcon(account.platform);
                  const platformColor = getPlatformColor(account.platform);
                  
                  return (
                    <div key={account.id} className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 ${platformColor} rounded-lg flex items-center justify-center`}>
                          <PlatformIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{account.displayName}</h4>
                          <p className="text-sm text-gray-600">{account.username}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSocialMediaImport(true)}
                        className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Import Content
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Existing Knowledge Items */}
        {knowledgeItems.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Base ({knowledgeItems.length})</h3>
            <div className="space-y-3">
              {knowledgeItems.map((item) => {
                const ItemIcon = getKnowledgeIcon(item.type);
                const itemColor = getKnowledgeColor(item.type);
                
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${itemColor} rounded-lg flex items-center justify-center`}>
                        <ItemIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{item.source || item.type}</span>
                          <span>•</span>
                          <span>{item.size}</span>
                          <span>•</span>
                          <span>{item.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setKnowledgeItems(prev => prev.filter(i => i.id !== item.id))}
                        className="p-2 text-red-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Tools Tab Component
  const ToolsTab = () => {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentAgent.name}</h2>
            <p className="text-gray-600 mt-1">{currentAgent.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Play className="w-4 h-4" />
              Run
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Build
            </button>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentAgent.tools.map((tool: Tool) => (
            <div key={tool.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tool.enabled}
                    onChange={() => toggleToolEnabled(tool.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {tool.category}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {tool.inputs.length} input{tool.inputs.length !== 1 ? 's' : ''}
                </div>
                <button
                  onClick={() => {
                    setSelectedTool(tool);
                    setShowToolWizard(true);
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Configure
                </button>
              </div>
            </div>
          ))}

          {/* Add New Tool Card */}
          <div
            onClick={() => setShowToolLibrary(true)}
            className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Add New Tool</h3>
            <p className="text-sm text-gray-600">Extend your agent's capabilities</p>
          </div>
        </div>

        {/* Variables Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Variables</h3>
              <p className="text-sm text-gray-600">
                Reuse values throughout your agent with variables like <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{customer_name}}'}</code>
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Variable
            </button>
          </div>
          
          <div className="text-center py-8 text-gray-500">
            <Code className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium mb-1">No variables defined</p>
            <p className="text-sm">Create variables to reuse data across your agent</p>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tools':
        return <ToolsTab />;
      case 'knowledge':
        return <KnowledgeTab />;
      case 'prompt':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Prompt Configuration</h3>
            <p className="text-gray-600">Configure your agent's personality and instructions.</p>
          </div>
        );
      case 'triggers':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Calendar className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Automation Triggers</h3>
            <p className="text-gray-600">Set up when and how your agent should run automatically.</p>
          </div>
        );
      case 'escalations':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Escalation Rules</h3>
            <p className="text-gray-600">Define fallback actions when your agent needs help.</p>
          </div>
        );
      case 'metadata':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Agent Metadata</h3>
            <p className="text-gray-600">General information and settings for your agent.</p>
          </div>
        );
      case 'variables':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Code className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Global Variables</h3>
            <p className="text-gray-600">Define reusable variables for your agent workflows.</p>
          </div>
        );
      default:
        return <ToolsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Back to Agents</span>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentAgent.name}
              </h1>
              <p className="text-sm text-gray-600">AI Agent Configuration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Test Agent
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Agent
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ''}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showToolWizard && selectedTool && (
          <ToolWizard
            tool={selectedTool}
            onClose={() => {
              setShowToolWizard(false);
              setSelectedTool(null);
            }}
          />
        )}
        
        {showToolLibrary && (
          <ToolLibraryModal
            onClose={() => setShowToolLibrary(false)}
          />
        )}
        
        {showNewToolBuilder && (
          <NewToolBuilder
            onClose={() => setShowNewToolBuilder(false)}
          />
        )}
        
        {showSocialMediaImport && (
          <SocialMediaImportWizard
            onClose={() => setShowSocialMediaImport(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAgentBuilderNew;