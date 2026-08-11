import { useEffect, useState } from 'react';
import {
  Archive,
  BarChart3,
  CalendarDays,
  FileText,
  GraduationCap,
  Plus,
  Search,
  Settings,
  Users,
  WalletCards,
} from 'lucide-react';
import { EmptyState, FormInput, Skeleton } from './ui';
import {
  computePayroll,
  createAsset,
  createComplianceDocument,
  createCandidate,
  createEmployee,
  createExpense,
  createGoal,
  createEnrollment,
  createPermission,
  createRole,
  createReview,
  approveExpense,
  closeJob,
  getPayslipPreview,
  createJob,
  createTrainingCourse,
  getAnalyticsSummary,
  listAssets,
  listAttendance,
  listCandidates,
  listEnrollments,
  listEmployees,
  listExpiringCompliance,
  listExpenses,
  listGoals,
  listJobs,
  listLeave,
  listPayroll,
  listNotifications,
  listPermissions,
  listRoles,
  listReviews,
  listEmployeeReviews,
  listRecipientNotifications,
  listTrainingCourses,
  listUsers,
  isSuperAdmin,
  provisionUser,
  markNotificationRead,
  returnAsset,
  applyLeave,
  assignAsset,
  getAttendanceHistory,
  getEmployee,
  listEmployeeDocuments,
  punchAttendance,
  provisionTenant,
  saveSalary,
  sendOtp,
  setupTotp,
  suspendTenant,
  updateCandidateStage,
  verifyOtp,
  verifyTotp,
  type ModuleRow,
} from './api';

type Loader = () => Promise<unknown>;
type FormValues = Record<string, string>;
type FormDefinition = {
  fields: Array<{ name: string; label: string; type?: string; required?: boolean }>;
  submit: (values: FormValues) => Promise<unknown>;
};

type ModuleConfig = {
  title: string;
  subtitle: string;
  action?: string;
  icon: typeof Users;
  load: Loader;
  columns: Array<{ label: string; key: string }>;
  form?: FormDefinition;
  secondaryActions?: Array<{ label: string; form: FormDefinition }>;
  rowAction?: {
    label: string;
    run: (row: ModuleRow) => Promise<unknown>;
    visible?: (row: ModuleRow) => boolean;
  };
  emptyDescription?: string;
};

