import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../state/auth.context.jsx';
import { useTheme } from '../state/theme.context.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner.jsx';

export default function ProfilePage() {
  const { user, api, logout } = useAuth();
  const { theme, setThemeAndPersist, themeReady } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const recent = profile?.recentStories || [];

  const dashboardTitle = useMemo(() => {
    if (!user) return 'Dashboard';
    return `Welcome, ${user.username}`;
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const resp = await api.get('/api/user/profile');
        if (!cancelled) setProfile(resp.data);
      } catch (e) {
        if (!cancelled) toast.error('Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [api]);

  async function onToggleTheme() {
    setSaving(true);
    try {
      await setThemeAndPersist(theme === 'dark' ? 'light' : 'dark');
    } catch {
      toast.error('Failed to update theme');
    } finally {
      setSaving(false);
    }
  }

  function onLogout() {
    logout();
    window.location.assign('/login');
  }

  async function onAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('avatar', file);

    setUploadingAvatar(true);
    try {
      const resp = await api.post('/api/user/avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile((prev) => ({ ...prev, avatarUrl: resp.data.avatarUrl, avatarStorage: resp.data.avatarStorage }));
      toast.success('Profile image updated');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to upload profile image');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  }

  if (loading || !themeReady) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <LoadingSpinner label="Loading dashboard..." />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-slate-700 dark:text-slate-200">No profile loaded.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-black">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              profile.username?.slice(0, 1).toUpperCase()
            )}
          </div>
          <div>
            <div className="text-2xl font-black">{dashboardTitle}</div>
            <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              Manage theme, profile image, and recent stories.
            </div>
            <label className="mt-3 inline-flex cursor-pointer px-3 py-2 rounded-xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition text-xs font-semibold">
              {uploadingAvatar ? 'Uploading...' : 'Upload profile image'}
              <input type="file" accept="image/*" className="sr-only" disabled={uploadingAvatar} onChange={onAvatarChange} />
            </label>
          </div>
        </div>

        <button
          disabled={saving}
          onClick={onToggleTheme}
          className="px-4 py-2 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition text-sm font-semibold"
        >
          {saving ? 'Saving...' : `Theme: ${theme}`}
        </button>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur p-5 md:col-span-1">
          <div className="text-sm text-slate-700 dark:text-slate-200">Total Stories</div>
          <div className="mt-2 text-3xl font-black">{profile.totalStories}</div>
          <div className="mt-3 text-xs text-slate-700 dark:text-slate-200">Generated and saved automatically.</div>

          <button
            onClick={onLogout}
            className="mt-5 w-full rounded-2xl py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold hover:opacity-95 transition"
          >
            Logout
          </button>
        </div>

        <div className="md:col-span-2 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur p-5">
          <div className="font-extrabold">Recent Stories</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">Latest 5 items from your history.</div>

          {recent.length === 0 ? (
            <div className="mt-6 text-sm text-slate-700 dark:text-slate-200">No stories yet. Generate one!</div>
          ) : (
            <ul className="mt-4 space-y-3">
              {recent.map((s) => (
                <li key={s._id} className="rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4">
                  <div className="font-bold">{s.title}</div>
                  <div className="text-xs text-slate-700 dark:text-slate-200 mt-1">
                    {s.mood} • {s.location} {s.isAdventure ? '• Adventure' : ''}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

