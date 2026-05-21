import React from 'react';
import { motion } from 'framer-motion';

export function StoryCard({ title, meta, text, isLoading = false }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-6 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur p-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold tracking-tight">{title}</h3>
          {meta ? (
            <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">
              {meta}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <p className="whitespace-pre-wrap leading-7 text-slate-800 dark:text-slate-100">
          {isLoading ? 'Generating...' : text}
        </p>
      </div>
    </motion.section>
  );
}

