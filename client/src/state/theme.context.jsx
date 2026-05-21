import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from './auth.context.jsx';
import { publicApi } from '../utils/apiClient.js';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { token, api } = useAuth();
  const [themeReady, setThemeReady] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      setThemeReady(false);
      if (!token) {
        try {
          const resp = await publicApi.get('/api/session/preferences');
          const next = resp.data?.theme === 'dark' ? 'dark' : localStorage.getItem('theme') || 'light';
          if (!cancelled) {
            setTheme(next);
            localStorage.setItem('theme', next);
          }
        } catch {
          if (!cancelled) setTheme(localStorage.getItem('theme') || 'light');
        }
        if (!cancelled) setThemeReady(true);
        return;
      }

      try {
        const resp = await api.get('/api/user/profile');
        const dark = !!resp.data?.preferences?.theme?.darkMode;
        const next = dark ? 'dark' : 'light';
        if (!cancelled) {
          setTheme(next);
          localStorage.setItem('theme', next);
        }
      } catch {
        if (!cancelled) setTheme(localStorage.getItem('theme') || 'light');
      } finally {
        if (!cancelled) setThemeReady(true);
      }
    }

    sync();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function setThemeAndPersist(nextTheme) {
    const next = nextTheme === 'dark' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);

    if (!token) {
      await publicApi.put('/api/session/preferences', { theme: next });
      return;
    }

    const darkMode = next === 'dark';
    await api.put('/api/user/preferences', { preferences: { theme: { darkMode } } });
  }

  const value = useMemo(() => ({ themeReady, theme, setThemeAndPersist }), [themeReady, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

