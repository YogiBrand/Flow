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
  Briefcase
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
}

// Zustand store for agent state
const useAgentStore = () => {
  const [currentAgent, setCurrentAgent] = useState({
    id: `agent_${Date.now()}`,
    name: 'Elli, the Enrichment Agent',
    description: 'Understand every lead with high quality, qualitative enrichment.',
    avatar: null,
    isPublic: false,
    prompt: {
      content: '',
      tone: 'professional',
      autoImprove: false,
      examples: []
    },
    tools: [
      {
        id: 'lead_enrichment',
        name: 'Lead Enrichment Tool',
        description: 'Enrich lead data with comprehensive information',
        category: 'enrichment',
        enabled: true,
        icon: Users,
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
            description: 'Enter the number of employees as a whole number. This field accepts integer values only.',
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
            description: 'Choose one of the following values exactly as shown, with precise character and case matching: work email, personal email',
            type: 'select',
            options: ['work email', 'personal email'],
            required: false,
            letAgentDecide: true
          },
          {
            id: 'job_function',
            name: 'Job function',
            description: 'If the job function is empty, or unknown, simply input: unknown',
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'agency_evaluation',
            name: 'Agency evaluation',
            description: "Input the company's agency evaluation: Agency Type, or Non-agency Type",
            type: 'select',
            options: ['Agency Type', 'Non-agency Type'],
            required: false,
            letAgentDecide: true
          },
          {
            id: 'funding_info',
            name: 'Funding info',
            description: 'The funding information about the company',
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'prospect_email',
            name: 'Prospect email address',
            description: "The contact's email address.",
            type: 'email',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'first_name',
            name: 'First Name',
            description: "The contact's first name",
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'last_name',
            name: 'Last Name',
            description: "The contact's last name",
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'company_name',
            name: 'Company name',
            description: "The contact's company name",
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'country',
            name: 'Country',
            description: "The contact's country location",
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'personal_linkedin',
            name: 'Personal LinkedIn url',
            description: "The contact's personal Linkedin url",
            type: 'url',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'company_linkedin',
            name: 'Company LinkedIn url',
            description: "The contact's company LinkedIn url",
            type: 'url',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'contact_id',
            name: 'Contact ID',
            description: 'Input the contact\'s ID if known from HubSpot. Leave empty if unknown',
            type: 'text',
            required: false,
            letAgentDecide: true
          }
        ]
      },
      {
        id: 'lead_scoring',
        name: 'Lead Scoring Tool',
        description: 'Score leads based on various criteria',
        category: 'scoring',
        enabled: true,
        icon: Target,
        inputs: [
          {
            id: 'current_job_title',
            name: 'Current job title',
            description: 'Input the current job title of the user.',
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'job_function_map',
            name: 'job_function_map_for_lead_scoring_19_jan',
            description: 'Type how input is described to agent...',
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'personal_linkedin_url',
            name: 'Personal LinkedIn url',
            description: 'Input the personal linkedin profile of the user.',
            type: 'url',
            required: false,
            letAgentDecide: true
          }
        ]
      },
      {
        id: 'company_lookup',
        name: 'Company Lookup Tool',
        description: 'Look up company information',
        category: 'research',
        enabled: true,
        icon: Building,
        inputs: [
          {
            id: 'company_name',
            name: 'Company name',
            description: "The contact's company name",
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'email',
            name: 'Email',
            description: "The contact's email address",
            type: 'email',
            required: false,
            letAgentDecide: true
          }
        ]
      },
      {
        id: 'contact_finder',
        name: 'Contact Finder Tool',
        description: 'Find contact information',
        category: 'research',
        enabled: true,
        icon: Search,
        inputs: [
          {
            id: 'first_name',
            name: 'First name',
            description: "The contact's first name",
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'last_name',
            name: 'Last name',
            description: "The contact's last name",
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'company_name',
            name: 'Company name',
            description: "The contact's company name",
            type: 'text',
            required: false,
            letAgentDecide: true
          },
          {
            id: 'email_address',
            name: 'Email address',
            description: "The contact's email address",
            type: 'email',
            required: false,
            letAgentDecide: true
          }
        ]
      },
      {
        id: 'email_validator',
        name: 'Email Validator Tool',
        description: 'Validate email addresses',
        category: 'validation',
        enabled: true,
        icon: Mail,
        inputs: [
          {
            id: 'email_address',
            name: 'Email address',
            description: 'The email address of the user.',
            type: 'email',
            required: false,
            letAgentDecide: true
          }
        ]
      }
    ],
    knowledge: {
      sources: [],
      longTermMemory: true
    },
    triggers: [],
    escalations: [],
    variables: [],
    metadata: {
      lastModified: new Date().toISOString(),
      version: '1.0.0'
    }
  });

  const updateAgent = (updates: any) => {
    setCurrentAgent(prev => ({ ...prev, ...updates }));
  };

  return { currentAgent, setCurrentAgent, updateAgent };
};

