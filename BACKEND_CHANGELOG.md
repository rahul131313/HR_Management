# Backend Change Log

## Purpose

This document records the implemented Spring Boot backend capabilities and the local API test surface used by the web frontend.

## Platform Foundation

- Java 17 and Spring Boot 3 API with MySQL, Flyway migrations `V1` through `V12`, Redis, JPA, validation, OpenAPI, and Docker Compose support.
- Tenant context is taken from verified JWT claims and applied to tenant-scoped reads and writes.
- Development profile seeds one enabled `SUPER_ADMIN` account in tenant `demo`.

## Authentication and Security

- RS256 JWT issue and verification with user ID, email, tenant, role, issue time, and expiry claims.
- BCrypt password verification.
- Refresh tokens stored in Redis, rotation on refresh, and a secure httpOnly cookie scoped to `/api/v1/auth`.
- `POST /api/v1/auth/logout` revokes the Redis refresh token and expires the refresh cookie.
- OTP send/verify with Redis hashing and attempt lockout.
- TOTP setup/verify endpoints.
- Redis request-rate filter, CORS for local web origins, audit annotations, and AES-GCM converter support.

## RBAC

- JWT authentication grants `ROLE_<role>` to Spring Security.
- `SUPER_ADMIN` is explicitly included on every audited restricted endpoint.
- Roles and permissions are tenant-scoped database records with list/create endpoints.
- User provisioning exposes only safe fields in list responses; password hashes are never returned.

## Module APIs

| Area | Implemented API capabilities |
| --- | --- |
| Employees | List, get by ID, create |
| Attendance | Recent tenant activity, punch, employee history |
| Leave | List pending/status-filtered requests, apply |
| Payroll | List runs, gross calculation, salary save, payslip preview |
| Recruitment | List/create/close jobs, list/create/stage candidates |
| Performance | Goals, tenant-wide reviews, employee reviews, review submission |
| Training | Courses, enrollments, enrollment creation |
| Expenses | List, submit, approve |
| Assets | List, create, assign, return |
| Compliance | Create employee document, employee document lookup, expiring document report |
| Analytics | Headcount and pending leave summary |
| Notifications | Current-user inbox, recipient inbox, mark read |
| Administration | List/provision users, provision/suspend tenants |
| RBAC | List/create roles and permissions |

## Recent Backend Fixes

- Added tenant-wide `GET /api/v1/attendance` for the web Attendance page.
- Added tenant-wide review and enrollment listing endpoints.
- Added `GET /api/v1/notifications/me` for the signed-in user.
- Added safe `GET /api/v1/admin/users` listing.
- Added server-backed logout and refresh-token revocation.

## Local API Verification

- Backend Maven tests previously passed with Java 17.
- The latest logout endpoint change has frontend typecheck validation but still needs a local Maven rerun after your backend restart.
- Swagger is available locally at `http://localhost:8080/swagger-ui.html` when the backend is running.

## Remaining Backend Work

- Passkey/WebAuthn and actual OTP email/SMS provider delivery.
- Complete role-to-permission assignment/enforcement matrix.
- Full payroll approval/disbursement/payslip persistence.
- Broader service/controller tests, Testcontainers, observability, AWS infrastructure, and production hardening.
