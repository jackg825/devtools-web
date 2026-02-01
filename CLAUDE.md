# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production (static export to /out)
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture Overview

DevTools is a Next.js 16 web application providing developer utilities (Code Canvas, QR Generator). It uses static export (`output: 'export'`) with i18n routing.

### Key Patterns

**Routing & i18n**: All routes are locale-prefixed (`/en/...`, `/zh/...`). Default locale is `zh`. Routes defined in `src/app/[locale]/`. The `next-intl` plugin handles routing via `src/i18n/`.

**State Management**: Zustand stores with `persist` middleware for localStorage. Stores use `skipHydration: true` to avoid SSR mismatches. Each store exports atomic selectors (`useCode`, `useTheme`) and grouped selectors (`usePreviewSettings`) for optimized re-renders.

**UI Components**: Radix UI primitives in `src/components/ui/` styled with Tailwind CSS v4 and `class-variance-authority`. Use `cn()` from `@/lib/utils` to merge class names.

**Feature Organization**: Each tool (code-canvas, qr-generator) has its own:
- Page: `src/app/[locale]/[feature]/page.tsx`
- Components: `src/components/[feature]/`
- Store: `src/stores/[feature]Store.ts`
- Types: `src/types/[feature].ts`
- Hooks: `src/hooks/use[Feature].ts`

### Path Alias

Use `@/*` for imports from `./src/*` (e.g., `import { cn } from '@/lib/utils'`)

### Styling

- Tailwind CSS v4 with `@tailwindcss/postcss`
- CSS variables defined in `src/app/globals.css`
- Apple-inspired design system (Inter font, subtle shadows)
- Code fonts: JetBrains Mono, Fira Code, Source Code Pro, IBM Plex Mono

### Adding New Tools

1. Create page at `src/app/[locale]/[tool-name]/page.tsx`
2. Add components in `src/components/[tool-name]/`
3. Create Zustand store with persist middleware in `src/stores/`
4. Add translations to `messages/en.json` and `messages/zh.json`
5. Add navigation link in sidebar

### Key Dependencies

- **shiki**: Code syntax highlighting
- **qr-code-styling**: QR code generation
- **html-to-image**: Export components as images
- **next-intl**: i18n with Server Components
- **zustand**: State management with persistence
