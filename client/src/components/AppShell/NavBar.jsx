import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../state/auth.context.jsx';
import { useTheme } from '../../state/theme.context.jsx';

export function NavBar() {
  const { user, token, authReady, logout } = useAuth();
  const { theme, setThemeAndPersist, themeReady } = useTheme();
  const loc = useLocation();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate('/login');
  }

  async function onToggleTheme() {
    await setThemeAndPersist(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="backdrop-blur-md bg-white/40 dark:bg-slate-950/40 border-b border-white/60 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-cyan-500 to-pink-500 shadow-lg shadow-cyan-400/30" />
            <div className="font-extrabold tracking-tight">Story Verse AI</div>
          </motion.div>

          <nav className="hidden md:flex items-center gap-5 text-sm">
            {[
              ['/', 'Home'],
              ['/generate', 'Generate'],
              ['/adventure', 'Adventure'],
              ['/history', 'History'],
              ['/about', 'About'],
              ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className={
                  (loc.pathname === to ? 'text-cyan-400' : 'text-slate-700 dark:text-slate-200') +
                  ' hover:text-cyan-400 transition-colors'
                }
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {themeReady ? (
              <button
                type="button"
                onClick={onToggleTheme}
                className="px-3 py-2 rounded-xl bg-sky-100 text-slate-900 border border-sky-200 hover:bg-sky-200 dark:bg-white/10 dark:text-slate-100 dark:border-white/10 dark:hover:bg-white/15 transition text-xs font-semibold"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            ) : null}
            {!authReady ? null : token ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className="px-3 py-2 rounded-xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition"
                >
                  <span className="text-xs font-semibold">{user?.username || 'Profile'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">Login</Link>
                <Link to="/signup" className="px-3 py-2 rounded-xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition text-sm font-semibold">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

