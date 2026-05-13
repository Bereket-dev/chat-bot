# chat-bot

React + Vite UI and an Express server that use the **Google Gemini API** to run a small “guess your age” chat game.

## What it does (current behavior)

- The UI starts with a few “starter” prompts and a chat input.
- The bot’s mission is to guess the user’s **age range**.
- It can ask **up to 4 short questions** (one question per message). After that (or if it decides it’s confident), it returns an age-range guess with a short justification.
- Typing a message containing `guess` (for example `guess again`) resets the guessing session.
- Messages are rendered as Markdown, and the UI includes a light/dark theme toggle.

## Repo structure

- `client/` — React 19 + Vite + TailwindCSS UI
- `server/` — Express API that calls Gemini (`@google/genai`)

## Prerequisites

- Node.js (recommended: current LTS)
- A Gemini API key

## Environment variables

`server/.env` (see `server/.env.example`):

- `PORT` — server port (default: `5000`)
- `GEMINI_API_KEY` — **required**
- `CLIENT_URL` — allowed CORS origin (default: `http://localhost:5173`)

`client/.env` (see `client/.env.example`):

- `VITE_SERVER_URL` — server base URL (default: `http://localhost:5000`)

Both `client/.gitignore` and `server/.gitignore` ignore `.env` files; use the `*.env.example` files as templates.

## Install

```bash
cd server
npm install

cd ../client
npm install
```

## Run (development)

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

Then open the Vite URL (usually `http://localhost:5173`).

## API

### `POST /generate-response`

Body:

```json
{ "messages": ["..."] }
```

Response (success):

```json
{ "success": true, "message": "..." }
```

Response (error):

```json
{ "success": false, "error": "..." }
```

Notes:

- The server currently passes `messages` straight through to Gemini as `contents`.
- The server uses the model `gemini-2.5-flash`.

## Implementation notes / current state

- The “ask up to 4 questions then guess” logic is enforced in the client (`client/src/pages/AIChatBot.tsx`).
- The server includes a `server/database.sql` schema, but it is **not wired into the app** yet (no DB connection code).
- `server/utils/getRandomPrompt.ts` exists but is **not used** by the current server flow.

## Scripts

Client (`client/package.json`):

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck + build
- `npm run lint` — ESLint
- `npm run preview` — preview production build

Server (`server/package.json`):

- `npm run dev` — start server with nodemon
