-- Tool Templates Table (defines available tools)
CREATE TABLE IF NOT EXISTS tool_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('web_scraper', 'search_tool', 'api_call', 'data_extractor', 'code_interpreter', 'custom')),
  description text NOT NULL,
  icon_name text DEFAULT 'tool',
  category text DEFAULT 'general',
  input_schema jsonb DEFAULT '{}',
  output_schema jsonb DEFAULT '{}',
  default_config jsonb DEFAULT '{}',
  is_system boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Platform Templates Table (defines social media platforms)
CREATE TABLE IF NOT EXISTS platform_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  platform_key text UNIQUE NOT NULL,
  description text NOT NULL,
  icon_emoji text DEFAULT '📱',
  api_base_url text,
  auth_type text CHECK (auth_type IN ('oauth', 'api_key', 'bearer_token')),
  rate_limits jsonb DEFAULT '{}',
  supported_features jsonb DEFAULT '[]',
  configuration_schema jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Knowledge Base Templates Table (pre-built knowledge bases)
CREATE TABLE IF NOT EXISTS knowledge_base_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  content_type text CHECK (content_type IN ('text', 'document', 'url', 'structured_data')),
  content text,
  metadata jsonb DEFAULT '{}',
  tags text[] DEFAULT ARRAY[]::text[],
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resource Templates Table (reusable content and templates)
CREATE TABLE IF NOT EXISTS resource_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('content_template', 'brand_guide', 'style_guide', 'prompt_template', 'workflow_template')),
  description text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general',
  metadata jsonb DEFAULT '{}',
  tags text[] DEFAULT ARRAY[]::text[],
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tool_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read access for templates) - Check if they exist first
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tool_templates' AND policyname = 'Anyone can read tool templates'
    ) THEN
        CREATE POLICY "Anyone can read tool templates" ON tool_templates FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'platform_templates' AND policyname = 'Anyone can read platform templates'
    ) THEN
        CREATE POLICY "Anyone can read platform templates" ON platform_templates FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'knowledge_base_templates' AND policyname = 'Anyone can read public knowledge base templates'
    ) THEN
        CREATE POLICY "Anyone can read public knowledge base templates" ON knowledge_base_templates FOR SELECT TO authenticated USING (is_public = true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'resource_templates' AND policyname = 'Anyone can read public resource templates'
    ) THEN
        CREATE POLICY "Anyone can read public resource templates" ON resource_templates FOR SELECT TO authenticated USING (is_public = true);
    END IF;
END
$$;

