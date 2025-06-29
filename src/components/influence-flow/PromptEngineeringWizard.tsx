import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Save, Wand2, Brain, MessageSquare, Code, TrendingUp, CheckCircle as CircleCheck, DollarSign, Globe, Search, UploadCloud as CloudUpload, Lightbulb, Settings2, Plus, Minus, Copy, Play } from 'lucide-react';

interface PromptEngineeringWizardProps {
  onClose: () => void;
  onSave: (promptData: any) => void;
  initialPrompt?: string;
}

const PromptEngineeringWizard: React.FC<PromptEngineeringWizardProps> = ({ onClose, onSave, initialPrompt }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(true);
  const [showModelAnalysis, setShowModelAnalysis] = useState(true);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic info
    coreTask: "Create personalized outreach messages for influencer collaboration, analyzing their content style and audience demographics.",
    outputFormat: "Email template with subject line, personalized intro, value proposition, and call-to-action.",
    targetAudience: "",
    taskComplexity: "Medium",
    aiPersona: "Expert Influencer Marketing Strategist",
    
    // What to include/exclude
    inclusions: "Personalization tactics, value propositions, partnership terms",
    exclusions: "Generic templates, spam-like language",
    
    // Cost preference
    costPreference: "Balance Cost/Performance",
    
    // Data sources
    urls: "",
    searchQueries: "",
    
    // Chain of thought
    enableCoT: true,
    cotSteps: "1. Analyze the core requirements and constraints\n2. Research relevant information and best practices\n3. Structure the approach and methodology\n4. Execute the task with attention to detail\n5. Review and validate the output against requirements",
    
    // Advanced options
    enableReAct: false,
    enableSelfImprovement: false,
    enableThoughtPlanAct: false,
    enableImplicitPrioritization: false,
    enableTieredHierarchy: false,
    enableEthicalGuardrails: false,
    enableConfidenceThreshold: false,
    enableUnresolvableAmbiguityFallback: false,
    enablePrioritizedFallbackStrategy: false,
    
    // File upload
    contextFile: null
  });

  // Initialize with existing prompt if available
  useEffect(() => {
    if (initialPrompt) {
      // Try to extract values from the existing prompt
      // This is a simple implementation - in a real app, you'd want more robust parsing
      setGeneratedPrompt(initialPrompt);
      
      // Extract core task
      const coreTaskMatch = initialPrompt.match(/MISSION CRITICAL PROMPT: (.*?)(\n|$)/);
      if (coreTaskMatch && coreTaskMatch[1]) {
        setFormData(prev => ({ ...prev, coreTask: coreTaskMatch[1] }));
      }
      
      // Extract AI persona
      const personaMatch = initialPrompt.match(/You are a \*\*(.*?)\*\*/);
      if (personaMatch && personaMatch[1]) {
        setFormData(prev => ({ ...prev, aiPersona: personaMatch[1] }));
      }
      
      // Extract output format
      const outputFormatMatch = initialPrompt.match(/\*\*Output Format:\*\* (.*?)(\n|$)/);
      if (outputFormatMatch && outputFormatMatch[1]) {
        setFormData(prev => ({ ...prev, outputFormat: outputFormatMatch[1] }));
      }
    }
  }, [initialPrompt]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, contextFile: e.target.files?.[0] || null }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGeneratePrompt = () => {
    // In a real implementation, this would call an API to generate the prompt
    const generatedPromptText = `# MISSION CRITICAL PROMPT: ${formData.coreTask}

---
## 1. **ROLE & PERSONA: InfluenceMate AI Specialist**
You are a **${formData.aiPersona}** specializing in influencer marketing, content strategy, and business automation for the InfluenceMate platform. Your expertise encompasses advanced AI agent design, prompt engineering, and cost-optimized solutions.

---
## 2. **TASK: The Absolute Mandate**
Your supreme task is to: **${formData.coreTask}**

---
## 3. **CONSTRAINTS & GUARDRAILS**
Your output must strictly adhere to the following requirements:

* **Output Format:** ${formData.outputFormat}
* **Target Audience:** ${formData.targetAudience || "InfluenceMate platform users"}
* **Task Complexity:** ${formData.taskComplexity}
* **Cost Preference:** ${formData.costPreference}
* **Inclusions:** ${formData.inclusions}
* **Exclusions:** ${formData.exclusions}
* **Model Optimization:** Leverage Google Gemini 1.5 Pro capabilities (Very Good performance, 300ms latency).

${formData.enableEthicalGuardrails ? `
---
## 4. **ERROR HANDLING & AMBIGUITY PROTOCOL**
Your resilience and deterministic behavior are paramount. If faced with uncertainty, follow these directives:
* For ambiguities, request clarification rather than making assumptions
* Maintain ethical guidelines and platform compliance at all times
* If confidence drops below acceptable thresholds, explicitly state confidence levels
` : ''}

${formData.enableCoT ? `
---
## 6. **ACTION PROTOCOL**
Execute the following systematic approach:

${formData.cotSteps}
` : ''}

---
## 7. **MODEL RECOMMENDATION & COST ANALYSIS**
Recommended: Google Gemini 1.5 Pro - Very Good performance, $3.5/$10.5 per 1M tokens, 300ms latency

**Prompt Quality Score:** 200% (Excellent)

---
### **BEGIN RESPONSE:**
***CRITICAL OUTPUT COMMENCEMENT***`;

    setGeneratedPrompt(generatedPromptText);
    setCurrentStep(steps.length - 1); // Move to the last step
  };

  const handleCopyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      // Could add a toast notification here
    }
  };

  const handleSavePrompt = () => {
    onSave({ 
      ...formData,
      generatedPrompt: generatedPrompt 
    });
  };

  const steps = [
    {
      title: "Core Configuration",
      icon: <Settings2 className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Core Task *
                </label>
                <textarea
                  name="coreTask"
                  rows={3}
                  value={formData.coreTask}
                  onChange={handleInputChange}
                  placeholder="Describe the main task you want the AI to accomplish..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Output Format
                </label>
                <textarea
                  name="outputFormat"
                  rows={2}
                  value={formData.outputFormat}
                  onChange={handleInputChange}
                  placeholder="Specify how you want the output structured..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
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
                  name="taskComplexity"
                  value={formData.taskComplexity}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  name="aiPersona"
                  value={formData.aiPersona}
                  onChange={handleInputChange}
                  placeholder="e.g., Expert Influencer Marketing Strategist"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                name="inclusions"
                rows={3}
                value={formData.inclusions}
                onChange={handleInputChange}
                placeholder="Specific elements to include in the response..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What to Exclude
              </label>
              <textarea
                name="exclusions"
                rows={3}
                value={formData.exclusions}
                onChange={handleInputChange}
                placeholder="Elements to avoid or exclude..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cost Preference
              </label>
              <select
                name="costPreference"
                value={formData.costPreference}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Minimize Cost">Minimize Cost</option>
                <option value="Balance Cost/Performance">Balance Cost/Performance</option>
                <option value="Maximize Performance">Maximize Performance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CloudUpload className="inline h-4 w-4 mr-1" />
                Upload Context File (Optional)
              </label>
              <input
                type="file"
                accept=".txt,.md,.csv,.json"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Data Source Integration",
      icon: <Globe className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                URLs to Scrape (one per line)
              </label>
              <textarea
                name="urls"
                rows={3}
                value={formData.urls}
                onChange={handleInputChange}
                placeholder="https://example.com/influencer-profile"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Search className="inline h-4 w-4 mr-1" />
                Search Queries (one per line)
              </label>
              <textarea
                name="searchQueries"
                rows={3}
                value={formData.searchQueries}
                onChange={handleInputChange}
                placeholder="top Instagram influencers 2024"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              disabled={!formData.urls && !formData.searchQueries}
            >
              <Globe className="h-4 w-4" />
              Extract Data
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Chain-of-Thought Configuration",
      icon: <Brain className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              id="enableCoT"
              name="enableCoT"
              type="checkbox"
              checked={formData.enableCoT}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 rounded"
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
              name="cotSteps"
              rows={6}
              value={formData.cotSteps}
              onChange={handleInputChange}
              placeholder="1. First, analyze the requirements... 2. Next, gather relevant information... 3. Then, structure the approach..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            />
          </div>
        </div>
      )
    },
    {
      title: "Advanced Features",
      icon: <Settings2 className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
          </button>
          
          {showAdvancedOptions && (
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
                      name="enableReAct"
                      type="checkbox"
                      checked={formData.enableReAct}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    <label htmlFor="enableReAct" className="text-sm text-gray-700 dark:text-gray-300">
                      ReAct (Reason + Act + Observe)
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="enableSelfImprovement"
                      name="enableSelfImprovement"
                      type="checkbox"
                      checked={formData.enableSelfImprovement}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    <label htmlFor="enableSelfImprovement" className="text-sm text-gray-700 dark:text-gray-300">
                      Self-Improvement Loop
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="enableThoughtPlanAct"
                      name="enableThoughtPlanAct"
                      type="checkbox"
                      checked={formData.enableThoughtPlanAct}
                      onChange={handleCheckboxChange}
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
                      name="enableImplicitPrioritization"
                      type="checkbox"
                      checked={formData.enableImplicitPrioritization}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    <label htmlFor="enableImplicitPrioritization" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Implicit Prioritization
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="enableTieredHierarchy"
                      name="enableTieredHierarchy"
                      type="checkbox"
                      checked={formData.enableTieredHierarchy}
                      onChange={handleCheckboxChange}
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
                  Error Handling & Safety
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      id="enableEthicalGuardrails"
                      name="enableEthicalGuardrails"
                      type="checkbox"
                      checked={formData.enableEthicalGuardrails}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    <label htmlFor="enableEthicalGuardrails" className="text-sm text-gray-700 dark:text-gray-300">
                      Ethical & Safety Guardrails
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="enableConfidenceThreshold"
                      name="enableConfidenceThreshold"
                      type="checkbox"
                      checked={formData.enableConfidenceThreshold}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    <label htmlFor="enableConfidenceThreshold" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confidence Threshold Reporting
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="enableUnresolvableAmbiguityFallback"
                      name="enableUnresolvableAmbiguityFallback"
                      type="checkbox"
                      checked={formData.enableUnresolvableAmbiguityFallback}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    <label htmlFor="enableUnresolvableAmbiguityFallback" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ambiguity Fallback Message
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="enablePrioritizedFallbackStrategy"
                      name="enablePrioritizedFallbackStrategy"
                      type="checkbox"
                      checked={formData.enablePrioritizedFallbackStrategy}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    <label htmlFor="enablePrioritizedFallbackStrategy" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Prioritized Fallback Strategy
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Model Recommendations",
      icon: <DollarSign className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <button
            onClick={() => setShowModelAnalysis(!showModelAnalysis)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {showModelAnalysis ? "Hide" : "Show"} Model Analysis
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showModelAnalysis ? 'rotate-180' : ''}`} />
          </button>
          
          {showModelAnalysis && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Recommended for {formData.taskComplexity} Complexity
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
          )}
        </div>
      )
    },
    {
      title: "Generated Prompt",
      icon: <Wand2 className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          {generatedPrompt ? (
            <>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed overflow-x-auto">
                  {generatedPrompt}
                </pre>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCopyToClipboard}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Wand2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Generate Your Optimized Prompt
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Click the button below to generate an optimized prompt based on your configuration.
              </p>
              <button
                onClick={handleGeneratePrompt}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Wand2 className="h-5 w-5" />
                Generate Prompt
              </button>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Prompt Engineering Wizard</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center gap-2 ${index <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    index < currentStep 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : index === currentStep 
                        ? 'border-indigo-600 text-indigo-600 bg-white' 
                        : 'border-gray-300 text-gray-400 bg-white'
                  }`}>
                    {index < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 transition-colors ${
                    index < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {steps[currentStep].content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSavePrompt}
                disabled={!generatedPrompt}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Prompt
              </button>
            ) : (
              <button
                onClick={currentStep === steps.length - 2 ? handleGeneratePrompt : handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {currentStep === steps.length - 2 ? (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
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

// Helper component for the check icon
const Check = ({ className }: { className?: string }) => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default PromptEngineeringWizard;