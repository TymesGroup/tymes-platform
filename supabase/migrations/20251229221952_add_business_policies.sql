
-- Products Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Business users can manage products') THEN
        CREATE POLICY "Business users can manage products" ON products FOR ALL USING (
            auth.uid() = created_by AND 
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND type = 'BUSINESS')
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Everyone can view products') THEN
        CREATE POLICY "Everyone can view products" ON products FOR SELECT USING (true);
    END IF;
END $$;

-- Order Items Policies (for Vendors)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Vendors can view items of their products') THEN
        CREATE POLICY "Vendors can view items of their products" ON order_items FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM products 
                WHERE products.id = order_items.product_id 
                AND products.created_by = auth.uid()
            )
        );
    END IF;
END $$;

-- Courses Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Business users can manage courses') THEN
        CREATE POLICY "Business users can manage courses" ON courses FOR ALL USING (
            auth.uid() = created_by AND 
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND type = 'BUSINESS')
        );
    END IF;
     IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Everyone can view courses') THEN
        CREATE POLICY "Everyone can view courses" ON courses FOR SELECT USING (true);
    END IF;
END $$;
;
