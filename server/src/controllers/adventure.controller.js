import { z } from 'zod';
import { AdventureStory } from '../models/AdventureStory.js';
import { Story } from '../models/Story.js';
import { startAdventure, advanceAdventure } from '../services/storyEngine/adventureEngine.js';

export async function start(req, res) {
  const schema = z.object({ mood: z.string(), location: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { mood, location } = parsed.data;

  // Create an autosave record
  const record = await AdventureStory.create({
    userId: req.user.id,
    mood,
    location,
    stages: [],
    completed: false,
    finalStoryId: null,
  });

  const engine = startAdventure({ mood, location, seedKey: record._id.toString() });

  return res.json({
    adventureId: record._id,
    ...engine,
  });
}

export async function step(req, res) {
  const schema = z.object({
    adventureId: z.string(),
    mood: z.string(),
    location: z.string(),
    stageIndex: z.number(),
    choiceIndex: z.number(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { adventureId, mood, location, stageIndex, choiceIndex } = parsed.data;

  const record = await AdventureStory.findOne({ _id: adventureId, userId: req.user.id });
  if (!record) return res.status(404).json({ error: 'Adventure not found' });

  const result = advanceAdventure({ mood, location, seedKey: record._id.toString(), stageIndex, choiceIndex });

  if (result.done) {
    const final = result.finalStory;

    const story = await Story.create({
      userId: req.user.id,
      title: final.title,
      mood: final.mood,
      location: final.location,
      text: final.text,
      isAdventure: true,
    });

    record.completed = true;
    record.finalStoryId = story._id;
    record.stages.push({ stageIndex, choiceIndex, excerpt: '' });
    await record.save();

    return res.json({ done: true, story: story, finalStory: final, finalStoryId: story._id });
  }


  record.stages.push({ stageIndex, choiceIndex, excerpt: result.excerpt });
  record.mood = mood;
  record.location = location;
  await record.save();

  return res.json({
    done: false,
    adventureId: record._id,
    stageIndex: result.stageIndex,
    excerpt: result.excerpt,
    choices: result.choices,
  });
}

