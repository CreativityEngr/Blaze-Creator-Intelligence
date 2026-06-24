# Blaze Creator Intelligence

Blaze Creator Intelligence is an analytics and decision-support platform I built for creators on Blaze.

Streaming platforms provide the tools to go live. Understanding what happened, why it matters, and what to do next is a different challenge. Creator signals are often scattered across live statistics, audience activity, growth history, and community events.

I built Blaze Creator Intelligence to bring those signals together and turn them into useful direction.

Creators can monitor live performance, understand audience behavior, track growth, review channel health, compare emerging ecosystem benchmarks, and receive actionable recommendations from one focused workspace.

My goal is simple:

Help creators spend less time interpreting dashboards and more time making confident growth decisions.

## Product Vision

I want Blaze Creator Intelligence to become the intelligence layer creators open before, during, and after every stream.

## Core Experiences

- Live creator analytics
- Audience intelligence
- Growth intelligence
- Creator Health Score
- Creator Intelligence brief
- Ecosystem benchmark research
- Signal-focused notifications
- Historical trend detection

## How It Helps

### Understand

See what is happening across a channel in real time. Follow viewers, followers, subscribers, stream status, and community activity without moving between disconnected tools.

### Decide

Turn stored history and live signals into clear explanations: what changed, why it matters, and what action deserves attention next.

### Grow

Track performance over time, understand audience efficiency and conversion, identify momentum, and compare developing channel signals with the broader Blaze ecosystem.

## Technology

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
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

### Platform

- Blaze OAuth
- Blaze APIs and EventSub
- Neon PostgreSQL
- Vercel-ready frontend
- Railway-ready API

## Local Installation

```bash
npm install
```

Create environment files from the supplied examples:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env
```

Configure Blaze credentials and `DATABASE_URL`, then prepare the database:

```bash
npm run prisma:generate --workspace @blaze/api
npm run prisma:migrate --workspace @blaze/api
npm run prisma:seed --workspace @blaze/api
```

Start the application:

```bash
npm run dev
```

The web app runs at `http://localhost:5173` and the API at `http://localhost:4000`.
