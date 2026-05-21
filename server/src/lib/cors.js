export function getAllowedOrigins() {
  return (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function corsOrigin(origin, callback) {
  const allowedOrigins = getAllowedOrigins();

  if (!origin) return callback(null, true);
  if (allowedOrigins.length === 0) return callback(null, true);
  if (allowedOrigins.includes(origin)) return callback(null, true);
  if (origin.endsWith('.vercel.app') && allowedOrigins.includes('https://*.vercel.app')) return callback(null, true);

  return callback(new Error(`CORS blocked origin: ${origin}`));
}
