import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../state/auth.context.jsx';
import { useTheme } from '../../state/theme.context.jsx';

const NAV_LINKS = [
  ['/', 'Home'],
  ['/generate', 'Generate'],
  ['/adventure', 'Adventure'],
  ['/history', 'History'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

export function NavBar() {
  const { user, token, authReady, logout } = useAuth();
  const { theme, setThemeAndPersist, themeReady } = useTheme();
  const loc = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function onLogout() {
    logout();
    setMenuOpen(false);
    navigate('/login');
  }

  async function onToggleTheme() {
    await setThemeAndPersist(theme === 'dark' ? 'light' : 'dark');
  }

  function linkClass(to, mobile = false) {
    const active = loc.pathname === to;
    const base = mobile
      ? 'block rounded-xl px-4 py-3 text-base font-semibold transition'
      : 'hover:text-cyan-400 transition-colors';

    return `${base} ${
      active
        ? 'text-cyan-500 dark:text-cyan-300 bg-cyan-500/10 md:bg-transparent'
        : 'text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-white/10 md:hover:bg-transparent'
    }`;
  }

  function MobileLink({ to, children }) {
    return (
      <Link to={to} className={linkClass(to, true)} onClick={() => setMenuOpen(false)}>
        {children}
      </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="backdrop-blur-md bg-white/40 dark:bg-slate-950/40 border-b border-white/60 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <motion.div
            className="flex min-w-0 items-center gap-2"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex min-w-0 items-center gap-2" onClick={() => setMenuOpen(false)}>
              <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 via-cyan-500 to-pink-500 shadow-lg shadow-cyan-400/30" />
              <div className="truncate font-extrabold tracking-tight">Story Verse AI</div>
            </Link>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-5 text-sm" aria-label="Primary navigation">
            {NAV_LINKS.map(([to, label]) => (
              <Link key={to} to={to} className={linkClass(to)}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-3">
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

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70 text-slate-900 border border-white/70 hover:bg-white/90 dark:bg-white/10 dark:text-slate-100 dark:border-white/10 dark:hover:bg-white/15 transition lg:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span className={`h-0.5 w-5 rounded bg-current transition ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`h-0.5 w-5 rounded bg-current transition ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-5 rounded bg-current transition ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>

        <div
          id="mobile-navigation"
          className={`lg:hidden border-t border-white/60 dark:border-white/10 bg-white/85 dark:bg-slate-950/90 backdrop-blur-xl transition-all ${
            menuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map(([to, label]) => (
                <MobileLink key={to} to={to}>
                  {label}
                </MobileLink>
              ))}
              {authReady && token ? (
                <MobileLink to="/profile">Profile</MobileLink>
              ) : null}
            </nav>

            <div className="mt-4 grid gap-3 border-t border-sky-100 pt-4 dark:border-white/10">
              {themeReady ? (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="min-h-11 rounded-xl bg-sky-100 px-4 py-3 text-left text-sm font-semibold text-slate-900 border border-sky-200 hover:bg-sky-200 dark:bg-white/10 dark:text-slate-100 dark:border-white/10 dark:hover:bg-white/15 transition"
                >
                  Switch to {theme === 'dark' ? 'light' : 'dark'} theme
                </button>
              ) : null}

              {!authReady ? null : token ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="min-h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-3 text-left text-sm font-bold text-white hover:opacity-95 transition"
                >
                  Logout {user?.username ? `(${user.username})` : ''}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="min-h-11 rounded-xl bg-white/70 px-4 py-3 text-center text-sm font-semibold text-cyan-600 border border-white/70 hover:bg-white dark:bg-white/10 dark:border-white/10 dark:text-cyan-300 dark:hover:bg-white/15 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="min-h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-3 text-center text-sm font-bold text-white hover:opacity-95 transition"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

