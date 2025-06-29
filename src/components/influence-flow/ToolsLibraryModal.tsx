import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Search, 
  Plus, 
  Zap, 
  Globe, 
  Database, 
  Code, 
  Mail, 
  MessageSquare, 
  Bot,
  Filter,
  Star,
  Verified
} from 'lucide-react';
import { useToolTemplates } from '../../hooks/useAgentData';

interface ToolsLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (template: any) => void;
  onCreateCustomTool: () => void;
}

const ToolsLibraryModal: React.FC<ToolsLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  onCreateCustomTool
}) => {
  const { templates, loading } = useToolTemplates();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTab, setSelectedTab] = useState<'all' | 'trending' | 'your_tools'>('all');

  const categories = [
    { id: 'all', label: 'All tools' },
    { id: 'trending', label: 'Trending' },
    { id: 'your_tools', label: 'Your tools' },
    { id: 'communications', label: 'Communications' },
    { id: 'crm', label: 'CRM' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'data_scraper', label: 'Data scraper' },
    { id: 'handle_files', label: 'Handle files' },
    { id: 'knowledge', label: 'Knowledge' }
  ];

  const useCategories = [
    { id: 'communications', label: 'Communications' },
    { id: 'crm', label: 'CRM' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'data_scraper', label: 'Data scraper' },
    { id: 'handle_files', label: 'Handle files' },
    { id: 'knowledge', label: 'Knowledge' }
  ];

  const appCategories = [
    { id: 'gmail', label: 'Gmail', icon: Mail },
    { id: 'google_calendar', label: 'Google Calendar', icon: MessageSquare },
    { id: 'hubspot', label: 'HubSpot', icon: Database },
    { id: 'outlook', label: 'Outlook', icon: Mail }
  ];

  // Mock trending tools data
  const trendingTools = [
    {
      id: 'add_answer_kb',
      name: 'Add Answer to Knowledge Base',
      description: 'Add AI-generated answers to your knowledge base',
      icon: Database,
      verified: true,
      author: 'Relevance AI'
    },
    {
      id: 'add_comment_notion',
      name: 'Add Comment to Notion',
      description: 'Add comments to Notion pages',
      icon: MessageSquare,
      verified: true,
      author: 'Relevance AI'
    },
    {
      id: 'add_comment_trello',
      name: 'Add Comment to Trello Card',
      description: 'Add comments to Trello cards',
      icon: MessageSquare,
      verified: true,
      author: 'Relevance AI'
    },
    {
      id: 'google_play_reviews',
      name: 'Add Google Play Store Reviews to Knowledge',
      description: 'Import Google Play Store reviews',
      icon: Star,
      verified: true,
      author: 'Relevance AI'
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getToolIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      'globe': Globe,
      'database': Database,
      'code': Code,
      'mail': Mail,
      'message-square': MessageSquare,
      'bot': Bot,
      'zap': Zap
    };
    return iconMap[iconName] || Zap;
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Tools</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={onCreateCustomTool}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              New tool
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Tools</h3>
              <div className="space-y-1">
                {categories.slice(0, 3).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedTab(category.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedTab === category.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">By use case</h3>
              <div className="space-y-1">
                {useCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">By apps</h3>
              <div className="space-y-1">
                {appCategories.map((category) => (
                  <button
                    key={category.id}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <category.icon className="w-4 h-4" />
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Search Header */}
          <div className="p-6 border-b border-gray-200 bg-white">
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedTab === 'trending' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Trending</h3>
                  <p className="text-gray-600">Popular tool templates from the community</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendingTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => onSelectTool(tool)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <tool.icon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{tool.name}</h4>
                            {tool.verified && (
                              <Verified className="w-4 h-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{tool.description}</p>
                          <p className="text-xs text-gray-500">by {tool.author}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'all' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All Tools</h3>
                  <p className="text-gray-600">Browse all available tool templates</p>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map((template) => {
                      const ToolIcon = getToolIcon(template.icon_name);
                      return (
                        <button
                          key={template.id}
                          onClick={() => onSelectTool(template)}
                          className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                              <ToolIcon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{template.name}</h4>
                              <p className="text-xs text-gray-500 capitalize">{template.category.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'your_tools' && (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No custom tools yet</h3>
                <p className="text-gray-600 mb-6">Create your first custom tool to get started</p>
                <button
                  onClick={onCreateCustomTool}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Create Custom Tool
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ToolsLibraryModal;