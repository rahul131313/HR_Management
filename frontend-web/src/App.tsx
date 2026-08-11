import { useEffect, useState } from 'react';
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  WalletCards,
} from 'lucide-react';
import { Login } from './Login';
import { EmptyState, Skeleton } from './ui';
import {
  clearAccessToken,
  getAuthClaims,
  getAnalyticsSummary,
  listEmployees,
  logout,
  refreshSession,
  type AnalyticsSummary,
  type Employee,
} from './api';
import { ModuleScreen } from './ModuleScreen';

const navigation: Array<[string, any]> = [
  ['Overview', LayoutDashboard],
  ['Employees', Users],
  ['Attendance', Clock3],
  ['Leave', CalendarDays],
  ['Payroll', WalletCards],
  ['Documents', FileText],
  ['Recruitment', Users],
  ['Candidates', Users],
  ['Performance', Users],
  ['Reviews', FileText],
  ['Analytics', FileText],
  ['Expenses', WalletCards],
  ['Training', FileText],
  ['Enrollments', FileText],
  ['Assets', FileText],
  ['Compliance', FileText],
  ['Payslips', WalletCards],
  ['Notifications', Bell],
  ['Permissions', Settings],
  ['User Administration', Users],
  ['Tenant Administration', Settings],
];

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(() => {
    const value = location.hash.replace('#/', '');
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Overview';
  });
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const authClaims = getAuthClaims();
  useEffect(() => {
    document.title = `${active} · Horizon HR`;
  }, [active]);
  useEffect(() => {
    let current = true;
    refreshSession()
      .then(() => current && setAuthenticated(true))
      .catch(() => current && setAuthenticated(false));
    return () => {
      current = false;
    };
  }, []);
  useEffect(() => {
    const expireSession = () => {
      clearAccessToken();
      setAuthenticated(false);
    };
    window.addEventListener('hr:session-expired', expireSession);
    return () => window.removeEventListener('hr:session-expired', expireSession);
  }, []);
  useEffect(() => {
    if (!authenticated || active !== 'Overview') return;
    let current = true;
    setError('');
    Promise.all([getAnalyticsSummary(), listEmployees()])
      .then(([metrics, people]) => {
        if (!current) return;
        setSummary(metrics);
        setEmployees(people.content);
      })
      .catch(
        (e) =>
          current && setError(e instanceof Error ? e.message : 'Unable to load dashboard data.'),
      );
    return () => {
      current = false;
    };
  }, [authenticated, active, refreshKey]);
  const navigate = (label: string) => {
    setActive(label);
    history.pushState({}, '', `#/${label.toLowerCase()}`);
  };
  const signOut = async () => {
    try {
      await logout();
    } finally {
      clearAccessToken();
      setAuthenticated(false);
    }
  };
  if (authenticated === null) {
    return <div className="auth-loading">Restoring your session...</div>;
  }
  if (!authenticated) return <Login onAuthenticated={() => setAuthenticated(true)} />;
  return (
    <div className="app-shell">
      <aside className={collapsed ? 'sidebar collapsed' : 'sidebar'}>
        <div className="brand">
          <div className="brand-mark">H</div>
          {!collapsed && (
            <span>
              horizon<span className="brand-dot">.</span>
            </span>
          )}
        </div>
        <nav>
          {navigation.map(([label, Icon]) => (
            <button
              className={active === label ? 'nav-item active' : 'nav-item'}
              onClick={() => navigate(label)}
              key={label}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            className={active === 'Settings' ? 'nav-item active' : 'nav-item'}
            onClick={() => navigate('Settings')}
          >
            <Settings size={18} />
            {!collapsed && <span>Settings</span>}
          </button>
          <button className="nav-item" onClick={() => void signOut()}>
            <LogOut size={18} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>
      <main className="main">
        <header>
          <button
            className="icon-button"
            aria-label="Toggle navigation"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span> {active}
          </div>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Search employees"
              onClick={() => navigate('Employees')}
            >
              <Search size={19} />
            </button>
            <button
              className="icon-button notification"
              aria-label="Notifications"
              onClick={() => navigate('Notifications')}
            >
              <Bell size={19} />
              <i />
            </button>
            <div className="user">
              <div className="avatar small">
                {(authClaims?.email ?? 'U').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <strong>{authClaims?.email ?? 'Signed-in user'}</strong>
                <small>{authClaims?.role ?? 'Authenticated user'}</small>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>
        {active === 'Overview' ? (
          <Dashboard
            summary={summary}
            employees={employees}
            error={error}
            canManage={authClaims?.role === 'SUPER_ADMIN'}
            onAddEmployee={() => navigate('Employees')}
            retry={() => setRefreshKey((value) => value + 1)}
          />
        ) : (
          <section className="content">
            <ModuleScreen module={active} />
          </section>
        )}
      </main>
    </div>
  );
}

function Dashboard({
  summary,
  employees,
  error,
  canManage,
  onAddEmployee,
  retry,
}: {
  summary: AnalyticsSummary | null;
  employees: Employee[] | null;
  error: string;
  canManage: boolean;
  onAddEmployee: () => void;
  retry: () => void;
}) {
  return (
    <section className="content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Organization overview</p>
          <h1>Dashboard</h1>
          <p className="muted">Live workforce data from your HR Platform API.</p>
        </div>
        {canManage ? (
          <button className="primary" onClick={onAddEmployee}>
            + Add employee
          </button>
        ) : null}
      </div>
      {error ? (
        <EmptyState
          title="Unable to load dashboard"
          description={error}
          action={
            <button className="primary" onClick={retry}>
              Retry
            </button>
          }
        />
      ) : (
        <>
          <div className="stat-grid">
            <LiveStat title="Total employees" value={summary?.headcount} icon={<Users />} />
            <LiveStat title="Pending leave" value={summary?.pendingLeave} icon={<CalendarDays />} />
            <LiveStat title="Attendance" value={undefined} icon={<Clock3 />} />
            <LiveStat title="Payroll" value={undefined} icon={<WalletCards />} />
          </div>
          <section className="card table-card">
            <div className="card-heading">
              <div>
                <h2>Employee directory</h2>
                <p className="muted">Live records for your tenant.</p>
              </div>
              <button className="link">View directory →</button>
            </div>
            {employees === null ? (
              <div className="skeleton-stack">
                <Skeleton height={24} />
                <Skeleton height={24} />
                <Skeleton height={24} />
              </div>
            ) : employees.length === 0 ? (
              <EmptyState
                title="No employees yet"
                description="Add the first employee to get started."
                action={
                  canManage ? (
                    <button className="primary" onClick={onAddEmployee}>
                      Add employee
                    </button>
                  ) : undefined
                }
              />
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <div className="person">
                          <div className="avatar">
                            {employee.firstName[0]}
                            {employee.lastName[0]}
                          </div>
                          <strong>
                            {employee.firstName} {employee.lastName}
                          </strong>
                        </div>
                      </td>
                      <td>{employee.department ?? '—'}</td>
                      <td>{employee.jobTitle ?? '—'}</td>
                      <td>
                        <span className="status present">{employee.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </section>
  );
}
function LiveStat({ title, value, icon }: { title: string; value?: number; icon: any }) {
  return (
    <div className="card stat">
      <div className="stat-top">
        <span>{title}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      {value === undefined ? (
        <Skeleton width="60%" height={32} />
      ) : (
        <strong>{value.toLocaleString('en-IN')}</strong>
      )}
      <small>Live API value</small>
    </div>
  );
}
