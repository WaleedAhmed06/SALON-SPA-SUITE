# Salon & Spa ERP — Frontend Architecture

Version: 1.0 · Reviewed 3 November 2026 · Application: Maison

Final verification: production build, strict unused-symbol/type checks, formatting and 26 automated tests passed. Browser evidence and responsive scope are recorded in PHASES_AND_ACCEPTANCE.md.

## 1. Purpose and boundaries

This document describes the implemented frontend structure, the ownership rules for extending it, and the path to stronger production boundaries. Read it together with REQUIREMENTS.md and APPROVED_DEVELOPMENT_PLAN.md. The original requirements define functionality; the approved plan defines the seven delivery phases.

The application is a frontend-only commercial demonstration. Next.js supplies routes and rendering. Business records live in Zustand and browser localStorage. There is no application backend, database, real authentication, real payment processing, messaging gateway or live LLM. Server-rendered route composition does not introduce a backend business API.

Four experiences share the same records: Owner, Front Desk, Therapist and Customer. Separate copies of appointments, revenue or inventory must never be maintained for different portals.

## 2. Architecture layers

| Layer             | Responsibility                                                                | Must not own                        |
| ----------------- | ----------------------------------------------------------------------------- | ----------------------------------- |
| App Router        | URL parsing, valid portal selection, root metadata and composition            | Checkout, commission or stock rules |
| Portal shell      | Navigation, responsive sidebar, theme and role controls, notifications/toasts | Copies of business records          |
| Feature screens   | Present records, collect input, run actions, show validation and results      | Independent revenue/stock balances  |
| Feature actions   | Validate domain operations and return the complete next database snapshot     | JSX, routing or browser dialogs     |
| Feature selectors | Derive reports, commissions and filtered views                                | Persistent writes                   |
| Shared UI         | Buttons, modal behavior, badges, calendars and record forms                   | Role-specific financial decisions   |
| Zustand           | Single shared database, demo session, theme and transient booking intent      | Reimplementation of business rules  |
| Data/types/lib    | Seed records, shared record contracts, dates, exports, formatting and tokens  | Feature-screen composition          |

Dependency direction is routes → shell → screens → actions/selectors → types/helpers. Store actions commit the returned snapshot. Shared UI is allowed to consume store data when it is a reusable data-bound renderer, such as record management; it should not import an entire portal.

## 3. Implemented folder layout

```text
salon-erp/
├── docs/
│   ├── APPROVED_DEVELOPMENT_PLAN.md
│   ├── PHASES_AND_ACCEPTANCE.md
│   └── FRONTEND_ARCHITECTURE.md
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── [portal]/[[...section]]/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── portal-shell.tsx
│   │   │   ├── navigation.ts
│   │   │   └── module-router.tsx
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── modal.tsx
│   │   │   └── status-badge.tsx
│   │   ├── forms/
│   │   │   ├── record-management.tsx
│   │   │   ├── record-detail.tsx
│   │   │   ├── record-fields.ts
│   │   │   └── assignment.tsx
│   │   └── calendar/calendar-board.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── actions.ts
│   │   │   └── permissions.ts
│   │   ├── dashboard/components/
│   │   │   ├── dashboard-screen.tsx
│   │   │   └── insights.tsx
│   │   ├── branches/schema.ts
│   │   ├── services/schema.ts
│   │   ├── staff/
│   │   │   ├── schema.ts
│   │   │   └── components/schedule-screen.tsx
│   │   ├── customers/
│   │   │   ├── schema.ts
│   │   │   └── components/profile-screen.tsx
│   │   ├── appointments/
│   │   │   ├── actions.ts
│   │   │   └── components/appointments-screen.tsx
│   │   ├── pos/
│   │   │   ├── actions.ts
│   │   │   ├── types.ts
│   │   │   └── components/pos-screen.tsx
│   │   ├── payments/
│   │   │   ├── actions.ts
│   │   │   └── components/
│   │   │       ├── customer-payment.tsx
│   │   │       └── receipt-view.tsx
│   │   ├── commissions/
│   │   │   ├── selectors.ts
│   │   │   └── components/commissions-screen.tsx
│   │   ├── memberships/
│   │   │   ├── actions.ts
│   │   │   └── schema.ts
│   │   ├── inventory/schema.ts
│   │   ├── suppliers/schema.ts
│   │   ├── expenses/schema.ts
│   │   ├── reports/
│   │   │   ├── selectors.ts
│   │   │   └── components/reports-screen.tsx
│   │   ├── notifications/components/notifications-screen.tsx
│   │   └── chatbot/components/assistant.tsx
│   ├── store/erp-store.ts
│   ├── data/seed.ts
│   ├── types/index.ts
│   └── lib/
│       ├── format.ts
│       ├── time.ts
│       ├── theme.ts
│       ├── validation.ts
│       ├── export.ts
│       ├── labels.ts
│       ├── utils.ts
│       └── compatibility exports: business.ts, data.ts, reports.ts, store.ts
├── tests/
├── REQUIREMENTS.md
├── PHASES.md
├── README.md
├── components.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
└── tsconfig.json
```

