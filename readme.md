# Trivia Monorepo

This monorepo contains a full-stack Trivia application with three primary packages:

- **shared**: Shared TypeScript types and utilities.
- **backend**: Express + Apollo GraphQL server with MongoDB.
- **frontend**: React + Vite + TypeScript SPA.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Monorepo Structure](#monorepo-structure)
3. [Local Setup](#local-setup)
4. [Available Scripts](#available-scripts)
5. [Docker Setup](#docker-setup)
6. [Environment Variables](#environment-variables)
7. [Package Details](#package-details)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js v18 or higher
- pnpm
- Docker & Docker Compose (optional, for containerized setup)

---

## Monorepo Structure

```
trivia-monorepo/
├─ packages/
│  ├─ shared/        # Shared types & utilities
│  ├─ backend/       # Express + Apollo GraphQL server
│  └─ frontend/      # React + Vite SPA
├─ package.json      # Root pnpm config & scripts
├─ pnpm-workspace.yaml
├─ tsconfig.json     # Root TS config with paths
├─ .eslintrc.js
└─ docker-compose.yml
```

---

## Local Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Build shared types**

   ```bash
   pnpm --filter @trivia/shared run build
   ```

3. **Run development servers**

   ```bash
   # Backend (GraphQL + Express)
   pnpm --filter @trivia/backend run dev

   # Frontend (React + Vite)
   pnpm --filter @trivia/frontend run dev
   ```

4. **Visit**

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - GraphQL Playground: [http://localhost:4000/graphql](http://localhost:4000/graphql)

---

## Available Scripts

From the **repo root**, you can run:

| Command      | Description                                |
| ------------ | ------------------------------------------ |
| `pnpm dev`   | Start both backend & frontend in parallel. |
| `pnpm build` | Build all packages (shared, backend).      |
| `pnpm lint`  | Run ESLint across all packages.            |
| `pnpm test`  | (No tests configured)                      |

---

## Docker Setup

Bring up the full stack (MongoDB, backend, frontend) in Docker:

```bash
docker-compose up --build
```

- **Backend**: [http://localhost:4000/health](http://localhost:4000/health)
- **Frontend**: [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env` file at the project root (and add it to `.gitignore`):

```bash
MONGO_URL=mongodb://mongo:27017/trivia
PORT=4000
```

---

## Package Details

### shared

- Location: `packages/shared`
- Responsibilities: Defines the `Question` type used by both frontend and backend.

### backend

- Location: `packages/backend`
- Stack: Express, Apollo Server, Mongoose (MongoDB), TypeScript
- Main entry: `src/index.ts`
- GraphQL endpoint: `/graphql`

### frontend

- Location: `packages/frontend`
- Stack: React, Vite, TypeScript, React Router
- Main entry: `src/main.tsx`

---

## Troubleshooting

- **TypeScript path errors**: Ensure `shared` is built before running backend.
- **`rootDir` errors**: Backend TS config should only include its own `src`, and root `paths` should map `@trivia/shared` to `shared/dist`.
- **Vite `constants` bug**: Use `@vitejs/plugin-react-swc` and ensure single Vite version via `pnpm dedupe vite`.

---

Feel free to open issues or reach out if you hit any snags. Happy coding!\`\`\`
