/**
 * Route Definitions - Mapa completo de rotas da aplicação
 *
 * Cada rota define:
 * - Quem pode acessar (allowedAccounts)
 * - Por que acessa (description)
 * - Com quais permissões (requiredPermissions)
 */

import {
  RouteDefinition,
  AccountType,
  ModuleSlug,
  AdminModuleSlug,
  PROFILE_TO_ACCOUNT,
} from './types';
import { ProfileType } from '../types';

// ============================================
// ROTAS PÚBLICAS (não autenticadas)
// ============================================
export const PUBLIC_ROUTES: RouteDefinition[] = [
  {
    path: '/',
    allowedAccounts: [],
    module: 'dashboard',
    description: 'Landing page pública',
  },
  {
    path: '/auth',
    allowedAccounts: [],
    module: 'dashboard',
    description: 'Página de login/registro',
  },
  {
    path: '/auth/login',
    allowedAccounts: [],
    module: 'dashboard',
    description: 'Login de usuário',
  },
  {
    path: '/auth/register',
    allowedAccounts: [],
    module: 'dashboard',
    description: 'Registro de novo usuário',
  },
  {
    path: '/auth/register/personal',
    allowedAccounts: [],
    module: 'dashboard',
    description: 'Registro de conta pessoal',
  },
  {
    path: '/auth/register/business',
    allowedAccounts: [],
    module: 'dashboard',
    description: 'Registro de conta empresarial',
  },
  {
    path: '/preview/:module',
    allowedAccounts: [],
    module: 'explore',
    description: 'Preview de módulo para visitantes',
  },
];

// ============================================
// ROTAS COMPARTILHADAS (Personal + Business)
// ============================================
const SHARED_ACCOUNTS: AccountType[] = ['personal', 'business'];

export const SHARED_ROUTES: RouteDefinition[] = [
  // Dashboard
  {
    path: '/:account/dashboard',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'dashboard',
    description: 'Visão geral da conta',
  },

  // Explorar
  {
    path: '/:account/explore',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'explore',
    description: 'Descobrir módulos e funcionalidades',
  },

  // AI Assistant
  {
    path: '/:account/ai',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'ai',
    description: 'Assistente de IA Tymes',
  },
  {
    path: '/:account/ai/chat/:chatId',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'ai',
    feature: 'chat',
    description: 'Conversa específica com IA',
  },

  // Configurações
  {
    path: '/:account/settings',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'settings',
    description: 'Configurações da conta',
  },
  {
    path: '/:account/settings/profile',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'settings',
    feature: 'profile',
    description: 'Editar perfil',
  },
  {
    path: '/:account/settings/security',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'settings',
    feature: 'security',
    description: 'Segurança e senha',
  },
  {
    path: '/:account/settings/notifications',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'settings',
    feature: 'notifications',
    description: 'Preferências de notificação',
  },
  {
    path: '/:account/settings/subscription',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'settings',
    feature: 'subscription',
    description: 'Gerenciar assinatura',
  },

  // Perfil público
  {
    path: '/:account/profile',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'profile',
    description: 'Visualizar perfil próprio',
  },
];

