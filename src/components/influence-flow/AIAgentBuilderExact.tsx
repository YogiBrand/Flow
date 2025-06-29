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
  ChevronUp,
  Upload,
  Link,
  Instagram,
  Type
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
  
  const [activeTab, setActiveTab] = useState<'prompt' | 'tools' | 'knowledge' | 'triggers' | 'escalations' | 'metadata' | 'variables'>('tools');
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showToolLibrary, setShowToolLibrary] = useState(false);
  const [showKnowledgeLibrary, setShowKnowledgeLibrary] = useState(false);
  const [showToolConfig, setShowToolConfig] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
        name: 'Marketing Agent',
        description: 'Automate your marketing workflows with intelligent lead processing and engagement.',
        purpose: 'Marketing automation and lead processing',
        status: 'draft',
        system_prompt: 'You are a helpful marketing AI assistant.',
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

  const openToolConfig = (tool: any) => {
    setSelectedTool(tool);
    setShowToolConfig(true);
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
    { id: 'prompt', label: 'Prompt', icon: MessageSquare },
    { id: 'tools', label: 'Tools', icon: Zap },
    { id: 'knowledge', label: 'Knowledge', icon: Brain },
    { id: 'triggers', label: 'Triggers', icon: Play },
    { id: 'escalations', label: 'Escalations', icon: AlertCircle },
    { id: 'metadata', label: 'Metadata', icon: Settings },
    { id: 'variables', label: 'Variables', icon: Code }
  ];

  const renderToolsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{agent.name}</h2>
          <p className="text-gray-600 mt-1">{agent.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTestAgent}
            disabled={isTesting}
            className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                Test Agent
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4" />
                Test Agent
              </>
            )}
          </button>
          <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Build
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Save Agent
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

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agent.tools && agent.tools.map((tool) => (
          <div key={tool.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  tool.enabled ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {tool.icon ? (
                    <tool.icon className={`w-6 h-6 ${tool.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                  ) : (
                    <Zap className={`w-6 h-6 ${tool.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{tool.template?.description || 'Tool description'}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={tool.enabled}
                  onChange={(e) => toggleTool(tool.id, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="mb-4">
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                {tool.template?.category || 'General'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {tool.inputs?.length || 0} inputs
              </span>
              <button
                onClick={() => openToolConfig(tool)}
                className="px-3 py-1 text-indigo-600 border border-indigo-600 rounded text-sm hover:bg-indigo-50 transition-colors"
              >
                Configure
              </button>
            </div>
          </div>
        ))}

        {/* Add New Tool Card */}
        <div 
          onClick={() => setShowToolLibrary(true)}
          className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Add New Tool</h3>
          <p className="text-sm text-gray-600 text-center">Extend your agent's capabilities</p>
        </div>
      </div>

      {/* Variables Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Variables</h3>
            <p className="text-sm text-gray-600">Reuse values throughout your agent with variables like <code className="bg-gray-100 px-1 rounded">{'{{customer_name}}'}</code></p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Variable
          </button>
        </div>
        
        {/* Variables would be listed here */}
        <div className="text-center py-8 text-gray-500">
          <Code className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm">No variables defined yet</p>
        </div>
      </div>
    </div>
  );

  const renderKnowledgeTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Knowledge</h2>
        <p className="text-gray-600 mt-1">Import data to teach your agents about new topics.</p>
      </div>

      {/* Upload Knowledge Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload knowledge</h3>
        
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Drag & drop or <button className="text-indigo-600 hover:text-indigo-700">choose files</button> to upload.
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: .csv, .json, .pdf, .xlsx, .xls, .txt, .md, .docx, .pptx
          </p>
          <p className="text-sm text-gray-500">Max 5 files per upload.</p>
        </div>

        <div className="text-center text-gray-500 mb-6">or</div>

        {/* Knowledge Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowKnowledgeLibrary(true)}
            className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-center"
          >
            <Database className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Add existing knowledge</span>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-center">
            <Globe className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Import URL</span>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-center">
            <Instagram className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Import Social Media Content</span>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-center">
            <Type className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Text</span>
          </button>
        </div>
      </div>

      {/* Knowledge Items */}
      {agent.knowledgeBases && agent.knowledgeBases.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Items</h3>
          <div className="space-y-3">
            {agent.knowledgeBases.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
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
        <div>
          {activeTab === 'tools' && renderToolsTab()}
          {activeTab === 'knowledge' && renderKnowledgeTab()}
          {activeTab === 'prompt' && <div className="text-center py-8 text-gray-500">Prompt configuration coming soon...</div>}
          {activeTab === 'triggers' && <div className="text-center py-8 text-gray-500">Triggers configuration coming soon...</div>}
          {activeTab === 'escalations' && <div className="text-center py-8 text-gray-500">Escalations configuration coming soon...</div>}
          {activeTab === 'metadata' && <div className="text-center py-8 text-gray-500">Metadata configuration coming soon...</div>}
          {activeTab === 'variables' && <div className="text-center py-8 text-gray-500">Variables configuration coming soon...</div>}
        </div>
      </div>

      {/* Tool Library Modal */}
      {showToolLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Tools</h2>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New tool
                  </button>
                  <button
                    onClick={() => setShowToolLibrary(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search 9,000+ tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex h-[calc(90vh-140px)]">
              {/* Sidebar */}
              <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Tools</h3>
                    <div className="space-y-1">
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">All tools</button>
                      <button className="w-full text-left px-3 py-2 text-sm text-indigo-600 bg-indigo-50 rounded">Trending</button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Your tools</button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">By use case</h3>
                    <div className="space-y-1">
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Communications</button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">CRM</button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Calendar</button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Data scraper</button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Handle files</button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Knowledge</button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">By apps</h3>
                    <div className="space-y-1">
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Gmail
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Google Calendar</button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">HubSpot</button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Outlook</button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending</h3>
                  <p className="text-gray-600 mb-6">Popular tool templates from the community</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {toolTemplates
                      .filter(template => 
                        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        template.description.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .slice(0, 8)
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
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{template.name}</span>
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Verified</span>
                            </div>
                            <div className="text-sm text-gray-600 leading-relaxed">{template.description}</div>
                            <div className="text-xs text-gray-500 mt-1">by Relevance AI</div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
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
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowKnowledgeLibrary(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Check className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-indigo-600 font-medium">Select Knowledge Base</span>
                      <span className="text-gray-400">Choose Resources</span>
                      <span className="text-gray-400">Review & Add</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowKnowledgeLibrary(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Knowledge Base</h2>
                <p className="text-gray-600">Choose a knowledge base to import resources from</p>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
              <div className="space-y-3">
                {knowledgeTemplates.slice(0, 3).map((template, index) => (
                  <button
                    key={template.id}
                    onClick={() => addKnowledgeItem(template)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                      index === 0 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        index === 0 
                          ? 'border-indigo-500 bg-indigo-500' 
                          : 'border-gray-300'
                      }`}>
                        {index === 0 && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{Math.floor(Math.random() * 50) + 10} resources</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between mt-8">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-800">Previous</button>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Next</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tool Configuration Modal */}
      {showToolConfig && selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowToolConfig(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">Back to Tools</span>
                </div>
                <button
                  onClick={() => setShowToolConfig(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {selectedTool.icon ? (
                    <selectedTool.icon className="w-8 h-8 text-purple-600" />
                  ) : (
                    <Zap className="w-8 h-8 text-purple-600" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedTool.name}</h2>
                <p className="text-gray-600">{selectedTool.template?.category || 'General'}</p>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How should the agent use this tool?
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Describe how the agent should use this tool..."
                  defaultValue={selectedTool.template?.description || ''}
                />
              </div>
              
              {selectedTool.inputs && selectedTool.inputs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Tool Configuration</h3>
                  {selectedTool.inputs.map((input: any) => (
                    <div key={input.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {input.label}
                        {input.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {input.type === 'select' && input.options ? (
                        <select
                          defaultValue={input.default_value}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {input.options.split(',').map((option: string) => (
                            <option key={option.trim()} value={option.trim()}>{option.trim()}</option>
                          ))}
                        </select>
                      ) : input.type === 'boolean' ? (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked={input.default_value}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2"
                          />
                          <span className="text-sm text-gray-700">Enable this option</span>
                        </label>
                      ) : (
                        <input
                          type={input.type === 'number' ? 'number' : 'text'}
                          defaultValue={input.default_value}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder={input.description}
                        />
                      )}
                      {input.description && (
                        <p className="text-xs text-gray-500 mt-1">{input.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setShowToolConfig(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setShowToolConfig(false)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgentBuilderExact;