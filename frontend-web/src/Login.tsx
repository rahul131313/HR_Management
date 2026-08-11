import { useState } from 'react';
import { Building2, LockKeyhole, Mail } from 'lucide-react';
import { login } from './api';
export function Login({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [tenant, setTenant] = useState('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(tenant, email, password);
      onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="brand login-brand">
          <div className="brand-mark">H</div>
          <span>
            horizon<span className="brand-dot">.</span>
          </span>
        </div>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to your HR workspace.</p>
        <label className="form-field">
          <span>Workspace</span>
          <div className="input-with-icon">
            <Building2 size={16} />
            <input
              value={tenant}
              onChange={(e: any) => setTenant(e.target.value)}
              required
              placeholder="demo"
            />
          </div>
        </label>
        <label className="form-field">
          <span>Email</span>
          <div className="input-with-icon">
            <Mail size={16} />
            <input
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />
          </div>
        </label>
        <label className="form-field">
          <span>Password</span>
          <div className="input-with-icon">
            <LockKeyhole size={16} />
            <input
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
          </div>
        </label>
        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary login-button" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <small className="login-note">
          Your session uses a secure bearer token and httpOnly refresh cookie.
        </small>
      </form>
    </main>
  );
}
