import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  X,
  Search,
  Filter,
  FileText,
  Database,
  Globe,
  Code,
  BarChart3,
  Users,
  Mail,
  Hash,
  Target,
  Share2,
  Contact,
  TrendingUp,
  FileBarChart,
  Eye,
  EyeOff,
  Edit3,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAgentData, useToolTemplates, useKnowledgeTemplates } from '../../hooks/useAgentData';
import { AgentService } from '../../services/agentService';
import { addKnowledgeItemToDB, removeKnowledgeItemFromDB, addToolToDB, removeToolFromDB, updateToolInDB } from '../../lib/knowledge';

interface AIAgentBuilderExactProps {
  agentId?: string;
  onBack: () => void;
}

const AIAgentBuilderExact: React.FC<AIAgentBuilderExactProps> = ({ agentId, onBack }) => {
  const { user } = useAuth();
  const { agent, loading } = useAgentData(agentId || '');
  const { templates: toolTemplates, loading: toolTemplatesLoading } = useToolTemplates();
  const { templates: knowledgeTemplates, loading: knowledgeTemplatesLoading } = useKnowledgeTemplates();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'knowledge' | 'prompts' | 'triggers' | 'escalations' | 'variables' | 'test'>('overview');
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showToolLibrary, setShowToolLibrary] = useState(false);
  const [showKnowledgeLibrary, setShowKnowledgeLibrary] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());
  const [editingInputs, setEditingInputs] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  // Create new agent if no agentId provided
  useEffect(() => {
    if (!agentId && user) {
      createNewAgent();
    }
  }, [agentId, user]);

  const createNewAgent = async () => {
    if (!user) return;
    
    try {
      const newAgent = await AgentService.createAgent({
        user_id: user.id,
        name: 'New AI Agent',
        description: 'A new AI agent ready to be configured',
        purpose: 'General purpose AI assistant',
        status: 'draft',
        system_prompt: 'You are a helpful AI assistant.',
        temperature: 0.7,
        top_p: 0.9,
        model: 'gpt-4',
        output_mode: 'message',
        memory_enabled: false,
        memory_type: 'vector_store',
        context_size: 4000,
        max_retries: 3,
        fallback_response: 'I apologize, but I encountered an error. Please try again.'
      });
      
      // Redirect to the new agent
      window.history.replaceState(null, '', `?agentId=${newAgent.id}`);
    } catch (error) {
      console.error('Error creating new agent:', error);
    }
  };

  const handleSave = async () => {
    if (!agent || !user) return;
    
    setSaving(true);
    try {
      await AgentService.updateAgent(agent.id, {
        name: agent.name,
        description: agent.description,
        purpose: agent.purpose,
        system_prompt: agent.system_prompt,
        temperature: agent.temperature,
        top_p: agent.top_p,
        model: agent.model,
        output_mode: agent.output_mode,
        memory_enabled: agent.memory_enabled,
        memory_type: agent.memory_type,
        context_size: agent.context_size,
        max_retries: agent.max_retries,
        fallback_response: agent.fallback_response
      });
    } catch (error) {
      console.error('Error saving agent:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTestAgent = async () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestResults({
        status: 'success',
        executionTime: '2.1s',
        output: {
          message: 'Agent executed successfully',
          response: 'Hello! I am your AI assistant. How can I help you today?',
          toolsUsed: agent?.tools?.filter(t => t.enabled).length || 0
        }
      });
      setIsTesting(false);
    }, 2000);
  };

  const addTool = async (templateId: string) => {
    if (!agent) return;
    
    try {
      await addToolToDB(agent.id, templateId);
      setShowToolLibrary(false);
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  const removeTool = async (toolId: string) => {
    try {
      await removeToolFromDB(toolId);
    } catch (error) {
      console.error('Error removing tool:', error);
    }
  };

  const toggleTool = async (toolId: string, enabled: boolean) => {
    try {
      await updateToolInDB(toolId, { enabled });
    } catch (error) {
      console.error('Error toggling tool:', error);
    }
  };

  const addKnowledgeItem = async (template: any) => {
    if (!agent) return;
    
    try {
      await addKnowledgeItemToDB(agent.id, {
        name: template.name,
        type: template.content_type || 'text',
        content: template.content || '',
        metadata: template.metadata || {},
        enabled: true
      });
      setShowKnowledgeLibrary(false);
    } catch (error) {
      console.error('Error adding knowledge item:', error);
    }
  };

  const removeKnowledgeItem = async (itemId: string) => {
    try {
      await removeKnowledgeItemFromDB(itemId);
    } catch (error) {
      console.error('Error removing knowledge item:', error);
    }
  };

  const toggleToolExpansion = (toolId: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };

  const toggleInputEditing = (inputId: string) => {
    const newEditing = new Set(editingInputs);
    if (newEditing.has(inputId)) {
      newEditing.delete(inputId);
    } else {
      newEditing.add(inputId);
    }
    setEditingInputs(newEditing);
  };

  const updateInputValue = async (inputId: string, value: any) => {
    // Update input value in database
    // This would need to be implemented based on your schema
    console.log('Updating input:', inputId, value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Agent not found</h3>
          <p className="text-gray-600 mb-4">The requested agent could not be loaded.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'tools', label: 'Tools', icon: Zap },
    { id: 'knowledge', label: 'Knowledge', icon: Brain },
    { id: 'prompts', label: 'Prompts', icon: MessageSquare },
    { id: 'triggers', label: 'Triggers', icon: Play },
    { id: 'escalations', label: 'Escalations', icon: AlertCircle },
    { id: 'variables', label: 'Variables', icon: Code },
    { id: 'test', label: 'Test', icon: TestTube }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agent Name
        </label>
        <input
          type="text"
          value={agent.name}
          onChange={(e) => {
            // Update agent name locally and save
            agent.name = e.target.value;
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter agent name..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={agent.description}
          onChange={(e) => {
            agent.description = e.target.value;
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          placeholder="Describe what this agent does..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Purpose
        </label>
        <textarea
          value={agent.purpose}
          onChange={(e) => {
            agent.purpose = e.target.value;
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={2}
          placeholder="What is the main purpose of this agent?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt
        </label>
        <textarea
          value={agent.system_prompt}
          onChange={(e) => {
            agent.system_prompt = e.target.value;
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={4}
          placeholder="You are a helpful AI assistant..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature
          </label>
          <input
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={agent.temperature}
            onChange={(e) => {
              agent.temperature = parseFloat(e.target.value);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Top P
          </label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={agent.top_p}
            onChange={(e) => {
              agent.top_p = parseFloat(e.target.value);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model
        </label>
        <select
          value={agent.model}
          onChange={(e) => {
            agent.model = e.target.value;
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          <option value="claude-3-haiku">Claude 3 Haiku</option>
        </select>
      </div>
    </div>
  );

  const renderToolsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Agent Tools</h4>
        <button
          onClick={() => setShowToolLibrary(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Tool
        </button>
      </div>

      {!agent.tools || agent.tools.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium mb-1">No tools added yet</p>
          <p className="text-sm">Add tools to give your agent capabilities</p>
        </div>
      ) : (
        <div className="space-y-3">
          {agent.tools.map((tool) => (
            <div key={tool.id} className="border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    {tool.icon ? <tool.icon className="w-5 h-5 text-purple-600" /> : <Zap className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{tool.name}</h5>
                    <p className="text-sm text-gray-600">{tool.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={tool.enabled}
                      onChange={(e) => toggleTool(tool.id, e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enabled</span>
                  </label>
                  <button
                    onClick={() => toggleToolExpansion(tool.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {expandedTools.has(tool.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => removeTool(tool.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedTools.has(tool.id) && tool.inputs && tool.inputs.length > 0 && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <h6 className="text-sm font-medium text-gray-900 mb-3">Tool Configuration</h6>
                  <div className="space-y-3">
                    {tool.inputs.map((input) => (
                      <div key={input.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {input.label}
                            {input.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {editingInputs.has(input.id) ? (
                            <div className="flex items-center gap-2">
                              {input.type === 'select' && input.options ? (
                                <select
                                  defaultValue={input.default_value}
                                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                                  onChange={(e) => updateInputValue(input.id, e.target.value)}
                                >
                                  {input.options.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : input.type === 'boolean' ? (
                                <input
                                  type="checkbox"
                                  defaultChecked={input.default_value}
                                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  onChange={(e) => updateInputValue(input.id, e.target.checked)}
                                />
                              ) : (
                                <input
                                  type={input.type === 'number' ? 'number' : 'text'}
                                  defaultValue={input.default_value}
                                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                                  onChange={(e) => updateInputValue(input.id, e.target.value)}
                                />
                              )}
                              <button
                                onClick={() => toggleInputEditing(input.id)}
                                className="p-1 text-green-600 hover:text-green-700"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                {input.default_value || 'Not set'}
                              </span>
                              <button
                                onClick={() => toggleInputEditing(input.id)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {input.description && (
                            <p className="text-xs text-gray-500 mt-1">{input.description}</p>
                          )}
                        </div>
                        {input.letAgentDecide && (
                          <div className="ml-4">
                            <label className="flex items-center text-xs text-gray-600">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-1"
                              />
                              Let agent decide
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderKnowledgeTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Knowledge Base</h4>
        <button
          onClick={() => setShowKnowledgeLibrary(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Knowledge
        </button>
      </div>

      {!agent.knowledgeBases || agent.knowledgeBases.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium mb-1">No knowledge items added yet</p>
          <p className="text-sm">Add knowledge to give your agent context</p>
        </div>
      ) : (
        <div className="space-y-3">
          {agent.knowledgeBases.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{item.name}</h5>
                  <p className="text-sm text-gray-600">{item.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enabled</span>
                </label>
                <button
                  onClick={() => removeKnowledgeItem(item.id)}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTestTab = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TestTube className="w-8 h-8 text-gray-400" />
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">Test your agent</h4>
        <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
          Run a test to see how your agent performs with sample data.
        </p>
        <button
          onClick={handleTestAgent}
          disabled={isTesting}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 mx-auto disabled:opacity-50"
        >
          {isTesting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Test
            </>
          )}
        </button>
      </div>

      {testResults && (
        <div className="border-t border-gray-200 pt-6">
          <h5 className="text-sm font-medium text-gray-900 mb-3">Test Results</h5>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-green-800">Test Passed</span>
              <span className="text-xs text-gray-500">({testResults.executionTime})</span>
            </div>
            <div className="text-sm text-green-700 mb-2">
              Response: {testResults.output.response}
            </div>
            <div className="text-xs text-gray-600">
              Tools used: {testResults.output.toolsUsed}
            </div>
          </div>
        </div>
      )}
    </div>
  );

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
                {agent.name}
              </h1>
              <p className="text-sm text-gray-600">AI Agent Configuration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Agent
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

        {/* Tab Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'tools' && renderToolsTab()}
          {activeTab === 'knowledge' && renderKnowledgeTab()}
          {activeTab === 'prompts' && <div className="text-center py-8 text-gray-500">Prompts configuration coming soon...</div>}
          {activeTab === 'triggers' && <div className="text-center py-8 text-gray-500">Triggers configuration coming soon...</div>}
          {activeTab === 'escalations' && <div className="text-center py-8 text-gray-500">Escalations configuration coming soon...</div>}
          {activeTab === 'variables' && <div className="text-center py-8 text-gray-500">Variables configuration coming soon...</div>}
          {activeTab === 'test' && renderTestTab()}
        </div>
      </div>

      {/* Tool Library Modal */}
      {showToolLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Add Tool</h2>
                <button
                  onClick={() => setShowToolLibrary(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Categories</option>
                  <option value="general">General</option>
                  <option value="data">Data</option>
                  <option value="communication">Communication</option>
                  <option value="analysis">Analysis</option>
                </select>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
              {toolTemplatesLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading tools...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {toolTemplates
                    .filter(template => 
                      (selectedCategory === 'all' || template.category === selectedCategory) &&
                      (template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       template.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((template) => (
                      <button
                        key={template.id}
                        onClick={() => addTool(template.id)}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                      >
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 group-hover:bg-white transition-colors">
                          <template.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 mb-1">{template.name}</div>
                          <div className="text-sm text-gray-600 leading-relaxed">{template.description}</div>
                          <div className="text-xs text-gray-500 mt-1 capitalize">{template.category}</div>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Library Modal */}
      {showKnowledgeLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Add Knowledge</h2>
                <button
                  onClick={() => setShowKnowledgeLibrary(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search knowledge..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
              {knowledgeTemplatesLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading knowledge templates...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {knowledgeTemplates
                    .filter(template => 
                      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      template.description.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((template) => (
                      <button
                        key={template.id}
                        onClick={() => addKnowledgeItem(template)}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                      >
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 group-hover:bg-white transition-colors">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 mb-1">{template.name}</div>
                          <div className="text-sm text-gray-600 leading-relaxed">{template.description}</div>
                          <div className="text-xs text-gray-500 mt-1 capitalize">{template.category}</div>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgentBuilderExact;