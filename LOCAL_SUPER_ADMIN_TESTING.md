# Local Super-Admin SQL and Browser Testing Guide

## Goal

Create a known local testing baseline, then validate the frontend and backend manually from the browser. Run these commands only against the local Docker MySQL database.

## 1. Start Local Dependencies

```powershell
docker compose up -d mysql redis
```

Start the backend with the development profile. This is the preferred way to create the initial user because the backend generates the BCrypt password hash safely.

```powershell
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The development seeder creates this account when it does not already exist:

| Field | Value |
| --- | --- |
| Tenant | `demo` |
| Email | `admin@demo.local` |
| Password | `ChangeMe123!` |
| Role | `SUPER_ADMIN` |

Do not run the development profile in production.

## 2. Connect to Local MySQL

```powershell
docker compose exec mysql mysql -uhr_app -phr_local_password hr_master
```

## 3. Verify or Promote the Seeded Super Admin

Run these statements after the backend has started once with the `dev` profile.

```sql
USE hr_master;

SELECT id, tenant_id, email, role, enabled
FROM app_users
WHERE tenant_id = 'demo' AND email = 'admin@demo.local';

UPDATE app_users
SET role = 'SUPER_ADMIN', enabled = TRUE
WHERE tenant_id = 'demo' AND email = 'admin@demo.local';

SELECT id, tenant_id, email, role, enabled
FROM app_users
WHERE tenant_id = 'demo' AND email = 'admin@demo.local';
```

If the first `SELECT` returns no row, stop here and start the backend again with `dev`. Do not insert a plaintext password or an invented BCrypt hash directly into `app_users`.

## 4. Optional RBAC Baseline

These rows make the local RBAC screens non-empty. Current endpoint authorization is role-based; the rows are useful for UI and API testing.

```sql
INSERT IGNORE INTO roles (id, tenant_id, name, system_role)
VALUES (UUID(), 'demo', 'SUPER_ADMIN', TRUE);

INSERT IGNORE INTO permissions (id, tenant_id, module, action) VALUES
  (UUID(), 'demo', 'EMPLOYEES', 'MANAGE'),
  (UUID(), 'demo', 'ATTENDANCE', 'MANAGE'),
  (UUID(), 'demo', 'LEAVE', 'MANAGE'),
  (UUID(), 'demo', 'PAYROLL', 'MANAGE'),
  (UUID(), 'demo', 'RECRUITMENT', 'MANAGE'),
  (UUID(), 'demo', 'SETTINGS', 'MANAGE'),
  (UUID(), 'demo', 'TENANTS', 'MANAGE');

SELECT tenant_id, name, system_role
FROM roles
WHERE tenant_id = 'demo';

SELECT tenant_id, module, action
FROM permissions
WHERE tenant_id = 'demo'
ORDER BY module, action;
```

## 5. Optional Notification Seed

Use this only after confirming the user ID from section 3.

```sql
SET @super_admin_id = (
  SELECT id FROM app_users
  WHERE tenant_id = 'demo' AND email = 'admin@demo.local'
  LIMIT 1
);

INSERT INTO notifications (id, tenant_id, recipient_id, title, message, category)
VALUES (
  UUID(),
  'demo',
  @super_admin_id,
  'Local test notification',
  'Use this record to verify the Notifications page and Mark read action.',
  'SYSTEM'
);
```

## 6. Start the Web Frontend

```powershell
cd frontend-web
npm run dev
```

Open `http://localhost:5173` and login with the seeded account.

## 7. Manual Browser Test Order

1. Login with tenant `demo`, email `admin@demo.local`, and password `ChangeMe123!`.
2. Reload the dashboard and confirm session restoration works.
3. In Settings, confirm the `SUPER_ADMIN` role and permissions are visible.
4. Create an employee. Copy its ID from the employee lookup/table/API response.
5. Use that employee ID to test attendance punch/history, leave application, document add/lookup, salary save, payslip preview, performance goal/review, training enrollment, asset assignment, and expense submission.
6. Create a job, create a candidate, close the job, and advance the candidate stage.
7. Create an asset, assign it, then return it.
8. Open Notifications and mark the seeded notification as read.
9. Test role creation, permission creation, user provisioning, and tenant provision/suspend as `SUPER_ADMIN`.
10. Sign out, refresh the browser, and confirm that it remains on Login.
11. Resize the browser to phone width and confirm mobile navigation, forms, tables, and modals remain usable.

## 8. What to Capture When You Find a Bug

- Browser URL and module name.
- Steps to reproduce.
- Network request URL, method, status, request payload, and response body.
- Browser console error, if any.
- Backend log lines from the same time.

This information is enough to diagnose whether the issue is frontend routing/state, API contract, validation, authorization, Redis, or MySQL.
