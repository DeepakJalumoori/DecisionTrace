# DecisionTrace

DecisionTrace is a TypeScript Express API for managing team decisions from meeting transcripts. It helps teams create teams, invite members, ingest transcript content, extract decisions with AI, and track decision lifecycle and audit history.

## Overview

The application is built around a collaborative decision-management workflow:

- Users register and log in with JWT-based authentication.
- Teams are created and team members are added by email.
- Transcript content is submitted for a team.
- An LLM (Groq) extracts explicit decisions from the transcript.
- Extracted decisions are stored with ownership, due dates, and confidence.
- Decisions can be resolved and their full audit trail can be reviewed.

## Tech Stack

- Node.js + TypeScript
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- Groq SDK for decision extraction
- Zod for validation
- bcrypt for password hashing

## Project Structure

```text
src/
  app.ts
  server.ts
  config/
    db.ts
  controllers/
    auth.controller.ts
    decision.controller.ts
    team.controller.ts
    transcript.controller.ts
  middleware/
    auth.middleware.ts
    authorizeTeam.ts
    error.middleware.ts
    logger.middleware.ts
  models/
    Decision.ts
    DecisionAudit.ts
    Team.ts
    TeamMember.ts
    Transcript.ts
    User.ts
  routes/
    auth.routes.ts
    decision.routes.ts
    team.routes.ts
    transcript.routes.ts
  services/
    extraction.service.ts
    llm/
      groq.ts
  validators/
    auth.validator.ts
    extraction.validator.ts
    transcript.validator.ts
  types/
    express.d.ts
```

## Features

### Authentication

- Register new user
- Login and receive a JWT
- Protected routes using auth middleware

### Team management

- Create a team
- List teams for the logged-in user
- Add team members by email
- View decisions associated with a team

### Transcript processing

- Submit meeting transcript text for a team
- Compute a SHA-256 source hash for transcript integrity
- Extract decisions from transcript using Groq
- Save decisions and associated metadata

### Decision lifecycle

- Resolve a decision as closed
- Track status changes in the decision audit log
- Retrieve the decision history and audit trail

## API Endpoints

### Auth

- POST /api/auth/register
  - Register a new user
- POST /api/auth/login
  - Log in and receive a JWT

### Teams

- POST /api/teams
  - Create a team
- GET /api/teams
  - List teams for the authenticated user
- POST /api/teams/:teamId/members
  - Add a member to a team
- GET /api/teams/:teamId/decisions
  - Get all decisions for a team

### Transcripts

- POST /api/teams/:teamId/transcripts
  - Submit a transcript for decision extraction

### Decisions

- PATCH /api/decisions/:decisionId/resolve
  - Mark a decision as resolved/closed
- GET /api/decisions/:decisionId/history
  - Fetch the decision audit history

### Health

- GET /health
  - Service health check

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/decisiontrace
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This starts the server with `tsx watch` and reloads automatically on file changes.

## Production Build

```bash
npm run build
```

## Start the Server

```bash
npm start
```

The app listens on the configured port, defaulting to `5000`.

## Notes

- MongoDB must be running and reachable via `MONGODB_URI`.
- The Groq API key is required for transcript-based decision extraction.
- JWT secret must be set before production usage.
- Validation is handled with Zod schemas for auth, transcripts, and extraction output.
