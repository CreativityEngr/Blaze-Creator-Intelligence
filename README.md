# Blaze Creator OS

Blaze Creator OS is a production-oriented SaaS foundation for creators building on Blaze. It is designed as a creator command center, not a generic analytics dashboard, with focused workflows for understanding an audience, managing a community, and growing a channel.

## Vision

Blaze creators need one operating surface for live channel intelligence, community signals, growth patterns, and creator health. Blaze Creator OS aims to become that workspace: a premium, fast, and integration-ready system where Blaze API data turns into clear decisions.

## Features

- Premium dark SaaS interface inspired by Linear and Stripe Dashboard patterns.
- Responsive app shell with sidebar navigation, top command bar, search, and user profile area.
- Dashboard page with live status, stream title, category, viewers, followers, subscribers, and duration.
- Community page with recent activity, followers, and subscribers.
- Growth page with follower growth, subscriber growth, and viewer trend charts.
- Health Score page with a flagship `87/100` creator health experience and category breakdown.
- Typed mock service layer prepared for Blaze OAuth and Blaze API integrations.
- Express API with route/controller/service separation.
- Socket.IO wiring for future live event streams.
- Prisma schema for creators, snapshots, activities, and health scores.
- Shared TypeScript package for frontend/backend contracts.

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- TailwindCSS
- shadcn/ui-style component primitives
- React Router
- TanStack Query
- Recharts
- Socket.IO Client

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Socket.IO

### Deployment Targets

- Frontend: Vercel
- Backend: Railway
- Database: PostgreSQL

## Project Structure

```txt
apps/
  api/      Express API, Prisma schema, services, sockets
  web/      React app, routes, layouts, feature pages
packages/
  shared/   Shared TypeScript types and contracts
```

## Installation

```bash
npm install
```

Copy the API environment example before connecting a real database:

```bash
cp apps/api/.env.example apps/api/.env
```

On Windows PowerShell:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
```

## Development

Run the frontend:

```bash
npm run dev:web
```

Run the backend:

```bash
npm run dev:api
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- API health check: `http://localhost:4000/healthz`

## Validation

```bash
npm run typecheck
npm run build
```

Generate Prisma Client after installing dependencies:

```bash
npm run prisma:generate
```

## GitHub

Official repository target:

```txt
https://github.com/CreativityEngr/blaze-creator-os
```
