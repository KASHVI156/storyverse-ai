import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { signup, login } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/signup', asyncHandler(signup));
authRouter.post('/login', asyncHandler(login));