const AIAgentBuilderNew: React.FC<AIAgentBuilderNewProps> = ({ agent, onBack }) => {
  const { currentAgent, updateAgent } = useAgentStore();
  const [activeTab, setActiveTab] = useState('tools');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});

  const tabs = [
    { id: 'prompt', label: 'Prompt', icon: Brain },
    { id: 'tools', label: 'Tools', icon: Zap },
    { id: 'knowledge', label: 'Knowledge', icon: FileText },
    { id: 'triggers', label: 'Triggers', icon: Calendar },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle },
    { id: 'metadata', label: 'Metadata', icon: Settings },
    { id: 'variables', label: 'Variables', icon: Code }
  ];

  const toggleToolExpansion = (toolId: string) => {
    setExpandedTools(prev => ({
      ...prev,
      [toolId]: !prev[toolId]
    }));
  };

  const toggleToolEnabled = (toolId: string) => {
    updateAgent({
      tools: currentAgent.tools.map((tool: Tool) => 
        tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
      )
    });
  };

  const updateToolInput = (toolId: string, inputId: string, updates: Partial<ToolInput>) => {
    updateAgent({
      tools: currentAgent.tools.map((tool: Tool) => 
        tool.id === toolId 
          ? {
              ...tool,
              inputs: tool.inputs.map(input => 
                input.id === inputId ? { ...input, ...updates } : input
              )
            }
          : tool
      )
    });
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

  // Tools Tab Component
  const ToolsTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentAgent.name}</h2>
            <p className="text-gray-600 mt-1">{currentAgent.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Play className="w-4 h-4" />
              Run
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Build
            </button>
          </div>
        </div>

        {/* Tools List */}
        <div className="space-y-4">
          {currentAgent.tools.map((tool: Tool) => (
            <div key={tool.id} className="border border-gray-200 rounded-lg bg-white">
              {/* Tool Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <tool.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tool.enabled}
                        onChange={() => toggleToolEnabled(tool.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <button
                      onClick={() => toggleToolExpansion(tool.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {expandedTools[tool.id] ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Tool Configuration */}
              {expandedTools[tool.id] && (
                <div className="p-4 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2">How tool is described to agent</h4>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={2}
                      placeholder="Describe how the agent should use this tool..."
                      defaultValue={tool.description}
                    />
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Tool inputs</h4>
                    <div className="space-y-4">
                      {tool.inputs.map((input) => {
                        const InputIcon = getInputIcon(input.type);
                        return (
                          <div key={input.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <InputIcon className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900">{input.name}</h5>
                                  {input.letAgentDecide && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                      Let agent decide
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <Settings className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{input.description}</p>
                            
                            {input.type === 'select' && input.options && (
                              <div className="mb-3">
                                <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                  <option value="">Select an option...</option>
                                  {input.options.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                            
                            {input.type !== 'select' && (
                              <input
                                type={input.type === 'number' ? 'number' : input.type === 'email' ? 'email' : input.type === 'url' ? 'url' : 'text'}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`Enter ${input.name.toLowerCase()}...`}
                                defaultValue={input.defaultValue || ''}
                              />
                            )}
                            
                            <div className="flex items-center justify-between mt-3">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={input.letAgentDecide}
                                  onChange={(e) => updateToolInput(tool.id, input.id, { letAgentDecide: e.target.checked })}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Let agent decide</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={input.required}
                                  onChange={(e) => updateToolInput(tool.id, input.id, { required: e.target.checked })}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Required</span>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Variables Section */}
        <div className="border border-gray-200 rounded-lg bg-white p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Variables</h3>
          <p className="text-sm text-gray-600 mb-4">
            Want to reuse values throughout your agent? Turn them into a variable that you can access with {'{{'}.
          </p>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Variable
          </button>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tools':
        return <ToolsTab />;
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
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Agent
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
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
    </div>
  );
};

export default AIAgentBuilderNew;