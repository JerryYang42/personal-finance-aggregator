# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Ensure NODE_ENV is not production during build to install devDependencies
ENV NODE_ENV=development

COPY package*.json ./
# Temporarily disable strict SSL for npm (not recommended for production)
RUN npm config set strict-ssl false && \
    npm install && \
    npm config delete strict-ssl
COPY . .
RUN node_modules/.bin/tsc


# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Use a non-root user for security
USER node
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/index.js"]