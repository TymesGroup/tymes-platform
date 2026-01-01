/**
 * Search Service - Serviço centralizado de pesquisa inteligente
 * Busca em todos os módulos, páginas e conteúdos com histórico no Supabase
 */

import { supabase } from './supabase';

// ============================================
// TYPES
// ============================================

export type SearchResultType =
  | 'module'
  | 'page'
  | 'product'
  | 'course'
  | 'service'
  | 'user'
  | 'post';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  icon?: string;
  price?: number;
  path: string;
  module?: string;
  relevance: number;
  metadata?: Record<string, unknown>;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  result_type?: string;
  result_id?: string;
  result_title?: string;
  module?: string;
  results_count: number;
  clicked: boolean;
  created_at: string;
}

export interface SearchFilters {
  types?: SearchResultType[];
  module?: string;
  limit?: number;
}

// ============================================
// STATIC DATA - Módulos e Páginas
// ============================================

const MODULES = [
  {
    id: 'shop',
    name: 'Shop',
    description: 'Marketplace de produtos e serviços',
    icon: 'ShoppingBag',
    keywords: ['loja', 'comprar', 'produtos', 'marketplace', 'vendas', 'bolsa'],
  },
  {
    id: 'class',
    name: 'Class',
    description: 'Cursos e educação online',
    icon: 'GraduationCap',
    keywords: ['cursos', 'aulas', 'educação', 'aprender', 'certificados', 'professor'],
  },
  {
    id: 'work',
    name: 'Work',
    description: 'Projetos e serviços profissionais',
    icon: 'Briefcase',
    keywords: ['trabalho', 'projetos', 'freelance', 'serviços', 'tarefas', 'equipe'],
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Rede social e conexões',
    icon: 'Users',
    keywords: ['rede', 'conexões', 'amigos', 'mensagens', 'feed', 'posts'],
  },
  {
    id: 'ai',
    name: 'AI Assistant',
    description: 'Assistente de inteligência artificial',
    icon: 'Bot',
    keywords: ['ia', 'assistente', 'chat', 'ajuda', 'inteligência artificial'],
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Visão geral da sua conta',
    icon: 'LayoutDashboard',
    keywords: ['início', 'home', 'painel', 'resumo', 'visão geral'],
  },
  {
    id: 'settings',
    name: 'Configurações',
    description: 'Configurações da conta',
    icon: 'Settings',
    keywords: ['config', 'preferências', 'perfil', 'conta', 'segurança'],
  },
];

const PAGES = [
  // Shop pages
  {
    id: 'shop-browse',
    name: 'Explorar Produtos',
    module: 'shop',
    path: '/shop/browse',
    keywords: ['navegar', 'explorar', 'produtos'],
  },
  {
    id: 'shop-bag',
    name: 'Bolsa',
    module: 'shop',
    path: '/shop/bag',
    keywords: ['bolsa', 'compras', 'checkout'],
  },
  {
    id: 'shop-orders',
    name: 'Meus Pedidos',
    module: 'shop',
    path: '/shop/orders',
    keywords: ['pedidos', 'compras', 'histórico'],
  },
  {
    id: 'shop-saves',
    name: 'Salvos',
    module: 'shop',
    path: '/shop/saves',
    keywords: ['salvos', 'favoritos', 'wishlist'],
  },
  {
    id: 'shop-inventory',
    name: 'Meu Inventário',
    module: 'shop',
    path: '/shop/inventory',
    keywords: ['inventário', 'estoque', 'meus produtos'],
  },

  // Class pages
  {
    id: 'class-browse',
    name: 'Explorar Cursos',
    module: 'class',
    path: '/class/browse',
    keywords: ['cursos', 'aulas', 'aprender'],
  },
  {
    id: 'class-enrolled',
    name: 'Meus Cursos',
    module: 'class',
    path: '/class/enrolled',
    keywords: ['matriculados', 'meus cursos', 'estudando'],
  },
  {
    id: 'class-certificates',
    name: 'Certificados',
    module: 'class',
    path: '/class/certificates',
    keywords: ['certificados', 'diplomas', 'conquistas'],
  },
  {
    id: 'class-teaching',
    name: 'Área do Professor',
    module: 'class',
    path: '/class/teaching',
    keywords: ['ensinar', 'professor', 'criar curso'],
  },

  // Work pages
  {
    id: 'work-browse',
    name: 'Explorar Serviços',
    module: 'work',
    path: '/work/browse',
    keywords: ['serviços', 'freelance', 'contratar'],
  },
  {
    id: 'work-projects',
    name: 'Meus Projetos',
    module: 'work',
    path: '/work/projects',
    keywords: ['projetos', 'trabalhos', 'em andamento'],
  },
  {
    id: 'work-tasks',
    name: 'Minhas Tarefas',
    module: 'work',
    path: '/work/tasks',
    keywords: ['tarefas', 'to-do', 'pendências'],
  },
  {
    id: 'work-services',
    name: 'Meus Serviços',
    module: 'work',
    path: '/work/services',
    keywords: ['oferecer', 'meus serviços', 'freelance'],
  },

  // Social pages
  {
    id: 'social-feed',
    name: 'Feed',
    module: 'social',
    path: '/social/feed',
    keywords: ['feed', 'posts', 'timeline'],
  },
  {
    id: 'social-connections',
    name: 'Conexões',
    module: 'social',
    path: '/social/connections',
    keywords: ['conexões', 'amigos', 'seguidores'],
  },
  {
    id: 'social-messages',
    name: 'Mensagens',
    module: 'social',
    path: '/social/messages',
    keywords: ['mensagens', 'chat', 'conversas'],
  },

  // Settings pages
  {
    id: 'settings-profile',
    name: 'Editar Perfil',
    module: 'settings',
    path: '/settings/profile',
    keywords: ['perfil', 'foto', 'bio'],
  },
  {
    id: 'settings-security',
    name: 'Segurança',
    module: 'settings',
    path: '/settings/security',
    keywords: ['senha', 'segurança', '2fa'],
  },
  {
    id: 'settings-notifications',
    name: 'Notificações',
    module: 'settings',
    path: '/settings/notifications',
    keywords: ['notificações', 'alertas', 'emails'],
  },
  {
    id: 'settings-subscription',
    name: 'Assinatura',
    module: 'settings',
    path: '/settings/subscription',
    keywords: ['plano', 'assinatura', 'pagamento'],
  },
];

