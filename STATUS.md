# Delivery Status

## Completed

- Spring Boot project, JPA, Flyway `V1`–`V7`, MySQL/Redis Compose
- RS256 access-token issuance and verification, BCrypt password verification, protected routes
- Refresh-token rotation via secure httpOnly cookie, Redis OTP hashing with 3-attempt lockout
- TOTP setup/verification, Redis API rate limiting, user provisioning, roles, and permissions endpoints
- AES-256-GCM converter and `@Audited` persistence aspect
- JWT tenant isolation, employee CRUD, leave apply/list, attendance punch/history, payroll-run listing
- React dashboard shell and API client foundation
- React Native/Expo starter home screen
- Dockerfile, Kubernetes Deployment/Service/Ingress/HPA/PDB, Terraform S3 starter
- Backend, frontend, and container CI workflow starters
- Shared UX primitives: API validation error mapping, error boundary, skeleton, empty state, confirmation dialog, form input, number/date formatting
- Global toast region, offline banner, session-expiry event, client error logger, mobile keyboard-safe form screen, shared mobile input, and offline banner
- TOTP, Redis request limiting, RBAC/provisioning, infrastructure log/alert stubs, and first service unit test
- Employee validation schema, API-backed directory loading with retry/empty states, web route metadata, and mobile five-tab shell
- Web login screen with tenant header, bearer-token injection, protected dashboard entry, and API error handling
- Frontend TypeScript source formatted with Prettier; typed API helpers restored; backend Maven compile and unit test pass with Java 17
- Development-only seeded login user for local end-to-end testing
- Reload-safe authentication bootstrap using the backend refresh cookie, session restoration loading state, and explicit logout token clearing
- One-time automatic access-token refresh and request retry after protected API `401` responses
- Server-backed logout that revokes Redis refresh tokens and clears the httpOnly refresh cookie
- Live table actions for recruitment job closure, expense approval, asset return, and notification read state
- JWT-driven super-admin UI mode, authenticated identity display, RBAC role creation, and management-action visibility gates
- Frontend helper and responsive control coverage for all currently exposed application API endpoints, including OTP/TOTP, tenant administration, history/detail lookups, and workflow mutations
- Separate frontend/backend handoff documents and a local super-admin SQL plus browser testing guide
- Complete frontend source/configuration formatting, `.env.example`, repeatable `typecheck` script, and official React type restoration
- API-backed frontend module screens for employees, attendance, leave, payroll, documents, recruitment, performance, analytics, expenses, training, assets, compliance, and settings
- Frontend create workflows for employees, attendance punches, leave applications, payroll calculation, documents, recruitment jobs, performance goals, expenses, training courses, and assets
- Tenant-wide attendance activity endpoint (`GET /api/v1/attendance`) connected to the Attendance page
- Completed frontend workflow pages for candidates, performance reviews, training enrollments, payslip previews, notifications, permissions, and user administration
- Added tenant-scoped backend list APIs for reviews, enrollments, current-user notifications, and safe user administration records
- Notifications persistence/API, analytics summary API, tenant administration endpoints, and mobile QR/notification screen contracts
- Recruitment job listing/create/close and expense submit/list/approve APIs with Flyway `V10`
- Performance goals, training courses, asset assignment, compliance documents, salary persistence, and Flyway `V11`
- Basic payroll gross calculation endpoint using effective salary records
- Candidate pipeline, performance reviews, training enrollments, asset returns, compliance expiry reporting, and payslip preview APIs with Flyway `V12`

## Pending

- Passkey/WebAuthn authentication, Bucket4j replacement with distributed policy tiers, OTP email/SMS delivery integration
- Complete permission matrix, audit AOP/Kafka, encryption converter, response masking, security alerts
- Payroll calculation/disbursement/payslips, recruitment, performance, training, expenses, assets, compliance, notifications, analytics, tenant admin
- Full React route map, richer chart visualizations, module-specific detail/edit screens, and mobile navigation/offline cache/push/QR
- Advanced edit/delete workflows, chart visualizations, and production browser verification
- Full screen implementations behind the route shell, login/session UI, chart data wiring, mobile tab screen navigation, MMKV cache, push notifications, and QR scanner
- Apply shared form primitives to every form, add focus management and Yup/RHF schemas
- Full AWS Terraform, secrets operator, observability, Testcontainers, endpoint/service test coverage
- Maven/production build verification in an environment with JDK/Maven and accessible package registries
- Browser reload/session-expiry verification and a clean Vite production bundle (the Vite process stalls in the current environment)
