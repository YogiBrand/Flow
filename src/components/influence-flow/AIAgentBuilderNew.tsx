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
  Youtube,
  Facebook,
  Download,
  FolderOpen,
  File,
  Folder,
  Type,
  BookOpen,
  ExternalLink
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
  type: 'file' | 'text' | 'website' | 'social_media' | 'knowledge_base';
  source: string;
  size?: string;
  createdAt: string;
  metadata?: any;
}

interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Resource {
  id: string;
  name: string;
  type: 'text' | 'document' | 'data';
  content: string;
  knowledge_base_id: string;
  created_at: string;
  updated_at: string;
}

const AIAgentBuilderNew: React.FC<AIAgentBuilderNewProps> = ({ agent, onBack }) => {
  const [activeTab, setActiveTab] = useState('tools');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showToolWizard, setShowToolWizard] = useState(false);
  const [showToolLibrary, setShowToolLibrary] = useState(false);
  const [showNewToolBuilder, setShowNewToolBuilder] = useState(false);
  const [showSocialMediaImport, setShowSocialMediaImport] = useState(false);
  const [showExistingKnowledgeWizard, setShowExistingKnowledgeWizard] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [agentKnowledge, setAgentKnowledge] = useState<KnowledgeItem[]>([]);

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

  // Mock data for knowledge bases - Replace with actual Supabase queries
  const mockKnowledgeBases: KnowledgeBase[] = [
    {
      id: 'kb1',
      name: 'Marketing Content',
      description: 'All marketing-related content and strategies',
      user_id: 'user1',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T15:30:00Z'
    },
    {
      id: 'kb2',
      name: 'Product Documentation',
      description: 'Technical documentation and product guides',
      user_id: 'user1',
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-18T14:20:00Z'
    },
    {
      id: 'kb3',
      name: 'Customer Support',
      description: 'FAQ, support scripts, and customer interaction guides',
      user_id: 'user1',
      created_at: '2024-01-05T08:00:00Z',
      updated_at: '2024-01-22T16:45:00Z'
    }
  ];

  const mockResources: Record<string, Resource[]> = {
    'kb1': [
      {
        id: 'res1',
        name: 'Email Campaign Templates',
        type: 'text',
        content: 'Collection of proven email templates for different campaign types...',
        knowledge_base_id: 'kb1',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 'res2',
        name: 'Social Media Strategy Guide',
        type: 'document',
        content: 'Comprehensive guide for social media marketing strategies...',
        knowledge_base_id: 'kb1',
        created_at: '2024-01-16T11:00:00Z',
        updated_at: '2024-01-16T11:00:00Z'
      },
      {
        id: 'res3',
        name: 'Lead Generation Tactics',
        type: 'text',
        content: 'Proven tactics for generating high-quality leads...',
        knowledge_base_id: 'kb1',
        created_at: '2024-01-17T09:15:00Z',
        updated_at: '2024-01-17T09:15:00Z'
      }
    ],
    'kb2': [
      {
        id: 'res4',
        name: 'API Documentation',
        type: 'document',
        content: 'Complete API reference and integration guides...',
        knowledge_base_id: 'kb2',
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z'
      },
      {
        id: 'res5',
        name: 'Feature Specifications',
        type: 'data',
        content: 'Detailed specifications for all product features...',
        knowledge_base_id: 'kb2',
        created_at: '2024-01-12T14:30:00Z',
        updated_at: '2024-01-12T14:30:00Z'
      }
    ],
    'kb3': [
      {
        id: 'res6',
        name: 'Common Support Issues',
        type: 'text',
        content: 'Frequently encountered support issues and their solutions...',
        knowledge_base_id: 'kb3',
        created_at: '2024-01-05T09:00:00Z',
        updated_at: '2024-01-05T09:00:00Z'
      },
      {
        id: 'res7',
        name: 'Customer Onboarding Scripts',
        type: 'text',
        content: 'Scripts for guiding new customers through onboarding...',
        knowledge_base_id: 'kb3',
        created_at: '2024-01-08T13:20:00Z',
        updated_at: '2024-01-08T13:20:00Z'
      }
    ]
  };

  // Tool Library Modal
  const ToolLibrary = ({ onClose }: { onClose: () => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('trending');

    const trendingTools = [
      {
        id: 'add_answer_to_kb',
        name: 'Add Answer to Knowledge Base',
        description: 'Add answers and information to your knowledge base',
        verified: true,
        icon: BookOpen,
        color: 'bg-green-500'
      },
      {
        id: 'add_comment_to_notion',
        name: 'Add Comment to Notion',
        description: 'Add comments to Notion pages and databases',
        verified: true,
        icon: FileText,
        color: 'bg-gray-800'
      },
      {
        id: 'add_comment_to_trello',
        name: 'Add Comment to Trello Card',
        description: 'Add comments to Trello cards',
        verified: true,
        icon: Briefcase,
        color: 'bg-blue-500'
      },
      {
        id: 'google_play_reviews',
        name: 'Add Google Play Store Reviews to Knowledge',
        description: 'Import and analyze Google Play Store reviews',
        verified: true,
        icon: Globe,
        color: 'bg-green-600'
      },
      {
        id: 'add_faq_entry',
        name: 'Add FAQ Entry to Knowledge Base',
        description: 'Add frequently asked questions to your knowledge base',
        verified: true,
        icon: MessageSquare,
        color: 'bg-orange-500'
      },
      {
        id: 'add_lead_to_email',
        name: 'Add Lead to Email Campaign',
        description: 'Add leads to email marketing campaigns',
        verified: true,
        icon: Mail,
        color: 'bg-blue-600'
      },
      {
        id: 'add_linkedin_employees',
        name: 'Add LinkedIn Employees to Knowledge',
        description: 'Import LinkedIn employee data to knowledge base',
        verified: true,
        icon: Linkedin,
        color: 'bg-blue-700'
      },
      {
        id: 'add_slack_threads',
        name: 'Add Slack Threads to Knowledge',
        description: 'Import Slack conversations to knowledge base',
        verified: true,
        icon: Slack,
        color: 'bg-purple-600'
      }
    ];

    const categories = [
      { id: 'all', name: 'All tools' },
      { id: 'trending', name: 'Trending' },
      { id: 'your_tools', name: 'Your tools' }
    ];

    const byUseCase = [
      { id: 'communications', name: 'Communications', icon: MessageSquare },
      { id: 'crm', name: 'CRM', icon: Users },
      { id: 'calendar', name: 'Calendar', icon: Calendar },
      { id: 'data_scraper', name: 'Data scraper', icon: Database },
      { id: 'handle_files', name: 'Handle files', icon: FileText },
      { id: 'knowledge', name: 'Knowledge', icon: BookOpen }
    ];

    const byApps = [
      { id: 'gmail', name: 'Gmail', icon: Mail },
      { id: 'google_calendar', name: 'Google Calendar', icon: Calendar },
      { id: 'hubspot', name: 'HubSpot', icon: Building },
      { id: 'outlook', name: 'Outlook', icon: Mail },
      { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
      { id: 'notion', name: 'Notion', icon: FileText },
      { id: 'slack', name: 'Slack', icon: Slack }
    ];

    const filteredTools = trendingTools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
          className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Tools</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search 9,000+ tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowNewToolBuilder(true)}
                className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New tool
              </button>
            </div>
          </div>

          <div className="flex h-[calc(90vh-140px)]">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Tools Categories */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Tools</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* By Use Case */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">By use case</h3>
                  <div className="space-y-1">
                    {byUseCase.map((useCase) => (
                      <button
                        key={useCase.id}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <useCase.icon className="w-4 h-4" />
                        {useCase.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* By Apps */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">By apps</h3>
                  <div className="space-y-1">
                    {byApps.map((app) => (
                      <button
                        key={app.id}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <app.icon className="w-4 h-4" />
                        {app.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trending</h3>
                <p className="text-gray-600">Popular tool templates from the community</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center`}>
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                            {tool.name}
                          </h4>
                          {tool.verified && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // New Tool Builder Modal
  const NewToolBuilder = ({ onClose }: { onClose: () => void }) => {
    const [toolName, setToolName] = useState('');
    const [toolDescription, setToolDescription] = useState('');
    const [toolInputs, setToolInputs] = useState<any[]>([]);
    const [toolSteps, setToolSteps] = useState<any[]>([]);
    const [showStepLibrary, setShowStepLibrary] = useState(false);

    const inputTypes = [
      { id: 'text', name: 'Text', icon: Type },
      { id: 'long_text', name: 'Long text', icon: FileText },
      { id: 'number', name: 'Number', icon: Hash },
      { id: 'json', name: 'JSON', icon: Code },
      { id: 'file_to_url', name: 'File to URL', icon: Upload },
      { id: 'table', name: 'Table', icon: Database },
      { id: 'more', name: 'More', icon: ChevronDown }
    ];

    const stepTypes = [
      { id: 'llm', name: 'LLM', icon: Brain, description: 'Use a large language model' },
      { id: 'knowledge', name: 'Knowledge', icon: BookOpen, description: 'Query knowledge base' },
      { id: 'google', name: 'Google', icon: Globe, description: 'Search Google' },
      { id: 'api', name: 'API', icon: Link, description: 'Make API calls' },
      { id: 'python', name: 'Python', icon: Code, description: 'Run Python code' }
    ];

    const addInput = (type: string) => {
      const newInput = {
        id: `input_${Date.now()}`,
        type,
        name: `New ${type}`,
        description: '',
        required: false
      };
      setToolInputs([...toolInputs, newInput]);
    };

    const removeInput = (inputId: string) => {
      setToolInputs(toolInputs.filter(input => input.id !== inputId));
    };

    const addStep = (stepType: any) => {
      const newStep = {
        id: `step_${Date.now()}`,
        type: stepType.id,
        name: stepType.name,
        description: stepType.description,
        config: {}
      };
      setToolSteps([...toolSteps, newStep]);
      setShowStepLibrary(false);
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
          className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back to Tools</span>
                </button>
                <div className="w-px h-6 bg-gray-300" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Create New Tool</h2>
                  <p className="text-sm text-gray-600">Build a custom tool for your agent</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Save changes
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Run tool
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Tool Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="Type title..."
                    className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400 w-full"
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">Unsaved</span>
                  </div>
                </div>
              </div>
              <textarea
                value={toolDescription}
                onChange={(e) => setToolDescription(e.target.value)}
                placeholder="Type short description..."
                className="w-full text-gray-600 bg-transparent border-none outline-none placeholder-gray-400 resize-none"
                rows={2}
              />
            </div>

            {/* Inputs Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Inputs</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    Configure
                  </button>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    For Agent
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Add type of input:</p>
                <div className="flex flex-wrap gap-2">
                  {inputTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => addInput(type.id)}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <type.icon className="w-4 h-4" />
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input List */}
              {toolInputs.length > 0 && (
                <div className="space-y-3">
                  {toolInputs.map((input) => (
                    <div key={input.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={input.name}
                          onChange={(e) => {
                            setToolInputs(toolInputs.map(i => 
                              i.id === input.id ? { ...i, name: e.target.value } : i
                            ));
                          }}
                          className="font-medium text-gray-900 bg-transparent border-none outline-none"
                        />
                        <button
                          onClick={() => removeInput(input.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={input.description}
                        onChange={(e) => {
                          setToolInputs(toolInputs.map(i => 
                            i.id === input.id ? { ...i, description: e.target.value } : i
                          ));
                        }}
                        placeholder="Description..."
                        className="w-full text-sm text-gray-600 bg-transparent border-none outline-none placeholder-gray-400 resize-none"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Steps Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Steps</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Define the logic of your tool. Chain together LLM prompts, call APIs, run code and more.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setShowStepLibrary(true)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Step
                </button>
                {stepTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => addStep(type)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <type.icon className="w-4 h-4" />
                    {type.name}
                  </button>
                ))}
              </div>

              {/* Steps List */}
              {toolSteps.length > 0 && (
                <div className="space-y-3">
                  {toolSteps.map((step, index) => (
                    <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{step.name}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step Library Modal */}
              {showStepLibrary && (
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
                    className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Add Step</h3>
                        <button
                          onClick={() => setShowStepLibrary(false)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        {stepTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => addStep(type)}
                            className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <type.icon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">{type.name}</h4>
                              <p className="text-sm text-gray-600">{type.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Social Media Import Wizard
  const SocialMediaImportWizard = ({ onClose }: { onClose: () => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [selectedContent, setSelectedContent] = useState<string[]>([]);

    const steps = [
      { id: 'platform', title: 'Choose Platform', icon: Globe },
      { id: 'account', title: 'Select Account', icon: User },
      { id: 'content', title: 'Choose Content', icon: FileText },
      { id: 'import', title: 'Import', icon: Download }
    ];

    const platforms = [
      { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
      { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
      { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-500' },
      { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600' },
      { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' }
    ];

    const mockAccounts = {
      instagram: [
        { id: 'ig1', name: '@yourcompany', followers: '12.5K', verified: true },
        { id: 'ig2', name: '@personal_account', followers: '2.1K', verified: false }
      ],
      linkedin: [
        { id: 'li1', name: 'Your Company Page', followers: '8.2K', verified: true },
        { id: 'li2', name: 'Personal Profile', followers: '1.5K', verified: false }
      ]
    };

    const mockContent = {
      instagram: [
        { id: 'post1', type: 'All Posts', description: 'Import all Instagram posts', count: 245 },
        { id: 'post2', type: 'Recent Posts', description: 'Last 30 days', count: 12 },
        { id: 'post3', type: 'Top Performing', description: 'Highest engagement posts', count: 25 },
        { id: 'story1', type: 'Story Highlights', description: 'Saved story highlights', count: 8 }
      ],
      linkedin: [
        { id: 'post1', type: 'All Posts', description: 'Import all LinkedIn posts', count: 156 },
        { id: 'post2', type: 'Articles', description: 'Published articles', count: 23 },
        { id: 'post3', type: 'Company Updates', description: 'Company page posts', count: 89 }
      ]
    };

    const renderStepContent = () => {
      switch (currentStep) {
        case 0:
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Social Media Platform</h3>
                <p className="text-gray-600">Select the platform you want to import content from</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      selectedPlatform === platform.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <platform.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-900">{platform.name}</h4>
                  </button>
                ))}
              </div>
            </div>
          );

        case 1:
          const accounts = mockAccounts[selectedPlatform as keyof typeof mockAccounts] || [];
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Account</h3>
                <p className="text-gray-600">Choose which account to import content from</p>
              </div>
              
              <div className="space-y-3">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => setSelectedAccount(account.id)}
                    className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                      selectedAccount === account.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{account.name}</h4>
                          {account.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{account.followers} followers</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedAccount === account.id
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAccount === account.id && (
                          <Check className="w-2 h-2 text-white m-0.5" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );

        case 2:
          const content = mockContent[selectedPlatform as keyof typeof mockContent] || [];
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Content to Import</h3>
                <p className="text-gray-600">Select what type of content you want to add to your knowledge base</p>
              </div>
              
              <div className="space-y-3">
                {content.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedContent.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedContent([...selectedContent, item.id]);
                        } else {
                          setSelectedContent(selectedContent.filter(id => id !== item.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-4"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.type}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">{item.count} items</span>
                  </label>
                ))}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Import Complete!</h3>
                <p className="text-gray-600">Your social media content has been successfully imported</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h4 className="font-medium text-gray-900">Import Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-medium text-gray-900 capitalize">{selectedPlatform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Content Types:</span>
                    <span className="font-medium text-gray-900">{selectedContent.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Imported Successfully</span>
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
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Import Social Media Content</h2>
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

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {renderStepContent()}
          </div>

          {/* Footer */}
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
                    onClick={() => {
                      if (currentStep === 0 && !selectedPlatform) return;
                      if (currentStep === 1 && !selectedAccount) return;
                      if (currentStep === 2 && selectedContent.length === 0) return;
                      setCurrentStep(currentStep + 1);
                    }}
                    disabled={
                      (currentStep === 0 && !selectedPlatform) ||
                      (currentStep === 1 && !selectedAccount) ||
                      (currentStep === 2 && selectedContent.length === 0)
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Existing Knowledge Wizard
  const ExistingKnowledgeWizard = ({ onClose }: { onClose: () => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBase | null>(null);
    const [selectedResources, setSelectedResources] = useState<string[]>([]);

    const steps = [
      { id: 'knowledge_base', title: 'Select Knowledge Base', icon: Database },
      { id: 'resources', title: 'Choose Resources', icon: FileText },
      { id: 'review', title: 'Review & Add', icon: CheckCircle }
    ];

    const getResourceIcon = (type: string) => {
      switch (type) {
        case 'document':
          return FileText;
        case 'data':
          return Database;
        default:
          return Type;
      }
    };

    const renderStepContent = () => {
      switch (currentStep) {
        case 0:
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Knowledge Base</h3>
                <p className="text-gray-600">Choose from your existing knowledge bases</p>
              </div>
              
              <div className="space-y-3">
                {mockKnowledgeBases.map((kb) => (
                  <button
                    key={kb.id}
                    onClick={() => setSelectedKnowledgeBase(kb)}
                    className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                      selectedKnowledgeBase?.id === kb.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{kb.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{kb.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Created {new Date(kb.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{mockResources[kb.id]?.length || 0} resources</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedKnowledgeBase?.id === kb.id
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedKnowledgeBase?.id === kb.id && (
                          <Check className="w-2 h-2 text-white m-0.5" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );

        case 1:
          const resources = selectedKnowledgeBase ? mockResources[selectedKnowledgeBase.id] || [] : [];
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Resources</h3>
                <p className="text-gray-600">Select specific resources from {selectedKnowledgeBase?.name}</p>
              </div>
              
              <div className="space-y-3">
                {resources.map((resource) => {
                  const ResourceIcon = getResourceIcon(resource.type);
                  return (
                    <label
                      key={resource.id}
                      className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedResources.includes(resource.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedResources([...selectedResources, resource.id]);
                          } else {
                            setSelectedResources(selectedResources.filter(id => id !== resource.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-4"
                      />
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <ResourceIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{resource.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {resource.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            resource.type === 'text' ? 'bg-green-100 text-green-700' :
                            resource.type === 'document' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {resource.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(resource.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );

        case 2:
          const selectedResourcesData = selectedKnowledgeBase 
            ? (mockResources[selectedKnowledgeBase.id] || []).filter(r => selectedResources.includes(r.id))
            : [];
          
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Add</h3>
                <p className="text-gray-600">Confirm your selections before adding to the agent</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Knowledge Base</h4>
                  <p className="text-sm text-gray-600">{selectedKnowledgeBase?.name}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Selected Resources ({selectedResourcesData.length})</h4>
                  <div className="space-y-2">
                    {selectedResourcesData.map((resource) => {
                      const ResourceIcon = getResourceIcon(resource.type);
                      return (
                        <div key={resource.id} className="flex items-center gap-3 py-2 px-3 bg-white rounded-lg border border-gray-200">
                          <ResourceIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{resource.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-auto ${
                            resource.type === 'text' ? 'bg-green-100 text-green-700' :
                            resource.type === 'document' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {resource.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    const handleAddToAgent = () => {
      if (!selectedKnowledgeBase) return;
      
      const selectedResourcesData = (mockResources[selectedKnowledgeBase.id] || [])
        .filter(r => selectedResources.includes(r.id));
      
      const newKnowledgeItems: KnowledgeItem[] = selectedResourcesData.map(resource => ({
        id: `knowledge_${Date.now()}_${resource.id}`,
        name: resource.name,
        type: 'knowledge_base',
        source: `${selectedKnowledgeBase.name} / ${resource.name}`,
        size: `${Math.floor(resource.content.length / 100)} KB`,
        createdAt: new Date().toISOString(),
        metadata: {
          knowledgeBaseId: selectedKnowledgeBase.id,
          resourceId: resource.id,
          resourceType: resource.type
        }
      }));
      
      setAgentKnowledge(prev => [...prev, ...newKnowledgeItems]);
      onClose();
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
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add Existing Knowledge</h2>
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

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {renderStepContent()}
          </div>

          {/* Footer */}
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
                    onClick={() => {
                      if (currentStep === 0 && !selectedKnowledgeBase) return;
                      if (currentStep === 1 && selectedResources.length === 0) return;
                      setCurrentStep(currentStep + 1);
                    }}
                    disabled={
                      (currentStep === 0 && !selectedKnowledgeBase) ||
                      (currentStep === 1 && selectedResources.length === 0)
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleAddToAgent}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add to Agent
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Text Editor Modal
  const TextEditorModal = ({ onClose }: { onClose: () => void }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSave = () => {
      if (!title.trim() || !content.trim()) return;
      
      const newKnowledgeItem: KnowledgeItem = {
        id: `text_${Date.now()}`,
        name: title,
        type: 'text',
        source: 'Manual Entry',
        size: `${Math.floor(content.length / 100)} KB`,
        createdAt: new Date().toISOString(),
        metadata: {
          content,
          wordCount: content.split(' ').length,
          characterCount: content.length
        }
      };
      
      setAgentKnowledge(prev => [...prev, newKnowledgeItem]);
      onClose();
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
          className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Add Text Knowledge</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for this knowledge item..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your text content here..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={12}
              />
              <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                <span>{content.split(' ').filter(word => word.length > 0).length} words</span>
                <span>{content.length} characters</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim() || !content.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Knowledge
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Tool Wizard Component
  const ToolWizard = ({ tool, onClose }: { tool: Tool; onClose: () => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [toolConfig, setToolConfig] = useState({
      description: tool.description,
      inputs: tool.inputs
    });

    const steps = [
      { id: 'description', title: 'Tool Description', icon: MessageSquare },
      { id: 'inputs', title: 'Configure Inputs', icon: Settings },
      { id: 'review', title: 'Review & Save', icon: CheckCircle }
    ];

    const renderStepContent = () => {
      switch (currentStep) {
        case 0:
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-gray-600">{tool.category}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How should the agent use this tool?
                </label>
                <textarea
                  value={toolConfig.description}
                  onChange={(e) => setToolConfig(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  placeholder="Describe how the agent should use this tool..."
                />
              </div>
            </div>
          );

        case 1:
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Configure Tool Inputs</h3>
                <p className="text-gray-600">Set up the data this tool needs to work</p>
              </div>

              <div className="space-y-4">
                {toolConfig.inputs.map((input, index) => {
                  const InputIcon = getInputIcon(input.type);
                  return (
                    <div key={input.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                          <InputIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{input.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{input.description}</p>
                          </div>

                          {input.type === 'select' && input.options && (
                            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <option value="">Select an option...</option>
                              {input.options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          )}

                          {input.type !== 'select' && (
                            <input
                              type={input.type === 'number' ? 'number' : input.type === 'email' ? 'email' : input.type === 'url' ? 'url' : 'text'}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Enter ${input.name.toLowerCase()}...`}
                              defaultValue={input.defaultValue || ''}
                            />
                          )}

                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={input.letAgentDecide}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">Let agent decide</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={input.required}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">Required</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Configuration</h3>
                <p className="text-gray-600">Confirm your tool setup before saving</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tool Description</h4>
                  <p className="text-gray-700 text-sm">{toolConfig.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Configured Inputs ({toolConfig.inputs.length})</h4>
                  <div className="space-y-2">
                    {toolConfig.inputs.map((input) => (
                      <div key={input.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-200">
                        <span className="text-sm font-medium text-gray-900">{input.name}</span>
                        <div className="flex items-center gap-2">
                          {input.letAgentDecide && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Auto</span>
                          )}
                          {input.required && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Required</span>
                          )}
                        </div>
                      </div>
                    ))}
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
                <span className="text-sm">Back to Tools</span>
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
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Save tool configuration
                      onClose();
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Tool
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
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

  // Knowledge Tab Component
  const KnowledgeTab = () => {
    const removeKnowledgeItem = (itemId: string) => {
      setAgentKnowledge(prev => prev.filter(item => item.id !== itemId));
    };

    const getKnowledgeIcon = (type: string) => {
      switch (type) {
        case 'file':
          return File;
        case 'text':
          return Type;
        case 'website':
          return Globe;
        case 'social_media':
          return Instagram;
        case 'knowledge_base':
          return Database;
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
          return 'bg-pink-100 text-pink-600';
        case 'knowledge_base':
          return 'bg-orange-100 text-orange-600';
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

        {/* Upload Knowledge Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload knowledge</h3>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center mb-6 hover:border-gray-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="mb-2">
              <span className="text-gray-700">Drag & drop or </span>
              <button className="text-blue-600 hover:text-blue-700 font-medium">choose files</button>
              <span className="text-gray-700"> to upload.</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              Supported formats: .csv, .json, .pdf, .xlsx, .xls, .txt, .md, .docx, .pptx.
            </p>
            <p className="text-sm text-gray-500">Max 5 files per upload.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowExistingKnowledgeWizard(true)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Database className="w-5 h-5 text-gray-600" />
              Add existing knowledge
            </button>
            
            <button
              onClick={() => setShowSocialMediaImport(true)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-5 h-5 text-gray-600" />
              Import Social Media Content
            </button>
            
            <button
              onClick={() => setShowTextEditor(true)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Type className="w-5 h-5 text-gray-600" />
              Text
            </button>
          </div>
        </div>

        {/* Knowledge Items List */}
        {agentKnowledge.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Added Knowledge ({agentKnowledge.length})</h3>
              <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Clear all
              </button>
            </div>
            
            <div className="space-y-3">
              {agentKnowledge.map((item) => {
                const KnowledgeIcon = getKnowledgeIcon(item.type);
                const colorClass = getKnowledgeColor(item.type);
                
                return (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <KnowledgeIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{item.source}</span>
                        {item.size && (
                          <>
                            <span>•</span>
                            <span>{item.size}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {item.type === 'file' && (
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeKnowledgeItem(item.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
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
          <ToolLibrary onClose={() => setShowToolLibrary(false)} />
        )}
        
        {showNewToolBuilder && (
          <NewToolBuilder onClose={() => setShowNewToolBuilder(false)} />
        )}
        
        {showSocialMediaImport && (
          <SocialMediaImportWizard onClose={() => setShowSocialMediaImport(false)} />
        )}
        
        {showExistingKnowledgeWizard && (
          <ExistingKnowledgeWizard onClose={() => setShowExistingKnowledgeWizard(false)} />
        )}
        
        {showTextEditor && (
          <TextEditorModal onClose={() => setShowTextEditor(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAgentBuilderNew;