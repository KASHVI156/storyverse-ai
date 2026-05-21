import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-cyan-500 to-pink-500 opacity-25 animate-pulse" />
      <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-cyan-400/30 blur-3xl animate-bounce" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-pink-400/30 blur-3xl animate-bounce" />

      <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 text-xs font-semibold">
            ✨ Local AI-style story generation
            <span className="text-cyan-400">•</span>
            Templates + branching logic
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Story Verse AI
            </span>
          </h1>

          <p className="mt-4 text-base md:text-lg text-slate-700 dark:text-slate-200">
            Generate magical AI-powered stories based on your mood and imagination.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/generate"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg shadow-cyan-400/20 hover:opacity-95 transition"
            >
              Start Generating
            </Link>
            <Link
              to="/adventure"
              className="px-6 py-3 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 font-bold hover:bg-white/80 dark:hover:bg-white/15 transition"
            >
              Try Adventure Mode
            </Link>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {[
              ['Mood Engine', 'Pick the vibe: happy, horror, sci-fi—your story adapts.'],
              ['Branching Choices', 'Adventure Mode feels like a game with unique turns.'],
              ['Listen & Download', 'Text-to-speech + polished PDF export for sharing.'],
            ].map(([t, d]) => (
              <motion.div
                key={t}
                whileHover={{ y: -6 }}
                className="p-5 rounded-3xl bg-white/50 dark:bg-white/10 border border-white/60 dark:border-white/10 backdrop-blur"
              >
                <div className="font-extrabold">{t}</div>
                <div className="text-sm mt-2 text-slate-700 dark:text-slate-200">{d}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

