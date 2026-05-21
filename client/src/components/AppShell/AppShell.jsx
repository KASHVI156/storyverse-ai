import React, { useEffect } from 'react';
import { NavBar } from './NavBar.jsx';
import { Footer } from './Footer.jsx';
import { useTheme } from '../../state/theme.context.jsx';

export function AppShell({ children }) {
  const { themeReady, theme } = useTheme();

  useEffect(() => {
    if (!themeReady) return;
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [themeReady, theme]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

