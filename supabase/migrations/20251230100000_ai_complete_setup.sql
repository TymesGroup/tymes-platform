-- AI Complete Setup Migration
-- This migration ensures all AI-related tables are properly configured

-- Rename ai_chats to ai_conversations if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_chats' AND table_schema = 'public') THEN
        ALTER TABLE ai_chats RENAME TO ai_conversations;
    END IF;
END $$;

-- Rename chat_id to conversation_id in ai_messages if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_messages' AND column_name = 'chat_id') THEN
        ALTER TABLE ai_messages RENAME COLUMN chat_id TO conversation_id;
    END IF;
END $$;

-- Add metadata column to ai_messages if not exists
ALTER TABLE ai_messages ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create ai_suggestions table if not exists
CREATE TABLE IF NOT EXISTS ai_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    suggestion_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    action_data JSONB DEFAULT '{}',
    priority INTEGER DEFAULT 0,
    is_dismissed BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_activity_log table if not exists
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user_id ON ai_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_not_dismissed ON ai_suggestions(user_id) WHERE is_dismissed = FALSE;
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at DESC);

-- Enable RLS
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_suggestions
DROP POLICY IF EXISTS "Users can view own suggestions" ON ai_suggestions;
DROP POLICY IF EXISTS "Users can update own suggestions" ON ai_suggestions;

CREATE POLICY "Users can view own suggestions" ON ai_suggestions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own suggestions" ON ai_suggestions
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_activity_log
DROP POLICY IF EXISTS "Users can view own activity" ON user_activity_log;
DROP POLICY IF EXISTS "Users can log own activity" ON user_activity_log;

CREATE POLICY "Users can view own activity" ON user_activity_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can log own activity" ON user_activity_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update conversation timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ai_conversations 
    SET updated_at = NOW() 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation on new message
DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON ai_messages;
CREATE TRIGGER trigger_update_conversation_timestamp
    AFTER INSERT ON ai_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();
