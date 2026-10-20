# Homepage verification — 14 October 2026

## Build

`npm run build` passed after the final source changes: TypeScript checked successfully, Vite built 1,993 modules. CSS approximately 26 KB and JavaScript approximately 422 KB before gzip. Vite dev server returned and rendered the homepage at http://127.0.0.1:5173/.

## Browser verification

Chromium through Playwright CLI. Full-page screenshots captured and visually inspected:

| Requested viewport | Page overflow | Header overflow | Hero loaded | Search/category/dialog checks |
| --- | --- | --- | --- | --- |
| 1440 × 900 | None | None | Yes | Passed |
| 1280 × 800 | None | None | Yes | Passed |
| 768 × 1024 | None | None | Yes | Passed |
| 390 × 844 | None | None | Yes | Passed |
| 360 × 800 | None | None | Yes | Passed |

960 × 800 was also checked for layout overflow and the compact desktop language control.

Verified interactions: How It Works navigation; logo home navigation; mobile menu open/close, Escape and closing on selection; query submission and URL state; category selection; reload persistence; clear filters; browser Back; Get Started explanation dialogs at all five viewports; Login, language and Help explanation dialogs; dialog Escape; empty search state; reduced-motion rendering; zero `href="#"` placeholder links. Mobile dialog and menu screenshots were inspected. No browser JavaScript errors were reported. Motion logged its expected development warning after reduced-motion emulation was enabled.

The first menu test checked removal before its 180 ms exit animation completed. It was corrected to wait for the menu to become hidden; the complete viewport interaction check then passed.

## Evidence

`output/playwright/home-{width}.png`, `dialog-{width}.png`, `menu-mobile.png`, and `empty-mobile.png`. Playwright CLI snapshots and console evidence are in `.playwright-cli/`.

## Limitations

This checks the homepage in Chromium, not a full cross-browser or screen-reader audit. Backend scheme results, authentication, onboarding, real eligibility checks and translations are unavailable. Search filters only the homepage's topic suggestions; official myScheme search opens separately without transferring filters. No other application page has been created. Privacy and Terms links were omitted because no routes exist.
