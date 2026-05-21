import { z } from 'zod';
import { User } from '../models/User.js';
import { hashPassword, verifyPassword } from '../services/password.service.js';
import { signAccessToken } from '../services/jwt.service.js';



export async function signup(req, res) {
  const schema = z.object({
    username: z.string().min(2).max(40),
    email: z.string().email(),
    password: z.string().min(6).max(100),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  // Hard stop if Mongo isn't connected.
  // Mongoose buffering causes 10s timeouts; prefer fast 503.
  if (req.app?.locals?.mongoOk !== true) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const { username, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({ username, email, passwordHash });

  const token = signAccessToken(user);

  return res.json({
    token,
    user: { id: user._id, username: user.username, email: user.email },
  });
}

export async function login(req, res) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  if (req.app?.locals?.mongoOk !== true) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signAccessToken(user);

  return res.json({
    token,
    user: { id: user._id, username: user.username, email: user.email },
  });
}



