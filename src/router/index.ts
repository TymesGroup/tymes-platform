/**
 * Router - Exportação centralizada
 *
 * Sistema de rotas hierárquico com:
 * - Tipos e definições de rotas
 * - Guards de proteção (Auth, Account, Module, Permission)
 * - Hooks de contexto de rota
 * - Helpers de navegação
 * - Router principal
 */

// Types
export * from './types';

// Route definitions
export * from './routes';

// Guards
export * from './guards';

// Hooks
export * from './hooks';

// Navigation helpers
export * from './navigation';

// Main router
export { AppRouter } from './AppRouter';
