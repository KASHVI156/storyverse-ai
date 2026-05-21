# StoryVerse AI

AI-powered interactive storytelling platform built with React, Vite, Node.js, Express, MongoDB, JWT authentication, file uploads, real-time notifications, and deployment-ready configuration for Vercel + Render.

## Prerequisites

- Node.js 20+
- MongoDB Atlas or local MongoDB
- Optional: PostgreSQL for Prisma analytics
- Optional: Cloudinary for hosted profile images

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment files:
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env`

3. Start development servers:
   ```bash
   npm run dev
   ```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## Scripts

- `npm run dev` - run backend and frontend together
- `npm run build` - build frontend and validate backend
- `npm run start` - start the backend server
- `npm test` - run backend Jest/Supertest tests
- `npm run seed -w server` - seed demo data

## Deployment

- Backend: Render using `render.yaml`
- Frontend: Vercel using `client/vercel.json`
- MongoDB: MongoDB Atlas via `MONGODB_URI`

Set production environment variables in the hosting dashboards. Do not commit `.env` files.
