import { z } from 'zod';
import { Favorite } from '../models/Favorite.js';
import { Story } from '../models/Story.js';
import { User } from '../models/User.js';

export async function addFavorite(req, res) {
  const schema = z.object({ storyId: z.string(), mood: z.string().optional(), location: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { storyId, mood, location } = parsed.data;

  const story = await Story.findOne({ _id: storyId, userId: req.user.id });
  if (!story) return res.status(404).json({ error: 'Story not found' });

  const existing = await Favorite.findOne({ userId: req.user.id, storyId });
  if (existing) return res.status(200).json({ ok: true });

  await Favorite.create({ userId: req.user.id, storyId, mood: mood || story.mood, location: location || story.location });

  // Also set favorite mood/location on user for dashboard
  const user = await User.findById(req.user.id);
  if (user) {
    user.favoriteMood = mood || story.mood;
    user.favoriteLocation = location || story.location;
    await user.save();
  }

  return res.json({ ok: true });
}

export async function listFavorites(req, res) {
  const favorites = await Favorite.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
  const ids = favorites.map((f) => f.storyId);

  const stories = await Story.find({ _id: { $in: ids } }).sort({ createdAt: -1 });
  return res.json(stories);
}

