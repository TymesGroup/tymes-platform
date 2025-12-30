# Sistema de Rotas - Tymes Platform

## Estrutura Hierárquica

```
/{account-type}/{module}/{feature}/{action}
```

### Exemplos de URLs

| URL | Descrição | Quem acessa |
|-----|-----------|-------------|
| `/personal/dashboard` | Dashboard pessoal | Conta pessoal |
| `/business/shop/inventory` | Inventário de produtos | Conta business |
| `/business/shop/inventory/create` | Criar produto | Conta business |
| `/admin/users` | Gerenciar usuários | Superadmin |

## Tipos de Conta (Account Types)

| Tipo | ProfileType | Descrição |
|------|-------------|-----------|
| `personal` | PERSONAL | Usuário individual/consumidor |
| `business` | BUSINESS | Conta empresarial/vendedor |
| `admin` | SUPERADMIN | Administrador da plataforma |

## Guards de Proteção

### 1. AuthGuard
Verifica se o usuário está autenticado.
- Redireciona para `/auth/login` se não autenticado
- Preserva URL de retorno no state

### 2. AccountGuard
Verifica se o tipo de conta corresponde à rota.
- Redireciona para o dashboard correto se tipo não corresponder
- Corrige automaticamente URLs com tipo errado

### 3. ModuleGuard
Verifica acesso ao módulo baseado em:
- Módulo ativo na plataforma
- Módulo habilitado no perfil
- Módulo incluído no plano

### 4. PermissionGuard
Verifica permissões granulares:
- `read` - Leitura
- `write` - Escrita
- `delete` - Exclusão
- `manage` - Gerenciamento
- `admin` - Administração

## Módulos Disponíveis

### Módulos Compartilhados (Personal + Business)
- `dashboard` - Visão geral
- `explore` - Descobrir módulos
- `ai` - Assistente IA
- `settings` - Configurações
- `profile` - Perfil

### Módulos de Funcionalidade
- `shop` - Marketplace
- `class` - Cursos online
- `work` - Projetos e serviços
- `social` - Rede social

### Módulos Admin
- `users` - Gerenciar usuários
- `modules` - Gerenciar módulos
- `plans` - Gerenciar planos
- `analytics` - Analytics
- `system` - Configurações do sistema

## Hooks Disponíveis

### useRouteContext
```tsx
const { accountType, module, feature, permissions } = useRouteContext();
```

### useContextualNavigation
```tsx
const { navigate, navigateToModule, navigateToDashboard } = useContextualNavigation();
```

### useBreadcrumbs
```tsx
const breadcrumbs = useBreadcrumbs();
// [{ label: 'Dashboard', path: '/personal/dashboard' }, ...]
```

### useAccountType
```tsx
const { accountType, isBusiness, isPersonal, isAdmin } = useAccountType();
```

### usePermissions
```tsx
const { hasPermission, hasAllPermissions } = usePermissions();
```

## Navegação Programática

```tsx
import { navigateTo, buildUrl } from '../router';

// Navegar para URL
navigateTo('/business/shop/inventory');

// Construir URL
const url = buildUrl(ProfileType.BUSINESS, 'shop', 'inventory');
```

## Definições de Rotas

Todas as rotas estão definidas em `src/router/routes.ts` com:
- `path` - Caminho da rota
- `allowedAccounts` - Tipos de conta permitidos
- `requiredPermissions` - Permissões necessárias
- `module` - Módulo ao qual pertence
- `feature` - Feature específica
- `action` - Ação (create, edit, view, list)
- `description` - Descrição para documentação
- `requiresSubscription` - Se requer assinatura
