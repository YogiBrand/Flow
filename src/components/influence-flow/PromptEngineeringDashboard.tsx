import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wand2, 
  Globe, 
  Brain, 
  Settings2, 
  DollarSign, 
  Play,
  Plus
} from 'lucide-react';
import PromptTemplateCard from './PromptTemplateCard';
import PromptEngineeringWizard from './PromptEngineeringWizard';

const PromptEngineeringDashboard: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    {
      id: 'influencer-outreach',
      title: 'Influencer Outreach Template',
      complexity: 'Medium' as const,
      description: 'Balance Cost/Performance'
    },
    {
      id: 'content-strategy',
      title: 'AI Content Strategy Generator',
      complexity: 'High' as const,
      description: 'Maximize Performance'
    },
    {
      id: 'affiliate-campaign',
      title: 'Affiliate Campaign Optimizer',
      complexity: 'Medium' as const,
      description: 'Balance Cost/Performance'
    },
    {
      id: 'self-improving',
      title: 'Self-Improving Agent Blueprint',
      complexity: 'Complex' as const,
      description: 'Maximize Performance'
    }
  ];

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowWizard(true);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setShowWizard(true);
  };

  const handleSavePrompt = (promptData: any) => {
    console.log('Saving prompt:', promptData);
    setShowWizard(false);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="border-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 p-5 lg:p-7 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Wand2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Prompt Engineering</h2>
            <p className="text-gray-600 dark:text-gray-400">Create powerful AI agent prompts with precision and cost optimization</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map(template => (
            <PromptTemplateCard
              key={template.id}
              title={template.title}
              complexity={template.complexity}
              description={template.description}
              onClick={() => handleTemplateClick(template.id)}
            />
          ))}
        </div>
      </div>

      {/* Data Source Integration */}
      <div className="border border-blue-200 dark:border-blue-800 bg-gray-0 p-5 dark:bg-gray-50 lg:p-7 rounded-lg">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">🔗 Data Source Integration</h3>
          <div>Enhance your prompts with real-time data from web scraping and search</div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                URLs to Scrape (one per line)
              </label>
              <textarea
                rows={3}
                placeholder="https://example.com/influencer-profile"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                Search Queries (one per line)
              </label>
              <textarea
                rows={3}
                placeholder="top Instagram influencers 2024"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              disabled
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed"
            >
              <Globe className="h-4 w-4" />
              Extract Data
            </button>
          </div>
        </div>
      </div>

      {/* Core Configuration */}
      <div className="border border-purple-200 dark:border-purple-800 bg-gray-0 p-5 dark:bg-gray-50 lg:p-7 rounded-lg">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">⚡ Core Configuration</h3>
          <div>Define the main parameters for your AI prompt</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Core Task *
              </label>
              <textarea
                rows={3}
                placeholder="Describe the main task you want the AI to accomplish..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                defaultValue="Create personalized outreach messages for influencer collaboration, analyzing their content style and audience demographics."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Format
              </label>
              <textarea
                rows={2}
                placeholder="Specify how you want the output structured..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                defaultValue="Email template with subject line, personalized intro, value proposition, and call-to-action."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                placeholder="Who will use this output?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Complexity
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                defaultValue="Medium"
              >
                <option value="Low">Low - Simple tasks</option>
                <option value="Medium">Medium - Moderate complexity</option>
                <option value="High">High - Complex analysis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AI Persona Preference
              </label>
              <input
                type="text"
                placeholder="e.g., Expert Influencer Marketing Strategist"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                defaultValue="Expert Influencer Marketing Strategist"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What to Include
            </label>
            <textarea
              rows={3}
              placeholder="Specific elements to include in the response..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="Personalization tactics, value propositions, partnership terms"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What to Exclude
            </label>
            <textarea
              rows={3}
              placeholder="Elements to avoid or exclude..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="Generic templates, spam-like language"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cost Preference
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="Balance Cost/Performance"
            >
              <option value="Minimize Cost">Minimize Cost</option>
              <option value="Balance Cost/Performance">Balance Cost/Performance</option>
              <option value="Maximize Performance">Maximize Performance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Plus className="inline h-4 w-4 mr-1" />
              Upload Context File (Optional)
            </label>
            <input
              type="file"
              accept=".txt,.md,.csv,.json"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Chain-of-Thought Configuration */}
      <div className="border border-indigo-200 dark:border-indigo-800 bg-gray-0 p-5 dark:bg-gray-50 lg:p-7 rounded-lg">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">🧠 Chain-of-Thought Configuration</h3>
          <div>Define step-by-step reasoning patterns for complex tasks</div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <input
              id="enableCoT"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 rounded"
              defaultChecked
            />
            <label htmlFor="enableCoT" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Chain-of-Thought Reasoning
            </label>
          </div>

          <div className="flex gap-3">
            <button
              className="px-4 py-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Auto-Generate Steps
            </button>
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Steps
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chain-of-Thought Steps
            </label>
            <textarea
              rows={6}
              placeholder="1. First, analyze the requirements... 2. Next, gather relevant information... 3. Then, structure the approach..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              defaultValue="1. Analyze the core requirements and constraints
