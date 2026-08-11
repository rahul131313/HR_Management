export type Employee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  jobTitle?: string;
  status: string;
};
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';
let accessToken: string | null = null;
let refreshRequest: Promise<AuthSession> | null = null;

type AuthSession = {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
};

export type AuthClaims = {
  sub: string;
  email: string;
  tenant: string;
  role: string;
};

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

export function getAuthClaims(): AuthClaims | null {
  if (!accessToken) return null;
  try {
    const payload = accessToken.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(normalized)) as AuthClaims;
  } catch {
    return null;
  }
}

export function isSuperAdmin() {
  return getAuthClaims()?.role === 'SUPER_ADMIN';
}

export async function api<T>(path: string, options: RequestInit = {}, retried = false): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  if (response.status === 401 && !retried && !path.startsWith('/auth/')) {
    try {
      await refreshSession();
      return api<T>(path, options, true);
    } catch {
      clearAccessToken();
      window.dispatchEvent(new CustomEvent('hr:session-expired'));
    }
  }
  if (!response.ok) {
    let message =
      response.status === 401
        ? 'Your session has expired. Please log in again.'
        : response.status === 403
          ? "You don't have permission to perform this action."
          : 'Request failed.';
    try {
      const error = await response.json();
      message = error.message ?? message;
    } catch {
      /* use mapped status message */
    }
    throw new Error(message);
  }
  const body = await response.json();
  return body.data as T;
}

export function listEmployees(query = '') {
  return api<{ content: Employee[]; totalElements: number }>(
    `/employees?${new URLSearchParams({ query })}`,
  );
}

export function getEmployee(id: string) {
  return api<Employee>(`/employees/${id}`);
}

export async function login(tenantId: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': tenantId,
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message ?? 'Invalid credentials.');
  }
  setAccessToken(body.data.accessToken);
  return body.data;
}

export async function refreshSession() {
  if (!refreshRequest) refreshRequest = requestRefresh();
  try {
    return await refreshRequest;
  } finally {
    refreshRequest = null;
  }
}

export async function logout() {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    clearAccessToken();
  }
}

async function requestRefresh(): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    clearAccessToken();
    throw new Error('No active session.');
  }
  const body = await response.json();
  setAccessToken(body.data.accessToken);
  return body.data as AuthSession;
}

export type AnalyticsSummary = {
  headcount: number;
  pendingLeave: number;
};

export function getAnalyticsSummary() {
  return api<AnalyticsSummary>('/analytics/summary');
}

export function listLeave() {
  return api<{
    content: Array<{
      id: string;
      employeeId: string;
      leaveType: string;
      fromDate: string;
      toDate: string;
      status: string;
    }>;
  }>('/leave?size=10');
}

export function listAttendance() {
  return api<ModuleRow[]>('/attendance');
}

export function getAttendanceHistory(employeeId: string) {
  return api<ModuleRow[]>(`/attendance/${employeeId}`);
}

export function listPayroll() {
  return api<
    Array<{
      id: string;
      periodStart: string;
      periodEnd: string;
      status: string;
      totalAmount: number;
    }>
  >('/payroll');
}

export function listJobs() {
  return api<
    Array<{
      id: string;
      title: string;
      department?: string;
      status: string;
    }>
  >('/recruitment/jobs');
}

export function listExpenses() {
  return api<
    Array<{
      id: string;
      category: string;
      amount: number;
      status: string;
    }>
  >('/expense');
}

export type ModuleRow = Record<string, unknown>;

export function listGoals() {
  return api<ModuleRow[]>('/performance/goals');
}

export function listTrainingCourses() {
  return api<ModuleRow[]>('/training/courses');
}

export function listAssets() {
  return api<ModuleRow[]>('/assets');
}

export function listExpiringCompliance(days = 30) {
  return api<ModuleRow[]>(`/compliance/expiring?days=${days}`);
}

export function listEmployeeDocuments(employeeId: string) {
  return api<ModuleRow[]>(`/compliance/documents/${employeeId}`);
}

export function listRoles() {
  return api<ModuleRow[]>('/settings/roles');
}

export function listPermissions() {
  return api<ModuleRow[]>('/settings/roles/permissions');
}

export function listCandidates() {
  return api<ModuleRow[]>('/recruitment/candidates');
}

export function listReviews() {
  return api<ModuleRow[]>('/performance/reviews');
}

export function listEmployeeReviews(employeeId: string) {
  return api<ModuleRow[]>(`/performance/reviews/${employeeId}`);
}

export function listEnrollments() {
  return api<ModuleRow[]>('/training/enrollments');
}

export function listNotifications() {
  return api<{ content: ModuleRow[] }>('/notifications/me?size=50');
}

