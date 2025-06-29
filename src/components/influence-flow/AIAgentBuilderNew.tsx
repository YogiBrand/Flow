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
  Database,
  Code,
  Globe,
  Search,
  Users,
  FileText,
  Target,
  BarChart3,
  TrendingUp,
  Mail,
  Share2,
  Contact
} from 'lucide-react';
import { AIAgent, AgentTool } from '../../types/influenceFlow';
import { useAuth } from '../../hooks/useAuth';
import { AgentService } from '../../services/agentService';
import { TemplateService, ToolTemplate, KnowledgeBaseTemplate } from '../../services/templateService';

interface AIAgentBuilderNewProps {
  agent?: AIAgent | null;
  onBack: () => void;
}

const AIAgentBuilderNew: React.FC<AIAgentBuilderNewProps> = ({ agent, onBack }) => {
  const { user } = useAuth();
  const [currentAgent, setCurrentAgent] = useState<AIAgent>(
    agent || {
      id: `agent_${Date.now()}`,
      name: 'New AI Agent',
      description: '',
      purpose: '',
      tools: [],
      memory: {
        enabled: false,
        type: 'vector_store',
        contextSize: 4000,
        recallSettings: {}
      },
      chatSettings: {
        systemPrompt: '',
        temperature: 0.7,
        topP: 0.9,
        outputMode: 'message',
        model: 'gpt-4'
      },
      executionLogic: {
        triggers: ['manual'],
        maxRetries: 3
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'knowledge' | 'chat' | 'execution'>('overview');
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [agentTools, setAgentTools] = useState<any[]>([]);
  const [agentKnowledge, setAgentKnowledge] = useState<any[]>([]);
  const [toolTemplates, setToolTemplates] = useState<ToolTemplate[]>([]);
  const [knowledgeTemplates, setKnowledgeTemplates] = useState<KnowledgeBaseTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Load agent data and templates
  useEffect(() => {
    loadTemplates();
    if (agent && agent.id && user) {
      loadAgentData();
    } else {
      setLoading(false);
    }
  }, [agent, user]);

  const loadTemplates = async () => {
    try {
      const [tools, knowledge] = await Promise.all([
        TemplateService.getToolTemplates(),
        TemplateService.getKnowledgeBaseTemplates()
      ]);
      setToolTemplates(tools);
      setKnowledgeTemplates(knowledge);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadAgentData = async () => {
    if (!agent?.id || !user) return;
    
    try {
      const fullData = await AgentService.getFullAgentData(agent.id);
      setAgentTools(fullData.tools || []);
      setAgentKnowledge(fullData.knowledgeBases || []);
      
      // Update current agent with tools
      setCurrentAgent(prev => ({
        ...prev,
        tools: fullData.tools?.map(tool => ({
          id: tool.id,
          name: tool.name,
          type: tool.type,
          config: tool.config,
          enabled: tool.enabled
        })) || []
      }));
    } catch (error) {
      console.error('Error loading agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Icon mapping for different tool types
  const getToolIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      'globe': Globe,
      'users': Users,
      'file-text': FileText,
      'search': Search,
      'hash': Search,
      'target': Target,
      'database': Database,
      'mail': Mail,
      'share-2': Share2,
      'contact': Contact,
      'bar-chart-3': BarChart3,
      'trending-up': TrendingUp,
      'code': Code,
      'file-bar-chart': BarChart3
    };
    return iconMap[iconName] || Zap;
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      if (agent?.id) {
        // Update existing agent
        await AgentService.updateAgent(agent.id, {
          name: currentAgent.name,
          description: currentAgent.description,
          purpose: currentAgent.purpose,
          system_prompt: currentAgent.chatSettings.systemPrompt,
          temperature: currentAgent.chatSettings.temperature,
          top_p: currentAgent.chatSettings.topP,
          model: currentAgent.chatSettings.model,
          output_mode: currentAgent.chatSettings.outputMode,
          memory_enabled: currentAgent.memory.enabled,
          memory_type: currentAgent.memory.type,
          context_size: currentAgent.memory.contextSize,
          max_retries: currentAgent.executionLogic.maxRetries,
          fallback_response: currentAgent.executionLogic.fallbackResponse || ''
        });
      } else {
        // Create new agent
        const newAgent = await AgentService.createAgent({
          user_id: user.id,
          name: currentAgent.name,
          description: currentAgent.description,
          purpose: currentAgent.purpose,
          system_prompt: currentAgent.chatSettings.systemPrompt,
          temperature: currentAgent.chatSettings.temperature,
          top_p: currentAgent.chatSettings.topP,
          model: currentAgent.chatSettings.model,
          output_mode: currentAgent.chatSettings.outputMode,
          memory_enabled: currentAgent.memory.enabled,
          memory_type: currentAgent.memory.type,
          context_size: currentAgent.memory.contextSize,
          max_retries: currentAgent.executionLogic.maxRetries,
          fallback_response: currentAgent.executionLogic.fallbackResponse || ''
        });
        
        // Update current agent with new ID
        setCurrentAgent(prev => ({ ...prev, id: newAgent.id }));
      }
      
      // Show success message or redirect
      console.log('Agent saved successfully');
    } catch (error) {
      console.error('Error saving agent:', error);
    } finally {
      setIsSaving(false);
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
          toolsUsed: currentAgent.tools.filter(t => t.enabled).length
        }
      });
      setIsTesting(false);
    }, 2000);
  };

  const addToolFromTemplate = async (template: ToolTemplate) => {
    if (!currentAgent.id || !user) {
      // For new agents, just add to local state
      const newTool: AgentTool = {
        id: `tool_${Date.now()}`,
        name: template.name,
        type: template.type as any,
        config: template.default_config,
        enabled: true
      };

      setCurrentAgent(prev => ({
        ...prev,
        tools: [...prev.tools, newTool],
        updatedAt: new Date().toISOString()
      }));
      return;
    }

    try {
      const newTool = await TemplateService.createAgentToolFromTemplate(currentAgent.id, template.id);
      setAgentTools(prev => [...prev, newTool]);
      setCurrentAgent(prev => ({
        ...prev,
        tools: [...prev.tools, {
          id: newTool.id,
          name: newTool.name,
          type: newTool.type,
          config: newTool.config,
          enabled: newTool.enabled
        }],
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  const addKnowledgeFromTemplate = async (template: KnowledgeBaseTemplate) => {
    if (!currentAgent.id || !user) {
      console.log('Agent must be saved before adding knowledge bases');
      return;
    }

    try {
      const newKnowledge = await TemplateService.createAgentKnowledgeFromTemplate(currentAgent.id, template.id);
      setAgentKnowledge(prev => [...prev, newKnowledge]);
    } catch (error) {
      console.error('Error adding knowledge base:', error);
    }
  };

  const removeTool = async (toolId: string) => {
    try {
      if (currentAgent.id && user) {
        await AgentService.deleteTool(toolId);
        setAgentTools(prev => prev.filter(t => t.id !== toolId));
      }
      
      setCurrentAgent(prev => ({
        ...prev,
        tools: prev.tools.filter(t => t.id !== toolId),
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error removing tool:', error);
    }
  };

  const removeKnowledge = async (knowledgeId: string) => {
    try {
      if (currentAgent.id && user) {
        await AgentService.deleteKnowledgeBase(knowledgeId);
        setAgentKnowledge(prev => prev.filter(k => k.id !== knowledgeId));
      }
    } catch (error) {
      console.error('Error removing knowledge base:', error);
    }
  };

  const toggleTool = async (toolId: string) => {
    const tool = currentAgent.tools.find(t => t.id === toolId);
    if (!tool) return;

    try {
      if (currentAgent.id && user) {
        await AgentService.updateTool(toolId, { enabled: !tool.enabled });
        setAgentTools(prev => prev.map(t => 
          t.id === toolId ? { ...t, enabled: !tool.enabled } : t
        ));
      }

      setCurrentAgent(prev => ({
        ...prev,
        tools: prev.tools.map(t => 
          t.id === toolId ? { ...t, enabled: !t.enabled } : t
        ),
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error toggling tool:', error);
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agent Name
        </label>
        <input
          type="text"
          value={currentAgent.name}
          onChange={(e) => setCurrentAgent(prev => ({ ...prev, name: e.target.value }))}
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
          onChange={(e) => setCurrentAgent(prev => ({ ...prev, description: e.target.value }))}
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
          value={currentAgent.purpose}
          onChange={(e) => setCurrentAgent(prev => ({ ...prev, purpose: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={2}
          placeholder="What is the main purpose of this agent?"
        />
      </div>
    </div>
  );

  const renderToolsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Agent Tools</h4>
        <div className="relative">
          <select
            onChange={(e) => {
              const template = toolTemplates.find(t => t.id === e.target.value);
              if (template) {
                addToolFromTemplate(template);
                e.target.value = '';
              }
            }}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Add Tool...</option>
            {toolTemplates
              .filter(template => !currentAgent.tools.some(t => t.name === template.name))
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} - {template.category}
                </option>
              ))}
          </select>
        </div>
      </div>

      {currentAgent.tools.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium mb-1">No tools added yet</p>
          <p className="text-sm">Add tools to give your agent capabilities</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentAgent.tools.map((tool) => {
            const template = toolTemplates.find(t => t.name === tool.name);
            const IconComponent = template ? getToolIcon(template.icon_name) : Zap;
            
            return (
              <div
                key={tool.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{tool.name}</h5>
                    <p className="text-sm text-gray-600">
                      {template?.description || tool.type.replace('_', ' ')}
                    </p>
                    {template?.category && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded mt-1">
                        {template.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={tool.enabled}
                      onChange={() => toggleTool(tool.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enabled</span>
                  </label>
                  <button
                    onClick={() => removeTool(tool.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderKnowledgeTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Knowledge Bases</h4>
        <div className="relative">
          <select
            onChange={(e) => {
              const template = knowledgeTemplates.find(t => t.id === e.target.value);
              if (template) {
                addKnowledgeFromTemplate(template);
                e.target.value = '';
              }
            }}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={!currentAgent.id}
          >
            <option value="">Add Knowledge Base...</option>
            {knowledgeTemplates
              .filter(template => !agentKnowledge.some(k => k.name === template.name))
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} - {template.category}
                </option>
              ))}
          </select>
        </div>
      </div>

      {!currentAgent.id && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Save the agent first to add knowledge bases.
          </p>
        </div>
      )}

      {agentKnowledge.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium mb-1">No knowledge bases added yet</p>
          <p className="text-sm">Add knowledge bases to give your agent context</p>
        </div>
      ) : (
        <div className="space-y-3">
          {agentKnowledge.map((knowledge) => (
            <div
              key={knowledge.id}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{knowledge.name}</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    Type: {knowledge.type} • {knowledge.content?.length || 0} characters
                  </p>
                  {knowledge.content && (
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {knowledge.content.substring(0, 150)}...
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeKnowledge(knowledge.id)}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderChatTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt
        </label>
        <textarea
          value={currentAgent.chatSettings.systemPrompt}
          onChange={(e) => setCurrentAgent(prev => ({
            ...prev,
            chatSettings: { ...prev.chatSettings, systemPrompt: e.target.value }
          }))}
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
            value={currentAgent.chatSettings.temperature}
            onChange={(e) => setCurrentAgent(prev => ({
              ...prev,
              chatSettings: { ...prev.chatSettings, temperature: parseFloat(e.target.value) }
            }))}
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
            value={currentAgent.chatSettings.topP}
            onChange={(e) => setCurrentAgent(prev => ({
              ...prev,
              chatSettings: { ...prev.chatSettings, topP: parseFloat(e.target.value) }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model
        </label>
        <select
          value={currentAgent.chatSettings.model}
          onChange={(e) => setCurrentAgent(prev => ({
            ...prev,
            chatSettings: { ...prev.chatSettings, model: e.target.value }
          }))}
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
          value={currentAgent.chatSettings.outputMode}
          onChange={(e) => setCurrentAgent(prev => ({
            ...prev,
            chatSettings: { ...prev.chatSettings, outputMode: e.target.value as any }
          }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="message">Message</option>
          <option value="api_payload">API Payload</option>
          <option value="internal_variable">Internal Variable</option>
        </select>
      </div>
    </div>
  );

  const renderExecutionTab = () => (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={currentAgent.memory.enabled}
            onChange={(e) => setCurrentAgent(prev => ({
              ...prev,
              memory: { ...prev.memory, enabled: e.target.checked }
            }))}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700">Enable Memory</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Allow the agent to remember previous conversations and context
        </p>
      </div>

      {currentAgent.memory.enabled && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Memory Type
            </label>
            <select
              value={currentAgent.memory.type}
              onChange={(e) => setCurrentAgent(prev => ({
                ...prev,
                memory: { ...prev.memory, type: e.target.value as any }
              }))}
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
              value={currentAgent.memory.contextSize}
              onChange={(e) => setCurrentAgent(prev => ({
                ...prev,
                memory: { ...prev.memory, contextSize: parseInt(e.target.value) }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="4000"
            />
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
          value={currentAgent.executionLogic.maxRetries}
          onChange={(e) => setCurrentAgent(prev => ({
            ...prev,
            executionLogic: { ...prev.executionLogic, maxRetries: parseInt(e.target.value) }
          }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fallback Response
        </label>
        <textarea
          value={currentAgent.executionLogic.fallbackResponse || ''}
          onChange={(e) => setCurrentAgent(prev => ({
            ...prev,
            executionLogic: { ...prev.executionLogic, fallbackResponse: e.target.value }
          }))}
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
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'tools', label: 'Tools', icon: Zap },
    { id: 'knowledge', label: 'Knowledge', icon: Brain },
    { id: 'chat', label: 'Chat Settings', icon: MessageSquare },
    { id: 'execution', label: 'Execution', icon: Bot }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent builder...</p>
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
                {currentAgent.name}
              </h1>
              <p className="text-sm text-gray-600">AI Agent Configuration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
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
          {activeTab === 'chat' && renderChatTab()}
          {activeTab === 'execution' && renderExecutionTab()}
        </div>
      </div>
    </div>
  );
};

export default AIAgentBuilderNew;