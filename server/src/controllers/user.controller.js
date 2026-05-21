import { z } from 'zod';
import { User } from '../models/User.js';
import { Story } from '../models/Story.js';
import { saveProfileImage } from '../services/media.service.js';

export async function profile(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const totalStories = await Story.countDocuments({ userId: req.user.id });
  const recentStories = await Story.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(5);

  return res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    preferences: user.preferences,
    favoriteMood: user.favoriteMood,
    favoriteLocation: user.favoriteLocation,
    avatarUrl: user.avatarUrl,
    avatarStorage: user.avatarStorage,
    totalStories,
    recentStories,
  });
}

export async function updatePreferences(req, res) {
  const schema = z.object({
    preferences: z
      .object({
        theme: z.object({ darkMode: z.boolean() }).optional(),
        lastMood: z.string().optional(),
        lastLocation: z.string().optional(),
      })
      .optional(),
    favoriteMood: z.string().optional(),
    favoriteLocation: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (parsed.data.preferences) {
    if (parsed.data.preferences.theme) user.preferences.theme = parsed.data.preferences.theme;
    if (typeof parsed.data.preferences.lastMood === 'string') user.preferences.lastMood = parsed.data.preferences.lastMood;
    if (typeof parsed.data.preferences.lastLocation === 'string') user.preferences.lastLocation = parsed.data.preferences.lastLocation;
  }

  if (typeof parsed.data.favoriteMood === 'string') user.favoriteMood = parsed.data.favoriteMood;
  if (typeof parsed.data.favoriteLocation === 'string') user.favoriteLocation = parsed.data.favoriteLocation;

  await user.save();

  return res.json({
    ok: true,
    preferences: user.preferences,
    favoriteMood: user.favoriteMood,
    favoriteLocation: user.favoriteLocation,
  });
}

export async function uploadAvatar(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const media = await saveProfileImage(req.file);

  user.avatarUrl = media.url;
  user.avatarPublicId = media.publicId;
  user.avatarStorage = media.storage;
  await user.save();

  req.app.locals.io?.to(`user:${req.user.id}`).emit('profile:avatar-updated', {
    avatarUrl: user.avatarUrl,
    avatarStorage: user.avatarStorage,
  });

  return res.json({
    ok: true,
    avatarUrl: user.avatarUrl,
    avatarStorage: user.avatarStorage,
  });
}

