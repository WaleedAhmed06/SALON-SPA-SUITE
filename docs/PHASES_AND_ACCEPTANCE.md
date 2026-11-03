# Salon & Spa ERP — Complete Phases and Acceptance Plan

Version 1.0 · 3 November 2026 · Project: Maison

## Source of truth and scope

REQUIREMENTS.md is the complete functional specification. APPROVED_DEVELOPMENT_PLAN.md is the reviewed implementation plan. This document expands the seven phases into deliverables, acceptance checks and verification status. The frontend uses Next.js App Router, TypeScript, Tailwind v4, shadcn-style UI, Zustand, localStorage and pnpm.

Four portals share all relevant records. Payments, notifications and the AI assistant are frontend demonstrations. No backend, database, real authentication, real payment gateway, live LLM, email or SMS service is part of the scope.

## Phase overview

| Phase | Scope                    | Implementation status                                                  |
| ----- | ------------------------ | ---------------------------------------------------------------------- |
| 1     | Foundation               | Implemented; build, data, persistence, role and theme checks           |
| 2     | Owner core               | Implemented; management screens, calendars and booking rules           |
| 3     | Reception and operations | Implemented; checkout, payments, receipts and commission flow          |
| 4     | Customer portal          | Implemented; booking, profile, memberships, rewards and reviews        |
| 5     | Staff portal             | Implemented; assigned work, schedule, leave and earnings               |
| 6     | Business management      | Implemented; inventory, suppliers, expenses, reports and notifications |
| 7     | Integration and polish   | Implemented; final verification checks passed                          |

“Implemented” identifies available functionality. It does not mean every field combination has undergone exhaustive browser testing. Verification evidence is listed separately.

## Phase 1 — Foundation

### Deliverables

1. Next.js App Router and strict TypeScript project, pnpm lockfile and Tailwind v4 PostCSS setup.
2. Reusable Button, named modal, status badge, assignment control and shared management renderer.
3. Four demo logins and quick role switching with role-specific navigation.
4. Responsive shared portal shell, sidebar, header, mobile menu and route composition.
5. Persistent light/dark mode, including the login page and native form controls.
6. Shared Zustand database and localStorage persistence; transient booking intent kept separate.
7. Populated role dashboards and chart/widget foundations.
8. Pakistani names, branch locations, phone formats and PKR amounts.

### Seed data acceptance

| Collection            | Minimum | Implemented seed |
| --------------------- | ------: | ---------------: |
| Branches              |       3 |                3 |
| Staff                 |      20 |               24 |
| Services              |      50 |               52 |
| Customers             |     200 |              210 |
| Appointments          |     100 |              126 |
| Products              |      50 |               54 |
| Plans/package records |      20 |               20 |
| Payment transactions  |     100 |              105 |
| Expenses              |      30 |               36 |

### Completion check

All four users can enter their portals, navigate, switch theme and retain shared data after refresh. Wrong credentials show feedback. Staff/customer menus expose only their demo role's screens.

### Evidence and next dependency

Seed/reference tests, store tests, TypeScript and production compilation pass. Browser checks cover all four roles and both themes. Phase 2 builds management actions on this shared state.

## Phase 2 — Owner Core

### Branches

Create, inspect, edit and delete branches. Capture address, contact, email, hours, manager and status. Filter management/dashboard data by branch. Branch detail resolves related staff, appointments, customers, products and revenue.

### Services

Manage categories, description/image URL, duration, prices/discount, status, therapist and branch assignments, instructions/resources and optional consumed product/quantity. Service detail and customer browsing use the same records.

### Staff

Manage profile/contact, designation, assigned branch/services, joining date, working hours, breaks, weekly off, salary, employment status and commission percentage. Inspect performance and leave requests. Approve/reject leave through the staff detail screen.

### CRM

Manage customer identity/contact, birth date, gender, address, branch, notes, preferences, sensitivities and tags. Search/filter records. Resolve visits, appointments, spending, payments, membership and reviews from related collections.

### Appointments

- Daily, weekly and monthly calendar boards.
- Staff-wise, branch-wise and service-wise views plus a searchable list.
- Existing customer and walk-in creation.
- Branch/service/therapist/date/slot booking with confirmation reference.
- Rescheduling, cancellation, confirmation/check-in/progress/completion and no-show states.
- Public notes, separate internal team notes and customer visit history.
- Start/end time and duration information.
- Booking validation uses branch hours, shift, break, weekly off, approved leave, service duration and existing appointments.

### Completion check

Owner creates a valid booking and sees it in the right calendar/group views. An overlapping or unassigned booking is rejected without adding partial records. Editing a record affects connected views.

### Evidence and next dependency

Automated checks cover overlap rejection, self-exclusion during reschedule, week boundaries, branch hours and leave. CRUD and calendar screens are available in both themes. Reception workflow follows in Phase 3.

## Phase 3 — Reception and Operations

### Deliverables

