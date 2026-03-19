# Event Listing Platform

A full-stack event platform where organizers publish events and attendees discover, explore, and register for them.

## Live Demo

|                | URL                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------- |
| **App**        | [https://home-assessment-web-thah.vercel.app/](https://home-assessment-web-thah.vercel.app/) |
| **Repository** | [GitHub](https://github.com/johannDeLaCruz/home-assessment)                                  |

## Features

- **Organizers:** Create, edit, and delete events; view registrations
- **Attendees:** Browse events, filter by date, register and unregister
- **Authentication:** Sign up / log in with email and password; JWT-based sessions
- **Roles:** Organizer and Attendee roles with appropriate permissions

## Tech Stack

| Layer      | Technologies                                                |
| ---------- | ----------------------------------------------------------- |
| Frontend   | React 18, TypeScript, Vite, Chakra UI, React Query, Zustand |
| Backend    | Node.js 20, Serverless Framework, AWS Lambda, API Gateway   |
| Database   | DynamoDB                                                    |
| Deployment | Vercel (frontend), AWS (API)                                |

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   React     │────▶│   API Gateway    │────▶│   Lambda    │
│   (Vite)    │     │   (REST)         │     │   (Node 20) │
└─────────────┘     └──────────────────┘     └──────┬──────┘
                                                     │
                                                     ▼
                                              ┌─────────────┐
                                              │  DynamoDB   │
                                              └─────────────┘
```

**Monorepo:**

- `packages/shared` — Types and validation
- `packages/api` — Serverless backend
- `packages/web` — React frontend

## Quick Start

```bash
git clone https://github.com/johannDeLaCruz/home-assessment.git
cd Home-Assessment
pnpm install
pnpm run build
```

**Local development:**

```bash
# Set VITE_API_URL in packages/web/.env (see .env.example)
pnpm run dev
```

**Deploy API:**

```bash
pnpm run deploy
```

## API Overview

| Method | Path                   | Description              |
| ------ | ---------------------- | ------------------------ |
| POST   | /auth/signup           | Sign up                  |
| POST   | /auth/signin           | Sign in                  |
| GET    | /events                | List events              |
| POST   | /events                | Create event (auth)      |
| GET    | /events/:id            | Event details            |
| PUT    | /events/:id            | Update event (organizer) |
| DELETE | /events/:id            | Delete event (organizer) |
| POST   | /events/:id/register   | Register for event       |
| DELETE | /events/:id/unregister | Cancel registration      |

## Commands

```bash
pnpm install      # Install dependencies
pnpm run build     # Build all packages
pnpm run dev       # Run locally
pnpm run test      # Run tests
pnpm run deploy    # Deploy API to AWS
```
