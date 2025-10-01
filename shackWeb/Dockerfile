# Dockerfile

# Stage 1: Build
FROM node:18-alpine as build

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json yarn.lock ./

# Install dependencies with optimizations
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN yarn install --frozen-lockfile --silent --network-timeout 300000 --production=false \
    && yarn cache clean

# Copy source code (this layer will be invalidated when source changes)
COPY . .

# Build the application with optimizations
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV INLINE_RUNTIME_CHUNK=false
RUN yarn build

# Stage 2: Production image
FROM nginx:1.25.3-alpine

# Copy custom nginx config for better performance
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

# Set proper permissions
RUN chown -R nextjs:nodejs /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Use dumb-init for proper signal handling
ENTRYPOINT ["nginx", "-g", "daemon off;"]