// ============================================
// ROTAS DO MÓDULO SHOP
// ============================================
export const SHOP_ROUTES: RouteDefinition[] = [
  // Rotas compartilhadas (comprador)
  {
    path: '/:account/shop',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'shop',
    description: 'Página inicial do marketplace',
    requiresSubscription: true,
    requiredPlanModules: ['shop'],
  },
  {
    path: '/:account/shop/browse',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'shop',
    feature: 'browse',
    action: 'list',
    description: 'Navegar produtos do marketplace',
    requiresSubscription: true,
  },
  {
    path: '/:account/shop/product/:productId',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'shop',
    feature: 'product',
    action: 'view',
    description: 'Detalhes de um produto',
    requiresSubscription: true,
  },
  {
    path: '/:account/shop/bag',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'shop',
    feature: 'bag',
    description: 'Bolsa de compras',
    requiresSubscription: true,
  },
  {
    path: '/:account/shop/checkout',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'shop',
    feature: 'checkout',
    description: 'Finalizar compra',
    requiresSubscription: true,
  },
  {
    path: '/:account/shop/orders',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'shop',
    feature: 'orders',
    action: 'list',
    description: 'Histórico de pedidos',
    requiresSubscription: true,
  },
  {
    path: '/:account/shop/orders/:orderId',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'shop',
    feature: 'orders',
    action: 'view',
    description: 'Detalhes de um pedido',
    requiresSubscription: true,
  },
  {
    path: '/:account/shop/saves',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'shop',
    feature: 'saves',
    description: 'Produtos salvos',
    requiresSubscription: true,
  },
  {
    path: '/:account/shop/offers',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'shop',
    feature: 'offers',
    description: 'Ofertas e promoções',
    requiresSubscription: true,
  },

  // Rotas exclusivas Business (vendedor)
  {
    path: '/business/shop/inventory',
    allowedAccounts: ['business'],
    module: 'shop',
    feature: 'inventory',
    action: 'list',
    requiredPermissions: ['write'],
    description: 'Gerenciar produtos próprios',
    requiresSubscription: true,
  },
  {
    path: '/business/shop/inventory/create',
    allowedAccounts: ['business'],
    module: 'shop',
    feature: 'inventory',
    action: 'create',
    requiredPermissions: ['write'],
    description: 'Criar novo produto',
    requiresSubscription: true,
  },
  {
    path: '/business/shop/inventory/:productId/edit',
    allowedAccounts: ['business'],
    module: 'shop',
    feature: 'inventory',
    action: 'edit',
    requiredPermissions: ['write'],
    description: 'Editar produto existente',
    requiresSubscription: true,
  },
  {
    path: '/business/shop/sales',
    allowedAccounts: ['business'],
    module: 'shop',
    feature: 'sales',
    action: 'list',
    requiredPermissions: ['read'],
    description: 'Vendas realizadas',
    requiresSubscription: true,
  },
  {
    path: '/business/shop/analytics',
    allowedAccounts: ['business'],
    module: 'shop',
    feature: 'analytics',
    requiredPermissions: ['read'],
    description: 'Analytics de vendas',
    requiresSubscription: true,
  },
  {
    path: '/business/shop/settings',
    allowedAccounts: ['business'],
    module: 'shop',
    feature: 'settings',
    action: 'manage',
    requiredPermissions: ['manage'],
    description: 'Configurações da loja',
    requiresSubscription: true,
  },
];

// ============================================
// ROTAS DO MÓDULO CLASS
// ============================================
export const CLASS_ROUTES: RouteDefinition[] = [
  // Rotas compartilhadas (aluno)
  {
    path: '/:account/class',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'class',
    description: 'Página inicial de cursos',
    requiresSubscription: true,
    requiredPlanModules: ['class'],
  },
  {
    path: '/:account/class/browse',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'class',
    feature: 'browse',
    action: 'list',
    description: 'Explorar cursos disponíveis',
    requiresSubscription: true,
  },
  {
    path: '/:account/class/course/:courseId',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'class',
    feature: 'course',
    action: 'view',
    description: 'Detalhes de um curso',
    requiresSubscription: true,
  },
  {
    path: '/:account/class/enrolled',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'class',
    feature: 'enrolled',
    action: 'list',
    description: 'Meus cursos matriculados',
    requiresSubscription: true,
  },
  {
    path: '/:account/class/course/:courseId/learn',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'class',
    feature: 'learn',
    description: 'Assistir aulas do curso',
    requiresSubscription: true,
  },
  {
    path: '/:account/class/certificates',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'class',
    feature: 'certificates',
    action: 'list',
    description: 'Certificados obtidos',
    requiresSubscription: true,
  },

  // Rotas exclusivas Business (instrutor)
  {
    path: '/business/class/teaching',
    allowedAccounts: ['business'],
    module: 'class',
    feature: 'teaching',
    action: 'list',
    requiredPermissions: ['write'],
    description: 'Área do professor',
    requiresSubscription: true,
  },
  {
    path: '/business/class/teaching/create',
    allowedAccounts: ['business'],
    module: 'class',
    feature: 'teaching',
    action: 'create',
    requiredPermissions: ['write'],
    description: 'Criar novo curso',
    requiresSubscription: true,
  },
  {
    path: '/business/class/teaching/:courseId/edit',
    allowedAccounts: ['business'],
    module: 'class',
    feature: 'teaching',
    action: 'edit',
    requiredPermissions: ['write'],
    description: 'Editar curso existente',
    requiresSubscription: true,
  },
  {
    path: '/business/class/teaching/:courseId/content',
    allowedAccounts: ['business'],
    module: 'class',
    feature: 'content',
    action: 'manage',
    requiredPermissions: ['write'],
    description: 'Gerenciar conteúdo do curso',
    requiresSubscription: true,
  },
  {
    path: '/business/class/students',
    allowedAccounts: ['business'],
    module: 'class',
    feature: 'students',
    action: 'list',
    requiredPermissions: ['read'],
    description: 'Lista de alunos',
    requiresSubscription: true,
  },
  {
    path: '/business/class/analytics',
    allowedAccounts: ['business'],
    module: 'class',
    feature: 'analytics',
    requiredPermissions: ['read'],
    description: 'Analytics de cursos',
    requiresSubscription: true,
  },
];

