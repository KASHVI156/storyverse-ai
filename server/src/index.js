import dotenv from 'dotenv';
import http from 'node:http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { connectMongo } from './lib/mongo.js';
import { createApp } from './app.js';
import { corsOrigin } from './lib/cors.js';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || undefined });

const port = process.env.PORT || 5000;
const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

app.locals.io = io;

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: payload.sub, email: payload.email, username: payload.username };
    socket.join(`user:${payload.sub}`);
  } catch {
    // Anonymous sockets can still connect, but do not receive private user events.
  }

  return next();
});

io.on('connection', (socket) => {
  socket.emit('storyverse:connected', { ok: true });
});

(async () => {
  try {
    await connectMongo();
    app.locals.mongoOk = true;
  } catch (err) {
    app.locals.mongoOk = false;
    if (err?.isMongoUnavailable) {
      console.warn('MongoDB unavailable. DB-backed endpoints will return 503.');
    } else {
      console.error('Unexpected startup error (Mongo).');
    }
  }

  server.listen(port, () => {
    console.log(`Story Verse AI server listening on ${port}`);
  });
})();
