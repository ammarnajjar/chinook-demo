## Stage 1 - build
FROM node:24-alpine AS builder
WORKDIR /usr/src/app

# Install build deps
COPY package*.json ./
COPY tsconfig.json tsconfig.build.json ./
COPY src/ ./src/
RUN npm install --legacy-peer-deps --no-audit --no-fund && \
    npm run build

## Stage 2 - runtime
FROM node:24-alpine
WORKDIR /usr/src/app

# Copy built files and production deps from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
# Install only production deps in the runtime image to avoid peer resolution issues during prune
RUN npm install --legacy-peer-deps --omit=dev --no-audit --no-fund

ENV NODE_ENV=production
ENV PORT=4400

EXPOSE 4400
CMD ["node", "dist/main.js"]
