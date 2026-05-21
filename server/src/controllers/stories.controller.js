import { z } from 'zod';
import { Story } from '../models/Story.js';
import { generateStory } from '../services/storyEngine/storyComposer.js';
import { logAnalyticsEvent } from '../services/analytics.service.js';

export async function listStories(req, res) {
  const userId = req.user.id;

  const mood = req.query.mood || '';
  const location = req.query.location || '';
  const q = req.query.q || '';

  const filter = { userId };
  if (mood) filter.mood = mood;
  if (location) filter.location = location;

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { text: { $regex: q, $options: 'i' } },
    ];
  }

  const stories = await Story.find(filter)
    .sort({ createdAt: -1 })
    .limit(100);

  return res.json(stories);
}

export async function generate(req, res) {
  console.log('[stories.controller][generate] reached', {
    userId: req.user?.id,
    mood: req.body?.mood,
    location: req.body?.location,
  });

  const schema = z.object({
    mood: z.string(),
    location: z.string(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    console.log('[stories.controller][generate] bad body', parsed.error.flatten());
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const { mood, location } = parsed.data;
    req.app.locals.io?.to(`user:${req.user.id}`).emit('story:generation-progress', {
      stage: 'started',
      mood,
      location,
    });

    const seedKey = `${req.user.id}|${Date.now()}`;
    const { title, text } = generateStory({ mood, location, seedKey });

    console.log('[stories.controller][generate] creating Story', {
      userId: req.user.id,
      title,
    });

    const story = await Story.create({
      userId: req.user.id,
      title,
      mood,
      location,
      text,
      isAdventure: false,
    });

    console.log('[stories.controller][generate] Story created', { id: story?._id });
    req.app.locals.io?.to(`user:${req.user.id}`).emit('story:generation-progress', {
      stage: 'saved',
      storyId: story._id,
      title: story.title,
    });

    await logAnalyticsEvent({
      userId: req.user.id,
      eventType: 'story_generated',
      metadata: { storyId: story._id.toString(), mood, location },
    });

    return res.json(story);
  } catch (err) {
    console.error('[stories.controller][generate] error', err);
    throw err;
  }
}


export async function remove(req, res) {
  const userId = req.user.id;
  const id = req.params.id;

  const story = await Story.findOne({ _id: id, userId });
  if (!story) return res.status(404).json({ error: 'Story not found' });

  await Story.deleteOne({ _id: id });
  return res.json({ ok: true });
}