const configs: Record<string, ModuleConfig> = {
  Employees: {
    title: 'Employees',
    subtitle: 'Manage your people and organization structure.',
    action: 'Add employee',
    icon: Users,
    load: listEmployees,
    columns: [
      { label: 'Employee', key: 'fullName' },
      { label: 'Department', key: 'department' },
      { label: 'Role', key: 'jobTitle' },
      { label: 'Status', key: 'status' },
    ],
    form: {
      fields: [
        { name: 'firstName', label: 'First name', required: true },
        { name: 'lastName', label: 'Last name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'department', label: 'Department' },
        { name: 'jobTitle', label: 'Job title' },
        { name: 'joiningDate', label: 'Joining date', type: 'date', required: true },
      ],
      submit: (values) => createEmployee(values as never),
    },
    secondaryActions: [
      {
        label: 'Find employee',
        form: {
          fields: [{ name: 'employeeId', label: 'Employee ID', required: true }],
          submit: (values) => getEmployee(values.employeeId),
        },
      },
    ],
  },
  Attendance: {
    title: 'Attendance',
    subtitle: 'Record and review employee punches and presence.',
    icon: CalendarDays,
    load: listAttendance,
    columns: [
      { label: 'Employee', key: 'employeeId' },
      { label: 'Event', key: 'eventType' },
      { label: 'Time', key: 'eventTime' },
      { label: 'Source', key: 'source' },
    ],
    action: 'Record punch',
    form: {
      fields: [
        { name: 'employeeId', label: 'Employee ID', required: true },
        { name: 'eventType', label: 'Event type', required: true },
        { name: 'source', label: 'Source', required: true },
      ],
      submit: (values) =>
        punchAttendance({
          employeeId: values.employeeId,
          eventType: values.eventType,
          source: values.source,
        }),
    },
    secondaryActions: [
      {
        label: 'Employee history',
        form: {
          fields: [{ name: 'employeeId', label: 'Employee ID', required: true }],
          submit: (values) => getAttendanceHistory(values.employeeId),
        },
      },
    ],
    emptyDescription: 'No attendance punches have been recorded for this tenant yet.',
  },
  Leave: {
    title: 'Leave',
    subtitle: 'Review balances, requests, and approval workflows.',
    icon: CalendarDays,
    action: 'Apply leave',
    load: listLeave,
    columns: [
      { label: 'Leave type', key: 'leaveType' },
      { label: 'From', key: 'fromDate' },
      { label: 'To', key: 'toDate' },
      { label: 'Status', key: 'status' },
    ],
    form: {
      fields: [
        { name: 'employeeId', label: 'Employee ID', required: true },
        { name: 'leaveType', label: 'Leave type', required: true },
        { name: 'fromDate', label: 'From date', type: 'date', required: true },
        { name: 'toDate', label: 'To date', type: 'date', required: true },
        { name: 'days', label: 'Days', type: 'number', required: true },
      ],
      submit: (values) =>
        applyLeave({
          employeeId: values.employeeId,
          leaveType: values.leaveType,
          fromDate: values.fromDate,
          toDate: values.toDate,
          days: Number(values.days),
        }),
    },
  },
  Payroll: {
    title: 'Payroll',
    subtitle: 'Calculate payroll, review totals, and publish payslips.',
    action: 'Compute payroll',
    icon: WalletCards,
    load: listPayroll,
    columns: [
      { label: 'Period start', key: 'periodStart' },
      { label: 'Period end', key: 'periodEnd' },
      { label: 'Total', key: 'totalAmount' },
      { label: 'Status', key: 'status' },
    ],
    form: {
      fields: [
        { name: 'periodStart', label: 'Period start', type: 'date', required: true },
        { name: 'periodEnd', label: 'Period end', type: 'date', required: true },
      ],
      submit: (values) => computePayroll(values as never),
    },
    secondaryActions: [
      {
        label: 'Save salary',
        form: {
          fields: [
            { name: 'employeeId', label: 'Employee ID', required: true },
            { name: 'monthlyGross', label: 'Monthly gross', type: 'number', required: true },
            { name: 'effectiveFrom', label: 'Effective from', type: 'date', required: true },
          ],
          submit: (values) =>
            saveSalary({
              employeeId: values.employeeId,
              monthlyGross: Number(values.monthlyGross),
              effectiveFrom: values.effectiveFrom,
            }),
        },
      },
    ],
  },
  Documents: {
    title: 'Documents',
    subtitle: 'Track compliance documents and expiry dates.',
    action: 'Add document',
    icon: FileText,
    load: () => listExpiringCompliance(365),
    columns: [
      { label: 'Document type', key: 'document_type' },
      { label: 'Employee', key: 'employee_id' },
      { label: 'Expires', key: 'expires_on' },
      { label: 'Status', key: 'status' },
    ],
    form: {
      fields: [
        { name: 'employeeId', label: 'Employee ID', required: true },
        { name: 'documentType', label: 'Document type', required: true },
        { name: 'fileUrl', label: 'File URL', required: true },
        { name: 'expiresOn', label: 'Expiry date', type: 'date' },
      ],
      submit: (values) => createComplianceDocument(values as never),
    },
    secondaryActions: [
      {
        label: 'Employee documents',
        form: {
          fields: [{ name: 'employeeId', label: 'Employee ID', required: true }],
          submit: (values) => listEmployeeDocuments(values.employeeId),
        },
      },
    ],
  },
  Recruitment: {
    title: 'Recruitment',
    subtitle: 'Track open roles through the hiring pipeline.',
    action: 'Create job',
    icon: Users,
    load: listJobs,
    columns: [
      { label: 'Role', key: 'title' },
      { label: 'Department', key: 'department' },
      { label: 'Created', key: 'createdAt' },
      { label: 'Status', key: 'status' },
    ],
    form: {
      fields: [
        { name: 'title', label: 'Job title', required: true },
        { name: 'department', label: 'Department' },
      ],
      submit: (values) => createJob(values as never),
    },
    rowAction: {
      label: 'Close job',
      visible: (row) => String(row.status ?? '').toUpperCase() !== 'CLOSED',
      run: (row) => closeJob(String(row.id)),
    },
  },
  Candidates: {
    title: 'Candidates',
    subtitle: 'Manage applicants and move them through the recruiting pipeline.',
    action: 'Add candidate',
    icon: Users,
    load: listCandidates,
    columns: [
      { label: 'Candidate', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Job', key: 'job_id' },
      { label: 'Stage', key: 'stage' },
    ],
    form: {
      fields: [
        { name: 'jobId', label: 'Job ID', required: true },
        { name: 'name', label: 'Candidate name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
      submit: (values) =>
        createCandidate({ jobId: values.jobId, name: values.name, email: values.email }),
    },
    rowAction: {
      label: 'Move to interview',
      visible: (row) => String(row.stage ?? '').toUpperCase() !== 'INTERVIEW',
      run: (row) => updateCandidateStage(String(row.id), 'INTERVIEW'),
    },
  },
  Performance: {
    title: 'Performance',
    subtitle: 'Set goals and monitor review progress.',
    action: 'Create goal',
    icon: BarChart3,
    load: listGoals,
    columns: [
      { label: 'Goal', key: 'title' },
      { label: 'Employee', key: 'employee_id' },
      { label: 'Created', key: 'created_at' },
      { label: 'Status', key: 'status' },
    ],
    form: {
      fields: [
        { name: 'employeeId', label: 'Employee ID', required: true },
        { name: 'title', label: 'Goal', required: true },
      ],
      submit: (values) => createGoal(values as never),
    },
  },
  Reviews: {
    title: 'Performance Reviews',
    subtitle: 'Review submitted ratings, feedback, and review cycles.',
    action: 'Submit review',
    icon: BarChart3,
    load: listReviews,
    columns: [
      { label: 'Employee', key: 'employee_id' },
      { label: 'Cycle', key: 'cycle' },
      { label: 'Rating', key: 'rating' },
      { label: 'Status', key: 'status' },
    ],
    form: {
      fields: [
        { name: 'employeeId', label: 'Employee ID', required: true },
        { name: 'cycle', label: 'Review cycle', required: true },
        { name: 'rating', label: 'Rating (0-5)', type: 'number' },
        { name: 'feedback', label: 'Feedback' },
      ],
      submit: (values) =>
        createReview({
          employeeId: values.employeeId,
          cycle: values.cycle,
          rating: values.rating ? Number(values.rating) : undefined,
          feedback: values.feedback,
        }),
    },
    secondaryActions: [
      {
        label: 'Employee reviews',
        form: {
          fields: [{ name: 'employeeId', label: 'Employee ID', required: true }],
          submit: (values) => listEmployeeReviews(values.employeeId),
        },
      },
    ],
  },
  Analytics: {
    title: 'Analytics',
    subtitle: 'Understand headcount and workforce activity from live APIs.',
    icon: BarChart3,
    load: async () => {
      const summary = await getAnalyticsSummary();
      return [
        { metric: 'Headcount', value: summary.headcount, status: 'LIVE' },
        { metric: 'Pending leave', value: summary.pendingLeave, status: 'LIVE' },
      ];
    },
    columns: [
      { label: 'Metric', key: 'metric' },
      { label: 'Value', key: 'value' },
      { label: 'Status', key: 'status' },
    ],
  },
  Expenses: {
    title: 'Expenses',
    subtitle: 'Submit and review employee expense claims.',
    action: 'Submit expense',
    icon: WalletCards,
    load: listExpenses,
    columns: [
      { label: 'Category', key: 'category' },
      { label: 'Employee', key: 'employeeId' },
      { label: 'Amount', key: 'amount' },
      { label: 'Status', key: 'status' },
    ],
    form: {
      fields: [
        { name: 'employeeId', label: 'Employee ID', required: true },
        { name: 'category', label: 'Category', required: true },
        { name: 'amount', label: 'Amount', type: 'number', required: true },
        { name: 'description', label: 'Description' },
      ],
      submit: (values) =>
        createExpense({
          employeeId: values.employeeId,
          category: values.category,
          amount: Number(values.amount),
          description: values.description,
        }),
    },
    rowAction: {
      label: 'Approve',
      visible: (row) => String(row.status ?? '').toUpperCase() !== 'APPROVED',
      run: (row) => approveExpense(String(row.id)),
    },
  },
  Training: {
    title: 'Training',
    subtitle: 'Manage courses and employee learning programs.',
    action: 'Create course',
    icon: GraduationCap,
    load: listTrainingCourses,
    columns: [
      { label: 'Course', key: 'title' },
      { label: 'Provider', key: 'provider' },
      { label: 'Status', key: 'status' },
    ],
    form: {
      fields: [
        { name: 'title', label: 'Course title', required: true },
        { name: 'provider', label: 'Provider' },
      ],
      submit: (values) => createTrainingCourse({ title: values.title, provider: values.provider }),
    },
  },
  Enrollments: {
    title: 'Training Enrollments',
    subtitle: 'Track employee enrollment and learning progress.',
    action: 'Enroll employee',
    icon: GraduationCap,
    load: listEnrollments,
    columns: [
      { label: 'Course', key: 'course_id' },
      { label: 'Employee', key: 'employee_id' },
      { label: 'Progress', key: 'progress' },
      { label: 'Status', key: 'status' },
    ],
    form: {
      fields: [
        { name: 'courseId', label: 'Course ID', required: true },
        { name: 'employeeId', label: 'Employee ID', required: true },
      ],
      submit: (values) =>
        createEnrollment({ courseId: values.courseId, employeeId: values.employeeId }),
    },
  },
  Assets: {
    title: 'Assets',
    subtitle: 'Track assigned hardware and company property.',
    action: 'Add asset',
    icon: Archive,
    load: listAssets,
    columns: [
      { label: 'Asset tag', key: 'asset_tag' },
      { label: 'Type', key: 'type' },
      { label: 'Assigned to', key: 'assigned_to' },
      { label: 'Status', key: 'status' },
    ],
    form: {
      fields: [
        { name: 'assetTag', label: 'Asset tag', required: true },
        { name: 'type', label: 'Asset type', required: true },
      ],
      submit: (values) => createAsset({ assetTag: values.assetTag, type: values.type }),
    },
    rowAction: {
      label: 'Return',
      visible: (row) => String(row.status ?? '').toUpperCase() === 'ASSIGNED',
      run: (row) => returnAsset(String(row.asset_tag)),
    },
    secondaryActions: [
      {
        label: 'Assign asset',
        form: {
          fields: [
            { name: 'assetTag', label: 'Asset tag', required: true },
            { name: 'employeeId', label: 'Employee ID', required: true },
          ],
          submit: (values) => assignAsset(values.assetTag, values.employeeId),
        },
      },
    ],
  },
  Compliance: {
    title: 'Compliance',
    subtitle: 'Monitor documents that are expiring within 30 days.',
    icon: FileText,
    load: listExpiringCompliance,
    columns: [
      { label: 'Document', key: 'document_type' },
      { label: 'Employee', key: 'employee_id' },
      { label: 'Expires', key: 'expires_on' },
      { label: 'Status', key: 'status' },
    ],
  },
  Payslips: {
    title: 'Payslip Preview',
    subtitle: 'Preview gross, tax, and estimated net pay for an employee.',
    action: 'Preview payslip',
    icon: WalletCards,
    load: async () => [],
    columns: [
      { label: 'Employee', key: 'employeeId' },
      { label: 'Month', key: 'month' },
      { label: 'Gross', key: 'gross' },
      { label: 'Net', key: 'net' },
    ],
    emptyDescription: 'Enter an employee ID and month to request a live payslip preview.',
    form: {
      fields: [
        { name: 'employeeId', label: 'Employee ID', required: true },
        { name: 'month', label: 'Month', type: 'date', required: true },
      ],
      submit: (values) => getPayslipPreview(values.employeeId, values.month),
    },
  },
  Notifications: {
    title: 'Notifications',
    subtitle: 'Review messages addressed to the current signed-in user.',
    icon: FileText,
    load: listNotifications,
    columns: [
      { label: 'Title', key: 'title' },
      { label: 'Message', key: 'message' },
      { label: 'Category', key: 'category' },
      { label: 'Created', key: 'createdAt' },
    ],
    emptyDescription: 'You have no notifications from the backend.',
    rowAction: {
      label: 'Mark read',
      visible: (row) => !row.readAt,
      run: (row) => markNotificationRead(String(row.id)),
    },
    secondaryActions: [
      {
        label: 'Recipient inbox',
        form: {
          fields: [{ name: 'recipientId', label: 'Recipient user ID', required: true }],
          submit: (values) => listRecipientNotifications(values.recipientId),
        },
      },
    ],
  },
  Settings: {
    title: 'Settings',
    subtitle: 'Review roles and permissions for this tenant.',
    action: 'Create role',
    icon: Settings,
    load: listRoles,
    columns: [
      { label: 'Role', key: 'name' },
      { label: 'Description', key: 'description' },
      { label: 'Status', key: 'status' },
    ],
    emptyDescription: 'No roles are configured for this tenant yet.',
    form: {
      fields: [{ name: 'name', label: 'Role name', required: true }],
      submit: (values) => createRole({ name: values.name }),
    },
    secondaryActions: [
      {
        label: 'Send OTP',
        form: {
          fields: [
            { name: 'tenantId', label: 'Tenant ID', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
          ],
          submit: (values) => sendOtp(values.tenantId, values.email),
        },
      },
      {
        label: 'Verify OTP',
        form: {
          fields: [
            { name: 'tenantId', label: 'Tenant ID', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'code', label: 'Six-digit code', required: true },
          ],
          submit: (values) => verifyOtp(values.tenantId, values.email, values.code),
        },
      },
      {
        label: 'Set up TOTP',
        form: { fields: [], submit: () => setupTotp() },
      },
      {
        label: 'Verify TOTP',
        form: {
          fields: [{ name: 'code', label: 'Authenticator code', required: true }],
          submit: (values) => verifyTotp(values.code),
        },
      },
    ],
  },
  Permissions: {
    title: 'Permissions',
    subtitle: 'Review and extend the tenant permission catalog.',
    action: 'Add permission',
    icon: Settings,
    load: listPermissions,
    columns: [
      { label: 'Module', key: 'module' },
      { label: 'Action', key: 'action' },
    ],
    form: {
      fields: [
        { name: 'module', label: 'Module', required: true },
        { name: 'action', label: 'Action', required: true },
      ],
      submit: (values) => createPermission({ module: values.module, action: values.action }),
    },
  },
  'User Administration': {
    title: 'User Administration',
    subtitle: 'Provision tenant users and review their assigned roles.',
    action: 'Provision user',
    icon: Users,
    load: listUsers,
    columns: [
      { label: 'Email', key: 'email' },
      { label: 'Role', key: 'role' },
      { label: 'Enabled', key: 'enabled' },
    ],
    form: {
      fields: [
        { name: 'email', label: 'Email', type: 'email', required: true },
        {
          name: 'temporaryPassword',
          label: 'Temporary password',
          type: 'password',
          required: true,
        },
        { name: 'role', label: 'Role', required: true },
      ],
      submit: (values) =>
        provisionUser({
          email: values.email,
          temporaryPassword: values.temporaryPassword,
          role: values.role,
        }),
    },
  },
  'Tenant Administration': {
    title: 'Tenant Administration',
    subtitle: 'Provision or suspend tenants with super-admin controls.',
    action: 'Provision tenant',
    icon: Settings,
    load: async () => [],
    columns: [],
    emptyDescription: 'Use the controls to provision or suspend a tenant.',
    form: {
      fields: [{ name: 'tenantId', label: 'Tenant ID', required: true }],
      submit: (values) => provisionTenant(values.tenantId),
    },
    secondaryActions: [
      {
        label: 'Suspend tenant',
        form: {
          fields: [{ name: 'tenantId', label: 'Tenant ID', required: true }],
          submit: (values) => suspendTenant(values.tenantId),
        },
      },
    ],
  },
};

function normalizeRows(value: unknown): ModuleRow[] {
  const result = (value as { content?: unknown })?.content ?? value;
  if (Array.isArray(result)) return result as ModuleRow[];
  if (result && typeof result === 'object') return [result as ModuleRow];
  return [];
}

function displayValue(row: ModuleRow, key: string) {
  if (key === 'fullName') return `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim();
  const value = row[key];
  if (value === null || value === undefined || value === '') return '—';
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

const pageHighlights: Record<string, Array<[string, string]>> = {
  Employees: [
    ['Directory', 'Live employee records and organization data'],
    ['Lifecycle', 'Create and maintain employee profiles'],
    ['Access', 'Use employee IDs for connected workflows'],
  ],
  Attendance: [
    ['Activity', 'Recent tenant attendance punches'],
    ['Capture', 'Record clock-in and clock-out events'],
    ['History', 'Employee-specific history is available through the API'],
  ],
  Leave: [
    ['Requests', 'Submitted leave applications'],
    ['Approvals', 'Status returned by the backend workflow'],
    ['Balances', 'Connect balances when the backend endpoint is added'],
  ],
  Payroll: [
    ['Runs', 'Payroll periods returned by the API'],
    ['Calculation', 'Compute gross totals for a period'],
    ['Payslips', 'Preview endpoint is ready for employee detail screens'],
  ],
  Documents: [
    ['Repository', 'Compliance documents stored by employee'],
    ['Expiry', 'Review documents expiring within 365 days'],
    ['Upload', 'Register a document URL through the backend'],
  ],
  Recruitment: [
    ['Jobs', 'Open and closed job records'],
    ['Candidates', 'Candidate pipeline endpoint is available'],
    ['Stages', 'Move candidates through recruiting stages'],
  ],
  Candidates: [
    ['Pipeline', 'Live candidate records'],
    ['Stages', 'Track applicant progression'],
    ['Hiring', 'Connect candidates to job IDs'],
  ],
  Performance: [
    ['Goals', 'Track employee goals and progress'],
    ['Reviews', 'Create and review performance cycles'],
    ['Feedback', 'Store ratings and review feedback'],
  ],
  Reviews: [
    ['Cycles', 'Review submitted cycles'],
    ['Ratings', 'See live employee ratings'],
    ['Feedback', 'Read review feedback'],
  ],
  Analytics: [
    ['Headcount', 'Live employee count'],
    ['Leave', 'Pending leave count'],
    ['Reports', 'Extend this page with chart endpoints'],
  ],
  Expenses: [
    ['Claims', 'Employee expense submissions'],
    ['Approval', 'Review and approve eligible claims'],
    ['Audit', 'All mutations are tenant-scoped'],
  ],
  Training: [
    ['Courses', 'Training catalog from the API'],
    ['Enrollment', 'Enroll employees through the workflow endpoint'],
    ['Progress', 'Track enrollment status and progress'],
  ],
  Enrollments: [
    ['Assignments', 'Course-to-employee enrollment'],
    ['Progress', 'Live progress values'],
    ['Status', 'Enrollment state from the backend'],
  ],
  Assets: [
    ['Inventory', 'Company assets and assignment state'],
    ['Assignment', 'Assign assets to employees'],
    ['Returns', 'Record returned company property'],
  ],
  Compliance: [
    ['Expiry watch', 'Documents expiring within 30 days'],
    ['Evidence', 'Store employee compliance documents'],
    ['Actions', 'Create documents from the page'],
  ],
  Payslips: [
    ['Gross', 'Salary gross amount'],
    ['Tax', 'Estimated tax calculation'],
    ['Net', 'Estimated net pay preview'],
  ],
  Notifications: [
    ['Inbox', 'Messages for the signed-in user'],
    ['Categories', 'Group notification types'],
    ['Read state', 'Backend read tracking'],
  ],
  Settings: [
    ['Roles', 'Tenant roles from the RBAC API'],
    ['Permissions', 'Permission catalog endpoint is available'],
    ['Security', 'Authentication and tenant controls'],
  ],
  Permissions: [
    ['Modules', 'Permission modules'],
    ['Actions', 'Allowed operations'],
    ['RBAC', 'Tenant-scoped permission catalog'],
  ],
  'User Administration': [
    ['Users', 'Tenant user directory'],
    ['Roles', 'Assigned application roles'],
    ['Provisioning', 'Create users with temporary credentials'],
  ],
};

export function ModuleScreen({ module }: { module: string }) {
  const config = configs[module] ?? configs.Settings;
  const Icon = config.icon;
  const superAdmin = isSuperAdmin();
  const [rows, setRows] = useState<ModuleRow[] | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeForm, setActiveForm] = useState<{
    title: string;
    definition: FormDefinition;
  } | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [operationResult, setOperationResult] = useState('');

  const load = () => {
    setRows(null);
    setError('');
    config
      .load()
      .then((value) => setRows(normalizeRows(value)))
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Unable to load data.');
        setRows([]);
      });
  };

  useEffect(() => {
    load();
  }, [module]);

  const filteredRows = (() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows ?? [];
    return (rows ?? []).filter((row) => JSON.stringify(row).toLowerCase().includes(normalized));
  })();

  const submit = async (event: any) => {
    event.preventDefault();
    if (!activeForm) return;
    setSaving(true);
    setFormError('');
    try {
      const result = await activeForm.definition.submit(formValues);
      setActiveForm(null);
      setFormValues({});
      setOperationResult(
        typeof result === 'string'
          ? result
          : typeof result === 'boolean'
            ? result
              ? 'Verification succeeded.'
              : 'Verification failed.'
            : '',
      );
      const resultRows = normalizeRows(result);
      if (resultRows.length > 0) setRows(resultRows);
      else load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Unable to save this record.');
    } finally {
      setSaving(false);
    }
  };

  const runRowAction = async (row: ModuleRow) => {
    if (!config.rowAction) return;
    setError('');
    try {
      await config.rowAction.run(row);
      load();
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : 'Unable to update this record.',
      );
    }
  };

  return (
    <div className="module-screen">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            <Icon size={14} /> Workspace / {config.title}
          </p>
          <h1>{config.title}</h1>
          <p className="muted">{config.subtitle}</p>
        </div>
        {superAdmin && (config.form || config.secondaryActions?.length) ? (
          <div className="module-actions">
            {config.form && config.action ? (
              <button
                className="primary"
                onClick={() => setActiveForm({ title: config.action!, definition: config.form! })}
              >
                <Plus size={16} /> {config.action}
              </button>
            ) : null}
            {config.secondaryActions?.map((item) => (
              <button
                className="secondary"
                key={item.label}
                onClick={() => setActiveForm({ title: item.label, definition: item.form })}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="module-highlights">
        {(pageHighlights[module] ?? pageHighlights.Settings).map(([title, description]) => (
          <div className="module-highlight card" key={title}>
            <strong>{title}</strong>
            <span>{description}</span>
          </div>
        ))}
      </div>
      {operationResult ? (
        <p className="operation-result" role="status">
          {operationResult}
        </p>
      ) : null}
      <section className="card table-card">
        <div className="card-heading">
          <div>
            <h2>{config.title} records</h2>
            <p className="muted">Live data from the HR Platform API.</p>
          </div>
        </div>
        <div className="table-tools">
          <div className="search">
            <Search size={16} />
            <input
              value={query}
              onChange={(event: any) => setQuery(event.target.value)}
              placeholder={`Search ${config.title.toLowerCase()}...`}
            />
          </div>
          <button className="secondary" onClick={load}>
            Refresh
          </button>
        </div>
        {rows === null ? (
          <div className="skeleton-stack">
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
          </div>
        ) : error ? (
          <EmptyState
            title={`Unable to load ${config.title.toLowerCase()}`}
            description={error}
            action={
              <button className="primary" onClick={load}>
                Retry
              </button>
            }
          />
        ) : filteredRows.length === 0 ? (
          <EmptyState
            title={`No ${config.title.toLowerCase()} found`}
            description={config.emptyDescription ?? 'Create the first record to get started.'}
            action={
              superAdmin && config.form ? (
                <button
                  className="primary"
                  onClick={() => setActiveForm({ title: config.action!, definition: config.form! })}
                >
                  {config.action}
                </button>
              ) : undefined
            }
          />
        ) : (
          <table>
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                {superAdmin && config.rowAction ? <th>Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row: ModuleRow, index: number) => (
                <tr key={String(row.id ?? index)}>
                  {config.columns.map((column) => (
                    <td key={column.key}>
                      {column.key === 'status' ? (
                        <span className="status present">{displayValue(row, column.key)}</span>
                      ) : (
                        displayValue(row, column.key)
                      )}
                    </td>
                  ))}
                  {superAdmin && config.rowAction ? (
                    <td>
                      {config.rowAction.visible?.(row) !== false ? (
                        <button className="link" onClick={() => runRowAction(row)}>
                          {config.rowAction.label}
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {activeForm ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <form className="modal form-modal" onSubmit={submit}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setActiveForm(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2>{activeForm.title}</h2>
            <p className="muted">This form writes directly to the HR Platform API.</p>
            {activeForm.definition.fields.map((field) => (
              <FormInput
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type ?? 'text'}
                required={field.required}
                value={formValues[field.name] ?? ''}
                onChange={(event: any) =>
                  setFormValues({ ...formValues, [field.name]: event.target.value })
                }
              />
            ))}
            {formError ? <p className="login-error">{formError}</p> : null}
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setActiveForm(null)}>
                Cancel
              </button>
              <button type="submit" className="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
