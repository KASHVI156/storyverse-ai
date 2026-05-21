import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { submit } from '../controllers/contact.controller.js';

export const contactRouter = Router();

contactRouter.post('/', asyncHandler(submit));

