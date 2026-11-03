# SALON & SPA MANAGEMENT ERP

## Frontend Development Plan & Architecture

**Project:** Frontend-only, interactive ERP demo  
**Technology:** Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, localStorage, pnpm  
**Dark theme:** Midnight Navy & Champagne Gold  
**Light theme:** Emerald Green & Pearl White

## 1. Project Goal

Build a complete, responsive Salon & Spa ERP demo with four connected portals: **Admin/Owner, Receptionist, Staff, and Customer**. All actions must work with shared mock data and persist after browser refresh. The demo must feel like commercial software, not a set of static screens.

**Included:** every module in the original requirements, simulated payment methods, and the separately requested demo AI chatbot.  
**Not included:** backend, database, real authentication, real payment transactions, SMS/email services, or a live AI API.

## 2. Development Phases

### Phase 1 — Foundation

- Initialize Next.js, TypeScript, Tailwind v4, shadcn/ui and pnpm.
- Configure both approved themes and a persistent theme toggle.
- Create responsive application layouts, navigation and four demo logins with role switching.
- Prepare shared mock records, Zustand state and localStorage persistence.
- Build initial dashboard screens and reusable UI components.

**Done when:** all four roles can enter their portals, navigate, switch themes, and see consistent sample data.

### Phase 2 — Admin Core

- Branches: create, edit, delete, hours, managers and branch filtering (at least 3 branches).
- Services: categories, images, prices, discounts, durations, staff and branch assignments.
- Staff: profiles, assigned services, shifts, breaks, leave, salaries and commission rates.
- Customers: profiles, tags, notes, visit history and search/filter.
- Appointments: day/week/month calendars; staff, branch and service views; booking, rescheduling, cancellation, status changes and history.
- Prevent overlapping staff appointments using working hours, breaks, existing bookings and service duration.

**Done when:** Admin can manage records and create conflict-free appointments that appear in the relevant views.

### Phase 3 — Reception & Operations

- Reception dashboard, daily activity and walk-in customer registration.
- Appointment search, confirmation, check-in, cancellation and no-show workflow.
- Billing/POS: services, products, quantities, discounts, coupons, tax and invoices.
- Simulated payments: cash, card, bank transfer, JazzCash, Easypaisa and wallet; support partial payment and balance due.
- Printable receipts, transaction history and payment status updates.
- Staff commission calculations for completed and paid services.

**Done when:** a receptionist can check in a customer, complete checkout, generate a receipt, and see linked updates.

### Phase 4 — Customer Portal

- Customer dashboard, profile, history and personalized offers.
- Online booking: branch → service → staff → date → available slot → details → payment option → confirmation.
- View, cancel, reschedule and repeat bookings.
- Simulated online payment and payment history.
- Memberships/packages: browse, purchase, renew, expiry and remaining sessions.
- Loyalty points, rewards redemption, reviews and ratings.

**Done when:** customer actions appear in Admin and Reception views using the same stored records.

### Phase 5 — Staff Portal

- Staff dashboard with assigned appointments, schedule, breaks and earnings.
- Daily/weekly appointments and relevant customer service notes.
- Start and complete services; update service notes.
- Leave requests and approved leave views.
- View earned, pending and paid commissions; restrict private financial information.

**Done when:** staff can finish assigned work and see correct appointment and commission changes.

### Phase 6 — Business Management

- Products/inventory: CRUD, SKU, stock in/out, adjustments, low-stock alerts and sales history.
- Suppliers: profiles, purchase history and outstanding payments.
- Expenses: categories, receipt attachment demo, history and summaries.
- Membership and commission administration where not already completed.
- Reports: revenue, appointments, cancellations, no-shows, customers, staff, commissions, services, products, inventory, expenses, profit/loss and branches.
- Dashboard charts, date/branch/staff filters, CSV/PDF demo export actions.
- In-app notifications and toast messages for relevant events.

**Done when:** sales, payments, stock, expenses and reports show consistent values.

### Phase 7 — Integration & Final Polish

- Verify all six documented end-to-end demo scenarios across the four portals.
- Complete responsive behavior on desktop, tablet and mobile.
- Finalize validation, dialogs, empty states, loading states and consistent theme styling.
- Add the requested **AI chatbot demo** for service FAQs, booking guidance and navigation using predefined responses/mock data. Clearly label it as simulated, not a live LLM.
- Verify localStorage persistence and provide demo reset if needed for presentations.
- Deliver source code and clear setup/run instructions.

**Done when:** the complete demo works after refresh and each major workflow can be shown to a client.

## 3. Frontend Architecture

### 3.1 Approach

Use **Next.js App Router with feature-based modules**. Pages handle routing and composition; feature modules contain business UI and logic; a shared data layer owns mock records and localStorage. Keep components reusable, and keep business rules out of visual components.

### 3.2 Proposed Folder Layout

