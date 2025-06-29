/*
  # Add Mock Data for Influence Flow

  1. Mock Data
    - Creates sample AI agents with tools and knowledge bases
    - Adds sample workflows and configurations
    - Provides realistic test data for development

  2. Security
    - All data respects existing RLS policies
    - Mock data is tied to specific user IDs for testing
*/

-- Insert mock data only if tables are empty
DO $$
DECLARE
  mock_user_id uuid;
  mock_workspace_id uuid;
  mock_agent_id uuid;
BEGIN
  -- Check if we already have data
  IF NOT EXISTS (SELECT 1 FROM ai_agents LIMIT 1) THEN
    
    -- Create a mock user ID (this would normally come from auth.users)
    mock_user_id := '550e8400-e29b-41d4-a716-446655440000';
    mock_workspace_id := '550e8400-e29b-41d4-a716-446655440010';
    
    -- Insert mock AI agent
    INSERT INTO ai_agents (
      id,
      user_id,
      workspace_id,
      name,
      description,
      purpose,
      status,
      system_prompt,
      temperature,
      top_p,
      model,
      output_mode,
      memory_enabled,
      memory_type,
      context_size,
      max_retries,
      fallback_response
    ) VALUES (
      '550e8400-e29b-41d4-a716-446655440003',
      mock_user_id,
      mock_workspace_id,
      'Content Assistant',
      'AI agent for content creation and optimization',
      'Help create engaging social media content',
      'active',
      'You are a helpful content creation assistant. You help users create engaging social media content, write compelling captions, and optimize their messaging for maximum engagement.',
      0.7,
      0.9,
      'gpt-4',
      'message',
      true,
      'vector_store',
      4000,
      3,
      'I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.'
    ) RETURNING id INTO mock_agent_id;

    -- Insert mock tools for the agent
    INSERT INTO agent_tools (agent_id, name, type, config, enabled) VALUES
    (mock_agent_id, 'Web Scraper', 'web_scraper', '{"timeout": 30000, "maxPages": 10, "respectRobots": true}', true),
    (mock_agent_id, 'Search Tool', 'search_tool', '{"engine": "google", "maxResults": 10, "safeSearch": true}', true),
    (mock_agent_id, 'Content Analyzer', 'data_extractor', '{"analysisType": "sentiment", "includeKeywords": true}', true);

    -- Insert mock knowledge bases
    INSERT INTO agent_knowledge_bases (agent_id, name, type, content, metadata, enabled) VALUES
    (mock_agent_id, 'Content Guidelines', 'text', 
     'Content Creation Guidelines:
     
     1. Always write engaging, authentic content
     2. Use clear, concise language
     3. Include relevant hashtags (3-5 per post)
     4. Add call-to-action when appropriate
     5. Maintain brand voice and tone
     6. Optimize for platform-specific best practices
     
     Instagram Best Practices:
     - Use high-quality visuals
     - Write compelling captions
     - Use Stories for behind-the-scenes content
     - Engage with comments promptly
     
     Email Best Practices:
     - Personalize subject lines
     - Keep content scannable
     - Include clear CTAs
     - Test send times for optimal engagement',
     '{"category": "guidelines", "version": "1.0", "lastUpdated": "2024-01-15"}', true),
    
    (mock_agent_id, 'Brand Voice Guide', 'text',
     'Brand Voice Guidelines:
     
     Tone: Friendly, professional, and approachable
     Style: Conversational yet informative
     Personality: Helpful, knowledgeable, and encouraging
     
     Do:
     - Use active voice
     - Be concise and clear
     - Show empathy and understanding
     - Provide actionable advice
     
     Avoid:
     - Jargon or overly technical terms
     - Negative or discouraging language
     - Generic or templated responses
     - Overly promotional content',
     '{"category": "brand", "version": "2.1", "approved": true}', true);

    -- Insert mock prompts
    INSERT INTO agent_prompts (agent_id, name, type, content, variables, enabled) VALUES
    (mock_agent_id, 'Content Creation Prompt', 'system',
     'You are a content creation expert. When users ask for help with content, follow these steps:
     1. Understand their goal and target audience
     2. Suggest content ideas that align with their brand
     3. Provide specific, actionable recommendations
     4. Include relevant hashtags and engagement strategies
     
     Always maintain a helpful, encouraging tone and provide practical advice.',
     '["goal", "audience", "platform", "brand"]', true),
    
    (mock_agent_id, 'Caption Generator', 'user',
     'Create an engaging {{platform}} caption for {{contentType}} about {{topic}}. 
     Target audience: {{audience}}
     Brand voice: {{brandVoice}}
     Include relevant hashtags and a call-to-action.',
     '["platform", "contentType", "topic", "audience", "brandVoice"]', true);

    -- Insert mock triggers
    INSERT INTO agent_triggers (agent_id, name, type, config, enabled) VALUES
    (mock_agent_id, 'Manual Trigger', 'manual', '{"description": "Manually triggered by user"}', true),
    (mock_agent_id, 'Content Request', 'message_step', '{"keywords": ["content", "caption", "post"], "priority": "high"}', true),
    (mock_agent_id, 'API Endpoint', 'api', '{"endpoint": "/api/content-assistant", "method": "POST"}', false);

    -- Insert mock escalations
    INSERT INTO agent_escalations (agent_id, name, condition_type, condition_config, action_type, action_config, enabled) VALUES
    (mock_agent_id, 'Error Fallback', 'error', '{"errorTypes": ["timeout", "api_error"]}', 'fallback_response', '{"message": "I encountered an error. Let me try a different approach."}', true),
    (mock_agent_id, 'Low Confidence', 'confidence_low', '{"threshold": 0.6}', 'human_handoff', '{"department": "content_team", "priority": "medium"}', true);

    -- Insert mock variables
    INSERT INTO agent_variables (agent_id, name, type, value, description) VALUES
    (mock_agent_id, 'defaultHashtagCount', 'number', '5', 'Default number of hashtags to include in posts'),
    (mock_agent_id, 'brandColors', 'array', '["#6366f1", "#8b5cf6", "#06b6d4"]', 'Brand color palette for design suggestions'),
    (mock_agent_id, 'contentCategories', 'array', '["educational", "promotional", "behind-the-scenes", "user-generated"]', 'Available content categories'),
    (mock_agent_id, 'autoApprove', 'boolean', 'false', 'Whether to auto-approve generated content');

    -- Insert mock metadata
    INSERT INTO agent_metadata (agent_id, key, value) VALUES
    (mock_agent_id, 'version', '"1.2.0"'),
    (mock_agent_id, 'lastTrained', '"2024-01-15T10:30:00Z"'),
    (mock_agent_id, 'performance', '{"accuracy": 0.92, "responseTime": 1.2, "userSatisfaction": 4.6}'),
    (mock_agent_id, 'usage', '{"totalRequests": 1247, "successRate": 0.96, "avgResponseTime": 1.1}');

    -- Create a second mock agent for variety
    INSERT INTO ai_agents (
      id,
      user_id,
      workspace_id,
      name,
      description,
      purpose,
      status,
      system_prompt,
      temperature,
      top_p,
      model,
      output_mode,
      memory_enabled,
      memory_type,
      context_size,
      max_retries,
      fallback_response
    ) VALUES (
      '550e8400-e29b-41d4-a716-446655440004',
      mock_user_id,
      mock_workspace_id,
      'Customer Support Bot',
      'AI agent for handling customer inquiries and support',
      'Provide helpful customer support and resolve common issues',
      'draft',
      'You are a helpful customer support assistant. You help users with their questions, resolve issues, and provide information about products and services.',
      0.5,
      0.8,
      'gpt-3.5-turbo',
      'message',
      true,
      'supabase',
      2000,
      2,
      'I apologize for any inconvenience. Please contact our human support team for further assistance.'
    );

  END IF;
END $$;