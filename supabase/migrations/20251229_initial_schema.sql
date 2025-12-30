-- Enum para tipos de perfil
CREATE TYPE profile_type AS ENUM ('SUPERADMIN', 'PERSONAL', 'BUSINESS');
-- Tabela de perfis (extende auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  document TEXT, -- CPF ou CNPJ
  type profile_type NOT NULL DEFAULT 'PERSONAL',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Tabela de produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Tabela de cursos
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  instructor TEXT NOT NULL,
  thumbnail TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Progresso do usuário em cursos
CREATE TABLE course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
-- Tabela de tarefas
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Tabela de posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  image TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Tabela de likes
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver todos os perfis" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuários podem editar próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Superadmin pode tudo em profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND type = 'SUPERADMIN')
);
-- Políticas RLS para products
CREATE POLICY "Todos podem ver produtos" ON products FOR SELECT USING (true);
CREATE POLICY "Business e Superadmin podem criar produtos" ON products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND type IN ('BUSINESS', 'SUPERADMIN'))
);
CREATE POLICY "Criador ou Superadmin pode editar produto" ON products FOR UPDATE USING (
  created_by = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND type = 'SUPERADMIN')
);
CREATE POLICY "Criador ou Superadmin pode deletar produto" ON products FOR DELETE USING (
  created_by = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND type = 'SUPERADMIN')
);
-- Políticas RLS para courses
CREATE POLICY "Todos podem ver cursos" ON courses FOR SELECT USING (true);
CREATE POLICY "Business e Superadmin podem criar cursos" ON courses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND type IN ('BUSINESS', 'SUPERADMIN'))
);
CREATE POLICY "Criador ou Superadmin pode editar curso" ON courses FOR UPDATE USING (
  created_by = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND type = 'SUPERADMIN')
);
-- Políticas RLS para course_progress
CREATE POLICY "Usuário vê próprio progresso" ON course_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Usuário gerencia próprio progresso" ON course_progress FOR ALL USING (user_id = auth.uid());
-- Políticas RLS para tasks
CREATE POLICY "Usuário vê próprias tarefas" ON tasks FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Usuário gerencia próprias tarefas" ON tasks FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Superadmin vê todas tarefas" ON tasks FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND type = 'SUPERADMIN')
);
-- Políticas RLS para posts
CREATE POLICY "Todos podem ver posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Usuários autenticados podem criar posts" ON posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Autor pode editar próprio post" ON posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Autor ou Superadmin pode deletar post" ON posts FOR DELETE USING (
  author_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND type = 'SUPERADMIN')
);
-- Políticas RLS para post_likes
CREATE POLICY "Todos podem ver likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Usuários autenticados podem dar like" ON post_likes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Usuário pode remover próprio like" ON post_likes FOR DELETE USING (user_id = auth.uid());
-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, document, type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email,
    NEW.raw_user_meta_data->>'document',
    COALESCE((NEW.raw_user_meta_data->>'type')::profile_type, 'PERSONAL')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Trigger para criar perfil no signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
