/*
  # Comprehensive Database Setup with Real Data

  1. Tool Templates
    - Pre-defined tool templates with descriptions, inputs, configurations
    - Real tool definitions that can be used across agents

  2. Knowledge Base Templates
    - Pre-built knowledge bases for common use cases
    - Social media platform guides, best practices, etc.

  3. Platform Configurations
    - Real social media platform configurations
    - API endpoints, authentication methods, etc.

  4. Resource Libraries
    - Content templates, brand guidelines, etc.
    - Reusable resources for agents

  5. Enhanced Mock Data
    - All displayed items backed by real database records
    - Proper relationships and references
*/

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
  tags text[] DEFAULT '{}',
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
  tags text[] DEFAULT '{}',
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tool_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read access for templates)
CREATE POLICY "Anyone can read tool templates" ON tool_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read platform templates" ON platform_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read public knowledge base templates" ON knowledge_base_templates FOR SELECT TO authenticated USING (is_public = true);
CREATE POLICY "Anyone can read public resource templates" ON resource_templates FOR SELECT TO authenticated USING (is_public = true);

-- Insert Tool Templates
INSERT INTO tool_templates (name, type, description, icon_name, category, input_schema, output_schema, default_config) VALUES
-- Web Scraping Tools
('Web Scraper', 'web_scraper', 'Extract data from web pages with advanced parsing capabilities', 'globe', 'data_extraction', 
 '{"url": {"type": "string", "required": true}, "selectors": {"type": "object", "required": false}, "wait_time": {"type": "number", "default": 3000}}',
 '{"content": {"type": "string"}, "metadata": {"type": "object"}, "links": {"type": "array"}}',
 '{"timeout": 30000, "maxPages": 10, "respectRobots": true, "userAgent": "InfluenceFlow Bot 1.0"}'),

('Lead Enrichment Tool', 'web_scraper', 'Enrich lead data by scraping social profiles and company information', 'users', 'lead_generation',
 '{"email": {"type": "string", "required": true}, "company": {"type": "string", "required": false}, "social_profiles": {"type": "array", "required": false}}',
 '{"enriched_data": {"type": "object"}, "social_links": {"type": "array"}, "company_info": {"type": "object"}, "confidence_score": {"type": "number"}}',
 '{"sources": ["linkedin", "twitter", "company_website"], "timeout": 45000, "includePhotos": true}'),

('Content Scraper', 'web_scraper', 'Scrape and analyze content from competitor websites and social media', 'file-text', 'content_analysis',
 '{"urls": {"type": "array", "required": true}, "content_types": {"type": "array", "default": ["text", "images"]}}',
 '{"content": {"type": "array"}, "sentiment": {"type": "string"}, "keywords": {"type": "array"}, "engagement_metrics": {"type": "object"}}',
 '{"extractImages": true, "analyzeSentiment": true, "extractHashtags": true}'),

-- Search Tools
('Google Search Tool', 'search_tool', 'Search Google for information with advanced filtering options', 'search', 'research',
 '{"query": {"type": "string", "required": true}, "num_results": {"type": "number", "default": 10}, "date_range": {"type": "string", "required": false}}',
 '{"results": {"type": "array"}, "total_results": {"type": "number"}, "search_time": {"type": "number"}}',
 '{"engine": "google", "maxResults": 10, "safeSearch": true, "includeSnippets": true}'),

('Social Media Search', 'search_tool', 'Search across multiple social media platforms for mentions and trends', 'hash', 'social_monitoring',
 '{"keywords": {"type": "array", "required": true}, "platforms": {"type": "array", "default": ["twitter", "instagram"]}, "sentiment": {"type": "string", "required": false}}',
 '{"mentions": {"type": "array"}, "sentiment_analysis": {"type": "object"}, "trending_topics": {"type": "array"}}',
 '{"platforms": ["twitter", "instagram", "tiktok"], "realTime": true, "includeSentiment": true}'),

('Competitor Research Tool', 'search_tool', 'Research competitors and analyze their online presence', 'target', 'competitive_analysis',
 '{"competitor_name": {"type": "string", "required": true}, "industry": {"type": "string", "required": false}, "analysis_depth": {"type": "string", "default": "standard"}}',
 '{"company_info": {"type": "object"}, "social_presence": {"type": "object"}, "content_strategy": {"type": "object"}, "strengths_weaknesses": {"type": "object"}}',
 '{"includeFinancials": false, "analyzeSocialMedia": true, "contentAnalysis": true}'),

