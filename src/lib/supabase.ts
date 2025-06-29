import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DatabaseAgent {
  id: string;
  user_id: string;
  workspace_id?: string;
  name: string;
  description: string;
  purpose: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  system_prompt: string;
  temperature: number;
  top_p: number;
  model: string;
  output_mode: 'message' | 'api_payload' | 'internal_variable';
  memory_enabled: boolean;
  memory_type: 'vector_store' | 'supabase' | 'redis';
  context_size: number;
  max_retries: number;
  fallback_response: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseKnowledgeBase {
  id: string;
  agent_id: string;
  name: string;
  type: 'text' | 'document' | 'url' | 'database';
  content?: string;
  metadata: Record<string, any>;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTool {
  id: string;
  agent_id: string;
  name: string;
  type: 'web_scraper' | 'search_tool' | 'api_call' | 'data_extractor' | 'code_interpreter' | 'custom';
  config: Record<string, any>;
  enabled: boolean;
  tool_template_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabasePrompt {
  id: string;
  agent_id: string;
  name: string;
  type: 'system' | 'user' | 'assistant' | 'custom';
  content: string;
  variables: string[];
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTrigger {
  id: string;
  agent_id: string;
  name: string;
  type: 'manual' | 'message_step' | 'api' | 'webhook' | 'schedule' | 'event';
  config: Record<string, any>;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseEscalation {
  id: string;
  agent_id: string;
  name: string;
  condition_type: 'error' | 'timeout' | 'confidence_low' | 'keyword' | 'custom';
  condition_config: Record<string, any>;
  action_type: 'human_handoff' | 'fallback_response' | 'retry' | 'escalate_agent';
  action_config: Record<string, any>;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseVariable {
  id: string;
  agent_id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  value: any;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseMetadata {
  id: string;
  agent_id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}