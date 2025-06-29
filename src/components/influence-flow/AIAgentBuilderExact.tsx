import React, { useState, useEffect } from 'react';
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
  X,
  Upload,
  Link,
  FileText,
  Database,
  Globe,
  Users,
  Hash,
  Target,
  Mail,
  Share2,
  Contact,
  BarChart3,
  TrendingUp,
  Code,
  FileBarChart,
  Check,
  ChevronRight,
  ChevronDown,
  Edit3,
  Copy,
  Eye,
  EyeOff,
  Wand2
} from 'lucide-react';
import { useAgentData, useToolTemplates, useKnowledgeTemplates } from '../../hooks/useAgentData';
import { AgentService } from '../../services/agentService';
import { addKnowledgeItemToDB, removeKnowledgeItemFromDB, updateKnowledgeItemInDB, addToolToDB, removeToolFromDB, updateToolInDB } from '../../lib/knowledge';
import ToolConfigurationWizard from './ToolConfigurationWizard';
import ToolsLibraryModal from './ToolsLibraryModal';
import PromptEngineeringWizard from './PromptEngineeringWizard';
import PromptEngineeringDashboard from './PromptEngineeringDashboard';

interface AIAgentBuilderExactProps {
  agentId?: string;
  onBack: () => void;
}

// Separate component for text knowledge wizard
const TextKnowledgeWizard: React.FC<{
  onAddKnowledge: (title: string, content: string) => void;
  onCancel: () => void;
}> = ({ onAddKnowledge, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onAddKnowledge(title.trim(), content.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter a title for this knowledge..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[200px]"
          placeholder="Enter your text content here..."
        />
        <div className="mt-2 text-sm text-gray-500">
          {content.length} words
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add Knowledge
        </button>
      </div>
    </div>
  );
};

const AIAgentBuilderExact: React.FC<AIAgentBuilderExactProps> = ({ agentId, onBack }) => {
  const { agent, loading } = useAgentData(agentId || '');
  const { templates: toolTemplates } = useToolTemplates();
  const { templates: knowledgeTemplates } = useKnowledgeTemplates();
  
  const [activeTab, setActiveTab] = useState<'prompt' | 'tools' | 'knowledge' | 'triggers' | 'escalations' | 'metadata' | 'variables'>('prompt');
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPromptWizard, setShowPromptWizard] = useState(false);

  // Knowledge wizard states
  const [showKnowledgeWizard, setShowKnowledgeWizard] = useState(false);
  const [knowledgeWizardStep, setKnowledgeWizardStep] = useState(0);
  const [knowledgeWizardType, setKnowledgeWizardType] = useState<'existing' | 'url' | 'social' | 'text' | null>(null);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [urlImportType, setUrlImportType] = useState<'single' | 'batch'>('single');

  // Tool states
  const [showToolWizard, setShowToolWizard] = useState(false);
  const [showToolsLibrary, setShowToolsLibrary] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

  // Local state for agent data
  const [localAgent, setLocalAgent] = useState<any>(null);

  useEffect(() => {
    if (agent) {
      setLocalAgent(agent);
    }
  }, [agent]);

  const handleTestAgent = async () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestResults({
        status: 'success',
        executionTime: '2.1s',
        output: {
          message: 'Agent executed successfully',
          response: 'Hello! I am your AI assistant. How can I help you today?',
          toolsUsed: localAgent?.tools?.filter((t: any) => t.enabled).length || 0
        }
      });
      setIsTesting(false);
    }, 2000);
  };

  const handleSave = async () => {
    if (!localAgent || !agentId) return;
    
    setSaving(true);
    try {
      await AgentService.updateAgent(agentId, {
        name: localAgent.name,
        description: localAgent.description,
        purpose: localAgent.purpose,
        system_prompt: localAgent.system_prompt,
        temperature: localAgent.temperature,
        top_p: localAgent.top_p,
        model: localAgent.model,
        output_mode: localAgent.output_mode,
        memory_enabled: localAgent.memory_enabled,
        memory_type: localAgent.memory_type,
        context_size: localAgent.context_size,
        max_retries: localAgent.max_retries,
        fallback_response: localAgent.fallback_response
      });
    } catch (error) {
      console.error('Error saving agent:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddKnowledge = async (title: string, content: string) => {
    if (!agentId) return;

    try {
      const newKnowledge = await addKnowledgeItemToDB(agentId, {
        name: title,
        type: 'text',
        content: content,
        metadata: { source: 'manual' },
        enabled: true
      });

      if (newKnowledge.data) {
        setLocalAgent((prev: any) => ({
          ...prev,
          knowledgeBases: [...(prev?.knowledgeBases || []), newKnowledge.data]
        }));
      }

      setShowKnowledgeWizard(false);
      setKnowledgeWizardStep(0);
      setKnowledgeWizardType(null);
    } catch (error) {
      console.error('Error adding knowledge:', error);
    }
  };

  const handleRemoveKnowledge = async (knowledgeId: string) => {
    try {
      await removeKnowledgeItemFromDB(knowledgeId);
      setLocalAgent((prev: any) => ({
        ...prev,
        knowledgeBases: prev?.knowledgeBases?.filter((kb: any) => kb.id !== knowledgeId) || []
      }));
    } catch (error) {
      console.error('Error removing knowledge:', error);
    }
  };

  const handleAddTool = async (template: any) => {
    if (!agentId) return;

    try {
      const newTool = await addToolToDB(agentId, template.id);
      if (newTool.data) {
        setLocalAgent((prev: any) => ({
          ...prev,
          tools: [...(prev?.tools || []), { ...newTool.data, template }]
        }));
      }
      setShowToolsLibrary(false);
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  const handleRemoveTool = async (toolId: string) => {
    try {
      await removeToolFromDB(toolId);
      setLocalAgent((prev: any) => ({
        ...prev,
        tools: prev?.tools?.filter((tool: any) => tool.id !== toolId) || []
      }));
    } catch (error) {
      console.error('Error removing tool:', error);
    }
  };

  const toggleToolExpansion = (toolId: string) => {
    setExpandedTools(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }
      return newSet;
    });
  };

  const handleSavePrompt = (promptData: any) => {
    // Update the agent's system prompt with the generated prompt
    if (promptData && promptData.generatedPrompt) {
      setLocalAgent((prev: any) => ({
        ...prev,
        system_prompt: promptData.generatedPrompt
      }));
    }
    setShowPromptWizard(false);
  };

  const renderKnowledgeWizard = () => {
    const wizardSteps = [
      { id: 'select_base', title: 'Select Knowledge Base', icon: Database },
      { id: 'choose_resources', title: 'Choose Resources', icon: FileText },
      { id: 'review_add', title: 'Review & Add', icon: Check }
    ];

    const platforms = [
      { id: 'instagram', name: 'Instagram', icon: '📷' },
      { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
      { id: 'twitter', name: 'Twitter', icon: '🐦' },
      { id: 'youtube', name: 'YouTube', icon: '📺' },
      { id: 'facebook', name: 'Facebook', icon: '📘' }
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={() => setShowKnowledgeWizard(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (knowledgeWizardStep > 0) {
                    setKnowledgeWizardStep(knowledgeWizardStep - 1);
                  } else {
                    setShowKnowledgeWizard(false);
                  }
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add Knowledge</h2>
                <p className="text-sm text-gray-600">{wizardSteps[knowledgeWizardStep]?.title}</p>
              </div>
            </div>
            <button
              onClick={() => setShowKnowledgeWizard(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {wizardSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 ${index <= knowledgeWizardStep ? 'text-indigo-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                      index < knowledgeWizardStep 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : index === knowledgeWizardStep 
                          ? 'border-indigo-600 text-indigo-600 bg-white' 
                          : 'border-gray-300 text-gray-400 bg-white'
                    }`}>
                      {index < knowledgeWizardStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                  </div>
                  {index < wizardSteps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 transition-colors ${
                      index < knowledgeWizardStep ? 'bg-indigo-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 0: Knowledge Base Selection */}
            {knowledgeWizardStep === 0 && !knowledgeWizardType && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <Database className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Knowledge Base</h3>
                  <p className="text-gray-600">Choose a knowledge base to import resources from</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {knowledgeTemplates.slice(0, 3).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedKnowledgeBase(template);
                        setKnowledgeWizardType('existing');
                        setKnowledgeWizardStep(1);
                      }}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center group"
                    >
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-200 transition-colors">
                        <Database className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      <div className="mt-3 text-xs text-gray-500">
                        {Math.floor(Math.random() * 50) + 10} resources
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <div className="text-sm text-gray-500 mb-4">or</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => {
                        setKnowledgeWizardType('existing');
                        setKnowledgeWizardStep(1);
                      }}
                      className="p-4 border border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
                    >
                      <Database className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-900 block">Add existing knowledge</span>
                    </button>
                    <button
                      onClick={() => {
                        setKnowledgeWizardType('url');
                        setKnowledgeWizardStep(1);
                      }}
                      className="p-4 border border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
                    >
                      <Globe className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-900 block">Import URL</span>
                    </button>
                    <button
                      onClick={() => {
                        setKnowledgeWizardType('social');
                        setKnowledgeWizardStep(1);
                      }}
                      className="p-4 border border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
                    >
                      <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-900 block">Import Social Media Content</span>
                    </button>
                    <button
                      onClick={() => {
                        setKnowledgeWizardType('text');
                        setKnowledgeWizardStep(1);
                      }}
                      className="p-4 border border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
                    >
                      <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-900 block">Text</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Platform Selection for Social Media */}
            {knowledgeWizardStep === 1 && knowledgeWizardType === 'social' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <Users className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Platform</h3>
                  <p className="text-gray-600">Choose the social media platform to import content from</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => {
                        setSelectedPlatform(platform.id);
                        setKnowledgeWizardStep(2);
                      }}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center group"
                    >
                      <div className="text-4xl mb-3">{platform.icon}</div>
                      <h4 className="font-medium text-gray-900">{platform.name}</h4>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: URL Import Type */}
            {knowledgeWizardStep === 1 && knowledgeWizardType === 'url' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <Globe className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Import URLs</h3>
                  <p className="text-gray-600">Choose how you want to import URLs to your knowledge base</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setUrlImportType('single');
                      setKnowledgeWizardStep(2);
                    }}
                    className={`w-full p-6 border-2 rounded-xl text-left transition-all ${
                      urlImportType === 'single' 
                        ? 'border-indigo-300 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Link className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Single URL</h4>
                        <p className="text-sm text-gray-600">Import one URL at a time</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setUrlImportType('batch');
                      setKnowledgeWizardStep(2);
                    }}
                    className={`w-full p-6 border-2 rounded-xl text-left transition-all ${
                      urlImportType === 'batch' 
                        ? 'border-indigo-300 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Database className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Batch Import</h4>
                        <p className="text-sm text-gray-600">Import multiple URLs at once</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Text Knowledge */}
            {knowledgeWizardStep === 1 && knowledgeWizardType === 'text' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <FileText className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Text Knowledge</h3>
                  <p className="text-gray-600">Add custom text content to your agent's knowledge base</p>
                </div>

                <TextKnowledgeWizard
                  onAddKnowledge={handleAddKnowledge}
                  onCancel={() => setShowKnowledgeWizard(false)}
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const tabs = [
    { id: 'prompt', label: 'Prompt', icon: MessageSquare },
    { id: 'tools', label: 'Tools', icon: Zap },
    { id: 'knowledge', label: 'Knowledge', icon: Brain },
    { id: 'triggers', label: 'Triggers', icon: Play },
    { id: 'escalations', label: 'Escalations', icon: Settings },
    { id: 'metadata', label: 'Metadata', icon: Database },
    { id: 'variables', label: 'Variables', icon: Code }
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

  if (!localAgent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Agent not found</h3>
          <p className="text-gray-600 mb-6">The agent you're looking for doesn't exist or has been deleted.</p>
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
                {localAgent.name}
              </h1>
              <p className="text-sm text-gray-600">AI Agent Configuration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestAgent}
              disabled={isTesting}
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
                  Save Agent
                </>
              )}
            </button>
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
        <div className="bg-white rounded-xl border border-gray-200">
          {/* Prompt Tab */}
          {activeTab === 'prompt' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Prompt Configuration</h3>
                  <p className="text-gray-600">Configure your agent's system prompt and behavior.</p>
                </div>
                <button
                  onClick={() => setShowPromptWizard(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Prompt Engineering
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    System Prompt
                  </label>
                  <textarea
                    value={localAgent.system_prompt || ''}
                    onChange={(e) => setLocalAgent(prev => ({
                      ...prev,
                      system_prompt: e.target.value
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[300px] font-mono text-sm"
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
                      value={localAgent.temperature}
                      onChange={(e) => setLocalAgent(prev => ({
                        ...prev,
                        temperature: parseFloat(e.target.value)
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
                      value={localAgent.top_p}
                      onChange={(e) => setLocalAgent(prev => ({
                        ...prev,
                        top_p: parseFloat(e.target.value)
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
                    value={localAgent.model}
                    onChange={(e) => setLocalAgent(prev => ({
                      ...prev,
                      model: e.target.value
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
                    value={localAgent.output_mode}
                    onChange={(e) => setLocalAgent(prev => ({
                      ...prev,
                      output_mode: e.target.value
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="message">Message</option>
                    <option value="api_payload">API Payload</option>
                    <option value="internal_variable">Internal Variable</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tools</h3>
                  <p className="text-gray-600">Used by agents to complete tasks</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTestAgent}
                    disabled={isTesting}
                    className="px-4 py-2 text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    Run tool
                  </button>
                  <button
                    onClick={() => setShowToolsLibrary(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New tool
                  </button>
                </div>
              </div>

              {/* Tools Grid */}
              {localAgent.tools && localAgent.tools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {localAgent.tools.map((tool: any) => (
                    <div key={tool.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      {/* Tool Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                            <p className="text-sm text-gray-600 capitalize">{tool.type?.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${tool.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                        </div>
                      </div>

                      {/* Tool Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {tool.description || 'No description available'}
                      </p>

                      {/* Tool Category */}
                      <div className="mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {tool.category || 'General'}
                        </span>
                      </div>

                      {/* Tool Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>{tool.inputs?.length || 0} inputs</span>
                        <span>{tool.outputs?.length || 0} outputs</span>
                      </div>

                      {/* Tool Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTool(tool);
                            setShowToolWizard(true);
                          }}
                          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Configure
                        </button>
                        <button className="px-3 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveTool(tool.id)}
                          className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Tool Card */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer"
                       onClick={() => setShowToolsLibrary(true)}>
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                      <Plus className="w-6 h-6 text-gray-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Add New Tool</h4>
                    <p className="text-sm text-gray-600">Extend your agent's capabilities</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No tools added yet</h4>
                  <p className="text-gray-600 mb-6">Add tools to give your agent capabilities</p>
                  <button
                    onClick={() => setShowToolsLibrary(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Add Your First Tool
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Knowledge Tab */}
          {activeTab === 'knowledge' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Knowledge</h3>
                  <p className="text-gray-600">Import data to teach your agents about new topics.</p>
                </div>
              </div>

              {/* Upload Knowledge Section */}
              <div className="mb-8">
                <h4 className="text-base font-medium text-gray-900 mb-4">Upload knowledge</h4>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag & drop or <button className="text-indigo-600 hover:text-indigo-700 font-medium">choose files</button> to upload.</p>
                  <p className="text-sm text-gray-500">Supported formats: .csv, .json, .pdf, .xlsx, .xls, .txt, .md, .docx, .pptx</p>
                  <p className="text-sm text-gray-500">Max 5 files per upload.</p>
                </div>

                <div className="text-center text-gray-500 mb-6">or</div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      setKnowledgeWizardType('existing');
                      setShowKnowledgeWizard(true);
                    }}
                    className="p-4 border border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
                  >
                    <Database className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900 block">Add existing knowledge</span>
                  </button>
                  <button
                    onClick={() => {
                      setKnowledgeWizardType('url');
                      setShowKnowledgeWizard(true);
                    }}
                    className="p-4 border border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
                  >
                    <Globe className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900 block">Import URL</span>
                  </button>
                  <button
                    onClick={() => {
                      setKnowledgeWizardType('social');
                      setShowKnowledgeWizard(true);
                    }}
                    className="p-4 border border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
                  >
                    <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900 block">Import Social Media Content</span>
                  </button>
                  <button
                    onClick={() => {
                      setKnowledgeWizardType('text');
                      setShowKnowledgeWizard(true);
                    }}
                    className="p-4 border border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
                  >
                    <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900 block">Text</span>
                  </button>
                </div>
              </div>

              {/* Knowledge Items */}
              {localAgent.knowledgeBases && localAgent.knowledgeBases.length > 0 ? (
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Knowledge Items</h4>
                  <div className="space-y-3">
                    {localAgent.knowledgeBases.map((kb: any) => (
                      <div key={kb.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{kb.name}</h5>
                            <p className="text-sm text-gray-600">{kb.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveKnowledge(kb.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No knowledge added yet</h4>
                  <p className="text-gray-600">Add knowledge to help your agent understand your domain</p>
                </div>
              )}
            </div>
          )}

          {/* Other tabs content would go here */}
          {activeTab === 'triggers' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Triggers</h3>
              <p className="text-gray-600">Run tasks on auto-pilot</p>
            </div>
          )}

          {activeTab === 'escalations' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Escalations</h3>
              <p className="text-gray-600">Configure escalation rules for your agent.</p>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
              <p className="text-gray-600">Additional metadata for your agent.</p>
            </div>
          )}

          {activeTab === 'variables' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Variables</h3>
                  <p className="text-gray-600">Reuse values throughout your agent with variables like <code className="bg-gray-100 px-1 rounded">{'{{customer_name}}'}</code></p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Variable
                </button>
              </div>
              
              <div className="text-center py-8">
                <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No variables yet</h4>
                <p className="text-gray-600">Create variables to reuse values across your agent</p>
              </div>
            </div>
          )}
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
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

      {/* Modals */}
      <AnimatePresence>
        {showKnowledgeWizard && renderKnowledgeWizard()}
        {showToolsLibrary && (
          <ToolsLibraryModal
            isOpen={showToolsLibrary}
            onClose={() => setShowToolsLibrary(false)}
            onSelectTool={handleAddTool}
            onCreateCustomTool={() => {
              setShowToolsLibrary(false);
              setShowToolWizard(true);
            }}
          />
        )}
        {showToolWizard && (
          <ToolConfigurationWizard
            isOpen={showToolWizard}
            onClose={() => {
              setShowToolWizard(false);
              setSelectedTool(null);
            }}
            agentId={agentId || ''}
            existingTool={selectedTool}
            onToolSaved={() => {
              setShowToolWizard(false);
              setSelectedTool(null);
              // Refresh agent data
              window.location.reload();
            }}
          />
        )}
        {showPromptWizard && (
          <PromptEngineeringWizard
            onClose={() => setShowPromptWizard(false)}
            onSave={handleSavePrompt}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAgentBuilderExact;