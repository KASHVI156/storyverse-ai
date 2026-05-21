import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../state/auth.context.jsx';
import { StoryCard } from '../components/StoryCard/StoryCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner.jsx';


const MOODS = ['Happy', 'Sad', 'Romantic', 'Horror', 'Mystery', 'Fantasy', 'Sci-Fi', 'Adventure', 'Inspirational', 'Comedy'];
const LOCATIONS = ['Forest', 'Castle', 'Space Station', 'Beach', 'School', 'Haunted House', 'Ancient Temple', 'Futuristic City', 'Village', 'Mountain'];

export default function StoryHistoryPage() {
  const { api } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [q, setQ] = useState('');
  const [mood, setMood] = useState('');
  const [location, setLocation] = useState('');

  const favSet = useMemo(() => new Set(favorites.map((s) => String(s._id))), [favorites]);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (mood) params.set('mood', mood);
      if (location) params.set('location', location);

      const resp = await api.get(`/api/stories?${params.toString()}`);
      setStories(resp.data);

      const favResp = await api.get('/api/favorites');
      setFavorites(favResp.data);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSearch(e) {
    e.preventDefault();
    await load();
  }

  async function onDelete(id) {
    if (!window.confirm('Delete this story?')) return;
    try {
      await api.delete(`/api/stories/${id}`);
      toast.success('Story deleted');
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Delete failed');
    }
  }

  async function onFavorite(story) {
    try {
      await api.post('/api/favorites', { storyId: story._id, mood: story.mood, location: story.location });
      toast.success('Added to favorites');
      const favResp = await api.get('/api/favorites');
      setFavorites(favResp.data);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Favorite failed');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="text-2xl font-black">Story History</div>
          <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">Search, filter, delete, and favorite your generated stories.</div>
        </div>
      </div>

      <form onSubmit={onSearch} className="mt-8 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur p-5">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="title or text"
              className="mt-1 w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="mt-1 w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 outline-none"
            >
              <option value="">All</option>
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 outline-none"
            >
              <option value="">All</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-2xl py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-extrabold hover:opacity-95 transition"
            >
              Apply
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="mt-8">
          <LoadingSpinner label="Loading your stories..." />
        </div>
      ) : stories.length === 0 ? (
        <div className="mt-8 text-slate-700 dark:text-slate-200">No stories found. Generate one!</div>
      ) : (
        <div className="mt-6">
          {stories.map((s) => {
            const isFav = favSet.has(String(s._id));
            return (
              <div key={s._id}>
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div />
                  <div className="flex gap-3">
                    <button
                      onClick={() => onFavorite(s)}
                      disabled={isFav}
                      className={`px-4 py-2 rounded-2xl font-bold text-sm transition border ${
                        isFav
                          ? 'bg-white/10 border-white/20 text-slate-400 cursor-not-allowed'
                          : 'bg-white/60 dark:bg-white/10 border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15'
                      }`}
                    >
                      {isFav ? 'Favorited' : 'Favorite'}
                    </button>
                    <button
                      onClick={() => onDelete(s._id)}
                      className="px-4 py-2 rounded-2xl bg-rose-500/90 text-white font-bold text-sm hover:opacity-95 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <StoryCard title={s.title} meta={`${s.mood} • ${s.location} • ${s.isAdventure ? 'Adventure' : 'Story'}`} text={s.text} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

