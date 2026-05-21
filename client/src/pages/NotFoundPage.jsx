import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl font-black">404</div>
      <div className="mt-3 text-xl font-bold">Page not found</div>
      <div className="mt-6">
        <Link to="/" className="text-cyan-400 hover:text-cyan-300 font-semibold">Go back home</Link>
      </div>
    </div>
  );
}