1. Reception dashboard with daily bookings, upcoming work, checked-in/walk-in customers, collections, available staff and pending balances.
2. Appointment search, walk-in registration, check-in, no-show and cancellation.
3. Staff visibility of customer arrival through shared status and notifications.
4. POS customer/appointment selection and service/product cart.
5. Quantity changes/removal, discount, MAISON10 coupon, tax and loyalty redemption.
6. Invoice generation with subtotal, discount, tax, total, collected amount and balance.
7. Cash, card, bank transfer, JazzCash, Easypaisa and wallet simulations.
8. Successful/declined demo outcomes, transaction references and payment-status updates.
9. Partial payments and collection of outstanding balances.
10. Receipt detail, CSV and generated PDF download, plus separate receipt printing.
11. Automatic product stock decrement, customer payment history, loyalty and collected-revenue update.
12. Commissions for completed-and-paid appointments, with service-specific rates, default staff rates and payout tracking.

### Completion check

Reception checks in a booking; staff completes it; reception invoices and collects payment; a receipt is available; the same appointment becomes paid; owner revenue and therapist commission reflect the operation. Repeated payment cannot duplicate stock or revenue.

### Evidence and next dependency

Tests cover checkout arithmetic, atomic rejection on insufficient stock, duplicate prevention, partial-balance rewards and commission eligibility. Browser verification has covered check-in, service progression and simulated receipt creation. Customer self-service is Phase 4.

## Phase 4 — Customer Portal

### Deliverables

- Welcome dashboard, upcoming/past visits, spending, memberships, points, offers and recommendations.
- Browse/search/filter services and open a selected service's booking flow.
- Branch → service → therapist/any available → date → slot → details → payment option → confirmation.
- Own appointment list, calendar/history, details, cancel, reschedule and book-again actions.
- Simulated online payment, dummy transaction ID and payment-history receipts.
- Personal/contact/preferences editing.
- Plan browsing/detail, simulated purchase, renewal, expiry and remaining-session display.
- Reward balance, earning/redemption explanation and point history.
- Review text and service/staff rating linked to a completed appointment.

### Completion check

A customer booking appears for Owner, Front Desk and assigned Therapist. A membership purchase appears in the customer's profile and Owner enrollment details. Refresh preserves both.

### Evidence and next dependency

Automated tests cover purchase/renewal, prepaid-session consumption and paid-booking reschedule without a second payment. Browser checks have covered membership activation/profile visibility and cross-portal booking. Staff-specific operation is Phase 5.

## Phase 5 — Staff Portal

### Deliverables

1. Assigned daily/weekly appointments and relevant customer history/preferences/sensitivities.
2. Staff dashboard: today's work, pending/completed services, working hours, breaks, salary and commissions.
3. Assigned service details, duration, price, instructions and resources.
4. Arrival → start service → complete service workflow with notes.
5. Weekly shift, breaks and weekly off display.
6. Leave request, pending/approved/rejected history and owner approval.
7. Earned, pending and paid commissions and export.
8. Own-data filtering that keeps other staff salary/commission details out of the therapist portal.

### Completion check

Assigned therapist sees reception check-in, starts/completes the appointment and sees commission after full payment. Approved leave removes availability. Package/treatment-stock consumption is applied once.

### Evidence and next dependency

Automated eligibility/leave/completion tests and browser workflow checks cover the main path. Business reporting and inventory oversight follow in Phase 6.

## Phase 6 — Business Management

### Inventory and suppliers

Product CRUD includes image URL, SKU, displayed barcode, category, cost, selling price, quantity, minimum and supplier. Operations support stock receipt, issue, adjustment, treatment consumption and retail sales. History and low-stock indications update from the shared records. Supplier details include contact/address, purchase-history inspection and outstanding amount.

### Expenses

Create/edit/delete categorized expenses, date, amount and description. Attach a small image/PDF receipt to local demo storage and download it from details. Review history, category/chart views and totals through management/report screens.

### Membership and commission administration

Manage plan price, validity, discount, benefits, sessions and active state. Inspect enrolled customers. Manage staff/service rates and mark commissions paid. Customer purchase and staff completion remain connected to these records.

### Reporting

Daily/weekly/monthly revenue; appointments; cancellations; no-shows; customer growth; staff performance; commissions; service popularity; product sales; inventory; expenses; profit/loss; branch performance. Provide applicable date, branch and staff filters, tables/charts, CSV and print/PDF actions.

### Dashboards and notifications

Business KPIs, daily/monthly revenue, appointment statistics, service popularity, staff performance, customer growth and payment methods. Widgets include today's/upcoming visits, recent payments, team/services, low stock, new customers, balances and activity. In-app notification center and action feedback accompany shared operations.

### Completion check

Adding stock, selling a product, collecting payment and recording an expense produce consistent stock, transaction, report and dashboard values. Filtering a report changes the relevant rows and summary.

### Evidence and next dependency

