import { Story } from '../models/Story.js';

export async function getStoryMetrics(_UserModel, userId) {
  const totalStories = await Story.countDocuments({ userId });
  return { totalStories };
}

