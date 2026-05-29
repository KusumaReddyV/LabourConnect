import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/ui/PageLoader';

/**
 * @param {string[]} roles - allowed roles (optional)
 * @param {string} loginMessage - optional flash for login page
 */
export default function ProtectedRoute({ children, roles, loginMessage }) {
  const { user, loading, dashboardPath } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!user?.token) {
    const needsAdmin =
      roles?.includes('admin') || location.pathname.startsWith('/admin');
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
          message: loginMessage || 'Please sign in to continue',
          role: needsAdmin ? 'admin' : undefined,
        }}
      />
    );
  }

  const userRole =
    user.role === 'worker' ? 'labour' : user.role === 'administrator' ? 'admin' : user.role;
  if (roles && !roles.includes(userRole)) {
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
}
