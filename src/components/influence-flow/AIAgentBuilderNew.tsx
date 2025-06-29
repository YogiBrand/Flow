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
  BookOpen,
  AlertTriangle,
  Database,
  FileText,
  Link,
  Globe,
  Code,
  Search,
  Webhook,
  Calendar,
  User,
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import { AgentService } from '../../services/agentService';
import { useAuth } from '../../hooks/useAuth';
import type { 
  DatabaseAgent, 
  DatabaseKnowledgeBase, 
  DatabaseTool, 
  DatabasePrompt,
  DatabaseTrigger,
  DatabaseEscalation,
  DatabaseVariable
} from '../../lib/supabase';

interface AIAgentBuilderNewProps {
  agent?: any | null;
  onBack: () => void;
}

const AIAgentBuilderNew: React.FC<AIAgentBuilderNewProps> = ({ agent, onBack }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(agent?.id || null);
  
  // Agent data state
  const [agentData, setAgentData] = useState<Partial<DatabaseAgent>>({
    name: agent?.name || 'New AI Agent',
    description: agent?.description || '',
    purpose: agent?.purpose || '',
    status: 'draft',
    system_prompt: agent?.system_prompt || '',
    temperature: agent?.temperature || 0.7,
    top_p: agent?.top_p || 0.9,
    model: agent?.model || 'gpt-4',
    output_mode: agent?.output_mode || 'message',
    memory_enabled: agent?.memory_enabled || false,
    memory_type: agent?.memory_type || 'vector_store',
    context_size: agent?.context_size || 4000,
    max_retries: agent?.max_retries || 3,
    fallback_response: agent?.fallback_response || ''
  });

  const [knowledgeBases, setKnowledgeBases] = useState<DatabaseKnowledgeBase[]>([]);
  const [tools, setTools] = useState<DatabaseTool[]>([]);
  const [prompts, setPrompts] = useState<DatabasePrompt[]>([]);
  const [triggers, setTriggers] = useState<DatabaseTrigger[]>([]);
  const [escalations, setEscalations] = useState<DatabaseEscalation[]>([]);
  const [variables, setVariables] = useState<DatabaseVariable[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'knowledge' | 'tools' | 'prompts' | 'triggers' | 'escalations' | 'variables' | 'settings'>('overview');
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Load agent data if editing existing agent
  useEffect(() => {
    if (agentId) {
      loadAgentData();
    }
  }, [agentId]);

  const loadAgentData = async () => {
    if (!agentId) return;
    
    setLoading(true);
    try {
      const data = await AgentService.getFullAgentData(agentId);
      if (data.agent) {
        setAgentData(data.agent);
        setKnowledgeBases(data.knowledgeBases);
        setTools(data.tools);
        setPrompts(data.prompts);
        setTriggers(data.triggers);
        setEscalations(data.escalations);
        setVariables(data.variables);
      }
    } catch (error) {
      console.error('Error loading agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAgent = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      let savedAgent: DatabaseAgent;
      
      if (agentId) {
        // Update existing agent
        savedAgent = await AgentService.updateAgent(agentId, agentData);
      } else {
        // Create new agent
        savedAgent = await AgentService.createAgent({
          ...agentData,
          user_id: user.id
        });
        setAgentId(savedAgent.id);
      }
      
      console.log('Agent saved successfully:', savedAgent);
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
          toolsUsed: tools.filter(t => t.enabled).length
        }
      });
      setIsTesting(false);
    }, 2000);
  };

  // Knowledge Base operations
  const addKnowledgeBase = async (type: 'text' | 'document' | 'url' | 'database') => {
    if (!agentId) {
      alert('Please save the agent first');
      return;
    }

    try {
      const newKnowledge = await AgentService.createKnowledgeBase({
        agent_id: agentId,
        name: `New ${type} knowledge`,
        type,
        content: '',
        metadata: {},
        enabled: true
      });
      setKnowledgeBases(prev => [...prev, newKnowledge]);
    } catch (error) {
      console.error('Error adding knowledge base:', error);
    }
  };

  const updateKnowledgeBase = async (knowledgeId: string, updates: Partial<DatabaseKnowledgeBase>) => {
    try {
      const updated = await AgentService.updateKnowledgeBase(knowledgeId, updates);
      setKnowledgeBases(prev => prev.map(kb => kb.id === knowledgeId ? updated : kb));
    } catch (error) {
      console.error('Error updating knowledge base:', error);
    }
  };

  const deleteKnowledgeBase = async (knowledgeId: string) => {
    try {
      await AgentService.deleteKnowledgeBase(knowledgeId);
      setKnowledgeBases(prev => prev.filter(kb => kb.id !== knowledgeId));
    } catch (error) {
      console.error('Error deleting knowledge base:', error);
    }
  };

  // Tool operations
  const addTool = async (type: string) => {
    if (!agentId) {
      alert('Please save the agent first');
      return;
    }

    try {
      const newTool = await AgentService.createTool({
        agent_id: agentId,
        name: `New ${type.replace('_', ' ')} tool`,
        type: type as any,
        config: {},
        enabled: true
      });
      setTools(prev => [...prev, newTool]);
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  const updateTool = async (toolId: string, updates: Partial<DatabaseTool>) => {
    try {
      const updated = await AgentService.updateTool(toolId, updates);
      setTools(prev => prev.map(t => t.id === toolId ? updated : t));
    } catch (error) {
      console.error('Error updating tool:', error);
    }
  };

  const deleteTool = async (toolId: string) => {
    try {
      await AgentService.deleteTool(toolId);
      setTools(prev => prev.filter(t => t.id !== toolId));
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  // Render functions for each tab
  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agent Name
        </label>
        <input
          type="text"
          value={agentData.name || ''}
          onChange={(e) => setAgentData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter agent name..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={agentData.description || ''}
          onChange={(e) => setAgentData(prev => ({ ...prev, description: e.target.value }))}
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
          value={agentData.purpose || ''}
          onChange={(e) => setAgentData(prev => ({ ...prev, purpose: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={2}
          placeholder="What is the main purpose of this agent?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={agentData.status || 'draft'}
          onChange={(e) => setAgentData(prev => ({ ...prev, status: e.target.value as any }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>
  );

  const renderKnowledgeTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Knowledge Bases</h4>
        <div className="flex gap-2">
          <button
            onClick={() => addKnowledgeBase('text')}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Text
          </button>
          <button
            onClick={() => addKnowledgeBase('document')}
            className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Document
          </button>
          <button
            onClick={() => addKnowledgeBase('url')}
            className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Link className="w-4 h-4" />
            URL
          </button>
        </div>
      </div>

      {knowledgeBases.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium mb-1">No knowledge bases added yet</p>
          <p className="text-sm">Add knowledge to give your agent context and information</p>
        </div>
      ) : (
        <div className="space-y-3">
          {knowledgeBases.map((kb) => (
            <div key={kb.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    {kb.type === 'text' && <FileText className="w-4 h-4 text-blue-600" />}
                    {kb.type === 'document' && <Database className="w-4 h-4 text-blue-600" />}
                    {kb.type === 'url' && <Link className="w-4 h-4 text-blue-600" />}
                  </div>
                  <input
                    type="text"
                    value={kb.name}
                    onChange={(e) => updateKnowledgeBase(kb.id, { name: e.target.value })}
                    className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={kb.enabled}
                      onChange={(e) => updateKnowledgeBase(kb.id, { enabled: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enabled</span>
                  </label>
                  <button
                    onClick={() => deleteKnowledgeBase(kb.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <textarea
                value={kb.content || ''}
                onChange={(e) => updateKnowledgeBase(kb.id, { content: e.target.value })}
                placeholder={`Enter ${kb.type} content...`}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderToolsTab = () => {
    const availableTools = [
      { type: 'web_scraper', name: 'Web Scraper', icon: Globe },
      { type: 'search_tool', name: 'Search Tool', icon: Search },
      { type: 'api_call', name: 'API Call', icon: Webhook },
      { type: 'data_extractor', name: 'Data Extractor', icon: Database },
      { type: 'code_interpreter', name: 'Code Interpreter', icon: Code }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-gray-900">Agent Tools</h4>
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addTool(e.target.value);
                  e.target.value = '';
                }
              }}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Add Tool...</option>
              {availableTools
                .filter(tool => !tools.some(t => t.type === tool.type))
                .map(tool => (
                  <option key={tool.type} value={tool.type}>
                    {tool.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {tools.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium mb-1">No tools added yet</p>
            <p className="text-sm">Add tools to give your agent capabilities</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={tool.name}
                      onChange={(e) => updateTool(tool.id, { name: e.target.value })}
                      className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                    />
                    <p className="text-sm text-gray-600">{tool.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={tool.enabled}
                      onChange={(e) => updateTool(tool.id, { enabled: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enabled</span>
                  </label>
                  <button
                    onClick={() => deleteTool(tool.id)}
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
  };

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt
        </label>
        <textarea
          value={agentData.system_prompt || ''}
          onChange={(e) => setAgentData(prev => ({ ...prev, system_prompt: e.target.value }))}
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
            value={agentData.temperature || 0.7}
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
            value={agentData.top_p || 0.9}
            onChange={(e) => setAgentData(prev => ({ ...prev, top_p: parseFloat(e.target.value) }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model
        </label>
        <select
          value={agentData.model || 'gpt-4'}
          onChange={(e) => setAgentData(prev => ({ ...prev, model: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          <option value="claude-3-haiku">Claude 3 Haiku</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agentData.memory_enabled || false}
            onChange={(e) => setAgentData(prev => ({ ...prev, memory_enabled: e.target.checked }))}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700">Enable Memory</span>
        </label>
      </div>

      {agentData.memory_enabled && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Context Size
          </label>
          <input
            type="number"
            value={agentData.context_size || 4000}
            onChange={(e) => setAgentData(prev => ({ ...prev, context_size: parseInt(e.target.value) }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="4000"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fallback Response
        </label>
        <textarea
          value={agentData.fallback_response || ''}
          onChange={(e) => setAgentData(prev => ({ ...prev, fallback_response: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          placeholder="Response when agent fails..."
        />
      </div>

      {/* Test Agent Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Test Agent</h4>
          <button
            onClick={handleTestAgent}
            disabled={isTesting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Test Agent
              </>
            )}
          </button>
        </div>

        {testResults && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
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
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
    { id: 'tools', label: 'Tools', icon: Zap },
    { id: 'prompts', label: 'Prompts', icon: MessageSquare },
    { id: 'triggers', label: 'Triggers', icon: Play },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle },
    { id: 'variables', label: 'Variables', icon: Database },
    { id: 'settings', label: 'Settings', icon: Bot }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading agent data...</p>
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
              <p className="text-sm text-gray-600">AI Agent Configuration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAgent}
              disabled={saving || !user}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
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
          {activeTab === 'knowledge' && renderKnowledgeTab()}
          {activeTab === 'tools' && renderToolsTab()}
          {activeTab === 'prompts' && <div className="text-center py-8 text-gray-500">Prompts management coming soon...</div>}
          {activeTab === 'triggers' && <div className="text-center py-8 text-gray-500">Triggers management coming soon...</div>}
          {activeTab === 'escalations' && <div className="text-center py-8 text-gray-500">Escalations management coming soon...</div>}
          {activeTab === 'variables' && <div className="text-center py-8 text-gray-500">Variables management coming soon...</div>}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>
    </div>
  );
};

export default AIAgentBuilderNew;