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
  Contact,
  Hash,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Edit3,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAgentData, useToolTemplates, useKnowledgeTemplates } from '../../hooks/useAgentData';
import { 
  addKnowledgeItemToDB, 
  removeKnowledgeItemFromDB, 
  addToolToDB, 
  removeToolFromDB, 
  updateToolInDB,
  updateKnowledgeItemInDB
} from '../../lib/knowledge';

interface AIAgentBuilderPerfectProps {
  agentId?: string;
  onBack: () => void;
}

const AIAgentBuilderPerfect: React.FC<AIAgentBuilderPerfectProps> = ({ agentId, onBack }) => {
  const { user } = useAuth();
  const { agent, loading } = useAgentData(agentId || '');
  const { templates: toolTemplates, loading: toolTemplatesLoading } = useToolTemplates();
  const { templates: knowledgeTemplates, loading: knowledgeTemplatesLoading } = useKnowledgeTemplates();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'knowledge' | 'chat' | 'execution'>('overview');
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddTool, setShowAddTool] = useState(false);
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);
  const [editingTool, setEditingTool] = useState<any>(null);
  const [editingKnowledge, setEditingKnowledge] = useState<any>(null);

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
          toolsUsed: agent?.tools?.filter((t: any) => t.enabled).length || 0
        }
      });
      setIsTesting(false);
    }, 2000);
  };

  const handleAddTool = async (templateId: string) => {
    if (!agentId) return;
    
    try {
      const { data, error } = await addToolToDB(agentId, templateId);
      if (error) throw error;
      setShowAddTool(false);
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  const handleRemoveTool = async (toolId: string) => {
    try {
      const { error } = await removeToolFromDB(toolId);
      if (error) throw error;
    } catch (error) {
      console.error('Error removing tool:', error);
    }
  };

  const handleToggleTool = async (toolId: string, enabled: boolean) => {
    try {
      const { error } = await updateToolInDB(toolId, { enabled });
      if (error) throw error;
    } catch (error) {
      console.error('Error toggling tool:', error);
    }
  };

  const handleAddKnowledge = async (templateId: string) => {
    if (!agentId) return;
    
    try {
      const template = knowledgeTemplates.find(t => t.id === templateId);
      if (!template) return;

      const { data, error } = await addKnowledgeItemToDB(agentId, {
        name: template.name,
        type: template.content_type,
        content: template.content,
        metadata: template.metadata,
        enabled: true
      });
      if (error) throw error;
      setShowAddKnowledge(false);
    } catch (error) {
      console.error('Error adding knowledge:', error);
    }
  };

  const handleRemoveKnowledge = async (knowledgeId: string) => {
    try {
      const { error } = await removeKnowledgeItemFromDB(knowledgeId);
      if (error) throw error;
    } catch (error) {
      console.error('Error removing knowledge:', error);
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name
            </label>
            <input
              type="text"
              value={agent?.name || ''}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                agent?.status === 'active' ? 'bg-green-500' :
                agent?.status === 'draft' ? 'bg-yellow-500' :
                'bg-gray-400'
              }`} />
              <span className="text-sm capitalize">{agent?.status || 'Unknown'}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
              {agent?.model || 'Not specified'}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tools Count
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
              {agent?.tools?.length || 0} tools configured
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Knowledge Bases
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
              {agent?.knowledgeBases?.length || 0} knowledge bases
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Memory Enabled
            </label>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                agent?.memory_enabled ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <span className="text-sm">{agent?.memory_enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[80px]">
          {agent?.description || 'No description provided'}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Purpose
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[60px]">
          {agent?.purpose || 'No purpose specified'}
        </div>
      </div>
    </div>
  );

  const renderToolsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Agent Tools</h4>
        <button
          onClick={() => setShowAddTool(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Tool
        </button>
      </div>

      {!agent?.tools || agent.tools.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tools configured</h3>
          <p className="text-gray-600 mb-6">Add tools to give your agent capabilities</p>
          <button
            onClick={() => setShowAddTool(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Add Your First Tool
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agent.tools.map((tool: any) => {
            const IconComponent = tool.icon || Zap;
            
            return (
              <div
                key={tool.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-purple-600" />
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
                        onChange={(e) => handleToggleTool(tool.id, e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </label>
                    <button
                      onClick={() => setEditingTool(tool)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveTool(tool.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {tool.template && (
                  <div className="text-xs text-gray-600 mb-3">
                    {tool.template.description}
                  </div>
                )}

                {tool.template?.category && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {tool.template.category}
                    </span>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      tool.enabled 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tool.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                )}

                {tool.inputs && tool.inputs.length > 0 && (
                  <div className="border-t border-gray-100 pt-3">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      Tool Inputs ({tool.inputs.length})
                    </div>
                    <div className="space-y-1">
                      {tool.inputs.slice(0, 3).map((input: any) => (
                        <div key={input.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{input.label}</span>
                          <span className={`px-1 py-0.5 rounded ${
                            input.required 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {input.required ? 'Required' : 'Optional'}
                          </span>
                        </div>
                      ))}
                      {tool.inputs.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{tool.inputs.length - 3} more inputs
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Tool Modal */}
      {showAddTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add Tool</h3>
                <button
                  onClick={() => setShowAddTool(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {toolTemplatesLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading tools...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {toolTemplates.map((template: any) => {
                    const IconComponent = template.icon || Zap;
                    const isAlreadyAdded = agent?.tools?.some((t: any) => t.name === template.name);
                    
                    return (
                      <button
                        key={template.id}
                        onClick={() => !isAlreadyAdded && handleAddTool(template.id)}
                        disabled={isAlreadyAdded}
                        className={`text-left p-4 border rounded-lg transition-all ${
                          isAlreadyAdded 
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">
                              {template.name}
                              {isAlreadyAdded && (
                                <span className="ml-2 text-xs text-green-600">(Added)</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {template.description}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                {template.category}
                              </span>
                              <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                {template.type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderKnowledgeTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Knowledge Bases</h4>
        <button
          onClick={() => setShowAddKnowledge(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Knowledge
        </button>
      </div>

      {!agent?.knowledgeBases || agent.knowledgeBases.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No knowledge bases</h3>
          <p className="text-gray-600 mb-6">Add knowledge bases to give your agent context</p>
          <button
            onClick={() => setShowAddKnowledge(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Add Knowledge Base
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {agent.knowledgeBases.map((knowledge: any) => (
            <div
              key={knowledge.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{knowledge.name}</h5>
                    <p className="text-sm text-gray-600">Type: {knowledge.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingKnowledge(knowledge)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveKnowledge(knowledge.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {knowledge.content && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">Content Preview</div>
                  <div className="text-sm text-gray-600 line-clamp-3">
                    {knowledge.content.substring(0, 200)}...
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{knowledge.content?.length || 0} characters</span>
                <span className={`px-2 py-1 rounded ${
                  knowledge.enabled 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {knowledge.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Knowledge Modal */}
      {showAddKnowledge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add Knowledge Base</h3>
                <button
                  onClick={() => setShowAddKnowledge(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {knowledgeTemplatesLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading knowledge bases...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {knowledgeTemplates.map((template: any) => {
                    const isAlreadyAdded = agent?.knowledgeBases?.some((k: any) => k.name === template.name);
                    
                    return (
                      <button
                        key={template.id}
                        onClick={() => !isAlreadyAdded && handleAddKnowledge(template.id)}
                        disabled={isAlreadyAdded}
                        className={`text-left p-4 border rounded-lg transition-all w-full ${
                          isAlreadyAdded 
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">
                              {template.name}
                              {isAlreadyAdded && (
                                <span className="ml-2 text-xs text-green-600">(Added)</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {template.description}
                            </div>
                            <div className="text-xs text-gray-500 mb-2 line-clamp-2">
                              {template.content?.substring(0, 150)}...
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                {template.category}
                              </span>
                              <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                {template.content_type}
                              </span>
                              <span className="text-xs text-gray-500">
                                {template.content?.length || 0} chars
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
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
        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[120px] whitespace-pre-wrap">
          {agent?.system_prompt || 'No system prompt configured'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature
          </label>
          <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
            {agent?.temperature || 0.7}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Top P
          </label>
          <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
            {agent?.top_p || 0.9}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
            {agent?.model || 'Not specified'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Mode
          </label>
          <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
            {agent?.output_mode || 'message'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExecutionTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Memory Configuration
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Status</label>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                agent?.memory_enabled ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <span className="text-sm">{agent?.memory_enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Type</label>
            <div className="text-sm">{agent?.memory_type || 'Not specified'}</div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Context Size
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
          {agent?.context_size || 4000} tokens
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Retries
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
          {agent?.max_retries || 3} attempts
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fallback Response
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[80px]">
          {agent?.fallback_response || 'No fallback response configured'}
        </div>
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
          <p className="text-gray-600">Loading agent...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Agent Not Found</h2>
          <p className="text-gray-600 mb-6">The requested agent could not be found.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Agents
          </button>
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
                {agent.name}
              </h1>
              <p className="text-sm text-gray-600">AI Agent Configuration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                agent.status === 'active' ? 'bg-green-500' :
                agent.status === 'draft' ? 'bg-yellow-500' :
                'bg-gray-400'
              }`} />
              <span className="text-sm capitalize">{agent.status}</span>
            </div>
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

export default AIAgentBuilderPerfect;