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
  Loader,
  Eye,
  Clock,
  GitBranch,
  Target,
  Shield,
  Variable,
  Hash,
  Type,
  ToggleLeft,
  ToggleRight,
  List,
  Grid,
  Edit3,
  Copy,
  Download,
  Upload
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
  
  // Agent data state - initialize directly from prop
  const [agentData, setAgentData] = useState<Partial<DatabaseAgent>>({
    name: agent?.name || 'New AI Agent',
    description: agent?.description || '',
    purpose: agent?.purpose || '',
    status: agent?.status || 'draft',
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

  // UI state
  const [expandedKnowledge, setExpandedKnowledge] = useState<string | null>(null);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [expandedTrigger, setExpandedTrigger] = useState<string | null>(null);
  const [expandedEscalation, setExpandedEscalation] = useState<string | null>(null);
  const [expandedVariable, setExpandedVariable] = useState<string | null>(null);

  // Load related agent data if editing existing agent
  useEffect(() => {
    if (agentId && agent && !agent.isMock) {
      loadRelatedAgentData();
    }
  }, [agentId, agent]);

  const loadRelatedAgentData = async () => {
    if (!agentId || !agent || agent.isMock) return;
    
    setLoading(true);
    try {
      const data = await AgentService.getFullAgentData(agentId);
      if (data) {
        setKnowledgeBases(data.knowledgeBases || []);
        setTools(data.tools || []);
        setPrompts(data.prompts || []);
        setTriggers(data.triggers || []);
        setEscalations(data.escalations || []);
        setVariables(data.variables || []);
      }
    } catch (error) {
      console.error('Error loading related agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAgent = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      let savedAgent: DatabaseAgent;
      
      if (agentId && agent && !agent.isMock) {
        savedAgent = await AgentService.updateAgent(agentId, agentData);
      } else {
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
    setTimeout(() => {
      setTestResults({
        status: 'success',
        executionTime: '2.1s',
        output: {
          message: 'Agent executed successfully',
          response: 'Hello! I am your AI assistant. How can I help you today?',
          toolsUsed: tools.filter(t => t.enabled).length,
          knowledgeBasesUsed: knowledgeBases.filter(kb => kb.enabled).length,
          promptsExecuted: prompts.filter(p => p.enabled).length
        }
      });
      setIsTesting(false);
    }, 2000);
  };

  // Knowledge Base operations
  const addKnowledgeBase = async (type: 'text' | 'document' | 'url' | 'database') => {
    if (!agentId || (agent && agent.isMock)) {
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
    if (!agentId || (agent && agent.isMock)) {
      alert('Please save the agent first');
      return;
    }

    try {
      const newTool = await AgentService.createTool({
        agent_id: agentId,
        name: `New ${type.replace('_', ' ')} tool`,
        type: type as any,
        config: getDefaultToolConfig(type),
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

  // Prompt operations
  const addPrompt = async (type: 'system' | 'user' | 'assistant' | 'custom') => {
    if (!agentId || (agent && agent.isMock)) {
      alert('Please save the agent first');
      return;
    }

    try {
      const newPrompt = await AgentService.createPrompt({
        agent_id: agentId,
        name: `New ${type} prompt`,
        type,
        content: getDefaultPromptContent(type),
        variables: [],
        enabled: true
      });
      setPrompts(prev => [...prev, newPrompt]);
    } catch (error) {
      console.error('Error adding prompt:', error);
    }
  };

  const updatePrompt = async (promptId: string, updates: Partial<DatabasePrompt>) => {
    try {
      const updated = await AgentService.updatePrompt(promptId, updates);
      setPrompts(prev => prev.map(p => p.id === promptId ? updated : p));
    } catch (error) {
      console.error('Error updating prompt:', error);
    }
  };

  const deletePrompt = async (promptId: string) => {
    try {
      await AgentService.deletePrompt(promptId);
      setPrompts(prev => prev.filter(p => p.id !== promptId));
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  // Trigger operations
  const addTrigger = async (type: 'manual' | 'message_step' | 'api' | 'webhook' | 'schedule' | 'event') => {
    if (!agentId || (agent && agent.isMock)) {
      alert('Please save the agent first');
      return;
    }

    try {
      const newTrigger = await AgentService.createTrigger({
        agent_id: agentId,
        name: `New ${type} trigger`,
        type,
        config: getDefaultTriggerConfig(type),
        enabled: true
      });
      setTriggers(prev => [...prev, newTrigger]);
    } catch (error) {
      console.error('Error adding trigger:', error);
    }
  };

  const updateTrigger = async (triggerId: string, updates: Partial<DatabaseTrigger>) => {
    try {
      const updated = await AgentService.updateTrigger(triggerId, updates);
      setTriggers(prev => prev.map(t => t.id === triggerId ? updated : t));
    } catch (error) {
      console.error('Error updating trigger:', error);
    }
  };

  const deleteTrigger = async (triggerId: string) => {
    try {
      await AgentService.deleteTrigger(triggerId);
      setTriggers(prev => prev.filter(t => t.id !== triggerId));
    } catch (error) {
      console.error('Error deleting trigger:', error);
    }
  };

  // Escalation operations
  const addEscalation = async () => {
    if (!agentId || (agent && agent.isMock)) {
      alert('Please save the agent first');
      return;
    }

    try {
      const newEscalation = await AgentService.createEscalation({
        agent_id: agentId,
        name: 'New escalation rule',
        condition_type: 'error',
        condition_config: {},
        action_type: 'fallback_response',
        action_config: { message: 'I apologize, but I encountered an error. Please try again.' },
        enabled: true
      });
      setEscalations(prev => [...prev, newEscalation]);
    } catch (error) {
      console.error('Error adding escalation:', error);
    }
  };

  const updateEscalation = async (escalationId: string, updates: Partial<DatabaseEscalation>) => {
    try {
      const updated = await AgentService.updateEscalation(escalationId, updates);
      setEscalations(prev => prev.map(e => e.id === escalationId ? updated : e));
    } catch (error) {
      console.error('Error updating escalation:', error);
    }
  };

  const deleteEscalation = async (escalationId: string) => {
    try {
      await AgentService.deleteEscalation(escalationId);
      setEscalations(prev => prev.filter(e => e.id !== escalationId));
    } catch (error) {
      console.error('Error deleting escalation:', error);
    }
  };

  // Variable operations
  const addVariable = async (type: 'string' | 'number' | 'boolean' | 'array' | 'object') => {
    if (!agentId || (agent && agent.isMock)) {
      alert('Please save the agent first');
      return;
    }

    try {
      const newVariable = await AgentService.createVariable({
        agent_id: agentId,
        name: `new_${type}_variable`,
        type,
        value: getDefaultVariableValue(type),
        description: `A ${type} variable for the agent`
      });
      setVariables(prev => [...prev, newVariable]);
    } catch (error) {
      console.error('Error adding variable:', error);
    }
  };

  const updateVariable = async (variableId: string, updates: Partial<DatabaseVariable>) => {
    try {
      const updated = await AgentService.updateVariable(variableId, updates);
      setVariables(prev => prev.map(v => v.id === variableId ? updated : v));
    } catch (error) {
      console.error('Error updating variable:', error);
    }
  };

  const deleteVariable = async (variableId: string) => {
    try {
      await AgentService.deleteVariable(variableId);
      setVariables(prev => prev.filter(v => v.id !== variableId));
    } catch (error) {
      console.error('Error deleting variable:', error);
    }
  };

  // Helper functions
  const getDefaultToolConfig = (type: string) => {
    switch (type) {
      case 'web_scraper':
        return { url: '', selectors: [], headers: {} };
      case 'search_tool':
        return { engine: 'google', maxResults: 10 };
      case 'api_call':
        return { method: 'GET', url: '', headers: {}, body: {} };
      case 'data_extractor':
        return { format: 'json', fields: [] };
      case 'code_interpreter':
        return { language: 'python', timeout: 30 };
      default:
        return {};
    }
  };

  const getDefaultPromptContent = (type: string) => {
    switch (type) {
      case 'system':
        return 'You are a helpful AI assistant.';
      case 'user':
        return 'Hello, how can you help me?';
      case 'assistant':
        return 'I can help you with various tasks. What would you like to know?';
      default:
        return 'Enter your custom prompt here...';
    }
  };

  const getDefaultTriggerConfig = (type: string) => {
    switch (type) {
      case 'webhook':
        return { url: '', method: 'POST', headers: {} };
      case 'schedule':
        return { cron: '0 9 * * *', timezone: 'UTC' };
      case 'api':
        return { endpoint: '/trigger', method: 'POST' };
      default:
        return {};
    }
  };

  const getDefaultVariableValue = (type: string) => {
    switch (type) {
      case 'string':
        return '';
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'array':
        return [];
      case 'object':
        return {};
      default:
        return null;
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

      {/* Agent Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{knowledgeBases.length}</div>
          <div className="text-sm text-gray-600">Knowledge Bases</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{tools.length}</div>
          <div className="text-sm text-gray-600">Tools</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{prompts.length}</div>
          <div className="text-sm text-gray-600">Prompts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{triggers.length}</div>
          <div className="text-sm text-gray-600">Triggers</div>
        </div>
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
          <button
            onClick={() => addKnowledgeBase('database')}
            className="px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Database
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
            <div key={kb.id} className="border border-gray-200 rounded-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {kb.type === 'text' && <FileText className="w-4 h-4 text-blue-600" />}
                      {kb.type === 'document' && <Database className="w-4 h-4 text-blue-600" />}
                      {kb.type === 'url' && <Link className="w-4 h-4 text-blue-600" />}
                      {kb.type === 'database' && <Database className="w-4 h-4 text-blue-600" />}
                    </div>
                    <input
                      type="text"
                      value={kb.name}
                      onChange={(e) => updateKnowledgeBase(kb.id, { name: e.target.value })}
                      className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                    />
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                      {kb.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedKnowledge(expandedKnowledge === kb.id ? null : kb.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
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
                
                {expandedKnowledge === kb.id && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <textarea
                      value={kb.content || ''}
                      onChange={(e) => updateKnowledgeBase(kb.id, { content: e.target.value })}
                      placeholder={`Enter ${kb.type} content...`}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={6}
                    />
                    
                    {kb.type === 'url' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL to scrape
                        </label>
                        <input
                          type="url"
                          value={kb.metadata?.url || ''}
                          onChange={(e) => updateKnowledgeBase(kb.id, { 
                            metadata: { ...kb.metadata, url: e.target.value }
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="https://example.com"
                        />
                      </div>
                    )}
                    
                    {kb.type === 'database' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Connection String
                          </label>
                          <input
                            type="text"
                            value={kb.metadata?.connectionString || ''}
                            onChange={(e) => updateKnowledgeBase(kb.id, { 
                              metadata: { ...kb.metadata, connectionString: e.target.value }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Database connection string"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Query
                          </label>
                          <input
                            type="text"
                            value={kb.metadata?.query || ''}
                            onChange={(e) => updateKnowledgeBase(kb.id, { 
                              metadata: { ...kb.metadata, query: e.target.value }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="SELECT * FROM table"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderToolsTab = () => {
    const availableTools = [
      { type: 'web_scraper', name: 'Web Scraper', icon: Globe, description: 'Extract data from web pages' },
      { type: 'search_tool', name: 'Search Tool', icon: Search, description: 'Search the web for information' },
      { type: 'api_call', name: 'API Call', icon: Webhook, description: 'Make HTTP requests to external APIs' },
      { type: 'data_extractor', name: 'Data Extractor', icon: Database, description: 'Extract and process structured data' },
      { type: 'code_interpreter', name: 'Code Interpreter', icon: Code, description: 'Execute Python code for data analysis' }
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
              <div key={tool.id} className="border border-gray-200 rounded-lg">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
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
                      <button
                        onClick={() => setExpandedTool(expandedTool === tool.id ? null : tool.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
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

                  {expandedTool === tool.id && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      {tool.type === 'web_scraper' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Target URL
                            </label>
                            <input
                              type="url"
                              value={tool.config?.url || ''}
                              onChange={(e) => updateTool(tool.id, { 
                                config: { ...tool.config, url: e.target.value }
                              })}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="https://example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CSS Selectors
                            </label>
                            <input
                              type="text"
                              value={tool.config?.selectors?.join(', ') || ''}
                              onChange={(e) => updateTool(tool.id, { 
                                config: { ...tool.config, selectors: e.target.value.split(', ').filter(s => s.trim()) }
                              })}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder=".title, .content, .price"
                            />
                          </div>
                        </div>
                      )}

                      {tool.type === 'search_tool' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Search Engine
                            </label>
                            <select
                              value={tool.config?.engine || 'google'}
                              onChange={(e) => updateTool(tool.id, { 
                                config: { ...tool.config, engine: e.target.value }
                              })}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="google">Google</option>
                              <option value="bing">Bing</option>
                              <option value="duckduckgo">DuckDuckGo</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Max Results
                            </label>
                            <input
                              type="number"
                              value={tool.config?.maxResults || 10}
                              onChange={(e) => updateTool(tool.id, { 
                                config: { ...tool.config, maxResults: parseInt(e.target.value) }
                              })}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              min="1"
                              max="100"
                            />
                          </div>
                        </div>
                      )}

                      {tool.type === 'api_call' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                HTTP Method
                              </label>
                              <select
                                value={tool.config?.method || 'GET'}
                                onChange={(e) => updateTool(tool.id, { 
                                  config: { ...tool.config, method: e.target.value }
                                })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                API URL
                              </label>
                              <input
                                type="url"
                                value={tool.config?.url || ''}
                                onChange={(e) => updateTool(tool.id, { 
                                  config: { ...tool.config, url: e.target.value }
                                })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="https://api.example.com/endpoint"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Headers (JSON)
                            </label>
                            <textarea
                              value={JSON.stringify(tool.config?.headers || {}, null, 2)}
                              onChange={(e) => {
                                try {
                                  const headers = JSON.parse(e.target.value);
                                  updateTool(tool.id, { 
                                    config: { ...tool.config, headers }
                                  });
                                } catch (err) {
                                  // Invalid JSON, don't update
                                }
                              }}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                              rows={3}
                              placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                            />
                          </div>
                        </div>
                      )}

                      {tool.type === 'code_interpreter' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Language
                            </label>
                            <select
                              value={tool.config?.language || 'python'}
                              onChange={(e) => updateTool(tool.id, { 
                                config: { ...tool.config, language: e.target.value }
                              })}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="python">Python</option>
                              <option value="javascript">JavaScript</option>
                              <option value="r">R</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Timeout (seconds)
                            </label>
                            <input
                              type="number"
                              value={tool.config?.timeout || 30}
                              onChange={(e) => updateTool(tool.id, { 
                                config: { ...tool.config, timeout: parseInt(e.target.value) }
                              })}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              min="1"
                              max="300"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPromptsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Agent Prompts</h4>
        <div className="flex gap-2">
          <button
            onClick={() => addPrompt('system')}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            System
          </button>
          <button
            onClick={() => addPrompt('user')}
            className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            User
          </button>
          <button
            onClick={() => addPrompt('assistant')}
            className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            Assistant
          </button>
          <button
            onClick={() => addPrompt('custom')}
            className="px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Custom
          </button>
        </div>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium mb-1">No prompts added yet</p>
          <p className="text-sm">Add prompts to define how your agent communicates</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="border border-gray-200 rounded-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={prompt.name}
                        onChange={(e) => updatePrompt(prompt.id, { name: e.target.value })}
                        className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                      />
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                        {prompt.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedPrompt(expandedPrompt === prompt.id ? null : prompt.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={prompt.enabled}
                        onChange={(e) => updatePrompt(prompt.id, { enabled: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enabled</span>
                    </label>
                    <button
                      onClick={() => deletePrompt(prompt.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedPrompt === prompt.id && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prompt Content
                      </label>
                      <textarea
                        value={prompt.content}
                        onChange={(e) => updatePrompt(prompt.id, { content: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={6}
                        placeholder="Enter your prompt content..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Variables (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={prompt.variables?.join(', ') || ''}
                        onChange={(e) => updatePrompt(prompt.id, { 
                          variables: e.target.value.split(',').map(v => v.trim()).filter(v => v)
                        })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="userName, userAge, userLocation"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use these variables in your prompt with {`{{variableName}}`} syntax
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTriggersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Agent Triggers</h4>
        <div className="flex gap-2">
          <button
            onClick={() => addTrigger('manual')}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Manual
          </button>
          <button
            onClick={() => addTrigger('webhook')}
            className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Webhook className="w-4 h-4" />
            Webhook
          </button>
          <button
            onClick={() => addTrigger('schedule')}
            className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button
            onClick={() => addTrigger('api')}
            className="px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            API
          </button>
        </div>
      </div>

      {triggers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Play className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium mb-1">No triggers added yet</p>
          <p className="text-sm">Add triggers to define when your agent should execute</p>
        </div>
      ) : (
        <div className="space-y-3">
          {triggers.map((trigger) => (
            <div key={trigger.id} className="border border-gray-200 rounded-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Play className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={trigger.name}
                        onChange={(e) => updateTrigger(trigger.id, { name: e.target.value })}
                        className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                      />
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                        {trigger.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedTrigger(expandedTrigger === trigger.id ? null : trigger.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={trigger.enabled}
                        onChange={(e) => updateTrigger(trigger.id, { enabled: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enabled</span>
                    </label>
                    <button
                      onClick={() => deleteTrigger(trigger.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedTrigger === trigger.id && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    {trigger.type === 'webhook' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Webhook URL
                          </label>
                          <input
                            type="url"
                            value={trigger.config?.url || ''}
                            onChange={(e) => updateTrigger(trigger.id, { 
                              config: { ...trigger.config, url: e.target.value }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="https://api.example.com/webhook"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            HTTP Method
                          </label>
                          <select
                            value={trigger.config?.method || 'POST'}
                            onChange={(e) => updateTrigger(trigger.id, { 
                              config: { ...trigger.config, method: e.target.value }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {trigger.type === 'schedule' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cron Expression
                          </label>
                          <input
                            type="text"
                            value={trigger.config?.cron || ''}
                            onChange={(e) => updateTrigger(trigger.id, { 
                              config: { ...trigger.config, cron: e.target.value }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0 9 * * *"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Daily at 9 AM: 0 9 * * *
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={trigger.config?.timezone || 'UTC'}
                            onChange={(e) => updateTrigger(trigger.id, { 
                              config: { ...trigger.config, timezone: e.target.value }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Europe/London">London</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {trigger.type === 'api' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Endpoint
                        </label>
                        <input
                          type="text"
                          value={trigger.config?.endpoint || ''}
                          onChange={(e) => updateTrigger(trigger.id, { 
                            config: { ...trigger.config, endpoint: e.target.value }
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="/api/trigger-agent"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEscalationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Escalation Rules</h4>
        <button
          onClick={addEscalation}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Escalation
        </button>
      </div>

      {escalations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium mb-1">No escalation rules added yet</p>
          <p className="text-sm">Add rules to handle errors and edge cases</p>
        </div>
      ) : (
        <div className="space-y-3">
          {escalations.map((escalation) => (
            <div key={escalation.id} className="border border-gray-200 rounded-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={escalation.name}
                        onChange={(e) => updateEscalation(escalation.id, { name: e.target.value })}
                        className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                      />
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full capitalize">
                          {escalation.condition_type.replace('_', ' ')}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-400 mt-1" />
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full capitalize">
                          {escalation.action_type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedEscalation(expandedEscalation === escalation.id ? null : escalation.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={escalation.enabled}
                        onChange={(e) => updateEscalation(escalation.id, { enabled: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enabled</span>
                    </label>
                    <button
                      onClick={() => deleteEscalation(escalation.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedEscalation === escalation.id && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Condition Type
                        </label>
                        <select
                          value={escalation.condition_type}
                          onChange={(e) => updateEscalation(escalation.id, { 
                            condition_type: e.target.value as any
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="error">Error</option>
                          <option value="timeout">Timeout</option>
                          <option value="confidence_low">Low Confidence</option>
                          <option value="keyword">Keyword Match</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Action Type
                        </label>
                        <select
                          value={escalation.action_type}
                          onChange={(e) => updateEscalation(escalation.id, { 
                            action_type: e.target.value as any
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="human_handoff">Human Handoff</option>
                          <option value="fallback_response">Fallback Response</option>
                          <option value="retry">Retry</option>
                          <option value="escalate_agent">Escalate to Agent</option>
                        </select>
                      </div>
                    </div>

                    {escalation.condition_type === 'keyword' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Keywords (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={escalation.condition_config?.keywords?.join(', ') || ''}
                          onChange={(e) => updateEscalation(escalation.id, { 
                            condition_config: { 
                              ...escalation.condition_config, 
                              keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                            }
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="error, problem, help, stuck"
                        />
                      </div>
                    )}

                    {escalation.action_type === 'fallback_response' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fallback Message
                        </label>
                        <textarea
                          value={escalation.action_config?.message || ''}
                          onChange={(e) => updateEscalation(escalation.id, { 
                            action_config: { 
                              ...escalation.action_config, 
                              message: e.target.value
                            }
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          rows={3}
                          placeholder="I apologize, but I encountered an issue. Please try again or contact support."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderVariablesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Agent Variables</h4>
        <div className="flex gap-2">
          <button
            onClick={() => addVariable('string')}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Type className="w-4 h-4" />
            String
          </button>
          <button
            onClick={() => addVariable('number')}
            className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Hash className="w-4 h-4" />
            Number
          </button>
          <button
            onClick={() => addVariable('boolean')}
            className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <ToggleLeft className="w-4 h-4" />
            Boolean
          </button>
          <button
            onClick={() => addVariable('array')}
            className="px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            Array
          </button>
          <button
            onClick={() => addVariable('object')}
            className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            Object
          </button>
        </div>
      </div>

      {variables.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Variable className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium mb-1">No variables added yet</p>
          <p className="text-sm">Add variables to store and manage agent state</p>
        </div>
      ) : (
        <div className="space-y-3">
          {variables.map((variable) => (
            <div key={variable.id} className="border border-gray-200 rounded-lg">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Variable className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={variable.name}
                        onChange={(e) => updateVariable(variable.id, { name: e.target.value })}
                        className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                      />
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                        {variable.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedVariable(expandedVariable === variable.id ? null : variable.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteVariable(variable.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedVariable === variable.id && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={variable.description}
                        onChange={(e) => updateVariable(variable.id, { description: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Describe what this variable is used for..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Value
                      </label>
                      {variable.type === 'boolean' ? (
                        <select
                          value={variable.value ? 'true' : 'false'}
                          onChange={(e) => updateVariable(variable.id, { value: e.target.value === 'true' })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : variable.type === 'number' ? (
                        <input
                          type="number"
                          value={variable.value || 0}
                          onChange={(e) => updateVariable(variable.id, { value: parseFloat(e.target.value) || 0 })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : variable.type === 'string' ? (
                        <input
                          type="text"
                          value={variable.value || ''}
                          onChange={(e) => updateVariable(variable.id, { value: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter string value..."
                        />
                      ) : (
                        <textarea
                          value={JSON.stringify(variable.value, null, 2)}
                          onChange={(e) => {
                            try {
                              const value = JSON.parse(e.target.value);
                              updateVariable(variable.id, { value });
                            } catch (err) {
                              // Invalid JSON, don't update
                            }
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                          rows={4}
                          placeholder={variable.type === 'array' ? '[]' : '{}'}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
          <p className="text-xs text-gray-500 mt-1">Controls randomness (0.0 = deterministic, 2.0 = very random)</p>
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
          <p className="text-xs text-gray-500 mt-1">Controls diversity via nucleus sampling</p>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Output Mode
        </label>
        <select
          value={agentData.output_mode || 'message'}
          onChange={(e) => setAgentData(prev => ({ ...prev, output_mode: e.target.value as any }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="message">Message</option>
          <option value="api_payload">API Payload</option>
          <option value="internal_variable">Internal Variable</option>
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
        <p className="text-xs text-gray-500 mt-1">Allow the agent to remember previous conversations</p>
      </div>

      {agentData.memory_enabled && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Memory Type
            </label>
            <select
              value={agentData.memory_type || 'vector_store'}
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
              value={agentData.context_size || 4000}
              onChange={(e) => setAgentData(prev => ({ ...prev, context_size: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="4000"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum number of tokens to remember</p>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Retries
        </label>
        <input
          type="number"
          min="0"
          max="10"
          value={agentData.max_retries || 3}
          onChange={(e) => setAgentData(prev => ({ ...prev, max_retries: parseInt(e.target.value) }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <p className="text-xs text-gray-500 mt-1">Number of times to retry on failure</p>
      </div>

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
            <div className="text-xs text-gray-600 space-y-1">
              <div>Tools used: {testResults.output.toolsUsed}</div>
              <div>Knowledge bases used: {testResults.output.knowledgeBasesUsed}</div>
              <div>Prompts executed: {testResults.output.promptsExecuted}</div>
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
    { id: 'variables', label: 'Variables', icon: Variable },
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
          {activeTab === 'prompts' && renderPromptsTab()}
          {activeTab === 'triggers' && renderTriggersTab()}
          {activeTab === 'escalations' && renderEscalationsTab()}
          {activeTab === 'variables' && renderVariablesTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>
    </div>
  );
};

export default AIAgentBuilderNew;