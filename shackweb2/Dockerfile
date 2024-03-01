# Dockerfile

# Stage 1: Build
FROM node:alpine as build

WORKDIR /app

COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --silent

# Copy and build the application
COPY . .
RUN yarn build

# Stage 2: Production image
FROM nginx:1.25.3

# Copy built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
