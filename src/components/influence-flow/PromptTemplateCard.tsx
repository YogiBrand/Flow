import React from 'react';
import { motion } from 'framer-motion';

interface PromptTemplateCardProps {
  title: string;
  complexity: 'Low' | 'Medium' | 'High' | 'Complex';
  description: string;
  onClick: () => void;
}

const PromptTemplateCard: React.FC<PromptTemplateCardProps> = ({
  title,
  complexity,
  description,
  onClick
}) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Complex':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getComplexityDescription = (complexity: string) => {
    switch (complexity) {
      case 'Low':
        return 'Minimize Cost';
      case 'Medium':
        return 'Balance Cost/Performance';
      case 'High':
      case 'Complex':
        return 'Maximize Performance';
      default:
        return '';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/20 hover:border-purple-300 cursor-pointer transition-all"
      onClick={onClick}
    >
      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2">{title}</h4>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1 ${getComplexityColor(complexity)}`}>
        {complexity} Complexity
      </span>
      <div className="text-xs text-gray-500 dark:text-gray-400">{getComplexityDescription(complexity)}</div>
    </motion.div>
  );
};

export default PromptTemplateCard;