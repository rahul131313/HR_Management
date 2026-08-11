# HR Platform Frontend Design Handoff

This document is the source of truth for rebuilding the HR Platform web and mobile UI. It is written so a human developer or AI coding agent can implement the interface consistently without guessing.

## Current Repository State

The previous implementation was reverted on request. The repository currently does not contain the earlier React frontend files. The sections below document the design decisions and implementation history that should be used when rebuilding the frontend.

## Product Direction

Build an enterprise HR workspace that feels calm, modern, trustworthy, and fast. The visual reference is a combination of Rippling, Linear, and a well-designed finance dashboard:

- Data-dense, but never visually noisy.
- One clear primary action per screen.
- Inline validation instead of generic error popups.
- Skeleton loading instead of unexplained spinners.
- Empty states that tell the user what to do next.
- Desktop navigation with a collapsible left sidebar.
- Mobile navigation with five bottom tabs.

## Design Tokens

### Colors

| Token | Value | Usage |
|---|---|---|
| `primary-700` | `#3730A3` | Primary actions, selected navigation |
| `primary-600` | `#4F46E5` | Links, hover states, charts |
| `primary-100` | `#E0E7FF` | Selected backgrounds |
| `primary-50` | `#EEF2FF` | Focus backgrounds, subtle cards |
| `slate-900` | `#0F172A` | Headings and primary text |
| `slate-700` | `#334155` | Labels and secondary text |
| `slate-500` | `#64748B` | Muted copy and placeholders |
| `slate-300` | `#CBD5E1` | Borders and dividers |
| `slate-100` | `#F1F5F9` | Page background |
| `slate-50` | `#F8FAFC` | Card background |
| `emerald-500` | `#10B981` | Success, present, approved |
| `amber-500` | `#F59E0B` | Warning, pending, due soon |
| `red-500` | `#EF4444` | Error, absent, rejected, destructive |
| `sky-500` | `#0EA5E9` | Information and links |

Dark mode surfaces:

- Page: `#030712`
- Card: `#111827`
- Elevated surface: `#1F2937`
- Border: `#374151`
- Muted text: `#9CA3AF`

### Typography

- Font: Inter.
- Data numbers: tabular numerals.
- Code and IDs: JetBrains Mono.
- H1: `32px`, weight `700`.
- H2: `24px`, weight `600`.
- H3: `18px`, weight `600`.
- Body: `14px`, line-height `1.6`.
- Caption: `12px`.
- Table cell: `13px`, weight `500`.

### Shape and Spacing

- Card radius: `12px`.
- Badge radius: `6px`.
- Input radius: `8px`.
- Default page padding: `38px` desktop, `18px` mobile.
- Standard control height: `40px`.
- Use an 8px spacing rhythm.

## Desktop Application Shell

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│  SIDEBAR             │  HEADER                                                │
│                      │  ☰  Workspace / Employees     🔍  🔔  Jordan Davis ▾ │
│  H  horizon.         ├────────────────────────────────────────────────────────┤
│                      │                                                        │
│  ▣ Overview          │  PAGE HEADER                                           │
│  ◎ Employees         │  Employees                         [ + Add employee ] │
│  ◷ Attendance        │  Manage your people and organization structure.        │
│  ◫ Leave             │                                                        │
│  ▣ Payroll           │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  ▤ Documents         │  │ Total    │ │ Pending  │ │ Rate     │ │ Payroll  │  │
│                      │  │ 247      │ │ 12       │ │ 94.2%    │ │ ₹28.4L   │  │
│  ⚙ Settings          │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ⇥ Sign out          │                                                        │
│                      │  ┌──────────────────────────────────────────────────┐  │
│                      │  │ Search employees...     [Department ▾]           │  │
│                      │  ├──────────────────────────────────────────────────┤  │
│                      │  │ Employee       Department      Role       Status  │  │
│                      │  │ Avatar + name   Engineering     Designer   ● Live  │  │
│                      │  │ Avatar + name   Finance         Manager    ● Leave │  │
│                      │  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Shell Behavior

- Sidebar width: approximately `238px` expanded and `76px` collapsed.
- Header height: approximately `72px`.
- Sidebar collapse preserves icons and tooltips.
- Breadcrumb always ends with the current page name.
- Browser title must match the current H1.
- Icon-only buttons require an `aria-label`.
- Mobile hides the desktop sidebar and uses bottom tabs.

## Mobile Application Shell

