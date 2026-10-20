# SaharaSetu homepage

A local React 19 + TypeScript + Vite homepage, using Tailwind CSS 4, Motion for React, Lucide and React Router DOM 7. Only the homepage is implemented.

## Run

```powershell
npm install
npm run dev
```

Open the Local URL printed by Vite. Production build: `npm run build`.

## Scope and integration points

The supplied ZIP contains 28 PNG design references, not an application repository. The workspace was empty; no existing routes, components or backend were available to integrate.

- Search and category selection open a homepage discovery panel. Filters are preserved in React Router URL search parameters and survive reloads. Topic suggestions are clearly distinguished from actual scheme results.
- Official discovery opens https://www.myscheme.gov.in/search in a new tab. Keywords and category filters are not transferred to that external catalogue.
- Login and Get Started open accessible explanations of the pending account phase. No authentication or onboarding pages have been built.
- English is the only available language. The language control explains this limitation.
- Help opens homepage guidance. Home, About and How It Works navigation are functional.
- Privacy and Terms links are omitted because there are no corresponding routes.
- No personal profile data is collected; no eligibility decisions, government affiliation, live recommendations or scheme-count claims are made.

Connect the future catalogue and auth routes by replacing `discover()` and `openDialog('login' | 'start')` in `src/App.tsx`; retain the existing Router rather than adding another.

## Files

- `src/App.tsx`: typed homepage data, shared branding and arrow components, responsive navigation, search/discovery, homepage sections and native accessible dialogs.
- `src/styles.css`: design tokens, mobile-first composition, content breakpoints and reduced-motion support.
- `src/main.tsx`: React, existing app-level Router and MotionConfig setup.
- `public/assets/citizens-hero.webp`: optimized standalone hero illustration; source PNG retained alongside it.
- `public/favicon.svg`: SaharaSetu brand mark.
- `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`, `package-lock.json`: application setup.
- `references/New folder/`: unmodified supplied design references; never embedded as page screenshots.

## Hero asset provenance

Generated with the built-in image generation tool. Final prompt: a premium editorial illustration of six diverse Indian citizens (student, woman with notebook, farmer, schoolgirl, construction worker, elderly woman) in front of an Indian sandstone government building, warm morning light, navy/teal/mint/saffron palette, pale outer edges, no text or UI. The production WebP is approximately 298 KB, compared with the 2.6 MB source PNG.

Verification evidence and viewport screenshots are in `output/playwright/`; see `VERIFICATION.md` for results and boundaries.
