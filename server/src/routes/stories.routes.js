import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { listStories, generate, remove } from '../controllers/stories.controller.js';
import { start as startAdventure, step as adventureStep } from '../controllers/adventure.controller.js';

export const storiesRouter = Router();

storiesRouter.get('/', requireAuth, asyncHandler(listStories));
storiesRouter.post('/generate', requireAuth, asyncHandler(generate));
storiesRouter.post('/adventure/start', requireAuth, asyncHandler(startAdventure));
storiesRouter.post('/adventure/step', requireAuth, asyncHandler(adventureStep));
storiesRouter.delete('/:id', requireAuth, asyncHandler(remove));

