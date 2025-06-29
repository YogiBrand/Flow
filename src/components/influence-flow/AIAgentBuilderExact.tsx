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
  ExternalLink,
  Upload,
  Link,
  Type,
  FileUp,
  Folder,
  BookOpen,
  Lightbulb,
  Cpu,
  Workflow,
  Layers,
  MoreHorizontal,
  Filter,
  ArrowRight,
  Info
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

interface AIAgentBuilderExactProps {
  agentId?: string;
  onBack: () => void;
}

const AIAgentBuilderExact: React.FC<AIAgentBuilderExactProps> = ({ agentId, onBack }) => {
  const { user } = useAuth();
  const { agent, loading } = useAgentData(agentId || '');
  const { templates: toolTemplates, loading: toolTemplatesLoading } = useToolTemplates();
  const { templates: knowledgeTemplates, loading: knowledgeTemplatesLoading } = useKnowledgeTemplates();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'knowledge' | 'chat' | 'execution'>('tools');
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddTool, setShowAddTool] = useState(false);
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);
  const [editingTool, setEditingTool] = useState<any>(null);
  const [editingKnowledge, setEditingKnowledge] = useState<any>(null);
  const [selectedToolCategory, setSelectedToolCategory] = useState('all');
  const [selectedKnowledgeCategory, setSelectedKnowledgeCategory] = useState('all');
  const [toolSearchTerm, setToolSearchTerm] = useState('');
  const [knowledgeSearchTerm, setKnowledgeSearchTerm] = useState('');
  const [showCustomKnowledge, setShowCustomKnowledge] = useState(false);
  const [newKnowledgeItem, setNewKnowledgeItem] = useState({
    name: '',
    type: 'text',
    content: '',
    description: ''
  });

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

  const handleAddCustomKnowledge = async () => {
    if (!agentId || !newKnowledgeItem.name || !newKnowledgeItem.content) return;
    
    try {
      const { data, error } = await addKnowledgeItemToDB(agentId, {
        name: newKnowledgeItem.name,
        type: newKnowledgeItem.type,
        content: newKnowledgeItem.content,
        metadata: { description: newKnowledgeItem.description },
        enabled: true
      });
      if (error) throw error;
      setNewKnowledgeItem({ name: '', type: 'text', content: '', description: '' });
      setShowAddKnowledge(false);
      setShowCustomKnowledge(false);
    } catch (error) {
      console.error('Error adding custom knowledge:', error);
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

  const getToolIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      'globe': Globe,
      'users': Users,
      'file-text': FileText,
      'search': Search,
      'hash': Hash,
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

  const getKnowledgeIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'document': return FileText;
      case 'url': return Link;
      case 'structured_data': return Database;
      default: return BookOpen;
    }
  };

  const toolCategories = [...new Set(toolTemplates.map(t => t.category))];
  const knowledgeCategories = [...new Set(knowledgeTemplates.map(t => t.category))];

  const filteredToolTemplates = toolTemplates.filter(t => {
    const matchesCategory = selectedToolCategory === 'all' || t.category === selectedToolCategory;
    const matchesSearch = toolSearchTerm === '' || 
      t.name.toLowerCase().includes(toolSearchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(toolSearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredKnowledgeTemplates = knowledgeTemplates.filter(t => {
    const matchesCategory = selectedKnowledgeCategory === 'all' || t.category === selectedKnowledgeCategory;
    const matchesSearch = knowledgeSearchTerm === '' ||
      t.name.toLowerCase().includes(knowledgeSearchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(knowledgeSearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderToolsTab = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tools</h2>
          <p className="text-gray-600 mt-2">Configure tools to give your agent powerful capabilities</p>
        </div>
        <button
          onClick={() => setShowAddTool(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Tool
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">{agent?.tools?.length || 0}</div>
              <div className="text-purple-700 text-sm font-medium">Total Tools</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {agent?.tools?.filter((t: any) => t.enabled).length || 0}
              </div>
              <div className="text-green-700 text-sm font-medium">Active Tools</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {[...new Set(agent?.tools?.map((t: any) => t.template?.category))].length || 0}
              </div>
              <div className="text-blue-700 text-sm font-medium">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Tools Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Current Tools</h3>
            <div className="text-sm text-gray-500">
              {agent?.tools?.length || 0} tools configured
            </div>
          </div>
          
          {!agent?.tools || agent.tools.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No tools configured yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Add tools to give your agent powerful capabilities like web scraping, data analysis, and API integrations.
              </p>
              <button
                onClick={() => setShowAddTool(true)}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Add Your First Tool
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agent.tools.map((tool: any) => {
                const IconComponent = tool.icon || getToolIcon(tool.template?.icon_name || 'zap');
                
                return (
                  <div
                    key={tool.id}
                    className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
                  >
                    {/* Tool Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{tool.name}</h4>
                          <p className="text-sm text-gray-600">{tool.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingTool(tool)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveTool(tool.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Tool Description */}
                    {tool.template?.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {tool.template.description}
                      </p>
                    )}

                    {/* Tool Status and Category */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {tool.template?.category && (
                          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                            {tool.template.category}
                          </span>
                        )}
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                          tool.enabled 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tool.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-700">Enable Tool</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tool.enabled}
                          onChange={(e) => handleToggleTool(tool.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    {/* Tool Inputs Preview */}
                    {tool.inputs && tool.inputs.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-700">Inputs</span>
                          <span className="text-xs text-gray-500">{tool.inputs.length} configured</span>
                        </div>
                        <div className="space-y-1">
                          {tool.inputs.slice(0, 2).map((input: any) => (
                            <div key={input.id} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 truncate">{input.label}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                input.required 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {input.required ? 'Required' : 'Optional'}
                              </span>
                            </div>
                          ))}
                          {tool.inputs.length > 2 && (
                            <div className="text-xs text-gray-500 text-center pt-1">
                              +{tool.inputs.length - 2} more inputs
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
        </div>
      </div>

      {/* Add Tool Modal */}
      {showAddTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Add Tool</h3>
                  <p className="text-gray-600 mt-2">Choose from our library of powerful tools</p>
                </div>
                <button
                  onClick={() => setShowAddTool(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={toolSearchTerm}
                    onChange={(e) => setToolSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedToolCategory}
                    onChange={(e) => setSelectedToolCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="all">All Categories</option>
                    {toolCategories.map(category => (
                      <option key={category} value={category}>
                        {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tools Grid */}
              <div className="overflow-y-auto max-h-[50vh]">
                {toolTemplatesLoading ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tools...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredToolTemplates.map((template: any) => {
                      const IconComponent = getToolIcon(template.icon_name);
                      const isAlreadyAdded = agent?.tools?.some((t: any) => t.name === template.name);
                      
                      return (
                        <button
                          key={template.id}
                          onClick={() => !isAlreadyAdded && handleAddTool(template.id)}
                          disabled={isAlreadyAdded}
                          className={`group text-left p-6 border-2 rounded-xl transition-all duration-200 ${
                            isAlreadyAdded 
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                              : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-lg'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <IconComponent className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 mb-2 text-lg">
                                {template.name}
                                {isAlreadyAdded && (
                                  <span className="ml-2 text-sm text-green-600 font-normal">(Added)</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {template.description}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                  {template.category}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                  {template.type.replace('_', ' ')}
                                </span>
                                {!isAlreadyAdded && (
                                  <ArrowRight className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                                )}
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
        </div>
      )}
    </div>
  );

  const renderKnowledgeTab = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Knowledge</h2>
          <p className="text-gray-600 mt-2">Add knowledge bases to give your agent context and expertise</p>
        </div>
        <button
          onClick={() => setShowAddKnowledge(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Knowledge
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{agent?.knowledgeBases?.length || 0}</div>
              <div className="text-blue-700 text-sm font-medium">Knowledge Bases</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {agent?.knowledgeBases?.reduce((total: number, kb: any) => total + (kb.content?.length || 0), 0) || 0}
              </div>
              <div className="text-green-700 text-sm font-medium">Total Characters</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {[...new Set(agent?.knowledgeBases?.map((kb: any) => kb.type))].length || 0}
              </div>
              <div className="text-purple-700 text-sm font-medium">Content Types</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Knowledge Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Knowledge Bases</h3>
            <div className="text-sm text-gray-500">
              {agent?.knowledgeBases?.length || 0} knowledge bases
            </div>
          </div>
          
          {!agent?.knowledgeBases || agent.knowledgeBases.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No knowledge bases yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Add knowledge bases to give your agent context, expertise, and the ability to provide informed responses.
              </p>
              <button
                onClick={() => setShowAddKnowledge(true)}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Add Knowledge Base
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {agent.knowledgeBases.map((knowledge: any) => {
                const IconComponent = getKnowledgeIcon(knowledge.type);
                
                return (
                  <div
                    key={knowledge.id}
                    className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1">{knowledge.name}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                              {knowledge.type}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                              knowledge.enabled 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {knowledge.enabled ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingKnowledge(knowledge)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveKnowledge(knowledge.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content Preview */}
                    {knowledge.content && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-700">Content Preview</span>
                          <span className="text-xs text-gray-500">{knowledge.content.length} characters</span>
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-3">
                          {knowledge.content.substring(0, 300)}...
                        </div>
                      </div>
                    )}

                    {/* Knowledge Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Added {new Date(knowledge.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">
                          {knowledge.content?.split(' ').length || 0} words
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Knowledge Modal */}
      {showAddKnowledge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Add Knowledge Base</h3>
                  <p className="text-gray-600 mt-2">Choose from templates or create custom knowledge</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddKnowledge(false);
                    setShowCustomKnowledge(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-8">
                <button 
                  onClick={() => setShowCustomKnowledge(false)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    !showCustomKnowledge 
                      ? 'text-indigo-600 border-indigo-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  Templates
                </button>
                <button 
                  onClick={() => setShowCustomKnowledge(true)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    showCustomKnowledge 
                      ? 'text-indigo-600 border-indigo-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  Custom
                </button>
              </div>

              {!showCustomKnowledge ? (
                <>
                  {/* Search and Filter Controls */}
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search knowledge bases..."
                        value={knowledgeSearchTerm}
                        onChange={(e) => setKnowledgeSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={selectedKnowledgeCategory}
                        onChange={(e) => setSelectedKnowledgeCategory(e.target.value)}
                        className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      >
                        <option value="all">All Categories</option>
                        {knowledgeCategories.map(category => (
                          <option key={category} value={category}>
                            {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Knowledge Templates Grid */}
                  <div className="overflow-y-auto max-h-[50vh]">
                    {knowledgeTemplatesLoading ? (
                      <div className="text-center py-16">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading knowledge bases...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredKnowledgeTemplates.map((template: any) => {
                          const IconComponent = getKnowledgeIcon(template.content_type);
                          const isAlreadyAdded = agent?.knowledgeBases?.some((k: any) => k.name === template.name);
                          
                          return (
                            <button
                              key={template.id}
                              onClick={() => !isAlreadyAdded && handleAddKnowledge(template.id)}
                              disabled={isAlreadyAdded}
                              className={`group text-left p-6 border-2 rounded-xl transition-all duration-200 w-full ${
                                isAlreadyAdded 
                                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-lg'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                  <IconComponent className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-900 mb-2 text-lg">
                                    {template.name}
                                    {isAlreadyAdded && (
                                      <span className="ml-2 text-sm text-green-600 font-normal">(Added)</span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600 mb-3">
                                    {template.description}
                                  </div>
                                  <div className="text-xs text-gray-500 mb-4 line-clamp-2">
                                    {template.content?.substring(0, 200)}...
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                      {template.category}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                      {template.content_type}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {template.content?.length || 0} chars
                                    </span>
                                    {!isAlreadyAdded && (
                                      <ArrowRight className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Custom Knowledge Form */
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Knowledge Base Name
                      </label>
                      <input
                        type="text"
                        value={newKnowledgeItem.name}
                        onChange={(e) => setNewKnowledgeItem(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter a descriptive name..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Type
                      </label>
                      <select
                        value={newKnowledgeItem.type}
                        onChange={(e) => setNewKnowledgeItem(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="text">Text</option>
                        <option value="document">Document</option>
                        <option value="url">URL</option>
                        <option value="structured_data">Structured Data</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={newKnowledgeItem.description}
                        onChange={(e) => setNewKnowledgeItem(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Brief description of this knowledge base..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={newKnowledgeItem.content}
                        onChange={(e) => setNewKnowledgeItem(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={8}
                        placeholder="Enter the knowledge content..."
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {newKnowledgeItem.content.length} characters
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowCustomKnowledge(false);
                          setNewKnowledgeItem({ name: '', type: 'text', content: '', description: '' });
                        }}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddCustomKnowledge}
                        disabled={!newKnowledgeItem.name || !newKnowledgeItem.content}
                        className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Knowledge Base
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading agent...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Agent Not Found</h2>
          <p className="text-gray-600 mb-8">The requested agent could not be found.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
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
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Agents</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {agent.name}
                </h1>
                <p className="text-gray-600 mt-1">AI Agent Configuration</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  agent.status === 'active' ? 'bg-green-500' :
                  agent.status === 'draft' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`} />
                <span className="text-sm font-medium capitalize">{agent.status}</span>
              </div>
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
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto p-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'tools' && renderToolsTab()}
          {activeTab === 'knowledge' && renderKnowledgeTab()}
          {/* Other tabs would be implemented similarly */}
        </div>
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="fixed bottom-6 right-6 bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
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
  );
};

export default AIAgentBuilderExact;