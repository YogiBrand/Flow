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
  Circle
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

const AIAgentBuilderNew: React.FC<AIAgentBuilderNewProps> = ({ agent, onBack }) => {
  const [activeTab, setActiveTab] = useState('tools');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showToolWizard, setShowToolWizard] = useState(false);

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
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 transition-colors cursor-pointer">
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