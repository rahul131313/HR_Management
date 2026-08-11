# HR Platform Development Log

This file is the chronological source of truth for project changes. Every future implementation update must add a dated entry describing the scope, files changed, validation performed, and remaining work.

## 2026-07-25 — Initial platform scaffold

- Added the Spring Boot backend, React/Vite web frontend, React Native/Expo mobile starter, Docker Compose services, CI starters, Kubernetes manifests, and Terraform starter files.
- Added the first employee domain, database migrations through `V5`, MySQL/Redis local infrastructure, and baseline project documentation.
- Validation: project structure and local development configuration created.

## 2026-07-25 to 2026-07-30 — Backend platform expansion

- Added JWT RS256 authentication, refresh-token rotation, OTP/TOTP flows, Redis request limits, tenant isolation, user provisioning, RBAC endpoints, auditing, AES encryption support, and protected domain APIs.
- Added migrations through `V12` and development seed data for local end-to-end testing.
- Added APIs for employees, leave, attendance, payroll, recruitment, expenses, performance, training, assets, compliance, analytics, notifications, and tenant administration.

## 2026-07-30 — Frontend shell and integration foundation

- Added the web application shell, navigation, design system, shared loading/empty/error/form primitives, error boundary, offline banner, toast region, and login screen.
- Replaced dashboard mock data with API-backed analytics and employee directory loading.
- Added typed frontend API helpers and the mobile starter navigation/contracts.

## 2026-08-02 — Product and frontend documentation

- Added `FRONTEND_DESIGN_HANDOFF.md` with design tokens, wireframes, route map, component rules, API integration rules, and an AI-agent build brief.
- Added `DEVELOPMENT_ROADMAP.md` with ordered implementation phases, verification gates, and remaining delivery work.
- Updated `STATUS.md` with completed and pending capabilities.

## 2026-08-04 — Formatting and verification baseline

- Formatted frontend TypeScript/TSX sources with Prettier and added the frontend formatting script/configuration.
- Restored typed API helpers and verified the backend with Java 17, Maven compile, and unit tests.
- Validation: frontend TypeScript compilation passed; backend Maven build passed with one unit test; production Vite build still requires a clean run because the development server is active on port `5173`.

## 2026-08-04 — Reload-safe authentication session

- Root cause: the access token was stored only in the module-level `accessToken` variable, so a full browser reload reset it and React rendered the login screen.
- Updated `frontend-web/src/api.ts` to send cookies with requests, expose token clearing, and restore an access token through `POST /auth/refresh`.
- Updated `frontend-web/src/App.tsx` to bootstrap authentication on mount, show a session-restoration state, keep all hooks unconditional, and clear the token on logout.
- Updated `frontend-web/src/ui.css` with the session-restoration loading state.
- Validation: frontend TypeScript check passed. Browser reload test and a clean production Vite build remain pending.

## Current remaining work

- Add automatic one-time refresh and retry for API `401` responses.
- Complete login/session UX, passkey/WebAuthn, OTP email/SMS delivery, and full permission editor.
- Finish production web routes and real create/update forms for all modules.
- Complete mobile offline cache, QR scanner, push notifications, and screen implementations.
- Complete AWS Terraform, secrets integration, observability, Testcontainers, and broader endpoint/service coverage.

## 2026-08-04 — Remaining workflow pages completed

- Added frontend pages and navigation for Candidates, Performance Reviews, Training Enrollments, Payslip Preview, Notifications, Permissions, and User Administration.
- Added typed API helpers for candidate creation, review submission, training enrollment, payslip preview, notification loading, permissions, and user provisioning.
- Added backend tenant-scoped list contracts for performance reviews, training enrollments, current-user notifications, and provisioned users.
- Updated user listing to return only safe fields (`id`, `email`, `role`, `enabled`) and never expose password hashes.
- Added page-specific forms, live table columns, search, refresh, loading, error, and empty states for each workflow.
- Validation: frontend TypeScript compilation passed; backend Maven tests passed with Java 17.
- Runtime note: “No records” means the authenticated tenant has no rows in that backend table. The UI no longer uses mock records; create forms write to the API and refresh the page data.

## 2026-08-04 — Automatic access-token recovery

- Updated `frontend-web/src/api.ts` so a protected API request that receives `401` refreshes the short-lived access token through the existing httpOnly refresh cookie and retries once.
- Added a shared in-flight refresh promise so concurrent requests reuse one refresh operation rather than rotating the refresh token multiple times.
- Updated `frontend-web/src/App.tsx` to react to an unrecoverable session-expiry event by clearing in-memory state and returning to the login page.
- Validation: frontend TypeScript compilation passed.
- Security behavior: access tokens remain in memory only; the refresh token remains server-issued and httpOnly.

## 2026-08-04 — Live table actions

- Added table actions to the web frontend for closing recruitment jobs, approving expense claims, returning assigned assets, and marking notifications as read.
- Reused existing protected backend endpoints; no new backend mutation behavior was introduced.
- Each action reloads its API-backed table after completion and displays server errors in the page state.
- Validation: frontend TypeScript compilation passed.

## 2026-08-04 — Super-admin access and RBAC UI

- Confirmed the local development seed account is created with `SUPER_ADMIN`; the successful login token supplied during testing also contains `role: SUPER_ADMIN`.
- Added JWT claim decoding in the frontend to show the authenticated email and role in the application header.
- Gated all module create buttons, empty-state creation buttons, and row mutation actions behind the `SUPER_ADMIN` UI check.
- Added the missing role-creation form on the Settings page and connected it to the RBAC role endpoint.
- Wired the dashboard “Add employee” controls to the Employees page and made them visible only to `SUPER_ADMIN`.
- Backend remains the enforcement boundary: every audited restricted endpoint explicitly permits `SUPER_ADMIN`; frontend gates only prevent misleading controls for non-super-admin users.
- Validation: frontend TypeScript compilation passed.