```text
┌──────────────────────────────┐
│  Good morning, Jordan     🔔  │
│  Here’s your workday...       │
│                              │
│  ┌──────────────────────────┐ │
│  │ TODAY’S ATTENDANCE       │ │
│  │ Not clocked in           │ │
│  │       [ Clock in ]       │ │
│  └──────────────────────────┘ │
│                              │
│  ┌────────────┐ ┌───────────┐ │
│  │ Leave      │ │ Payslip   │ │
│  │ 18 days    │ │ ₹1.2L     │ │
│  └────────────┘ └───────────┘ │
│                              │
│  Quick actions               │
│  [ Apply leave             ] │
│  [ View payslips           ] │
│                              │
├──────────────────────────────┤
│ Home  Attend  Leave  Pay  More│
└──────────────────────────────┘
```

## Screen Map

### Authentication

- `/login`: workspace/tenant, email, password.
- `/forgot-password`: email, OTP, new password.
- `/invite/:token`: accept invitation and create credentials.
- OTP: six boxes, auto-advance, paste support, backspace navigation.
- Refresh token: never store in local storage; use secure httpOnly cookie.

### Web Routes

- `/dashboard`
- `/employees`, `/employees/new`, `/employees/:id`, `/employees/:id/edit`
- `/attendance`, `/attendance/live`, `/attendance/reports`
- `/leave`, `/leave/apply`, `/leave/approvals`
- `/payroll`, `/payroll/:runId`, `/payroll/salary-structures`, `/payroll/payslips`
- `/recruitment/jobs`, `/recruitment/jobs/:id`, `/recruitment/candidates/:id`
- `/performance`, `/performance/:cycleId`, `/performance/my-goals`
- `/training`, `/expense`, `/assets`, `/compliance`
- `/analytics`
- `/settings/roles`, `/settings/company`, `/settings/integrations`, `/settings/security`

### Mobile Tabs

- Home
- Attendance
- Leave
- Payslips
- More

More contains Profile, Documents, Notifications, and Security.

## Shared Components

Every screen must use shared components rather than raw one-off controls.

- `AppShell`: desktop navigation and header.
- `MobileTabBar`: five bottom tabs.
- `FormInput`: label, required marker, helper, error, icon, disabled state.
- `Button`: primary, secondary, ghost, danger, loading states.
- `DataTable`: sorting, filtering, pagination, export, empty state.
- `StatCard`: label, value, icon, delta, loading skeleton.
- `Skeleton`: table row, card, stat, chart, avatar variants.
- `EmptyState`: illustration/icon, title, description, CTA.
- `ToastProvider`: success, error, warning, info.
- `ConfirmDialog`: mandatory for destructive actions.
- `SessionTimeoutModal`: refresh or sign out.
- `OfflineBanner`: visible when network is unavailable.
- `PermissionGate`: hide/disable actions based on module and permission.
- `Breadcrumb`: current route hierarchy.
- `AuditTrail`: last modified actor and timestamp.

## Validation and Error Rules

Use two validation layers:

1. Client validation for immediate required, format, length, and type errors.
2. Server validation for authorization, uniqueness, business rules, and cross-field rules.

Validation timing:

- On type after a 500ms debounce: basic required/format checks.
- On blur: complete field validation.
- On submit: validate the complete form.
- On server error: map field errors back to the same input.

Standard error codes:

| HTTP | Code | UI behavior |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | Inline field messages |
| 401 | `UNAUTHENTICATED` | Refresh, then session modal |
| 403 | `UNAUTHORIZED` | Red toast and audit event |
| 404 | `NOT_FOUND` | Contextual empty state |
| 409 | `CONFLICT` | Inline field conflict |
| 422 | `BUSINESS_RULE` | Amber toast |
| 429 | `RATE_LIMITED` | Countdown toast |
| 500 | `SERVER_ERROR` | Red toast with support reference |
| Network | `NETWORK_ERROR` | Offline banner and retry |

## Loading and Empty States

Never show a blank page while data loads.

- Table: skeleton rows with matching column widths.
- Cards: skeleton label, value, and supporting line.
- Charts: empty chart frame skeleton, not fake bars.
- Lists: skeleton rows.
- No data: specific title, explanation, and primary CTA.
- Never use the message `No data available`.

## Destructive Actions

Every delete, terminate, revoke, reject, or irreversible action requires:

1. Confirmation dialog.
2. Explicit consequences.
3. Typed phrase for critical actions.
4. Loading state on the destructive button.
5. Success toast and list update.
6. Error toast with retry option.

## API Integration Contract

The web client should use one API client with:

- Base URL from `VITE_API_URL`.
- `Authorization: Bearer <accessToken>` on protected requests.
- `X-Tenant-Id` only during login; tenant identity after login comes from the JWT.
- JSON request/response handling.
- Automatic refresh on 401 using the httpOnly refresh cookie.
- Standard error parsing and field-error mapping.
- No tokens in local storage.

Current backend contracts that were connected during the previous implementation:

