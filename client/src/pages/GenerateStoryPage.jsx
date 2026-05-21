import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../state/auth.context.jsx';
import { speakText, pauseSpeech, resumeSpeech, stopSpeech } from '../utils/storyActions.js';
import { createStorySocket } from '../utils/socketClient.js';

import { downloadStoryAsPdf } from '../utils/pdfDownload.js';
import { StoryCard } from '../components/StoryCard/StoryCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner.jsx';

const MOODS = ['Happy', 'Sad', 'Romantic', 'Horror', 'Mystery', 'Fantasy', 'Sci-Fi', 'Adventure', 'Inspirational', 'Comedy'];
const LOCATIONS = ['Forest', 'Castle', 'Space Station', 'Beach', 'School', 'Haunted House', 'Ancient Temple', 'Futuristic City', 'Village', 'Mountain'];

export default function GenerateStoryPage() {
  const { api, token } = useAuth();

  const [mood, setMood] = useState('Happy');
  const [location, setLocation] = useState('Forest');

  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState(null);
  const [liveStatus, setLiveStatus] = useState('');

  useEffect(() => {
    if (!token) return undefined;

    const socket = createStorySocket(token);
    socket.on('story:generation-progress', (event) => {
      if (event?.stage === 'started') setLiveStatus('Generating story...');
      if (event?.stage === 'saved') setLiveStatus(`Saved: ${event.title}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  async function onGenerate(e) {
    e.preventDefault();
    setLoading(true);
    stopSpeech();
    try {
      setLiveStatus('Sending request...');
      const resp = await api.post('/api/stories/generate', { mood, location });
      setStory(resp.data);
      toast.success('Story generated');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to generate story');
    } finally {
      setLoading(false);
    }
  }

  function metaFor(s) {
    if (!s) return '';
    return `${s.mood} • ${s.location}`;
  }

  function onSpeak() {
    if (!story?.text) return;
    const ok = speakText(story.text);
    if (!ok) toast.error('Text-to-speech not supported in this browser');
  }

  function onPdf() {
    try {
      downloadStoryAsPdf({ title: story?.title, text: story?.text });
      toast.success('PDF downloaded');
    } catch {
      toast.error('Failed to download PDF');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-2xl font-black">Generate a Story</div>
          <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            Local template engine • deterministic seeds • saved to MongoDB.
          </div>
        </div>
      </div>

      <form onSubmit={onGenerate} className="mt-8 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur p-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="mt-1 w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 outline-none"
            >
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
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-2xl py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-extrabold hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStory(null);
              stopSpeech();
            }}
            className="rounded-2xl py-3 px-5 bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition font-semibold"
          >
            Reset
          </button>
        </div>

        {loading ? (
          <div className="mt-4">
            <LoadingSpinner label={liveStatus || 'Generating your story...'} />
          </div>
        ) : null}
        {!loading && liveStatus ? (
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-200">{liveStatus}</div>
        ) : null}
      </form>

      {story ? (
        <>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-slate-700 dark:text-slate-200">Saved automatically. Use actions below.</div>
            <div className="flex gap-3">
              <button
                onClick={onSpeak}
                className="px-4 py-2 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition font-bold text-sm"
              >
                Play
              </button>
              <button
                onClick={() => {
                  pauseSpeech();
                  toast.info('Speech paused');
                }}
                className="px-4 py-2 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition font-bold text-sm"
              >
                Pause
              </button>
              <button
                onClick={() => {
                  resumeSpeech();
                  toast.info('Speech resumed');
                }}
                className="px-4 py-2 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition font-bold text-sm"
              >
                Resume
              </button>
              <button
                onClick={() => {
                  stopSpeech();
                  toast.info('Speech stopped');
                }}
                className="px-4 py-2 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition font-bold text-sm"
              >
                Stop
              </button>

              <button
                onClick={onPdf}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold hover:opacity-95 transition text-sm"
              >
                Download PDF
              </button>
            </div>
          </div>

          <StoryCard title={story.title} meta={metaFor(story)} text={story.text} />
        </>
      ) : null}
    </div>
  );
}