```text
salon-erp/
├── public/                         # Images and static assets
├── src/
│   ├── app/                        # Next.js routes and layouts
│   │   ├── (auth)/login/
│   │   ├── (admin)/admin/
│   │   ├── (reception)/reception/
│   │   ├── (staff)/staff/
│   │   ├── (customer)/customer/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives
│   │   ├── layout/                 # Sidebar, header, role shell
│   │   ├── forms/
│   │   ├── tables/
│   │   ├── charts/
│   │   └── calendar/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── branches/
│   │   ├── services/
│   │   ├── staff/
│   │   ├── customers/
│   │   ├── appointments/
│   │   ├── pos/
│   │   ├── payments/
│   │   ├── commissions/
│   │   ├── memberships/
│   │   ├── loyalty/
│   │   ├── inventory/
│   │   ├── suppliers/
│   │   ├── expenses/
│   │   ├── reports/
│   │   ├── notifications/
│   │   └── chatbot/
│   ├── store/                       # Shared Zustand state
│   ├── data/                        # Pakistani mock seed records
│   ├── lib/                         # Storage, dates, money, helpers
│   ├── hooks/
│   └── types/                       # Shared TypeScript types
├── package.json
└── README.md
```

Each `features/<module>/` can contain `components/`, `types.ts`, `selectors.ts` and `actions.ts` as needed. Do not create empty folders or abstractions before they are useful.

### 3.3 State and Data Flow

- Keep **shared business records** in Zustand; persist relevant records to localStorage.
- Seed realistic records on first launch; never overwrite user changes on ordinary refresh.
- Derive dashboard totals, reports and balances from transactions and records, rather than maintaining conflicting copies.
- Use IDs to connect appointments with customers, staff, services, branches and payments.
- Keep short-lived UI state (open dialog, selected tab) inside components unless shared.
- Place booking, checkout and stock-change rules in feature actions, not inside page components.

### 3.4 Roles and Navigation

- **Admin:** all management and reporting modules.
- **Receptionist:** bookings, check-in, customers, POS and daily operations.
- **Staff:** own schedule, appointments, service completion and earnings.
- **Customer:** own bookings, payments, memberships, loyalty, reviews and profile.

Role-based visibility is a **demo UI rule**, not real security. Real authorization will require a backend later.

### 3.5 Booking Logic

Available slots must consider branch hours, staff shifts, breaks, service duration and already-booked appointments. On booking or rescheduling, recheck conflicts before saving. Update the shared appointment record so every relevant portal sees the same status.

### 3.6 Payments and Commissions

Payment methods are **simulated**. A successful demo checkout creates a payment record, updates invoice balance/status, customer history and derived revenue. Partial payments keep an outstanding balance. Commission calculations should use the applicable staff/service rate and only the defined completed-and-paid workflow. No real credentials or gateway calls.

### 3.7 AI Chatbot Demo

A small floating assistant should answer predefined salon FAQs, explain services, guide booking steps and help navigate screens. Use local data and scripted responses; clearly distinguish this from a real AI model. A live LLM can be integrated later if a backend is added.

### 3.8 Design System

- **Dark:** Midnight Navy `#101C2B`, dark surface `#19283A`, Champagne Gold `#D5B477`.
- **Light:** Pearl White `#F6FAF7`, white surface `#FFFFFF`, Emerald `#24735E`.
- Use shared semantic tokens for background, surface, text, border, accent and statuses.
- Apply both themes consistently to all portals, forms, charts, calendars, tables, dialogs and mobile screens.

## 4. Mock Data Targets

| Record                           | Minimum |
| -------------------------------- | ------: |
| Branches                         |       3 |
| Staff                            |     20+ |
| Services                         |     50+ |
| Customers                        |    200+ |
| Appointments                     |    100+ |
| Products                         |     50+ |
| Membership plans/package records |     20+ |
| Payment transactions             |    100+ |
| Expense records                  |     30+ |

Use realistic Pakistani names, contact formats, branch locations and PKR pricing.

## 5. Essential Cross-Portal Demo Flows

1. **Customer booking:** Customer creates appointment → Admin and Reception see it → assigned Staff sees it.
2. **Check-in and checkout:** Reception checks in → Staff starts/completes service → Reception invoices and accepts demo payment → receipt and revenue update.
3. **Commissions:** Completed and paid service updates the assigned staff member's commission and Admin commission report.
4. **Membership:** Customer purchases a demo package → remaining sessions and expiry appear → Admin sees membership record.
5. **Inventory:** Admin adds stock → POS sells product → stock decreases → inventory and sales reports update.
6. **Analytics:** Booking, payment, stock and expense changes are reflected in relevant dashboard totals and reports.

## 6. Implementation Rules

- Follow the **original requirements document** as the functional source of truth; this plan only organizes its implementation.
- Do not add unrelated business modules or real integrations.
- Every important button must perform its advertised demo action; avoid decorative/nonfunctional controls.
- Validate forms, prevent invalid booking conflicts and show clear feedback.
- Check mobile responsiveness, navigation, persistence and cross-portal updates at the end of each phase.
- Use basic lint/typecheck/build checks and practical workflow tests; testing tools may be selected during implementation.
- Finish each phase with a short summary of completed features, verification and remaining work.

## 7. Local Project Handoff

**Authorized project folder:** `/Users/waleed/Desktop/Salon ERP` (Work must have permission in its own session).

**Suggested Work instruction:** Read the original Salon & Spa ERP requirements and this plan. Inspect the project directory first. Implement Phase 1 in the authorized folder using pnpm. Verify it before moving to Phase 2. Continue in the documented phase order; do not skip modules or introduce unrelated scope.
