import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api('/api/auth/me')
      .then((data) => setUser(data.authenticated ? data : null))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  async function login(email, password, rememberMe) {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: { email, password, rememberMe }
    });
    setUser(data);
  }

  async function logout() {
    await api('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function hasRole(user, ...roles) {
  return roles.some((role) => user?.roles?.includes(role));
}
