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
  Filter
} from 'lucide-react';

interface AIAgentBuilderNewProps {
  agent?: any | null;
  onBack: () => void;
}

// Zustand store for agent state
interface AgentStore {
  currentAgent: any;
  setCurrentAgent: (agent: any) => void;
  updateAgent: (updates: any) => void;
}

const useAgentStore = () => {
  const [currentAgent, setCurrentAgent] = useState({
    id: `agent_${Date.now()}`,
    name: 'New AI Agent',
    description: '',
    avatar: null,
    isPublic: false,
    prompt: {
      content: '',
      tone: 'professional',
      autoImprove: false,
      examples: []
    },
    tools: [],
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
  const [activeTab, setActiveTab] = useState('prompt');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    prompt: true,
    tools: false,
    knowledge: false,
    triggers: false,
    escalations: false,
    metadata: false,
    variables: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const tabs = [
    { id: 'prompt', label: 'Prompt', icon: Brain, description: 'Create guidelines for your agent' },
    { id: 'tools', label: 'Tools', icon: Zap, description: 'Used by agents to complete tasks' },
    { id: 'knowledge', label: 'Knowledge', icon: FileText, description: 'Add your documents and data' },
    { id: 'triggers', label: 'Triggers', icon: Calendar, description: 'Run tasks on autopilot' },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle, description: 'Escalate or hand off complex tasks' },
    { id: 'metadata', label: 'Metadata', icon: Settings, description: 'General agent info' },
    { id: 'variables', label: 'Variables', icon: Code, description: 'Define input/output fields' }
  ];

  // Prompt Tab Component
  const PromptTab = () => {
    const [showExamples, setShowExamples] = useState(false);
    
    const toneOptions = [
      { value: 'professional', label: 'Professional' },
      { value: 'casual', label: 'Casual' },
      { value: 'friendly', label: 'Friendly' },
      { value: 'expert', label: 'Expert' },
      { value: 'empathetic', label: 'Empathetic' },
      { value: 'authoritative', label: 'Authoritative' }
    ];

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Instructions
          </label>
          <textarea
            value={currentAgent.prompt.content}
            onChange={(e) => updateAgent({
              prompt: { ...currentAgent.prompt, content: e.target.value }
            })}
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            placeholder="Describe what your agent should do, how it should behave, and any specific instructions..."
          />
          <p className="text-xs text-gray-500 mt-2">
            Be specific about the agent's role, personality, and how it should respond to different situations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={currentAgent.prompt.tone}
              onChange={(e) => updateAgent({
                prompt: { ...currentAgent.prompt, tone: e.target.value }
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {toneOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auto-improve prompts
              </label>
              <p className="text-xs text-gray-500">
                Let AI optimize your prompts automatically
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentAgent.prompt.autoImprove}
                onChange={(e) => updateAgent({
                  prompt: { ...currentAgent.prompt, autoImprove: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Example Prompts
            </label>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              {showExamples ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showExamples ? 'Hide' : 'Show'} Examples
            </button>
          </div>
          
          {showExamples && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="text-sm">
                <div className="font-medium text-gray-700 mb-1">Customer Support Agent:</div>
                <div className="text-gray-600 italic">
                  "You are a helpful customer support agent for an e-commerce platform. Always be polite, empathetic, and solution-focused. If you can't solve an issue, escalate to a human agent."
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-700 mb-1">Lead Qualification Agent:</div>
                <div className="text-gray-600 italic">
                  "You are a lead qualification specialist. Ask relevant questions to understand the prospect's needs, budget, and timeline. Score leads from 1-10 based on their responses."
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tools Tab Component
  const ToolsTab = () => {
    const [showToolModal, setShowToolModal] = useState(false);
    const [selectedTool, setSelectedTool] = useState<any>(null);

    const availableTools = [
      { id: 'web_search', name: 'Web Search', description: 'Search the internet for information', icon: Globe, category: 'research' },
      { id: 'email_sender', name: 'Email Sender', description: 'Send emails to contacts', icon: Mail, category: 'communication' },
      { id: 'api_connector', name: 'API Connector', description: 'Connect to external APIs', icon: Link, category: 'integration' },
      { id: 'data_extractor', name: 'Data Extractor', description: 'Extract data from documents', icon: Database, category: 'data' },
      { id: 'file_generator', name: 'File Generator', description: 'Generate documents and files', icon: FileText, category: 'content' }
    ];

    const addTool = (tool: any) => {
      const newTool = {
        id: `tool_${Date.now()}`,
        type: tool.id,
        name: tool.name,
        enabled: true,
        config: {}
      };
      updateAgent({
        tools: [...currentAgent.tools, newTool]
      });
      setShowToolModal(false);
    };

    const toggleTool = (toolId: string) => {
      updateAgent({
        tools: currentAgent.tools.map((tool: any) => 
          tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
        )
      });
    };

    const removeTool = (toolId: string) => {
      updateAgent({
        tools: currentAgent.tools.filter((tool: any) => tool.id !== toolId)
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Agent Tools</h3>
            <p className="text-sm text-gray-600">Enable tools to give your agent capabilities</p>
          </div>
          <button
            onClick={() => setShowToolModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Tool
          </button>
        </div>

        {currentAgent.tools.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500 mb-1">No tools added yet</p>
            <p className="text-sm text-gray-400">Add tools to give your agent capabilities</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentAgent.tools.map((tool: any) => (
              <div
                key={tool.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{tool.name}</h4>
                    <p className="text-sm text-gray-600">{tool.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tool.enabled}
                      onChange={() => toggleTool(tool.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                  <button
                    onClick={() => setSelectedTool(tool)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeTool(tool.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tool Selection Modal */}
        {showToolModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Add Tool</h3>
                  <button
                    onClick={() => setShowToolModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => addTool(tool)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <tool.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{tool.name}</h4>
                          <p className="text-sm text-gray-600">{tool.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Knowledge Tab Component
  const KnowledgeTab = () => {
    const [showUploadModal, setShowUploadModal] = useState(false);

    const addKnowledgeSource = (type: string) => {
      const newSource = {
        id: `source_${Date.now()}`,
        type,
        name: `New ${type} source`,
        status: 'pending',
        addedAt: new Date().toISOString()
      };
      updateAgent({
        knowledge: {
          ...currentAgent.knowledge,
          sources: [...currentAgent.knowledge.sources, newSource]
        }
      });
      setShowUploadModal(false);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Knowledge Sources</h3>
            <p className="text-sm text-gray-600">Add documents and data for your agent to reference</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Source
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-900">Long-term Memory</h4>
              <p className="text-sm text-blue-700">Remember conversations and context across sessions</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={currentAgent.knowledge.longTermMemory}
              onChange={(e) => updateAgent({
                knowledge: { ...currentAgent.knowledge, longTermMemory: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {currentAgent.knowledge.sources.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500 mb-1">No knowledge sources added</p>
            <p className="text-sm text-gray-400">Upload files or add URLs to give your agent context</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentAgent.knowledge.sources.map((source: any) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{source.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{source.type} • {source.status}</p>
                  </div>
                </div>
                <button className="p-2 text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Add Knowledge Source</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={() => addKnowledgeSource('file')}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center gap-3"
                >
                  <Upload className="w-6 h-6 text-gray-400" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Upload Files</div>
                    <div className="text-sm text-gray-600">PDF, DOCX, TXT, CSV</div>
                  </div>
                </button>
                <button
                  onClick={() => addKnowledgeSource('url')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-3"
                >
                  <Link className="w-6 h-6 text-gray-400" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Add URL</div>
                    <div className="text-sm text-gray-600">Website, documentation, etc.</div>
                  </div>
                </button>
                <button
                  onClick={() => addKnowledgeSource('integration')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-3"
                >
                  <Database className="w-6 h-6 text-gray-400" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Connect Integration</div>
                    <div className="text-sm text-gray-600">Notion, Google Docs, etc.</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Triggers Tab Component
  const TriggersTab = () => {
    const [showTriggerModal, setShowTriggerModal] = useState(false);

    const triggerTypes = [
      { id: 'form_submit', name: 'On Form Submit', description: 'Trigger when a form is submitted', icon: FileText },
      { id: 'new_lead', name: 'On New Lead', description: 'Trigger when a new lead is created', icon: User },
      { id: 'keyword_match', name: 'On Keyword Match', description: 'Trigger when specific keywords are detected', icon: Search },
      { id: 'schedule', name: 'On Schedule', description: 'Trigger on a recurring schedule', icon: Calendar },
      { id: 'webhook', name: 'Webhook', description: 'Trigger via external webhook', icon: Webhook }
    ];

    const addTrigger = (triggerType: any) => {
      const newTrigger = {
        id: `trigger_${Date.now()}`,
        type: triggerType.id,
        name: triggerType.name,
        enabled: true,
        config: {}
      };
      updateAgent({
        triggers: [...currentAgent.triggers, newTrigger]
      });
      setShowTriggerModal(false);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Automation Triggers</h3>
            <p className="text-sm text-gray-600">Set up when your agent should automatically run</p>
          </div>
          <button
            onClick={() => setShowTriggerModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Trigger
          </button>
        </div>

        {currentAgent.triggers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500 mb-1">No triggers configured</p>
            <p className="text-sm text-gray-400">Add triggers to automate your agent</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentAgent.triggers.map((trigger: any) => (
              <div
                key={trigger.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{trigger.name}</h4>
                    <p className="text-sm text-gray-600">{trigger.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trigger.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trigger Modal */}
        {showTriggerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Add Trigger</h3>
                  <button
                    onClick={() => setShowTriggerModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="space-y-3">
                  {triggerTypes.map((trigger) => (
                    <button
                      key={trigger.id}
                      onClick={() => addTrigger(trigger)}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <trigger.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{trigger.name}</h4>
                        <p className="text-sm text-gray-600">{trigger.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Escalations Tab Component
  const EscalationsTab = () => {
    const [showEscalationModal, setShowEscalationModal] = useState(false);

    const escalationTypes = [
      { id: 'human', name: 'Escalate to Human', description: 'Hand off to a human agent', icon: User },
      { id: 'email', name: 'Send Email Summary', description: 'Send summary via email', icon: Mail },
      { id: 'slack', name: 'Trigger Slack Alert', description: 'Send alert to Slack channel', icon: Slack },
      { id: 'webhook', name: 'Call Webhook', description: 'Trigger external webhook', icon: Webhook }
    ];

    const addEscalation = (escalationType: any) => {
      const newEscalation = {
        id: `escalation_${Date.now()}`,
        type: escalationType.id,
        name: escalationType.name,
        enabled: true,
        order: currentAgent.escalations.length,
        config: {}
      };
      updateAgent({
        escalations: [...currentAgent.escalations, newEscalation]
      });
      setShowEscalationModal(false);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Escalation Paths</h3>
            <p className="text-sm text-gray-600">Define what happens when the agent can't handle a task</p>
          </div>
          <button
            onClick={() => setShowEscalationModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Escalation
          </button>
        </div>

        {currentAgent.escalations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500 mb-1">No escalation paths defined</p>
            <p className="text-sm text-gray-400">Add fallback steps for complex situations</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentAgent.escalations.map((escalation: any, index: number) => (
              <div
                key={escalation.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm font-medium text-orange-600">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{escalation.name}</h4>
                    <p className="text-sm text-gray-600">{escalation.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Escalation Modal */}
        {showEscalationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Add Escalation</h3>
                  <button
                    onClick={() => setShowEscalationModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="space-y-3">
                  {escalationTypes.map((escalation) => (
                    <button
                      key={escalation.id}
                      onClick={() => addEscalation(escalation)}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all text-left flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <escalation.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{escalation.name}</h4>
                        <p className="text-sm text-gray-600">{escalation.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Metadata Tab Component
  const MetadataTab = () => {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={currentAgent.name}
            onChange={(e) => updateAgent({ name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter agent name..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={currentAgent.description}
            onChange={(e) => updateAgent({ description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            placeholder="Describe what this agent does..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Avatar
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              {currentAgent.avatar ? (
                <img src={currentAgent.avatar} alt="Avatar" className="w-full h-full rounded-lg object-cover" />
              ) : (
                <Bot className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Visibility</h4>
            <p className="text-sm text-gray-600">Make this agent available to other team members</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={currentAgent.isPublic}
              onChange={(e) => updateAgent({ isPublic: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Agent Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Modified:</span>
              <span className="text-gray-900">{new Date(currentAgent.metadata.lastModified).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="text-gray-900">{currentAgent.metadata.version}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Variables Tab Component
  const VariablesTab = () => {
    const [showVariableModal, setShowVariableModal] = useState(false);
    const [newVariable, setNewVariable] = useState({ name: '', type: 'text', defaultValue: '', description: '' });

    const addVariable = () => {
      const variable = {
        id: `var_${Date.now()}`,
        ...newVariable,
        name: `{{${newVariable.name}}}`
      };
      updateAgent({
        variables: [...currentAgent.variables, variable]
      });
      setNewVariable({ name: '', type: 'text', defaultValue: '', description: '' });
      setShowVariableModal(false);
    };

    const removeVariable = (variableId: string) => {
      updateAgent({
        variables: currentAgent.variables.filter((v: any) => v.id !== variableId)
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Agent Variables</h3>
            <p className="text-sm text-gray-600">Define input/output fields for dynamic content</p>
          </div>
          <button
            onClick={() => setShowVariableModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Variable
          </button>
        </div>

        {currentAgent.variables.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Code className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500 mb-1">No variables defined</p>
            <p className="text-sm text-gray-400">Add variables to make your agent dynamic</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentAgent.variables.map((variable: any) => (
              <div
                key={variable.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 font-mono">{variable.name}</h4>
                    <p className="text-sm text-gray-600">{variable.description || variable.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {variable.type}
                  </span>
                  <button
                    onClick={() => removeVariable(variable.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Variable Modal */}
        {showVariableModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Add Variable</h3>
                  <button
                    onClick={() => setShowVariableModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variable Name
                  </label>
                  <input
                    type="text"
                    value={newVariable.name}
                    onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="customer_name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newVariable.type}
                    onChange={(e) => setNewVariable({ ...newVariable, type: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="url">URL</option>
                    <option value="date">Date</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Value
                  </label>
                  <input
                    type="text"
                    value={newVariable.defaultValue}
                    onChange={(e) => setNewVariable({ ...newVariable, defaultValue: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Optional default value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newVariable.description}
                    onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={2}
                    placeholder="Describe this variable"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowVariableModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addVariable}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Variable
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'prompt':
        return <PromptTab />;
      case 'tools':
        return <ToolsTab />;
      case 'knowledge':
        return <KnowledgeTab />;
      case 'triggers':
        return <TriggersTab />;
      case 'escalations':
        return <EscalationsTab />;
      case 'metadata':
        return <MetadataTab />;
      case 'variables':
        return <VariablesTab />;
      default:
        return <PromptTab />;
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

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-gray-500">{tab.description}</div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
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
        </div>
      </div>
    </div>
  );
};

export default AIAgentBuilderNew;