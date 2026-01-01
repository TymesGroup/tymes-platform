-- Create storage bucket for AI attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'ai-attachments',
    'ai-attachments',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'text/csv', 'application/json']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for ai-attachments bucket
CREATE POLICY "Users can upload own attachments" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'ai-attachments' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own attachments" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'ai-attachments' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own attachments" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'ai-attachments' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Public read access for attachments (since bucket is public)
CREATE POLICY "Public can view ai attachments" ON storage.objects
    FOR SELECT USING (bucket_id = 'ai-attachments');