2. Research relevant information and best practices
3. Structure the approach and methodology
4. Execute the task with attention to detail
5. Review and validate the output against requirements"
            />
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="border border-purple-200 dark:border-purple-800 bg-gray-0 p-5 dark:bg-gray-50 lg:p-7 rounded-lg">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Advanced Features
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900 dark:to-pink-900 dark:text-purple-300">
                Quality: 220%
              </span>
            </div>
          </h3>
          <div>Unlock advanced prompt engineering capabilities</div>
        </div>

        <div className="space-y-6 mt-4">
          <button
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Hide Advanced Options
            </span>
            <ChevronDown className="h-4 w-4 transition-transform rotate-180" />
          </button>

          <div className="space-y-6 border-l-2 border-purple-200 dark:border-purple-700 pl-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Advanced Reasoning Patterns
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    id="enableReAct"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <label htmlFor="enableReAct" className="text-sm text-gray-700 dark:text-gray-300">
                    ReAct (Reason + Act + Observe)
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="enableSelfImprovement"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <label htmlFor="enableSelfImprovement" className="text-sm text-gray-700 dark:text-gray-300">
                    Self-Improvement Loop
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="enableThoughtPlanAct"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <label htmlFor="enableThoughtPlanAct" className="text-sm text-gray-700 dark:text-gray-300">
                    Thought/Plan/Act Mode
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Information Prioritization
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    id="enableImplicitPrioritization"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <label htmlFor="enableImplicitPrioritization" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Implicit Prioritization
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="enableTieredHierarchy"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <label htmlFor="enableTieredHierarchy" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tiered Information Hierarchy
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <CircleCheck className="h-4 w-4" />
                Error Handling &amp; Safety
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    id="enableEthicalGuardrails"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <label htmlFor="enableEthicalGuardrails" className="text-sm text-gray-700 dark:text-gray-300">
                    Ethical &amp; Safety Guardrails
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="enableConfidenceThreshold"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <label htmlFor="enableConfidenceThreshold" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confidence Threshold Reporting
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="enableUnresolvableAmbiguityFallback"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <label htmlFor="enableUnresolvableAmbiguityFallback" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ambiguity Fallback Message
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="enablePrioritizedFallbackStrategy"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <label htmlFor="enablePrioritizedFallbackStrategy" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Prioritized Fallback Strategy
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Recommendations & Cost Analysis */}
      <div className="border border-green-200 dark:border-green-800 bg-gray-0 p-5 dark:bg-gray-50 lg:p-7 rounded-lg">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Model Recommendations &amp; Cost Analysis
            </div>
          </h3>
          <div>AI model suggestions based on your task complexity and cost preferences</div>
        </div>

        <div className="space-y-4 mt-4">
          <button
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Hide Model Analysis
            </span>
            <ChevronDown className="h-4 w-4 transition-transform rotate-180" />
          </button>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Recommended for Medium Complexity
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Google Gemini 1.5 Pro</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Multi-turn conversations, Structured data generation, Content expansion with reasoning
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      Very Good
                    </span>
                    <div className="text-xs text-gray-500 mt-1">$3.5/$10.5 per 1M tokens</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">300ms</div>
                    <div className="text-xs text-gray-500">Latency</div>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">1M</div>
                    <div className="text-xs text-gray-500">Context</div>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">4/5</div>
                    <div className="text-xs text-gray-500">Impact</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleCreateNew}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-3 px-4 rounded-md flex items-center justify-center gap-3"
      >
        <Wand2 className="h-5 w-5" />
        Generate Optimized Prompt
      </button>

      {/* Wizard Modal */}
      {showWizard && (
        <PromptEngineeringWizard
          onClose={() => setShowWizard(false)}
          onSave={handleSavePrompt}
        />
      )}
    </div>
  );
};

// Helper component for the chevron down icon
const ChevronDown = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// Helper component for the lightbulb icon
const Lightbulb = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
  </svg>
);

// Helper component for the trending up icon
const TrendingUp = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m23 6-9.5 9.5-5-5L1 18"></path>
    <path d="M17 6h6v6"></path>
  </svg>
);

// Helper component for the circle check icon
const CircleCheck = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <path d="m9 11 3 3L22 4"></path>
  </svg>
);

export default PromptEngineeringDashboard;