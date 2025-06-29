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
  TrendingUp,
  Star,
  Folder,
  Phone,
  Calendar as CalendarIcon,
  FileSpreadsheet,
  Image,
  Video,
  Mic,
  Camera,
  Shield,
  Key,
  Cpu,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Type,
  List,
  ToggleLeft,
  Upload as UploadIcon,
  Table,
  MoreHorizontal,
  Layers,
  Sparkles
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

interface AvailableTool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  provider: string;
  trending?: boolean;
  popular?: boolean;
}

interface CustomToolStep {
  id: string;
  type: 'llm' | 'api' | 'knowledge' | 'google' | 'python' | 'javascript';
  name: string;
  description: string;
  config: Record<string, any>;
}

interface CustomTool {
  id: string;
  name: string;
  description: string;
  inputs: Array<{
    id: string;
    name: string;
    type: string;
    description: string;
    required: boolean;
  }>;
  steps: CustomToolStep[];
}

const AIAgentBuilderNew: React.FC<AIAgentBuilderNewProps> = ({ agent, onBack }) => {
  const [activeTab, setActiveTab] = useState('tools');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showToolWizard, setShowToolWizard] = useState(false);
  const [showToolLibrary, setShowToolLibrary] = useState(false);
  const [showNewToolBuilder, setShowNewToolBuilder] = useState(false);

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

  // Available tools for the library
  const availableTools: AvailableTool[] = [
    // Trending Tools
    {
      id: 'knowledge_base_search',
      name: 'Add Answer to Knowledge Base',
      description: 'Search and retrieve information from knowledge bases',
      category: 'Knowledge',
      icon: Brain,
      color: 'bg-green-500',
      provider: 'Relevance AI',
      trending: true
    },
    {
      id: 'notion_comment',
      name: 'Add Comment to Notion',
      description: 'Add comments and notes to Notion pages',
      category: 'Communications',
      icon: FileText,
      color: 'bg-gray-800',
      provider: 'Relevance AI'
    },
    {
      id: 'trello_comment',
      name: 'Add Comment to Trello Card',
      description: 'Add comments to Trello cards for project management',
      category: 'Communications',
      icon: Briefcase,
      color: 'bg-blue-600',
      provider: 'Relevance AI'
    },
    {
      id: 'google_reviews',
      name: 'Add Google Play Store Reviews to Knowledge',
      description: 'Extract and analyze Google Play Store reviews',
      category: 'Data scraper',
      icon: Star,
      color: 'bg-yellow-500',
      provider: 'Relevance AI'
    },
    {
      id: 'faq_entry',
      name: 'Add FAQ Entry to Knowledge Base',
      description: 'Create and manage FAQ entries in knowledge bases',
      category: 'Knowledge',
      icon: MessageSquare,
      color: 'bg-orange-500',
      provider: 'Relevance AI'
    },
    {
      id: 'email_campaign',
      name: 'Add Lead to Email Campaign',
      description: 'Add qualified leads to email marketing campaigns',
      category: 'CRM',
      icon: Mail,
      color: 'bg-blue-500',
      provider: 'Relevance AI'
    },
    {
      id: 'linkedin_employees',
      name: 'Add LinkedIn Employees to Knowledge',
      description: 'Extract employee data from LinkedIn company pages',
      category: 'Data scraper',
      icon: Linkedin,
      color: 'bg-blue-700',
      provider: 'Relevance AI'
    },
    {
      id: 'linear_tickets',
      name: 'Add Linear Tickets to Knowledge Base',
      description: 'Import and organize Linear tickets in knowledge base',
      category: 'Knowledge',
      icon: Target,
      color: 'bg-purple-600',
      provider: 'Relevance AI'
    },
    {
      id: 'slack_threads',
      name: 'Add Slack Threads to Knowledge',
      description: 'Archive important Slack conversations to knowledge base',
      category: 'Communications',
      icon: Slack,
      color: 'bg-green-600',
      provider: 'Relevance AI'
    },
    {
      id: 'steam_reviews',
      name: 'Add Steam Game Reviews to Knowledge',
      description: 'Collect and analyze Steam game reviews',
      category: 'Data scraper',
      icon: Activity,
      color: 'bg-gray-700',
      provider: 'Relevance AI'
    },
    {
      id: 'candidate_tags',
      name: 'Add Tags and Note to Candidate in Ashby',
      description: 'Tag and annotate candidates in Ashby ATS',
      category: 'CRM',
      icon: User,
      color: 'bg-indigo-500',
      provider: 'Relevance AI'
    },
    // Additional tools by category
    {
      id: 'hubspot_contact',
      name: 'Create HubSpot Contact',
      description: 'Create new contacts in HubSpot CRM',
      category: 'CRM',
      icon: Building,
      color: 'bg-orange-600',
      provider: 'HubSpot'
    },
    {
      id: 'google_calendar',
      name: 'Schedule Google Calendar Event',
      description: 'Create calendar events and schedule meetings',
      category: 'Calendar',
      icon: CalendarIcon,
      color: 'bg-blue-500',
      provider: 'Google Calendar'
    },
    {
      id: 'outlook_email',
      name: 'Send Outlook Email',
      description: 'Send emails through Outlook',
      category: 'Communications',
      icon: Mail,
      color: 'bg-blue-600',
      provider: 'Outlook'
    },
    {
      id: 'web_scraper',
      name: 'Web Scraper',
      description: 'Extract data from any website',
      category: 'Data scraper',
      icon: Globe,
      color: 'bg-gray-600',
      provider: 'Built-in'
    },
    {
      id: 'api_call',
      name: 'HTTP API Call',
      description: 'Make HTTP requests to external APIs',
      category: 'Data scraper',
      icon: Webhook,
      color: 'bg-purple-500',
      provider: 'Built-in'
    },
    {
      id: 'data_analysis',
      name: 'Data Analysis',
      description: 'Analyze and process structured data',
      category: 'Data scraper',
      icon: BarChart,
      color: 'bg-green-500',
      provider: 'Built-in'
    }
  ];

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

  // New Tool Builder Component
  const NewToolBuilder = ({ onClose }: { onClose: () => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [toolData, setToolData] = useState<CustomTool>({
      id: `custom_tool_${Date.now()}`,
      name: '',
      description: '',
      inputs: [],
      steps: []
    });

    const [showInputDropdown, setShowInputDropdown] = useState(false);
    const [showStepDropdown, setShowStepDropdown] = useState(false);

    const inputTypes = [
      { id: 'text', label: 'Text', icon: Type, description: 'Single line text input' },
      { id: 'long_text', label: 'Long text', icon: FileText, description: 'Multi-line text area' },
      { id: 'number', label: 'Number', icon: Hash, description: 'Numeric input' },
      { id: 'json', label: 'JSON', icon: Code, description: 'JSON object input' },
      { id: 'file_url', label: 'File to URL', icon: UploadIcon, description: 'File upload to URL' },
      { id: 'table', label: 'Table', icon: Table, description: 'Structured table data' },
      { id: 'more', label: 'More', icon: MoreHorizontal, description: 'Additional input types' }
    ];

    const stepTypes = [
      { id: 'llm', label: 'LLM', icon: Brain, description: 'Use a large language model such as GPT', color: 'bg-purple-600' },
      { id: 'knowledge', label: 'Knowledge', icon: Database, description: 'Search knowledge bases', color: 'bg-green-600' },
      { id: 'google', label: 'Google', icon: Search, description: 'Search the web for keywords using Google', color: 'bg-blue-500' },
      { id: 'api', label: 'API', icon: Webhook, description: 'Run an API request', color: 'bg-indigo-600' },
      { id: 'python', label: 'Python', icon: Code, description: 'Run Python code', color: 'bg-yellow-600' },
      { id: 'javascript', label: 'Javascript Code', icon: Code, description: 'Run Javascript code', color: 'bg-orange-500' }
    ];

    const addInput = (type: string) => {
      const newInput = {
        id: `input_${Date.now()}`,
        name: `Input ${toolData.inputs.length + 1}`,
        type,
        description: '',
        required: false
      };
      setToolData(prev => ({
        ...prev,
        inputs: [...prev.inputs, newInput]
      }));
      setShowInputDropdown(false);
    };

    const addStep = (type: string) => {
      const newStep: CustomToolStep = {
        id: `step_${Date.now()}`,
        type: type as any,
        name: `${type.toUpperCase()} Step`,
        description: '',
        config: {}
      };
      setToolData(prev => ({
        ...prev,
        steps: [...prev.steps, newStep]
      }));
      setShowStepDropdown(false);
    };

    const removeInput = (inputId: string) => {
      setToolData(prev => ({
        ...prev,
        inputs: prev.inputs.filter(input => input.id !== inputId)
      }));
    };

    const removeStep = (stepId: string) => {
      setToolData(prev => ({
        ...prev,
        steps: prev.steps.filter(step => step.id !== stepId)
      }));
    };

    const getStepIcon = (type: string) => {
      const stepType = stepTypes.find(s => s.id === type);
      return stepType?.icon || Code;
    };

    const getStepColor = (type: string) => {
      const stepType = stepTypes.find(s => s.id === type);
      return stepType?.color || 'bg-gray-600';
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
          className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
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
                  <span className="text-sm">Tools</span>
                </button>
                <span className="text-gray-400">/</span>
                <span className="text-sm text-gray-600">Untitled tool</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Unsaved</span>
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Save changes
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Run tool
                </button>
              </div>
            </div>

            {/* Tool Title and Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={toolData.name}
                  onChange={(e) => setToolData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Type title..."
                  className="text-2xl font-semibold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400 flex-1"
                />
              </div>
              <input
                type="text"
                value={toolData.description}
                onChange={(e) => setToolData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Type short description..."
                className="text-gray-600 bg-transparent border-none outline-none placeholder-gray-400 w-full"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Inputs Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Inputs</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Configure
                  </button>
                  <button className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    For Agent
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm">Add type of input:</p>

              {/* Input Type Buttons */}
              <div className="flex flex-wrap gap-2">
                {inputTypes.map((inputType) => (
                  <button
                    key={inputType.id}
                    onClick={() => inputType.id === 'more' ? setShowInputDropdown(!showInputDropdown) : addInput(inputType.id)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
                  >
                    <inputType.icon className="w-4 h-4" />
                    {inputType.label}
                  </button>
                ))}
              </div>

              {/* Input Dropdown */}
              {showInputDropdown && (
                <div className="relative">
                  <div className="absolute top-2 left-0 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">Select input...</span>
                        <button
                          onClick={() => setShowInputDropdown(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-500 mb-2">Options</div>
                        {[
                          { id: 'checkbox', label: 'Checkbox', icon: CheckCircle },
                          { id: 'text_list', label: 'Text list', icon: List },
                          { id: 'json_list', label: 'List of JSONs', icon: Code },
                          { id: 'file_text', label: 'File to text', icon: FileText },
                          { id: 'multiple_files', label: 'Multiple files to URLs', icon: UploadIcon },
                          { id: 'api_key', label: 'API key input', icon: Key },
                          { id: 'oauth', label: 'OAuth account', icon: Shield }
                        ].map((option) => (
                          <button
                            key={option.id}
                            onClick={() => addInput(option.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                          >
                            <option.icon className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-900">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Added Inputs */}
              {toolData.inputs.map((input) => (
                <div key={input.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={input.name}
                        onChange={(e) => setToolData(prev => ({
                          ...prev,
                          inputs: prev.inputs.map(i => i.id === input.id ? { ...i, name: e.target.value } : i)
                        }))}
                        className="font-medium text-gray-900 bg-transparent border-none outline-none mb-2"
                        placeholder="Input name"
                      />
                      <input
                        type="text"
                        value={input.description}
                        onChange={(e) => setToolData(prev => ({
                          ...prev,
                          inputs: prev.inputs.map(i => i.id === input.id ? { ...i, description: e.target.value } : i)
                        }))}
                        className="text-sm text-gray-600 bg-transparent border-none outline-none w-full"
                        placeholder="Input description"
                      />
                    </div>
                    <button
                      onClick={() => removeInput(input.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Steps Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Steps</h3>
              </div>

              <p className="text-gray-600 text-sm">
                Define the logic of your tool. Chain together LLM prompts, call APIs, run code and more.
              </p>

              {/* Step Type Buttons */}
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowStepDropdown(!showStepDropdown)}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Step
                  </button>

                  {/* Step Dropdown */}
                  {showStepDropdown && (
                    <div className="absolute top-12 left-0 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-900">Search 9,000+ tool steps...</span>
                          <button
                            onClick={() => setShowStepDropdown(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">All</button>
                          <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Your tools</button>
                          <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">From community</button>
                        </div>

                        <div className="space-y-2">
                          {stepTypes.map((stepType) => (
                            <button
                              key={stepType.id}
                              onClick={() => addStep(stepType.id)}
                              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left border border-gray-100"
                            >
                              <div className={`w-8 h-8 ${stepType.color} rounded-lg flex items-center justify-center`}>
                                <stepType.icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{stepType.label}</div>
                                <div className="text-xs text-gray-600">{stepType.description}</div>
                              </div>
                              <div className="ml-auto">
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Verified</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {stepTypes.slice(0, 5).map((stepType) => (
                  <button
                    key={stepType.id}
                    onClick={() => addStep(stepType.id)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
                  >
                    <stepType.icon className="w-4 h-4" />
                    {stepType.label}
                  </button>
                ))}
              </div>

              {/* Added Steps */}
              {toolData.steps.map((step, index) => {
                const StepIcon = getStepIcon(step.type);
                const stepColor = getStepColor(step.type);
                
                return (
                  <div key={step.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 ${stepColor} rounded-lg flex items-center justify-center`}>
                          <StepIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={step.name}
                            onChange={(e) => setToolData(prev => ({
                              ...prev,
                              steps: prev.steps.map(s => s.id === step.id ? { ...s, name: e.target.value } : s)
                            }))}
                            className="font-medium text-gray-900 bg-transparent border-none outline-none mb-1"
                            placeholder="Step name"
                          />
                          <input
                            type="text"
                            value={step.description}
                            onChange={(e) => setToolData(prev => ({
                              ...prev,
                              steps: prev.steps.map(s => s.id === step.id ? { ...s, description: e.target.value } : s)
                            }))}
                            className="text-sm text-gray-600 bg-transparent border-none outline-none w-full"
                            placeholder="Step description"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Verified</span>
                        <button
                          onClick={() => removeStep(step.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Tool Library Component
  const ToolLibrary = ({ onClose, onSelectTools }: { onClose: () => void; onSelectTools: (tools: AvailableTool[]) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All tools');
    const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());

    const categories = [
      { id: 'All tools', label: 'All tools', icon: Folder },
      { id: 'Trending', label: 'Trending', icon: TrendingUp },
      { id: 'Your tools', label: 'Your tools', icon: User },
      { id: 'Communications', label: 'Communications', icon: MessageSquare },
      { id: 'CRM', label: 'CRM', icon: Users },
      { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
      { id: 'Data scraper', label: 'Data scraper', icon: Database },
      { id: 'Handle files', label: 'Handle files', icon: FileText },
      { id: 'Knowledge', label: 'Knowledge', icon: Brain }
    ];

    const appCategories = [
      { id: 'Gmail', label: 'Gmail', icon: Mail, color: 'text-red-500' },
      { id: 'Google Calendar', label: 'Google Calendar', icon: CalendarIcon, color: 'text-blue-500' },
      { id: 'HubSpot', label: 'HubSpot', icon: Building, color: 'text-orange-500' },
      { id: 'Outlook', label: 'Outlook', icon: Mail, color: 'text-blue-600' },
      { id: 'LinkedIn', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
      { id: 'Notion', label: 'Notion', icon: FileText, color: 'text-gray-800' },
      { id: 'Slack', label: 'Slack', icon: Slack, color: 'text-green-600' }
    ];

    const filteredTools = availableTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedCategory === 'All tools') return matchesSearch;
      if (selectedCategory === 'Trending') return matchesSearch && tool.trending;
      if (selectedCategory === 'Your tools') return matchesSearch && false; // No user tools for now
      
      return matchesSearch && tool.category === selectedCategory;
    });

    const toggleToolSelection = (toolId: string) => {
      const newSelected = new Set(selectedTools);
      if (newSelected.has(toolId)) {
        newSelected.delete(toolId);
      } else {
        newSelected.add(toolId);
      }
      setSelectedTools(newSelected);
    };

    const handleAddTools = () => {
      const toolsToAdd = availableTools.filter(tool => selectedTools.has(tool.id));
      onSelectTools(toolsToAdd);
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
          className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex"
        >
          {/* Left Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Tools</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search 9,000+ tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <button 
                onClick={() => {
                  onClose();
                  setShowNewToolBuilder(true);
                }}
                className="w-full mt-3 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New tool
              </button>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Tools</div>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 mt-6">By use case</div>
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                    <MessageSquare className="w-4 h-4" />
                    Communications
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                    <Users className="w-4 h-4" />
                    CRM
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                    <CalendarIcon className="w-4 h-4" />
                    Calendar
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                    <Database className="w-4 h-4" />
                    Data scraper
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                    <FileText className="w-4 h-4" />
                    Handle files
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                    <Brain className="w-4 h-4" />
                    Knowledge
                  </button>
                </div>

                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 mt-6">By apps</div>
                <div className="space-y-1">
                  {appCategories.map((app) => (
                    <button
                      key={app.id}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <app.icon className={`w-4 h-4 ${app.color}`} />
                      {app.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedCategory === 'Trending' ? 'Trending' : selectedCategory}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedCategory === 'Trending' 
                      ? 'Popular tool templates from the community'
                      : `Browse ${filteredTools.length} available tools`
                    }
                  </p>
                </div>
                {selectedTools.size > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {selectedTools.size} tool{selectedTools.size !== 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={handleAddTools}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Add {selectedTools.size} tool{selectedTools.size !== 1 ? 's' : ''}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      selectedTools.has(tool.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => toggleToolSelection(tool.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 text-sm">{tool.name}</h4>
                          {selectedTools.has(tool.id) && (
                            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{tool.description}</p>
                        <div className="text-xs text-gray-500">by {tool.provider}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTools.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium mb-1">No tools found</p>
                  <p className="text-sm">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                {selectedTools.size > 0 && (
                  <button
                    onClick={handleAddTools}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add {selectedTools.size} tool{selectedTools.size !== 1 ? 's' : ''}
                  </button>
                )}
              </div>
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tools':
        return <ToolsTab />;
      case 'prompt':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Prompt Configuration</h3>
            <p className="text-gray-600">Configure your agent's personality and instructions.</p>
          </div>
        );
      case 'knowledge':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <FileText className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Knowledge Base</h3>
            <p className="text-gray-600">Upload documents and data sources for your agent.</p>
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

      {/* New Tool Builder Modal */}
      <AnimatePresence>
        {showNewToolBuilder && (
          <NewToolBuilder
            onClose={() => setShowNewToolBuilder(false)}
          />
        )}
      </AnimatePresence>

      {/* Tool Library Modal */}
      <AnimatePresence>
        {showToolLibrary && (
          <ToolLibrary
            onClose={() => setShowToolLibrary(false)}
            onSelectTools={(tools) => {
              // Handle adding selected tools
              console.log('Selected tools:', tools);
            }}
          />
        )}
      </AnimatePresence>

      {/* Tool Wizard Modal */}
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
      </AnimatePresence>
    </div>
  );
};

export default AIAgentBuilderNew;