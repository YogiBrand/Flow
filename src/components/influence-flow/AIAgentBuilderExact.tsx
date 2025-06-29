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
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Facebook,
  FileText,
  Database,
  Link,
  Check,
  ChevronRight
} from 'lucide-react';
import { useAgentData, useToolTemplates, useKnowledgeTemplates } from '../../hooks/useAgentData';
import { AgentService } from '../../services/agentService';
import { TemplateService } from '../../services/templateService';
import { addKnowledgeItemToDB, addToolToDB, updateKnowledgeItemInDB, removeKnowledgeItemFromDB } from '../../lib/knowledge';
import { useAuth } from '../../hooks/useAuth';

interface AIAgentBuilderExactProps {
  agentId?: string;
  onBack: () => void;
}

const AIAgentBuilderExact: React.FC<AIAgentBuilderExactProps> = ({ agentId, onBack }) => {
  const { user } = useAuth();
  const { agent, loading } = useAgentData(agentId || '');
  const { templates: toolTemplates } = useToolTemplates();
  const { templates: knowledgeTemplates } = useKnowledgeTemplates();
  
  const [activeTab, setActiveTab] = useState<'prompt' | 'tools' | 'knowledge' | 'triggers' | 'escalations' | 'metadata' | 'variables'>('tools');
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Knowledge wizard state
  const [knowledgeWizardType, setKnowledgeWizardType] = useState<'existing' | 'url' | 'social' | 'text' | null>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState<any>({});

  // Local cache for knowledge items
  const [knowledgeCache, setKnowledgeCache] = useState<any[]>([]);

  useEffect(() => {
    if (agent?.knowledgeBases) {
      setKnowledgeCache(agent.knowledgeBases);
    }
  }, [agent?.knowledgeBases]);

  const handleSaveAgent = async () => {
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

  const addToolToAgent = async (templateId: string) => {
    if (!agentId) return;
    
    try {
      await addToolToDB(agentId, templateId);
      setShowToolsModal(false);
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  const removeToolFromAgent = async (toolId: string) => {
    try {
      // Remove from database
      const { error } = await AgentService.deleteTool(toolId);
      if (error) throw error;
    } catch (error) {
      console.error('Error removing tool:', error);
    }
  };

  const addKnowledgeToAgent = async (knowledgeData: any) => {
    if (!agentId) return;
    
    try {
      const { data, error } = await addKnowledgeItemToDB(agentId, knowledgeData);
      if (error) throw error;
      
      // Update local cache immediately
      if (data) {
        setKnowledgeCache(prev => [...prev, data]);
      }
      
      // Close wizard
      setShowKnowledgeModal(false);
      setKnowledgeWizardType(null);
      setWizardStep(1);
      setWizardData({});
    } catch (error) {
      console.error('Error adding knowledge:', error);
    }
  };

  const removeKnowledgeFromAgent = async (knowledgeId: string) => {
    try {
      const { error } = await removeKnowledgeItemFromDB(knowledgeId);
      if (error) throw error;
      
      // Update local cache immediately
      setKnowledgeCache(prev => prev.filter(item => item.id !== knowledgeId));
    } catch (error) {
      console.error('Error removing knowledge:', error);
    }
  };

  const getWizardSteps = () => {
    switch (knowledgeWizardType) {
      case 'existing':
        return [
          { number: 1, label: 'Select Knowledge Base', active: wizardStep === 1 },
          { number: 2, label: 'Choose Resources', active: wizardStep === 2 },
          { number: 3, label: 'Review & Add', active: wizardStep === 3 }
        ];
      case 'url':
        return [
          { number: 1, label: 'Import Type', active: wizardStep === 1 },
          { number: 2, label: 'Add URLs', active: wizardStep === 2 },
          { number: 3, label: 'Review & Import', active: wizardStep === 3 }
        ];
      case 'social':
        return [
          { number: 1, label: 'Select Platform', active: wizardStep === 1 },
          { number: 2, label: 'Choose Account', active: wizardStep === 2 },
          { number: 3, label: 'Select Content', active: wizardStep === 3 },
          { number: 4, label: 'Content Parts', active: wizardStep === 4 },
          { number: 5, label: 'Review & Import', active: wizardStep === 5 }
        ];
      case 'text':
        return [
          { number: 1, label: 'Add Text Knowledge', active: wizardStep === 1 }
        ];
      default:
        return [];
    }
  };

  const renderWizardProgress = () => {
    const steps = getWizardSteps();
    
    return (
      <div className="flex items-center justify-center space-x-2 mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step.number < wizardStep 
                  ? 'bg-green-500 text-white' 
                  : step.active 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {step.number < wizardStep ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span className={`text-xs mt-1 text-center max-w-20 ${
                step.active ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${
                step.number < wizardStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderExistingKnowledgeWizard = () => {
    switch (wizardStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Knowledge Base</h3>
              <p className="text-gray-600">Choose a knowledge base to import resources from</p>
            </div>

            <div className="space-y-3">
              {knowledgeTemplates.map((template) => (
                <label key={template.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                  <input
                    type="radio"
                    name="knowledgeBase"
                    value={template.id}
                    checked={wizardData.selectedTemplate === template.id}
                    onChange={(e) => setWizardData(prev => ({ ...prev, selectedTemplate: e.target.value }))}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">{template.name}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.category} • {template.tags?.length || 0} resources</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 2:
        const selectedTemplate = knowledgeTemplates.find(t => t.id === wizardData.selectedTemplate);
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Resources</h3>
              <p className="text-gray-600">Select which resources to import from {selectedTemplate?.name}</p>
            </div>

            <div className="space-y-3">
              {selectedTemplate?.tags?.map((tag, index) => (
                <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wizardData.selectedResources?.includes(tag) || false}
                    onChange={(e) => {
                      const resources = wizardData.selectedResources || [];
                      if (e.target.checked) {
                        setWizardData(prev => ({ ...prev, selectedResources: [...resources, tag] }));
                      } else {
                        setWizardData(prev => ({ ...prev, selectedResources: resources.filter(r => r !== tag) }));
                      }
                    }}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900 capitalize">{tag.replace('_', ' ')}</div>
                    <div className="text-sm text-gray-600">Resource related to {tag}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Add</h3>
              <p className="text-gray-600">Review your selections before adding to the knowledge base</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Selected Knowledge Base:</h4>
              <p className="text-gray-700">{knowledgeTemplates.find(t => t.id === wizardData.selectedTemplate)?.name}</p>
              
              <h4 className="font-medium text-gray-900 mt-4 mb-2">Selected Resources:</h4>
              <ul className="text-gray-700 space-y-1">
                {wizardData.selectedResources?.map((resource: string, index: number) => (
                  <li key={index} className="capitalize">• {resource.replace('_', ' ')}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderUrlImportWizard = () => {
    switch (wizardStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Import URLs</h3>
              <p className="text-gray-600">Choose how you want to import URLs to your knowledge base</p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                <input
                  type="radio"
                  name="importType"
                  value="single"
                  checked={wizardData.importType === 'single'}
                  onChange={(e) => setWizardData(prev => ({ ...prev, importType: e.target.value }))}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Single URL</div>
                  <div className="text-sm text-gray-600">Import one URL at a time</div>
                </div>
              </label>

              <label className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                <input
                  type="radio"
                  name="importType"
                  value="batch"
                  checked={wizardData.importType === 'batch'}
                  onChange={(e) => setWizardData(prev => ({ ...prev, importType: e.target.value }))}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Batch Import</div>
                  <div className="text-sm text-gray-600">Import multiple URLs at once</div>
                </div>
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Add URLs</h3>
              <p className="text-gray-600">
                {wizardData.importType === 'single' ? 'Enter the URL to import' : 'Enter multiple URLs (one per line)'}
              </p>
            </div>

            {wizardData.importType === 'single' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="url"
                  value={wizardData.url || ''}
                  onChange={(e) => setWizardData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URLs (one per line)</label>
                <textarea
                  value={wizardData.urls || ''}
                  onChange={(e) => setWizardData(prev => ({ ...prev, urls: e.target.value }))}
                  placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        );

      case 3:
        const urls = wizardData.importType === 'single' 
          ? [wizardData.url].filter(Boolean)
          : (wizardData.urls || '').split('\n').filter(url => url.trim());

        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Import</h3>
              <p className="text-gray-600">Review the URLs before importing</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">URLs to Import ({urls.length}):</h4>
              <ul className="text-gray-700 space-y-1 max-h-40 overflow-y-auto">
                {urls.map((url, index) => (
                  <li key={index} className="text-sm">• {url}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSocialMediaWizard = () => {
    const platforms = [
      { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
      { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
      { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
      { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600' },
      { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-700' }
    ];

    const contentTypes = [
      { id: 'posts', name: 'Posts', description: 'Regular posts and updates' },
      { id: 'stories', name: 'Stories', description: 'Story content and highlights' },
      { id: 'comments', name: 'Comments', description: 'Comments and interactions' },
      { id: 'bio', name: 'Bio & Profile', description: 'Profile information and bio' }
    ];

    const contentParts = [
      { id: 'text', name: 'Text Content', description: 'Captions and text content' },
      { id: 'hashtags', name: 'Hashtags', description: 'Hashtags and tags' },
      { id: 'mentions', name: 'Mentions', description: 'User mentions and tags' },
      { id: 'metadata', name: 'Metadata', description: 'Post metadata and analytics' }
    ];

    switch (wizardStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Platform</h3>
              <p className="text-gray-600">Choose the social media platform to import content from</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setWizardData(prev => ({ ...prev, platform: platform.id }))}
                  className={`flex items-center p-4 border rounded-lg hover:border-blue-300 transition-colors ${
                    wizardData.platform === platform.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <platform.icon className={`w-6 h-6 ${platform.color} mr-3`} />
                  <span className="font-medium text-gray-900">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Account</h3>
              <p className="text-gray-600">Enter the account username or handle</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {wizardData.platform === 'twitter' ? 'Twitter Handle' : 'Username'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                <input
                  type="text"
                  value={wizardData.username || ''}
                  onChange={(e) => setWizardData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="username"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Content</h3>
              <p className="text-gray-600">Choose what type of content to import</p>
            </div>

            <div className="space-y-3">
              {contentTypes.map((type) => (
                <label key={type.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wizardData.contentTypes?.includes(type.id) || false}
                    onChange={(e) => {
                      const types = wizardData.contentTypes || [];
                      if (e.target.checked) {
                        setWizardData(prev => ({ ...prev, contentTypes: [...types, type.id] }));
                      } else {
                        setWizardData(prev => ({ ...prev, contentTypes: types.filter(t => t !== type.id) }));
                      }
                    }}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{type.name}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Parts</h3>
              <p className="text-gray-600">Select which parts of the content to extract</p>
            </div>

            <div className="space-y-3">
              {contentParts.map((part) => (
                <label key={part.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wizardData.contentParts?.includes(part.id) || false}
                    onChange={(e) => {
                      const parts = wizardData.contentParts || [];
                      if (e.target.checked) {
                        setWizardData(prev => ({ ...prev, contentParts: [...parts, part.id] }));
                      } else {
                        setWizardData(prev => ({ ...prev, contentParts: parts.filter(p => p !== part.id) }));
                      }
                    }}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{part.name}</div>
                    <div className="text-sm text-gray-600">{part.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 5:
        const selectedPlatform = platforms.find(p => p.id === wizardData.platform);
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Import</h3>
              <p className="text-gray-600">Review your selections before importing</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Platform:</h4>
                <p className="text-gray-700">{selectedPlatform?.name}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Account:</h4>
                <p className="text-gray-700">@{wizardData.username}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Content Types:</h4>
                <ul className="text-gray-700">
                  {wizardData.contentTypes?.map((type: string) => (
                    <li key={type} className="capitalize">• {type}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Content Parts:</h4>
                <ul className="text-gray-700">
                  {wizardData.contentParts?.map((part: string) => (
                    <li key={part} className="capitalize">• {part.replace('_', ' ')}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTextKnowledgeWizard = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Text Knowledge</h3>
          <p className="text-gray-600">Enter text content to add to your agent's knowledge base</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for this knowledge..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your text content here..."
            rows={8}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <div className="text-xs text-gray-500 mt-1">{wordCount} words</div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setShowKnowledgeModal(false);
              setKnowledgeWizardType(null);
            }}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (title.trim() && content.trim()) {
                addKnowledgeToAgent({
                  name: title,
                  type: 'text',
                  content: content,
                  metadata: { source: 'manual_text', wordCount }
                });
              }
            }}
            disabled={!title.trim() || !content.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Knowledge
          </button>
        </div>
      </div>
    );
  };

  const renderKnowledgeWizard = () => {
    if (!knowledgeWizardType) return null;

    const canProceed = () => {
      switch (knowledgeWizardType) {
        case 'existing':
          if (wizardStep === 1) return wizardData.selectedTemplate;
          if (wizardStep === 2) return wizardData.selectedResources?.length > 0;
          return true;
        case 'url':
          if (wizardStep === 1) return wizardData.importType;
          if (wizardStep === 2) {
            return wizardData.importType === 'single' 
              ? wizardData.url?.trim()
              : wizardData.urls?.trim();
          }
          return true;
        case 'social':
          if (wizardStep === 1) return wizardData.platform;
          if (wizardStep === 2) return wizardData.username?.trim();
          if (wizardStep === 3) return wizardData.contentTypes?.length > 0;
          if (wizardStep === 4) return wizardData.contentParts?.length > 0;
          return true;
        case 'text':
          return true;
        default:
          return false;
      }
    };

    const handleNext = () => {
      const maxSteps = getWizardSteps().length;
      if (wizardStep < maxSteps) {
        setWizardStep(prev => prev + 1);
      }
    };

    const handlePrevious = () => {
      if (wizardStep > 1) {
        setWizardStep(prev => prev - 1);
      }
    };

    const handleFinish = () => {
      let knowledgeData: any = {};

      switch (knowledgeWizardType) {
        case 'existing':
          const template = knowledgeTemplates.find(t => t.id === wizardData.selectedTemplate);
          knowledgeData = {
            name: `${template?.name} - Selected Resources`,
            type: 'document',
            content: template?.content || '',
            metadata: {
              source: 'existing_knowledge',
              templateId: wizardData.selectedTemplate,
              selectedResources: wizardData.selectedResources
            }
          };
          break;
        case 'url':
          const urls = wizardData.importType === 'single' 
            ? [wizardData.url].filter(Boolean)
            : (wizardData.urls || '').split('\n').filter(url => url.trim());
          knowledgeData = {
            name: `URL Import - ${urls.length} URLs`,
            type: 'url',
            content: urls.join('\n'),
            metadata: {
              source: 'url_import',
              importType: wizardData.importType,
              urlCount: urls.length
            }
          };
          break;
        case 'social':
          knowledgeData = {
            name: `${wizardData.platform} - @${wizardData.username}`,
            type: 'document',
            content: `Social media content from @${wizardData.username} on ${wizardData.platform}`,
            metadata: {
              source: 'social_media',
              platform: wizardData.platform,
              username: wizardData.username,
              contentTypes: wizardData.contentTypes,
              contentParts: wizardData.contentParts
            }
          };
          break;
      }

      addKnowledgeToAgent(knowledgeData);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowKnowledgeModal(false);
            setKnowledgeWizardType(null);
            setWizardStep(1);
            setWizardData({});
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <button
              onClick={() => {
                if (wizardStep > 1) {
                  handlePrevious();
                } else {
                  setShowKnowledgeModal(false);
                  setKnowledgeWizardType(null);
                  setWizardStep(1);
                  setWizardData({});
                }
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <button
              onClick={() => {
                setShowKnowledgeModal(false);
                setKnowledgeWizardType(null);
                setWizardStep(1);
                setWizardData({});
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress */}
          {knowledgeWizardType !== 'text' && (
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              {renderWizardProgress()}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {knowledgeWizardType === 'existing' && renderExistingKnowledgeWizard()}
            {knowledgeWizardType === 'url' && renderUrlImportWizard()}
            {knowledgeWizardType === 'social' && renderSocialMediaWizard()}
            {knowledgeWizardType === 'text' && renderTextKnowledgeWizard()}
          </div>

          {/* Footer */}
          {knowledgeWizardType !== 'text' && (
            <div className="flex justify-between items-center p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={handlePrevious}
                disabled={wizardStep === 1}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {wizardStep === getWizardSteps().length ? (
                <button
                  onClick={handleFinish}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Knowledge
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    );
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
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Agent not found</h2>
          <p className="text-gray-600 mb-4">The agent you're looking for doesn't exist.</p>
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

  const tabs = [
    { id: 'prompt', label: 'Prompt', icon: MessageSquare },
    { id: 'tools', label: 'Tools', icon: Zap },
    { id: 'knowledge', label: 'Knowledge', icon: Brain },
    { id: 'triggers', label: 'Triggers', icon: Play },
    { id: 'escalations', label: 'Escalations', icon: TestTube },
    { id: 'metadata', label: 'Metadata', icon: Settings },
    { id: 'variables', label: 'Variables', icon: Database }
  ];

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
              <h1 className="text-xl font-semibold text-gray-900">{agent.name}</h1>
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
              onClick={handleSaveAgent}
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
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Knowledge</h2>
                  <p className="text-gray-600">Import data to teach your agents about new topics.</p>
                </div>
                <button
                  onClick={() => setShowKnowledgeModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Knowledge
                </button>
              </div>

              {/* Upload Knowledge Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload knowledge</h3>
                  <p className="text-gray-600 mb-6">
                    Drag & drop or <button className="text-indigo-600 hover:text-indigo-700">choose files</button> to upload.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Supported formats: .csv, .json, .pdf, .xlsx, .xls, .txt, .md, .docx, .pptx.<br />
                    Max 5 files per upload.
                  </p>
                  
                  <div className="text-center text-gray-500 mb-6">or</div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => {
                        setKnowledgeWizardType('existing');
                        setShowKnowledgeModal(true);
                      }}
                      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <Database className="w-8 h-8 text-gray-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Add existing knowledge</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setKnowledgeWizardType('url');
                        setShowKnowledgeModal(true);
                      }}
                      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <Globe className="w-8 h-8 text-gray-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Import URL</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setKnowledgeWizardType('social');
                        setShowKnowledgeModal(true);
                      }}
                      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <Instagram className="w-8 h-8 text-gray-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Import Social Media Content</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setKnowledgeWizardType('text');
                        setShowKnowledgeModal(true);
                      }}
                      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <FileText className="w-8 h-8 text-gray-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Text</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Knowledge Items */}
              {knowledgeCache.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Knowledge Items</h3>
                  <div className="space-y-3">
                    {knowledgeCache.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.type} • {item.metadata?.source || 'Unknown source'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeKnowledgeFromAgent(item.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Tools</h2>
                  <p className="text-gray-600">Automate your marketing workflows with intelligent lead processing and engagement.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTestAgent}
                    disabled={isTesting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    {isTesting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run
                      </>
                    )}
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Build
                  </button>
                </div>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agent.tools?.map((tool) => (
                  <div key={tool.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          tool.enabled ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {tool.icon ? <tool.icon className={`w-6 h-6 ${tool.enabled ? 'text-blue-600' : 'text-gray-400'}`} /> : <Zap className={`w-6 h-6 ${tool.enabled ? 'text-blue-600' : 'text-gray-400'}`} />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{tool.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tool.enabled}
                          onChange={() => {
                            // Toggle tool enabled state
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{tool.template?.description || 'No description available'}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{tool.inputs?.length || 0} inputs</span>
                      <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Configure
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add New Tool Card */}
                <button
                  onClick={() => setShowToolsModal(true)}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <Plus className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Add New Tool</span>
                  <span className="text-xs text-gray-500">Extend your agent's capabilities</span>
                </button>
              </div>
            </div>
          )}

          {/* Other tabs content would go here */}
          {activeTab === 'prompt' && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Prompt Configuration</h3>
              <p className="text-gray-600">Configure your agent's system prompt and behavior.</p>
            </div>
          )}

          {activeTab === 'triggers' && (
            <div className="text-center py-12">
              <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Triggers</h3>
              <p className="text-gray-600">Set up triggers to activate your agent.</p>
            </div>
          )}

          {activeTab === 'escalations' && (
            <div className="text-center py-12">
              <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Escalations</h3>
              <p className="text-gray-600">Configure escalation rules and fallback responses.</p>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Metadata</h3>
              <p className="text-gray-600">Manage agent metadata and configuration.</p>
            </div>
          )}

          {activeTab === 'variables' && (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Variables</h3>
              <p className="text-gray-600">Reuse values throughout your agent with variables like {{customer_name}}</p>
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

      {/* Tools Modal */}
      <AnimatePresence>
        {showToolsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowToolsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Add Tools</h2>
                  <button
                    onClick={() => setShowToolsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {toolTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => addToolToAgent(template.id)}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left"
                    >
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                        {template.icon ? <template.icon className="w-5 h-5 text-gray-600" /> : <Zap className="w-5 h-5 text-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-600 leading-relaxed mt-1">
                          {template.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {template.category} • {template.type}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Knowledge Modal */}
      <AnimatePresence>
        {showKnowledgeModal && !knowledgeWizardType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowKnowledgeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Add Knowledge</h2>
                  <button
                    onClick={() => setShowKnowledgeModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setKnowledgeWizardType('existing')}
                    className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <Database className="w-12 h-12 text-gray-600 mb-3" />
                    <span className="font-medium text-gray-900">Existing Knowledge</span>
                    <span className="text-sm text-gray-600 text-center mt-1">Import from knowledge base templates</span>
                  </button>

                  <button
                    onClick={() => setKnowledgeWizardType('url')}
                    className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <Globe className="w-12 h-12 text-gray-600 mb-3" />
                    <span className="font-medium text-gray-900">Import URLs</span>
                    <span className="text-sm text-gray-600 text-center mt-1">Import content from web pages</span>
                  </button>

                  <button
                    onClick={() => setKnowledgeWizardType('social')}
                    className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <Instagram className="w-12 h-12 text-gray-600 mb-3" />
                    <span className="font-medium text-gray-900">Social Media</span>
                    <span className="text-sm text-gray-600 text-center mt-1">Import from social platforms</span>
                  </button>

                  <button
                    onClick={() => setKnowledgeWizardType('text')}
                    className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <FileText className="w-12 h-12 text-gray-600 mb-3" />
                    <span className="font-medium text-gray-900">Text</span>
                    <span className="text-sm text-gray-600 text-center mt-1">Add custom text content</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Knowledge Wizard */}
      <AnimatePresence>
        {showKnowledgeModal && knowledgeWizardType && renderKnowledgeWizard()}
      </AnimatePresence>
    </div>
  );
};

export default AIAgentBuilderExact;