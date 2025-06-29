import { supabase } from './supabase';

// Helper function to validate UUID format
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const addKnowledgeItemToDB = async (agentId: string, item: any) => {
  const { data, error } = await supabase
    .from('agent_knowledge_bases')
    .insert({
      agent_id: agentId,
      name: item.name,
      type: item.type || 'text',
      content: item.content || '',
      metadata: item.metadata || {},
      enabled: item.enabled !== false,
      ...item
    })
    .select()
    .single();

  return { data, error };
};

export const removeKnowledgeItemFromDB = async (id: string) => {
  const { error } = await supabase
    .from('agent_knowledge_bases')
    .delete()
    .eq('id', id);

  return { error };
};

export const updateKnowledgeItemInDB = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('agent_knowledge_bases')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

export const addToolToDB = async (agentId: string, templateId: string) => {
  // Validate that templateId is a valid UUID
  if (!isValidUUID(templateId)) {
    return { 
      data: null, 
      error: { 
        message: `Invalid template ID format: '${templateId}'. Expected a valid UUID.`,
        code: 'INVALID_UUID'
      } 
    };
  }

  // First get the template
  const { data: template, error: templateError } = await supabase
    .from('tool_templates')
    .select('*')
    .eq('id', templateId)
    .single();

  if (templateError) return { data: null, error: templateError };

  // Create the tool from template
  const { data, error } = await supabase
    .from('agent_tools')
    .insert({
      agent_id: agentId,
      name: template.name,
      type: template.type,
      config: template.default_config || {},
      tool_template_id: templateId,
      enabled: true
    })
    .select()
    .single();

  return { data, error };
};

export const removeToolFromDB = async (id: string) => {
  const { error } = await supabase
    .from('agent_tools')
    .delete()
    .eq('id', id);

  return { error };
};

export const updateToolInDB = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('agent_tools')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

export const createAgentFromTemplate = async (userId: string, workspaceId: string, template: any) => {
  const { data, error } = await supabase
    .from('ai_agents')
    .insert({
      user_id: userId,
      workspace_id: workspaceId,
      name: template.name || 'New Agent',
      description: template.description || '',
      purpose: template.purpose || '',
      system_prompt: template.system_prompt || '',
      temperature: template.temperature || 0.7,
      top_p: template.top_p || 0.9,
      model: template.model || 'gpt-4',
      output_mode: template.output_mode || 'message',
      memory_enabled: template.memory_enabled || false,
      memory_type: template.memory_type || 'vector_store',
      context_size: template.context_size || 4000,
      max_retries: template.max_retries || 3,
      fallback_response: template.fallback_response || ''
    })
    .select()
    .single();

  return { data, error };
};