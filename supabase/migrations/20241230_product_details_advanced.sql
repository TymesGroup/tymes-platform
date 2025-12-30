-- =====================================================
-- ADVANCED PRODUCT DETAILS - MARKETPLACE STRUCTURE
-- =====================================================

-- 1. Product Media (múltiplas fotos e vídeos)
CREATE TABLE IF NOT EXISTS product_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    position INTEGER DEFAULT 0,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Product Specifications (especificações técnicas)
CREATE TABLE IF NOT EXISTS product_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    group_name TEXT DEFAULT 'Geral',
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product Variations (variações: cor, tamanho, etc)
CREATE TABLE IF NOT EXISTS product_variations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- ex: "Cor", "Tamanho"
    value TEXT NOT NULL, -- ex: "Azul", "M"
    price_modifier DECIMAL(10,2) DEFAULT 0, -- ajuste de preço
    stock INTEGER DEFAULT 0,
    sku TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Questions (perguntas e respostas)
CREATE TABLE IF NOT EXISTS product_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    answered_by UUID REFERENCES profiles(id),
    answered_at TIMESTAMPTZ,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Add new columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight DECIMAL(10,3);
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions JSONB; -- {width, height, depth}
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty_months INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sales_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- 6. Add helpful_count to reviews
ALTER TABLE product_reviews ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;
ALTER TABLE product_reviews ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE product_reviews ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN DEFAULT false;

-- 7. Review Helpful Votes
CREATE TABLE IF NOT EXISTS review_helpful_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(review_id, user_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_product_media_product ON product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_specs_product ON product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variations_product ON product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_questions_product ON product_questions(product_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Product Media
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product media"
ON product_media FOR SELECT USING (true);

CREATE POLICY "Product owners can manage media"
ON product_media FOR ALL USING (
    EXISTS (
        SELECT 1 FROM products p
        WHERE p.id = product_media.product_id
        AND p.created_by = auth.uid()
    )
);

-- Product Specifications
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view specifications"
ON product_specifications FOR SELECT USING (true);

CREATE POLICY "Product owners can manage specifications"
ON product_specifications FOR ALL USING (
    EXISTS (
        SELECT 1 FROM products p
        WHERE p.id = product_specifications.product_id
        AND p.created_by = auth.uid()
    )
);

-- Product Variations
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view variations"
ON product_variations FOR SELECT USING (true);

CREATE POLICY "Product owners can manage variations"
ON product_variations FOR ALL USING (
    EXISTS (
        SELECT 1 FROM products p
        WHERE p.id = product_variations.product_id
        AND p.created_by = auth.uid()
    )
);

-- Product Questions
ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public questions"
ON product_questions FOR SELECT USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can ask questions"
ON product_questions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Product owners can answer questions"
ON product_questions FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM products p
        WHERE p.id = product_questions.product_id
        AND p.created_by = auth.uid()
    )
);

-- Review Helpful Votes
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes"
ON review_helpful_votes FOR SELECT USING (true);

CREATE POLICY "Users can vote"
ON review_helpful_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their vote"
ON review_helpful_votes FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to increment product views
CREATE OR REPLACE FUNCTION increment_product_views(p_product_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE products SET views_count = COALESCE(views_count, 0) + 1 WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update review helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE product_reviews SET helpful_count = COALESCE(helpful_count, 0) + 1 WHERE id = NEW.review_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE product_reviews SET helpful_count = COALESCE(helpful_count, 0) - 1 WHERE id = OLD.review_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_review_helpful
AFTER INSERT OR DELETE ON review_helpful_votes
FOR EACH ROW EXECUTE FUNCTION update_review_helpful_count();
