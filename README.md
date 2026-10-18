# To-Do App

A full-stack To-Do application.

- **Frontend:** React 18 + Vite (`client/`)
- **Backend:** Node.js + Express (`server/`)
- **Database:** SQLite through Node's built-in `node:sqlite` module, stored in `server/data/todos.db`

## Requirements

Node.js **22.5 or newer** (needed for the built-in `node:sqlite` module).

## Getting started

```bash
npm run install:all   # install root, server and client dependencies
npm run dev           # start API (port 3001) and React dev server (port 5173)
```

Open http://localhost:5173. During development, Vite forwards `/api` requests to the Express server.

## Production

```bash
npm run build   # build the React app into client/dist
npm start       # Express serves the API and the built app at http://localhost:3001
```

## API

| Method | Endpoint                | Body                     | Description              |
|--------|-------------------------|--------------------------|--------------------------|
| GET    | `/api/todos`            |                          | List all todos           |
| POST   | `/api/todos`            | `{ text }`               | Create a todo            |
| PATCH  | `/api/todos/:id`        | `{ text?, completed? }`  | Update a todo            |
| DELETE | `/api/todos/:id`        |                          | Delete a todo            |
| DELETE | `/api/todos/completed`  |                          | Delete all completed     |
| GET    | `/api/health`           |                          | Health check             |

## Configuration

| Variable  | Default                  | Description           |
|-----------|--------------------------|-----------------------|
| `PORT`    | `3001`                   | API server port       |
| `DB_PATH` | `server/data/todos.db`   | SQLite database file  |
