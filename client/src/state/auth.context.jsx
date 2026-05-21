import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createApi } from '../utils/apiClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [authReady, setAuthReady] = useState(false);

  const api = useMemo(() => createApi(() => localStorage.getItem('token')), []);


  useEffect(() => {
    let cancelled = false;

    async function hydrateUser() {
      if (!token) {
        setUser(null);
        setAuthReady(true);
        return;
      }

      try {
        const { data } = await api.get('/api/user/profile');
        if (!cancelled) {
          setUser({ id: data.id, username: data.username, email: data.email });
        }
      } catch {
        localStorage.removeItem('token');
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    }

    setAuthReady(false);
    hydrateUser();

    return () => {
      cancelled = true;
    };
  }, [api, token]);

  async function login(email, password) {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function signup(payload) {
    const { data } = await api.post('/api/auth/signup', payload);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  }



  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, token, authReady, api, login, signup, logout, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

