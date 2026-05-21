import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { listAnalyticsEvents, logAnalyticsEvent } from '../services/analytics.service.js';

export const analyticsRouter = Router();

analyticsRouter.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const result = await listAnalyticsEvents({ userId: req.user.id });
  res.json(result);
}));

analyticsRouter.post('/events', requireAuth, asyncHandler(async (req, res) => {
  const eventType = typeof req.body?.eventType === 'string' ? req.body.eventType : '';
  if (!eventType) return res.status(400).json({ error: 'eventType is required' });

  const result = await logAnalyticsEvent({
    userId: req.user.id,
    eventType,
    metadata: req.body?.metadata || {},
  });

  res.status(result.stored ? 201 : 503).json(result);
}));
