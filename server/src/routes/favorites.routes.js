import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { addFavorite, listFavorites } from '../controllers/favorites.controller.js';

export const favoritesRouter = Router();

favoritesRouter.post('/', requireAuth, asyncHandler(addFavorite));
favoritesRouter.get('/', requireAuth, asyncHandler(listFavorites));

