import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { authRouter } from './routes/auth.routes.js';
import { storiesRouter } from './routes/stories.routes.js';
import { userRouter } from './routes/user.routes.js';
import { favoritesRouter } from './routes/favorites.routes.js';
import { contactRouter } from './routes/contact.routes.js';
import { sessionRouter } from './routes/session.routes.js';
import { analyticsRouter } from './routes/analytics.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp({ io = null } = {}) {
  const app = express();

  app.locals.io = io;
  app.locals.mongoOk = false;

  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, 'views'));

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  app.use(cookieParser());
  app.use(
    session({
      name: 'storyverse.sid',
      secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'storyverse-dev-session',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(process.env.NODE_ENV === 'test' ? 'tiny' : 'dev'));
  app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

  app.get('/health', (req, res) => {
    res.json({ ok: true, mongoOk: !!app.locals.mongoOk });
  });

  app.get('/server-status', (req, res) => {
    res.render('server-status', {
      title: 'Story Verse AI Server',
      mongoOk: !!app.locals.mongoOk,
      nodeEnv: process.env.NODE_ENV || 'development',
      time: new Date().toISOString(),
    });
  });

  app.use((req, res, next) => {
    if (app.locals.mongoOk) return next();

    const requestPath = req.path || '';
    if (requestPath === '/health' || requestPath === '/server-status') return next();
    if (requestPath.startsWith('/api/session')) return next();
    if (requestPath.startsWith('/api/analytics')) return next();
    if (requestPath.startsWith('/api/')) return res.status(503).json({ error: 'Database unavailable' });

    return next();
  });

  app.use('/api/auth', authRouter);
  app.use('/api/stories', storiesRouter);
  app.use('/api/user', userRouter);
  app.use('/api/favorites', favoritesRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/session', sessionRouter);
  app.use('/api/analytics', analyticsRouter);

  app.use((err, req, res, next) => {
    // eslint-disable-line no-unused-vars
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({
      error: err.message || 'Internal Server Error',
    });
  });

  return app;
}
