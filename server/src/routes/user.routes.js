import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { uploadImage } from '../middleware/upload.middleware.js';
import { profile, updatePreferences, uploadAvatar } from '../controllers/user.controller.js';

export const userRouter = Router();

userRouter.get('/profile', requireAuth, asyncHandler(profile));
userRouter.put('/preferences', requireAuth, asyncHandler(updatePreferences));
userRouter.post('/avatar', requireAuth, uploadImage.single('avatar'), asyncHandler(uploadAvatar));

