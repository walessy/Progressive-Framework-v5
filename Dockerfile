# Dockerfile for Progressive Framework V5
# Location: C:\Projects\Progressive-Framework-v5\Dockerfile

# Use official Node.js runtime as base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# ========================================
# DEVELOPMENT STAGE
# ========================================
FROM base AS development

# Install development dependencies
RUN npm ci

# Copy source code
COPY . .

# Create data directories
RUN mkdir -p data/conversations data/budgets data/emergency data/backups

# Expose port
EXPOSE 3000

# Set development environment
ENV NODE_ENV=development

# Start development server with hot reload
CMD ["npm", "run", "dev"]

# ========================================
# BUILD STAGE
# ========================================
FROM base AS build

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Run build process (if you have one)
RUN npm run build --if-present

# Run tests
RUN npm run test:ci --if-present

# ========================================
# PRODUCTION STAGE
# ========================================
FROM node:18-alpine AS production

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S progressive -u 1001

# Set working directory
WORKDIR /app

# Copy production dependencies
COPY --from=base /app/node_modules ./node_modules

# Copy application code
COPY --chown=progressive:nodejs . .

# Create data directories with proper permissions
RUN mkdir -p data/conversations data/budgets data/emergency data/backups && \
    chown -R progressive:nodejs data/

# Create logs directory
RUN mkdir -p logs && chown -R progressive:nodejs logs/

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Security: Don't run as root
USER progressive

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node scripts/health-check.js || exit 1

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]

# ========================================
# LABELS FOR METADATA
# ========================================
LABEL maintainer="Progressive Framework V5 Team"
LABEL version="1.0.0"
LABEL description="Complete AI Agent Orchestration System with Emergency Response"
LABEL org.opencontainers.image.title="Progressive Framework V5"
LABEL org.opencontainers.image.description="Enterprise AI Agent System with MCA, NPA, WPA, BMA and Emergency Response"
LABEL org.opencontainers.image.vendor="Progressive Framework"
LABEL org.opencontainers.image.licenses="MIT"