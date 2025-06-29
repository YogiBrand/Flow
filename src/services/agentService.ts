import { supabase } from '../lib/supabase';
import type { 
  DatabaseAgent, 
  DatabaseKnowledgeBase, 
  DatabaseTool, 
  DatabasePrompt,
  DatabaseTrigger,
  DatabaseEscalation,
  DatabaseVariable,
  DatabaseMetadata
} from '../lib/supabase';

export class AgentService {
  // Agent CRUD operations
  static async createAgent(agentData: Partial<DatabaseAgent>): Promise<DatabaseAgent> {
    const { data, error } = await supabase
      .from('ai_agents')
      .insert([agentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAgent(agentId: string, updates: Partial<DatabaseAgent>): Promise<DatabaseAgent> {
    const { data, error } = await supabase
      .from('ai_agents')
      .update(updates)
      .eq('id', agentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAgent(agentId: string): Promise<DatabaseAgent | null> {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getUserAgents(userId: string): Promise<DatabaseAgent[]> {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deleteAgent(agentId: string): Promise<void> {
    const { error } = await supabase
      .from('ai_agents')
      .delete()
      .eq('id', agentId);

    if (error) throw error;
  }

  // Knowledge Base operations
  static async createKnowledgeBase(knowledgeData: Partial<DatabaseKnowledgeBase>): Promise<DatabaseKnowledgeBase> {
    const { data, error } = await supabase
      .from('agent_knowledge_bases')
      .insert([knowledgeData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateKnowledgeBase(knowledgeId: string, updates: Partial<DatabaseKnowledgeBase>): Promise<DatabaseKnowledgeBase> {
    const { data, error } = await supabase
      .from('agent_knowledge_bases')
      .update(updates)
      .eq('id', knowledgeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAgentKnowledgeBases(agentId: string): Promise<DatabaseKnowledgeBase[]> {
    const { data, error } = await supabase
      .from('agent_knowledge_bases')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deleteKnowledgeBase(knowledgeId: string): Promise<void> {
    const { error } = await supabase
      .from('agent_knowledge_bases')
      .delete()
      .eq('id', knowledgeId);

    if (error) throw error;
  }

  // Tools operations
  static async createTool(toolData: Partial<DatabaseTool>): Promise<DatabaseTool> {
    const { data, error } = await supabase
      .from('agent_tools')
      .insert([toolData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTool(toolId: string, updates: Partial<DatabaseTool>): Promise<DatabaseTool> {
    const { data, error } = await supabase
      .from('agent_tools')
      .update(updates)
      .eq('id', toolId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAgentTools(agentId: string): Promise<DatabaseTool[]> {
    const { data, error } = await supabase
      .from('agent_tools')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deleteTool(toolId: string): Promise<void> {
    const { error } = await supabase
      .from('agent_tools')
      .delete()
      .eq('id', toolId);

    if (error) throw error;
  }

  // Prompts operations
  static async createPrompt(promptData: Partial<DatabasePrompt>): Promise<DatabasePrompt> {
    const { data, error } = await supabase
      .from('agent_prompts')
      .insert([promptData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePrompt(promptId: string, updates: Partial<DatabasePrompt>): Promise<DatabasePrompt> {
    const { data, error } = await supabase
      .from('agent_prompts')
      .update(updates)
      .eq('id', promptId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAgentPrompts(agentId: string): Promise<DatabasePrompt[]> {
    const { data, error } = await supabase
      .from('agent_prompts')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deletePrompt(promptId: string): Promise<void> {
    const { error } = await supabase
      .from('agent_prompts')
      .delete()
      .eq('id', promptId);

    if (error) throw error;
  }

  // Triggers operations
  static async createTrigger(triggerData: Partial<DatabaseTrigger>): Promise<DatabaseTrigger> {
    const { data, error } = await supabase
      .from('agent_triggers')
      .insert([triggerData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTrigger(triggerId: string, updates: Partial<DatabaseTrigger>): Promise<DatabaseTrigger> {
    const { data, error } = await supabase
      .from('agent_triggers')
      .update(updates)
      .eq('id', triggerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAgentTriggers(agentId: string): Promise<DatabaseTrigger[]> {
    const { data, error } = await supabase
      .from('agent_triggers')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deleteTrigger(triggerId: string): Promise<void> {
    const { error } = await supabase
      .from('agent_triggers')
      .delete()
      .eq('id', triggerId);

    if (error) throw error;
  }

  // Escalations operations
  static async createEscalation(escalationData: Partial<DatabaseEscalation>): Promise<DatabaseEscalation> {
    const { data, error } = await supabase
      .from('agent_escalations')
      .insert([escalationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateEscalation(escalationId: string, updates: Partial<DatabaseEscalation>): Promise<DatabaseEscalation> {
    const { data, error } = await supabase
      .from('agent_escalations')
      .update(updates)
      .eq('id', escalationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAgentEscalations(agentId: string): Promise<DatabaseEscalation[]> {
    const { data, error } = await supabase
      .from('agent_escalations')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deleteEscalation(escalationId: string): Promise<void> {
    const { error } = await supabase
      .from('agent_escalations')
      .delete()
      .eq('id', escalationId);

    if (error) throw error;
  }

  // Variables operations
  static async createVariable(variableData: Partial<DatabaseVariable>): Promise<DatabaseVariable> {
    const { data, error } = await supabase
      .from('agent_variables')
      .insert([variableData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateVariable(variableId: string, updates: Partial<DatabaseVariable>): Promise<DatabaseVariable> {
    const { data, error } = await supabase
      .from('agent_variables')
      .update(updates)
      .eq('id', variableId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAgentVariables(agentId: string): Promise<DatabaseVariable[]> {
    const { data, error } = await supabase
      .from('agent_variables')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deleteVariable(variableId: string): Promise<void> {
    const { error } = await supabase
      .from('agent_variables')
      .delete()
      .eq('id', variableId);

    if (error) throw error;
  }

  // Metadata operations
  static async setMetadata(agentId: string, key: string, value: any): Promise<DatabaseMetadata> {
    const { data, error } = await supabase
      .from('agent_metadata')
      .upsert([{ agent_id: agentId, key, value }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAgentMetadata(agentId: string): Promise<DatabaseMetadata[]> {
    const { data, error } = await supabase
      .from('agent_metadata')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deleteMetadata(agentId: string, key: string): Promise<void> {
    const { error } = await supabase
      .from('agent_metadata')
      .delete()
      .eq('agent_id', agentId)
      .eq('key', key);

    if (error) throw error;
  }

  // Comprehensive agent data operations
  static async getFullAgentData(agentId: string) {
    const [agent, knowledgeBases, tools, prompts, triggers, escalations, variables, metadata] = await Promise.all([
      this.getAgent(agentId),
      this.getAgentKnowledgeBases(agentId),
      this.getAgentTools(agentId),
      this.getAgentPrompts(agentId),
      this.getAgentTriggers(agentId),
      this.getAgentEscalations(agentId),
      this.getAgentVariables(agentId),
      this.getAgentMetadata(agentId)
    ]);

    return {
      agent,
      knowledgeBases,
      tools,
      prompts,
      triggers,
      escalations,
      variables,
      metadata
    };
  }
}