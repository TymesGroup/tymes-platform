-- Create course_media table
CREATE TABLE IF NOT EXISTS course_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  position INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_media_course_id ON course_media(course_id);

ALTER TABLE course_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for course media" ON course_media FOR SELECT USING (true);
CREATE POLICY "Course owner can insert media" ON course_media FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM courses WHERE courses.id = course_media.course_id AND courses.created_by = auth.uid()));
CREATE POLICY "Course owner can update media" ON course_media FOR UPDATE USING (EXISTS (SELECT 1 FROM courses WHERE courses.id = course_media.course_id AND courses.created_by = auth.uid()));
CREATE POLICY "Course owner can delete media" ON course_media FOR DELETE USING (EXISTS (SELECT 1 FROM courses WHERE courses.id = course_media.course_id AND courses.created_by = auth.uid()));

-- Create service_media table (services are stored in products table with category='Service')
CREATE TABLE IF NOT EXISTS service_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  position INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_media_product_id ON service_media(product_id);

ALTER TABLE service_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for service media" ON service_media FOR SELECT USING (true);
CREATE POLICY "Service owner can insert media" ON service_media FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM products WHERE products.id = service_media.product_id AND products.created_by = auth.uid()));
CREATE POLICY "Service owner can update media" ON service_media FOR UPDATE USING (EXISTS (SELECT 1 FROM products WHERE products.id = service_media.product_id AND products.created_by = auth.uid()));
CREATE POLICY "Service owner can delete media" ON service_media FOR DELETE USING (EXISTS (SELECT 1 FROM products WHERE products.id = service_media.product_id AND products.created_by = auth.uid()));

-- Create storage buckets for course and service media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('course-images', 'course-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('course-videos', 'course-videos', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']),
  ('service-images', 'service-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('service-videos', 'service-videos', true, 52428800, ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'])
ON CONFLICT (id) DO NOTHING;
