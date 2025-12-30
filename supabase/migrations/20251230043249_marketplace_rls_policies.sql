-- Habilitar RLS nas novas tabelas
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para STORES
CREATE POLICY "Lojas visíveis para todos" ON stores
  FOR SELECT USING (status = 'active');

CREATE POLICY "Dono pode ver sua loja" ON stores
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Dono pode criar loja" ON stores
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Dono pode atualizar loja" ON stores
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Dono pode deletar loja" ON stores
  FOR DELETE USING (auth.uid() = owner_id);

-- Políticas para CART_ITEMS
CREATE POLICY "Usuário vê seu carrinho" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário adiciona ao carrinho" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário atualiza carrinho" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuário remove do carrinho" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para FAVORITES
CREATE POLICY "Usuário vê favoritos" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário adiciona favorito" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário remove favorito" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para PRODUCT_REVIEWS
CREATE POLICY "Avaliações visíveis para todos" ON product_reviews
  FOR SELECT USING (true);

CREATE POLICY "Usuário cria avaliação" ON product_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário atualiza avaliação" ON product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuário deleta avaliação" ON product_reviews
  FOR DELETE USING (auth.uid() = user_id);;