The proposed route-group folder names in the approved plan are illustrative. The implementation uses one validated dynamic portal route and a shared shell. This preserves the four URLs and their role-specific experiences without duplicating layouts. Management features share a configurable form renderer; their field definitions are owned by the relevant feature. No empty feature folders are created simply to match a diagram.

Loyalty is currently implemented as a shared ledger updated by payment actions and displayed by the customer profile/POS. It does not need an empty standalone feature directory. Likewise, charts and tables are extracted when they have a reusable responsibility rather than creating unused wrappers.

## 4. Routes and portal composition

| Portal    | Base route      | Sections                                                                                                                                             |
| --------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login     | `/`             | Demo credentials and quick role selection                                                                                                            |
| Owner     | `/admin`        | Dashboard, appointments, branches, services, staff, customers, POS, commissions, memberships, inventory, suppliers, expenses, reports, notifications |
| Reception | `/receptionist` | Dashboard, appointments, customers, services, POS, notifications                                                                                     |
| Therapist | `/staff`        | Dashboard, own appointments, assigned services, schedule, own commissions, notifications                                                             |
| Customer  | `/customer`     | Dashboard, own appointments, services, memberships, profile, notifications                                                                           |

Section names become URL slugs, such as `/admin/billing-pos`, `/customer/my-profile` and `/staff/commissions`. The shell resolves allowed sections using permissions.ts. Unknown portals return the Next.js not-found screen. A persisted role that does not match the requested portal is redirected to its own portal.

The module router lazy-loads feature screens and shows a loading state, keeping unrelated management screens out of the initial view. Navigation waits for route composition rather than opening transient dialogs in a screen that is about to unmount. Booking intent is stored briefly in Zustand so selecting a service can survive navigation and open the correct booking form.

Role checks are demo presentation rules. localStorage and bundled mock data are inspectable. Production confidentiality and authorization cannot be guaranteed by a frontend-only application.

## 5. Domain relationships

| Collection    | Key links / purpose                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| branches      | Location, contact, manager, status and hours                                                         |
| staff         | branch, service assignments, shift, break, weekly off, salary, commission                            |
| services      | branch/staff assignments, duration, price, discount, required resources and consumed product         |
| customers     | Preferred branch, contact, notes, tags, preferences, loyalty balance                                 |
| appointments  | customer, service, staff, branch, date/time, workflow and payment status                             |
| payments      | customer, appointment when relevant, invoice totals, paid amount, method, transaction ID, line items |
| products      | branch, supplier, SKU, current quantity, cost, price and minimum                                     |
| stock         | product, operation, signed quantity, invoice or appointment reference                                |
| memberships   | Plan price, validity, discount, benefits and session allowance                                       |
| enrollments   | customer, plan, expiry and remaining sessions                                                        |
| loyalty       | customer, point delta, reason, invoice and date                                                      |
| expenses      | branch, category, amount, date, description, optional receipt data                                   |
| suppliers     | Contact, address and outstanding amount                                                              |
| leaves        | staff, start/end dates, reason and approval state                                                    |
| reviews       | customer, appointment, service, staff, rating and feedback                                           |
| notifications | Shared demo event feed and read state                                                                |