-- Insert Tool Templates (only if they don't exist)
DO $$
BEGIN
    -- Web Scraping Tools
    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Web Scraper') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Web Scraper', 
            'web_scraper', 
            'Extract data from web pages with advanced parsing capabilities', 
            'globe', 
            'data_extraction',
            '{"url": {"type": "string", "required": true}, "selectors": {"type": "object", "required": false}, "wait_time": {"type": "number", "default": 3000}}'::jsonb,
            '{"content": {"type": "string"}, "metadata": {"type": "object"}, "links": {"type": "array"}}'::jsonb,
            '{"timeout": 30000, "maxPages": 10, "respectRobots": true, "userAgent": "InfluenceFlow Bot 1.0"}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Lead Enrichment Tool') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Lead Enrichment Tool', 
            'web_scraper', 
            'Enrich lead data by scraping social profiles and company information', 
            'users', 
            'lead_generation',
            '{"email": {"type": "string", "required": true}, "company": {"type": "string", "required": false}, "social_profiles": {"type": "array", "required": false}}'::jsonb,
            '{"enriched_data": {"type": "object"}, "social_links": {"type": "array"}, "company_info": {"type": "object"}, "confidence_score": {"type": "number"}}'::jsonb,
            '{"sources": ["linkedin", "twitter", "company_website"], "timeout": 45000, "includePhotos": true}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Content Scraper') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Content Scraper', 
            'web_scraper', 
            'Scrape and analyze content from competitor websites and social media', 
            'file-text', 
            'content_analysis',
            '{"urls": {"type": "array", "required": true}, "content_types": {"type": "array", "default": ["text", "images"]}}'::jsonb,
            '{"content": {"type": "array"}, "sentiment": {"type": "string"}, "keywords": {"type": "array"}, "engagement_metrics": {"type": "object"}}'::jsonb,
            '{"extractImages": true, "analyzeSentiment": true, "extractHashtags": true}'::jsonb
        );
    END IF;

    -- Search Tools
    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Google Search Tool') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Google Search Tool', 
            'search_tool', 
            'Search Google for information with advanced filtering options', 
            'search', 
            'research',
            '{"query": {"type": "string", "required": true}, "num_results": {"type": "number", "default": 10}, "date_range": {"type": "string", "required": false}}'::jsonb,
            '{"results": {"type": "array"}, "total_results": {"type": "number"}, "search_time": {"type": "number"}}'::jsonb,
            '{"engine": "google", "maxResults": 10, "safeSearch": true, "includeSnippets": true}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Social Media Search') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Social Media Search', 
            'search_tool', 
            'Search across multiple social media platforms for mentions and trends', 
            'hash', 
            'social_monitoring',
            '{"keywords": {"type": "array", "required": true}, "platforms": {"type": "array", "default": ["twitter", "instagram"]}, "sentiment": {"type": "string", "required": false}}'::jsonb,
            '{"mentions": {"type": "array"}, "sentiment_analysis": {"type": "object"}, "trending_topics": {"type": "array"}}'::jsonb,
            '{"platforms": ["twitter", "instagram", "tiktok"], "realTime": true, "includeSentiment": true}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Competitor Research Tool') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Competitor Research Tool', 
            'search_tool', 
            'Research competitors and analyze their online presence', 
            'target', 
            'competitive_analysis',
            '{"competitor_name": {"type": "string", "required": true}, "industry": {"type": "string", "required": false}, "analysis_depth": {"type": "string", "default": "standard"}}'::jsonb,
            '{"company_info": {"type": "object"}, "social_presence": {"type": "object"}, "content_strategy": {"type": "object"}, "strengths_weaknesses": {"type": "object"}}'::jsonb,
            '{"includeFinancials": false, "analyzeSocialMedia": true, "contentAnalysis": true}'::jsonb
        );
    END IF;

    -- API Tools
    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'CRM Integration') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'CRM Integration', 
            'api_call', 
            'Integrate with popular CRM systems to sync lead and customer data', 
            'database', 
            'integration',
            '{"crm_type": {"type": "string", "required": true}, "action": {"type": "string", "required": true}, "data": {"type": "object", "required": true}}'::jsonb,
            '{"success": {"type": "boolean"}, "record_id": {"type": "string"}, "updated_fields": {"type": "array"}}'::jsonb,
            '{"supportedCRMs": ["salesforce", "hubspot", "pipedrive"], "timeout": 15000, "retryAttempts": 3}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Email Marketing API') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Email Marketing API', 
            'api_call', 
            'Connect with email marketing platforms for campaign management', 
            'mail', 
            'marketing',
            '{"platform": {"type": "string", "required": true}, "action": {"type": "string", "required": true}, "campaign_data": {"type": "object"}}'::jsonb,
            '{"campaign_id": {"type": "string"}, "status": {"type": "string"}, "metrics": {"type": "object"}}'::jsonb,
            '{"supportedPlatforms": ["mailchimp", "sendgrid", "constant_contact"], "includeAnalytics": true}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Social Media API') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Social Media API', 
            'api_call', 
            'Post and manage content across multiple social media platforms', 
            'share-2', 
            'social_media',
            '{"platform": {"type": "string", "required": true}, "content": {"type": "object", "required": true}, "schedule_time": {"type": "string", "required": false}}'::jsonb,
            '{"post_id": {"type": "string"}, "status": {"type": "string"}, "engagement": {"type": "object"}}'::jsonb,
            '{"supportedPlatforms": ["instagram", "twitter", "facebook", "linkedin"], "autoHashtags": true}'::jsonb
        );
    END IF;

    -- Data Extraction Tools
    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Contact Extractor') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Contact Extractor', 
            'data_extractor', 
            'Extract contact information from various sources and formats', 
            'contact', 
            'lead_generation',
            '{"source": {"type": "string", "required": true}, "format": {"type": "string", "default": "auto"}}'::jsonb,
            '{"contacts": {"type": "array"}, "confidence_scores": {"type": "array"}, "duplicates_removed": {"type": "number"}}'::jsonb,
            '{"extractEmails": true, "extractPhones": true, "extractSocialProfiles": true, "deduplication": true}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Content Analyzer') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Content Analyzer', 
            'data_extractor', 
            'Analyze content for sentiment, keywords, and engagement potential', 
            'bar-chart-3', 
            'content_analysis',
            '{"content": {"type": "string", "required": true}, "analysis_type": {"type": "array", "default": ["sentiment", "keywords"]}}'::jsonb,
            '{"sentiment": {"type": "object"}, "keywords": {"type": "array"}, "readability": {"type": "object"}, "engagement_score": {"type": "number"}}'::jsonb,
            '{"analysisTypes": ["sentiment", "keywords", "readability", "engagement"], "includeRecommendations": true}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Trend Analyzer') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Trend Analyzer', 
            'data_extractor', 
            'Analyze trends and patterns in social media data and content', 
            'trending-up', 
            'analytics',
            '{"data_source": {"type": "string", "required": true}, "time_period": {"type": "string", "default": "30d"}, "metrics": {"type": "array"}}'::jsonb,
            '{"trends": {"type": "array"}, "growth_rate": {"type": "number"}, "predictions": {"type": "object"}, "recommendations": {"type": "array"}}'::jsonb,
            '{"timePeriods": ["7d", "30d", "90d"], "includeForecasting": true, "confidenceThreshold": 0.8}'::jsonb
        );
    END IF;

    -- Code Interpreter Tools
    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Data Processor') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Data Processor', 
            'code_interpreter', 
            'Process and analyze large datasets with Python and pandas', 
            'code', 
            'data_processing',
            '{"data": {"type": "object", "required": true}, "operations": {"type": "array", "required": true}}'::jsonb,
            '{"processed_data": {"type": "object"}, "statistics": {"type": "object"}, "visualizations": {"type": "array"}}'::jsonb,
            '{"allowedLibraries": ["pandas", "numpy", "matplotlib", "seaborn"], "maxExecutionTime": 60}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM tool_templates WHERE name = 'Report Generator') THEN
        INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config)
        VALUES (
            'Report Generator', 
            'code_interpreter', 
            'Generate comprehensive reports and visualizations from data', 
            'file-bar-chart', 
            'reporting',
            '{"data": {"type": "object", "required": true}, "report_type": {"type": "string", "required": true}, "template": {"type": "string", "required": false}}'::jsonb,
            '{"report_url": {"type": "string"}, "charts": {"type": "array"}, "summary": {"type": "object"}}'::jsonb,
            '{"outputFormats": ["pdf", "html", "excel"], "includeCharts": true, "autoInsights": true}'::jsonb
        );
    END IF;
