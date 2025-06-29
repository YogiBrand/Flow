import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
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
  ChevronLeft,
  ChevronRight,
  Check,
  Edit3,
  ArrowRight,
  ArrowDown,
  Calendar,
  AlertTriangle,
  Webhook,
  Clock,
  Target,
  Shield,
  BarChart3,
  Code,
  Database,
  Globe,
  Mail,
  Search,
  Users,
  FileText,
  Hash,
  Contact,
  TrendingUp
} from 'lucide-react';
import { useAgentData } from '../../hooks/useAgentData';
import { AgentService } from '../../services/agentService';
import { useAuth } from '../../hooks/useAuth';
import { addKnowledgeItemToDB, removeKnowledgeItemFromDB, addToolToDB, removeToolFromDB } from '../../lib/knowledge';
import ToolsLibraryModal from './ToolsLibraryModal';
import ToolConfigurationWizard from './ToolConfigurationWizard';

interface AIAgentBuilderExactProps {
  agentId?: string;
  onBack: () => void;
}

const AIAgentBuilderExact: React.FC<AIAgentBuilderExactProps> = ({ agentId, onBack }) => {
  const { user } = useAuth();
  const { agent, loading } = useAgentData(agentId || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'knowledge' | 'prompts' | 'triggers' | 'escalations' | 'variables'>('overview');
  const [saving, setSaving] = useState(false);
  const [showToolsLibrary, setShowToolsLibrary] = useState(false);
  const [showToolWizard, setShowToolWizard] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Form state for new agent
  const [agentData, setAgentData] = useState({
    name: '',
    description: '',
    purpose: '',
    system_prompt: '',
    temperature: 0.7,
    top_p: 0.9,
    model: 'gpt-4',
    output_mode: 'message',
    memory_enabled: false,
    memory_type: 'vector_store',
    context_size: 4000,
    max_retries: 3,
    fallback_response: ''
  });

  // Initialize form data when agent loads or for new agent
  useEffect(() => {
    if (agent) {
      setAgentData({
        name: agent.name || '',
        description: agent.description || '',
        purpose: agent.purpose || '',
        system_prompt: agent.system_prompt || '',
        temperature: agent.temperature || 0.7,
        top_p: agent.top_p || 0.9,
        model: agent.model || 'gpt-4',
        output_mode: agent.output_mode || 'message',
        memory_enabled: agent.memory_enabled || false,
        memory_type: agent.memory_type || 'vector_store',
        context_size: agent.context_size || 4000,
        max_retries: agent.max_retries || 3,
        fallback_response: agent.fallback_response || ''
      });
    } else if (!agentId) {
      // New agent - set defaults
      setAgentData({
        name: 'New AI Agent',
        description: '',
        purpose: '',
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
    }
  }, [agent, agentId]);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      if (agentId && agent) {
        // Update existing agent
        await AgentService.updateAgent(agentId, agentData);
      } else {
        // Create new agent
        const newAgent = await AgentService.createAgent({
          user_id: user.id,
          workspace_id: null, // Will be set when workspaces are implemented
          ...agentData
        });
        
        // Redirect to the new agent
        window.location.hash = `#agent/${newAgent.id}`;
      }
    } catch (error) {
      console.error('Error saving agent:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTestAgent = async () => {
    setIsTesting(true);
    // Simulate agent test
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

  const handleAddTool = async (template: any) => {
    if (!agentId) return;
    
    try {
      await addToolToDB(agentId, template.id);
      setShowToolsLibrary(false);
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  const handleRemoveTool = async (toolId: string) => {
    try {
      await removeToolFromDB(toolId);
    } catch (error) {
      console.error('Error removing tool:', error);
    }
  };

  const handleAddKnowledge = async (item: any) => {
    if (!agentId) return;
    
    try {
      await addKnowledgeItemToDB(agentId, item);
    } catch (error) {
      console.error('Error adding knowledge item:', error);
    }
  };

  const handleRemoveKnowledge = async (itemId: string) => {
    try {
      await removeKnowledgeItemFromDB(itemId);
    } catch (error) {
      console.error('Error removing knowledge item:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'tools', label: 'Tools', icon: Zap },
    { id: 'knowledge', label: 'Knowledge', icon: Brain },
    { id: 'prompts', label: 'Prompts', icon: MessageSquare },
    { id: 'triggers', label: 'Triggers', icon: Calendar },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle },
    { id: 'variables', label: 'Variables', icon: Code }
  ];

  if (loading && agentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent...</p>
        </div>
      </div>
    );
  }

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
                {agentData.name}
              </h1>
              <p className="text-sm text-gray-600">
                {agentId ? 'Edit AI Agent' : 'Create New AI Agent'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestAgent}
              disabled={isTesting || !agentId}
              className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4" />
                  Test Agent
                </>
              )}
            </button>
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
                  {agentId ? 'Save Changes' : 'Create Agent'}
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
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agent Name
                      </label>
                      <input
                        type="text"
                        value={agentData.name}
                        onChange={(e) => setAgentData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter agent name..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model
                      </label>
                      <select
                        value={agentData.model}
                        onChange={(e) => setAgentData(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                        <option value="claude-3-haiku">Claude 3 Haiku</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={agentData.description}
                      onChange={(e) => setAgentData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                      placeholder="Describe what this agent does..."
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose
                    </label>
                    <textarea
                      value={agentData.purpose}
                      onChange={(e) => setAgentData(prev => ({ ...prev, purpose: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={2}
                      placeholder="What is the main purpose of this agent?"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      System Prompt
                    </label>
                    <textarea
                      value={agentData.system_prompt}
                      onChange={(e) => setAgentData(prev => ({ ...prev, system_prompt: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={4}
                      placeholder="You are a helpful AI assistant..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temperature
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="2"
                        step="0.1"
                        value={agentData.temperature}
                        onChange={(e) => setAgentData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
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
                        value={agentData.top_p}
                        onChange={(e) => setAgentData(prev => ({ ...prev, top_p: parseFloat(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Memory Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Memory Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={agentData.memory_enabled}
                          onChange={(e) => setAgentData(prev => ({ ...prev, memory_enabled: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable Memory</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Allow the agent to remember previous conversations and context
                      </p>
                    </div>

                    {agentData.memory_enabled && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Memory Type
                          </label>
                          <select
                            value={agentData.memory_type}
                            onChange={(e) => setAgentData(prev => ({ ...prev, memory_type: e.target.value as any }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="vector_store">Vector Store</option>
                            <option value="supabase">Supabase</option>
                            <option value="redis">Redis</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Context Size
                          </label>
                          <input
                            type="number"
                            value={agentData.context_size}
                            onChange={(e) => setAgentData(prev => ({ ...prev, context_size: parseInt(e.target.value) }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="4000"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Test Results */}
                {testResults && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full" />
                        <span className="text-sm font-medium text-green-800">Agent Test Passed</span>
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
              </motion.div>
            )}

            {/* Tools Tab */}
            {activeTab === 'tools' && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Agent Tools</h3>
                  <button
                    onClick={() => setShowToolsLibrary(true)}
                    disabled={!agentId}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Tool
                  </button>
                </div>

                {!agentId && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      Save the agent first to add tools.
                    </p>
                  </div>
                )}

                {agent?.tools && agent.tools.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium mb-1">No tools added yet</p>
                    <p className="text-sm">Add tools to give your agent capabilities</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {agent?.tools?.map((tool) => (
                      <div
                        key={tool.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <tool.icon className="w-5 h-5 text-purple-600" />
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
                              onChange={() => {
                                // Toggle tool enabled state
                              }}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Enabled</span>
                          </label>
                          <button
                            onClick={() => handleRemoveTool(tool.id)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Knowledge Tab */}
            {activeTab === 'knowledge' && (
              <motion.div
                key="knowledge"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Knowledge Base</h3>
                  <button
                    onClick={() => {
                      // Add knowledge item
                    }}
                    disabled={!agentId}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Knowledge
                  </button>
                </div>

                {!agentId && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      Save the agent first to add knowledge.
                    </p>
                  </div>
                )}

                {agent?.knowledgeBases && agent.knowledgeBases.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium mb-1">No knowledge added yet</p>
                    <p className="text-sm">Add knowledge to enhance your agent's capabilities</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {agent?.knowledgeBases?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-blue-600" />
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
                              onChange={() => {
                                // Toggle knowledge enabled state
                              }}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Enabled</span>
                          </label>
                          <button
                            onClick={() => handleRemoveKnowledge(item.id)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Prompts Tab */}
            {activeTab === 'prompts' && (
              <motion.div
                key="prompts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Custom Prompts</h3>
                  <button
                    disabled={!agentId}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Prompt
                  </button>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium mb-1">No custom prompts yet</p>
                  <p className="text-sm">Add custom prompts to enhance your agent's responses</p>
                </div>
              </motion.div>
            )}

            {/* Triggers Tab */}
            {activeTab === 'triggers' && (
              <motion.div
                key="triggers"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Triggers</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Triggers allow you to create tasks for your agent from schedules or integrations.
                  </p>
                </div>

                {/* Connect Section */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Connect</h4>
                  
                  {/* Info Banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-800">
                        Not sure how to use triggers?{' '}
                        <a href="#" className="underline font-medium">Watch this example tutorial</a>
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Connected Accounts */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                          <Mail className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">info@yogibrand.co</div>
                          <div className="text-sm text-gray-600">Google (Gmail, Calendar, Docs, & API)</div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <Clock className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">h</div>
                          <div className="text-sm text-gray-600">Daily At 12:00 PM</div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Available Integrations */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { name: 'Outlook', icon: Mail, color: 'blue' },
                      { name: 'Gmail', icon: Mail, color: 'red' },
                      { name: 'Google Calendar', icon: Calendar, color: 'blue' },
                      { name: 'HubSpot', icon: Target, color: 'orange' },
                      { name: 'Freshdesk', icon: Users, color: 'green' },
                      { name: 'Salesforce', icon: Database, color: 'blue' },
                      { name: 'ZoomInfo', icon: Search, color: 'purple' },
                      { name: 'Relevance Meeting Bot', icon: Bot, color: 'indigo' }
                    ].map((integration) => (
                      <button
                        key={integration.name}
                        className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
                      >
                        <integration.icon className={`w-6 h-6 mx-auto mb-2 text-${integration.color}-600`} />
                        <div className="text-xs font-medium text-gray-900">{integration.name}</div>
                      </button>
                    ))}
                  </div>

                  {/* Recurring Schedule */}
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Recurring Schedule</span>
                  </div>

                  {/* Premium Triggers */}
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-2">Premium triggers</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      These triggers are accessible for Teams and Business plan users. They incur an{' '}
                      <span className="font-medium">additional 5000 credits per month</span> for each connected account in your organization.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { name: 'WhatsApp', icon: MessageSquare, color: 'green' },
                        { name: 'LinkedIn', icon: Users, color: 'blue' },
                        { name: 'Telegram', icon: MessageSquare, color: 'blue' }
                      ].map((integration) => (
                        <button
                          key={integration.name}
                          className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
                        >
                          <integration.icon className={`w-6 h-6 mx-auto mb-2 text-${integration.color}-600`} />
                          <div className="text-xs font-medium text-gray-900">{integration.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Build Your Own Triggers */}
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">Build your own triggers</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { name: 'Custom webhook', icon: Webhook },
                        { name: 'Zapier', icon: Zap },
                        { name: 'Tool as trigger', icon: Settings },
                        { name: 'API', icon: Code }
                      ].map((trigger) => (
                        <button
                          key={trigger.name}
                          className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
                        >
                          <trigger.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                          <div className="text-xs font-medium text-gray-900">{trigger.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Schedule Messages */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Schedule messages</h4>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Enable scheduled messages</h5>
                        <p className="text-sm text-gray-600">Allow your agent to schedule future actions.</p>
                      </div>
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                        Upgrade
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Escalations Tab */}
            {activeTab === 'escalations' && (
              <motion.div
                key="escalations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Escalations</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Configure how your agent brings humans into the loop, via Slack or email notifications
                  </p>
                </div>

                {/* Slack Notifications */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">Slack Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified in Slack when a task meets a specific status</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                      <Plus className="w-4 h-4" />
                      Add agent notification
                    </button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Access "Escalation" feature by{' '}
                      <a href="#" className="text-blue-600 underline font-medium">upgrading to a paid plan</a>.
                    </p>
                  </div>
                </div>

                {/* Tool Approvals */}
                <div className="border-t border-gray-200 pt-6">
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-2">Tool approvals</h4>
                    <p className="text-sm text-gray-600 mb-6">
                      Configure if approval is needed before running a tool and how agent responds to tool failure
                    </p>
                  </div>

                  {/* Default Fail Behavior */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 mb-1">Default fail behavior</h5>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Always retry errored tool/subagent */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h6 className="font-medium text-gray-900 mb-1">Always retry errored tool/subagent</h6>
                          <p className="text-sm text-gray-600">
                            When on, forces agent to retry errored tools/subagents until success or max retries (at which point the task will fail). When off, agent decides whether to retry or continue the session.
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>

                      {/* Maximum number of tools/subagents retries */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Maximum number of tools/subagents retries
                        </label>
                        <p className="text-sm text-gray-600 mb-3">
                          Number of times the agent will retry a tool/subagent that errors before marking the task as failed. Increasing this may raise credit usage.
                        </p>
                        <input
                          type="number"
                          defaultValue={3}
                          className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      {/* Behaviour after max tool/subagent retries */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Behaviour after max tool/subagent retries
                        </label>
                        <p className="text-sm text-gray-600 mb-3">
                          Decide what should happen when the maximum number of retries is reached.
                        </p>
                        <select className="w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                          <option value="terminate">Terminate task</option>
                          <option value="continue">Continue without tool</option>
                          <option value="escalate">Escalate to human</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Variables Tab */}
            {activeTab === 'variables' && (
              <motion.div
                key="variables"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Agent Variables</h3>
                  <button
                    disabled={!agentId}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Variable
                  </button>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <Code className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium mb-1">No variables defined yet</p>
                  <p className="text-sm">Add variables to store and reuse data across agent sessions</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tools Library Modal */}
      <ToolsLibraryModal
        isOpen={showToolsLibrary}
        onClose={() => setShowToolsLibrary(false)}
        onSelectTool={handleAddTool}
        onCreateCustomTool={() => {
          setShowToolsLibrary(false);
          setShowToolWizard(true);
        }}
      />

      {/* Tool Configuration Wizard */}
      <ToolConfigurationWizard
        isOpen={showToolWizard}
        onClose={() => setShowToolWizard(false)}
        agentId={agentId || ''}
        existingTool={selectedTool}
        onToolSaved={() => {
          setShowToolWizard(false);
          setSelectedTool(null);
        }}
      />
    </div>
  );
};

export default AIAgentBuilderExact;