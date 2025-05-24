# 1) Install deps & build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy root manifests and workspace file
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy only the frontend package manifest
COPY packages/frontend/package.json ./packages/frontend/

# Install pnpm and frontend dependencies
RUN npm install -g pnpm \
 && pnpm install --frozen-lockfile --filter @trivia/frontend

# Copy all sources
COPY . .

# Build the frontend
WORKDIR /app/packages/frontend
RUN pnpm build

# 2) Production image
FROM nginx:stable-alpine AS runner

# Copy the built static files from the builder
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
