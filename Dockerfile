# Progressive Framework V5 - Production Dockerfile

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY . .
RUN mkdir -p data/emergency logs/emergency config/emergency
RUN chown -R node:node /app

# Production stage
FROM node:18-alpine AS production
RUN apk add --no-cache curl tini && rm -rf /var/cache/apk/*
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=builder --chown=nodejs:nodejs /app .
RUN mkdir -p data/emergency logs/emergency config/emergency && chown -R nodejs:nodejs data logs config
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/emergency/health || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]

# Labels
LABEL org.opencontainers.image.title="Progressive Framework V5"
LABEL org.opencontainers.image.description="Multi-Agent Intelligence System with Emergency Response"
LABEL org.opencontainers.image.version="5.0.0"

ENV NODE_ENV=production
ENV PORT=3000
