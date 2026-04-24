# Notes

A small full-stack notes app. Add, view, and delete notes.

Built for the Rhino Entertainment senior full-stack assessment.

## Stack

- **API** — NestJS + TypeScript, TypeORM on Postgres
- **Cache** — Redis, caching the list endpoint with a short TTL
- **Web** — React + Vite + TypeScript, SCSS modules, TanStack Query for data
- **Infra** — Docker Compose: four services (`postgres`, `redis`, `api`, `web`) on one network

## Quick start

You only need Docker.

```sh
docker compose up --build
```

- Web: http://localhost:5173
- API: http://localhost:3000/api

## Running without Docker

```sh
docker compose up postgres redis -d

cd backend && cp .env.example .env && npm install && npm run start:dev
cd frontend && npm install && npm run dev
```

## API

| Method | Path             | Description                       |
| ------ | ---------------- | --------------------------------- |
| GET    | `/api/notes`     | List notes, newest first (cached) |
| POST   | `/api/notes`     | Create a note                     |
| DELETE | `/api/notes/:id` | Delete a note                     |

Create payload:

```json
{ "title": "string, 1–120 chars", "content": "string, 1–5000 chars" }
```

## Design notes

- Postgres stores the data, Redis caches the list endpoint with a 60s TTL.
- `synchronize: true` is on for the take-home; in a real project I'd use migrations.
- Vite dev server runs in Docker for simplicity; production would build static assets behind nginx.

## With more time

- Migrations
- Pagination
- Note edit (PATCH)

## Layout

```
backend/           NestJS API
frontend/          Vite + React web app
docker-compose.yml
abs.md             Math.abs alternatives
```