## 2026-08-11 — Complete web endpoint wiring and responsive controls

- Fixed the legacy `.module-screen { display: none; }` rule that could hide every routed module page. Module routes now render normally.
- Added responsive mobile navigation, wrapping action controls, touch-sized buttons, scrollable tables, and bottom-sheet-style modals for small screens.
- Added frontend API helpers and UI controls for the remaining backend operations: employee lookup, attendance history, employee documents, salary save, asset assignment, candidate stage updates, employee review lookup, recipient notifications, OTP send/verify, TOTP setup/verify, and tenant provision/suspension.
- Added reusable secondary operation forms so actions remain inside their related module pages instead of requiring unconnected hidden routes.
- Wired the header search button to Employees and the header notification button to Notifications; retained existing navigation, retry, sign-out, create, and row actions.
- Validation: frontend TypeScript compilation passed. `npm run build` reaches the Vite bundling step but stalls without output in this environment; the active development server was not stopped.

## 2026-08-11 — Correct refresh-token logout

- Fixed the logout bug where refreshing after sign-out restored the dashboard session.
- Added `POST /api/v1/auth/logout`, which revokes the refresh token from Redis and expires the `refresh_token` httpOnly cookie using the same cookie path.
- Updated the frontend sign-out flow to call that endpoint before returning to login; local UI sign-out still completes if the backend is unreachable.
- Validation: frontend TypeScript compilation passed. Backend Maven verification was not run because dependency-access approval was unavailable in this session.
- Local test: sign in, click Sign out, refresh the browser, and confirm that the login page remains visible.

## 2026-08-11 — Separate handoffs and local testing baseline

- Added `FRONTEND_CHANGELOG.md` with web architecture, completed modules, responsive behavior, authentication/RBAC behavior, and a browser test checklist.
- Added `BACKEND_CHANGELOG.md` with backend security, RBAC, endpoint, and outstanding-work summaries.
- Added `LOCAL_SUPER_ADMIN_TESTING.md` with local Docker startup commands, safe super-admin verification/promotion SQL, optional RBAC/notification SQL, and an ordered browser validation plan.
- The SQL guide uses the development backend seeder for BCrypt password creation rather than placing plaintext credentials or fabricated password hashes in the database.

## 2026-08-11 — Frontend design handoff dependency appendix

- Appended a dependency, installation, CSS, custom-component, and future-library reference to the end of `FRONTEND_DESIGN_HANDOFF.md` without modifying its original sections.
- Documented that the current web implementation uses React, Vite, TypeScript, Lucide, Prettier, custom components, and handwritten global CSS.
- Explicitly documented that shadcn/ui, Tailwind, React Hook Form, Zod, TanStack Query/Table, and Recharts are not currently installed despite appearing in the earlier future-target build prompt.

## 2026-08-11 — Frontend source audit and formatting

- Audited all `frontend-web` files and added the missing `.env.example` local API configuration template.
- Installed the already-declared frontend development dependencies, restoring the local Prettier executable.
- Removed the conflicting temporary React type declarations from `src/shims.d.ts`; official React types now typecheck `ErrorBoundary` correctly.
- Formatted all frontend source, CSS, HTML, and key config files with Prettier.
- Added repeatable `npm run typecheck` and expanded `npm run format` coverage.
- Validation: `npm run format` and `npm run typecheck` pass. `npm install` reported one high-severity dependency advisory; no automatic upgrade was applied.

## 2026-08-04 — Module pages and backend activity integration

- Expanded the web module pages with page-specific workflow highlights so empty datasets still present the available operations and connected backend capabilities.
- Added live frontend loading for tenant-wide attendance activity instead of an intentional empty placeholder.
- Added `GET /api/v1/attendance` with tenant isolation and the latest 100 attendance events; existing employee-specific history and punch creation remain available.
- Kept all module records and mutations connected through typed frontend API helpers; no sample records were added to the UI.
- Validation: frontend TypeScript compilation passed; backend Maven tests passed with Java 17.
- Important data behavior: pages show “No records” when the tenant database has no records. This is a real empty backend result, not frontend mock data. Use each page’s create action or seed tenant data to populate it.

## 2026-08-04 — Web module implementation

- Replaced the generic placeholder module screen with API-backed configurations and column definitions for employees, attendance, leave, payroll, documents, recruitment, performance, analytics, expenses, training, assets, compliance, and settings.
- Added reusable search, refresh, loading, error, empty, and modal form states in `frontend-web/src/ModuleScreen.tsx`.
- Added typed API helpers in `frontend-web/src/api.ts` for module listing and create/compute actions.
- Added live create workflows for employees, attendance punches, leave applications, payroll calculation, compliance documents, jobs, performance goals, expenses, training courses, and assets.
- Added the missing web navigation entries for Expenses, Training, Assets, and Compliance in `frontend-web/src/App.tsx`.
- Validation: frontend TypeScript compilation passed.
- Remaining limitation: attendance history, employee-specific documents, payslip preview, notifications, candidate pipeline, and permission editing need dedicated detail screens because the backend exposes employee/recipient-specific or action-only endpoints rather than tenant-wide list APIs.

## Change-entry rule

For every future code or configuration change, append a dated section before handoff. Include: purpose, files changed, user-visible behavior, validation commands/results, and remaining limitations.
