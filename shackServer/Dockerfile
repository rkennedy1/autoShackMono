# Dockerfile

# Stage 1: Build
FROM node:18-alpine as build

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile --silent --network-timeout 300000 \
    && yarn cache clean

# Copy source code (this layer will be invalidated when source changes)
COPY . .

# Build the application
RUN yarn build

# Stage 2: Production
FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodeuser -u 1001

# Copy package files for production install
COPY package.json yarn.lock ./

# Install only production dependencies
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile --silent --production \
    && yarn cache clean

# Copy built application from build stage
COPY --from=build /app/build ./build

# Change ownership to non-root user
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Expose port
EXPOSE 1783

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:1783/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "./build/index.js"]
