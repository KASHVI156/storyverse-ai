import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../state/auth.context.jsx';
import { speakText, pauseSpeech, resumeSpeech, stopSpeech } from '../utils/storyActions.js';

import { downloadStoryAsPdf } from '../utils/pdfDownload.js';
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner.jsx';
import { StoryCard } from '../components/StoryCard/StoryCard.jsx';

const MOODS = ['Happy', 'Sad', 'Romantic', 'Horror', 'Mystery', 'Fantasy', 'Sci-Fi', 'Adventure', 'Inspirational', 'Comedy'];
const LOCATIONS = ['Forest', 'Castle', 'Space Station', 'Beach', 'School', 'Haunted House', 'Ancient Temple', 'Futuristic City', 'Village', 'Mountain'];

export default function AdventureModePage() {
  const { api } = useAuth();

  const [mood, setMood] = useState('Adventure');
  const [location, setLocation] = useState('Forest');

  const [adventureId, setAdventureId] = useState(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [excerpt, setExcerpt] = useState('');
  const [finalStory, setFinalStory] = useState(null);

  const [loading, setLoading] = useState(false);

  const isRunning = useMemo(() => !!adventureId && !finalStory, [adventureId, finalStory]);

  async function startAdventure(e) {
    e.preventDefault();
    setLoading(true);
    stopSpeech();

    try {
      const resp = await api.post('/api/stories/adventure/start', { mood, location });
      setAdventureId(resp.data.adventureId);
      setStageIndex(resp.data.stageIndex ?? 0);
      setExcerpt(resp.data.excerpt || '');
      setChoices(resp.data.choices || []);
      setFinalStory(null);
      toast.success('Adventure started');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to start adventure');
    } finally {
      setLoading(false);
    }
  }

  async function choose(choiceIndex) {
    if (!adventureId) return;
    setLoading(true);
    stopSpeech();

    try {
      const resp = await api.post('/api/stories/adventure/step', {
        adventureId,
        mood,
        location,
        stageIndex,
        choiceIndex,
      });

      if (resp.data.done) {
        setFinalStory(resp.data.finalStory || resp.data.story || null);
        setExcerpt('');
        setChoices([]);
        toast.success('Adventure complete');
      } else {
        setStageIndex(resp.data.stageIndex);
        setExcerpt(resp.data.excerpt);
        setChoices(resp.data.choices || []);
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to continue');
    } finally {
      setLoading(false);
    }
  }

  function onSpeak() {
    const txt = finalStory?.text || excerpt;
    if (!txt) return;
    const ok = speakText(txt);
    if (!ok) toast.error('Text-to-speech not supported in this browser');
  }

  function onPdf() {
    try {
      downloadStoryAsPdf({ title: finalStory?.title || 'Adventure Story', text: finalStory?.text || excerpt });
      toast.success('PDF downloaded');
    } catch {
      toast.error('Failed to download PDF');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-2xl font-black">Adventure Mode</div>
          <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            Start and follow the branching choices. Your final story is saved automatically.
          </div>
        </div>
      </div>

      <form onSubmit={startAdventure} className="mt-8 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur p-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="mt-1 w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 outline-none"
              disabled={isRunning}
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
              disabled={isRunning}
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
            disabled={loading || isRunning}
            className="flex-1 rounded-2xl py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-extrabold hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? 'Starting...' : isRunning ? 'In Progress' : 'Start Adventure'}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setAdventureId(null);
              setStageIndex(0);
              setChoices([]);
              setExcerpt('');
              setFinalStory(null);
              stopSpeech();
            }}
            className="rounded-2xl py-3 px-5 bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition font-semibold"
          >
            Reset
          </button>
        </div>

        {loading ? (
          <div className="mt-4">
            <LoadingSpinner label={isRunning ? 'Thinking...' : 'Preparing your adventure...'} />
          </div>
        ) : null}
      </form>

      {excerpt ? (
        <div className="mt-6">
          <div className="text-sm text-slate-700 dark:text-slate-200">Stage {stageIndex + 1}</div>
          <StoryCard title="Adventure Excerpt" meta={`${mood} • ${location}`} text={excerpt} isLoading={false} />

          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            {choices.map((c, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => choose(idx)}
                className="rounded-2xl py-3 px-4 bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition font-semibold"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {finalStory ? (
        <div className="mt-6">
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-slate-700 dark:text-slate-200">Final story (saved)</div>
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

          <StoryCard title={finalStory.title} meta={`${finalStory.mood} • ${finalStory.location} • Adventure`} text={finalStory.text} />
        </div>
      ) : null}
    </div>
  );
}