END
$$;

-- Insert Platform Templates (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM platform_templates WHERE platform_key = 'instagram_platform') THEN
        INSERT INTO platform_templates (name, platform_key, description, icon_emoji, api_base_url, auth_type, rate_limits, supported_features, configuration_schema)
        VALUES (
            'Instagram', 
            'instagram_platform', 
            'Connect and manage Instagram business accounts for content posting and analytics', 
            '📷', 
            'https://graph.facebook.com/v18.0', 
            'oauth',
            '{"posts_per_hour": 25, "api_calls_per_hour": 200}'::jsonb,
            '["post_content", "stories", "reels", "analytics", "comments", "direct_messages"]'::jsonb,
            '{"required_scopes": ["instagram_basic", "instagram_content_publish"], "webhook_events": ["comments", "mentions"]}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM platform_templates WHERE platform_key = 'twitter') THEN
        INSERT INTO platform_templates (name, platform_key, description, icon_emoji, api_base_url, auth_type, rate_limits, supported_features, configuration_schema)
        VALUES (
            'Twitter/X', 
            'twitter', 
            'Manage Twitter accounts for posting, engagement, and social listening', 
            '🐦', 
            'https://api.twitter.com/2', 
            'bearer_token',
            '{"tweets_per_hour": 300, "api_calls_per_hour": 500}'::jsonb,
            '["post_tweets", "threads", "analytics", "mentions", "direct_messages", "spaces"]'::jsonb,
            '{"required_permissions": ["read", "write"], "webhook_events": ["tweets", "mentions", "follows"]}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM platform_templates WHERE platform_key = 'facebook') THEN
        INSERT INTO platform_templates (name, platform_key, description, icon_emoji, api_base_url, auth_type, rate_limits, supported_features, configuration_schema)
        VALUES (
            'Facebook', 
            'facebook', 
            'Manage Facebook pages and groups for business marketing', 
            '📘', 
            'https://graph.facebook.com/v18.0', 
            'oauth',
            '{"posts_per_hour": 25, "api_calls_per_hour": 200}'::jsonb,
            '["post_content", "stories", "events", "analytics", "comments", "messenger"]'::jsonb,
            '{"required_scopes": ["pages_manage_posts", "pages_read_engagement"], "webhook_events": ["feed", "comments"]}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM platform_templates WHERE platform_key = 'linkedin') THEN
        INSERT INTO platform_templates (name, platform_key, description, icon_emoji, api_base_url, auth_type, rate_limits, supported_features, configuration_schema)
        VALUES (
            'LinkedIn', 
            'linkedin', 
            'Professional networking and B2B content marketing platform', 
            '💼', 
            'https://api.linkedin.com/v2', 
            'oauth',
            '{"posts_per_hour": 20, "api_calls_per_hour": 100}'::jsonb,
            '["post_content", "articles", "analytics", "company_pages", "messaging"]'::jsonb,
            '{"required_scopes": ["w_member_social", "r_liteprofile"], "webhook_events": ["posts", "comments"]}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM platform_templates WHERE platform_key = 'tiktok') THEN
        INSERT INTO platform_templates (name, platform_key, description, icon_emoji, api_base_url, auth_type, rate_limits, supported_features, configuration_schema)
        VALUES (
            'TikTok', 
            'tiktok', 
            'Short-form video content platform for viral marketing', 
            '🎵', 
            'https://open-api.tiktok.com', 
            'oauth',
            '{"posts_per_hour": 10, "api_calls_per_hour": 100}'::jsonb,
            '["post_videos", "analytics", "comments", "live_streaming"]'::jsonb,
            '{"required_scopes": ["video.publish", "user.info.basic"], "webhook_events": ["videos", "comments"]}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM platform_templates WHERE platform_key = 'youtube') THEN
        INSERT INTO platform_templates (name, platform_key, description, icon_emoji, api_base_url, auth_type, rate_limits, supported_features, configuration_schema)
        VALUES (
            'YouTube', 
            'youtube', 
            'Video content platform for long-form content and live streaming', 
            '📺', 
            'https://www.googleapis.com/youtube/v3', 
            'oauth',
            '{"uploads_per_hour": 6, "api_calls_per_hour": 1000}'::jsonb,
            '["upload_videos", "live_streaming", "analytics", "comments", "playlists"]'::jsonb,
            '{"required_scopes": ["youtube.upload", "youtube.readonly"], "webhook_events": ["videos", "comments"]}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM platform_templates WHERE platform_key = 'whatsapp') THEN
        INSERT INTO platform_templates (name, platform_key, description, icon_emoji, api_base_url, auth_type, rate_limits, supported_features, configuration_schema)
        VALUES (
            'WhatsApp Business', 
            'whatsapp', 
            'Business messaging platform for customer communication', 
            '💬', 
            'https://graph.facebook.com/v18.0', 
            'bearer_token',
            '{"messages_per_hour": 1000, "api_calls_per_hour": 1000}'::jsonb,
            '["send_messages", "templates", "media", "webhooks", "analytics"]'::jsonb,
            '{"required_setup": ["business_verification", "phone_number"], "webhook_events": ["messages", "status"]}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM platform_templates WHERE platform_key = 'telegram') THEN
        INSERT INTO platform_templates (name, platform_key, description, icon_emoji, api_base_url, auth_type, rate_limits, supported_features, configuration_schema)
        VALUES (
            'Telegram', 
            'telegram', 
            'Messaging platform with bot capabilities for automated communication', 
            '✈️', 
            'https://api.telegram.org/bot', 
            'api_key',
            '{"messages_per_second": 30, "api_calls_per_hour": 1000}'::jsonb,
            '["send_messages", "inline_keyboards", "file_sharing", "groups", "channels"]'::jsonb,
            '{"bot_token_required": true, "webhook_events": ["messages", "callback_queries"]}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM platform_templates WHERE platform_key = 'email') THEN
        INSERT INTO platform_templates (name, platform_key, description, icon_emoji, api_base_url, auth_type, rate_limits, supported_features, configuration_schema)
        VALUES (
            'Email', 
            'email', 
            'Email marketing and communication platform integration', 
            '📧', 
            'varies', 
            'api_key',
            '{"emails_per_hour": 1000, "api_calls_per_hour": 500}'::jsonb,
            '["send_emails", "templates", "automation", "analytics", "segmentation"]'::jsonb,
            '{"supported_providers": ["sendgrid", "mailgun", "ses"], "webhook_events": ["delivered", "opened", "clicked"]}'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM platform_templates WHERE platform_key = 'sms') THEN
        INSERT INTO platform_templates (name, platform_key, description, icon_emoji, api_base_url, auth_type, rate_limits, supported_features, configuration_schema)
        VALUES (
            'SMS', 
            'sms', 
            'SMS messaging platform for direct customer communication', 
            '📱', 
            'varies', 
            'api_key',
            '{"messages_per_hour": 500, "api_calls_per_hour": 200}'::jsonb,
            '["send_sms", "delivery_status", "two_way_messaging", "short_codes"]'::jsonb,
            '{"supported_providers": ["twilio", "nexmo", "aws_sns"], "webhook_events": ["delivered", "replied"]}'::jsonb
        );
    END IF;
END
$$;

-- Insert Knowledge Base Templates (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM knowledge_base_templates WHERE name = 'Instagram Marketing Guide') THEN
        INSERT INTO knowledge_base_templates (name, category, description, content_type, content, metadata, tags)
        VALUES (
            'Instagram Marketing Guide', 
            'social_media', 
            'Comprehensive guide for Instagram marketing best practices', 
            'text',
            'Instagram Marketing Best Practices:

1. Content Strategy
   - Post consistently (1-2 times per day)
   - Use high-quality visuals
   - Mix content types: photos, videos, carousels, Reels
   - Tell stories that connect with your audience

2. Hashtag Strategy
   - Use 3-5 relevant hashtags
   - Mix popular and niche hashtags
   - Create branded hashtags
   - Research trending hashtags in your industry

3. Engagement Tactics
   - Respond to comments within 2 hours
   - Use Instagram Stories for behind-the-scenes content
   - Host live sessions for real-time engagement
   - Collaborate with influencers and other brands

4. Analytics and Optimization
   - Track engagement rate, reach, and impressions
   - Analyze best posting times for your audience
   - Monitor story completion rates
   - A/B test different content formats

5. Instagram Reels
   - Keep videos under 30 seconds for maximum engagement
   - Use trending audio and effects
   - Add captions for accessibility
   - Include a clear call-to-action',
            '{"platform": "instagram", "last_updated": "2024-01-15", "difficulty": "beginner"}'::jsonb,
            ARRAY['instagram', 'social_media', 'marketing', 'engagement', 'reels']
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM knowledge_base_templates WHERE name = 'Email Marketing Fundamentals') THEN
        INSERT INTO knowledge_base_templates (name, category, description, content_type, content, metadata, tags)
        VALUES (
            'Email Marketing Fundamentals', 
            'email_marketing', 
            'Essential strategies for effective email marketing campaigns', 
            'text',
            'Email Marketing Best Practices:

1. List Building
   - Create compelling lead magnets
   - Use double opt-in for quality subscribers
   - Segment your audience from the start
   - Regularly clean your email list

2. Subject Line Optimization
   - Keep subject lines under 50 characters
   - Personalize when possible
   - Create urgency without being spammy
   - A/B test different approaches

3. Content Strategy
   - Provide value in every email
   - Use a clear and compelling call-to-action
   - Optimize for mobile devices
   - Include social sharing buttons

4. Automation Sequences
   - Welcome series for new subscribers
   - Abandoned cart recovery emails
   - Re-engagement campaigns for inactive subscribers
   - Birthday and anniversary emails

5. Analytics and Testing
   - Track open rates, click-through rates, and conversions
   - Test send times and frequency
   - Monitor unsubscribe rates
   - Use heat maps to optimize email design',
            '{"channel": "email", "last_updated": "2024-01-10", "difficulty": "intermediate"}'::jsonb,
            ARRAY['email', 'marketing', 'automation', 'segmentation', 'analytics']
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM knowledge_base_templates WHERE name = 'Content Creation Framework') THEN
        INSERT INTO knowledge_base_templates (name, category, description, content_type, content, metadata, tags)
        VALUES (
            'Content Creation Framework', 
            'content_strategy', 
            'Systematic approach to creating engaging content across platforms', 
            'text',
            'Content Creation Framework:

1. Content Planning
   - Define your content pillars (3-5 main themes)
   - Create a content calendar
   - Plan content mix: 80% value, 20% promotional
   - Research trending topics in your industry

2. Content Types
   - Educational: How-to guides, tutorials, tips
   - Entertaining: Behind-the-scenes, humor, stories
   - Inspirational: Success stories, motivational quotes
   - Promotional: Product features, testimonials, offers

3. Platform Optimization
   - Instagram: Visual storytelling, hashtags, Stories
   - LinkedIn: Professional insights, industry news
   - Twitter: Real-time updates, conversations, threads
   - TikTok: Trending sounds, quick tips, entertainment

4. Content Creation Process
   - Research and ideation
   - Content creation and editing
   - Platform-specific optimization
   - Scheduling and publishing
   - Engagement and community management

5. Performance Measurement
   - Track engagement metrics by platform
   - Analyze top-performing content
   - Identify optimal posting times
   - Adjust strategy based on data',
            '{"category": "strategy", "last_updated": "2024-01-20", "difficulty": "intermediate"}'::jsonb,
            ARRAY['content', 'strategy', 'planning', 'optimization', 'analytics']
        );
    END IF;
END
$$;

-- Insert Resource Templates (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM resource_templates WHERE name = 'Social Media Post Template') THEN
        INSERT INTO resource_templates (name, type, description, content, category, metadata, tags)
        VALUES (
            'Social Media Post Template', 
            'content_template', 
            'Versatile template for creating engaging social media posts',
            'Hook: [Attention-grabbing opening line]

Context: [Brief background or setup]

Value: [Main content, tip, or insight]

Call-to-Action: [What you want the audience to do]

Hashtags: [3-5 relevant hashtags]

---

Example:
Hook: Did you know 73% of marketers struggle with content creation?

Context: After analyzing 1000+ successful posts, we found a pattern.

Value: The most engaging posts follow this simple 4-part structure:
1. Start with a surprising statistic
2. Share a personal story or insight
3. Provide actionable advice
4. End with a question to spark discussion

Call-to-Action: What''s your biggest content creation challenge? Let me know in the comments!

Hashtags: #ContentMarketing #SocialMedia #MarketingTips #Engagement #DigitalMarketing',
            'social_media',
            '{"platforms": ["instagram", "linkedin", "twitter"], "engagement_rate": "high"}'::jsonb,
            ARRAY['template', 'social_media', 'engagement', 'content']
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM resource_templates WHERE name = 'Email Subject Line Templates') THEN
        INSERT INTO resource_templates (name, type, description, content, category, metadata, tags)
        VALUES (
            'Email Subject Line Templates', 
            'content_template', 
            'High-converting email subject line formulas',
            'Subject Line Templates:

1. Curiosity-Driven
   - "The [number] [thing] that [result]"
   - "What [target audience] don''t know about [topic]"
   - "The secret to [desired outcome]"

2. Urgency/Scarcity
   - "Only [time] left to [action]"
   - "[Number] spots remaining for [offer]"
   - "Last chance: [offer] expires [date]"

3. Personal/Direct
   - "[Name], this is for you"
   - "Your [item] is waiting"
   - "Quick question, [Name]"

4. Benefit-Focused
   - "How to [achieve goal] in [timeframe]"
   - "[Number] ways to [solve problem]"
   - "Get [result] without [pain point]"

5. Question-Based
   - "Are you making this [mistake]?"
   - "What if you could [desired outcome]?"
   - "Ready to [achieve goal]?"

Best Practices:
- Keep under 50 characters
- Avoid spam trigger words
- Personalize when possible
- A/B test different approaches
- Match subject line to email content',
            'email_marketing',
            '{"open_rate_improvement": "25-40%", "tested": true}'::jsonb,
            ARRAY['email', 'subject_lines', 'templates', 'conversion']
        );
    END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tool_templates_type ON tool_templates(type);
CREATE INDEX IF NOT EXISTS idx_tool_templates_category ON tool_templates(category);
CREATE INDEX IF NOT EXISTS idx_platform_templates_platform_key ON platform_templates(platform_key);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_templates_category ON knowledge_base_templates(category);
CREATE INDEX IF NOT EXISTS idx_resource_templates_type ON resource_templates(type);
CREATE INDEX IF NOT EXISTS idx_resource_templates_category ON resource_templates(category);

-- Add triggers for updated_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_tool_templates_updated_at'
    ) THEN
        CREATE TRIGGER update_tool_templates_updated_at 
          BEFORE UPDATE ON tool_templates 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_platform_templates_updated_at'
    ) THEN
        CREATE TRIGGER update_platform_templates_updated_at 
          BEFORE UPDATE ON platform_templates 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_knowledge_base_templates_updated_at'
    ) THEN
        CREATE TRIGGER update_knowledge_base_templates_updated_at 
          BEFORE UPDATE ON knowledge_base_templates 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_resource_templates_updated_at'
    ) THEN
        CREATE TRIGGER update_resource_templates_updated_at 
          BEFORE UPDATE ON resource_templates 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;