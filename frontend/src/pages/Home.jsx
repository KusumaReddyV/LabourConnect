import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/ui/PageLoader';
import PublicHome from './PublicHome';
import ClientExperience from './ClientExperience';

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'client') {
      document.documentElement.classList.add('client-hub');
      return () => document.documentElement.classList.remove('client-hub');
    }
  }, [isAuthenticated, user?.role]);

  if (loading) return <PageLoader label="Loading" />;

  if (isAuthenticated) {
    if (user.role === 'labour' || user.role === 'worker') return <Navigate to="/labour/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'client') return <ClientExperience />;
  }

  return <PublicHome />;
}