All fifteen report types have automated coverage; revenue reconciliation, branch/date filters and product-sales rows are checked. Browser checks have verified product creation, stock receipt, sale, quantity decrement and shared reporting screens. Phase 7 checks the full presentation experience.

## Phase 7 — Integration and Final Polish

### Required final checks

- Run all six cross-portal scenarios below.
- Desktop, tablet and mobile navigation and layout checks.
- Both palettes across all allowed role screens, charts, tables, forms, calendars, dialogs, receipts, toasts and assistant.
- Validation, focus behavior, Escape handling, empty/loading states and reduced-motion support.
- Refresh persistence, role switching, branch reset on role switch, same-origin tab rehydration and confirmed demo reset.
- Scripted/local AI assistant label, FAQ answers and working navigation controls.
- Source handoff, setup instructions, architecture document and phase status.
- Strict TypeScript, unused-symbol checks, formatting, production build and business tests.

### Six final demo scripts

| Scenario          | Steps                                                                    | Expected result                                                   |
| ----------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Booking           | Customer books Haircut; switch to Owner/Reception/assigned Therapist     | Same reference, service, staff, date and status                   |
| Check-in/checkout | Reception checks in; Therapist starts/completes; Reception invoices/pays | Receipt, paid booking, updated customer history and revenue       |
| Commission        | Complete and fully pay a service; open therapist and owner commissions   | Correct service/staff rate; no commission while unpaid/partial    |
| Membership        | Customer purchases Gold; inspect profile; switch Owner                   | Active enrollment, remaining sessions, expiry and payment         |
| Inventory         | Owner adds product and stock; POS sells one; inspect reports             | Quantity reduced exactly once and product-sale row recorded       |
| Analytics         | Create payment/expense/booking changes; filter reports                   | Correct totals from current shared records, including profit/loss |

### Verification record

Final verification completed on 3 November 2026.

| Check                              | Result                                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| Automated suite                    | 26 tests passed                                                                              |
| Strict TypeScript / unused symbols | Passed (`pnpm lint`)                                                                         |
| Formatting                         | Passed (`pnpm format:check`)                                                                 |
| Production build                   | Passed (`pnpm build`)                                                                        |
| Desktop themes                     | Owner management pages and every allowed screen of all other roles checked in dark and light |
| Mobile                             | 64 role/screen/theme combinations at 390 × 844; no page overflow                             |
| Tablet                             | 13 key role/screen combinations at 820 × 1180; no page overflow                              |
| Dialogs                            | Correct surface/text/native-control color scheme in both themes; Escape closes               |
| Booking and checkout               | Customer Haircut booking → Reception check-in → Staff start/complete → JazzCash paid receipt |
| Commission                         | The same Haircut generated Rs. 300 at 20%                                                    |
| Membership/persistence             | Gold purchase showed seven sessions/expiry and survived refresh                              |
| Inventory/report                   | Product created at 10 units, sale reduced it to 9, sales report recorded one unit/Rs. 1,500  |
| Analytics                          | Rs. 1,000 expense increased expenses and reduced profit by exactly Rs. 1,000                 |
| Assistant                          | Local demo label, payment FAQ response and navigation controls verified                      |
| Final smoke                        | Monthly calendar, commission-month filter and lazy-loaded screens rendered                   |
| Browser errors                     | No captured error logs in the final preview                                                  |

All seven phases are implemented and the listed acceptance checks passed. This is targeted workflow and responsive verification, not an exhaustive accessibility audit or every-input-combination test. Detailed service-specific prepaid-package sub-balances and a full payment-allocation accounting ledger remain outside the current simplified demo data model; see the architecture handoff boundaries.

## Demo accounts and run instructions

All passwords: `123456`. Owner: admin@salondemo.com; Reception: reception@salondemo.com; Therapist: staff@salondemo.com; Customer: customer@salondemo.com.

Use `pnpm install`, `pnpm dev`, then open http://127.0.0.1:3000. Production: `pnpm build`, then `pnpm start`. If port 3000 is already occupied, use `pnpm exec next start --hostname 127.0.0.1 --port 3001`. Each origin keeps separate demo data.

## Handoff boundaries

This is a functioning frontend demonstration. Session-level package allowances, cumulative invoice records, browser-local identity and client-generated PDF export are deliberate demo implementations. A real product will need explicit entity/API schemas, server authorization, payment allocation/audit records and transactional persistence. Those future services are outside these seven frontend phases.

## Export correction — 3 November 2026

Replaced print-only PDF actions with generated PDF downloads for reports, receipts and booking confirmations. CSV downloads now use a retained object URL, attached download link, UTF-8 BOM and CRLF rows. Empty filters produce an explanatory record instead of an empty file. Receipt exports include customer and branch names, line items and balance. Four additional export tests cover CSV quoting, empty datasets, every report family and receipt content. Actual browser downloads were verified: Daily Revenue.csv contains 108 records aggregated to PKR 330,000; Daily Revenue.pdf is a valid one-page PDF with the same date and total.
