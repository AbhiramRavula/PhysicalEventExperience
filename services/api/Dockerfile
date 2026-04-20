# Use Node.js 20 as base
FROM node:20-slim AS builder

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root workspace files if needed, but for simplicity we rely on the service
COPY package.json package-lock.json ./
COPY services/api/package.json ./services/api/

# Install dependencies (including root for turbo/workspace links)
RUN npm install

# Copy source code
COPY services/api ./services/api

# Generate Prisma client
WORKDIR /app/services/api
RUN npx prisma generate

# Build the application
RUN npm run build

# --- Production Stage ---
FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/services/api/dist ./dist
COPY --from=builder /app/services/api/node_modules ./node_modules
COPY --from=builder /app/services/api/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "dist/server.js"]
