/*
  # AI Agents Schema Migration

  1. New Tables
    - `ai_agents` - Core AI agent configuration
    - `agent_knowledge_bases` - Knowledge sources for agents
    - `agent_tools` - Tools available to agents
    - `agent_prompts` - Custom prompts for agents
    - `agent_triggers` - Trigger configurations
    - `agent_escalations` - Escalation rules
    - `agent_variables` - Agent variables
    - `agent_metadata` - Additional metadata

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own agents
    - Users can only access agents they own

  3. Performance
    - Add indexes for common queries
    - Add triggers for updated_at timestamps
*/

-- AI Agents table
CREATE TABLE IF NOT EXISTS ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  purpose text DEFAULT '',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  
  -- Chat Settings
  system_prompt text DEFAULT '',
  temperature numeric(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  top_p numeric(3,2) DEFAULT 0.9 CHECK (top_p >= 0 AND top_p <= 1),
  model text DEFAULT 'gpt-4',
  output_mode text DEFAULT 'message' CHECK (output_mode IN ('message', 'api_payload', 'internal_variable')),
  
  -- Memory Settings
  memory_enabled boolean DEFAULT false,
  memory_type text DEFAULT 'vector_store' CHECK (memory_type IN ('vector_store', 'supabase', 'redis')),
  context_size integer DEFAULT 4000,
  
  -- Execution Settings
  max_retries integer DEFAULT 3,
  fallback_response text DEFAULT '',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agent Knowledge Bases
CREATE TABLE IF NOT EXISTS agent_knowledge_bases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'document', 'url', 'database')),
  content text,
  metadata jsonb DEFAULT '{}',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agent Tools
CREATE TABLE IF NOT EXISTS agent_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('web_scraper', 'search_tool', 'api_call', 'data_extractor', 'code_interpreter', 'custom')),
  config jsonb DEFAULT '{}',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agent Prompts
CREATE TABLE IF NOT EXISTS agent_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('system', 'user', 'assistant', 'custom')),
  content text NOT NULL,
  variables jsonb DEFAULT '[]',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agent Triggers
CREATE TABLE IF NOT EXISTS agent_triggers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('manual', 'message_step', 'api', 'webhook', 'schedule', 'event')),
  config jsonb DEFAULT '{}',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agent Escalations
CREATE TABLE IF NOT EXISTS agent_escalations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  name text NOT NULL,
  condition_type text NOT NULL CHECK (condition_type IN ('error', 'timeout', 'confidence_low', 'keyword', 'custom')),
  condition_config jsonb DEFAULT '{}',
  action_type text NOT NULL CHECK (action_type IN ('human_handoff', 'fallback_response', 'retry', 'escalate_agent')),
  action_config jsonb DEFAULT '{}',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agent Variables
CREATE TABLE IF NOT EXISTS agent_variables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'array', 'object')),
  value jsonb,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(agent_id, name)
);

-- Agent Metadata
CREATE TABLE IF NOT EXISTS agent_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  key text NOT NULL,
  value jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(agent_id, key)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_agents_user_id ON ai_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_workspace_id ON ai_agents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_agent_knowledge_bases_agent_id ON agent_knowledge_bases(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_tools_agent_id ON agent_tools(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_prompts_agent_id ON agent_prompts(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_triggers_agent_id ON agent_triggers(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_escalations_agent_id ON agent_escalations(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_variables_agent_id ON agent_variables(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_metadata_agent_id ON agent_metadata(agent_id);

-- Enable RLS
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_agents
CREATE POLICY "Users can manage their own agents"
  ON ai_agents
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for agent_knowledge_bases
CREATE POLICY "Users can manage knowledge for their agents"
  ON agent_knowledge_bases
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_knowledge_bases.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_knowledge_bases.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  );

-- RLS Policies for agent_tools
CREATE POLICY "Users can manage tools for their agents"
  ON agent_tools
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_tools.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_tools.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  );

-- RLS Policies for agent_prompts
CREATE POLICY "Users can manage prompts for their agents"
  ON agent_prompts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_prompts.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_prompts.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  );

-- RLS Policies for agent_triggers
CREATE POLICY "Users can manage triggers for their agents"
  ON agent_triggers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_triggers.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_triggers.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  );

-- RLS Policies for agent_escalations
CREATE POLICY "Users can manage escalations for their agents"
  ON agent_escalations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_escalations.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_escalations.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  );

-- RLS Policies for agent_variables
CREATE POLICY "Users can manage variables for their agents"
  ON agent_variables
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_variables.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_variables.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  );

-- RLS Policies for agent_metadata
CREATE POLICY "Users can manage metadata for their agents"
  ON agent_metadata
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_metadata.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_agents 
      WHERE ai_agents.id = agent_metadata.agent_id 
      AND ai_agents.user_id = auth.uid()
    )
  );

-- Triggers for updated_at (reuse existing function if it exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $func$ language 'plpgsql';
  END IF;
END $$;

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ai_agents_updated_at') THEN
    CREATE TRIGGER update_ai_agents_updated_at 
      BEFORE UPDATE ON ai_agents 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_agent_knowledge_bases_updated_at') THEN
    CREATE TRIGGER update_agent_knowledge_bases_updated_at 
      BEFORE UPDATE ON agent_knowledge_bases 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_agent_tools_updated_at') THEN
    CREATE TRIGGER update_agent_tools_updated_at 
      BEFORE UPDATE ON agent_tools 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_agent_prompts_updated_at') THEN
    CREATE TRIGGER update_agent_prompts_updated_at 
      BEFORE UPDATE ON agent_prompts 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_agent_triggers_updated_at') THEN
    CREATE TRIGGER update_agent_triggers_updated_at 
      BEFORE UPDATE ON agent_triggers 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_agent_escalations_updated_at') THEN
    CREATE TRIGGER update_agent_escalations_updated_at 
      BEFORE UPDATE ON agent_escalations 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_agent_variables_updated_at') THEN
    CREATE TRIGGER update_agent_variables_updated_at 
      BEFORE UPDATE ON agent_variables 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_agent_metadata_updated_at') THEN
    CREATE TRIGGER update_agent_metadata_updated_at 
      BEFORE UPDATE ON agent_metadata 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;