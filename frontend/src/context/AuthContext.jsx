import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'lc_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const normalizeRole = (role) => {
    const r = String(role || '').toLowerCase();
    if (r === 'worker' || r === 'labour') return 'labour';
    if (r === 'admin') return 'admin';
    if (r === 'client') return 'client';
    return r || role;
  };

  const persistUser = (data) => {
    const payload = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: normalizeRole(data.role),
      token: data.token,
      profileId: data.profileId || data.labourId || data.clientId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setUser(payload);
    return payload;
  };

  const login = async (email, password, role) => {
    const { data } = await authAPI.login({ email, password, role });
    return persistUser(data);
  };

  const registerLabour = async (formData) => {
    const { data } = await authAPI.registerLabour(formData);
    return persistUser(data);
  };

  const registerClient = async (formData) => {
    const { data } = await authAPI.registerClient(formData);
    return persistUser(data);
  };

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }
    const parsed = JSON.parse(stored);
    if (!parsed.token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      const updated = {
        ...parsed,
        name: data.name,
        email: data.email,
        role: normalizeRole(data.role),
        profile: data.profile,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const dashboardPath =
    user?.role === 'labour'
      ? '/labour/dashboard'
      : user?.role === 'client'
        ? '/client/dashboard'
        : user?.role === 'admin'
          ? '/admin/dashboard'
          : '/';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registerLabour,
        registerClient,
        logout,
        refreshUser,
        isAuthenticated: !!user?.token,
        dashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
