import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as LucideIcons from 'lucide-react';

const mapIconNameToComponent = (iconName: string) => {
  // Convert kebab-case to PascalCase for Lucide icons
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  return (LucideIcons as any)[pascalCase] || LucideIcons.FileText;
};

export const useAgentData = (agentId: string) => {
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentId) {
      setLoading(false);
      return;
    }

    const fetchAgent = async () => {
      setLoading(true);
      
      try {
        // Fetch agent data
        const { data: agentData, error: agentError } = await supabase
          .from('ai_agents')
          .select('*')
          .eq('id', agentId)
          .single();

        if (agentError) throw agentError;

        // Fetch tools with templates using the new foreign key relationship
        const { data: tools, error: toolsError } = await supabase
          .from('agent_tools')
          .select(`
            *,
            tool_template:tool_templates(*)
          `)
          .eq('agent_id', agentId);

        if (toolsError) throw toolsError;

        // Fetch knowledge bases
        const { data: knowledgeBases, error: knowledgeError } = await supabase
          .from('agent_knowledge_bases')
          .select('*')
          .eq('agent_id', agentId);

        if (knowledgeError) throw knowledgeError;

        // Process tools with icons and inputs
        const toolsWithInputs = (tools || []).map(tool => ({
          ...tool,
          icon: mapIconNameToComponent(tool.tool_template?.icon_name || 'file-text'),
          template: tool.tool_template,
          inputs: tool.tool_template?.input_schema ? Object.entries(tool.tool_template.input_schema).map(([key, schema]: [string, any]) => ({
            id: `${tool.id}_${key}`,
            tool_id: tool.id,
            name: key,
            label: schema.label || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            type: schema.type || 'string',
            required: schema.required || false,
            default_value: schema.default || '',
            description: schema.description || '',
            options: schema.enum ? schema.enum.join(',') : '',
            let_agent_decide: schema.allowAgentDecision || false
          })) : []
        }));

        setAgent({ 
          ...agentData, 
          tools: toolsWithInputs,
          knowledgeBases: knowledgeBases || []
        });
      } catch (error) {
        console.error('Error fetching agent data:', error);
        setAgent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();

    // Set up real-time subscriptions
    const agentSub = supabase
      .channel('agent_data')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agent_tools', filter: `agent_id=eq.${agentId}` },
        () => fetchAgent()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agent_knowledge_bases', filter: `agent_id=eq.${agentId}` },
        () => fetchAgent()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ai_agents', filter: `id=eq.${agentId}` },
        () => fetchAgent()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(agentSub);
    };
  }, [agentId]);

  return { agent, loading };
};

export const useToolTemplates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('tool_templates')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching tool templates:', error);
      } else {
        const templatesWithIcons = (data || []).map(template => ({
          ...template,
          icon: mapIconNameToComponent(template.icon_name)
        }));
        setTemplates(templatesWithIcons);
      }
      setLoading(false);
    };

    fetchTemplates();
  }, []);

  return { templates, loading };
};

export const useKnowledgeTemplates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('knowledge_base_templates')
        .select('*')
        .eq('is_public', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching knowledge templates:', error);
      } else {
        setTemplates(data || []);
      }
      setLoading(false);
    };

    fetchTemplates();
  }, []);

  return { templates, loading };
};