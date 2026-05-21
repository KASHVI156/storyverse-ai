import { Router } from 'express';

export const sessionRouter = Router();

sessionRouter.get('/preferences', (req, res) => {
  res.json({
    theme: req.session?.theme || 'light',
    visits: req.session?.visits || 0,
  });
});

sessionRouter.put('/preferences', (req, res) => {
  const theme = req.body?.theme === 'dark' ? 'dark' : 'light';
  req.session.theme = theme;
  req.session.visits = (req.session.visits || 0) + 1;

  res.cookie('storyverse_theme', theme, {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  res.json({ ok: true, theme, visits: req.session.visits });
});