- `POST /api/v1/auth/login`
- `GET /api/v1/analytics/summary`
- `GET /api/v1/employees`
- `GET /api/v1/leave`
- `GET /api/v1/payroll`
- `GET /api/v1/recruitment/jobs`
- `GET /api/v1/expense`

The frontend must render real API data. It must not use fallback employee arrays, fabricated counts, or static chart values in production screens.

## Historical Frontend Changes Before Rollback

The previous frontend implementation added the following, but those files were reverted on request:

- Vite + React + TypeScript web shell.
- Indigo/Slate styling and responsive layout.
- Sidebar, header, dashboard, employee table, attendance chart, and leave cards.
- Global error boundary.
- Toast region and offline banner.
- Skeleton and empty-state components.
- Destructive confirmation dialog.
- Shared form input with ARIA error state.
- Login screen with tenant, email, and password.
- In-memory bearer token injection.
- API-backed analytics and employee directory loading.
- Route-aware navigation shell.
- React Native Expo home screen and five-tab shell.
- Mobile keyboard-safe form wrapper and shared mobile input.

## Rebuild Sequence for an AI Coding Agent

Follow this order:

1. Create the Vite React TypeScript app.
2. Add the design tokens and global CSS.
3. Create `AppShell`, `MobileTabBar`, `Button`, `FormInput`, `Skeleton`, `EmptyState`, `ToastProvider`, and `ConfirmDialog`.
4. Create the API client and authentication store using memory plus httpOnly refresh cookies.
5. Build login and session-expiry behavior.
6. Build dashboard from analytics and employee APIs; never add mock fallback data.
7. Build Employees and Attendance screens.
8. Build Leave and Payroll screens.
9. Build Recruitment, Performance, Training, Expense, Assets, Compliance, and Analytics screens.
10. Add Settings/RBAC screens with `PermissionGate`.
11. Add mobile navigation and shared mobile form/keyboard behavior.
12. Add loading, empty, error, offline, accessibility, and destructive-action states to every route.
13. Run typecheck, production build, unit tests, and browser smoke tests.

## AI Agent Build Prompt

```text
Build the HR Platform frontend from FRONTEND_DESIGN_HANDOFF.md.

Use React 18, TypeScript, Vite, Tailwind-compatible CSS, React Hook Form, Zod,
TanStack Query, TanStack Table, Recharts, and Lucide icons.

Use the Deep Indigo × Slate tokens exactly. Build the shell first, then shared
components, then authentication, then route screens. Every API-dependent view
must use live API state with loading skeletons, specific empty states, retryable
errors, and no hardcoded production data. Keep access tokens in memory and use
the backend httpOnly refresh cookie. Add permission gates to every write action.

Before finishing, verify keyboard accessibility, screen-reader labels, mobile
keyboard behavior, destructive confirmation dialogs, offline behavior, and a
successful production build.
```

## Definition of Done

- Every listed route renders.
- Every list reads from an API or clearly reports that its backend endpoint is unavailable.
- No fabricated production values remain.
- All forms validate client-side and server-side.
- 401, 403, 404, 409, 422, 429, 500, and offline states are consistent.
- Every destructive action confirms before executing.
- Desktop and mobile layouts are responsive.
- Frontend build, tests, and browser smoke test pass.

## 2026-08-11 — Implemented Dependency, Installation, and CSS Reference

This section is appended after the original design handoff so it does not change the original design guidance above. It describes the dependencies and styling that are actually present in the current `frontend-web` implementation.

### Installed Runtime Dependencies

| Package | Version in `package.json` | Why it is used | Where it is used |
| --- | --- | --- | --- |
| `react` | `^18.3.1` | Component rendering and hooks | All React screens in `src/` |
| `react-dom` | `^18.3.1` | Browser DOM rendering | `src/main.tsx` |
| `lucide-react` | `^0.468.0` | Accessible SVG icon components | `App.tsx`, `Login.tsx`, `ModuleScreen.tsx`, `ui.tsx`, `notifications.tsx`, and `ErrorBoundary.tsx` |
| `typescript` | `latest` | Type checking and Vite TypeScript build | `tsconfig.json`, `npm run build`, and `npm exec -- tsc -b` |
| `vite` | `latest` | Local development server and production bundler | `vite.config.ts`, `npm run dev`, and `npm run build` |

### Installed Development Dependencies

| Package | Version in `package.json` | Why it is used |
| --- | --- | --- |
| `@vitejs/plugin-react` | `latest` | Vite React transform and Fast Refresh support |
| `@types/react` | `^18.3.12` | React TypeScript type definitions |
| `@types/react-dom` | `^18.3.1` | React DOM TypeScript type definitions |
| `prettier` | `^3.6.2` | Source formatting through `npm run format` and `.prettierrc.json` |

### Installation State and Commands

