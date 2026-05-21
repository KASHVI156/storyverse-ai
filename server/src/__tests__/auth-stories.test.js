import request from 'supertest';
import { describe, expect, test } from '@jest/globals';
import { createApp } from '../app.js';

describe('auth and story API behavior', () => {
  test('login route reports unavailable database when Mongo is down', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@storyverse.ai', password: 'demo1234' });

    expect(res.status).toBe(503);
    expect(res.body.error).toBe('Database unavailable');
  });

  test('story routes are protected by JWT middleware', async () => {
    const app = createApp();
    app.locals.mongoOk = true;

    const res = await request(app)
      .post('/api/stories/generate')
      .send({ mood: 'Happy', location: 'Forest' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Missing token');
  });
});