-- API Tools
('CRM Integration', 'api_call', 'Integrate with popular CRM systems to sync lead and customer data', 'database', 'integration',
 '{"crm_type": {"type": "string", "required": true}, "action": {"type": "string", "required": true}, "data": {"type": "object", "required": true}}',
 '{"success": {"type": "boolean"}, "record_id": {"type": "string"}, "updated_fields": {"type": "array"}}',
 '{"supportedCRMs": ["salesforce", "hubspot", "pipedrive"], "timeout": 15000, "retryAttempts": 3}'),

('Email Marketing API', 'api_call', 'Connect with email marketing platforms for campaign management', 'mail', 'marketing',
 '{"platform": {"type": "string", "required": true}, "action": {"type": "string", "required": true}, "campaign_data": {"type": "object"}}',
 '{"campaign_id": {"type": "string"}, "status": {"type": "string"}, "metrics": {"type": "object"}}',
 '{"supportedPlatforms": ["mailchimp", "sendgrid", "constant_contact"], "includeAnalytics": true}'),

('Social Media API', 'api_call', 'Post and manage content across multiple social media platforms', 'share-2', 'social_media',
 '{"platform": {"type": "string", "required": true}, "content": {"type": "object", "required": true}, "schedule_time": {"type": "string", "required": false}}',
 '{"post_id": {"type": "string"}, "status": {"type": "string"}, "engagement": {"type": "object"}}',
 '{"supportedPlatforms": ["instagram", "twitter", "facebook", "linkedin"], "autoHashtags": true}'),

-- Data Extraction Tools
('Contact Extractor', 'data_extractor', 'Extract contact information from various sources and formats', 'contact', 'lead_generation',
 '{"source": {"type": "string", "required": true}, "format": {"type": "string", "default": "auto"}}',
 '{"contacts": {"type": "array"}, "confidence_scores": {"type": "array"}, "duplicates_removed": {"type": "number"}}',
 '{"extractEmails": true, "extractPhones": true, "extractSocialProfiles": true, "deduplication": true}'),

('Content Analyzer', 'data_extractor', 'Analyze content for sentiment, keywords, and engagement potential', 'bar-chart-3', 'content_analysis',
 '{"content": {"type": "string", "required": true}, "analysis_type": {"type": "array", "default": ["sentiment", "keywords"]}}',
 '{"sentiment": {"type": "object"}, "keywords": {"type": "array"}, "readability": {"type": "object"}, "engagement_score": {"type": "number"}}',
 '{"analysisTypes": ["sentiment", "keywords", "readability", "engagement"], "includeRecommendations": true}'),

('Trend Analyzer', 'data_extractor', 'Analyze trends and patterns in social media data and content', 'trending-up', 'analytics',
 '{"data_source": {"type": "string", "required": true}, "time_period": {"type": "string", "default": "30d"}, "metrics": {"type": "array"}}',
 '{"trends": {"type": "array"}, "growth_rate": {"type": "number"}, "predictions": {"type": "object"}, "recommendations": {"type": "array"}}',
 '{"timePeriods": ["7d", "30d", "90d"], "includeForecasting": true, "confidenceThreshold": 0.8}'),

-- Code Interpreter Tools
('Data Processor', 'code_interpreter', 'Process and analyze large datasets with Python and pandas', 'code', 'data_processing',
 '{"data": {"type": "object", "required": true}, "operations": {"type": "array", "required": true}}',
 '{"processed_data": {"type": "object"}, "statistics": {"type": "object"}, "visualizations": {"type": "array"}}',
 '{"allowedLibraries": ["pandas", "numpy", "matplotlib", "seaborn"], "maxExecutionTime": 60}'),

('Report Generator', 'code_interpreter', 'Generate comprehensive reports and visualizations from data', 'file-bar-chart', 'reporting',
 '{"data": {"type": "object", "required": true}, "report_type": {"type": "string", "required": true}, "template": {"type": "string", "required": false}}',
 '{"report_url": {"type": "string"}, "charts": {"type": "array"}, "summary": {"type": "object"}}',
 '{"outputFormats": ["pdf", "html", "excel"], "includeCharts": true, "autoInsights": true}');

-- Insert Platform Templates
INSERT INTO platform_templates (name, platform_key, description, icon_emoji, api_base_url, auth_type, rate_limits, supported_features, configuration_schema) VALUES
('Instagram', 'instagram', 'Connect and manage Instagram business accounts for content posting and analytics', '📷', 'https://graph.facebook.com/v18.0', 'oauth',
 '{"posts_per_hour": 25, "api_calls_per_hour": 200}',
 '["post_content", "stories", "reels", "analytics", "comments", "direct_messages"]',
 '{"required_scopes": ["instagram_basic", "instagram_content_publish"], "webhook_events": ["comments", "mentions"]}'),