// ============================================
// SEARCH FUNCTIONS
// ============================================

/**
 * Calcula relevância baseada em match de texto
 */
function calculateRelevance(query: string, text: string, keywords: string[] = []): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  let score = 0;

  // Match exato no título
  if (t === q) score += 100;
  // Começa com a query
  else if (t.startsWith(q)) score += 80;
  // Contém a query
  else if (t.includes(q)) score += 60;

  // Match em keywords
  keywords.forEach(kw => {
    if (kw.toLowerCase().includes(q)) score += 30;
    if (q.includes(kw.toLowerCase())) score += 20;
  });

  return score;
}

/**
 * Busca em módulos estáticos
 */
function searchModules(query: string): SearchResult[] {
  const q = query.toLowerCase();

  return MODULES.filter(
    m =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.keywords.some(k => k.includes(q))
  ).map(m => ({
    id: m.id,
    type: 'module' as SearchResultType,
    title: m.name,
    subtitle: m.description,
    icon: m.icon,
    path: `/:account/${m.id}`,
    module: m.id,
    relevance: calculateRelevance(query, m.name, m.keywords),
  }));
}

/**
 * Busca em páginas estáticas
 */
function searchPages(query: string, accountType: string): SearchResult[] {
  const q = query.toLowerCase();

  return PAGES.filter(
    p => p.name.toLowerCase().includes(q) || p.keywords.some(k => k.includes(q))
  ).map(p => ({
    id: p.id,
    type: 'page' as SearchResultType,
    title: p.name,
    subtitle: `${MODULES.find(m => m.id === p.module)?.name || p.module}`,
    path: `/${accountType}${p.path}`,
    module: p.module,
    relevance: calculateRelevance(query, p.name, p.keywords),
  }));
}

/**
 * Busca produtos no Supabase
 */
async function searchProducts(query: string, limit: number = 5): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, image, category')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .eq('status', 'ACTIVE')
    .limit(limit);

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return (data || []).map(p => ({
    id: p.id,
    type: 'product' as SearchResultType,
    title: p.name,
    subtitle: p.category || 'Produto',
    description: p.description?.substring(0, 100),
    image: p.image,
    price: p.price,
    path: `/:account/shop/product/${p.id}`,
    module: 'shop',
    relevance: calculateRelevance(query, p.name),
  }));
}

/**
 * Busca cursos no Supabase
 */
async function searchCourses(query: string, limit: number = 5): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, thumbnail, instructor')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,instructor.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching courses:', error);
    return [];
  }

  return (data || []).map(c => ({
    id: c.id,
    type: 'course' as SearchResultType,
    title: c.title,
    subtitle: `Por ${c.instructor}`,
    description: c.description?.substring(0, 100),
    image: c.thumbnail,
    path: `/:account/class/course/${c.id}`,
    module: 'class',
    relevance: calculateRelevance(query, c.title),
  }));
}

/**
 * Busca usuários/perfis no Supabase
 */
