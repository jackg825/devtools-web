# Project guidance

## Architecture and compatibility

- This is a Next.js static export. Keep `output: 'export'`, trailing-slash routes, and unoptimized images compatible with static hosting; generated output is `out/`.
- Routes live in `src/app/[locale]/`. `src/i18n/routing.ts` defines `en` and `zh`, with `zh` as default and an always-present locale prefix. Update both `messages/en.json` and `messages/zh.json` for user-facing text.
- Tools are organized by feature under `src/components/`, `src/stores/`, `src/hooks/`, and `src/types/`. When adding a tool, wire its route and sidebar navigation as well as translations.
- Zustand stores intentionally use `skipHydration: true`, explicit rehydration, and `partialize`. Preserve their storage keys and selected persisted fields. Input code, QR payloads, and image-tools source/processed images are excluded; QR logo images are intentionally persisted. Use the existing atomic selectors and shallow grouped selectors.
- Preserve DOMPurify sanitization before rendering Shiki output in `src/components/code-canvas/CodeDisplay.tsx`.
- Use the existing Radix/CVA components, `cn()` from `src/lib/utils.ts`, and `@/*` imports. Styling uses Tailwind CSS 3 via `postcss.config.mjs`; check package/config files before applying version-specific recipes.

## Development and checks

Use the committed npm lockfile (`npm ci`). `npm run dev` starts Next development; `npm run lint` checks `src/`; `npm run build` produces the static export. For application changes, run lint and build, then exercise the affected tool, locale, persisted settings, and exports as relevant. There is no automated test script in `package.json`.

`npm start` is defined as `next start`, which does not serve this static export; use a static file server for `out/` when checking the built site. Do not hand-edit `.next/`, `out/`, or `next-env.d.ts`.
