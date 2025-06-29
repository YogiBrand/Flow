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
  Globe,
  Search,
  Target,
  Database,
  Mail,
  Share2,
  BarChart3,
  TrendingUp,
  Code,
  FileBarChart,
  Clock,
  Webhook,
  GitBranch,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useAgentData, useToolTemplates } from '../../hooks/useAgentData';
import ToolsLibraryModal from './ToolsLibraryModal';
import ToolConfigurationWizard from './ToolConfigurationWizard';
import PromptEngineeringWizard from './PromptEngineeringWizard';

interface AIAgentBuilderExactProps {
  agentId?: string;
  onBack: () => void;
}

const AIAgentBuilderExact: React.FC<AIAgentBuilderExactProps> = ({ agentId, onBack }) => {
  const { agent, loading } = useAgentData(agentId || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'memory' | 'chat' | 'execution' | 'prompt' | 'triggers' | 'escalations'>('overview');
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showToolsLibrary, setShowToolsLibrary] = useState(false);
  const [showToolConfig, setShowToolConfig] = useState(false);
  const [selectedToolTemplate, setSelectedToolTemplate] = useState<any>(null);
  const [showPromptWizard, setShowPromptWizard] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<any>({
    id: '',
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
  });

  useEffect(() => {
    if (agent && !loading) {
      setCurrentAgent({
        ...agent,
        tools: agent.tools || [],
        memory: {
          enabled: agent.memory?.enabled || false,
          type: agent.memory?.type || 'vector_store',
          contextSize: agent.memory?.contextSize || 4000,
          recallSettings: agent.memory?.recallSettings || {}
        },
        chatSettings: {
          systemPrompt: agent.chatSettings?.systemPrompt || '',
          temperature: agent.chatSettings?.temperature || 0.7,
          topP: agent.chatSettings?.topP || 0.9,
          outputMode: agent.chatSettings?.outputMode || 'message',
          model: agent.chatSettings?.model || 'gpt-4'
        },
        executionLogic: {
          triggers: agent.executionLogic?.triggers || ['manual'],
          maxRetries: agent.executionLogic?.maxRetries || 3
        }
      });
    }
  }, [agent, loading]);

  const handleSave = () => {
    // Save agent logic here
    console.log('Saving agent:', currentAgent);
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
          toolsUsed: currentAgent.tools.filter((t: any) => t.enabled).length
        }
      });
      setIsTesting(false);
    }, 2000);
  };

  const handleToolSelect = (toolTemplate: any) => {
    setSelectedToolTemplate(toolTemplate);
    setShowToolConfig(true);
    setShowToolsLibrary(false);
  };

  const handleToolSaved = () => {
    // Refresh agent data
    setShowToolConfig(false);
  };

  const handleCreateCustomTool = () => {
    setSelectedToolTemplate(null);
    setShowToolConfig(true);
    setShowToolsLibrary(false);
  };

  const addTool = (toolTemplate: any) => {
    const newTool = {
      id: `tool_${Date.now()}`,
      name: toolTemplate.name,
      type: toolTemplate.type,
      config: {},
      enabled: true
    };

    setCurrentAgent((prev: any) => ({
      ...prev,
      tools: [...prev.tools, newTool],
      updatedAt: new Date().toISOString()
    }));
  };

  const removeTool = (toolId: string) => {
    setCurrentAgent((prev: any) => ({
      ...prev,
      tools: prev.tools.filter((t: any) => t.id !== toolId),
      updatedAt: new Date().toISOString()
    }));
  };

  const toggleTool = (toolId: string) => {
    setCurrentAgent((prev: any) => ({
      ...prev,
      tools: prev.tools.map((t: any) => 
        t.id === toolId ? { ...t, enabled: !t.enabled } : t
      ),
      updatedAt: new Date().toISOString()
    }));
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
          onChange={(e) => setCurrentAgent((prev: any) => ({ ...prev, name: e.target.value }))}
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
          onChange={(e) => setCurrentAgent((prev: any) => ({ ...prev, description: e.target.value }))}
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
          onChange={(e) => setCurrentAgent((prev: any) => ({ ...prev, purpose: e.target.value }))}
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
        <button
          onClick={() => setShowToolsLibrary(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Tool
        </button>
      </div>

      {currentAgent.tools.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium mb-1">No tools added yet</p>
          <p className="text-sm">Add tools to give your agent capabilities</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentAgent.tools.map((tool: any) => (
            <div
              key={tool.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
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
          ))}
        </div>
      )}
    </div>
  );

  const renderMemoryTab = () => (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={currentAgent.memory.enabled}
            onChange={(e) => setCurrentAgent((prev: any) => ({
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
              onChange={(e) => setCurrentAgent((prev: any) => ({
                ...prev,
                memory: { ...prev.memory, type: e.target.value }
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
              onChange={(e) => setCurrentAgent((prev: any) => ({
                ...prev,
                memory: { ...prev.memory, contextSize: parseInt(e.target.value) }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="4000"
            />
          </div>
        </>
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
          onChange={(e) => setCurrentAgent((prev: any) => ({
            ...prev,
            chatSettings: { ...prev.chatSettings, systemPrompt: e.target.value }
          }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={4}
          placeholder="You are a helpful AI assistant..."
        />
        <div className="mt-2 flex justify-end">
          <button 
            onClick={() => setShowPromptWizard(true)}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Zap className="w-3 h-3" /> Use Prompt Engineering Wizard
          </button>
        </div>
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
            onChange={(e) => setCurrentAgent((prev: any) => ({
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
            onChange={(e) => setCurrentAgent((prev: any) => ({
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
          onChange={(e) => setCurrentAgent((prev: any) => ({
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
          onChange={(e) => setCurrentAgent((prev: any) => ({
            ...prev,
            chatSettings: { ...prev.chatSettings, outputMode: e.target.value }
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

  const renderPromptTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt
        </label>
        <div className="relative">
          <textarea
            value={currentAgent.chatSettings.systemPrompt}
            onChange={(e) => setCurrentAgent((prev: any) => ({
              ...prev,
              chatSettings: { ...prev.chatSettings, systemPrompt: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={12}
            placeholder="You are a helpful AI assistant..."
          />
          <button 
            onClick={() => setShowPromptWizard(true)}
            className="absolute top-2 right-2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          The system prompt defines your agent's personality, capabilities, and constraints.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h5 className="font-medium text-gray-900 mb-2">Prompt Engineering Tips</h5>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>Be specific about the agent's role and expertise</li>
          <li>Define clear boundaries and constraints</li>
          <li>Include examples of desired outputs</li>
          <li>Specify how to handle edge cases</li>
          <li>Use the Prompt Engineering Wizard for advanced prompts</li>
        </ul>
      </div>
    </div>
  );

  const renderTriggersTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Triggers</h3>
        <p className="text-gray-600 mb-6">Triggers allow you to create tasks for your agent from schedules or integrations.</p>
        
        <div className="mb-8">
          <h4 className="text-base font-medium text-gray-800 mb-4">Connect</h4>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="text-blue-500 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">Not sure how to use triggers? <a href="#" className="text-blue-600 underline">Watch this example tutorial</a></p>
            </div>
            <button className="text-gray-400 hover:text-gray-500">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">info@yogibrand.co</p>
                  <p className="text-sm text-gray-500">Google (Gmail, Calendar, Docs, & API)</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-500">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Daily At 12:00 PM</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-500">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14H2V8Z" stroke="#0078D4" strokeWidth="1.5"/>
              <path d="M6 6.5L8.5 9L11 6.5" stroke="#0078D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Outlook
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-indigo-300 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3333 4L8.66667 7.33333L4 4" stroke="#DB4437" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.66667 3.33334H13.3333C14.0667 3.33334 14.6667 3.93334 14.6667 4.66667V11.3333C14.6667 12.0667 14.0667 12.6667 13.3333 12.6667H2.66667C1.93333 12.6667 1.33333 12.0667 1.33333 11.3333V4.66667C1.33333 3.93334 1.93333 3.33334 2.66667 3.33334Z" stroke="#DB4437" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Gmail
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="#4285F4" strokeWidth="1.5"/>
              <path d="M2 6H14" stroke="#4285F4" strokeWidth="1.5"/>
              <path d="M6 6V14" stroke="#4285F4" strokeWidth="1.5"/>
            </svg>
            Google Calendar
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#FF7A59" strokeWidth="1.5"/>
              <path d="M8 5V11" stroke="#FF7A59" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5 8H11" stroke="#FF7A59" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            HubSpot
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 10C14 12.2091 11.3137 14 8 14C4.68629 14 2 12.2091 2 10" stroke="#00A656" strokeWidth="1.5"/>
              <path d="M14 6C14 8.20914 11.3137 10 8 10C4.68629 10 2 8.20914 2 6" stroke="#00A656" strokeWidth="1.5"/>
              <path d="M14 6C14 3.79086 11.3137 2 8 2C4.68629 2 2 3.79086 2 6" stroke="#00A656" strokeWidth="1.5"/>
            </svg>
            Freshdesk
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#00A1E0" strokeWidth="1.5"/>
              <path d="M5.5 8.5L7 10L10.5 6.5" stroke="#00A1E0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Salesforce
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4L8 8L14 4" stroke="#2D8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 4V12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14H4C3.46957 14 2.96086 13.7893 2.58579 13.4142C2.21071 13.0391 2 12.5304 2 12V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H12C12.5304 2 13.0391 2.21071 13.4142 2.58579C13.7893 2.96086 14 3.46957 14 4Z" stroke="#2D8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            ZoomInfo
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#7B68EE" strokeWidth="1.5"/>
              <path d="M8 5V8L10 10" stroke="#7B68EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Relevance Meeting Bot
          </button>
        </div>
        
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium mb-8">
          <Clock className="h-4 w-4 text-gray-500" />
          Recurring Schedule
        </button>
        
        <div className="mb-8">
          <h4 className="text-base font-medium text-gray-800 mb-2">Premium triggers</h4>
          <p className="text-sm text-gray-600 mb-4">
            These triggers are accessible for Teams and Business plan users. They incur an
            <span className="font-medium"> additional 5000 credits per month </span>
            for each connected account in your organization.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#25D366" strokeWidth="1.5"/>
                <path d="M10.5 7.5C10.5 9.15685 9.15685 10.5 7.5 10.5C5.84315 10.5 4.5 9.15685 4.5 7.5C4.5 5.84315 5.84315 4.5 7.5 4.5C9.15685 4.5 10.5 5.84315 10.5 7.5Z" stroke="#25D366" strokeWidth="1.5"/>
                <path d="M11.5 11.5L9.5 9.5" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              WhatsApp
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="#0A66C2" strokeWidth="1.5"/>
                <path d="M5 7V11" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M5 5V5.01" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 11V7" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M11 11V9C11 8 10.5 7 9 7C7.5 7 7 8 7 9" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              LinkedIn
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2L9.5 14L7.5 8.5L2 6.5L14 2Z" stroke="#0088CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Telegram
            </button>
          </div>
        </div>
        
        <div>
          <h4 className="text-base font-medium text-gray-800 mb-4">Build your own triggers</h4>
          
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
              <Settings className="h-4 w-4 text-gray-500" />
              Custom webhook
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2L2 5L8 8L14 5L8 2Z" stroke="#FF4F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 11L8 14L14 11" stroke="#FF4F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 8L8 11L14 8" stroke="#FF4F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Zapier
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
              <Zap className="h-4 w-4 text-gray-500" />
              Tool as trigger
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 9C14 9.53043 13.7893 10.0391 13.4142 10.4142C13.0391 10.7893 12.5304 11 12 11H4L2 13V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H12C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5V9Z" stroke="#6E6E6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              API
            </button>
          </div>
        </div>
        
        <div className="mt-12">
          <h4 className="text-base font-medium text-gray-800 mb-4">Schedule messages</h4>
          
          <div className="border border-gray-200 rounded-lg p-6 flex justify-between items-center">
            <div>
              <h5 className="font-medium text-gray-900 mb-1">Enable scheduled messages</h5>
              <p className="text-sm text-gray-600">Allow your agent to schedule future actions.</p>
            </div>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEscalationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Escalations</h3>
        <p className="text-gray-600 mb-6">Configure how your agent brings humans into the loop, via Slack or email notifications</p>
        
        <div className="mb-8">
          <h4 className="text-base font-medium text-gray-800 mb-4">Slack Notifications</h4>
          <p className="text-gray-600 mb-4">Get notified in Slack when a task meets a specific status</p>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Plus className="h-4 w-4" />
            Add agent notification
          </button>
        </div>
        
        <div className="border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-700">
            Access "Escalation" feature by <a href="#" className="text-blue-600">upgrading to a paid plan</a>.
          </p>
        </div>
        
        <div className="mb-8">
          <h4 className="text-base font-medium text-gray-800 mb-4">Tool approvals</h4>
          <p className="text-gray-600 mb-4">Configure if approval is needed before running a tool and how agent responds to tool failure</p>
          
          <div className="border border-gray-200 rounded-lg p-6 space-y-6">
            <div>
              <h5 className="flex items-center gap-2 font-medium text-gray-900 mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 6.66667V5.83333C17.5 4.91286 16.7538 4.16667 15.8333 4.16667H4.16667C3.24619 4.16667 2.5 4.91286 2.5 5.83333V14.1667C2.5 15.0871 3.24619 15.8333 4.16667 15.8333H15.8333C16.7538 15.8333 17.5 15.0871 17.5 14.1667V13.3333" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M6.66667 10H10" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Default fail behavior
              </h5>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-medium text-gray-900 mb-1">Always retry errored tool/subagent</p>
                  <p className="text-sm text-gray-600">When on, forces agent to retry errored tools/subagents until success or max retries (at which point the task will fail). When off, agent decides whether to retry or continue the session.</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-200">
                  <input type="checkbox" id="toggle" className="absolute w-0 h-0 opacity-0" />
                  <label htmlFor="toggle" className="absolute left-0 w-6 h-6 bg-white border border-gray-300 rounded-full transition-transform duration-200 ease-in-out transform translate-x-0 cursor-pointer"></label>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="font-medium text-gray-900 mb-1">Maximum number of tools/subagents retries</p>
                <p className="text-sm text-gray-600 mb-2">Number of times the agent will retry a tool/subagent that errors before marking the task as failed. Increasing this may raise credit usage.</p>
                <input type="number" value="3" className="w-full md:w-40 p-2 border border-gray-300 rounded-lg" />
              </div>
              
              <div>
                <p className="font-medium text-gray-900 mb-1">Behaviour after max tool/subagent retries</p>
                <p className="text-sm text-gray-600 mb-2">Decide what should happen when the maximum number of retries is reached.</p>
                <div className="relative">
                  <select className="w-full md:w-60 appearance-none p-2 pr-8 border border-gray-300 rounded-lg bg-white">
                    <option>Terminate task</option>
                    <option>Continue with warnings</option>
                    <option>Notify human</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6L8 10L12 6" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExecutionTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trigger Types
        </label>
        <div className="space-y-2">
          {['manual', 'message_step', 'api', 'internal_trigger'].map((trigger) => (
            <label key={trigger} className="flex items-center">
              <input
                type="checkbox"
                checked={currentAgent.executionLogic.triggers.includes(trigger)}
                onChange={(e) => {
                  const triggers = e.target.checked
                    ? [...currentAgent.executionLogic.triggers, trigger]
                    : currentAgent.executionLogic.triggers.filter((t: string) => t !== trigger);
                  
                  setCurrentAgent((prev: any) => ({
                    ...prev,
                    executionLogic: { ...prev.executionLogic, triggers }
                  }));
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {trigger.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Retries
        </label>
        <input
          type="number"
          min="0"
          max="10"
          value={currentAgent.executionLogic.maxRetries}
          onChange={(e) => setCurrentAgent((prev: any) => ({
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
          onChange={(e) => setCurrentAgent((prev: any) => ({
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
    { id: 'overview', label: 'Overview', icon: Settings, render: renderOverviewTab },
    { id: 'tools', label: 'Tools', icon: Zap, render: renderToolsTab },
    { id: 'memory', label: 'Memory', icon: Brain, render: renderMemoryTab },
    { id: 'prompt', label: 'Prompt', icon: MessageSquare, render: renderPromptTab },
    { id: 'chat', label: 'Chat Settings', icon: MessageSquare, render: renderChatTab },
    { id: 'triggers', label: 'Triggers', icon: Clock, render: renderTriggersTab },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle, render: renderEscalationsTab },
    { id: 'execution', label: 'Execution Logic', icon: Bot, render: renderExecutionTab }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
                {currentAgent.name || 'New Agent'}
              </h1>
              <p className="text-sm text-gray-600">AI Agent Configuration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Agent
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
          {tabs.find(tab => tab.id === activeTab)?.render()}
        </div>
      </div>

      {/* Tools Library Modal */}
      <ToolsLibraryModal
        isOpen={showToolsLibrary}
        onClose={() => setShowToolsLibrary(false)}
        onSelectTool={handleToolSelect}
        onCreateCustomTool={handleCreateCustomTool}
      />

      {/* Tool Configuration Wizard */}
      <ToolConfigurationWizard
        isOpen={showToolConfig}
        onClose={() => setShowToolConfig(false)}
        agentId={agentId || ''}
        existingTool={selectedToolTemplate}
        onToolSaved={handleToolSaved}
      />

      {/* Prompt Engineering Wizard */}
      <PromptEngineeringWizard
        onClose={() => setShowPromptWizard(false)}
        onSave={(promptData) => {
          setCurrentAgent((prev: any) => ({
            ...prev,
            chatSettings: { 
              ...prev.chatSettings, 
              systemPrompt: promptData.generatedPrompt || prev.chatSettings.systemPrompt 
            }
          }));
          setShowPromptWizard(false);
        }}
        initialPrompt={currentAgent.chatSettings.systemPrompt}
      />
    </div>
  );
};

export default AIAgentBuilderExact;