IDs connect records; display names are resolved at render time. A UI should not duplicate a customer name in every appointment and then attempt to synchronize it after an edit.

RecordData is a flexible, serializable contract used by the generic form engine. Database and Collection are inferred from seed shape. Transaction line items have a dedicated type. This is practical for the demo, but a backend migration should replace flexible entity fields with explicit domain interfaces and validated API DTOs; the document does not claim the demo has a fully normalized production data model.

## 6. State and persistence

`store/erp-store.ts` owns the shared state. Business records, selected role, theme and branch are persisted under `maison-salon-erp-v1`. Booking intent is transient and excluded from persistence. Dialog visibility, field drafts, search queries and pagination remain component state.

First load initializes realistic Pakistani seed data. Rehydration merges missing collections from the current seed shape while preserving stored records. Refresh must not reset purchases, stock changes, bookings or expenses. The shell listens for browser storage events so tabs on the same origin can rehydrate shared demo changes.

`transact(current => next)` evaluates an operation against current state and commits one complete snapshot. Pure actions clone before making multi-record changes. If validation fails, no partially mutated snapshot is committed.

Demo reset requires a confirmation, restores seed records and resets the branch filter. It is intended for presentations. It is not an undo/history service.

Different ports are different browser origins and therefore have separate demo storage. For example, a preview on port 3001 does not overwrite a demo running on port 3000.

## 7. Booking rules

The availability action intersects branch hours with the therapist shift. It then removes weekly days off, approved leave, breaks, existing appointment overlaps and slots too short for the selected service. Slots are offered at 15-minute intervals.

Before commit, validation rechecks customer existence, staff/branch membership, service assignments, the date and selected slot. Rescheduling excludes its own appointment from the conflict test. A paid booking does not generate a second payment when its time is changed. Changes to a paid service are handled through checkout rather than silently changing its price.

The single shared appointment drives every portal. The staff view resolves the assigned therapist identity; the customer view resolves the current demo customer identity. Internal team notes are displayed separately from public booking/service notes.

## 8. Checkout and financial rules

POS builds line items from services and products. Totals derive from quantity × price, discounts/coupon/reward redemption and tax. It creates an invoice and then simulates collection through the selected method. A declined outcome makes no payment or stock mutation.

`settleSale` validates quantities, stock, paid amounts and duplicate processing. Successful settlement updates invoice status, appointment payment/workflow status, sold stock, stock history, loyalty and derived revenue. Service consumption uses the appointment completion action. Errors return before a snapshot is committed.

Partial payments preserve `total - amount` as outstanding. Balance collection updates the existing invoice and credits loyalty thresholds correctly. A second collection is rejected. The demo keeps a cumulative invoice record rather than a full payment-allocation accounting ledger.

Revenue is derived from recorded collected amounts, not from appointment count or a separately incremented dashboard field. Profit/loss is collected revenue minus recorded expenses and is explicitly a demo summary before unrecorded costs.

Receipts expose simulated transaction IDs. CSV is generated from records. PDF downloads are generated directly from records using lazy-loaded jsPDF and AutoTable, with pagination and filter context. Printing receipts remains a separate action. No actual gateway credentials are requested.

## 9. Commissions

A commission is eligible only when the appointment is both Completed and Paid. The service-specific rate takes precedence over the therapist default. Checkout service lines can contribute to the assigned therapist's commission. Commission payout status is stored with the appointment and is visible to the owner and the assigned therapist.

Other employees' salaries and commissions must never appear in the therapist portal. The demo has one predefined staff identity, t0. This is a presentation identity, not a session from an authentication provider.

## 10. Membership, loyalty and inventory

Membership purchase and renewal create an enrollment and a simulated payment. Renewal extends a still-active expiry and adds the plan's sessions. Completion can redeem a selected prepaid session and must not consume it twice. Remaining sessions are currently a total allowance per enrollment; detailed service-specific package balances are a future data-model refinement.

