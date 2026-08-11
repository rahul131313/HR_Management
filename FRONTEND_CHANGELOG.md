# Frontend Web Change Log

## Purpose

This document records the implemented React/Vite web changes and provides the local browser test scope.

## Architecture

- `frontend-web/src/App.tsx`: authenticated application shell, hash-based navigation, header actions, dashboard, session bootstrap, and logout.
- `frontend-web/src/api.ts`: typed API client, bearer-token injection, refresh-cookie recovery, endpoint helpers, and frontend JWT claim access.
- `frontend-web/src/ModuleScreen.tsx`: API-backed module list pages, forms, secondary operation forms, table actions, loading/error/empty states, and super-admin management gates.
- `frontend-web/src/ui.tsx`, `notifications.tsx`, and `ErrorBoundary.tsx`: shared inputs, dialogs, toasts, offline state, and failure recovery.
- `frontend-web/src/ui.css`: module visibility fix and responsive overrides.

## Authentication and Session Changes

- Login sends the tenant header and stores only the short-lived access token in memory.
- Refresh uses the server-issued `refresh_token` httpOnly cookie on application startup.
- A protected request that returns `401` refreshes once and retries once.
- Logout calls `POST /api/v1/auth/logout`, clears the in-memory token, and returns to Login even if the backend is temporarily unavailable.
- The signed JWT supplies the displayed email, tenant, and role.

## RBAC and Super Admin

- `SUPER_ADMIN` management mode exposes module create forms, secondary operation controls, and table mutation actions.
- Other roles can load permitted data but do not see the super-admin management controls.
- The backend remains the authority: hiding a button is not relied on as security.
- Settings supports role creation, permission creation, OTP controls, and TOTP controls.

## Implemented Web Modules

| Area | Web behavior |
| --- | --- |
| Dashboard | Live analytics and employee directory, retry, route to employee creation |
| Employees | List, search, create, and lookup by employee ID |
| Attendance | Recent activity, punch form, employee history lookup |
| Leave | List and leave application form |
| Payroll | Run list, gross calculation, salary save, payslip preview |
| Documents and Compliance | Expiring documents, create document, employee document lookup |
| Recruitment and Candidates | Jobs, candidate creation, job close, candidate stage advancement |
| Performance and Reviews | Goals, review submission, employee review lookup |
| Training and Enrollments | Course creation and employee enrollment |
| Expenses | Submit, list, and approve claims |
| Assets | Create, assign, return, and list assets |
| Analytics | Live headcount and pending-leave metrics |
| Notifications | Current-user inbox, recipient lookup, mark read |
| Settings and Permissions | Role and permission lists/creation, OTP/TOTP controls |
| User and Tenant Administration | Provision users, provision tenants, suspend tenants |

## Responsive Changes

- Fixed the old rule that hid all `.module-screen` routes.
- Desktop uses sidebar navigation; small screens use a horizontally scrollable navigation bar.
- Module actions wrap on small screens; tables scroll horizontally rather than clipping.
- Modals become viewport-safe bottom sheets on phones.
- Buttons use a minimum 40px target for touch use.

## Local Browser Test Checklist

1. Login as the seeded `SUPER_ADMIN`.
2. Reload the dashboard and confirm the session restores.
3. Navigate each sidebar entry and confirm loading, empty, or live data state.
4. Create an employee, then use that employee ID for attendance, leave, documents, salary, reviews, enrollment, and asset assignment.
5. Create a job, create a candidate, and advance its stage.
6. Create an expense and approve it.
7. Create and return an asset.
8. Test Settings: create role, create permission, OTP/TOTP operations.
9. Test User and Tenant Administration using a super-admin account.
10. Sign out, refresh the page, and confirm Login remains visible.
11. Repeat basic navigation at desktop and mobile viewport widths.

## Known Local-Test Limitations

- The application shows real empty states when the tenant has no data; it does not use mock rows.
- Some forms deliberately accept IDs because selector/detail UX is not complete yet.
- `npm run build` has stalled during Vite bundling in this environment. Frontend TypeScript compilation passes.
- Advanced record edit/delete, charts, passkeys, and production-grade browser automation remain pending.
