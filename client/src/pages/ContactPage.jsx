import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../state/auth.context.jsx';

export default function ContactPage() {
  const { api } = useAuth();



  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/contact', { name, email, message });
      toast.success('Message sent. We will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      <div className="text-2xl font-black">Contact Story Verse AI</div>
      <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">
        Send feedback, questions, or collaboration ideas.
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-8 rounded-3xl glass border-white/60 dark:border-white/10 backdrop-blur p-5 bg-white/50 dark:bg-white/5"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Name</label>
            <input
              className="mt-1 w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={60}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Email</label>
            <input
              className="mt-1 w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold">Message</label>
          <textarea
            className="mt-1 w-full rounded-xl px-4 py-2 bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 outline-none min-h-[140px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={5}
            maxLength={2000}
          />
          <div className="mt-1 text-xs text-slate-700 dark:text-slate-200">
            {message.length}/2000
          </div>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full rounded-2xl py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-extrabold hover:opacity-95 transition disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send message'}
        </button>
      </form>
    </div>
  );
}

