# Design Document

## Overview

Este documento detalha a arquitetura técnica e decisões de design para a refatoração completa da plataforma Tymes. O foco é criar uma base de código limpa, performática e uma interface moderna e sofisticada.

## Architecture

### Design System Architecture

```
src/
├── design-system/
│   ├── tokens/
│   │   ├── colors.ts          # Paleta de cores neutra
│   │   ├── typography.ts      # Escala tipográfica
│   │   ├── spacing.ts         # Tokens de espaçamento
│   │   └── shadows.ts         # Níveis de elevação
│   ├── primitives/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   └── index.ts
```

### Refactored App Architecture

```
src/
├── app/
│   ├── providers/            # Providers compostos
│   ├── router/               # Router simplificado
│   └── App.tsx
├── features/                 # Feature-based modules
│   ├── auth/
│   ├── shop/
│   ├── dashboard/
│   └── ...
├── shared/
│   ├── hooks/
│   ├── utils/
│   └── components/
└── design-system/
```

## Components and Interfaces

### Design Tokens Interface

```typescript
// src/design-system/tokens/colors.ts
export const colors = {
  // Neutral palette
  zinc: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
  // Single accent color
  accent: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
} as const;

// src/design-system/tokens/typography.ts
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// src/design-system/tokens/spacing.ts
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  24: '6rem',     // 96px
} as const;

// src/design-system/tokens/shadows.ts
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
} as const;
```

### Primitive Components Interface

```typescript
// Button Component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// Input Component
interface InputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Card Component
interface CardProps {
  variant: 'default' | 'elevated' | 'outlined';
  padding: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// Modal Component
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
}
```

### Refactored Auth Hooks

```typescript
// src/features/auth/hooks/useSession.ts
interface UseSessionReturn {
  session: Session | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

// src/features/auth/hooks/useProfile.ts
interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  update: (data: ProfileUpdateData) => Promise<void>;
}

// src/features/auth/hooks/useAccounts.ts
interface UseAccountsReturn {
  accounts: StoredAccount[];
  currentAccount: StoredAccount | null;
  switchAccount: (id: string) => Promise<void>;
  addAccount: (email: string, password: string) => Promise<void>;
  removeAccount: (id: string) => void;
}
```

## Data Models

### Theme Configuration

```typescript
interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  accentColor: keyof typeof colors.accent;
  radius: 'none' | 'sm' | 'md' | 'lg';
  density: 'compact' | 'default' | 'comfortable';
}
```

### Animation Configuration

```typescript
interface AnimationConfig {
  duration: {
    fast: 150;
    normal: 200;
    slow: 300;
  };
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)';
    in: 'cubic-bezier(0.4, 0, 1, 1)';
    out: 'cubic-bezier(0, 0, 0.2, 1)';
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system.*

### Property 1: Design Token Consistency
*For any* UI component rendered in the application, all visual properties (colors, spacing, typography) SHALL reference design tokens and not hardcoded values.
**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: Component Size Constraints
*For any* React component file in the codebase, the line count SHALL be less than or equal to 200 lines.
**Validates: Requirements 4.5**

### Property 3: Type Safety
*For any* TypeScript file in the production codebase, there SHALL be zero occurrences of the `any` type.
**Validates: Requirements 7.4**

### Property 4: Bundle Size Limits
*For any* lazy-loaded module, the individual chunk size SHALL be less than 50KB gzipped.
**Validates: Requirements 5.1, 5.2**

### Property 5: Animation Accessibility
*For any* animation in the application, WHEN prefers-reduced-motion is enabled, the animation duration SHALL be 0ms.
**Validates: Requirements 8.6**

### Property 6: Touch Target Size
*For any* interactive element on mobile viewport, the touch target size SHALL be at least 44x44 pixels.
**Validates: Requirements 10.4**

### Property 7: Console Statement Removal
*For any* production build, there SHALL be zero console.log statements in the output bundle.
**Validates: Requirements 6.2**

## Error Handling

### UI Error Boundaries

```typescript
// Wrap each feature module with error boundary
<ErrorBoundary fallback={<ModuleErrorFallback />}>
  <LazyModule />
</ErrorBoundary>
```

### API Error Handling

```typescript
// Standardized error response handling
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

function handleApiError(error: ApiError): void {
  // Log to monitoring service
  // Show user-friendly toast
  // Track in analytics
}
```

## Testing Strategy

### Unit Tests
- All design tokens validation
- Utility functions (formatting, validation)
- Custom hooks behavior
- Component rendering with different props

### Integration Tests
- Authentication flows
- Cart operations
- Checkout process
- Navigation guards

### Visual Regression Tests
- Design system components
- Critical pages (landing, dashboard, shop)
- Dark/light mode switching

### Performance Tests
- Bundle size monitoring
- Lighthouse CI integration
- Core Web Vitals tracking

### Property-Based Tests
- Design token usage validation
- Component prop combinations
- Animation accessibility compliance
