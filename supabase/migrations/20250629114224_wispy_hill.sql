/*
  # Add tool template relationship to agent_tools

  1. Schema Changes
    - Add `tool_template_id` column to `agent_tools` table
    - Create foreign key constraint to `tool_templates` table
    - Update existing records to maintain data integrity

  2. Security
    - No changes to RLS policies needed as they inherit from existing table policies
*/

-- Add tool_template_id column to agent_tools table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agent_tools' AND column_name = 'tool_template_id'
  ) THEN
    ALTER TABLE agent_tools ADD COLUMN tool_template_id uuid;
  END IF;
END $$;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'agent_tools_tool_template_id_fkey'
  ) THEN
    ALTER TABLE agent_tools 
    ADD CONSTRAINT agent_tools_tool_template_id_fkey 
    FOREIGN KEY (tool_template_id) REFERENCES tool_templates(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_agent_tools_tool_template_id 
ON agent_tools(tool_template_id);