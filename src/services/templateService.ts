import { supabase } from '../lib/supabase';

export interface ToolTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  icon_name: string;
  category: string;
  input_schema: any;
  output_schema: any;
  default_config: any;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlatformTemplate {
  id: string;
  name: string;
  platform_key: string;
  description: string;
  icon_emoji: string;
  api_base_url?: string;
  auth_type?: string;
  rate_limits: any;
  supported_features: string[];
  configuration_schema: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBaseTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  content_type: string;
  content: string;
  metadata: any;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResourceTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  content: string;
  category: string;
  metadata: any;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export class TemplateService {
  // Tool Templates
  static async getToolTemplates(): Promise<ToolTemplate[]> {
    const { data, error } = await supabase
      .from('tool_templates')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getToolTemplatesByCategory(category: string): Promise<ToolTemplate[]> {
    const { data, error } = await supabase
      .from('tool_templates')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getToolTemplatesByType(type: string): Promise<ToolTemplate[]> {
    const { data, error } = await supabase
      .from('tool_templates')
      .select('*')
      .eq('type', type)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Platform Templates
  static async getPlatformTemplates(): Promise<PlatformTemplate[]> {
    const { data, error } = await supabase
      .from('platform_templates')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getPlatformTemplate(platformKey: string): Promise<PlatformTemplate | null> {
    const { data, error } = await supabase
      .from('platform_templates')
      .select('*')
      .eq('platform_key', platformKey)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // Knowledge Base Templates
  static async getKnowledgeBaseTemplates(): Promise<KnowledgeBaseTemplate[]> {
    const { data, error } = await supabase
      .from('knowledge_base_templates')
      .select('*')
      .eq('is_public', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getKnowledgeBaseTemplatesByCategory(category: string): Promise<KnowledgeBaseTemplate[]> {
    const { data, error } = await supabase
      .from('knowledge_base_templates')
      .select('*')
      .eq('category', category)
      .eq('is_public', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async searchKnowledgeBaseTemplates(query: string): Promise<KnowledgeBaseTemplate[]> {
    const { data, error } = await supabase
      .from('knowledge_base_templates')
      .select('*')
      .eq('is_public', true)
      .or(`name.ilike.%${query}%, description.ilike.%${query}%, tags.cs.{${query}}`)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Resource Templates
  static async getResourceTemplates(): Promise<ResourceTemplate[]> {
    const { data, error } = await supabase
      .from('resource_templates')
      .select('*')
      .eq('is_public', true)
      .order('type', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getResourceTemplatesByType(type: string): Promise<ResourceTemplate[]> {
    const { data, error } = await supabase
      .from('resource_templates')
      .select('*')
      .eq('type', type)
      .eq('is_public', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getResourceTemplatesByCategory(category: string): Promise<ResourceTemplate[]> {
    const { data, error } = await supabase
      .from('resource_templates')
      .select('*')
      .eq('category', category)
      .eq('is_public', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Utility methods
  static async getToolCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('tool_templates')
      .select('category')
      .order('category', { ascending: true });

    if (error) throw error;
    
    const categories = [...new Set(data?.map(item => item.category) || [])];
    return categories;
  }

  static async getKnowledgeBaseCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('knowledge_base_templates')
      .select('category')
      .eq('is_public', true)
      .order('category', { ascending: true });

    if (error) throw error;
    
    const categories = [...new Set(data?.map(item => item.category) || [])];
    return categories;
  }

  static async getResourceCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('resource_templates')
      .select('category')
      .eq('is_public', true)
      .order('category', { ascending: true });

    if (error) throw error;
    
    const categories = [...new Set(data?.map(item => item.category) || [])];
    return categories;
  }

  // Create instances from templates
  static async createAgentToolFromTemplate(agentId: string, templateId: string): Promise<any> {
    // Get the template
    const { data: template, error: templateError } = await supabase
      .from('tool_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError) throw templateError;

    // Create the agent tool
    const { data, error } = await supabase
      .from('agent_tools')
      .insert({
        agent_id: agentId,
        name: template.name,
        type: template.type,
        config: template.default_config,
        enabled: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createAgentKnowledgeFromTemplate(agentId: string, templateId: string): Promise<any> {
    // Get the template
    const { data: template, error: templateError } = await supabase
      .from('knowledge_base_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError) throw templateError;

    // Create the agent knowledge base
    const { data, error } = await supabase
      .from('agent_knowledge_bases')
      .insert({
        agent_id: agentId,
        name: template.name,
        type: template.content_type,
        content: template.content,
        metadata: template.metadata,
        enabled: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}