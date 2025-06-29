import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Search, 
  Settings, 
  Play, 
  Save, 
  ChevronRight,
  ChevronLeft,
  Check,
  Trash2,
  Edit3,
  Copy,
  Zap,
  Globe,
  Database,
  Code,
  Mail,
  MessageSquare,
  Bot,
  ArrowRight,
  ArrowDown,
  GripVertical
} from 'lucide-react';
import { useToolTemplates } from '../../hooks/useAgentData';
import { addToolToDB, updateToolInDB } from '../../lib/knowledge';

interface ToolStep {
  id: string;
  name: string;
  type: 'api_call' | 'transform' | 'condition' | 'llm' | 'webhook' | 'delay';
  config: Record<string, any>;
  inputs: Array<{
    name: string;
    type: string;
    required: boolean;
    description?: string;
  }>;
  outputs: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
  order: number;
}

interface ToolConfigurationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  existingTool?: any;
  onToolSaved: () => void;
}

const ToolConfigurationWizard: React.FC<ToolConfigurationWizardProps> = ({
  isOpen,
  onClose,
  agentId,
  existingTool,
  onToolSaved
}) => {
  const { templates, loading: templatesLoading } = useToolTemplates();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [saving, setSaving] = useState(false);

  // Tool configuration state
  const [toolConfig, setToolConfig] = useState({
    name: '',
    description: '',
    category: 'general',
    icon: 'zap',
    inputs: [] as Array<{ name: string; type: string; required: boolean; description: string }>,
    outputs: [] as Array<{ name: string; type: string; description: string }>,
    steps: [] as ToolStep[]
  });

  // Initialize with existing tool data
  useEffect(() => {
    if (existingTool) {
      setToolConfig({
        name: existingTool.name || '',
        description: existingTool.description || '',
        category: existingTool.category || 'general',
        icon: existingTool.icon || 'zap',
        inputs: existingTool.inputs || [],
        outputs: existingTool.outputs || [],
        steps: existingTool.steps || []
      });
      setCurrentStep(existingTool ? 4 : 0); // Skip to configuration if editing
    }
  }, [existingTool]);

  const wizardSteps = [
    { id: 'template', title: 'Select Template', icon: Search },
    { id: 'basic', title: 'Basic Info', icon: Edit3 },
    { id: 'inputs', title: 'Configure Inputs', icon: ArrowRight },
    { id: 'outputs', title: 'Configure Outputs', icon: ArrowDown },
    { id: 'steps', title: 'Setup Logic', icon: Settings }
  ];

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'data_extraction', label: 'Data Extraction' },
    { id: 'research', label: 'Research' },
    { id: 'integration', label: 'Integration' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'social_media', label: 'Social Media' },
    { id: 'analytics', label: 'Analytics' }
  ];

  const stepTypes = [
    { id: 'api_call', label: 'API Call', icon: Globe, description: 'Make HTTP requests to external APIs' },
    { id: 'transform', label: 'Transform Data', icon: Code, description: 'Process and transform data' },
    { id: 'condition', label: 'Conditional Logic', icon: Settings, description: 'Add if/then logic' },
    { id: 'llm', label: 'LLM Processing', icon: Bot, description: 'Use AI to process content' },
    { id: 'webhook', label: 'Webhook', icon: Zap, description: 'Send data to external webhooks' },
    { id: 'delay', label: 'Delay', icon: MessageSquare, description: 'Add time delays' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setToolConfig(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      category: template.category,
      icon: template.icon_name,
      inputs: template.input_schema ? Object.entries(template.input_schema).map(([key, schema]: [string, any]) => ({
        name: key,
        type: schema.type || 'string',
        required: schema.required || false,
        description: schema.description || ''
      })) : [],
      outputs: template.output_schema ? Object.entries(template.output_schema).map(([key, schema]: [string, any]) => ({
        name: key,
        type: schema.type || 'string',
        description: schema.description || ''
      })) : []
    }));
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const toolData = {
        agent_id: agentId,
        name: toolConfig.name,
        type: selectedTemplate?.type || 'custom',
        config: {
          ...selectedTemplate?.default_config,
          inputs: toolConfig.inputs,
          outputs: toolConfig.outputs,
          steps: toolConfig.steps
        },
        tool_template_id: selectedTemplate?.id,
        enabled: true
      };

      if (existingTool) {
        await updateToolInDB(existingTool.id, toolData);
      } else {
        await addToolToDB(agentId, selectedTemplate?.id || '');
      }

      onToolSaved();
      onClose();
    } catch (error) {
      console.error('Error saving tool:', error);
    } finally {
      setSaving(false);
    }
  };

  const addInput = () => {
    setToolConfig(prev => ({
      ...prev,
      inputs: [...prev.inputs, { name: '', type: 'string', required: false, description: '' }]
    }));
  };

  const addOutput = () => {
    setToolConfig(prev => ({
      ...prev,
      outputs: [...prev.outputs, { name: '', type: 'string', description: '' }]
    }));
  };

  const addStep = (type: string) => {
    const newStep: ToolStep = {
      id: `step_${Date.now()}`,
      name: `New ${type.replace('_', ' ')} Step`,
      type: type as any,
      config: {},
      inputs: [],
      outputs: [],
      order: toolConfig.steps.length
    };

    setToolConfig(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const removeStep = (stepId: string) => {
    setToolConfig(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
  };

  const getStepIcon = (type: string) => {
    const stepType = stepTypes.find(st => st.id === type);
    return stepType?.icon || Settings;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {existingTool ? 'Edit Tool' : 'Add New Tool'}
              </h2>
              <p className="text-sm text-gray-600">
                {wizardSteps[currentStep]?.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            {wizardSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-3 ${index <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
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
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                </div>
                {index < wizardSteps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 transition-colors ${
                    index < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 0: Template Selection */}
            {currentStep === 0 && (
              <motion.div
                key="template"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose a Tool Template</h3>
                  <p className="text-gray-600">Select a pre-built template to get started quickly</p>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {templatesLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
                        <div className="w-8 h-8 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    ))
                  ) : (
                    filteredTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                            <template.icon className="w-4 h-4 text-gray-600 group-hover:text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{template.name}</h4>
                            <p className="text-xs text-gray-500 capitalize">{template.category.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                      </button>
                    ))
                  )}
                </div>

                {/* Custom Tool Option */}
                <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <button
                    onClick={() => {
                      setSelectedTemplate({ name: 'Custom Tool', type: 'custom' });
                      setCurrentStep(1);
                    }}
                    className="w-full flex items-center justify-center gap-3 text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Create Custom Tool</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h3>
                  <p className="text-gray-600">Configure the basic details of your tool</p>
                </div>

                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tool Name
                    </label>
                    <input
                      type="text"
                      value={toolConfig.name}
                      onChange={(e) => setToolConfig(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter tool name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={toolConfig.description}
                      onChange={(e) => setToolConfig(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                      placeholder="Describe what this tool does..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={toolConfig.category}
                      onChange={(e) => setToolConfig(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {categories.filter(c => c.id !== 'all').map(category => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Inputs */}
            {currentStep === 2 && (
              <motion.div
                key="inputs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure Inputs</h3>
                  <p className="text-gray-600">Define what data this tool needs to function</p>
                </div>

                <div className="space-y-4">
                  {toolConfig.inputs.map((input, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={input.name}
                            onChange={(e) => {
                              const newInputs = [...toolConfig.inputs];
                              newInputs[index].name = e.target.value;
                              setToolConfig(prev => ({ ...prev, inputs: newInputs }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Input name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={input.type}
                            onChange={(e) => {
                              const newInputs = [...toolConfig.inputs];
                              newInputs[index].type = e.target.value;
                              setToolConfig(prev => ({ ...prev, inputs: newInputs }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="array">Array</option>
                            <option value="object">Object</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={input.required}
                              onChange={(e) => {
                                const newInputs = [...toolConfig.inputs];
                                newInputs[index].required = e.target.checked;
                                setToolConfig(prev => ({ ...prev, inputs: newInputs }));
                              }}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Required</span>
                          </label>
                        </div>
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => {
                              const newInputs = toolConfig.inputs.filter((_, i) => i !== index);
                              setToolConfig(prev => ({ ...prev, inputs: newInputs }));
                            }}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={input.description}
                          onChange={(e) => {
                            const newInputs = [...toolConfig.inputs];
                            newInputs[index].description = e.target.value;
                            setToolConfig(prev => ({ ...prev, inputs: newInputs }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Describe this input..."
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addInput}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Input
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Outputs */}
            {currentStep === 3 && (
              <motion.div
                key="outputs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure Outputs</h3>
                  <p className="text-gray-600">Define what data this tool will return</p>
                </div>

                <div className="space-y-4">
                  {toolConfig.outputs.map((output, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={output.name}
                            onChange={(e) => {
                              const newOutputs = [...toolConfig.outputs];
                              newOutputs[index].name = e.target.value;
                              setToolConfig(prev => ({ ...prev, outputs: newOutputs }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Output name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={output.type}
                            onChange={(e) => {
                              const newOutputs = [...toolConfig.outputs];
                              newOutputs[index].type = e.target.value;
                              setToolConfig(prev => ({ ...prev, outputs: newOutputs }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="array">Array</option>
                            <option value="object">Object</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => {
                              const newOutputs = toolConfig.outputs.filter((_, i) => i !== index);
                              setToolConfig(prev => ({ ...prev, outputs: newOutputs }));
                            }}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={output.description}
                          onChange={(e) => {
                            const newOutputs = [...toolConfig.outputs];
                            newOutputs[index].description = e.target.value;
                            setToolConfig(prev => ({ ...prev, outputs: newOutputs }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Describe this output..."
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addOutput}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Output
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Logic Steps */}
            {currentStep === 4 && (
              <motion.div
                key="steps"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup Logic Steps</h3>
                  <p className="text-gray-600">Define the sequence of operations this tool will perform</p>
                </div>

                {/* Step Types */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Add Step</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {stepTypes.map((stepType) => (
                      <button
                        key={stepType.id}
                        onClick={() => addStep(stepType.id)}
                        className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <stepType.icon className="w-4 h-4 text-gray-600 group-hover:text-indigo-600" />
                          <span className="text-sm font-medium text-gray-900">{stepType.label}</span>
                        </div>
                        <p className="text-xs text-gray-600">{stepType.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-3">
                  {toolConfig.steps.map((step, index) => {
                    const StepIcon = getStepIcon(step.type);
                    return (
                      <div key={step.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <StepIcon className="w-4 h-4 text-gray-600" />
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{step.name}</h5>
                              <p className="text-sm text-gray-600 capitalize">{step.type.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                              <Play className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeStep(step.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {index < toolConfig.steps.length - 1 && (
                          <div className="flex justify-center mt-3">
                            <ArrowDown className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {toolConfig.steps.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="font-medium mb-1">No steps added yet</p>
                      <p className="text-sm">Add steps above to define your tool's logic</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
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
            
            {currentStep === wizardSteps.length - 1 ? (
              <button
                onClick={handleSave}
                disabled={saving || !toolConfig.name}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Tool
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentStep === 0 && !selectedTemplate}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ToolConfigurationWizard;