('Twitter/X', 'twitter', 'Manage Twitter accounts for posting, engagement, and social listening', '🐦', 'https://api.twitter.com/2', 'bearer_token',
 '{"tweets_per_hour": 300, "api_calls_per_hour": 500}',
 '["post_tweets", "threads", "analytics", "mentions", "direct_messages", "spaces"]',
 '{"required_permissions": ["read", "write"], "webhook_events": ["tweets", "mentions", "follows"]}'),

('Facebook', 'facebook', 'Manage Facebook pages and groups for business marketing', '📘', 'https://graph.facebook.com/v18.0', 'oauth',
 '{"posts_per_hour": 25, "api_calls_per_hour": 200}',
 '["post_content", "stories", "events", "analytics", "comments", "messenger"]',
 '{"required_scopes": ["pages_manage_posts", "pages_read_engagement"], "webhook_events": ["feed", "comments"]}'),

('LinkedIn', 'linkedin', 'Professional networking and B2B content marketing platform', '💼', 'https://api.linkedin.com/v2', 'oauth',
 '{"posts_per_hour": 20, "api_calls_per_hour": 100}',
 '["post_content", "articles", "analytics", "company_pages", "messaging"]',
 '{"required_scopes": ["w_member_social", "r_liteprofile"], "webhook_events": ["posts", "comments"]}'),

('TikTok', 'tiktok', 'Short-form video content platform for viral marketing', '🎵', 'https://open-api.tiktok.com', 'oauth',
 '{"posts_per_hour": 10, "api_calls_per_hour": 100}',
 '["post_videos", "analytics", "comments", "live_streaming"]',
 '{"required_scopes": ["video.publish", "user.info.basic"], "webhook_events": ["videos", "comments"]}'),

('YouTube', 'youtube', 'Video content platform for long-form content and live streaming', '📺', 'https://www.googleapis.com/youtube/v3', 'oauth',
 '{"uploads_per_hour": 6, "api_calls_per_hour": 1000}',
 '["upload_videos", "live_streaming", "analytics", "comments", "playlists"]',
 '{"required_scopes": ["youtube.upload", "youtube.readonly"], "webhook_events": ["videos", "comments"]}'),

('WhatsApp Business', 'whatsapp', 'Business messaging platform for customer communication', '💬', 'https://graph.facebook.com/v18.0', 'bearer_token',
 '{"messages_per_hour": 1000, "api_calls_per_hour": 1000}',
 '["send_messages", "templates", "media", "webhooks", "analytics"]',
 '{"required_setup": ["business_verification", "phone_number"], "webhook_events": ["messages", "status"]}'),

('Telegram', 'telegram', 'Messaging platform with bot capabilities for automated communication', '✈️', 'https://api.telegram.org/bot', 'api_key',
 '{"messages_per_second": 30, "api_calls_per_hour": 1000}',
 '["send_messages", "inline_keyboards", "file_sharing", "groups", "channels"]',
 '{"bot_token_required": true, "webhook_events": ["messages", "callback_queries"]}'),

('Email', 'email', 'Email marketing and communication platform integration', '📧', 'varies', 'api_key',
 '{"emails_per_hour": 1000, "api_calls_per_hour": 500}',
 '["send_emails", "templates", "automation", "analytics", "segmentation"]',
 '{"supported_providers": ["sendgrid", "mailgun", "ses"], "webhook_events": ["delivered", "opened", "clicked"]}'),

('SMS', 'sms', 'SMS messaging platform for direct customer communication', '📱', 'varies', 'api_key',
 '{"messages_per_hour": 500, "api_calls_per_hour": 200}',
 '["send_sms", "delivery_status", "two_way_messaging", "short_codes"]',
 '{"supported_providers": ["twilio", "nexmo", "aws_sns"], "webhook_events": ["delivered", "replied"]}');

-- Insert Knowledge Base Templates
INSERT INTO knowledge_base_templates (name, category, description, content_type, content, metadata, tags) VALUES
('Instagram Marketing Guide', 'social_media', 'Comprehensive guide for Instagram marketing best practices', 'text',
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
 '{"platform": "instagram", "last_updated": "2024-01-15", "difficulty": "beginner"}',
 '["instagram", "social_media", "marketing", "engagement", "reels"]'),

('Email Marketing Fundamentals', 'email_marketing', 'Essential strategies for effective email marketing campaigns', 'text',
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
 '{"channel": "email", "last_updated": "2024-01-10", "difficulty": "intermediate"}',
 '["email", "marketing", "automation", "segmentation", "analytics"]'),