// ============================================
// ROTAS DO MÓDULO WORK
// ============================================
export const WORK_ROUTES: RouteDefinition[] = [
  // Rotas compartilhadas
  {
    path: '/:account/work',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'work',
    description: 'Página inicial de trabalho',
    requiresSubscription: true,
    requiredPlanModules: ['work'],
  },
  {
    path: '/:account/work/browse',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'work',
    feature: 'browse',
    action: 'list',
    description: 'Explorar serviços disponíveis',
    requiresSubscription: true,
  },
  {
    path: '/:account/work/projects',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'work',
    feature: 'projects',
    action: 'list',
    description: 'Meus projetos',
    requiresSubscription: true,
  },
  {
    path: '/:account/work/projects/:projectId',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'work',
    feature: 'projects',
    action: 'view',
    description: 'Detalhes do projeto',
    requiresSubscription: true,
  },
  {
    path: '/:account/work/tasks',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'work',
    feature: 'tasks',
    action: 'list',
    description: 'Minhas tarefas',
    requiresSubscription: true,
  },

  // Rotas exclusivas Business (prestador)
  {
    path: '/business/work/services',
    allowedAccounts: ['business'],
    module: 'work',
    feature: 'services',
    action: 'list',
    requiredPermissions: ['write'],
    description: 'Meus serviços oferecidos',
    requiresSubscription: true,
  },
  {
    path: '/business/work/services/create',
    allowedAccounts: ['business'],
    module: 'work',
    feature: 'services',
    action: 'create',
    requiredPermissions: ['write'],
    description: 'Criar novo serviço',
    requiresSubscription: true,
  },
  {
    path: '/business/work/team',
    allowedAccounts: ['business'],
    module: 'work',
    feature: 'team',
    action: 'list',
    requiredPermissions: ['manage'],
    description: 'Gerenciar equipe',
    requiresSubscription: true,
  },
  {
    path: '/business/work/analytics',
    allowedAccounts: ['business'],
    module: 'work',
    feature: 'analytics',
    requiredPermissions: ['read'],
    description: 'Analytics de trabalho',
    requiresSubscription: true,
  },
];

// ============================================
// ROTAS DO MÓDULO SOCIAL
// ============================================
export const SOCIAL_ROUTES: RouteDefinition[] = [
  // Rotas compartilhadas
  {
    path: '/:account/social',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'social',
    description: 'Página inicial social',
    requiresSubscription: true,
    requiredPlanModules: ['social'],
  },
  {
    path: '/:account/social/feed',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'social',
    feature: 'feed',
    description: 'Feed de publicações',
    requiresSubscription: true,
  },
  {
    path: '/:account/social/connections',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'social',
    feature: 'connections',
    action: 'list',
    description: 'Minhas conexões',
    requiresSubscription: true,
  },
  {
    path: '/:account/social/messages',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'social',
    feature: 'messages',
    action: 'list',
    description: 'Mensagens',
    requiresSubscription: true,
  },
  {
    path: '/:account/social/messages/:conversationId',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'social',
    feature: 'messages',
    action: 'view',
    description: 'Conversa específica',
    requiresSubscription: true,
  },
  {
    path: '/:account/social/notifications',
    allowedAccounts: SHARED_ACCOUNTS,
    module: 'social',
    feature: 'notifications',
    description: 'Notificações',
    requiresSubscription: true,
  },

  // Rotas exclusivas Business
  {
    path: '/business/social/campaigns',
    allowedAccounts: ['business'],
    module: 'social',
    feature: 'campaigns',
    action: 'list',
    requiredPermissions: ['write'],
    description: 'Campanhas de marketing',
    requiresSubscription: true,
  },
  {
    path: '/business/social/campaigns/create',
    allowedAccounts: ['business'],
    module: 'social',
    feature: 'campaigns',
    action: 'create',
    requiredPermissions: ['write'],
    description: 'Criar campanha',
    requiresSubscription: true,
  },
  {
    path: '/business/social/promotions',
    allowedAccounts: ['business'],
    module: 'social',
    feature: 'promotions',
    action: 'list',
    requiredPermissions: ['write'],
    description: 'Promoções',
    requiresSubscription: true,
  },
  {
    path: '/business/social/analytics',
    allowedAccounts: ['business'],
    module: 'social',
    feature: 'analytics',
    requiredPermissions: ['read'],
    description: 'Analytics social',
    requiresSubscription: true,
  },
];

