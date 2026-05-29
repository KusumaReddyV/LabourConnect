import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validation';
import Button from '../components/ui/Button';

const normalizeRole = (role) => {
  if (!role) return 'client';
  const r = String(role).toLowerCase();
  return r === 'worker' || r === 'labour' ? 'labour' : r === 'admin' ? 'admin' : 'client';
};

const loginErrorMessage = (err) => {
  const status = err.response?.status;
  const msg = err.response?.data?.message;
  if (msg) return msg;
  if (status === 403) return 'Your account cannot sign in right now. Please contact support.';
  if (status === 400) return 'Please check your email and password.';
  if (!err.response) return 'Unable to reach the server. Check your connection and try again.';
  return 'Sign in failed. Please try again.';
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const bannerMessage = location.state?.message;
  const redirectTo = location.state?.from;
  const initialRole = location.state?.role || searchParams.get('role');
  const [role, setRole] = useState(() => normalizeRole(initialRole || 'client'));

  useEffect(() => {
    if (initialRole) setRole(normalizeRole(initialRole));
  }, [initialRole]);

  const resolveRedirect = (userRole) => {
    const r = normalizeRole(userRole);
    if (redirectTo) {
      if (r === 'client' && redirectTo.startsWith('/client')) return redirectTo;
      if (r === 'labour' && redirectTo.startsWith('/labour')) return redirectTo;
      if (r === 'admin' && redirectTo.startsWith('/admin')) return redirectTo;
    }
    if (r === 'labour') return '/labour/dashboard';
    if (r === 'client') return '/client/dashboard';
    if (r === 'admin') return '/admin/dashboard';
    return '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) {
      setErrors({ email: emailErr });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const user = await login(email.trim(), password, role === 'admin' ? 'admin' : role);
      showToast('Welcome back!', 'success');
      navigate(resolveRedirect(user.role), { replace: true });
    } catch (err) {
      showToast(loginErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Sign In</h2>
        {bannerMessage && <div className="login-banner">{bannerMessage}</div>}
        <p className="auth-role-hint">Sign in as</p>
        <div className="role-links auth-role-tabs mb-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            className={role === 'client' ? 'active' : ''}
            onClick={() => setRole('client')}
          >
            Client
          </button>
          <button
            type="button"
            className={role === 'labour' ? 'active' : ''}
            onClick={() => setRole('labour')}
          >
            Worker
          </button>
          <button
            type="button"
            className={role === 'admin' ? 'active' : ''}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({});
              }}
              placeholder="name@gmail.com"
              autoComplete="email"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" loading={loading} className="btn-block">
            Sign In
          </Button>
        </form>
        <div className="auth-links">
          <p>
            New client? <Link to="/register/client">Register here</Link>
          </p>
          <p>
            Worker? <Link to="/register/labour" state={{ from: '/login', role: 'labour' }}>
              Labour registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
