# Tymes Platform

Plataforma modular para gestão de negócios com módulos de Shop, Class, Work e Social.

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

## Environment Variables

Create a `.env.local` file with:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-key  # optional
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking

## Documentation

Additional documentation is available in the `/docs` folder:
- Migration guides
- Testing guides
- Implementation details

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Supabase
- Recharts