// ============================================
// ROTAS DO ADMIN (SUPERADMIN)
// ============================================
export const ADMIN_ROUTES: RouteDefinition[] = [
  {
    path: '/admin',
    allowedAccounts: ['admin'],
    module: 'dashboard',
    requiredPermissions: ['admin'],
    description: 'Dashboard administrativo',
  },
  {
    path: '/admin/dashboard',
    allowedAccounts: ['admin'],
    module: 'dashboard',
    requiredPermissions: ['admin'],
    description: 'Visão geral do sistema',
  },
  {
    path: '/admin/users',
    allowedAccounts: ['admin'],
    module: 'users' as AdminModuleSlug,
    feature: 'list',
    action: 'list',
    requiredPermissions: ['admin'],
    description: 'Gerenciar usuários',
  },
  {
    path: '/admin/users/:userId',
    allowedAccounts: ['admin'],
    module: 'users' as AdminModuleSlug,
    feature: 'detail',
    action: 'view',
    requiredPermissions: ['admin'],
    description: 'Detalhes do usuário',
  },
  {
    path: '/admin/users/:userId/edit',
    allowedAccounts: ['admin'],
    module: 'users' as AdminModuleSlug,
    feature: 'edit',
    action: 'edit',
    requiredPermissions: ['admin'],
    description: 'Editar usuário',
  },
  {
    path: '/admin/modules',
    allowedAccounts: ['admin'],
    module: 'modules' as AdminModuleSlug,
    action: 'list',
    requiredPermissions: ['admin'],
    description: 'Gerenciar módulos da plataforma',
  },
  {
    path: '/admin/plans',
    allowedAccounts: ['admin'],
    module: 'plans' as AdminModuleSlug,
    action: 'list',
    requiredPermissions: ['admin'],
    description: 'Gerenciar planos',
  },
  {
    path: '/admin/plans/create',
    allowedAccounts: ['admin'],
    module: 'plans' as AdminModuleSlug,
    action: 'create',
    requiredPermissions: ['admin'],
    description: 'Criar novo plano',
  },
  {
    path: '/admin/analytics',
    allowedAccounts: ['admin'],
    module: 'analytics' as AdminModuleSlug,
    requiredPermissions: ['admin'],
    description: 'Analytics da plataforma',
  },
  {
    path: '/admin/system',
    allowedAccounts: ['admin'],
    module: 'system' as AdminModuleSlug,
    action: 'manage',
    requiredPermissions: ['admin'],
    description: 'Configurações do sistema',
  },
];

// ============================================
// EXPORTAÇÃO CONSOLIDADA
// ============================================
export const ALL_ROUTES: RouteDefinition[] = [
  ...PUBLIC_ROUTES,
  ...SHARED_ROUTES,
  ...SHOP_ROUTES,
  ...CLASS_ROUTES,
  ...WORK_ROUTES,
  ...SOCIAL_ROUTES,
  ...ADMIN_ROUTES,
];

// Helper para encontrar definição de rota
export function findRouteDefinition(path: string): RouteDefinition | undefined {
  // Normaliza o path removendo parâmetros dinâmicos
  const normalizedPath = path.replace(/\/[a-f0-9-]{36}/g, '/:id');

  return ALL_ROUTES.find(route => {
    const routePattern = route.path
      .replace(/:account/g, '(personal|business|admin)')
      .replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(normalizedPath) || regex.test(path);
  });
}

// Helper para obter rota base por tipo de conta
export function getAccountBasePath(profileType: ProfileType): string {
  return `/${PROFILE_TO_ACCOUNT[profileType]}`;
}

// Helper para construir URL com contexto
export function buildRoute(
  accountType: AccountType,
  module: ModuleSlug | AdminModuleSlug,
  feature?: string,
  params?: Record<string, string>
): string {
  let path = `/${accountType}/${module}`;

  if (feature) {
    path += `/${feature}`;
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value);
    });
  }

  return path;
}