- `frontend-web/node_modules` and `frontend-web/package-lock.json` are present, so the declared package set has been installed locally.
- Use `npm install` inside `frontend-web` to restore the exact lockfile-based dependency tree on another laptop.
- Use `npm run dev` for the local Vite server, `npm exec -- tsc -b --pretty false` for the focused typecheck, and `npm run format` for Prettier formatting.
- No global npm package is required for normal frontend work.

### UI Library Decision: No shadcn/ui or Tailwind in the Current Build

The current web app does **not** install or use `shadcn/ui`, Tailwind CSS, Radix UI, Material UI, Chakra UI, Bootstrap, React Hook Form, Zod, TanStack Query, TanStack Table, or Recharts.

The earlier AI build prompt above names several of those packages as a future target architecture. They were not added to `package.json`, so a developer must not assume their components, utilities, hooks, form schemas, tables, charts, or generated shadcn files exist.

The active implementation uses custom React components and handwritten CSS. This was chosen to keep the initial local application lightweight and to avoid introducing a design-system generator before the module API flows were connected. If shadcn/ui is adopted later, add it deliberately with Tailwind configuration and migrate one shared component at a time; do not mix generated shadcn styles blindly into the current global CSS.

### Current CSS System

| File | Purpose | Main usage |
| --- | --- | --- |
| `frontend-web/src/styles.css` | Main global visual system | App shell, sidebar, header, dashboard cards, tables, forms, modal base styles, typography, and desktop layout |
| `frontend-web/src/ui.css` | Shared UX and responsive overrides | Toasts, offline banner, login page, error details, session restoration, module visibility, responsive navigation, responsive tables, and mobile modals |
| `frontend-web/src/main.tsx` | CSS entry point | Imports `styles.css` first, then `ui.css`; later `ui.css` rules can intentionally override base styles |

The CSS approach is plain global CSS with semantic class names such as `.app-shell`, `.sidebar`, `.content`, `.card`, `.primary`, `.secondary`, `.module-screen`, `.module-actions`, `.modal`, `.table-card`, `.toast`, and `.auth-loading`.

There are no Tailwind utility classes, CSS Modules, Sass/Less files, CSS-in-JS libraries, styled-components, or theme-provider packages. Design consistency comes from the Deep Indigo and Slate color values, reusable class names, and the custom shared React components.

### Custom Components Replacing a UI Kit

| Component or pattern | File | Replaces the need for |
| --- | --- | --- |
| `FormInput` | `src/ui.tsx` | shadcn/Input or a form-library field wrapper |
| `EmptyState` and `Skeleton` | `src/ui.tsx` | external empty/loading components |
| `ConfirmDialog` | `src/ui.tsx` | dialog/modal library for confirmation flows |
| `ToastRegion` and `toast` | `src/notifications.tsx` | toast/notification package |
| `OfflineBanner` | `src/notifications.tsx` | external network-status component |
| `ErrorBoundary` | `src/ErrorBoundary.tsx` | error boundary package |
| `ModuleScreen` form and table engine | `src/ModuleScreen.tsx` | table/form library for current module workflows |

### Current Gaps Before Adding More Dependencies

- Generic forms still use local React state and several ID text fields; adopting React Hook Form plus Zod is a future improvement, not current behavior.
- API caching, pagination invalidation, and optimistic updates are custom/manual; TanStack Query is not installed.
- Tables use standard HTML tables with client-side text search; TanStack Table is not installed.
- Analytics currently uses live metric cards/tables; Recharts is not installed.
- The production Vite bundle needs local investigation because the bundling stage has stalled in the current environment even though TypeScript compilation passes.

## 2026-08-11 — Full Frontend File Audit and Formatting Update

This final appended section records the complete `frontend-web` audit requested after the dependency appendix.

- Added `frontend-web/.env.example` with the local `VITE_API_URL` value. Copy it to `.env` only when a local override is needed; `.env` remains ignored by Git.
- Restored the declared development dependencies with `npm install`, including the missing local Prettier executable.
- Replaced the old hand-written React module shim in `src/shims.d.ts` with a CSS-only declaration. The old shim conflicted with installed `@types/react` and prevented `ErrorBoundary` from typechecking correctly.
- Formatted every file under `src/` with Prettier, including TypeScript, TSX, declaration files, and CSS. Also formatted `index.html`, `package.json`, `tsconfig.json`, `vite.config.ts`, and `.prettierrc.json`.
- Added `npm run typecheck` for the repeatable strict TypeScript check.
- Expanded `npm run format` so future formatting covers TypeScript, TSX, CSS, declaration files, and key frontend configuration files.
- Validation: `npm run format` completes with no remaining changes and `npm run typecheck` passes.
- `npm install` reported one high-severity transitive dependency advisory. No automatic `npm audit fix` was run because it can change Vite or other dependency versions; review it separately before upgrading packages.