('Content Creation Framework', 'content_strategy', 'Systematic approach to creating engaging content across platforms', 'text',
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
 '{"category": "strategy", "last_updated": "2024-01-20", "difficulty": "intermediate"}',
 '["content", "strategy", "planning", "optimization", "analytics"]'),

('Lead Generation Strategies', 'lead_generation', 'Proven methods for generating and nurturing high-quality leads', 'text',
 'Lead Generation Strategies:

1. Content Marketing
   - Create valuable lead magnets (ebooks, whitepapers, templates)
   - Optimize landing pages for conversions
   - Use gated content strategically
   - Implement progressive profiling

2. Social Media Lead Generation
   - Use LinkedIn for B2B lead generation
   - Create engaging social media contests
   - Leverage user-generated content
   - Implement social proof and testimonials

3. Email Marketing for Leads
   - Design compelling opt-in forms
   - Create nurture sequences
   - Segment leads based on behavior
   - Use lead scoring to prioritize follow-up

4. Paid Advertising
   - Facebook and Instagram lead ads
   - Google Ads for high-intent keywords
   - LinkedIn sponsored content for B2B
   - Retargeting campaigns for warm leads

5. Lead Qualification and Nurturing
   - Implement BANT criteria (Budget, Authority, Need, Timeline)
   - Create buyer personas and journey maps
   - Use marketing automation for lead nurturing
   - Align sales and marketing teams',
 '{"focus": "lead_generation", "last_updated": "2024-01-12", "difficulty": "advanced"}',
 '["leads", "generation", "nurturing", "qualification", "conversion"]'),

('Customer Support Best Practices', 'customer_support', 'Guidelines for providing exceptional customer support', 'text',
 'Customer Support Best Practices:

1. Response Time Standards
   - Email: Respond within 24 hours
   - Live chat: Respond within 2 minutes
   - Social media: Respond within 4 hours
   - Phone: Answer within 3 rings

2. Communication Guidelines
   - Use empathetic and professional language
   - Listen actively to understand the issue
   - Provide clear and concise solutions
   - Follow up to ensure resolution

3. Knowledge Management
   - Maintain an up-to-date FAQ section
   - Create detailed troubleshooting guides
   - Document common issues and solutions
   - Regular training on product updates

4. Multi-channel Support
   - Provide consistent experience across channels
   - Use unified customer profiles
   - Enable seamless channel switching
   - Track interactions across touchpoints

5. Continuous Improvement
   - Collect and analyze customer feedback
   - Monitor support metrics (CSAT, NPS, resolution time)
   - Regular team training and development
   - Implement process improvements based on data',
 '{"department": "support", "last_updated": "2024-01-08", "difficulty": "beginner"}',
 '["support", "customer_service", "communication", "processes", "metrics"]');

-- Insert Resource Templates
INSERT INTO resource_templates (name, type, description, content, category, metadata, tags) VALUES
('Social Media Post Template', 'content_template', 'Versatile template for creating engaging social media posts', 
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
 'social_media', '{"platforms": ["instagram", "linkedin", "twitter"], "engagement_rate": "high"}',
 '["template", "social_media", "engagement", "content"]'),

('Email Subject Line Templates', 'content_template', 'High-converting email subject line formulas', 
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
 'email_marketing', '{"open_rate_improvement": "25-40%", "tested": true}',
 '["email", "subject_lines", "templates", "conversion"]'),

('Brand Voice Guidelines Template', 'brand_guide', 'Comprehensive template for defining brand voice and tone', 
 'Brand Voice Guidelines

1. Brand Personality
   Primary Traits: [List 3-5 key personality traits]
   Secondary Traits: [List 2-3 supporting traits]
   Avoid: [List traits to avoid]

2. Tone of Voice
   Professional Level: [Formal/Casual/Conversational]
   Emotional Tone: [Warm/Neutral/Energetic]
   Humor Level: [None/Light/Playful]

3. Language Guidelines
   Vocabulary:
   - Use: [Preferred words and phrases]
   - Avoid: [Words and phrases to avoid]
   
   Grammar and Style:
   - Sentence length: [Short/Medium/Varied]
   - Active vs. passive voice: [Preference]
   - Contractions: [Use/Avoid]

4. Communication Principles
   - [Principle 1]: [Description]
   - [Principle 2]: [Description]
   - [Principle 3]: [Description]

5. Platform-Specific Adaptations
   Instagram: [Tone adjustments for Instagram]
   LinkedIn: [Tone adjustments for LinkedIn]
   Email: [Tone adjustments for email]
   Customer Support: [Tone adjustments for support]

6. Examples
   Good Example: [Example of on-brand communication]
   Bad Example: [Example of off-brand communication]

7. Voice Checklist
   Before publishing, ask:
   - Does this sound like our brand?
   - Is the tone appropriate for the platform?
   - Does it align with our values?
   - Will our audience connect with this?',
 'branding', '{"completeness": "comprehensive", "usage": "internal_external"}',
 '["brand", "voice", "guidelines", "communication", "style"]'),

