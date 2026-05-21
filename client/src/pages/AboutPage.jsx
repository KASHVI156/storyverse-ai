import React from 'react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    title: 'Mood + Location Engine',
    desc: 'Choose a vibe and a setting. Story Verse AI builds a coherent tale using deterministic templates.',
    accent: 'from-cyan-500 to-purple-500',
  },
  {
    title: 'Adventure Mode',
    desc: 'Follow choices through stages. Each step updates the narrative and the final story is saved.',
    accent: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Listen + Export',
    desc: 'Text-to-speech for your story, plus polished PDF downloads for sharing and archiving.',
    accent: 'from-cyan-500 to-pink-500',
  },
  {
    title: 'Favorites + History',
    desc: 'Search, filter, delete, and favorite the stories you love, powered by MongoDB.',
    accent: 'from-purple-500 to-cyan-500',
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-white to-cyan-100 opacity-80 dark:from-purple-500 dark:via-cyan-500 dark:to-pink-500 dark:opacity-20" />

      <div className="relative max-w-5xl mx-auto px-4 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-white/10 border border-sky-200 dark:border-white/10 text-xs font-semibold">
            Interactive storytelling, locally generated
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-black tracking-tight">
            Story <span className="text-cyan-500 dark:text-cyan-400">Verse</span> AI
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-700 dark:text-slate-200 max-w-2xl mx-auto">
            A template-driven storytelling playground with branching adventure mode, built as a full-stack React, Express, and MongoDB application.
          </p>
        </motion.div>

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl glass p-6"
          >
            <div className="font-extrabold text-xl">Interactive storytelling concept</div>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
              Story Verse AI uses deterministic story engines to generate narrative structure from your inputs.
              In Adventure Mode, your choices influence the next stage, so every run becomes a unique path.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl glass p-6"
          >
            <div className="font-extrabold text-xl">Technology stack</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li>Frontend: React, Vite, TailwindCSS, Framer Motion</li>
              <li>Backend: Express, router modules, middleware, MongoDB, Mongoose</li>
              <li>Auth: JWT Bearer tokens plus bcrypt password hashing</li>
              <li>Persistence: Stories, favorites, adventures, users, and contact messages</li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-10">
          <div className="text-xl font-extrabold">Features</div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl glass p-6 cursor-default hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]"
              >
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${feature.accent} text-white shadow-lg shadow-cyan-400/20`}>
                  {feature.title}
                </div>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