Loyalty earns 10 points per Rs. 1,000 under the demo invoice rule. POS can redeem each 100 points for Rs. 100. The ledger explains subsequent point movements. A seeded opening balance may precede visible ledger entries.

Product stock operations include receipt, issue, adjustment and sales. Low stock derives from current quantity versus minimum. Supplier links allow purchase-history inspection. Treatment consumption and retail sales both create stock-history records. The current quantity is the demo's stock snapshot; historical seed entries are not a full warehouse accounting system.

## 11. Reporting and selectors

Reports live in `features/reports/selectors.ts`. They accept database, report type, branch, date range and staff filter. They return rows; the screen owns chart/table presentation and export controls. Payment staff filtering resolves its appointment association.

The fifteen report families are daily/weekly/monthly revenue, appointments, cancellations, no-shows, customer growth, staff performance, staff commission, service popularity, product sales, inventory, expenses, profit/loss and branch performance. Charts use the same row set as tables where appropriate.

Important consistency rule: do not calculate a report from one dataset and display its summary cards from another date range. Automated reconciliation tests compare report totals with transaction records.

## 12. Design system and accessibility

Dark uses Midnight Navy `#101C2B`, surface `#19283A`, and Champagne Gold `#D5B477`. Light uses Pearl White `#F6FAF7`, white surface `#FFFFFF`, and Emerald `#24735E`. Semantic variables also cover muted text, borders, success, warning, danger, overlays, shadows and six chart colors.

The active theme is applied to the root document and portal container. Native inputs, selects, file controls, placeholders, autofill text, focus indicators, chart tooltips, legends, calendars, modal backdrops and assistant surfaces use the same theme variables. Print mode intentionally uses white paper.

The Button follows the shadcn/Radix Slot/CVA pattern. Custom modal behavior provides an accessible name, dialog semantics, focus containment, Escape closing and focus return. The custom modal and badge are not presented as additional official shadcn package components.

Text/status contrast is tested against all three primary surfaces with a 4.5:1 threshold. This is not a claim of a complete WCAG audit. Reduced-motion preference is respected. Status labels accompany color so meaning is not conveyed by color alone.

Desktop uses a persistent sidebar. Tablet collapses analytical grids. Mobile uses a menu, stacked cards/forms and horizontal scrolling inside data tables/calendars rather than overflowing the page.

## 13. Demo assistant

The assistant is local and scripted. It answers FAQs, service prices, booking guidance, memberships, loyalty, payment information and authorized summary questions from the shared database. It is labelled as a simulated local assistant. Navigation buttons open real allowed screens. There is no external AI request and no claim of a live LLM.

## 14. Testing and delivery gates

- `pnpm test`: Node test runner with tsx loader for domain rules, persistence, seed integrity, reports and theme contrast.
- `pnpm lint`: TypeScript unused-symbol/parameter checks; this is not an ESLint suite.
- `pnpm typecheck`: strict TypeScript compilation without emit.
- `pnpm format:check`: Prettier consistency.
- `pnpm build`: production compilation and route generation.
- Browser checks: four roles, both themes, major CRUD/booking/payment flows, persistence, chatbot and responsive layouts.

A phase is complete only when its acceptance scenario works and relevant checks pass. Pure-rule tests do not substitute for checking dialogs, navigation, forms and responsive layout in the browser. Screenshots and observed browser results should be listed with their actual verification scope.

## 15. Extension policy

Add a feature-owned schema/action/selector before adding a new screen-level business rule. Use existing UI primitives until a distinct reusable responsibility exists. Avoid circular imports, duplicated portal databases and empty abstraction layers. Keep compatibility barrels during a deliberate migration rather than copying implementations into both paths.

Before a real backend is introduced, define explicit entity/DTO schemas, server-side authorization, transactional payment/inventory operations, audit/event records and storage migrations. Those are future architecture decisions, not hidden scope for this frontend demo.
