# Contributing to Tymes Platform

## Code Standards

### TypeScript
- Use strict TypeScript - avoid `any` types
- Define interfaces for all props and data structures
- Use type inference where possible

### React
- Functional components with hooks
- Use design system primitives from `@/design-system/primitives`
- Keep components focused and under 200 lines

### Styling
- Use Tailwind CSS utility classes
- Follow design tokens from `@/design-system/tokens`
- Mobile-first responsive design

### Naming Conventions
- Components: PascalCase (`ProductCard.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Utils: camelCase (`formatPrice.ts`)
- Constants: SCREAMING_SNAKE_CASE

## Project Structure

```
src/
├── components/       # Shared components
├── design-system/    # Design tokens and primitives
├── lib/              # Utilities, hooks, contexts
├── modules/          # Feature modules (shop, class, work, social)
├── router/           # Routing configuration
└── types/            # TypeScript types
```

## Git Workflow

1. Create feature branch from `main`
2. Make changes with clear commits
3. Run `npm run lint` and `npm run type-check`
4. Submit PR with description

## Pre-commit Hooks

Husky runs automatically on commit:
- ESLint fixes
- Prettier formatting

## UI Guidelines

- Use neutral colors (zinc) with indigo-600 accent
- Subtle shadows only (sm, md, lg)
- 44px minimum touch targets on mobile
- All UI text in Portuguese (pt-BR)
