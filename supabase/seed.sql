-- =====================================================
-- SEED DATA - Dados de exemplo para as vitrines
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. PRODUTOS (Shop Module)
-- =====================================================

-- Produtos com desconto (Ofertas Relâmpago)
INSERT INTO products (name, price, original_price, category, image, description, status, stock, sales_count, rating, total_reviews, is_bestseller)
VALUES 
  ('iPhone 15 Pro Max 256GB', 7499.00, 9999.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', 'O iPhone mais avançado com chip A17 Pro e câmera de 48MP', 'active', 50, 234, 4.9, 156, true),
  ('MacBook Air M3 15"', 12999.00, 15999.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'Notebook ultrafino com chip M3 e 18h de bateria', 'active', 30, 189, 4.8, 98, true),
  ('AirPods Pro 2ª Geração', 1799.00, 2499.00, 'Acessórios', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800', 'Cancelamento de ruído ativo e áudio espacial', 'active', 100, 567, 4.7, 234, true),
  ('Apple Watch Series 9', 3499.00, 4499.00, 'Acessórios', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800', 'Smartwatch com chip S9 e tela sempre ativa', 'active', 75, 312, 4.8, 178, false),
  ('Samsung Galaxy S24 Ultra', 6999.00, 8999.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Smartphone com S Pen e câmera de 200MP', 'active', 45, 156, 4.7, 89, true),
  ('Sony WH-1000XM5', 1999.00, 2799.00, 'Acessórios', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800', 'Headphone com o melhor cancelamento de ruído', 'active', 60, 423, 4.9, 267, true),
  ('iPad Pro 12.9" M2', 9999.00, 12999.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', 'Tablet profissional com chip M2 e tela Liquid Retina XDR', 'active', 25, 98, 4.8, 67, false),
  ('Nintendo Switch OLED', 2299.00, 2799.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800', 'Console portátil com tela OLED de 7 polegadas', 'active', 40, 234, 4.6, 145, false)
ON CONFLICT DO NOTHING;

-- Produtos sem desconto (Recomendados)
INSERT INTO products (name, price, category, image, description, status, stock, sales_count, rating, total_reviews, is_bestseller)
VALUES 
  ('Câmera Canon EOS R6 Mark II', 15999.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', 'Câmera mirrorless full-frame com 24.2MP', 'active', 15, 45, 4.9, 34, false),
  ('Teclado Mecânico Keychron K8', 699.00, 'Acessórios', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', 'Teclado mecânico wireless com switches Gateron', 'active', 80, 312, 4.7, 189, true),
  ('Monitor LG UltraWide 34"', 3499.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', 'Monitor ultrawide QHD com 160Hz', 'active', 20, 78, 4.8, 56, false),
  ('Cadeira Gamer ThunderX3', 1899.00, 'Casa', 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800', 'Cadeira ergonômica com apoio lombar', 'active', 35, 156, 4.5, 98, false),
  ('Mochila Peak Design 30L', 1299.00, 'Acessórios', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'Mochila para fotógrafos e viajantes', 'active', 50, 89, 4.8, 67, false),
  ('Kindle Paperwhite 11ª Geração', 649.00, 'Eletrônicos', 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800', 'E-reader com tela de 6.8" e luz ajustável', 'active', 100, 423, 4.9, 312, true)
ON CONFLICT DO NOTHING;

-- Serviços/Produtos Digitais (Work Module)
INSERT INTO products (name, price, original_price, category, image, description, status, stock, sales_count, rating, total_reviews)
VALUES 
  ('Desenvolvimento de Site Institucional', 2500.00, 3500.00, 'Service', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'Site responsivo com até 5 páginas, SEO básico e formulário de contato', 'active', 999, 89, 4.9, 67),
  ('Design de Logo Profissional', 450.00, 699.00, 'Service', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800', 'Criação de logo com 3 propostas e arquivos em alta resolução', 'active', 999, 234, 4.8, 156),
  ('Gestão de Redes Sociais - Mensal', 1200.00, 1800.00, 'Service', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800', 'Gestão completa de Instagram e Facebook com 20 posts/mês', 'active', 999, 156, 4.7, 89),
  ('Edição de Vídeo Profissional', 350.00, 500.00, 'Service', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800', 'Edição de vídeo até 5 minutos com correção de cor e trilha', 'active', 999, 312, 4.9, 178),
  ('Template Notion Premium', 79.00, NULL, 'Digital', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800', 'Template completo para gestão de projetos e vida pessoal', 'active', 999, 567, 4.8, 345),
  ('Pack de Ícones SVG - 500 ícones', 29.00, NULL, 'Digital', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800', 'Coleção de 500 ícones vetoriais em SVG e PNG', 'active', 999, 890, 4.7, 234),
  ('Consultoria de Marketing Digital', 500.00, 750.00, 'Service', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', '1 hora de consultoria estratégica para seu negócio', 'active', 999, 78, 5.0, 45),
  ('Desenvolvimento de App Mobile', 8000.00, 12000.00, 'Service', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', 'App nativo para iOS e Android com backend', 'active', 999, 34, 4.9, 23)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. CURSOS (Class Module)
-- =====================================================

INSERT INTO courses (title, instructor, thumbnail, description, price, original_price, category, duration, rating, total_reviews, students_count, is_bestseller, status, level, language)
VALUES 
  ('JavaScript Moderno: Do Zero ao Avançado', 'Carlos Eduardo Silva', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800', 'Aprenda JavaScript ES6+, async/await, módulos e muito mais', 89.90, 179.90, 'tech', '35h', 4.9, 1256, 8934, true, 'published', 'beginner', 'pt-BR'),
  ('React.js Completo com TypeScript', 'Fernanda Costa Tech', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', 'Domine React, Hooks, Context API e TypeScript', 99.90, 199.90, 'tech', '45h', 4.8, 892, 6721, true, 'published', 'intermediate', 'pt-BR'),
  ('Node.js e APIs RESTful', 'Roberto Backend Dev', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800', 'Construa APIs profissionais com Node.js, Express e MongoDB', 79.90, 159.90, 'tech', '28h', 4.7, 567, 4532, false, 'published', 'intermediate', 'pt-BR'),
  ('Python para Data Science', 'Ana Lima Data', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800', 'Análise de dados com Python, Pandas, NumPy e visualização', 129.90, 249.90, 'tech', '50h', 4.9, 1034, 7823, true, 'published', 'beginner', 'pt-BR'),
  ('UI/UX Design Completo', 'Maria Designer Pro', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', 'Design de interfaces do Figma ao protótipo interativo', 149.90, 299.90, 'design', '40h', 4.8, 678, 5234, true, 'published', 'beginner', 'pt-BR'),
  ('Marketing Digital Estratégico', 'Pedro Marketing Growth', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'Estratégias de marketing digital, SEO, ads e analytics', 199.90, 399.90, 'business', '35h', 4.7, 456, 3421, false, 'published', 'intermediate', 'pt-BR'),
  ('Inglês para Desenvolvedores', 'Julia English Tech', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', 'Inglês técnico focado em programação e tecnologia', 69.90, 139.90, 'tech', '20h', 4.6, 345, 2876, false, 'published', 'beginner', 'pt-BR'),
  ('AWS Cloud Practitioner', 'Lucas Cloud Expert', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', 'Preparatório completo para certificação AWS', 179.90, 349.90, 'tech', '30h', 4.9, 234, 1987, false, 'published', 'beginner', 'pt-BR'),
  ('Figma Avançado para Designers', 'Carla UX Designer', 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800', 'Técnicas avançadas de prototipagem e design systems', 119.90, 239.90, 'design', '25h', 4.8, 189, 1543, false, 'published', 'advanced', 'pt-BR'),
  ('Empreendedorismo Digital', 'André Startup CEO', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', 'Como criar e escalar seu negócio digital do zero', 249.90, 499.90, 'business', '45h', 4.7, 312, 2134, false, 'published', 'intermediate', 'pt-BR')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. LOJAS (Shop Module - Featured Stores)
-- =====================================================

INSERT INTO stores (name, slug, description, logo_url, banner_url, status, rating, total_sales, is_verified, category)
VALUES 
  ('TechStore Brasil', 'techstore-brasil', 'A maior loja de eletrônicos do Brasil', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200', 'active', 4.9, 12567, true, 'Eletrônicos'),
  ('Fashion Hub', 'fashion-hub', 'Moda feminina e masculina com as últimas tendências', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200', 'active', 4.8, 8934, true, 'Moda'),
  ('Home & Decor', 'home-decor', 'Decoração e móveis para sua casa', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200', 'active', 4.7, 5678, true, 'Casa'),
  ('Sports World', 'sports-world', 'Artigos esportivos e fitness', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200', 'active', 4.6, 4321, false, 'Esportes'),
  ('Gamer Zone', 'gamer-zone', 'Tudo para gamers: consoles, jogos e acessórios', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200', 'active', 4.8, 7654, true, 'Games'),
  ('Beauty Store', 'beauty-store', 'Cosméticos e produtos de beleza', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200', 'active', 4.7, 6543, true, 'Beleza')
ON CONFLICT DO NOTHING;

-- =====================================================
-- MENSAGEM DE SUCESSO
-- =====================================================
SELECT 'Seed data inserido com sucesso!' as status;