export function listRecipientNotifications(recipientId: string) {
  return api<{ content: ModuleRow[] }>(`/notifications/${recipientId}?size=50`);
}

export function listUsers() {
  return api<ModuleRow[]>('/admin/users');
}

export function createEmployee(payload: {
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  jobTitle?: string;
  joiningDate: string;
}) {
  return api<Employee>('/employees', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createJob(payload: { title: string; department?: string }) {
  return api<ModuleRow>('/recruitment/jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createCandidate(payload: { jobId: string; name: string; email: string }) {
  return api<string>('/recruitment/candidates', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createReview(payload: {
  employeeId: string;
  cycle: string;
  rating?: number;
  feedback?: string;
}) {
  return api<string>('/performance/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createEnrollment(payload: { courseId: string; employeeId: string }) {
  return api<string>('/training/enrollments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getPayslipPreview(employeeId: string, month: string) {
  return api<ModuleRow>(`/payroll/payslip-preview/${employeeId}?${new URLSearchParams({ month })}`);
}

export function createExpense(payload: {
  employeeId: string;
  category: string;
  amount: number;
  description?: string;
}) {
  return api<ModuleRow>('/expense', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function approveExpense(id: string) {
  return api<ModuleRow>(`/expense/${id}/approve`, { method: 'PATCH' });
}

export function createGoal(payload: { employeeId: string; title: string }) {
  return api<ModuleRow>('/performance/goals', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createTrainingCourse(payload: { title: string; provider?: string }) {
  return api<ModuleRow>('/training/courses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createAsset(payload: { assetTag: string; type: string }) {
  return api<ModuleRow>('/assets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function returnAsset(assetTag: string) {
  return api<string>(`/assets/${encodeURIComponent(assetTag)}/return`, {
    method: 'PATCH',
  });
}

export function closeJob(id: string) {
  return api<ModuleRow>(`/recruitment/jobs/${id}/close`, { method: 'PATCH' });
}

export function markNotificationRead(id: string) {
  return api<ModuleRow>(`/notifications/${id}/read`, { method: 'PATCH' });
}

export function assignAsset(assetTag: string, employeeId: string) {
  return api<string>(`/assets/${encodeURIComponent(assetTag)}/assign/${employeeId}`, {
    method: 'PATCH',
  });
}

export function updateCandidateStage(id: string, value: string) {
  return api<string>(`/recruitment/candidates/${id}/stage?${new URLSearchParams({ value })}`, {
    method: 'PATCH',
  });
}

export function saveSalary(payload: {
  employeeId: string;
  monthlyGross: number;
  effectiveFrom: string;
}) {
  return api<string>('/payroll/salary', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function provisionTenant(tenantId: string) {
  return api<ModuleRow>('/admin/tenants', {
    method: 'POST',
    body: JSON.stringify({ tenantId }),
  });
}

export function suspendTenant(tenantId: string) {
  return api<ModuleRow>(`/admin/tenants/${encodeURIComponent(tenantId)}/suspend`, {
    method: 'POST',
  });
}

export function sendOtp(tenantId: string, email: string) {
  return api<string>(`/auth/otp/send?${new URLSearchParams({ email })}`, {
    method: 'POST',
    headers: { 'X-Tenant-Id': tenantId },
  });
}

export function verifyOtp(tenantId: string, email: string, code: string) {
  return api<boolean>(`/auth/otp/verify?${new URLSearchParams({ email, code })}`, {
    method: 'POST',
    headers: { 'X-Tenant-Id': tenantId },
  });
}

export function setupTotp() {
  return api<string>('/auth/totp/setup', { method: 'POST' });
}

export function verifyTotp(code: string) {
  return api<boolean>(`/auth/totp/verify?${new URLSearchParams({ code })}`, { method: 'POST' });
}

export function createComplianceDocument(payload: {
  employeeId: string;
  documentType: string;
  fileUrl: string;
  expiresOn?: string;
}) {
  return api<ModuleRow>('/compliance/documents', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function computePayroll(payload: { periodStart: string; periodEnd: string }) {
  return api<ModuleRow>('/payroll/compute', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function provisionUser(payload: { email: string; temporaryPassword: string; role: string }) {
  return api<string>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createPermission(payload: { module: string; action: string }) {
  return api<ModuleRow>('/settings/roles/permissions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createRole(payload: { name: string; systemRole?: boolean }) {
  return api<ModuleRow>('/settings/roles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function punchAttendance(payload: {
  employeeId: string;
  eventType: string;
  source: string;
}) {
  return api<ModuleRow>('/attendance/punch', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function applyLeave(payload: {
  employeeId: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
}) {
  return api<ModuleRow>('/leave', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