async function searchUsers(query: string, limit: number = 3): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, avatar_url, type')
    .ilike('name', `%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching users:', error);
    return [];
  }

  return (data || []).map(u => ({
    id: u.id,
    type: 'user' as SearchResultType,
    title: u.name || 'Usuário',
    subtitle: u.type === 'BUSINESS' ? 'Conta Business' : 'Conta Pessoal',
    image: u.avatar_url,
    path: `/:account/social/profile/${u.id}`,
    module: 'social',
    relevance: calculateRelevance(query, u.name || ''),
  }));
}

/**
 * Busca posts no Supabase
 */
async function searchPosts(query: string, limit: number = 3): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, content, author_id, created_at, image')
    .ilike('content', `%${query}%`)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }

  return (data || []).map(p => ({
    id: p.id,
    type: 'post' as SearchResultType,
    title: p.content?.substring(0, 50) + '...',
    subtitle: 'Post',
    image: p.image,
    path: `/:account/social/post/${p.id}`,
    module: 'social',
    relevance: calculateRelevance(query, p.content || ''),
  }));
}

// ============================================
// MAIN SEARCH FUNCTION
// ============================================

export interface GlobalSearchOptions {
  query: string;
  accountType: string;
  filters?: SearchFilters;
  userId?: string;
}

export async function globalSearch(options: GlobalSearchOptions): Promise<SearchResult[]> {
  const { query, accountType, filters, userId } = options;

  if (!query || query.length < 2) {
    return [];
  }

  const limit = filters?.limit || 20;
  const types = filters?.types || ['module', 'page', 'product', 'course', 'user', 'post'];

  // Busca paralela em todas as fontes
  const searchPromises: Promise<SearchResult[]>[] = [];

  if (types.includes('module')) {
    searchPromises.push(Promise.resolve(searchModules(query)));
  }
  if (types.includes('page')) {
    searchPromises.push(Promise.resolve(searchPages(query, accountType)));
  }
  if (types.includes('product')) {
    searchPromises.push(searchProducts(query, 5));
  }
  if (types.includes('course')) {
    searchPromises.push(searchCourses(query, 5));
  }
  if (types.includes('user')) {
    searchPromises.push(searchUsers(query, 3));
  }
  if (types.includes('post')) {
    searchPromises.push(searchPosts(query, 3));
  }

  const results = await Promise.all(searchPromises);

  // Flatten e ordenar por relevância
  const allResults = results
    .flat()
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);

  // Salvar no histórico (async, não bloqueia)
  if (userId && allResults.length > 0) {
    saveSearchHistory(userId, query, allResults.length).catch(console.error);
  }

  return allResults;
}

// ============================================
// SEARCH HISTORY FUNCTIONS
// ============================================

/**
 * Salva pesquisa no histórico
 */
export async function saveSearchHistory(
  userId: string,
  query: string,
  resultsCount: number,
  clickedResult?: { type: string; id: string; title: string; module?: string }
): Promise<void> {
  try {
    await supabase.from('search_history').insert({
      user_id: userId,
      query: query.trim(),
      results_count: resultsCount,
      clicked: !!clickedResult,
      result_type: clickedResult?.type,
      result_id: clickedResult?.id,
      result_title: clickedResult?.title,
      module: clickedResult?.module,
    });
  } catch (error) {
    console.error('Error saving search history:', error);
  }
}

/**
 * Marca uma pesquisa como clicada
 */
export async function markSearchClicked(
  userId: string,
  query: string,
  result: { type: string; id: string; title: string; module?: string }
): Promise<void> {
  try {
    await supabase.from('search_history').insert({
      user_id: userId,
      query: query.trim(),
      results_count: 1,
      clicked: true,
      result_type: result.type,
      result_id: result.id,
      result_title: result.title,
      module: result.module,
    });
  } catch (error) {
    console.error('Error marking search clicked:', error);
  }
}

/**
 * Obtém histórico de pesquisas recentes do usuário
 */
export async function getRecentSearches(
  userId: string,
  limit: number = 10
): Promise<SearchHistoryItem[]> {
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching search history:', error);
    return [];
  }

  // Remove duplicatas mantendo a mais recente
  const uniqueQueries = new Map<string, SearchHistoryItem>();
  (data || []).forEach(item => {
    if (!uniqueQueries.has(item.query.toLowerCase())) {
      uniqueQueries.set(item.query.toLowerCase(), item);
    }
  });

  return Array.from(uniqueQueries.values()).slice(0, limit);
}

/**
 * Limpa histórico de pesquisas do usuário
 */
export async function clearSearchHistory(userId: string): Promise<void> {
  const { error } = await supabase.from('search_history').delete().eq('user_id', userId);

  if (error) {
    console.error('Error clearing search history:', error);
    throw error;
  }
}

/**
 * Remove uma pesquisa específica do histórico
 */
export async function removeFromHistory(userId: string, searchId: string): Promise<void> {
  const { error } = await supabase
    .from('search_history')
    .delete()
    .eq('user_id', userId)
    .eq('id', searchId);

  if (error) {
    console.error('Error removing search from history:', error);
    throw error;
  }
}

/**
 * Obtém pesquisas populares (para sugestões)
 */
export async function getPopularSearches(limit: number = 10): Promise<string[]> {
  try {
    const { data, error } = await supabase.from('popular_searches').select('query').limit(limit);

    if (error) throw error;
    return (data || []).map(d => d.query);
  } catch {
    // Fallback se a view não existir
    return [];
  }
}

export default {
  globalSearch,
  saveSearchHistory,
  markSearchClicked,
  getRecentSearches,
  clearSearchHistory,
  removeFromHistory,
  getPopularSearches,
};
