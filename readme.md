# TeamLens Server

Backend API service for TeamLens. This service provides authentication, team collaboration, task management, meeting scheduling, and team chat features using Express, TypeScript, Prisma, and PostgreSQL.

## What This Service Provides

- User authentication with access/refresh JWT tokens
- Team creation and invite-code based joining
- Team member management
- Team task lifecycle management
- Meeting scheduling and participant management
- Team chat with text and command message types
- Centralized error handling for validation and database errors

## Tech Stack

- Runtime: Node.js
- Language: TypeScript
- Framework: Express
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Auth: JWT + HttpOnly cookies
- Containerized local DB: Docker Compose

## Project Architecture

The codebase follows a layered architecture:

- `routes`: API route definitions
- `controllers`: Request parsing + HTTP response handling
- `services`: Business logic and permission checks
- `repositories`: Prisma database access
- `middlewares`: Cross-cutting request middleware (JWT verification)
- `lib`: Shared utilities (Prisma client, token helpers, crypto, password hashing)
- `prisma`: Database schema and migrations

## API Base URL

- Base: `/api/v1`
- Health check: `GET /health`

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=8000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/teamlens

CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=replace_with_long_random_secret
REFRESH_TOKEN_SECRET=replace_with_long_random_secret
SALT_ROUNDS=10

NODE_ENV=development

# Used by docker-compose.yml
POSTGRES_DB=teamlens
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
```

### Variable Notes

- `PORT`: Required. Server startup fails if missing.
- `DATABASE_URL`: Required. Used by Prisma Postgres adapter.
- `CORS_ORIGIN`: Required. Used for credentialed CORS requests.
- `ACCESS_TOKEN_SECRET`: Required. Used to sign/verify access tokens.
- `REFRESH_TOKEN_SECRET`: Required. Used to sign/verify refresh tokens.
- `SALT_ROUNDS`: Required. Integer used by bcrypt.
- `NODE_ENV`: Optional. Cookies are marked `secure` when set to `production`.

## Local Development Setup

1. Install dependencies.

```bash
npm install
```

2. Start PostgreSQL with Docker (optional but recommended).

```bash
docker compose up -d postgres
```

3. Apply Prisma migrations.

```bash
npx prisma migrate deploy
```

4. Run the server in development mode.

```bash
npm run dev
```

Server will start on `http://localhost:<PORT>`.

## Build and Run

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev`: Start development server with watch mode
- `npm run build`: Compile TypeScript and resolve path aliases
- `npm start`: Run compiled output from `dist/index.js`
- `npm run format`: Format the codebase with Prettier

## Authentication Model

- `POST /api/v1/user/login` returns:
  - JSON body with `id` and `accessToken`
  - `accessToken` cookie (15 minutes)
  - `refreshToken` cookie (7 days)
- Protected endpoints require JWT authentication via:
  - `Authorization: Bearer <accessToken>` header, or
  - `accessToken` cookie
- Token refresh endpoint:
  - `POST /api/v1/user/refresh-tokens`
  - Accepts refresh token from cookie or request body

## API Endpoints

All endpoints below are prefixed with `/api/v1`.

### User

- `POST /user/register`: Register a new user
- `POST /user/login`: Login and receive tokens
- `POST /user/refresh-tokens`: Refresh access/refresh token pair
- `POST /user/logout`: Clear auth cookies (auth required)
- `GET /user/me`: Get current user profile (auth required)

### Team

- `POST /team/create`: Create team and assign creator as ADMIN member
- `POST /team/join`: Join a team via 8-character invite code
- `GET /team/my-teams`: List teams for authenticated user
- `GET /team/:teamId/members`: List members in a team
- `POST /team/:teamId/add-member/:memberId`: Add member by user ID (team lead only)

### Task

- `POST /task/create`: Create a task for a team member
- `GET /task/team/:teamId`: List tasks in a team
- `GET /task/team/:teamId/user-tasks`: List tasks assigned to current user in team
- `PATCH /task/:taskId/status`: Update task status (`TODO`, `IN_PROGRESS`, `DONE`)
- `DELETE /task/:taskId`: Delete task

### Meeting

- `POST /meeting/create`: Create a meeting
- `PATCH /meeting/:meetingId/status`: Update meeting status
- `DELETE /meeting/:meetingId`: Delete meeting
- `POST /meeting/:meetingId/participants`: Add participant (`teamMemberId`)
- `DELETE /meeting/:meetingId/participants`: Remove participant (`teamMemberId`)
- `GET /meeting/:meetingId`: Get meeting by ID
- `GET /meeting/member/:memberId`: Get meetings by team member ID
- `GET /meeting/team/:teamId`: Get meetings by team ID
- `GET /meeting/:meetingId/participants`: List meeting participants

### Chat

- `POST /chat/send`: Send a message to a team
- `DELETE /chat/:messageId`: Delete message
- `GET /chat/team/:teamId`: List messages for a team
- `GET /chat/:messageId`: Get message by ID

Chat messages are automatically typed as:

- `COMMAND` when content starts with `/`
- `TEXT` otherwise

## Core Domain Model

- `User`
- `Team`
- `TeamMember` (with role: `ADMIN` or `MEMBER`)
- `Task` (status: `TODO`, `IN_PROGRESS`, `DONE`)
- `Meeting` (status: `SCHEDULED`, `ONGOING`, `COMPLETED`, `CANCELLED`)
- `MeetingParticipant`
- `Message` (type: `TEXT`, `COMMAND`)

## Response and Error Format

Successful responses use:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Error responses use:

```json
{
  "success": false,
  "message": "..."
}
```

Mapped database error behaviors include:

- `409`: Unique constraint conflicts (Prisma `P2002`)
- `404`: Record not found (`P2025`)
- `400`: Foreign key or validation issues (`P2003` and input validation)
- `500`: Unhandled server errors

## Production Notes

- Set `NODE_ENV=production` so auth cookies are marked `secure`.
- Use a strict, single frontend origin for `CORS_ORIGIN`.
- Run migrations during deployment (`npx prisma migrate deploy`).
- Keep JWT secrets strong and rotate periodically.

## License

ISC
