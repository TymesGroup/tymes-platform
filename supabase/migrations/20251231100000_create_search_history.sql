-- ============================================
-- Search History Table
-- Armazena histórico de pesquisas dos usuários
-- ============================================

CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  result_type TEXT, -- 'product', 'course', 'service', 'module', 'page', 'user'
  result_id TEXT, -- ID do item clicado (se houver)
  result_title TEXT, -- Título do item clicado
  module TEXT, -- Módulo onde a pesquisa foi feita
  results_count INTEGER DEFAULT 0,
  clicked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Índices para performance
  CONSTRAINT search_history_query_length CHECK (char_length(query) >= 2)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_user_recent ON search_history(user_id, created_at DESC);

-- RLS Policies
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas seu próprio histórico
CREATE POLICY "Users can view own search history"
  ON search_history FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem inserir no próprio histórico
CREATE POLICY "Users can insert own search history"
  ON search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar seu próprio histórico
CREATE POLICY "Users can delete own search history"
  ON search_history FOR DELETE
  USING (auth.uid() = user_id);

-- Usuários podem atualizar seu próprio histórico (para marcar como clicado)
CREATE POLICY "Users can update own search history"
  ON search_history FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Popular Searches View (para sugestões)
-- ============================================
CREATE OR REPLACE VIEW popular_searches AS
SELECT 
  query,
  COUNT(*) as search_count,
  COUNT(DISTINCT user_id) as unique_users,
  MAX(created_at) as last_searched
FROM search_history
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY query
HAVING COUNT(*) >= 3
ORDER BY search_count DESC
LIMIT 50;

-- Grant access to the view
GRANT SELECT ON popular_searches TO authenticated;
