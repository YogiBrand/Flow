import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Bot, 
  Workflow, 
  Plus, 
  Search, 
  Filter,
  Play,
  Pause,
  Settings,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import MessagingWorkflowBuilder from './MessagingWorkflowBuilder';
import AIAgentBuilder from './AIAgentBuilder';
import AIAgentBuilderExact from './AIAgentBuilderExact';
import { MessagingWorkflow, AIAgent } from '../../types/influenceFlow';
import { useAuth } from '../../hooks/useAuth';
import { AgentService } from '../../services/agentService';
import { supabase } from '../../lib/supabase';

const InfluenceFlowDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'workflows' | 'agents' | 'analytics'>('agents');
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [showAgentBuilder, setShowAgentBuilder] = useState(false);
  const [showExactAgentBuilder, setShowExactAgentBuilder] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<MessagingWorkflow | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock workflows data (keeping original functionality)
  const workflows: MessagingWorkflow[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Instagram Welcome Sequence',
      description: 'Automated welcome message for new Instagram followers',
      steps: [],
      edges: [],
      status: 'active',
      triggerType: 'campaign',
      targetPlatforms: ['instagram'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Email Nurture Campaign',
      description: 'Multi-step email sequence for lead nurturing',
      steps: [],
      edges: [],
      status: 'draft',
      triggerType: 'manual',
      targetPlatforms: ['email'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Load agents from Supabase
  useEffect(() => {
    if (user) {
      loadAgents();
      // Add delay before initializing mock data to ensure user record exists
      setTimeout(() => {
        initializeMockData();
      }, 1000);
    }
  }, [user]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const dbAgents = await AgentService.getUserAgents(user!.id);
      
      // Convert database agents to frontend format
      const formattedAgents: AIAgent[] = dbAgents.map(dbAgent => ({
        id: dbAgent.id,
        name: dbAgent.name,
        description: dbAgent.description,
        purpose: dbAgent.purpose,
        tools: [], // Will be loaded separately if needed
        memory: {
          enabled: dbAgent.memory_enabled,
          type: dbAgent.memory_type,
          contextSize: dbAgent.context_size,
          recallSettings: {}
        },
        chatSettings: {
          systemPrompt: dbAgent.system_prompt,
          temperature: dbAgent.temperature,
          topP: dbAgent.top_p,
          outputMode: dbAgent.output_mode,
          model: dbAgent.model
        },
        executionLogic: {
          triggers: ['manual'], // Default for now
          maxRetries: dbAgent.max_retries,
          fallbackResponse: dbAgent.fallback_response
        },
        createdAt: dbAgent.created_at,
        updatedAt: dbAgent.updated_at
      }));

      setAgents(formattedAgents);
    } catch (error) {
      console.error('Error loading agents:', error);
      // Fallback to mock data if there's an error
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const ensureUserExists = async (): Promise<boolean> => {
    try {
      // Check if user exists in the users table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user!.id)
        .single();

      if (existingUser) {
        return true;
      }

      // If user doesn't exist, create them
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user!.id,
          email: user!.email || '',
          display_name: user!.user_metadata?.full_name || user!.email?.split('@')[0] || 'User',
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating user record:', insertError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error ensuring user exists:', error);
      return false;
    }
  };

  const initializeMockData = async () => {
    try {
      // Ensure user exists in the users table first
      const userExists = await ensureUserExists();
      if (!userExists) {
        console.error('Failed to ensure user exists in database');
        return;
      }

      // Check if mock agent already exists
      const existingAgents = await AgentService.getUserAgents(user!.id);
      
      if (existingAgents.length === 0) {
        // Create mock agent
        const mockAgent = await AgentService.createAgent({
          user_id: user!.id,
          name: 'Content Assistant',
          description: 'AI agent for content creation and optimization',
          purpose: 'Help create engaging social media content',
          status: 'active',
          system_prompt: 'You are a helpful content creation assistant.',
          temperature: 0.7,
          top_p: 0.9,
          model: 'gpt-4',
          output_mode: 'message',
          memory_enabled: true,
          memory_type: 'vector_store',
          context_size: 4000,
          max_retries: 3,
          fallback_response: 'I apologize, but I encountered an error. Please try again.'
        });

        // Add some mock tools for the agent
        await AgentService.createTool({
          agent_id: mockAgent.id,
          name: 'Web Scraper',
          type: 'web_scraper',
          config: { timeout: 30000, maxPages: 10 },
          enabled: true
        });

        await AgentService.createTool({
          agent_id: mockAgent.id,
          name: 'Search Tool',
          type: 'search_tool',
          config: { engine: 'google', maxResults: 10 },
          enabled: true
        });

        // Add mock knowledge base
        await AgentService.createKnowledgeBase({
          agent_id: mockAgent.id,
          name: 'Content Guidelines',
          type: 'text',
          content: 'Guidelines for creating engaging social media content...',
          metadata: { category: 'guidelines' },
          enabled: true
        });

        // Reload agents after creating mock data
        loadAgents();
      }
    } catch (error) {
      console.error('Error initializing mock data:', error);
    }
  };

  const stats = [
    {
      label: 'Active Workflows',
      value: workflows.filter(w => w.status === 'active').length,
      icon: Workflow,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      label: 'AI Agents',
      value: agents.length,
      icon: Bot,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      label: 'Messages Sent',
      value: '2.4k',
      icon: MessageSquare,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: 'Response Rate',
      value: '68%',
      icon: BarChart3,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    }
  ];

  if (showWorkflowBuilder) {
    return (
      <MessagingWorkflowBuilder
        workflow={selectedWorkflow}
        onBack={() => {
          setShowWorkflowBuilder(false);
          setSelectedWorkflow(null);
        }}
      />
    );
  }

  if (showAgentBuilder) {
    return (
      <AIAgentBuilder
        agent={selectedAgent}
        onBack={() => {
          setShowAgentBuilder(false);
          setSelectedAgent(null);
        }}
      />
    );
  }

  if (showExactAgentBuilder) {
    return (
      <AIAgentBuilderExact
        agentId={selectedAgentId || undefined}
        onBack={() => {
          setShowExactAgentBuilder(false);
          setSelectedAgentId(null);
          loadAgents(); // Reload agents when coming back
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Influence Flow</h1>
            <p className="text-gray-600">Messaging automation & AI agent orchestration</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWorkflowBuilder(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Workflow
            </button>
            <button
              onClick={() => setShowExactAgentBuilder(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              New Agent
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} border border-gray-200 rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'workflows', label: 'Messaging Workflows', icon: MessageSquare },
              { id: 'agents', label: 'AI Agents', icon: Bot },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
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

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Content */}
        {activeTab === 'workflows' && (
          <WorkflowsView 
            workflows={workflows}
            onEditWorkflow={(workflow) => {
              setSelectedWorkflow(workflow);
              setShowWorkflowBuilder(true);
            }}
          />
        )}

        {activeTab === 'agents' && (
          <AgentsView 
            agents={agents}
            loading={loading}
            onEditAgent={(agent) => {
              setSelectedAgentId(agent.id);
              setShowExactAgentBuilder(true);
            }}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsView />}
      </div>
    </div>
  );
};

// Workflows View Component
const WorkflowsView: React.FC<{ 
  workflows: MessagingWorkflow[]; 
  onEditWorkflow: (workflow: MessagingWorkflow) => void;
}> = ({ workflows, onEditWorkflow }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return '📷';
      case 'email':
        return '📧';
      case 'whatsapp':
        return '💬';
      case 'sms':
        return '📱';
      case 'telegram':
        return '✈️';
      default:
        return '📨';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workflows.map((workflow) => (
        <motion.div
          key={workflow.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onEditWorkflow(workflow)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(workflow.status)}
                  <span className="text-sm text-gray-500 capitalize">{workflow.status}</span>
                </div>
              </div>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-4">{workflow.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {workflow.targetPlatforms.map((platform) => (
                <span key={platform} className="text-lg">
                  {getPlatformIcon(platform)}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500">
              {workflow.steps.length} steps
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Agents View Component
const AgentsView: React.FC<{ 
  agents: AIAgent[]; 
  loading: boolean;
  onEditAgent: (agent: AIAgent) => void;
}> = ({ agents, loading, onEditAgent }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <motion.div
          key={agent.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onEditAgent(agent)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                <span className="text-sm text-gray-500">AI Agent</span>
              </div>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-4">{agent.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {agent.chatSettings.model}
              </span>
              {agent.memory.enabled && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  Memory
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {agent.tools?.length || 0} tools
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Analytics View Component
const AnalyticsView: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
      <p className="text-gray-600">Detailed analytics and reporting for your messaging workflows and AI agents.</p>
    </div>
  );
};

export default InfluenceFlowDashboard;