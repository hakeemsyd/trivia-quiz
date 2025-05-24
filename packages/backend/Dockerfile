# packages/backend/Dockerfile

### 1) Builder: install deps & build ###
FROM node:18-alpine AS builder
WORKDIR /app

# 1.1) Install pnpm & TypeScript globally
RUN npm install -g pnpm typescript

# 1.2) Copy root manifests so pnpm recognizes the workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

# 1.3) Copy backend package manifest & its tsconfig
COPY packages/backend/package.json packages/backend/
COPY packages/backend/tsconfig.json packages/backend/

# 1.4) Install all workspace deps (prod + root dev)
RUN pnpm install

# 1.5) Copy the entire backend folder (including src/) so we can build it
COPY packages/backend/ packages/backend/

# 1.6) Drill into backend and install its devDependencies
WORKDIR /app/packages/backend
RUN pnpm install --prod=false

# 1.7) Now compile with full source and types available
RUN pnpm exec tsc --build tsconfig.json


### 2) Runner: production image ###
FROM node:18-alpine AS runner
WORKDIR /app

# 2.1) Install curl & fetch wait-for-it
RUN apk add --no-cache curl \
  && curl -fsSL https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
     -o /usr/local/bin/wait-for-it.sh \
  && chmod +x /usr/local/bin/wait-for-it.sh

# 2.2) Copy build output & runtime deps
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/node_modules ./node_modules
COPY packages/backend/package.json ./

ENV NODE_ENV=production
EXPOSE 4000

# 2.3) Wait for Mongo then start
CMD ["sh","-c","wait-for-it.sh mongo:27017 -- echo '✅ Mongo up' && node dist/index.js"]
