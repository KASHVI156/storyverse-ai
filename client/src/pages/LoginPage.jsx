import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../state/auth.context.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in');
      navigate('/profile');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="text-2xl font-black">Login</div>
      <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">
        Welcome back to Story Verse AI.
      </div>

      <form onSubmit={onSubmit} className="mt-8 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur p-5">
        <label className="block text-sm font-semibold">Email</label>
        <input
          className="mt-1 w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 outline-none"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-sm font-semibold mt-4">Password</label>
        <input
          className="mt-1 w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 outline-none"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="mt-6 w-full rounded-2xl py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-extrabold hover:opacity-95 transition disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-sm text-slate-700 dark:text-slate-200">
          No account?{' '}
          <Link className="text-cyan-400 hover:text-cyan-300 font-semibold" to="/signup">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
}

