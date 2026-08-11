# HR Platform Development Roadmap

## Current Checkpoint

- Frontend TypeScript source is formatted with Prettier.
- `frontend-web/src/api.ts` contains typed login, analytics, employees, leave, payroll, recruitment, and expense helpers.
- The frontend has a login flow, bearer-token injection, route shell, shared loading/error/empty states, and responsive design tokens.
- Backend APIs and Flyway migrations exist for authentication, employees, leave, attendance, payroll foundations, recruitment, expenses, workforce, notifications, analytics, RBAC, and tenants.
- Redis connectivity has been verified with `PONG`.
- Backend live login and protected analytics/employee requests were previously smoke-tested.
- Java 17/Maven backend verification now passes: sources compile and the existing unit test passes.
- Frontend TypeScript compilation passes after formatting and restoring the typed API helpers.

## Ordered Next Steps

### 1. Make the Local Toolchain Reproducible

- Install Java 17 and Maven.
- Add Maven Wrapper (`mvnw`, `mvnw.cmd`) so developers do not depend on a global Maven installation.
- Add Node version pinning and run `npm install` from `frontend-web`.
- Add `.env.example` for API URL, database, Redis, JWT keys, and local seed credentials.

### 2. Verify the Backend Before More UI Work

- Run `mvn clean verify` with Java 17 (the current `mvn test` verification passes; extend it as integration tests are added).
- Fix all compilation warnings/errors from the current generated controllers.
- Run Flyway against MySQL and verify migrations `V1` through `V12` in order.
- Run unit tests and add Testcontainers coverage for MySQL and Redis.
- Verify JWT login, refresh rotation, tenant isolation, role checks, OTP, TOTP, rate limiting, and audit writes.

### 3. Stabilize the Frontend API Layer

- Add automatic refresh-cookie handling on 401.
- Add request IDs and standard error parsing.
- Add TanStack Query for caching, retries, invalidation, and optimistic mutations.
- Remove temporary TypeScript shims once the declared React types are installed normally.
- Add API contract tests for every frontend helper.

### 4. Complete Authentication UX

- Add session-timeout modal and silent refresh.
- Add forgot-password, OTP, TOTP setup/verification, invite acceptance, and logout flows.
- Add role/permission loading after login.
- Add `PermissionGate` around every write button and sensitive field.

### 5. Build Real Web Screens in Product Order

1. Employee directory, create form, profile, documents, and lifecycle.
2. Attendance calendar, live board, punch history, and reports.
3. Leave apply, balance, team calendar, approvals, and escalation states.
4. Payroll salary structures, run review, approval, disbursement, and payslip viewer.
5. Recruitment jobs, candidates, pipeline, interviews, and offer letters.
6. Performance goals, cycles, reviews, and 360 feedback.
7. Training, expenses, assets, compliance, notifications, analytics, and settings.

Every screen must use live API data and include loading, empty, error, permission, validation, and destructive-action states.

### 6. Add Shared UX Quality Gates

- Use the shared `FormInput`, `Button`, `Skeleton`, `EmptyState`, `Toast`, `ConfirmDialog`, and `Breadcrumb` components everywhere.
- Add keyboard focus management and screen-reader announcements.
- Add browser tests for login, navigation, forms, 401 handling, 403 handling, and retry behavior.
- Add visual review at desktop, tablet, and mobile breakpoints.

### 7. Complete Mobile

- Add React Navigation stack and bottom tabs.
- Connect attendance to camera QR scanning and geolocation.
- Add MMKV cache and offline retry queue.
- Add push notification registration and notification inbox.
- Apply `KeyboardAvoidingView`, shared mobile inputs, and validation to every form.

### 8. Production Delivery

- Complete AWS Terraform for VPC, EKS, RDS, ElastiCache, MSK, S3, CloudFront, WAF, and Secrets Manager.
- Add External Secrets Operator and production Kubernetes secrets.
- Add Prometheus, Grafana, CloudWatch, tracing, and Sentry.
- Run container scans, dependency scans, migrations, smoke tests, and deployment rollback tests in CI.

## Definition of Done

- `npm run format` produces no changes.
- `npm run build` passes.
- `mvnw clean verify` passes on Java 17.
- All protected UI actions enforce backend permissions.
- No production screen displays fabricated data.
- All routes have loading, empty, error, accessibility, and mobile states.
- Login, refresh, logout, and tenant isolation pass end-to-end tests.
