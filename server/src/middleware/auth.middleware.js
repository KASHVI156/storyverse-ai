import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    if (!process.env.JWT_SECRET) return res.status(500).json({ error: 'JWT_SECRET is not configured' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
    };
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}



