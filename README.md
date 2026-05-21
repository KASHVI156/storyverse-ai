# Story Verse AI

Full-stack (React + Tailwind + Framer Motion / Node + Express / MongoDB) implementation.

> Generated from scratch.

## Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

## Setup
1. Install dependencies
   - From repo root:
     - `npm install`
2. Configure env
   - Copy env examples:
     - `server/.env.example` -> `server/.env`
     - `client/.env.example` -> `client/.env`
3. Start backend (with seed)
   - `npm run seed -w server`
4. Start dev servers
   - `npm run dev`

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Repo Scripts
- Root:
  - `npm run dev` - runs server and client concurrently
  - `npm run build` - builds both
- Backend:
  - `npm run seed` - seeds story templates/datasets