('Content Calendar Template', 'workflow_template', 'Monthly content planning and scheduling template', 
 'Monthly Content Calendar Template

Week 1: [Theme/Focus]
Monday: [Content Type] - [Topic] - [Platform]
Tuesday: [Content Type] - [Topic] - [Platform]
Wednesday: [Content Type] - [Topic] - [Platform]
Thursday: [Content Type] - [Topic] - [Platform]
Friday: [Content Type] - [Topic] - [Platform]
Weekend: [Content Type] - [Topic] - [Platform]

Week 2: [Theme/Focus]
[Repeat structure]

Week 3: [Theme/Focus]
[Repeat structure]

Week 4: [Theme/Focus]
[Repeat structure]

Content Mix Guidelines:
- Educational: 40% (How-tos, tips, industry insights)
- Entertaining: 30% (Behind-scenes, humor, stories)
- Promotional: 20% (Products, services, offers)
- User-Generated: 10% (Customer stories, reviews)

Platform Distribution:
- Instagram: Daily posts + 3 Stories/week
- LinkedIn: 3 posts/week
- Twitter: 5 posts/week
- Email: 1 newsletter/week

Key Dates to Remember:
- [Holiday/Event]: [Date] - [Content plan]
- [Product Launch]: [Date] - [Content plan]
- [Industry Event]: [Date] - [Content plan]

Metrics to Track:
- Engagement rate by platform
- Reach and impressions
- Click-through rates
- Conversion rates
- Follower growth',
 'planning', '{"frequency": "monthly", "platforms": "multi", "metrics_included": true}',
 '["calendar", "planning", "content", "scheduling", "strategy"]'),

('Lead Magnet Template', 'content_template', 'Template for creating compelling lead magnets', 
 'Lead Magnet Template: [Title]

1. Problem Statement
   "Are you struggling with [specific problem]?"
   "Do you find it difficult to [challenge]?"
   "What if you could [desired outcome] in just [timeframe]?"

2. Solution Overview
   "This [type of lead magnet] will help you:
   - [Benefit 1]
   - [Benefit 2]
   - [Benefit 3]"

3. Content Structure
   Introduction:
   - Hook: [Attention-grabbing statement]
   - Problem: [Pain point your audience faces]
   - Promise: [What they''ll achieve]

   Main Content:
   - Section 1: [Topic] - [Key takeaway]
   - Section 2: [Topic] - [Key takeaway]
   - Section 3: [Topic] - [Key takeaway]

   Conclusion:
   - Summary of key points
   - Next steps
   - Call-to-action for your main offer

4. Design Elements
   - Professional layout
   - Brand colors and fonts
   - High-quality images/graphics
   - Easy-to-scan format

5. Delivery Method
   - PDF download
   - Email course
   - Video series
   - Checklist/template

6. Follow-up Sequence
   Email 1: Deliver the lead magnet
   Email 2: Additional tips related to the topic
   Email 3: Case study or success story
   Email 4: Soft pitch for your main offer
   Email 5: Social proof and testimonials

7. Promotion Strategy
   - Landing page optimization
   - Social media promotion
   - Content marketing integration
   - Paid advertising campaigns',
 'lead_generation', '{"conversion_rate": "15-25%", "follow_up_included": true}',
 '["lead_magnet", "conversion", "template", "marketing", "funnel"]');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tool_templates_type ON tool_templates(type);
CREATE INDEX IF NOT EXISTS idx_tool_templates_category ON tool_templates(category);
CREATE INDEX IF NOT EXISTS idx_platform_templates_platform_key ON platform_templates(platform_key);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_templates_category ON knowledge_base_templates(category);
CREATE INDEX IF NOT EXISTS idx_resource_templates_type ON resource_templates(type);
CREATE INDEX IF NOT EXISTS idx_resource_templates_category ON resource_templates(category);

-- Add triggers for updated_at
CREATE TRIGGER update_tool_templates_updated_at 
  BEFORE UPDATE ON tool_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_templates_updated_at 
  BEFORE UPDATE ON platform_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_templates_updated_at 
  BEFORE UPDATE ON knowledge_base_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_templates_updated_at 
  BEFORE UPDATE ON resource_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();