# Maison · Salon & Spa ERP

Frontend-only demonstration. No server authentication, real payments, email or SMS.

## Run

Requires Node 20.9+ and pnpm.

```
pnpm install
pnpm dev
```

Visit http://127.0.0.1:3000. For a production preview: `pnpm build` then `pnpm start`.

## Demo accounts

All passwords: `123456`.

- Owner: admin@salondemo.com
- Front desk: reception@salondemo.com
- Therapist: staff@salondemo.com
- Customer: customer@salondemo.com

Quick role selection and the workspace role selector keep demo changes shared. Staff demo identity: Ayesha Khan (t0); customer demo identity: Ayesha Khan (c0). All changes are stored in browser localStorage under maison-salon-erp-v1.

## Checks

`pnpm test` validates demo data and business rules. `pnpm build` checks production compilation and TypeScript. Browser test script: `node tests/browser.cjs` while the server runs and a Playwright Chromium installation is available.

See REQUIREMENTS.md and PHASES.md for scope and verification status.

## Architecture and phase documentation

- [Approved plan](docs/APPROVED_DEVELOPMENT_PLAN.md)
- [Complete phases and acceptance](docs/PHASES_AND_ACCEPTANCE.md)
- [Detailed frontend architecture](docs/FRONTEND_ARCHITECTURE.md)

Business actions and selectors live under `src/features`. The shared state is in `src/store`, seed data in `src/data`, and routing/layout composition in `src/app` and `src/components/layout`. Management feature schemas feed the reusable form renderer.

## Presentation controls

Use the header to switch roles or themes. The sidebar contains **Reset demo data**, with confirmation. Reset restores the sample dataset; ordinary refresh preserves changes. Ports use separate localStorage, so a preview on 3001 has its own demo records.

`pnpm lint` runs strict unused-symbol TypeScript checks, `pnpm typecheck` checks types, and `pnpm format:check` checks formatting. Install a Playwright Chromium browser before using the standalone browser script; optionally set `SALON_CHROMIUM_PATH` and `SALON_BASE_URL` for your environment. Final browser verification in this session used the built-in browser.
