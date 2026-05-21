import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-white/60 dark:border-white/10 bg-white/30 dark:bg-slate-950/20">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="font-extrabold">Story Verse AI</div>
          <div className="text-xs mt-1 text-slate-600 dark:text-slate-300">Magical, local, template-based story generation.</div>
        </div>
        <div className="flex gap-5 text-sm">
          <Link className="text-cyan-400 hover:text-cyan-300" to="/about">About</Link>
          <Link className="text-cyan-400 hover:text-cyan-300" to="/contact">Contact</Link>
          <a className="text-cyan-400 hover:text-cyan-300" href="#top">Back to top</a>
        </div>
      </div>
    </footer>
  );
}

