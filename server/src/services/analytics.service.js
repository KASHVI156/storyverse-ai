import { getPrisma } from '../lib/prisma.js';

export async function logAnalyticsEvent({ userId = null, eventType, metadata = {} }) {
  const prisma = getPrisma();
  if (!prisma) return { stored: false, reason: 'DATABASE_URL not configured' };

  try {
    const event = await prisma.analyticsEvent.create({
      data: { userId, eventType, metadata },
    });

    return { stored: true, event };
  } catch (err) {
    console.warn('Analytics event was not stored:', err?.message || err);
    return { stored: false, reason: 'Prisma analytics unavailable' };
  }
}

export async function listAnalyticsEvents({ userId, limit = 25 }) {
  const prisma = getPrisma();
  if (!prisma) return { enabled: false, events: [] };

  try {
    const events = await prisma.analyticsEvent.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return { enabled: true, events };
  } catch (err) {
    console.warn('Analytics events were not loaded:', err?.message || err);
    return { enabled: false, events: [], error: 'Prisma analytics unavailable' };
  }
}
